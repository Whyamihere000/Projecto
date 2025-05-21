import { Link, useNavigate } from "react-router-dom";
import { useState, useEffect } from "react";
import axios from "axios";
import stylesCarrinho from "../css/Carrinho.module.css";
import styles from "../css/Global.module.css";
import Navbar from "../componentes/Navbar";

function Carrinho() {
  const [user, setUser] = useState(null);
  const [carrinho, setCarrinho] = useState({ items: [] });
  const [mensagem, setMensagem] = useState("");
  const [produtos, setProdutos] = useState([]);
  // const [rua, setRua] = useState("");
  // const [cidade, setCidade] = useState("");
  // const [codigoPostal, setCodigoPostal] = useState("");
  // const [pais, setPais] = useState("");
  // const [email, setEmail] = useState(user?.email || "");
  // const [telefone, setTelefone] = useState("");
  // const [nif, setNif] = useState("");
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

    // Atualiza o total no backend (opcional, dependendo do design do teu sistema)
    await axios.put(`http://localhost:3001/api/carrinhos/${carrinho.id}`, {
      total,
    });

    setMensagem(""); // Limpa a mensagem de erro se tudo correr bem

  } catch (error) {
    console.error("Erro ao remover item do carrinho:", error);
    setMensagem("Sucesso ao remover item do carrinho.");
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
        <h1>Carrinho</h1>
        {mensagem && (
        <p style={{ color: mensagem.includes("Erro") ? "red" : "green" }}>
          {mensagem}
        </p>
        )}
        {carrinho ? (
          <div>
            {carrinho.items.length > 0 ? (
              <div>
                {carrinho.items.map((item) => (
                  <div key={item.id_produto} className={stylesCarrinho.itemCarrinho}>
                    <h3>{item.nome}</h3>
                    {item.imagem_url && (
                          <img
                            src={
                              item.imagem_url.startsWith("http://") ||
                              item.imagem_url.startsWith("https://")
                                ? produto.imagem_url
                                : `http://localhost:3001${item.imagem_url}`
                            }
                            alt={item.nome}
                            style={{
                              width: "100%",
                              height: "auto",
                              marginBottom: "10px",
                            }}
                          />
                        )}
                    <p>Quantidade: {item.quantidade}</p>
                    <p>Preço: {item.preco}€</p>
                    <button onClick={() => handleRemoverItem(item.id_produto)}>Remover</button>
                  </div>
                ))}
                <div className={stylesCarrinho.total}>
                  <p><strong>Total: {carrinho.total.toFixed(2)}€</strong></p>
                  <button onClick={handleFinalizarCompra}>Finalizar Compra</button>
                </div>
              </div>
            ) : (
              <p>O seu carrinho está vazio.</p>
            )}
          </div>
        ) : (
          <p>Carregando carrinho...</p>
        )}
      </main>
    </>
  );
}

export default Carrinho;