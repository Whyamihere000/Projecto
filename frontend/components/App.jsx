import { Routes, Route } from 'react-router-dom';
import Home from '../public/Home.jsx';
import Login from '../public/Login.jsx';
import Registo from '../public/Registo.jsx';
import Produtos from '../public/Produtos.jsx';
import Carrinho from '../public/Carrinho.jsx';
import Encomendas from '../public/Encomendas.jsx';
import AdminHome from '../admin/AdminHome.jsx';
// import RotaPrivadaAdmin from '../admin/RotaPrivadaAdmin.jsx';
import AdminCategorias from '../admin/Categorias.jsx';
import AdminMarcas from '../admin/Marcas.jsx';
import AdminProdutos from '../admin/AdminProdutos.jsx';
import AdminUtilizadores from '../admin/Utilizadores.jsx';

function App() {
    return (
        <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/login" element={<Login />} />
            <Route path="/registo" element={<Registo />} />
            <Route path="/produtos" element={<Produtos />} />
            <Route path="/carrinho" element={<Carrinho />} />
            <Route path="/encomendas" element={<Encomendas />} />
            <Route path="/admin" element={<AdminHome />} />
            {/* <Route path="/admin/*" element={<RotaPrivadaAdmin />} /> */}
            <Route path="/admin/categorias" element={<AdminCategorias />} />
            <Route path="/admin/marcas" element={<AdminMarcas />} />
            <Route path="/admin/produtos" element={<AdminProdutos />} />
            <Route path="/admin/utilizadores" element={<AdminUtilizadores />} />
        </Routes>
    )
}

export default App