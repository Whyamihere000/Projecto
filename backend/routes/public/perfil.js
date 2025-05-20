import express from 'express';
import db from '../../db.js';
import bcrypt from 'bcrypt';

const routerPerfil = express.Router();

// Informações do Cliente
routerPerfil.get('/buscar/:id', (req, res) => {
  const { id } = req.params; // Usar "id" diretamente

  const sql = `
    SELECT 
      CONCAT(primeiro_nome, ' ', ultimo_nome) AS nome,
      email, 
      telefone, 
      rua, 
      cidade, 
      codigo_postal, 
      pais 
    FROM utilizadores 
    WHERE id = ?;
  `;

  db.query(sql, [id], (err, results) => {
    if (err) {
      console.error(err);
      return res.status(500).json({ success: false, message: 'Erro no servidor' });
    }

    console.log("Resultados da consulta (Buscar Utilizador):", results);

    if (results.length > 0) {
      res.json(results[0]); // Envia o utilizador como objeto
    } else {
      res.status(404).json({ success: false, message: 'Utilizador não encontrado' });
    }
  });
});

// Atualizar Informações do Cliente
routerPerfil.put('/atualizar/:id', (req, res) => {
  const { id } = req.params; // Usar "id" diretamente
  const { nome, email, telefone, rua, cidade, codigo_postal, pais } = req.body;

  const [primeiro_nome, ...resto] = nome.split(' ');
  const ultimo_nome = resto.join(' ');

  const sql = `
    UPDATE utilizadores 
    SET primeiro_nome = ?, ultimo_nome = ?, email = ?, telefone = ?, 
        rua = ?, cidade = ?, codigo_postal = ?, pais = ?
    WHERE id = ?;
  `;

  db.query(
    sql,
    [primeiro_nome, ultimo_nome, email, telefone, rua, cidade, codigo_postal, pais, id],
    (err, results) => {
      if (err) {
        console.error(err);
        return res.status(500).json({ success: false, message: 'Erro no servidor' });
      }
      res.json({ success: true, message: 'Informações atualizadas com sucesso' });
    }
  );
});

// Encomendas do Cliente
routerPerfil.get('/encomendas/:id', (req, res) => {
  const { id } = req.params; // Usar "id" diretamente
  console.log("ID Utilizador recebido:", id);

  const sql = `
    SELECT 
      e.id,
      e.data,
      e.total,
      GROUP_CONCAT(p.nome SEPARATOR ', ') AS produtos
    FROM encomendas e
    JOIN items_encomendas ie ON e.id = ie.id_encomenda
    JOIN produtos p ON ie.id_produto = p.id
    WHERE e.id_utilizador = ?
    GROUP BY e.id, e.data, e.total;
  `;

  db.query(sql, [id], (err, results) => {
    if (err) {
      console.error(err);
      return res.status(500).json({ success: false, message: 'Erro no servidor' });
    }

    console.log("Encomendas encontradas:", results);

    res.json(results);
  });
});

routerPerfil.put('/atualizar-password/:id', (req, res) => {
  const { id } = req.params;
  const { passwordAtual, novaPassword } = req.body;

  const buscarUtilizador = `SELECT password FROM utilizadores WHERE id = ?`;

  db.query(buscarUtilizador, [id], async (err, results) => {
    if (err) {
      console.error(err);
      return res.status(500).json({ success: false, message: 'Erro no servidor.' });
    }

    if (results.length === 0) {
      return res.status(404).json({ success: false, message: 'Utilizador não encontrado.' });
    }

    const passwordGuardada = results[0].password;

    const corresponde = await bcrypt.compare(passwordAtual, passwordGuardada);
    if (!corresponde) {
      return res.status(401).json({ success: false, message: 'Palavra-passe atual incorreta.' });
    }

    const novaPasswordHash = await bcrypt.hash(novaPassword, 10);

    const atualizarSql = `UPDATE utilizadores SET password = ? WHERE id = ?`;

    db.query(atualizarSql, [novaPasswordHash, id], (err, results) => {
      if (err) {
        console.error(err);
        return res.status(500).json({ success: false, message: 'Erro ao atualizar a palavra-passe.' });
      }

      return res.json({ success: true, message: 'Palavra-passe atualizada com sucesso.', messageType: 'success' });
    });
  });
});

export default routerPerfil
