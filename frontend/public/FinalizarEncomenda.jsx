import { useState, useEffect } from "react";
import axios from "axios";
import { Link, useNavigate, useLocation } from "react-router-dom";
import classNames from "classnames";
import styles from "../css/public/FinalizarEncomenda.module.css";
import Navbar from "../componentes/Navbar";

function FinalizarEncomenda() {
  const [user, setUser] = useState(null);
  const [form, setForm] = useState({
    rua: "",
    cidade: "",
    codigo_postal: "",
    pais: "",
    email: "",
    telefone: "",
    nif: "",
  });
  const [mensagem, setMensagem] = useState("");
  const navigate = useNavigate();
  const location = useLocation();
  const idCarrinho = location.state?.idCarrinho;
  
  useEffect(() => {
    const storedUser = localStorage.getItem('user');
    if (storedUser && storedUser !== 'undefined') {
      const user = JSON.parse(storedUser);
      if (user.tipo_utilizador === 'cliente') {
        setUser(user);
      }
    }
  }, []);

  const handleLogout = () => {
    localStorage.removeItem('user');
    window.location.reload();
  };

  useEffect(() => {
    const storedUser = localStorage.getItem("user");
    if (storedUser && storedUser !== "undefined") {
      const user = JSON.parse(storedUser);

      axios.get(`http://localhost:3001/api/encomendas/${user.id}`)
        .then(response => {
          const ultima = response.data[response.data.length - 1];
          if (ultima) {
            setForm({
              rua: ultima.rua || "",
              cidade: ultima.cidade || "",
              codigo_postal: ultima.codigo_postal || "",
              pais: ultima.pais || "",
              email: ultima.email || "",
              telefone: ultima.telefone || "",
              nif: ultima.nif || "",
            });
          }
        })
        .catch(() => console.error("Erro ao carregar encomenda."));
    }
  }, []);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!idCarrinho) return setMensagem("Erro: Carrinho não encontrado.");

    try {
      const res = await axios.post("http://localhost:3001/api/encomendas/nova", {
        id_carrinho: idCarrinho,
        ...form,
      });

      navigate("/revisao-encomenda", { state: { idEncomenda: res.data.id_encomenda } });
    } catch (error) {
      console.error("Erro:", error.response?.data || error.message);
      setMensagem(error.response?.data.message || "Erro ao criar encomenda.");
    }
  };

  return (
    <div className={styles.wrapper}>
      <Navbar user={user} handleLogout={handleLogout}/>

      <div className={styles.box}>
        <h1>Finalizar Encomenda</h1>
        <form onSubmit={handleSubmit}>
          <label htmlFor="rua">Rua:</label>
          <input type="text" id="rua" name="rua" value={form.rua} onChange={handleChange} required />
          <label htmlFor="cidade">Cidade:</label>
          <input type="text" id="cidade" name="cidade" value={form.cidade} onChange={handleChange} required />
          <label htmlFor="codigo_postal">Código Postal:</label>
          <input type="text" id="codigo_postal" name="codigo_postal" value={form.codigo_postal} onChange={handleChange} required />
          <label htmlFor="pais">País:</label>
          <input type="text" id="pais" name="pais" value={form.pais} onChange={handleChange} required />
          <label htmlFor="email">Email:</label>
          <input type="email" id="email" name="email" value={form.email} onChange={handleChange} required />
          <label htmlFor="telefone">Telefone:</label>
          <input type="tel" id="telefone" name="telefone" value={form.telefone} onChange={handleChange} required />
          <label htmlFor="nif">NIF:</label>
          <input type="text" id="nif" name="nif" value={form.nif} onChange={handleChange} required />
          <button type="submit">Finalizar Encomenda</button>
        </form>
        {mensagem && <p className={styles.mensagem}>{mensagem}</p>}
        <Link to="/carrinho" className={styles.link}>Voltar ao carrinho</Link>
      </div>
    </div>
  );
}

export default FinalizarEncomenda;
