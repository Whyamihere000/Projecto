import { useParams } from "react-router-dom";
import { useEffect, useState } from "react";
import axios from "axios";
import styles from "../css/ProdutoDetalhe.module.css";
import Navbar from "./Navbar";
import { FaHeart, FaRegHeart } from "react-icons/fa";

function ProdutoDetalhe() {
  const [user, setUser] = useState(JSON.parse(localStorage.getItem("user")));
  const [quantidade, setQuantidade] = useState(1);
  const [favorito, setFavorito] = useState(false);

  const handleLogout = () => {
    localStorage.removeItem("user");
    window.location.reload();
  };

  const { id } = useParams();
  const [produto, setProduto] = useState(null);

  useEffect(() => {
    axios
      .get(`http://localhost:3001/api/produtos/${id}`)
      .then((res) => setProduto(res.data))
      .catch((err) => console.error("Erro ao carregar produto", err));
  }, [id]);

  const handleAdicionarAoCarrinho = (id) => {
    // lógica do carrinho
    alert(`Adicionado ${quantidade} unidade(s) do produto ${id} ao carrinho.`);
  };

  if (!produto) return <p>A carregar produto...</p>;

  return (
    <>
      <Navbar user={user} handleLogout={handleLogout} />
      <div className={styles.container}>
        <div className={styles.left}>
          <h2 className={styles.titulo}>{produto.nome}</h2>
          <p className={styles.preco}>€{produto.preco}</p>
          <p className={styles.stock}>
            {produto.stock > 0 ? "Em stock" : "Sem stock"}
          </p>
          <p className={styles.descricao}>{produto.descricao}</p>

          <div className={styles.controls}>
            <input
              type="number"
              min="1"
              max="10"
              value={quantidade}
              onChange={(e) => setQuantidade(parseInt(e.target.value))}
              className={styles.quantidadeInput}
            />

            <button
              onClick={() => handleAdicionarAoCarrinho(produto.id)}
              className={styles.comprarBtn}
              disabled={produto.stock === 0}
            >
              Comprar
            </button>

            <button
              onClick={() => setFavorito(!favorito)}
              className={styles.favoritoBtn}
            >
              {favorito ? <FaHeart color="red" /> : <FaRegHeart />}
            </button>
          </div>
        </div>

        <div className={styles.right}>
          {produto.imagem_url && (
            <img
              src={produto.imagem_url}
              alt={produto.nome}
              className={styles.imagem}
            />
          )}
        </div>
      </div>
    </>
  );
}

export default ProdutoDetalhe;
