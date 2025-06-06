import express from 'express';
import db from '../../db.js';
import bcrypt from 'bcrypt';

const routerAdminUtilizadores = express.Router();

routerAdminUtilizadores.get('/buscar', (req, res) => {
    db.query('SELECT * FROM utilizadores', (err, results) => {
        if (err) {
            console.error('Erro ao buscar utilizadores:', err);
            return res.status(500).send({ success: false, message: 'Erro interno do servidor' });
        } else {
            res.json(results);
        }
    });
});

routerAdminUtilizadores.get('/buscar/:id', (req, res) => {
  const userId = req.params.id;
  db.query('SELECT * FROM utilizadores WHERE id = ?', [userId], (err, results) => {
    if (err) {
      console.error('Erro ao buscar utilizador:', err);
      return res.status(500).send({ success: false, message: 'Erro interno do servidor' });
    }
    if (results.length === 0) {
      return res.status(404).send({ success: false, message: 'Utilizador não encontrado' });
    }
    return res.json(results[0]); // devolve só o utilizador
  });
});

routerAdminUtilizadores.put('/atualizar/:id', (req, res) => {
    console.log('Atualização na tabela utilizadores realizada na data:', new Date());   
    const { primeiro_nome, ultimo_nome, email, password_hash, telefone, tipo_utilizador, data_atualizacao, rua, cidade, codigo_postal, pais } = req.body;
    console.log('Dados Recebidos:', req.body);

    if(!primeiro_nome) return res.status(400).json({ success: false, message: 'O primeiro nome do utilizador é obrigatório.' });
    if(!ultimo_nome) return res.status(400).json({ success: false, message: 'O ultimo nome do utilizador é obrigatório.' });
    if(!email) return res.status(400).json({ success: false, message: 'O email do utilizador é obrigatório.' });
    if(!password_hash) return res.status(400).json({ success: false, message: 'A password do utilizador é obrigatório.' });

    db.query(
        'UPDATE utilizadores SET primeiro_nome = ?, ultimo_nome = ?, email = ?, password_hash = ?, telefone = ?, tipo_utilizador = ?, rua = ?, cidade = ?, codigo_postal = ?, pais = ?, data_atualizacao = NOW() WHERE id = ?',
        [primeiro_nome, ultimo_nome, email, password_hash, telefone, tipo_utilizador, rua, cidade, codigo_postal, pais, req.params.id],
        (err, results) => {
            if (err) {
                console.error(err);
                return res.status(500).send({ success: false, message: 'Erro interno do servidor' });
            }
            return res.status(200).send({ success: true, message: 'Utilizador atualizado com sucesso.',
                utilizador: {
                    id: req.params.id,
                    primeiro_nome: primeiro_nome,
                    ultimo_nome: ultimo_nome,
                    email: email,
                    password_hash: password_hash,                    
                    telefone: telefone,
                    tipo_utilizador: tipo_utilizador,
                    rua: rua,
                    cidade: cidade,
                    codigo_postal: codigo_postal,
                    pais: pais,
                    data_atualizacao: new Date().toISOString().slice(0, 19).replace('T', ' '),
                }
             })
        }
    )
})

// routerAdminUtilizadores.delete('/eliminar/:id', (req, res) => {
//     console.log('Eliminação na tabela utilizadores realizada na data:', new Date());   
//     db.query(
//         'DELETE FROM utilizadores WHERE id = ?',
//         [req.params.id],
//         (err, results) => {
//             if (err) {
//                 console.error(err);
//                 return res.status(500).send({ success: false, message: 'Erro interno do servidor' });
//             }
//             return res.status(200).send({ success: true, message: 'Utilizador eliminado com sucesso.' });
//         }
//     )
// })

routerAdminUtilizadores.delete('/eliminar/:id', (req, res) => {
  const id = req.params.id;

  const sqlEliminarItens = `
    DELETE items_carrinhos FROM items_carrinhos
    JOIN carrinhos ON items_carrinhos.id_carrinho = carrinhos.id
    WHERE carrinhos.id_utilizador = ?
  `;

  db.query(sqlEliminarItens, [id], (err) => {
    if (err) {
      console.error('Erro ao eliminar itens dos carrinhos:', err);
      return res.status(500).send({ success: false, message: 'Erro ao eliminar itens dos carrinhos' });
    }

    db.query('DELETE FROM carrinhos WHERE id_utilizador = ?', [id], (err2) => {
      if (err2) {
        console.error('Erro ao eliminar carrinhos:', err2);
        return res.status(500).send({ success: false, message: 'Erro ao eliminar carrinhos' });
      }

      db.query('DELETE FROM utilizadores WHERE id = ?', [id], (err3) => {
        if (err3) {
          console.error('Erro ao eliminar utilizador:', err3);
          return res.status(500).send({ success: false, message: 'Erro ao eliminar utilizador' });
        }

        return res.status(200).send({ success: true, message: 'Utilizador eliminado com sucesso.' });
      });
    });
  });
});

routerAdminUtilizadores.post('/registo', async (req, res) => {
  const { primeiro_nome, ultimo_nome, email, password, telefone, rua, cidade, codigo_postal, pais } = req.body;

  const hashedPassword = await bcrypt.hash(password, 10);

  db.query(
 'INSERT INTO utilizadores (primeiro_nome, ultimo_nome, email, password_hash, telefone, data_registo, tipo_utilizador, rua, cidade, codigo_postal, pais) VALUES (?, ?, ?, ?, ?, NOW(), "admin", ?, ?, ?, ?)',
 [primeiro_nome, ultimo_nome, email, hashedPassword, telefone, rua, cidade, codigo_postal, pais],
 (err, results) => {
   if (err) {
     console.error('Erro ao registar utilizador:', err);
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
          message: 'Registo registado com sucesso.',
          user: user
        });
      });
    }
  );
});

export default routerAdminUtilizadores;