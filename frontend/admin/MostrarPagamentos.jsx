import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import { DataGrid } from "@mui/x-data-grid";
import stylesNav from "../css/Global.module.css";
import styles from "../css/MostrarPagamentos.module.css";
import NavbarAdmin from "../componentes/NavbarAdmin";

function MostrarPagamentos() {
  const [user, setUser] = useState(null);
  const [pagamentos, setPagamentos] = useState([]);
  const navigate = useNavigate();

  useEffect(() => {
    const storedUser = localStorage.getItem('user');
    if (storedUser && storedUser !== 'undefined') {
      const user = JSON.parse(storedUser);
      if (user.tipo_utilizador === 'admin') {
        setUser(user);
      }
    }
  }, []);

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

  useEffect(() => {
              document.body.className = styles.bodyHomeAdmin;
              return () => {
                  document.body.className = '';
              };
          }, []);

  const handleLogout = () => {
    localStorage.removeItem('user');
    navigate('/');
  };

  return (
    <>
    <NavbarAdmin onLogout={handleLogout} user={user} />

    <div className={styles.container}>
      {pagamentos.length === 0 ? (
        <p>Sem pagamentos para mostrar.</p>
      ) : (
        <DataGrid
          rows={pagamentos}
          columns={colunas}
          pageSize={10}
        />
      )}
    </div>
    </>
  );
}

export default MostrarPagamentos;
