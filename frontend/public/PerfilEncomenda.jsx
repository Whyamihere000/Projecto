import { useState, useEffect } from "react";
import { DataGrid } from "@mui/x-data-grid";
import axios from "axios";
import styles from "../css/PerfilEncomendas.module.css";

function PerfilEncomendas() {
  const [user, setUser] = useState(null);
  const [encomendas, setEncomendas] = useState([]);

  useEffect(() => {
    const storedUser = localStorage.getItem("user");
    if (storedUser && storedUser !== "undefined") {
      const user = JSON.parse(storedUser);
      if (user.tipo_utilizador === "cliente") {
        setUser(user);
        fetchEncomendas(user.id);
        fetchDadosUser(user.id);
      }
    }
  }, []);

  const fetchDadosUser = async (id) => {
    try {
      const res = await axios.get(`http://localhost:3001/api/perfil/buscar/${id}`);
      setUser(res.data);
    } catch (error) {
      console.error("Erro ao carregar dados do utilizador", error);
    }
  };

  const fetchEncomendas = async (id) => {
    try {
      const res = await axios.get(`http://localhost:3001/api/perfil/encomendas/${id}`);
      setEncomendas(res.data);
    } catch (error) {
      console.error("Erro ao carregar encomendas", error);
    }
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setUser((prev) => ({ ...prev, [name]: value }));
  };

  const handleSave = async () => {
    try {
      const [primeiro_nome, ...resto] = user.nome.split(" ");
      const ultimo_nome = resto.join(" ");
      await axios.put(`http://localhost:3001/api/perfil/atualizar/${user.id}`, userAtualizado);
      alert("Informações atualizadas com sucesso!");
    } catch (error) {
      alert("Erro ao atualizar informações.");
    }
  };

  if (!user) return <p className={styles.perfilContainer}>Carregando...</p>;

  const colunas = [
    { field: "id", headerName: "ID Encomenda", width: 120 },
    { field: "data", headerName: "Data", width: 180 },
    { field: "total", headerName: "Total (€)", width: 120, type: "number" },
    { field: "produtos", headerName: "Produtos", width: 300, flex: 1 },
  ];

  return (
    <div className={styles.perfilContainer}>    
      <div className={styles.encomendasContainer}>
        <h2 className={styles.perfilTitulo}>Encomendas</h2>
        <DataGrid
          rows={encomendas}
          columns={colunas}
          pageSize={5}
          getRowId={(row) => row.id}
          autoHeight
          sx={{
            backgroundColor: "#2c2c2c",
            color: "#fff",        
          }}
        />
      </div>
    </div>
  );
}

export default PerfilEncomendas;
