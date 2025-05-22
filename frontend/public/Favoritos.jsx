import { useEffect, useState } from "react";
import axios from "axios";

function Favoritos() {
  const [favoritos, setFavoritos] = useState([]);
  const user = JSON.parse(localStorage.getItem("user"));

  useEffect(() => {
    if (user) {
      axios
        .get(`http://localhost:3001/api/favoritos/${user.id}`)
        .then((res) => setFavoritos(res.data))
        .catch((err) => console.error("Erro ao carregar favoritos", err));
    }
  }, [user]);

  return (
    <div>
      <h2>Meus Favoritos</h2>
      {favoritos.length === 0 ? (
        <p>Não tem produtos favoritos.</p>
      ) : (
        favoritos.map((produto) => (
          <div key={produto.id}>
            <h3>{produto.nome}</h3>
            <p>€{produto.preco}</p>
            <img src={produto.imagem_url} alt={produto.nome} width="100" />
          </div>
        ))
      )}
    </div>
  );
}

export default Favoritos;
