import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import axios from "axios";
import { DataGrid } from "@mui/x-data-grid";
import stylesNav from "../css/Global.module.css";
import styles from "../css/MostrarPagamentos.module.css";

function MostrarPagamentos() {
  const [pagamentos, setPagamentos] = useState([]);

  useEffect(() => {
    const fetchPagamentos = async () => {
      try {
        const res = await axios.get("http://localhost:3001/api/encomendas/pagamentos");
        const dadosComId = res.data.map((linha, index) => ({
          ...linha,
          id: `${linha.id_pagamento || "p"}-${linha.id_encomenda || "e"}-${index}`
        }));
        setPagamentos(dadosComId);
      } catch (error) {
        console.error("Erro ao carregar pagamentos", error);
      }
    };

    fetchPagamentos();
  }, []);

  const colunas = [
    { field: "id_pagamento", headerName: "ID", width: 80 },
    { field: "id_encomenda", headerName: "Encomenda Nº", width: 130 },
    { field: "primeiro_nome", headerName: "Primeiro Nome", width: 120 },
    { field: "ultimo_nome", headerName: "Ultimo Nome", width: 120 },
    { field: "metodo", headerName: "Método", width: 120 },
    { field: "estado", headerName: "Estado", width: 120 },
    { field: "referencia", headerName: "Referência", width: 150 },
    // {
    //   field: "data_pagamento",
    //   headerName: "Data",
    //   width: 130,
    //   valueFormatter: (params) =>
    //     params.value ? new Date(params.value).toLocaleDateString("pt-PT") : "—"
    // },
    { field: "cartao_tipo", headerName: "Tipo Cartão", width: 120 },
    { field: "cartao_token", headerName: "Token", width: 180 }
  ];

  const handleLogout = () => {
    localStorage.removeItem('user');
    navigater('/');
  };

  return (
    <>
    <nav className={stylesNav.navegacao_admin}>
            <Link to="/admin/categorias" className={stylesNav.link}>Categorias</Link>
            <Link to="/admin/marcas" className={stylesNav.link}>Marcas</Link>
            <Link to="/admin/produtos" className={stylesNav.link}>Produtos</Link>
            <Link to="/admin/utilizadores" className={stylesNav.link}>Utilizadores</Link>
            <Link to="/admin/mostrar-encomendas" className={stylesNav.link}>Encomendas</Link>
            <Link to="/admin/mostrar-pagamentos" className={stylesNav.link}>Pagamentos</Link>
            <button className={stylesNav.logout} onClick={handleLogout}>Logout</button>
          </nav>
    <div className={styles.container}>
      {pagamentos.length === 0 ? (
        <p>Sem pagamentos para mostrar.</p>
      ) : (
        <DataGrid
          rows={pagamentos}
          columns={colunas}
          pageSize={10}
          getRowHeight={() => 'auto'}
        />
      )}
    </div>
    </>
  );
}

export default MostrarPagamentos;
