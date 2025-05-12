import express from 'express';
import db from '../../db.js';

const routerAdminProdutos = express.Router();

// Cria um novo produto
routerAdminProdutos.post('/nova', (req, res) => {
  console.log('Produto POST /nova foi chamada');
  const { sku, nome, descricao, preco, stock, id_categoria, id_marca, imagem_url, especificacoes } = req.body;

  const especificacoesFinal = especificacoes.trim() === '' ? null : especificacoes;

  if (!sku) return res.status(400).json({ success: false, message: 'O sku do produto é obrigatório.' });
  if (!nome) return res.status(400).json({ success: false, message: 'O nome do produto é obrigatório.' });
  if (!preco) return res.status(400).json({ success: false, message: 'O preço do produto é obrigatório.' });
  if (!stock) return res.status(400).json({ success: false, message: 'O stock do produto é obrigatório.' });
  

  db.query('INSERT INTO produtos (sku, nome, descricao, preco, stock, id_categoria, id_marca, imagem_url, especificacoes) VALUES (?, ?, ?, ?, ?, ?, ?, ?)', 
  [sku, nome, descricao, preco, stock, id_categoria, id_marca, imagem_url, especificacoesFinal], (err, results) => {
    if (err) {
      console.error(err);
      return res.status(500).send({ success: false, message: 'Erro interno do servidor' });
    }
    return res.status(201).send({ success: true, message: 'Produto adicionado com sucesso.' });
  })
});

// Atualiza um produto
routerAdminProdutos.put('/atualizar/:id', (req, res) => {
  console.log('Produto PUT /atualizar foi chamada');
  const { sku, nome, descricao, preco, stock, id_categoria, id_marca, imagem_url, especificacoes } = req.body;

  console.log("Dados Recebidos:", req.body);

  if (!sku) return res.status(400).json({ success: false, message: 'O sku do produto é obrigatório.' });
  if (!nome) return res.status(400).json({ success: false, message: 'O nome do produto é obrigatório.' });
  if (!preco) return res.status(400).json({ success: false, message: 'O preço do produto é obrigatório.' });
  if (!stock) return res.status(400).json({ success: false, message: 'O stock do produto é obrigatório.' });

  db.query('UPDATE produtos SET sku = ?, nome = ?, descricao = ?, preco = ?, stock = ?, id_categoria = ?, id_marca = ?, imagem_url = ?, especificacoes = ? WHERE id = ?', 
  [sku, nome, descricao, preco, stock, id_categoria, id_marca, imagem_url, especificacoes, req.params.id], (err, results) => {
    if (err) {
      console.error(err);
      return res.status(500).send({ success: false, message: 'Erro interno do servidor' });
    }
    return res.status(200).send({ success: true, message: 'Produto atualizado com sucesso.',
      produto: {
        id: req.params.id,
        sku: sku,
        nome: nome,
        descricao: descricao,
        preco: preco,
        stock: stock,
        id_categoria: id_categoria,
        id_marca: id_marca,
        imagem_url: imagem_url,
        especificacoes: especificacoes
      }
    });
  })
});

// Elimina um produto
routerAdminProdutos.delete('/eliminar/:id', (req, res) => {
  console.log('Produto DELETE /eliminar foi chamada');

  const produtoID = req.params.id;

  db.query('DELETE FROM produtos WHERE id = ?', [produtoID], (err, results) => {
    if (err) {
      console.error(err);
      return res.status(500).send({ success: false, message: 'Erro interno do servidor' });
    }

    db.query(`
      SET @num := 0;
      UPDATE produtos SET id = @num := (@num + 1);
    `, (err) => {
      if (err) {
        console.error(err);
        return res.status(500).send({ success: false, message: 'Erro interno do servidor' });
      }

      db.query('SELECT MAX(id) AS max_id FROM produtos', (err, results) => {
        if (err) {
          console.error(err);
          return res.status(500).send({ success: false, message: 'Erro interno do servidor' });
        }

        const maxID = results[0].max_id || 0;
        db.query(`ALTER TABLE produtos AUTO_INCREMENT = ${maxID + 1}`, (err) => {
          if (err) {
            console.error(err);
            return res.status(500).send({ success: false, message: 'Erro interno do servidor' });
          }
          
          console.log('Produto eliminado com sucesso');
          return res.status(200).send({ success: true, message: 'Produto eliminado com sucesso.' });
        });
      });
    });
  });
});

routerAdminProdutos.get('/buscar', (req, res) => {
  db.query('SELECT * FROM produtos', (err, results) => {
    if (err) return res.status(500).json({ success: false, message: 'Erro no servidor' });
    res.json(results);
  });
});

export default routerAdminProdutos;