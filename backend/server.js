import express from 'express';
import cors from 'cors';
import authRoutes from './routes/public/auth.js';
import routerAdminCategorias from './routes/admin/gestao-categorias.js';
import routerAdminMarcas from './routes/admin/gestao-marcas.js';
import routerAdminProdutos from './routes/admin/gestao-produtos.js';
import routerAdminUtilizadores from './routes/admin/gestao-utilizadores.js';

const app = express();
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.use('/api/auth', authRoutes);
app.use('/api/categorias', routerAdminCategorias);
app.use('/api/marcas', routerAdminMarcas);
app.use('/api/produtos', routerAdminProdutos);
app.use('/api/utilizadores', routerAdminUtilizadores);

app.listen(3001, () => {
    console.log('Servidor a correr na porta 3001');
});