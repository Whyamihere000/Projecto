import express from 'express';
import db from '../../db.js';
import multer from 'multer';
import path from 'path';
import { fileURLToPath } from 'url';
import { dirname } from 'path';
import fs from 'fs';

const routerAdminProdutos = express.Router();
const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

//Configuração Multer
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    const uploadPath = path.resolve(__dirname, '../../uploads/produtos');
    if (!fs.existsSync(uploadPath)) fs.mkdirSync(uploadPath, { recursive: true });
    cb(null, uploadPath);
  },
  filename: (req, file, cb) => {
    const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1e9);
    cb(null, uniqueSuffix + path.extname(file.originalname));
  }
})

const upload = multer({ storage });

// Cria um novo produto
routerAdminProdutos.post('/nova', upload.single('imagem'), (req, res) => {
  console.log('Produto POST /nova foi chamada');
  const { sku, nome, descricao, preco, stock, id_categoria, id_marca, tipo_produto, especificacoes } = req.body;
  const imagem_url = req.file ? `/uploads/produtos/${req.file.filename}` : null;

  const especificacoesFinal = especificacoes.trim() === '' ? null : especificacoes;

  if (!sku) return res.status(400).json({ success: false, message: 'O sku do produto é obrigatório.' });
  if (!nome) return res.status(400).json({ success: false, message: 'O nome do produto é obrigatório.' });
  if (!preco) return res.status(400).json({ success: false, message: 'O preço do produto é obrigatório.' });
  if (!stock) return res.status(400).json({ success: false, message: 'O stock do produto é obrigatório.' });
  

  db.query('INSERT INTO produtos (sku, nome, descricao, preco, stock, id_categoria, id_marca, imagem_url, tipo_produto, especificacoes) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)', 
  [sku, nome, descricao || null, preco, stock, id_categoria, id_marca, imagem_url || null, tipo_produto || null, especificacoesFinal], (err, results) => {
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
  const { sku, nome, descricao, preco, stock, id_categoria, id_marca, tipo_produto, especificacoes } = req.body;
  const imagem_url = req.file ? `/uploads/produtos/${req.file.filename}` : req.body.imagem_url;

  console.log("Dados Recebidos:", req.body);

  if (!sku) return res.status(400).json({ success: false, message: 'O sku do produto é obrigatório.' });
  if (!nome) return res.status(400).json({ success: false, message: 'O nome do produto é obrigatório.' });
  if (!preco) return res.status(400).json({ success: false, message: 'O preço do produto é obrigatório.' });
  if (!stock) return res.status(400).json({ success: false, message: 'O stock do produto é obrigatório.' });

  const especificacoesFinal = especificacoes ? JSON.parse(especificacoes) : null;

  db.query('UPDATE produtos SET sku = ?, nome = ?, descricao = ?, preco = ?, stock = ?, id_categoria = ?, id_marca = ?, imagem_url = ?, tipo_produto = ?, especificacoes = ? WHERE id = ?', 
  [sku, nome, descricao, preco, stock, id_categoria, id_marca, imagem_url, tipo_produto, JSON.stringify(especificacoesFinal), req.params.id], (err, results) => {
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