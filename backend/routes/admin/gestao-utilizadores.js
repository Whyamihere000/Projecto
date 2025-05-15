import express from 'express';
import db from '../../db.js';

const routerAdminUtilizadores = express.Router();

routerAdminUtilizadores.get('/buscar', (req, res) => {
    db.query('SELECT * FROM utilizadores', (err, results) => {
        if (err) {
            console.error('Erro ao buscar utilizadores:', err);
            return res.status(500).send({ success: false, message: 'Erro interno do servidor' });
        } else {
            res.json(results);
        }
    });
});

routerAdminUtilizadores.put('/atualizar/:id', (req, res) => {
    console.log('Atualização na tabela utilizadores realizada na data:', new Date());   
    const { primeiro_nome, ultimo_nome, email, password_hash, telefone, tipo_utilizador, data_atualizacao, rua, cidade, codigo_postal, pais } = req.body;
    console.log('Dados Recebidos:', req.body);

    if(!primeiro_nome) return res.status(400).json({ success: false, message: 'O primeiro nome do utilizador é obrigatório.' });
    if(!ultimo_nome) return res.status(400).json({ success: false, message: 'O ultimo nome do utilizador é obrigatório.' });
    if(!email) return res.status(400).json({ success: false, message: 'O email do utilizador é obrigatório.' });
    if(!password_hash) return res.status(400).json({ success: false, message: 'A password do utilizador é obrigatório.' });

    db.query(
        'UPDATE utilizadores SET primeiro_nome = ?, ultimo_nome = ?, email = ?, password_hash = ?, telefone = ?, tipo_utilizador = ?, rua = ?, cidade = ?, codigo_postal = ?, pais = ?, data_atualizacao = NOW() WHERE id = ?',
        [primeiro_nome, ultimo_nome, email, password_hash, telefone, tipo_utilizador, rua, cidade, codigo_postal, pais, req.params.id],
        (err, results) => {
            if (err) {
                console.error(err);
                return res.status(500).send({ success: false, message: 'Erro interno do servidor' });
            }
            return res.status(200).send({ success: true, message: 'Utilizador atualizado com sucesso.',
                utilizador: {
                    id: req.params.id,
                    primeiro_nome: primeiro_nome,
                    ultimo_nome: ultimo_nome,
                    email: email,
                    password_hash: password_hash,                    
                    telefone: telefone,
                    tipo_utilizador: tipo_utilizador,
                    rua: rua,
                    cidade: cidade,
                    codigo_postal: codigo_postal,
                    pais: pais,
                    data_atualizacao: new Date().toISOString().slice(0, 19).replace('T', ' '),
                }
             })
        }
    )
})

routerAdminUtilizadores.get('/eliminar/:id', (req, res) => {
    console.log('Eliminação na tabela utilizadores realizada na data:', new Date());   
    db.query(
        'DELETE FROM utilizadores WHERE id = ?',
        [req.params.id],
        (err, results) => {
            if (err) {
                console.error(err);
                return res.status(500).send({ success: false, message: 'Erro interno do servidor' });
            }
            return res.status(200).send({ success: true, message: 'Utilizador eliminado com sucesso.' });
        }
    )
})

export default routerAdminUtilizadores;

