import { useEffect, useState } from "react";
import axios from "axios";

import Navbar from "../componentes/Navbar";
import SubNavbar from "../componentes/SubNavbar";
import styles from "../css/Favoritos.module.css";

function Favoritos() {
  const [favoritos, setFavoritos] = useState([]);
  const user = JSON.parse(localStorage.getItem("user"));

  const handleLogout = () => {
      localStorage.removeItem('user');
      Navigate('/');
    };

  useEffect(() => {
    document.body.className = styles.bodyHome;
    return () => {
      document.body.className = '';
    };
  }, []);
  
  useEffect(() => {
    if (user) {
      axios
        .get(`http://localhost:3001/api/favoritos/${user.id}`)
        .then((res) => setFavoritos(res.data))
        .catch((err) => console.error("Erro ao carregar favoritos", err));
    }
  }, [user]);

  return (
  <>
      	<div>
        <Navbar
         user={user} 
         handleLogout={handleLogout}
        />
        <SubNavbar />
    </div>
    <div className={styles.container}>
      <h2 className={styles.titulo}>Meus Favoritos</h2>
        {favoritos.length === 0 ? (
          <p>Não tem produtos favoritos.</p>
        ) : (
        <div className={styles.grid}>
      {favoritos.map((produto) => (
            <div key={produto.id} className={styles.card}>
              <button
                className={styles.favorito}
                onClick={() => handleRemoverFavorito(produto.id)}
              >
                X
              </button>
              <img src={produto.imagem_url} alt={produto.nome} />
              <h3>{produto.nome}</h3>
              <p>€{produto.preco}</p>
              <div style={{ marginTop: "auto", textAlign: "center" }}>
                <button onClick={() => handleAdicionarAoCarrinho(produto.id)}>
                  Adicionar ao carrinho
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
    </>
  );
}

export default Favoritos;
