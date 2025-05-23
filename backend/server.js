import express from 'express';
import cors from 'cors';
import path from 'path';
import { fileURLToPath } from 'url';
import { dirname } from 'path';
import authRoutes from './routes/public/auth.js';
import routerPerfil from './routes/public/perfil.js';
import routerCarrinho from './routes/public/carrinho.js';
import routerEncomendas from './routes/public/encomendas.js';
import routerProdutos from './routes/public/produtos.js';
import routerAdminCategorias from './routes/admin/gestao-categorias.js';
import routerAdminMarcas from './routes/admin/gestao-marcas.js';
import routerAdminProdutos from './routes/admin/gestao-produtos.js';
import routerAdminUtilizadores from './routes/admin/gestao-utilizadores.js';
import routerFavoritos from './routes/public/favoritos.js';
//import './timers/pagamentosTimer.js';


//Importar as rotas
//import routerAdmin from './routes/admin.js';
const express = require("express");
const cors = require("cors");
const app = express();
const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);
const contactosRoute = require("./routes/contactosRoute");

// Configurar o middleware para servir arquivos estáticos
app.use("/api", contactosRoute);


// Configurar o middleware CORS
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Configurar o middleware para servir arquivos estáticos
app.use('/api/auth', authRoutes);
app.use('/api/perfil', routerPerfil);
app.use('/api/carrinhos', routerCarrinho);
app.use('/api/encomendas', routerEncomendas);
app.use('/api/produtos', routerProdutos);
app.use('/api/categorias', routerAdminCategorias);
app.use('/api/marcas', routerAdminMarcas);
app.use('/api/produtos', routerAdminProdutos);
app.use('/api/utilizadores', routerAdminUtilizadores);
app.use('/api/favoritos', routerFavoritos);
app.use('/uploads', express.static(path.resolve(__dirname, 'uploads')));

// Configurar o middleware para servir arquivos estáticos
app.listen(3001, () => {
    console.log('Servidor a correr na porta 3001');
});