import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import axios from "axios";
import { DataGrid } from "@mui/x-data-grid";
import stylesNav from "../css/Global.module.css";
import styles from "../css/MostrarEncomendas.module.css";

function MostrarEncomendas() {
  const [encomendas, setEncomendas] = useState([]);

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

  return (
    <>
    <nav className={stylesNav.navegacao_admin}>
                <Link to="/admin/categorias" className={styles.link}>Categorias</Link>
                <Link to="/admin/marcas" className={styles.link}>Marcas</Link>
                <Link to="/admin/produtos" className={styles.link}>Produtos</Link>
                <Link to="/admin/utilizadores" className={styles.link}>Utilizadores</Link>
                <Link to="/admin/mostrar-encomendas" className={styles.link}>Encomendas</Link>
                <button className={styles.logout}>Logout</button>
            </nav>
    <div className={styles.container}>
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
