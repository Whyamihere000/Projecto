import express from 'express';
import db from '../../db.js';

const routerEncomendas = express.Router();

// Criar uma nova encomenda
routerEncomendas.post('/nova', (req, res) => {
  const {
    id_carrinho,
    rua,
    cidade,
    codigo_postal,
    pais,
    email,
    telefone,
    nif
  } = req.body;

  // Verificar carrinho
  db.query('SELECT * FROM carrinhos WHERE id = ? AND estado = "ativo"', [id_carrinho], (err, results) => {
    if (err) return res.status(500).json({ success: false, message: 'Erro no servidor' });

    if (results.length === 0) {
      return res.status(400).json({ success: false, message: 'Carrinho não encontrado, está vazio ou já foi finalizado.' });
    }

    const carrinho = results[0];

    // Obter itens do carrinho
    db.query('SELECT * FROM items_carrinhos WHERE id_carrinho = ?', [id_carrinho], (err, items) => {
      if (err) return res.status(500).json({ success: false, message: 'Erro ao obter itens do carrinho.' });

      if (items.length === 0) {
        return res.status(400).json({ success: false, message: 'Carrinho vazio' });
      }

      // Criar encomenda
      db.query(
        `INSERT INTO encomendas (id_utilizador, id_carrinho, total, rua, cidade, codigo_postal, pais, email, telefone, nif) 
         VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
        [carrinho.id_utilizador, id_carrinho, carrinho.total, rua, cidade, codigo_postal, pais, email, telefone, nif],
        (err, results) => {
          if (err) {
            console.error('Erro na query de criar encomenda:', err);
            return res.status(500).json({ success: false, message: 'Erro ao criar encomenda' });
          } 

          const id_encomenda = results.insertId;

          // Preparar itens para inserir
          const itemsEncomenda = items.map(item => [
            id_encomenda,
            item.id_produto,
            item.quantidade,
            item.preco
          ]);

          db.query(
            'INSERT INTO items_encomendas (id_encomenda, id_produto, quantidade, preco_unitario) VALUES ?',
            [itemsEncomenda],
            (err) => {
              if (err) return res.status(500).json({ success: false, message: 'Erro ao adicionar items à encomenda' });

              // Marcar carrinho como finalizado
              db.query('UPDATE carrinhos SET estado = "finalizado" WHERE id = ?', [id_carrinho], (err) => {
                if (err) return res.status(500).json({ success: false, message: 'Erro ao finalizar o carrinho' });

                res.json({ success: true, message: 'Encomenda criada com sucesso', id_encomenda });
              });
            }
          );
        }
      );
    });
  });
});

// Listar todas as encomendas
routerEncomendas.get('/tudo', (req, res) => {
  db.query(
    `SELECT 
  e.id AS id_encomenda,
  u.primeiro_nome,
  u.ultimo_nome,
  p.nome AS nome_produto,
  ie.quantidade,
  ie.preco_unitario,
  e.total,
  e.estado,
  e.data
FROM encomendas e
JOIN utilizadores u ON e.id_utilizador = u.id
JOIN items_encomendas ie ON ie.id_encomenda = e.id
JOIN produtos p ON p.id = ie.id_produto
ORDER BY e.data DESC`, 
    (err, results) => {
      if (err) return res.status(500).json({ success: false, message: 'Erro ao carregar encomendas.' });

      res.json(results);
    }
  )  
})

// Listar pagamentos
routerEncomendas.get('/pagamentos', (req, res) => {
  db.query(
    `SELECT 
      p.id AS id_pagamento,
      p.metodo,
      p.estado,
      p.referencia,
      p.data_pagamento,
      p.nome_cartao,
      p.cartao_tipo,
      p.cartao_token,
      e.id AS id_encomenda,
      u.primeiro_nome,
      u.ultimo_nome
    FROM pagamentos p
    JOIN encomendas e ON p.id_encomenda = e.id
    JOIN utilizadores u ON e.id_utilizador = u.id
    ORDER BY p.data_pagamento DESC`,
    (err, results) => {
      if (err) return res.status(500).json({ message: 'Erro ao carregar pagamentos.' });
      res.json(results);
    }
  );
});

// Listar encomendas de um utilizador
routerEncomendas.get('/:id_utilizador', (req, res) => {
  const { id_utilizador } = req.params;

  db.query('SELECT * FROM encomendas WHERE id_utilizador = ?', [id_utilizador], (err, results) => {
    if (err) return res.status(500).json({ success: false, message: 'Erro ao carregar encomendas.' });

    res.json(results);
  });
});

// Obter uma encomenda pelo ID
routerEncomendas.get('/detalhes/:id_encomenda', (req, res) => {
  const { id_encomenda } = req.params;

  db.query('SELECT * FROM encomendas WHERE id = ?', [id_encomenda], (err, results) => {
    if (err) return res.status(500).json({ success: false, message: 'Erro ao carregar encomenda.' });

    if (results.length === 0) {
      return res.status(404).json({ success: false, message: 'Encomenda não encontrada.' });
    }

    res.json(results[0]);
  });
});

// Pagar uma encomenda
routerEncomendas.post('/pagar/:id_encomenda', (req, res) => {
  const { id_encomenda } = req.params;
  const { metodoPagamento, detalhesPagamento } = req.body;

  if (!metodoPagamento) {
    return res.status(400).json({ success: false, message: 'Método de pagamento obrigatório.' });
  }

  // Inserir pagamento
  const query = `
    INSERT INTO pagamentos (id_encomenda, metodo, estado, informacoes_adicionais)
    VALUES (?, ?, 'pendente', ?)
  `;

  db.query(query, [id_encomenda, metodoPagamento, detalhesPagamento || null], (err) => {
    if (err) {
      console.error(err);
      return res.status(500).json({ success: false, message: 'Erro ao registar pagamento.' });
    }

      res.json({ success: true, message: 'Pagamento registado com sucesso.' });
    });
  });

export default routerEncomendas;
