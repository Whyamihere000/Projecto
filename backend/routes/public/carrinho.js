import express from 'express';
import db from '../../db.js';

const routerCarrinho = express.Router();

routerCarrinho.get('/:id_utilizador', (req, res) => {
    const { id_utilizador } = req.params;

    db.query('SELECT * FROM carrinhos WHERE id_utilizador = ?', [id_utilizador], (err, results) => {
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
                        }
                    );

                    res.json(carrinho);
                }
            );
        } else {
            db.query('INSERT INTO carrinhos (id_utilizador) VALUES (?)', [id_utilizador], (err, results) => {
                if (err) return res.status(500).json({ success: false, message: 'Erro no servidor' });
                res.json({id: results.insertId, id_utilizador, total: 0, items: []});
            })
        }
    });
});

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
                )
            }

            if (results.length > 0) {
                db.query(
                    'UPDATE items_carrinhos SET quantidade = quantidade + ? WHERE id_carrinho = ? AND id_produto = ?',
                    [quantidade, id_carrinho, id_produto],
                    (err) => {
                        if (err) return res.status(500).json({ success: false, message: 'Erro ao atualizar o produto' });
                        res.json({ success: true, message: 'Produto atualizado ao carrinho' });
                        atualizarTotal();
                    }
                );
            } else {
                db.query(
                    'INSERT INTO items_carrinhos (id_carrinho, id_produto, quantidade, preco) VALUES (?, ?, ?, ?)',
                    [id_carrinho, id_produto, quantidade, preco],
                    (err) => {
                        if (err) return res.status(500).json({ success: false, message: 'Erro ao adicionar o produto ao carrinho' });
                        res.json({ success: true, message: 'Produto adicionado ao carrinho' });
                        atualizarTotal();
                    }
                )
            }
        }
    )
})

routerCarrinho.post('/remover', (req, res) => {
    const { id_carrinho, id_produto } = req.body;
    console.log("Dados recebidos para remover:", { id_carrinho, id_produto });

    db.query(
        'DELETE FROM items_carrinhos WHERE id_carrinho = ? AND id_produto = ?',
        [id_carrinho, id_produto],
        (err, results) => {
            if (err) {
                console.error("Erro ao remover produto:", err);
                return res.status(500).json({ success: false, message: 'Erro ao remover o produto do carrinho' });
            }

            db.query(
                'SELECT SUM(quantidade * preco) AS total FROM items_carrinhos WHERE id_carrinho = ?',
                [id_carrinho],
                (err, results) => {
                    if (err) {
                        console.error("Erro ao atualizar o carrinho:", err);
                        return res.status(500).json({ success: false, message: 'Erro ao atualizar o carrinho' });
                    }
                    const total = results[0].total || 0;
                    db.query(
                        'UPDATE carrinhos SET total = ? WHERE id = ?',
                        [total, id_carrinho],
                        (err) => {
                            if (err) {
                                console.error("Erro ao atualizar o carrinho:", err);
                                return res.status(500).json({ success: false, message: 'Erro ao atualizar o carrinho' });
                            }
                            res.json({ success: true, message: 'Produto removido do carrinho' });
                        }
                    );
                }
            );
        }
    )
})

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

            const total = results.reduce((acc, item) => acc + (item.quantidade * item.preco), 0);
            db.query(
                'UPDATE carrinhos SET total = ? WHERE id = ?',
                [total, id_carrinho],
                (err) => {
                    if (err) return res.status(500).json({ success: false, message: 'Erro ao finalizar a compra' });
                    res.json({ success: true, message: 'Carrinho finalizado' });
                }
            )
        }
    )
})

routerCarrinho.post('/eliminar', (req, res) => {
    const { id_utilizador } = req.body;

    db.query('SELECT id FROM carrinhos WHERE id_utilizador = ?', [id_utilizador], (err, results) => {
        if (err) return res.status(500).json({ success: false, message: 'Erro no servidor' });

        if (results.length > 0) {
            const carrinhoId = results[0].id;

            db.query('DELETE FROM items_carrinhos WHERE id_carrinho = ?', [carrinhoId], (err) => {
                if (err) return res.status(500).json({ success: false, message: 'Erro ao eliminar itens do carrinho' });

                db.query('DELETE FROM carrinhos WHERE id = ?', [carrinhoId], (err) => {
                    if (err) return res.status(500).json({ success: false, message: 'Erro ao eliminar o carrinho' });
                    res.json({ success: true, message: 'Carrinho e itens eliminados com sucesso' });
                });
            });
        } else {
            res.status(404).json({ success: false, message: 'Carrinho não encontrado' });
        }
    });
});

export default routerCarrinho;