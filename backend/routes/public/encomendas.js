import express from 'express';
import db from '../../db.js';

const routerEncomendas = express.Router();

// Criar uma nova encomenda
// routerEncomendas.post('/nova', (req, res) => {
//   const { id_carrinho, rua, cidade, codigo_postal, pais, email, telefone, nif } = req.body;

//   // Verificar carrinho
//   db.query('SELECT * FROM carrinhos WHERE id = ? AND estado = "ativo"', [id_carrinho], (err, results) => {
//     if (err) return res.status(500).json({ success: false, message: 'Erro no servidor' });

//     if (results.length === 0) {
//       return res.status(400).json({ success: false, message: 'Carrinho não encontrado, está vazio ou já foi finalizado.' });
//     }

//     const carrinho = results[0];

//     db.query('SELECT * FROM encomendas WHERE id_carrinho = ?', [id_carrinho], (err, encomendas) => {
//     if (err) return res.status(500).json({ success: false, message: 'Erro no servidor' });

//     if (encomendas.length > 0) {
//       // Encomenda já existe para este carrinho
//       return res.json({ 
//         success: true, 
//         message: 'Encomenda já criada para este carrinho', 
//         id_encomenda: encomendas[0].id 
//       });
//     }

//     // Obter itens do carrinho
//     db.query('SELECT * FROM items_carrinhos WHERE id_carrinho = ?', [id_carrinho], (err, items) => {
//       if (err) return res.status(500).json({ success: false, message: 'Erro ao obter itens do carrinho.' });

//       if (items.length === 0) {
//         return res.status(400).json({ success: false, message: 'Carrinho vazio' });
//       }

//       // Criar encomenda
//       db.query(
//         `INSERT INTO encomendas (id_utilizador, id_carrinho, total, rua, cidade, codigo_postal, pais, email, telefone, nif) 
//          VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
//         [carrinho.id_utilizador, id_carrinho, carrinho.total, rua, cidade, codigo_postal, pais, email, telefone, nif],
//         (err, results) => {
//           if (err) {
//             console.error('Erro na query de criar encomenda:', err);
//             return res.status(500).json({ success: false, message: 'Erro ao criar encomenda' });
//           } 

//           const id_encomenda = results.insertId;

//           // Preparar itens para inserir
//           const itemsEncomenda = items.map(item => [
//             id_encomenda,
//             item.id_produto,
//             item.quantidade,
//             item.preco
//           ]);

//           db.query(
//             'INSERT INTO items_encomendas (id_encomenda, id_produto, quantidade, preco_unitario) VALUES ?',
//             [itemsEncomenda],
//             (err) => {
//               if (err) return res.status(500).json({ success: false, message: 'Erro ao adicionar items à encomenda' });

//               // Marcar carrinho como finalizado
//               // db.query('UPDATE carrinhos SET estado = "finalizado" WHERE id = ?', [id_carrinho], (err) => {
//               //   if (err) return res.status(500).json({ success: false, message: 'Erro ao finalizar o carrinho' });

//               res.json({ success: true, message: 'Encomenda criada com sucesso', id_encomenda });
//               // });
//             }
//           );
//         }
//       );
//     })
//     });
//   });
// });

routerEncomendas.post('/nova', (req, res) => {
  const { id_carrinho, rua, cidade, codigo_postal, pais, email, telefone, nif } = req.body;

  // Validar se o carrinho ainda existe e está ativo
  db.query('SELECT * FROM carrinhos WHERE id = ? AND estado = "ativo"', [id_carrinho], (err, results) => {
    if (err) return res.status(500).json({ success: false, message: 'Erro no servidor' });

    if (results.length === 0) {
      return res.status(400).json({ success: false, message: 'Carrinho não encontrado ou já finalizado.' });
    }

    const carrinho = results[0];

    // 2Obter itens do carrinho
    db.query('SELECT * FROM items_carrinhos WHERE id_carrinho = ?', [id_carrinho], (err, items) => {
      if (err) return res.status(500).json({ success: false, message: 'Erro ao obter itens do carrinho.' });

      if (items.length === 0) {
        return res.status(400).json({ success: false, message: 'Carrinho vazio.' });
      }

      // Verificar se já existe encomenda para este carrinho
      db.query('SELECT * FROM encomendas WHERE id_carrinho = ?', [id_carrinho], (err, encomendaRes) => {
        if (err) return res.status(500).json({ success: false, message: 'Erro ao verificar encomenda.' });

        if (encomendaRes.length > 0) {
          // Encomenda já existe — atualizar encomenda e itens
          const encomendaExistente = encomendaRes[0];
          const id_encomenda = encomendaExistente.id;

          // Atualizar dados da encomenda
          db.query(
            `UPDATE encomendas SET rua=?, cidade=?, codigo_postal=?, pais=?, email=?, telefone=?, nif=?, total=? WHERE id=?`,
            [rua, cidade, codigo_postal, pais, email, telefone, nif, carrinho.total, id_encomenda],
            (err) => {
              if (err) return res.status(500).json({ success: false, message: 'Erro ao atualizar encomenda.' });

              // Apagar os itens antigos
              db.query('DELETE FROM items_encomendas WHERE id_encomenda = ?', [id_encomenda], (err) => {
                if (err) return res.status(500).json({ success: false, message: 'Erro ao apagar itens antigos.' });

                // Inserir novamente os itens atuais
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
                    if (err) return res.status(500).json({ success: false, message: 'Erro ao inserir itens atualizados.' });

                    return res.json({ success: true, message: 'Encomenda atualizada com sucesso!', id_encomenda });
                  }
                );
              });
            }
          );
        } else {
          // Não existe encomenda ainda — criar nova encomenda
          db.query(
            `INSERT INTO encomendas (id_utilizador, id_carrinho, total, rua, cidade, codigo_postal, pais, email, telefone, nif)
             VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
            [carrinho.id_utilizador, id_carrinho, carrinho.total, rua, cidade, codigo_postal, pais, email, telefone, nif],
            (err, results) => {
              if (err) {
                console.error('Erro ao criar encomenda:', err);
                return res.status(500).json({ success: false, message: 'Erro ao criar encomenda.' });
              }

              const id_encomenda = results.insertId;

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
                  if (err) return res.status(500).json({ success: false, message: 'Erro ao adicionar itens à encomenda.' });

                  return res.json({ success: true, message: 'Encomenda criada com sucesso!', id_encomenda });
                }
              );
            }
          );
        }
      });
    });
  });
});

// Listar todas as encomendas
routerEncomendas.get('/tudo', (req, res) => {
  db.query(
    `SELECT 
  encomendas.id AS id_encomenda,
  utilizadores.primeiro_nome,
  utilizadores.ultimo_nome,
  produtos.nome AS nome_produto,
  items_encomendas.quantidade,
  items_encomendas.preco_unitario,
  encomendas.total,
  encomendas.estado,
  encomendas.data
FROM encomendas
JOIN utilizadores ON encomendas.id_utilizador = utilizadores.id
JOIN items_encomendas ON items_encomendas.id_encomenda = encomendas.id
JOIN produtos ON produtos.id = items_encomendas.id_produto
ORDER BY encomendas.data DESC`, 
    (err, results) => {
      if (err) {
        console.error('Erro ao carregar encomendas:', err);
        return res.status(500).json({ success: false, message: 'Erro ao carregar encomendas.' });
      }

      res.json(results);
    }
  )  
})

// Listar pagamentos
routerEncomendas.get('/pagamentos', (req, res) => {
  db.query(
    `SELECT 
      pagamentos.id AS id_pagamento,
      pagamentos.metodo,
      pagamentos.estado,
      pagamentos.referencia,
      pagamentos.data_pagamento,
      pagamentos.nome_cartao,
      pagamentos.cartao_tipo,
      pagamentos.cartao_token,
      encomendas.id AS id_encomenda,
      utilizadores.primeiro_nome,
      utilizadores.ultimo_nome
    FROM pagamentos
    JOIN encomendas ON pagamentos.id_encomenda = encomendas.id
    JOIN utilizadores ON encomendas.id_utilizador = utilizadores.id
    ORDER BY pagamentos.data_pagamento DESC`,
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

  db.query(`
    INSERT INTO pagamentos (id_encomenda, metodo, estado, informacoes_adicionais)
    VALUES (?, ?, 'pendente', ?)
  `, [id_encomenda, metodoPagamento, detalhesPagamento || null], (err, resultado) => {
    if (err) {
      console.error(err);
      return res.status(500).json({ success: false, message: 'Erro ao registar pagamento.' });
    }

    const id_pagamento = resultado.insertId;

    db.query(`UPDATE encomendas SET estado = 'pago' WHERE id = ?`, [id_encomenda], (err) => {
      if (err) {
        console.error(err);
        return res.status(500).json({ success: false, message: 'Erro ao atualizar encomenda.' });
    }
    
    db.query(
      `UPDATE produtos JOIN items_encomendas ON items_encomendas.id_produto = produtos.id
      SET produtos.stock = produtos.stock - items_encomendas.quantidade
      WHERE items_encomendas.id_encomenda = ?`,
      [id_encomenda],
      (err) => {
        if (err) {
          console.error(err);
          return res.status(500).json({ success: false, message: 'Erro ao atualizar produtos.' });
        }

        db.query(
            `UPDATE carrinhos SET estado = 'finalizado'
             WHERE id = (SELECT id_carrinho FROM encomendas WHERE id = ?) AND estado = 'ativo'`,
            [id_encomenda],
            (err) => {
              if (err) {
                console.error(err);
                return res.status(500).json({ success: false, message: 'Erro ao finalizar o carrinho.' });
              }

            db.query(`UPDATE pagamentos SET estado = 'pago' WHERE id = ?`, [id_pagamento], (err) => {
                if (err) {
                  console.error(err);
                  return res.status(500).json({ success: false, message: 'Erro ao atualizar estado do pagamento.' });
                }

                res.json({ success: true, message: 'Pagamento registado e carrinho finalizado com sucesso.' });
              });
            }
          );
          
    });
  });
  });
});

export default routerEncomendas;
