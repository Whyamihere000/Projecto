import express from 'express';
import db from '../../db.js';

const routerContactos = express.Router();

// Criar contacto
routerContactos.post("/contactos", (req, res) => {
  const { nome, email, mensagem } = req.body;

  if (!nome || !email || !mensagem) {
    return res.status(400).json({ error: "Todos os campos são obrigatórios." });
  }

  const sql = "INSERT INTO contactos (nome, email, mensagem) VALUES (?, ?, ?)";
  db.query(sql, [nome, email, mensagem], (err, result) => {
    if (err) {
      console.error("Erro ao inserir contacto:", err);
      return res.status(500).json({ error: "Erro no servidor." });
    }
    res.status(201).json({ message: "Mensagem enviada com sucesso!" });
  });
});

// Ver contactos
routerContactos.get("/tudo", (req, res) => {
  const sql = "SELECT * FROM contactos";
  db.query(sql, (err, result) => {
    if (err) {
      console.error("Erro ao obter contactos:", err);
      return res.status(500).json({ error: "Erro no servidor." });
    }
    res.json(result);
  });
});

routerContactos.delete("/remover/:id", (req, res) => {
  const { id } = req.params;
  const sql = "DELETE FROM contactos WHERE id = ?";
  db.query(sql, [id], (err, result) => {
    if (err) {
      console.error("Erro ao eliminar contacto:", err);
      return res.status(500).json({ error: "Erro no servidor." });
    }
    res.json({ message: "Contacto eliminado com sucesso!" });
  });
});

export default routerContactos;