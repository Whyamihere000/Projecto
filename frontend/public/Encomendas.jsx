import { useState, useEffect } from "react";
import axios from "axios";
import { Link } from "react-router-dom";
import stylesEncomendas from "../css/public/Encomendas.module.css";
import styles from "../css/Global.module.css";

function Encomendas() {
  const [user, setUser] = useState(null);
  const [encomendas, setEncomendas] = useState([]);

  useEffect(() => {
    const storedUser = localStorage.getItem("user");
    if (storedUser && storedUser !== "undefined") {
      const user = JSON.parse(storedUser);
      if (user.tipo_utilizador === "cliente") {
        setUser(user);
        carregarEncomendas(user.id);
      }
    }
  }, []);

  const carregarEncomendas = (id_utilizador) => {
    axios
      .get(`http://localhost:3001/api/encomendas/${id_utilizador}`)
      .then((response) => {
        setEncomendas(response.data);
      })
      .catch((error) => {
        console.log("Erro ao carregar encomendas:", error);
      });
  };

  return (
    <>
      <nav className={styles.nav}>
        <div className={styles.navLeft}>
          <Link to="/" className={styles.navHome}>
            Home
          </Link>
          <Link to="/produtos" className={styles.navProdutos}>
            Produtos
          </Link>
        </div>
        <div className={styles.navRight}>
          {user ? (
            <>
              <p>{user ? `${user.primeiro_nome}` : ""}</p>
              <p>
                <button onClick={() => { localStorage.removeItem("user"); window.location.reload(); }}>
                  Logout
                </button>
              </p>
            </>
          ) : (
            <Link to="/login" className={styles.navLogin}>
              Login
            </Link>
          )}
        </div>
      </nav>

      <main className={styles.main}>
        <h1>As Suas Encomendas</h1>
        {encomendas.length > 0 ? (
          encomendas.map((encomenda) => (
            <div key={encomenda.id} className={styles.encomendaCard}>
              <h3>Encomenda #{encomenda.id}</h3>
              <p>
                <strong>Data:</strong> {new Date(encomenda.data).toLocaleString()}
              </p>
              <p>
                <strong>Total:</strong> {encomenda.total}€
              </p>
              <p>
                <strong>Morada:</strong> {encomenda.morada}
              </p>
              <p>
                <strong>Estado:</strong> {encomenda.estado}
              </p>
            </div>
          ))
        ) : (
          <p>Não tem encomendas.</p>
        )}
      </main>
    </>
  );
}

export default Encomendas;
