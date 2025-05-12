import express from 'express';
import db from '../../db.js';

const routerAdminMarcas = express.Router();

routerAdminMarcas.post('/nova', (req, res) => {
    console.log('Marca POST /nova foi chamada');
    const { nome } = req.body;
    if (!nome) return res.status(400).json({ success: false, message: 'O nome da categoria é obrigatório.' });  

    db.query('INSERT INTO marcas (nome) VALUES (?)', [nome], (err, results) => {
        if (err) {
            console.error(err);
            return res.status(500).send({ success: false, message: 'Erro interno do servidor' });
        }
        return res.status(201).send({ success: true, message: 'Categoria adicionada com sucesso.' });
    })
})

routerAdminMarcas.get('/buscar', (req, res) => {
    db.query('SELECT * FROM marcas', (err, results) => {
        if (err) return res.status(500).json({ success: false, message: 'Erro no servidor' });
        res.json(results);
    });
});

export default routerAdminMarcas;   