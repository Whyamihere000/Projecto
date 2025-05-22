import { useParams } from "react-router-dom";
import { useEffect, useState } from "react";
import ModalErro from "./ModalErro";
import axios from "axios";
import styles from "../css/ProdutoDetalhe.module.css";
import Navbar from "./Navbar";
import { FaHeart, FaRegHeart } from "react-icons/fa";

function ProdutoDetalhe() {
  //const [produtosModale, setProdutoModale] = useState([]);
  const [user, setUser] = useState(JSON.parse(localStorage.getItem("user")));
  const [carrinho, setCarrinho] = useState(null);
  const [mensagem, setMensagem] = useState("");
  const [produtoModal, setProdutoModal] = useState([]);
  const [openModal, setOpenModal] = useState(false);
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

  useEffect(() => {
    if (user) {
      axios
        .get(`http://localhost:3001/api/carrinhos/${user.id}`)
        .then((response) => {
          setCarrinho(response.data);
        })
        .catch((error) => {
          console.error("Erro ao carregar carrinho", error);
          setMensagem("Erro ao carregar carrinho.");
          setOpenModal(true);
        });
    }
  }, [user]);

  if (!produto) return <p>A carregar produto...</p>;

  const handleAdicionarAoCarrinho = async (produtoID, quantidadeProduto = quantidade) => {
    if (!user) {
      setMensagem("Faça login para adicionar ao carrinho.");
      setOpenModal(true);
      return;
    }

    if (!carrinho) {
      setMensagem("Carrinho não encontrado.");
      setOpenModal(true);
      return;
    }

    if (!produto) {
      setMensagem("Produto não encontrado.");
      setOpenModal(true);
      return;
    } 
    setProdutoModal(produto.nome); 

    try {
      await axios.post("http://localhost:3001/api/carrinhos/adicionar", {
        id_carrinho: carrinho.id,
        id_produto: produtoID,
        quantidade: quantidade,
        preco: produto.preco,
      });

      setMensagem("Produto adicionado ao carrinho.");
      setOpenModal(true);

      setCarrinho((prevCarrinho) => ({
        ...prevCarrinho,
        total: prevCarrinho.total + quantidadeProduto * produto.preco,
      }));

      setTimeout(() => setOpenModal(false), 1000);
    } catch (error) {
      console.error("Erro ao adicionar ao carrinho", error);
      setMensagem("Erro ao adicionar ao carrinho.");
      setOpenModal(true);
    }
  };

  const closeModal = () => {
    setOpenModal(false);
  };

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
      {openModal && (
          <ModalErro mensagem={mensagem} onClose={closeModal} produtos={produtoModal} />
        )}  
    </>
  );
}

export default ProdutoDetalhe;
