import express from 'express';
import db from '../../db.js';
import bcrypt from 'bcrypt';

const router = express.Router();

// LOGIN
router.post('/login', (req, res) => {
    const { email, password } = req.body;

    db.query('SELECT * FROM utilizadores WHERE email = ?', [email], async (err, results) => {
        if (err) {
            console.error(err);
            return res.status(500).send({ success: false, message: 'Erro interno do servidor' });
        }

        if (results.length === 0) {
            return res.status(401).send({ success: false, message: 'Email ou password incorretos' });
        }

        const user = results[0];
        const passwordMatch = await bcrypt.compare(password, user.password_hash);
        console.log('Password fornecida:', password);
        console.log('Hash da base de dados:', user.password_hash);


        if (!passwordMatch) {
            return res.status(401).send({ success: false, message: 'Email ou password incorretos' });
        }

        res.status(200).send({ success: true, user });
    });
});

// REGISTO
router.post('/registo', async (req, res) => {
  const { primeiro_nome, ultimo_nome, email, password } = req.body;

  const hashedPassword = await bcrypt.hash(password, 10);

  db.query(
    'INSERT INTO utilizadores (primeiro_nome, ultimo_nome, email, password_hash) VALUES (?, ?, ?, ?)',
    [primeiro_nome, ultimo_nome, email, hashedPassword],
    (err, results) => {
      if (err) {
        console.error(err);
        return res.status(500).send({ success: false, message: 'Erro interno do servidor' });
      }

      const userId = results.insertId;

      // Buscar o utilizador recém-criado
      db.query('SELECT id, primeiro_nome, ultimo_nome, email, tipo_utilizador FROM utilizadores WHERE id = ?', [userId], (err, rows) => {
        if (err) {
          console.error(err);
          return res.status(500).send({ success: false, message: 'Erro ao buscar utilizador' });
        }

        const user = rows[0];

        return res.status(201).send({
          success: true,
          message: 'Utilizador registado com sucesso.',
          user: user
        });
      });
    }
  );
});

export default router;