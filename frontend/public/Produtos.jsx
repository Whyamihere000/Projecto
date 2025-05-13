import { useState, useEffect, useContext } from "react";
import axios from "axios";
import { Link } from "react-router-dom";
import stylesProdutos from "../css/Produtos.module.css";
import styles from "../css/Global.module.css";

function Produtos() {
  const [user, setUser] = useState(null);
  const [produtos, setProdutos] = useState([]);
  const [mensagem, setMensagem] = useState('');
  const [carrinho, setCarrinho] = useState([]);

  useEffect(() => {
    const storedUser = localStorage.getItem('user')
    if (storedUser && storedUser !== 'undefined') {
      const user = JSON.parse(storedUser);
      if (user.tipo_utilizador === 'cliente') {
        setUser(user)
      }
    }
  }, [])

  useEffect(() => {
    const fetchProdutos = async () => {
      try {
        const res = await axios.get('http://localhost:3001/api/produtos/buscar');
        setProdutos(res.data);
      } catch (error) {
        console.error('Erro ao carregar produtos', error);
        setMensagem('Erro ao carregar produtos.');
      }
    }

    fetchProdutos();

    if (user) {
      axios.get(`http://localhost:3001/api/carrinhos/${user.id}`)
      .then((response) => {
        setCarrinho(response.data);
      })
      .catch((error) => {
        console.log(error);
        setMensagem('Erro ao carregar carrinho.');
      })
    }
  }, [user]);

  const handleAdicionarAoCarrinho = async (produtoID, quantidade = 1) => {
    if (!carrinho) {
      setMensagem('Carrinho não encontrado.');
      return;
    }

    const preco = produtos.find(produto => produto.id === produtoID)?.preco;
    if (!preco) {
      setMensagem('Produto não encontrado.');
      return;
    }

    try {
      const response = await axios.post('http://localhost:3001/api/carrinhos/adicionar', {
        id_carrinho: carrinho.id,
        id_produto: produtoID,
        quantidade,
        preco
      });


      setMensagem(response.data.message);

      setCarrinho((prevCarrinho) => ({
        ...prevCarrinho,
        total: prevCarrinho.total + (quantidade * preco)
      }));
    } catch (error) {
      console.error('Erro ao adicionar ao carrinho', error);
      setMensagem('Erro ao adicionar ao carrinho.');
    }
  }

  const handleLogout = () => {
    localStorage.removeItem('user')
    window.location.reload()
  }

  useEffect(() => {
    document.body.className = stylesProdutos.bodyHomePublic
    return () => {
      document.body.className = '' // Remove ao sair
    }
  }, [])

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
                <button onClick={handleLogout}>Logout</button>
              </p>
            </>
          ) : (
            <>
              <Link to="/login" className={styles.navLogin}>Login</Link>
            </>
          )}
        </div>
      </nav>
      <main className={stylesProdutos.mainPublic}>
        <div className={stylesProdutos.produtosPublic}>
          <h1>Produtos</h1>
          {mensagem && <p>{mensagem}</p>}
          {produtos.length > 0 ? (
            produtos.map((produto) => (
              <div key={produto.id} style={{ border: '1px solid #ccc', padding: '10px', width: '200px' }}>
                <h3>{produto.nome}</h3>
                <p>{produto.descricao}</p>
                <p>{produto.preco}€</p>
                <button onClick={() => handleAdicionarAoCarrinho(produto.id)}>Adicionar ao carrinho</button>
              </div>
            ))
          ) : (
            <p>Nenhum produto disponível.</p>
          )}
        </div>
      </main>
    </>
  )
}

export default Produtos;
