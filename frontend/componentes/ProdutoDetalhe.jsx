import { useParams } from "react-router-dom";
import { useEffect, useState } from "react";
import axios from "axios";
import styles from "../css/ProdutoDetalhe.module.css";
import Navbar from "./Navbar";

function ProdutoDetalhe({ user, handleLogout }) {
  const { id } = useParams();
  const [produto, setProduto] = useState(null);

  useEffect(() => {
    axios.get(`http://localhost:3001/api/produtos/${id}`)
      .then((res) => setProduto(res.data))
      .catch((err) => console.error("Erro ao carregar produto", err));
  }, [id]);

  if (!produto) return <p>A carregar produto...</p>;

  return (
    <>
      <Navbar user={user} handleLogout={handleLogout} />
      <div className={styles.container}>
        <h2 className={styles.titulo}>{produto.nome}</h2>
        <p className={styles.marca}><strong>Marca:</strong> {produto.nome_marca}</p>
        <p className={styles.preco}><strong>Preço:</strong> €{produto.preco}</p>
        <p className={styles.tipo}><strong>Tipo:</strong> {produto.tipo_produto}</p>
        <p className={styles.descricao}><strong>Descrição:</strong> {produto.descricao}</p>
        {produto.imagem_url && (
          <img src={produto.imagem_url} alt={produto.nome} className={styles.imagem} />
        )}
        {/* Aqui podes incluir botão para adicionar ao carrinho, etc. */}
      </div>
    </>
  );
}

export default ProdutoDetalhe;

