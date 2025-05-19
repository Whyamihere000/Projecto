import { useState, useEffect } from "react";
import { DataGrid } from "@mui/x-data-grid";
import axios from "axios";
// import { Link } from "react-router-dom";
// import styles from "../css/Global.module.css";
//import stylesPerfil from "../css/Perfil.module.css";

function Perfil() {
    const [user, setUser] = useState(null);
    const [encomendas, setEncomendas] = useState([]);

    useEffect(() => {
    const storedUser = localStorage.getItem('user');
    if (storedUser && storedUser !== 'undefined') {
      const user = JSON.parse(storedUser);
      if (user.tipo_utilizador === 'cliente') {
        setUser(user);
        fetchEncomendas(user.id);
        fetchDadosUser(user.id);
      }
    }
  }, []);

    const fetchDadosUser = async (id) => {
    try {
      const res = await axios.get(`http://localhost:3001/api/perfil/buscar/${id}`);
      console.log("Dados do utilizador recebidos:", res.data);
      setUser(res.data);
    } catch (error) {
      console.error("Erro ao carregar dados do utilizador", error);
    }
  };

  const fetchEncomendas = async (id) => {
    try {
      const res = await axios.get(`http://localhost:3001/api/perfil/encomendas/${id}`);
      console.log("Encomendas recebidas:", res.data);
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
      const [primeiro_nome, ...resto] = user.nome.split(' ');
      const ultimo_nome = resto.join(' ');

      const userAtualizado = {
        primeiro_nome,
        ultimo_nome,
        email: user.email,
        telefone: user.telefone,
        rua: user.rua,
        cidade: user.cidade,
        codigo_postal: user.codigo_postal,
        pais: user.pais
      };

      await axios.put(`http://localhost:3001/api/perfil/atualizar/${user.id}`, userAtualizado);
      alert("Informações atualizadas com sucesso!");
    } catch (error) {
      alert("Erro ao atualizar informações.");
    }
  };

  if (!user) return <p>Carregando...</p>;

  const colunas = [
  { field: 'id', headerName: 'ID Encomenda', width: 120 },
  { field: 'data', headerName: 'Data', width: 180, },
  { field: 'total', headerName: 'Total (€)', width: 120, type: 'number' },
  { field: 'produtos', headerName: 'Produtos', width: 300, flex: 1 },
];

   return (
    <div style={{ padding: 20 }}>
      <h2>Perfil do Utilizador</h2>
      <div style={{ marginBottom: 30 }}>
        <label>
          Nome: <input type="text" name="nome" value={user.nome || ''} onChange={handleInputChange} />
        </label><br />
        <label>
          Email: <input type="email" name="email" value={user.email || ''} onChange={handleInputChange} />
        </label><br />
        <label>
          Telefone: <input type="text" name="telefone" value={user.telefone || ''} onChange={handleInputChange} />
        </label><br />
        
        <h3>Morada:</h3>
        <label>
          Rua: <input type="text" name="rua" value={user.rua || ''} onChange={handleInputChange} />
        </label><br />
        <label>
          Cidade: <input type="text" name="cidade" value={user.cidade || ''} onChange={handleInputChange} />
        </label><br />
        <label>
          Código Postal: <input type="text" name="codigo_postal" value={user.codigo_postal || ''} onChange={handleInputChange} />
        </label><br />
        <label>
          País: <input type="text" name="pais" value={user.pais || ''} onChange={handleInputChange} />
        </label><br />

        <button onClick={handleSave}>Guardar Alterações</button>
      </div>

      <h2>Encomendas</h2>
      <div style={{ height: 400, width: '100%' }}>
        <DataGrid
          rows={encomendas}
          columns={colunas}
          pageSize={5}
          getRowId={(row) => row.id}
          autoHeight
        />
      </div>
    </div>
  );
}

export default Perfil;