import express from 'express';
import db from '../../db.js';

const routerProdutos = express.Router();

routerProdutos.get('/produtos', (req, res) => {
  const { categoria, precoMin, precoMax, isDestaque } = req.query;

  let query = 'SELECT * FROM produtos WHERE 1=1';
  const params = [];

  if (categoria) {
    query += ' AND categoria = ?';
    params.push(categoria);
  }
  if (precoMin) {
    query += ' AND preco >= ?';
    params.push(precoMin);
  }
  if (precoMax) {
    query += ' AND preco <= ?';
    params.push(precoMax);
  }
  if (isDestaque) {
    query += ' AND isDestaque = ?';
    params.push(isDestaque === 'true' ? 1 : 0);
  }

  db.query(query, params, (err, results) => {
    if (err) return res.status(500).json({ erro: 'Erro na base de dados' });
    res.json(results);
  });
});

export default routerProdutos;