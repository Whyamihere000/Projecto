import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import { DataGrid } from "@mui/x-data-grid";
import styles from "../css/Global.module.css";
import stylesEncomendas from "../css/MostrarEncomendas.module.css";
import NavbarAdmin from "../componentes/NavbarAdmin";

function MostrarEncomendas() {
  const [user, setUser] = useState(null);
  const [encomendas, setEncomendas] = useState([]);
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
    const fetchEncomendas = async () => {
      try {
        const res = await axios.get(`http://localhost:3001/api/encomendas/tudo`);
        console.log("Resposta API:", res.data);

        const dadosComId = res.data.map((linha, index) => ({
          ...linha,
          id: index
        }));

        setEncomendas(dadosComId);
      } catch (error) {
        console.error("Erro ao carregar encomendas", error);
      }
    };

    fetchEncomendas();
  }, []);

  const colunas = [
    { field: "id_encomenda", headerName: "Encomenda Nº", width: 110 },
    { field: "primeiro_nome", headerName: "Cliente", width: 130 },
    { field: "ultimo_nome", headerName: "Apelido", width: 130 },
    { field: "nome_produto", headerName: "Produto", width: 160 },
    { field: "quantidade", headerName: "Quantidade", width: 110 },
    { field: "preco_unitario", headerName: "Preço Unitário (€)", width: 140 },
    { field: "total", headerName: "Total Encomenda (€)", width: 160 },
    {
      field: "data",
      headerName: "Data",
      width: 130,
      valueFormatter: (params) => {
        const date = new Date(params.value);
        return isNaN(date) ? "" : date.toLocaleDateString("pt-PT");
      }
    },
    { field: "estado", headerName: "Estado", width: 120 }
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
    <NavbarAdmin handleLogout={handleLogout} user={user} />

    <div className={stylesEncomendas.container}>
      {encomendas.length === 0 ? (
        <p>Sem encomendas para mostrar.</p>
      ) : (
        <DataGrid
          rows={encomendas}
          columns={colunas}
          pageSize={10}
        />
      )}
    </div>    
    </>
  );
}

export default MostrarEncomendas;
