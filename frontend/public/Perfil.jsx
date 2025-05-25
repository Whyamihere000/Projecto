import { useState, useEffect } from "react";
import axios from "axios";
import styles from "../css/public/Perfil.module.css";
import { useNavigate, Link } from "react-router-dom";

import Navbar from "../componentes/Navbar";
import Footer from "../componentes/Footer";
import SubNavbar from "../componentes/SubNavbar";


function Perfil() {
  const [user, setUser] = useState(null);
  const [passwordAtual, setPasswordAtual] = useState("");
  const [novaPassword, setNovaPassword] = useState("");
  const [confirmarPassword, setConfirmarPassword] = useState("");

  const [message, setMessage] = useState("");
  const [messageType, setMessageType] = useState("");

  const Navigate = useNavigate();

  useEffect(() => {
    document.body.className = styles.bodyHome;
    return () => {
      document.body.className = "";
    };
  }, []);

  useEffect(() => {
    const storedUser = localStorage.getItem('user');
    if (storedUser && storedUser !== 'undefined') {
      const user = JSON.parse(storedUser);
      if (user.tipo_utilizador === 'cliente') {
        setUser(user);
        fetchDadosUser(user.id);
      }
    }
  }, []);

  const handleLogout = () => {
    localStorage.removeItem('user');
    Navigate('/');
  };

  const fetchDadosUser = async (id) => {
    try {
      const res = await axios.get(`http://localhost:3001/api/perfil/buscar/${id}`);
      setUser(res.data);
    } catch (error) {
      console.error("Erro ao carregar dados do utilizador", error);
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

  const handleMudarPassword = async () => {
    if (novaPassword !== confirmarPassword) {
      setMessage("As passwords devem ser iguais.");
      setMessageType("error");
      return;
    }

    if (forca < 3) {
      setMessage("A password é demasiado fraca.");
      setMessageType("error");
      return;
    }

    try {
      const res = await axios.put(`http://localhost:3001/api/perfil/atualizar-password/${user.id}`, {
        passwordAtual,
        novaPassword,
      });

      setMessage(res.data.message);
      setMessageType(res.data.messageType);
      console.log(res.data);
    } catch (error) {
      setMessage("Erro ao atualizar password.");
      setMessageType("error");
      console.error(error);
    }
  };

  return (
    <>
    <div>
        <Navbar
         user={user} 
         handleLogout={handleLogout}
        />
        <SubNavbar />
    </div>


    <br />

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
        <button className={styles.button} onClick={handleMudarPassword}>Guardar Password</button>
        <br />
        <p style={{ color: messageType === "success" ? "green" : "red" }}>{message}</p>
        <br />
        <Link to="/perfil-encomendas">Ver as minhas encomendas</Link>
      </div>
    </div>
    <Footer />
    </>
  );
}

export default Perfil;
