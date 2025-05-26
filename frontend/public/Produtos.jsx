import { useState, useEffect } from "react";
import axios from "axios";
import { useLocation, Link } from "react-router-dom";
import stylesProdutos from "../css/public/Produtos.module.css";
import ModalErro from "../componentes/ModalErro";
import Navbar from "../componentes/Navbar";
import Footer from "../componentes/Footer";
import FiltrosProdutos from "../componentes/Filtragem";
import "react-responsive-carousel/lib/styles/carousel.min.css";
import { Carousel } from 'react-responsive-carousel';

function Produtos() {
  const [produtoModal, setProdutoModal] = useState([]);
  const [user, setUser] = useState(null);
  const [produtos, setProdutos] = useState([]);
  const [mensagem, setMensagem] = useState("");
  const [carrinho, setCarrinho] = useState(null);
  const [openModal, setOpenModal] = useState(false);
  const [pesquisa, setPesquisa] = useState("");
  const [filtros, setFiltros] = useState({ marca: "", precoMax: "" });

  const location = useLocation();
  const queryParams = new URLSearchParams(location.search);
  const tipoProduto = queryParams.get("tipo_produto");
  const pesquisado = queryParams.get("pesquisa");

  useEffect(() => {
    const storedUser = localStorage.getItem("user");
    if (storedUser && storedUser !== "undefined") {
      const user = JSON.parse(storedUser);
      if (user.tipo_utilizador === "cliente") {
        setUser(user);
      }
    }
  }, []);

  useEffect(() => {
    const fetchProdutos = async () => {
      try {
        const res = await axios.get("http://localhost:3001/api/produtos/buscar", {
          params: { tipo_produto: tipoProduto, pesquisa: pesquisado },
        });
        setProdutos(res.data);
      } catch (error) {
        console.error("Erro ao carregar produtos", error);
        setMensagem("Erro ao carregar produtos.");
        setOpenModal(true);
      }
    };

    fetchProdutos();
  }, [tipoProduto, pesquisado]);

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

  const handleAdicionarAoCarrinho = async (produtoID, quantidade = 1) => {
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

    const produto = produtos.find((p) => p.id === produtoID);
    if (!produto) {
      setMensagem("Produto não encontrado.");
      setOpenModal(true);
      return;
    }
    setProdutoModal(produto);

    try {
      await axios.post("http://localhost:3001/api/carrinhos/adicionar", {
        id_carrinho: carrinho.id,
        id_produto: produtoID,
        quantidade,
        preco: produto.preco,
      });

      setMensagem("Produto adicionado ao carrinho.");
      setOpenModal(true);

      setCarrinho((prevCarrinho) => ({
        ...prevCarrinho,
        total: prevCarrinho.total + quantidade * produto.preco,
      }));

    } catch (error) {
      console.error("Erro ao adicionar ao carrinho", error);
      setMensagem("Erro ao adicionar ao carrinho.");
      setOpenModal(true);
    }
  };

  const handleLogout = async () => {
    localStorage.removeItem("user");
    window.location.reload();
  };

  const closeModal = () => {
    setOpenModal(false);
  };

  const produtosFiltrados = produtos
    .filter((produto) =>
      produto.nome.toLowerCase().includes(pesquisa.toLowerCase())
    )
    .filter((produto) => {
      if (filtros.marca && produto.nome_marca !== filtros.marca) return false;
      if (filtros.precoMax && produto.preco > parseFloat(filtros.precoMax)) return false;
      return true;
    });

  return (
    <>
      <div className={stylesProdutos.container}>
        <Navbar
          user={user}
          handleLogout={handleLogout}
          pesquisa={pesquisa}
          setPesquisa={setPesquisa}
        />

        <main className={stylesProdutos.mainPublic}>
          <div className={stylesProdutos.filtrosContainer}>
            <FiltrosProdutos filtros={filtros} setFiltros={setFiltros} />
          </div>

          <div className={stylesProdutos.produtosPublic}>
            <section>
                    <Carousel className={stylesProdutos.carrosselContainer}
                      autoPlay
                      infiniteLoop
                      showThumbs={false}
                      showStatus={false}
                      interval={5000}
                      dynamicHeight={false}
                    >
                      <div>
                        <img src="https://strapi-sitecms-prod.s3.eu-west-1.amazonaws.com/Dias_Pcdiguianos_D_24_Maio_2_Junho_2025_701833c550.jpg" alt="Promoção 1" />
                      </div>
                      <div>
                        <img src="https://eu2.flavedo.io/citrus/_j2Bcn7g4mWManBpxUGBv3E9MFvFdZaaqooJ9ZZ6rA4=" alt="Promoção 2" />
                      </div>
                      <div>
                        <img src="https://eu2.flavedo.io/citrus/urWjsPy783cgzx0on844zJnzevia2UVGmjx8IeVWG0I=" alt="Promoção 3" />
                      </div>
                        <div>
                        <img src="https://eu2.flavedo.io/citrus/lKM5XqdRD1aS2dgyWf-ye2iAP1koXscrNvFpH7W-VZQ=" alt="Promoção 4" />
                      </div>
                        <div>
                        <img src="https://eu2.flavedo.io/citrus/1kTUcnIW5xROaQINZRDMLLTr8jqX1ZIOkTfTastyI4M=" alt="Promoção 5" />
                      </div>
                    </Carousel>
            </section>
            <h1 className={stylesProdutos.TitleProdutos}>Produtos</h1>
            {produtosFiltrados.length > 0 ? (
              produtosFiltrados.map((produto) => (
                <Link className={stylesProdutos.divalink}
                  key={produto.id}
                  to={`/produto/${produto.id}`}
                  style={{
                    textDecoration: "none",
                    color: "inherit",
                    border: "1px solid #ccc",
                    padding: "10px",
                    width: "315px",
                    margin: "10px",
                    display: "flex",
                    flexDirection: "column",
                    position: "relative",
                  }}
                >
                  <h3>{produto.nome}</h3>
                  <p>{produto.sku}</p>

                  {produto.imagem_url && (
                    <img
                      src={
                        produto.imagem_url.startsWith("http://") ||
                        produto.imagem_url.startsWith("https://")
                          ? produto.imagem_url
                          : `http://localhost:3001${produto.imagem_url}`
                      }
                      alt={produto.nome}
                      style={{
                        width: "100%",
                        height: "auto",
                        marginBottom: "10px",
                      }}
                    />
                  )}

                  <p>{produto.descricao}</p>
                  <p>
                    <strong>Preço:</strong> {produto.preco}€
                  </p>
                  <p>
                    <strong>Tipo de Produto:</strong> {produto.tipo_produto}
                  </p>
                  <p>
                    <strong>Marca:</strong> {produto.nome_marca}
                  </p>

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

                  <div
                    style={{
                      marginTop: "auto",
                      textAlign: "center",
                    }}
                    onClick={(e) => e.preventDefault()}
                  >
                    <button
                      onClick={(e) => {
                        e.preventDefault();
                        handleAdicionarAoCarrinho(produto.id);
                      }}
                    >
                      Adicionar ao carrinho
                    </button>
                  </div>
                </Link>
              ))
            ) : (
              <p>Nenhum produto disponível.</p>
            )}
          </div>
        </main>

        {openModal && (
          <ModalErro mensagem={mensagem} onClose={closeModal} produtos={produtoModal} />
        )}        
      </div>
      <Footer />
    </>
  );
}

export default Produtos;
