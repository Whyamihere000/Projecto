import { Link, useNavigate } from "react-router-dom";
import { useState, useEffect } from "react";
import axios from "axios";
import stylesCarrinho from "../css/public/Carrinho.module.css";
import styles from "../css/Global.module.css";
import Navbar from "../componentes/Navbar";
import Footer from "../componentes/Footer";


import "react-responsive-carousel/lib/styles/carousel.min.css";
import { Carousel } from 'react-responsive-carousel';

function Carrinho() {
  const [user, setUser] = useState(null);
  const [carrinho, setCarrinho] = useState({ items: [] });
  const [mensagem, setMensagem] = useState("");
  const navigate = useNavigate();

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
    if (user) {
      axios.get(`http://localhost:3001/api/carrinhos/${user.id}`)
        .then((response) => {
          const items = response.data.items ?? [];
          const total = items.reduce((acc, item) => acc + item.quantidade * item.preco, 0);

          setCarrinho({
            ...response.data,
            items: items,
            total: total
          });

          setMensagem("");
        })
        .catch((error) => {
          console.log(error);
          setMensagem("Erro ao carregar o carrinho.");
        });
    }
  }, [user]);

  const handleRemoverItem = async (id_produto) => {
  if (!carrinho) {
    setMensagem("Carrinho não encontrado.");
    return;
  }

  try {
    console.log("Remover item:", {
      id_carrinho: carrinho.id,
      id_produto,
    });

    // Primeiro remove do backend
    const resposta = await axios.post(
      `http://localhost:3001/api/carrinhos/remover`,
      {
        id_carrinho: carrinho.id,
        id_produto,
      }
    );

    console.log("Resposta do servidor:", resposta.data);

    // Depois atualiza o estado local
    const updateCarrinho = carrinho.items.filter(
      (item) => item.id_produto !== id_produto
    );
    const total = updateCarrinho.reduce(
      (acc, item) => acc + item.quantidade * item.preco,
      0
    );

    setCarrinho({ ...carrinho, items: updateCarrinho, total });

    setMensagem(""); // Limpa a mensagem de erro se tudo correr bem

  } catch (error) {
    console.error("Erro ao remover item do carrinho:", error);
    setMensagem("Erro ao remover item do carrinho.");
  }
};

  // const handleFinalizarCompra = async () => {
  //   if (!carrinho || carrinho.items.length === 0) {
  //     setMensagem("Carrinho vazio.");
  //     return;
  //   }

  //   try {
  //     await axios.post(`http://localhost:3001/api/encomendas/nova`, {
  //       id_carrinho: carrinho.id,
  //       morada
  //     });

  //     setMensagem("Compra finalizada com sucesso.");
  //     navigate("/encomendas");
  //   } catch (error) {
  //     console.error("Erro ao finalizar a compra:", error);
  //     setMensagem("Erro ao finalizar compra.");
  //   }
  // };
  const handleFinalizarCompra = () => {
  if (!carrinho || carrinho.items.length === 0) {
    setMensagem("Carrinho vazio.");
    return;
  }  

  // Passar o id do carrinho para a página de finalizar encomenda
  navigate("/finalizar-encomenda", { state: { idCarrinho: carrinho.id } });  
};  

const handleLogout = () => {
    localStorage.removeItem('user');
    window.location.reload();
  };

  return (
    <>
      <Navbar user={user} handleLogout={handleLogout} />
      <main className={stylesCarrinho.mainCarrinho}>
        <br />
        <h1 className={stylesCarrinho.Carrinhoh1}>Carrinho</h1>
        {mensagem && (
        <p style={{ color: mensagem.includes("Erro") ? "red" : "green" }}>
          {mensagem}
        </p>
        )}
        {carrinho ? (
          <div>
           {carrinho.items.length > 0 ? (
              <>
                <div className={stylesCarrinho.itensCarrinhoContainer}>
                  {carrinho.items.map((item) => (
                    <Link
                      key={item.id_produto}
                      to={`/produto/${item.id_produto}`}
                      className={stylesCarrinho.itemLink}
                    >
                      <div className={stylesCarrinho.itemCarrinho}>
                        <h3>{item.nome}</h3>
                        {item.imagem_url && (
                          <img
                            src={
                              item.imagem_url.startsWith("http://") || item.imagem_url.startsWith("https://")
                                ? item.imagem_url
                                : `http://localhost:3001${item.imagem_url}`
                            }
                            alt={item.nome}
                            className={stylesCarrinho.imagemProduto}
                          />
                        )}
                        <p>Quantidade: {item.quantidade}</p>
                        <p>Preço: {item.preco}€</p>
                        <button
                          className={stylesCarrinho.removerItem}
                          onClick={(e) => {
                            e.preventDefault();
                            handleRemoverItem(item.id_produto);
                          }}>Remover
                        </button>
                      </div>     
                    </Link>
                  ))}
                </div>
                {/* Finalizar compra e total */}
                <div className={stylesCarrinho.total}> 
                  <p><strong>Total: {carrinho.total.toFixed(2)}€</strong></p>
                  <button onClick={handleFinalizarCompra}>Finalizar Compra</button>
                </div>

                 <Carousel className={stylesCarrinho.carrosselContainer}
                                      autoPlay
                                      infiniteLoop
                                      showThumbs={false}
                                      showStatus={false}
                                      interval={5000}
                                      dynamicHeight={false}
                                    >
                                      <div>
                                        <img src="https://img.globaldata.pt/homepage/banner/desktop-raider-18-titan-18.png?auto=compress%2Cformat&fit=max&q=70&w=1946" alt="Promoção 1" />
                                      </div>
                                      <div>
                                        <img src="https://img.globaldata.pt/homepage/banner/desktop-nvidia-rtx-5060.png?auto=compress%2Cformat&fit=max&q=70&w=1946" alt="Promoção 2" />
                                      </div>
                                      <div>
                                        <img src="https://img.globaldata.pt/homepage/banner/desktop-kingmod2.png?auto=compress%2Cformat&fit=max&q=70&w=1446" alt="Promoção 3" />
                                      </div>
                                    </Carousel>
              </>
            ) : (
              <p>O seu carrinho está vazio.</p>
            )}
          </div>          
        ) : (
          <p>Carregando carrinho...</p>
        )}       
      </main>  
      <Footer />
    </>
  );
}

export default Carrinho;