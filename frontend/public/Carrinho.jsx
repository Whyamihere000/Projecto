import { useState, useEffect } from "react";
import axios from "axios";
import { Link } from "react-router-dom";
import stylesCarrinho from "../css/Carrinho.module.css";
import styles from "../css/Global.module.css";

function Carrinho() {
  const [user, setUser] = useState(null);
  const [carrinho, setCarrinho] = useState({ items: [] });
  const [mensagem, setMensagem] = useState("");

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
          setCarrinho({
            ...response.data,
            items: response.data.items ?? []
          });
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
      const updateCarrinho = carrinho.items.filter(
        (item) => item.id_produto !== id_produto
      );
      setCarrinho({ ...carrinho, items: updateCarrinho });

      console.log("Remover item:", {
        id_carrinho: carrinho.id,
        id_produto,
      });

      const resposta = await axios.post(
        `http://localhost:3001/api/carrinhos/remover`,
        {
          id_carrinho: carrinho.id,
          id_produto,
        }
      );

      console.log("Resposta do servidor:", resposta.data);

      const total = updateCarrinho.reduce(
        (acc, item) => acc + item.quantidade * item.preco,
        0
      );

      await axios.put(`http://localhost:3001/api/carrinhos/${carrinho.id}`, {
        total,
      });
    } catch (error) {
      console.error("Erro ao remover item do carrinho:", error);
      setMensagem("Erro ao remover item do carrinho.");
    }
};

  const handleFinalizarCompra = async () => {
    if (!carrinho || carrinho.items.length === 0) {
      setMensagem("Carrinho vazio.");
      return;
    }

    try {
      await axios.post(`http://localhost:3001/api/carrinhos/finalizar`, {
        id_carrinho: carrinho.id,
      });

      setMensagem("Compra finalizada com sucesso.");
    } catch (error) {
      console.log(error);
      setMensagem("Erro ao finalizar compra.");
    }
  };

  return (
    <>
      <nav className={styles.nav}>
        <div className={styles.navLeft}>
          <Link to="/" className={styles.navHome}>Home</Link>
          <Link to="/produtos" className={styles.navProdutos}>Produtos</Link>
        </div>
        <div className={styles.navRight}>
          {user ? (
            <>
              <p>{user ? `${user.primeiro_nome}` : ''}</p>
              <p>
                <button onClick={() => { localStorage.removeItem('user'); window.location.reload(); }}>Logout</button>
              </p>
            </>
          ) : (
            <>
              <Link to="/login" className={styles.navLogin}>Login</Link>
            </>
          )}
        </div>
      </nav>
      <main className={stylesCarrinho.mainCarrinho}>
        <h1>Carrinho</h1>
        {mensagem && <p>{mensagem}</p>}

        {carrinho ? (
          <div>
            {carrinho.items.length > 0 ? (
              <div>
                {carrinho.items.map((item) => (
                  <div key={item.id_produto} className={stylesCarrinho.itemCarrinho}>
                    <h3>{item.nome}</h3>
                    <p>Quantidade: {item.quantidade}</p>
                    <p>Preço: {item.preco}€</p>
                    <button onClick={() => handleRemoverItem(item.id_produto)}>Remover</button>
                  </div>
                ))}
                <div className={stylesCarrinho.total}>
                  <p><strong>Total: {carrinho.total}€</strong></p>
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