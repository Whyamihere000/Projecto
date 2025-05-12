import express from 'express';
import db from '../../db.js';

const routerAdminUtilizadores = express.Router();

routerAdminUtilizadores.get('/buscar', (req, res) => {
    db.query('SELECT * FROM utilizadores', (err, results) => {
        if (err) {
            console.error('Erro ao buscar utilizadores:', err);
            return res.status(500).send({ success: false, message: 'Erro interno do servidor' });
        } else {
            console.log('Utilizadores encontrados:', results);
            res.json(results);
        }
    });
});

export default routerAdminUtilizadores;

