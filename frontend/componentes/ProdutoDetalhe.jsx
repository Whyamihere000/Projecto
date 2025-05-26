import { useParams, Link } from "react-router-dom";
import { useEffect, useState } from "react";
import ModalErro from "./ModalErro";
import axios from "axios";
import styles from "../css/public/ProdutoDetalhe.module.css";
import stylesHome from "../css/public/Home.module.css";
import ComponentesNav from "../componentes/ComponentesNav";
import Navbar from "./Navbar";
import Footer from "./Footer";
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
  const [produtosDestaque, setProdutosDestaque] = useState([]);
  const [novidades, setNovidades] = useState([]);

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
    const fetchProdutos = async () => {
      try {
        const resDestaque = await axios.get('http://localhost:3001/api/produtos/buscar/destaque');
        setProdutosDestaque(resDestaque.data);

        const resNovidade = await axios.get('http://localhost:3001/api/produtos/buscar/novidade');
        setNovidades(resNovidade.data);
      } catch (error) {
        console.error('Erro ao buscar produtos:', error);
      }
    };

    fetchProdutos();
  }, []);

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

  useEffect(() => {
  if (user && produto) {
    axios
      .get(`http://localhost:3001/api/favoritos/verificar/${user.id}/${produto.id}`)
      .then((res) => {
        setFavorito(res.data.favorito);
      })
      .catch((err) => console.error("Erro ao verificar favorito", err));
  }
}, [user, produto]);

const toggleFavorito = async () => {
  if (!user) {
    setMensagem("Faça login para guardar favoritos.");
    setOpenModal(true);
    return;
  }

  try {
    if (favorito) {
      await axios.delete("http://localhost:3001/api/favoritos/remover", {
        data: { id_utilizador: user.id, id_produto: produto.id }
      });
      setFavorito(false);
    } else {
      await axios.post("http://localhost:3001/api/favoritos/adicionar", {
        id_utilizador: user.id,
        id_produto: produto.id
      });
      setFavorito(true);
    }
  } catch (err) {
    console.error("Erro ao atualizar favorito", err);
    setMensagem("Erro ao atualizar favorito.");
    setOpenModal(true);
  }
};


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

  const renderProdutos = (produtos) => (  
    <div className={stylesHome.listaProdutos}>     
      {produtos.map((produto) => (
        <Link key={produto.id} to={`/produto/${produto.id}`} className={stylesHome.cardLink}>
          <div className={stylesHome.cardProduto}>        
            <h3>{produto.nome}</h3>
            {produto.imagem_url && (
              <img
                src={produto.imagem_url.startsWith("http://") || produto.imagem_url.startsWith("https://")
                  ? produto.imagem_url
                  : `http://localhost:3001${produto.imagem_url}`
                }
                alt={produto.nome}
                style={{
                  width: "100%",
                  height: "250px",
                  marginBottom: "10px",
                }}
              />
            )}
            <p><strong>Preço:</strong> {produto.preco}€</p>
            {produto.especificacoes && (
              <div>
                <h4>Detalhes:</h4>
                <ul>
                  {Object.entries(produto.especificacoes).map(([key, value]) => (
                    <li key={key}><strong>{key}:</strong> {value}</li>
                  ))}
                </ul>
              </div>
            )}
          </div>
        </Link>
      ))}
    </div>
  );

  return (
  <>
    <Navbar user={user} handleLogout={handleLogout} />

    <div style={{ display: "flex", flexDirection: "column", alignItems: "center" }}>
      <div className={styles.produtoContainer}>
        <div className={styles.colunaEsquerda}>
          <div className={styles.imagemContainer}>
            {produto.imagem_url && (
              <img src={produto.imagem_url} alt={produto.nome} className={styles.imagem} />
            )}
          </div>

          <section className={styles.detalhesSection}>
            <h2 className={styles.descricao}>{produto.descricao}</h2>
            <p><strong>Tipo de Produto:</strong> {produto.tipo_produto}</p>
            <p><strong>Marca:</strong> {produto.nome_marca}</p>
            {produto.especificacoes && (
              <div>
                <h4>Especificações:</h4>
                <ul>
                  {Object.keys(produto.especificacoes).map((key) => (
                    <li key={key}>
                      <strong>{key}:</strong> {produto.especificacoes[key]}
                    </li>
                  ))}
                </ul>
              </div>
            )}
          </section>
        </div>

        <div className={styles.infoFlutuante}>
          <h2 className={styles.titulo}>{produto.nome}</h2>
          <p className={styles.preco}>€{produto.preco}</p>
          <p className={styles.stock}>
            {produto.stock === 0 ? "Sem stock" : produto.stock < 10 ? "Poucas Unidades" : "Em stock"}
          </p>
          <strong><p className={styles.descricao}>{produto.descricao}</p></strong>
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
            <button onClick={toggleFavorito} className={styles.favoritoBtn}>
              {favorito ? <FaHeart color="red" /> : <FaRegHeart />}
            </button>
          </div>
        </div>
      </div>

      <section className={styles.tituloSecao}>
        <img
          src="https://img.globaldata.pt/cms/images/block/global-1banner-produtosemana25_1219-desktop.png"
          alt="imagem promoção"
        />
      </section>

      <section className={styles.secaoProdutos}>
        <h2 className={styles.tituloSecao}>Produtos em Destaque</h2>
        {produtosDestaque.length > 0 ? renderProdutos(produtosDestaque) : <p>Nenhum produto em destaque.</p>}
      </section>

      {openModal && (
        <ModalErro mensagem={mensagem} onClose={closeModal} produtos={produtoModal} />
      )}

      <Footer />
    </div>
  </>
);
}

export default ProdutoDetalhe;
