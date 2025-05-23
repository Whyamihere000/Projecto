import express from 'express';
import db from '../../db.js';

const routerFavoritos = express.Router();

// Verificar se um produto está nos favoritos do utilizador
routerFavoritos.get('/verificar/:id_utilizador/:id_produto', (req, res) => {
  const { id_utilizador, id_produto } = req.params;

  db.query(
    'SELECT * FROM favoritos WHERE id_utilizador = ? AND id_produto = ?',
    [id_utilizador, id_produto],
    (err, results) => {
      if (err) return res.status(500).json({ error: 'Erro ao verificar favorito' });
      res.json({ favorito: results.length > 0 });
    }
  );
});

// Adicionar favorito
routerFavoritos.post('/adicionar', (req, res) => {
  const { id_utilizador, id_produto } = req.body;

  db.query(
    'INSERT IGNORE INTO favoritos (id_utilizador, id_produto) VALUES (?, ?)',
    [id_utilizador, id_produto],
    (err) => {
      if (err) return res.status(500).json({ error: 'Erro ao adicionar favorito' });
      res.json({ success: true, message: 'Produto adicionado aos favoritos' });
    }
  );
});

// Remover favorito
routerFavoritos.delete('/remover', (req, res) => {
  const { id_utilizador, id_produto } = req.body;

  db.query(
    'DELETE FROM favoritos WHERE id_utilizador = ? AND id_produto = ?',
    [id_utilizador, id_produto],
    (err) => {
      if (err) return res.status(500).json({ error: 'Erro ao remover favorito' });
      res.json({ success: true, message: 'Produto removido dos favoritos' });
    }
  );
});

// Listar favoritos do utilizador
routerFavoritos.get('/:id_utilizador', (req, res) => {
  const { id_utilizador } = req.params;

  db.query(
    `SELECT produtos.* FROM favoritos 
     JOIN produtos ON favoritos.id_produto = produtos.id 
     WHERE favoritos.id_utilizador = ?`,
    [id_utilizador],
    (err, results) => {
      if (err) return res.status(500).json({ error: 'Erro ao carregar favoritos' });
      res.json(results);
    }
  );
});

export default routerFavoritos;

routerFavoritos.get('/teste', (req, res) => {
  res.json({ mensagem: "rota favoritos a funcionar" });
});