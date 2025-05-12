import { Routes, Route } from 'react-router-dom';
import Home from '../public/Home.jsx';
import Login from '../public/Login.jsx';
import Registo from '../public/Registo.jsx';
import AdminHome from '../admin/AdminHome.jsx';
// import RotaPrivadaAdmin from '../admin/RotaPrivadaAdmin.jsx';
import Categorias from '../admin/Categorias.jsx';
import Marcas from '../admin/Marcas.jsx';
import Produtos from '../admin/Produtos.jsx';
import Utilizadores from '../admin/Utilizadores.jsx';

function App() {
    return (
        <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/login" element={<Login />} />
            <Route path="/registo" element={<Registo />} />
            <Route path="/admin" element={<AdminHome />} />
            {/* <Route path="/admin/*" element={<RotaPrivadaAdmin />} /> */}
            <Route path="/admin/categorias" element={<Categorias />} />
            <Route path="/admin/marcas" element={<Marcas />} />
            <Route path="/admin/produtos" element={<Produtos />} />
            <Route path="/admin/utilizadores" element={<Utilizadores />} />
        </Routes>
    )
}

export default App