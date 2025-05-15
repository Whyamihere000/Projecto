import { useState, useEffect } from "react";
import axios from "axios";
import { Link } from "react-router-dom";
import { DataGrid } from "@mui/x-data-grid";
import styles from "../css/Global.module.css";
import stylesUtilizadores from "../css/Utilizadores.module.css";

function Utilizadores() {
  const [utilizadores, setUtilizadores] = useState([]);

  const [mensagem, setMensagem] = useState("");
  const [mensagemTipo, setMensagemTipo] = useState("");

  useEffect(() => {
    const fetchUtilizadores = async () => {
      try {
        const res = await axios.get("http://localhost:3001/api/utilizadores/buscar");
        setUtilizadores(res.data);
      } catch (error) {
        console.error("Erro ao carregar utilizadores", error);
      }
    };

    fetchUtilizadores();
  }, []);

  const atualizarUtilizador = async (utilizador) => {
    try {
      const res = await axios.put(
        `http://localhost:3001/api/utilizadores/atualizar/${utilizador.id}`,
        {
          primeiro_nome: utilizador.primeiro_nome,
          ultimo_nome: utilizador.ultimo_nome,
          email: utilizador.email,
          password_hash: utilizador.password_hash,
          telefone: utilizador.telefone,
          //data_registo: utilizador.data_registo,
          //data_atualizacao: utilizador.data_atualizacao,
          tipo_utilizador: utilizador.tipo_utilizador,
          rua: utilizador.rua,
          cidade: utilizador.cidade,
          codigo_postal: utilizador.codigo_postal,
          pais: utilizador.pais,
        }
      );

      if (res.data.success) {
        setUtilizadores((prevUtilizadores) =>
          prevUtilizadores.map((u) =>
            u.id === utilizador.id ? res.data.utilizador : u
          )
        );
        setMensagem(res.data.message);
        setMensagemTipo("success");
      } else {
        console.error("Erro ao atualizar utilizador");
        setMensagem(res.data.message);
        setMensagemTipo("error");
      }
    } catch (error) {
      console.error(error);
      setMensagem("Erro ao comunicar com o servidor");
      setMensagemTipo("error");
    }
  };

  const eliminarUtilizador = async (id) => {
    try {
      const response = await axios.delete(
        `http://localhost:3001/api/utilizadores/eliminar/${id}`
      );

      if (response.status === 200) {
        setUtilizadores(
          utilizadores.filter((utilizador) => utilizador.id !== id)
        );
        setMensagem("Utilizador eliminado com sucesso");
        setMensagemTipo("success");
      } else {
        setMensagem("Erro ao eliminar utilizador");
        setMensagemTipo("error");
      }
    } catch (error) {
      console.error("Erro na requisição Axios:", error);
      setMensagem("Erro ao comunicar com o servidor");
      setMensagemTipo("error");
    }
  };

  const colunas = [
  { field: "id", headerName: "ID", minWidth: 70 },
  { field: "primeiro_nome", headerName: "Primeiro Nome", minWidth: 150, editable: true },
  { field: "ultimo_nome", headerName: "Ultimo Nome", minWidth: 150, editable: true },
  { field: "email", headerName: "Email", minWidth: 200, editable: true },
  { field: "password_hash", headerName: "Password", minWidth: 200, },
  { field: "telefone", headerName: "Telefone", minWidth: 150, editable: true,     
    renderEditCell: (params) => (
      <input
        type="text"
        value={params.value}
        onChange={(e) => {
          const newValue = e.target.value.slice(0, 9); // Limita diretamente a 9 caracteres
          params.api.setEditCellValue({ id: params.id, field: params.field, value: newValue });
        }}
      />
    ),
  },
  { field: "data_registo", headerName: "Data Registo", minWidth: 150 },
  { field: "data_atualizacao", headerName: "Data Atualizacao", minWidth: 150 },
  { field: "tipo_utilizador", headerName: "Tipo", minWidth: 100, editable: true },
  { field: "rua", headerName: "Rua", minWidth: 200, flex: 1, editable: true },
  { field: "cidade", headerName: "Cidade", minWidth: 150, editable: true },
  { field: "codigo_postal", headerName: "Codigo Postal", minWidth: 150, editable: true },
  { field: "pais", headerName: "Pais", minWidth: 150, editable: true },
  {
    field: "ações",
    headerName: "Ações",
    minWidth: 220,
    renderCell: (params) => (
      <>
        <button onClick={() => eliminarUtilizador(params.row.id)}>Eliminar</button>
        <button onClick={() => atualizarUtilizador(params.row)}>Atualizar</button>
      </>
    ),
  },
];

  return (
    <>
      <nav className={styles.navegacao_admin}>
        <Link to="/admin/categorias" className={styles.link}>
          Categorias
        </Link>
        <Link to="/admin/marcas" className={styles.link}>
          Marcas
        </Link>
        <Link to="/admin/produtos" className={styles.link}>
          Produtos
        </Link>
        <Link to="/admin/utilizadores" className={styles.link}>
          Utilizadores
        </Link>
        <button className={styles.logout}>Logout</button>
      </nav>

      <div className={stylesUtilizadores.container}>
        <div style={{ height: 400, width: "100%" }}>
          <DataGrid
            rows={utilizadores}
            columns={colunas}
            pageSize={5}
            getRowId={(row) => row.id}
          />
        </div>
        {mensagem && (
          <p
            className={
              mensagemTipo === "success"
                ? stylesUtilizadores.success
                : stylesUtilizadores.error
            }
          >
            {mensagem}
          </p>
        )}
      </div>
    </>
  );
}

export default Utilizadores;