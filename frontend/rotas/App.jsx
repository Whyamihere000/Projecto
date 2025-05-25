import { Routes, Route } from 'react-router-dom';

import Home from '../public/Home.jsx';
import Perfil from '../public/Perfil.jsx';
import Login from '../public/Login.jsx';
import Registo from '../public/Registo.jsx';
import Produtos from '../public/Produtos.jsx';
import Carrinho from '../public/Carrinho.jsx';
import FinalizarEncomendas from '../public/FinalizarEncomenda.jsx';
import RevisaoEncomenda from '../public/RevisaoEncomenda.jsx';
import SucessoPagamento from '../public/SucessoPagamento.jsx';
import Encomendas from '../public/Encomendas.jsx';
import AdminHome from '../admin/AdminHome.jsx';
import RotaPrivadaAdmin from '../admin/RotaPrivadaAdmin.jsx';
import AdminCategorias from '../admin/Categorias.jsx';
import AdminMarcas from '../admin/Marcas.jsx';
import AdminProdutos from '../admin/AdminProdutos.jsx';
import AdminUtilizadores from '../admin/Utilizadores.jsx';
import PerfilEncomendas from '../public/PerfilEncomenda.jsx';
import ProdutoDetalhe from '../componentes/ProdutoDetalhe.jsx';
import MostrarEncomendas from '../admin/MostrarEncomendas.jsx';
import MostrarPagamentos from '../admin/MostrarPagamentos.jsx';
import Favoritos from '../public/Favoritos.jsx';
import Contactos from '../public/ContactosRoute.jsx';
import MostrarContactos from '../admin/MostrarContactos.jsx';
import ContactoLoja from '../public/ContactoLoja.jsx';

function App() {
    return (
        <Routes>
            {/* Rotas publicas */}
            
            <Route path="/" element={<Home />} />
            <Route path="/perfil" element={<Perfil />} />
            <Route path="/login" element={<Login />} />
            <Route path="/registo" element={<Registo />} />
            <Route path="/produtos" element={<Produtos />} />
            <Route path="/carrinho" element={<Carrinho />} />
            <Route path="/finalizar-encomenda" element={<FinalizarEncomendas />} />
            <Route path="/revisao-encomenda" element={<RevisaoEncomenda />} />
            <Route path="/sucesso-pagamento" element={<SucessoPagamento />} />
            <Route path="/encomendas" element={<Encomendas />} />
            <Route path="/perfil-encomendas" element={<PerfilEncomendas />} />
            <Route path="/produto/:id" element={<ProdutoDetalhe />} />
            <Route path="/perfil-favoritos" element={<Favoritos />} />
            <Route path="/perfil-contactos" element={<Contactos/>} />
            <Route path="/contacto-loja" element={<ContactoLoja />} />

            {/* Routas admin */}
            
            <Route path="/admin" element={<RotaPrivadaAdmin><AdminHome /></RotaPrivadaAdmin>} />
            <Route path="/admin/categorias" element={<RotaPrivadaAdmin> <AdminCategorias /> </RotaPrivadaAdmin>} />
            <Route path="/admin/marcas" element={<RotaPrivadaAdmin> <AdminMarcas /> </RotaPrivadaAdmin> } />
            <Route path="/admin/produtos" element={<RotaPrivadaAdmin><AdminProdutos /> </RotaPrivadaAdmin>}/>
            <Route path="/admin/utilizadores" element={<RotaPrivadaAdmin><AdminUtilizadores /></RotaPrivadaAdmin>} />
            <Route path="/admin/mostrar-encomendas" element={<RotaPrivadaAdmin><MostrarEncomendas /></RotaPrivadaAdmin>} />
            <Route path="/admin/mostrar-pagamentos" element={<RotaPrivadaAdmin><MostrarPagamentos /> </RotaPrivadaAdmin>}/>
            <Route path="/admin/mostrar-contactos" element={<RotaPrivadaAdmin><MostrarContactos /></RotaPrivadaAdmin>} />
        </Routes>
    )
}

export default App