import { useEffect, useState } from "react";
import axios from "axios";
import ModalErro from "../componentes/ModalErro";
import { useNavigate } from "react-router-dom";
import Navbar from "../componentes/Navbar";
import SubNavbar from "../componentes/SubNavbar";
import styles from "../css/public/Favoritos.module.css";

function Favoritos() {
  const [favoritos, setFavoritos] = useState([]);
  const [carrinho, setCarrinho] = useState(null);
  const [mensagem, setMensagem] = useState("");
  const [produtoModal, setProdutoModal] = useState([]);
  const [openModal, setOpenModal] = useState(false);
  const user = JSON.parse(localStorage.getItem("user"));

  const navigate = useNavigate();

  const handleLogout = () => {
      localStorage.removeItem('user');
      navigate('/');
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

  useEffect(() => {
    if (user) {
      axios
        .get(`http://localhost:3001/api/carrinhos/${user.id}`)
        .then((res) => setCarrinho(res.data))
        .catch((err) => console.error("Erro ao carregar carrinho", err));
    }
  }, [user]);

  const handleRemoverFavorito = (id) => {
    axios
      .delete(`http://localhost:3001/api/favoritos/remover`, {
        data: { id_utilizador: user.id, id_produto: id },
      })
      .then(() => {
        setFavoritos((prevFavoritos) =>
          prevFavoritos.filter((produto) => produto.id !== id)
        );
      })
      .catch((err) => console.error("Erro ao remover favorito", err));
  };

  const handleAdicionarAoCarrinho = async (produto, quantidadeProduto = 1) => {
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
        id_produto: produto.id,
        quantidade: quantidadeProduto,
        preco: produto.preco,
      });

      setMensagem("Produto adicionado ao carrinho.");
      setOpenModal(true);

      setCarrinho((prevCarrinho) => ({
        ...prevCarrinho,
        total: prevCarrinho.total + quantidadeProduto * produto.preco,
      }));

      setTimeout(() => setOpenModal(false), 1500);
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
                <button onClick={() => handleAdicionarAoCarrinho(produto)}>
                  Adicionar ao carrinho
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
    {openModal && (
          <ModalErro mensagem={mensagem} onClose={closeModal} produtos={produtoModal} />
        )}  
    </>
  );
}

export default Favoritos;
