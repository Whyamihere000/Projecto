import { useState, useEffect } from "react";
import axios from "axios";
import { Link, useLocation } from "react-router-dom";
import stylesProdutos from "../css/Produtos.module.css";
import styles from "../css/Global.module.css";
import ModalErro from "../componentes/ModalErro";
import Navbar from "../componentes/Navbar";
import FiltrosProdutos from "../componentes/Filtragem";

function Produtos() {
  const [user, setUser] = useState(null);
  const [produtos, setProdutos] = useState([]);
  const [mensagem, setMensagem] = useState("");
  const [carrinho, setCarrinho] = useState([]);
  const [openModal, setOpenModal] = useState(false);
  const [pesquisa, setPesquisa] = useState("");
  const [filtros, setFiltros] = useState({marca: '', precoMax: ''});
  const location = useLocation();
  const queryParams = new URLSearchParams(location.search);
  const tipoProduto = queryParams.get("tipo_produto");

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
          params: { tipo_produto: tipoProduto },
        });
        setProdutos(res.data);
      } catch (error) {
        console.error("Erro ao carregar produtos", error);
        setMensagem("Erro ao carregar produtos.");
        setOpenModal(true);
      }
    };

    fetchProdutos();

    if (user) {
      axios
        .get(`http://localhost:3001/api/carrinhos/${user.id}`)
        .then((response) => {
          setCarrinho(response.data);
        })
        .catch((error) => {
          console.log(error);
          setMensagem("Erro ao carregar carrinho.");
          setOpenModal(true);
        });
    }
  }, [user, tipoProduto]);

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

    const preco = produtos.find((produto) => produto.id === produtoID)?.preco;
    if (!preco) {
      setMensagem("Produto não encontrado.");
      setOpenModal(true);
      return;
    }

    try {
      await axios.post("http://localhost:3001/api/carrinhos/adicionar", {
        id_carrinho: carrinho.id,
        id_produto: produtoID,
        quantidade,
        preco,
      });

      setMensagem("Produto adicionado ao carrinho.");
      setOpenModal(true);

      setCarrinho((prevCarrinho) => ({
        ...prevCarrinho,
        total: prevCarrinho.total + quantidade * preco,
      }));

      setTimeout(() => {
        setOpenModal(false);
      }, 1000);
    } catch (error) {
      console.error("Erro ao adicionar ao carrinho", error);
      setMensagem("Erro ao adicionar ao carrinho.");
      setOpenModal(true);
    }
  };

  const handleLogout = async () => {
    const storedUser = localStorage.getItem("user");

    if (storedUser) {
      const user = JSON.parse(storedUser);

      try {
        await axios.post("http://localhost:3001/api/carrinhos/eliminar", {
          id_utilizador: user.id,
        });
      } catch (error) {
        console.error("Erro ao eliminar o carrinho:", error);
      }
    }

    localStorage.removeItem("user");
    window.location.reload();
  };

  useEffect(() => {
    document.body.className = stylesProdutos.bodyHomePublic;
    return () => {
      document.body.className = "";
    };
  }, []);

  const closeModal = () => {
    setOpenModal(false);
  };

  // const useQuery = () => {
  //   return new URLSearchParams(useLocation().search);
  // };

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
        <div>
          <FiltrosProdutos filtros={filtros} setFiltros={setFiltros} />
        </div>
        <div className={stylesProdutos.produtosPublic}>
          <h1>Produtos</h1>
          {produtos.length > 0 ? (
            produtos
    .filter((produto) =>
      produto.nome.toLowerCase().includes(pesquisa.toLowerCase())
    )
    .filter((produto) => {
      if (filtros.marca && produto.nome_marca !== filtros.marca) return false;
      if (filtros.precoMax && produto.preco > parseFloat(filtros.precoMax)) return false;
      return true;
    })
              .map((produto) => (
              <div
                key={produto.id}
                style={{
                  border: "1px solid #ccc",
                  padding: "10px",
                  width: "250px",
                  margin: "10px",
                  display: "flex",
                  flexDirection: "column",
                }}
              >
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

                {/* Botão alinhado ao fundo e centralizado */}
                <div style={{ marginTop: "auto", textAlign: "center" }}>
                  <button onClick={() => handleAdicionarAoCarrinho(produto.id)}>
                    Adicionar ao carrinho
                  </button>
                </div>
              </div>

                            
                              
              ))
          ) : (
            <p>Nenhum produto disponível.</p>
          )}
        </div>
      </main>

      {openModal && (
        <ModalErro mensagem={mensagem} onClose={closeModal} />
      )}
      </div>
    </>
  );
}

export default Produtos;