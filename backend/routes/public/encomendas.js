import express from 'express';
import db from '../../db.js';

const routerEncomendas = express.Router();

// Criar uma nova encomenda
routerEncomendas.post('/nova', (req, res) => {
    const {id_carrinho, morada} = req.body;

    db.query('SELECT * FROM carrinhos WHERE id = ? AND estado = "ativo"', [id_carrinho], (err, results) => {
        if (err) return res.status(500).json({ success: false, message: 'Erro no servidor' });

        if (results.length === 0) {
            return res.status(400).json({ success: false, message: 'Carrinho não encontrado ou já finalizado' });
        }
        
        const carrinho = results[0];

        db.query('SELECT * FROM items_carrinhos WHERE id_carrinho = ?', [id_carrinho], (err, items) => {
            if (err) return res.status(500).json({ success: false, message: 'Erro ao obter itens do carrinho.' });

            if (items.length === 0) {
                return res.status(400).json({ success: false, message: 'Carrinho vazio' });
            }

            db.query(
                'INSERT INTO encomendas (id_utilizador, total, morada) VALUES (?, ?, ?)',
                [carrinho.id_utilizador, carrinho.total, morada],
                (err, results) => {
                    if (err) return res.status(500).json({ success: false, message: 'Erro ao criar encomenda' });

                    const id_encomenda = results.insertId;

                    const itemsEncomenda = items.map (item => [
                        id_encomenda,
                        item.id_produto,
                        item.quantidade,
                        item.preco
                    ])

                    db.query(
                        'INSERT INTO items_encomendas (id_encomenda, id_produto, quantidade, preco_unitario) VALUES ?',
                        [itemsEncomenda],
                        (err) => {
                            if (err) return res.status(500).json({ success: false, message: 'Erro ao adicionar items à encomenda' });

                            db.query('UPDATE carrinhos SET estado = "finalizado" WHERE id = ?', [id_carrinho])

                            res.json({ success: true, message: 'Encomenda criada com sucesso', id_encomenda });
                        }
                    )
                }
            )
        })
    })
})

export default routerEncomendas