import express from 'express';
import db from '../../db.js';

const routerCarrinho = express.Router();

// Cria ou obtém carrinho do utilizador
routerCarrinho.get('/:id_utilizador', (req, res) => {
    const { id_utilizador } = req.params;

    db.query('SELECT * FROM carrinhos WHERE id_utilizador = ? AND estado = "ativo" LIMIT 1', [id_utilizador], (err, results) => {
        if (err) return res.status(500).json({ success: false, message: 'Erro no servidor' });

        if (results.length > 0) {
            const carrinho = results[0];

            db.query(
                'SELECT items_carrinhos.*, produtos.nome FROM items_carrinhos JOIN produtos ON items_carrinhos.id_produto = produtos.id WHERE items_carrinhos.id_carrinho = ?',
                [carrinho.id],
                (err, items) => {
                    if (err) return res.status(500).json({ success: false, message: 'Erro ao carregar items do carrinho' });

                    carrinho.items = items || [];
                    carrinho.total = carrinho.items.reduce((acc, item) => acc + item.quantidade * item.preco, 0);

                    db.query(
                        'UPDATE carrinhos SET total = ? WHERE id = ?',
                        [carrinho.total, carrinho.id],
                        (err) => {
                            if (err) return res.status(500).json({ success: false, message: 'Erro ao atualizar o carrinho' });

                            res.json(carrinho);
                        }
                    );
                }
            );
        } else {
            db.query('INSERT INTO carrinhos (id_utilizador, estado) VALUES (?, "ativo")', [id_utilizador], (err, result) => {
                if (err) return res.status(500).json({ success: false, message: 'Erro no servidor' });

                res.json({ id: result.insertId, id_utilizador, total: 0, items: [] });
            });
        }
    });
});

// Adiciona items ao carrinho
routerCarrinho.post('/adicionar', (req, res) => {
    const { id_carrinho, id_produto, quantidade, preco } = req.body;

    db.query(
        'SELECT * FROM items_carrinhos WHERE id_carrinho = ? AND id_produto = ?',
        [id_carrinho, id_produto],
        (err, results) => {
            if (err) return res.status(500).json({ success: false, message: 'Erro no servidor' });

            const atualizarTotal = () => {
                db.query(
                    'SELECT SUM(quantidade * preco) AS total FROM items_carrinhos WHERE id_carrinho = ?',
                    [id_carrinho],
                    (err, results) => {
                        if (err) return res.status(500).json({ success: false, message: 'Erro ao atualizar o carrinho' });

                        const total = results[0].total || 0;
                        db.query(
                            'UPDATE carrinhos SET total = ? WHERE id = ?',
                            [total, id_carrinho],
                            (err) => {
                                if (err) return res.status(500).json({ success: false, message: 'Erro ao atualizar o carrinho' });
                            }
                        );
                    }
                );
            };

            if (results.length > 0) {
                db.query(
                    'UPDATE items_carrinhos SET quantidade = quantidade + ? WHERE id_carrinho = ? AND id_produto = ?',
                    [quantidade, id_carrinho, id_produto],
                    (err) => {
                        if (err) return res.status(500).json({ success: false, message: 'Erro ao atualizar o produto' });

                        atualizarTotal();
                        res.json({ success: true, message: 'Produto atualizado no carrinho' });
                    }
                );
            } else {
                db.query(
                    'INSERT INTO items_carrinhos (id_carrinho, id_produto, quantidade, preco) VALUES (?, ?, ?, ?)',
                    [id_carrinho, id_produto, quantidade, preco],
                    (err) => {
                        if (err) return res.status(500).json({ success: false, message: 'Erro ao adicionar o produto ao carrinho' });

                        atualizarTotal();
                        res.json({ success: true, message: 'Produto adicionado ao carrinho' });
                    }
                );
            }
        }
    );
});

// Remove item do carrinho
routerCarrinho.post('/remover', (req, res) => {
    const { id_carrinho, id_produto } = req.body;
    console.log("Dados recebidos para remover:", { id_carrinho, id_produto });

    db.query(
        'DELETE FROM items_carrinhos WHERE id_carrinho = ? AND id_produto = ?',
        [id_carrinho, id_produto],
        (err) => {
            if (err) return res.status(500).json({ success: false, message: 'Erro ao remover o produto do carrinho' });

            db.query(
                'SELECT SUM(quantidade * preco) AS total FROM items_carrinhos WHERE id_carrinho = ?',
                [id_carrinho],
                (err, results) => {
                    if (err) return res.status(500).json({ success: false, message: 'Erro ao atualizar o carrinho' });

                    const total = results[0].total || 0;
                    db.query(
                        'UPDATE carrinhos SET total = ? WHERE id = ?',
                        [total, id_carrinho],
                        (err) => {
                            if (err) return res.status(500).json({ success: false, message: 'Erro ao atualizar o carrinho' });

                            res.json({ success: true, message: 'Produto removido do carrinho' });
                        }
                    );
                }
            );
        }
    );
});

// Finaliza compra
routerCarrinho.post('/finalizar', (req, res) => {
    const { id_carrinho } = req.body;

    db.query(
        'SELECT * FROM items_carrinhos WHERE id_carrinho = ?',
        [id_carrinho],
        (err, results) => {
            if (err) return res.status(500).json({ success: false, message: 'Erro no servidor' });

            if (results.length === 0) {
                return res.status(400).json({ success: false, message: 'Carrinho vazio' });
            }

            const total = results.reduce((acc, item) => acc + item.quantidade * item.preco, 0);
            db.query(
                'UPDATE carrinhos SET total = ?, estado = "finalizado" WHERE id = ?',
                [total, id_carrinho],
                (err) => {
                    if (err) return res.status(500).json({ success: false, message: 'Erro ao finalizar a compra' });

                    res.json({ success: true, message: 'Carrinho finalizado' });
                }
            );
        }
    );
});

export default routerCarrinho;
