import { useState, useEffect } from "react";
import { DataGrid } from "@mui/x-data-grid";
import axios from "axios";
import styles from "../css/Perfil.module.css";

function Perfil() {
  const [user, setUser] = useState(null);
  const [encomendas, setEncomendas] = useState([]);
  const [passwordAtual, setPasswordAtual] = useState("");
  const [novaPassword, setNovaPassword] = useState("");
  const [confirmarPassword, setConfirmarPassword] = useState("");

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

  const calcularForcaPassword = (senha) => {
    let forca = 0;
    if (senha.length > 5) forca++;
    if (/[A-Z]/.test(senha)) forca++;
    if (/[0-9]/.test(senha)) forca++;
    if (/[^A-Za-z0-9]/.test(senha)) forca++;
    return forca;
  };

  if (!user) return <p>Carregando...</p>;

  const colunas = [
    { field: 'id', headerName: 'ID Encomenda', width: 120 },
    { field: 'data', headerName: 'Data', width: 180 },
    { field: 'total', headerName: 'Total (€)', width: 120, type: 'number' },
    { field: 'produtos', headerName: 'Produtos', width: 300, flex: 1 },
  ];

  const forca = calcularForcaPassword(novaPassword);
  const cores = ["red", "orange", "gold", "green"];
  const percentuais = ["25%", "50%", "75%", "100%"];

  return (
    <div className={styles.container}>
      <h2>Perfil do Utilizador</h2>

      <div className={styles.section}>
        <h3>Dados Pessoais</h3>
        <div className={styles.fieldGroup}>
          <input type="text" name="nome" value={user.nome || ''} onChange={handleInputChange} placeholder="Nome" />
          <input type="email" name="email" value={user.email || ''} onChange={handleInputChange} placeholder="Email" />
          <input type="text" name="telefone" value={user.telefone || ''} onChange={handleInputChange} placeholder="Telefone" />
        </div>
      </div>

      <div className={styles.section}>
        <h3>Morada</h3>
        <div className={styles.fieldGroup}>
          <input type="text" name="rua" value={user.rua || ''} onChange={handleInputChange} placeholder="Rua" />
          <input type="text" name="cidade" value={user.cidade || ''} onChange={handleInputChange} placeholder="Cidade" />
          <input type="text" name="codigo_postal" value={user.codigo_postal || ''} onChange={handleInputChange} placeholder="Código Postal" />
          <input type="text" name="pais" value={user.pais || ''} onChange={handleInputChange} placeholder="País" />
        </div>
      </div>

      <button onClick={handleSave}>Guardar Alterações</button>

      <div className={styles.section}>
        <h3>Alterar Password</h3>
        <div className={styles.fieldGroup}>
          <input type="password" placeholder="Password atual" value={passwordAtual} onChange={(e) => setPasswordAtual(e.target.value)} />
          <input type="password" placeholder="Nova password" value={novaPassword} onChange={(e) => setNovaPassword(e.target.value)} />
          <div className={styles.passwordStrength}>
            <div
              className={styles.strengthBar}
              style={{
                width: percentuais[forca - 1] || "0%",
                backgroundColor: cores[forca - 1] || "#333"
              }}
            />
          </div>
          <input type="password" placeholder="Confirmar nova password" value={confirmarPassword} onChange={(e) => setConfirmarPassword(e.target.value)} />
        </div>
        <button>Guardar Password</button>
      </div>
    </div>
  );
}

export default Perfil;
