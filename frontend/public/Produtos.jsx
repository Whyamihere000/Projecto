import { useState, useEffect, useContext } from "react";
import axios from "axios";
import { Link } from "react-router-dom";
import stylesProdutos from "../css/Produtos.module.css";
import styles from "../css/Global.module.css";
import ModalErro from "../components/ModalErro";

function Produtos() {
  const [user, setUser] = useState(null);
  const [produtos, setProdutos] = useState([]);
  const [mensagem, setMensagem] = useState('');
  const [carrinho, setCarrinho] = useState([]);
  const [openModal, setOpenModal] = useState(false);

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
        setOpenModal(true);
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
        setOpenModal(true);
      })
    }
  }, [user]);

  const handleAdicionarAoCarrinho = async (produtoID, quantidade = 1) => {
    if (!user) {
      setMensagem('Faça login para adicionar ao carrinho.');
      setOpenModal(true);
      return;
    }

    if (!carrinho) {
      setMensagem('Carrinho não encontrado.');
      setOpenModal(true);
      return;
    }

    const preco = produtos.find(produto => produto.id === produtoID)?.preco;
    if (!preco) {
      setMensagem('Produto não encontrado.');
      setOpenModal(true);
      return;
    }

    try {
      const response = await axios.post('http://localhost:3001/api/carrinhos/adicionar', {
        id_carrinho: carrinho.id,
        id_produto: produtoID,
        quantidade,
        preco
      });


      setMensagem('Produto adicionado ao carrinho.');
      setOpenModal(true);

      setCarrinho((prevCarrinho) => ({
        ...prevCarrinho,
        total: prevCarrinho.total + (quantidade * preco)
      }));

      setTimeout(() => {
        setOpenModal(false);
      }, 1000);

    } catch (error) {
      console.error('Erro ao adicionar ao carrinho', error);
      setMensagem('Erro ao adicionar ao carrinho.');
      setOpenModal(true);
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

  const closeModal = () => {
    setOpenModal(false);
  };

  return (
    <>
  <nav className={styles.nav}>
  {/* ESQUERDA: Ícone + Links */}
  <div className={styles.navLeft}>
    <img src="../icons/logo.png" alt="Logo" className={styles.logoIcon} />
    <Link to="/" className={styles.navHome}>Home</Link>
    <Link to="/produtos" className={styles.navProdutos}>Produtos</Link>

    {/* Submenu Componentes */}
    <div className={styles.dropdown}>
      <button className={styles.dropbtn}>Componentes ▾</button>
      <div className={styles.dropdownContent}>
        <Link to="/produtos?categoria=Memória">Memória</Link>
        <Link to="/produtos?categoria=Processador">Processador</Link>
        <Link to="/produtos?categoria=Placa Gráfica">Placa Gráfica</Link>
        <Link to="/produtos?categoria=MotherBoard">MotherBoard</Link>
        <Link to="/produtos?categoria=Armazenamento">Armazenamento</Link>
        <Link to="/produtos?categoria=Fonte de Alimentação">Fonte de Alimentação</Link>
        <Link to="/produtos?categoria=Caixas">Caixas</Link>
        <Link to="/produtos?categoria=Monitor">Monitor</Link>
        <Link to="/produtos?categoria=Periféricos">Periféricos</Link>
      </div>
    </div>
  </div>

  {/* CENTRO: Barra de Pesquisa */}
  <div className={styles.navCenter}>

  </div>

  {/* DIREITA: Carrinho + Utilizador */}
  <div className={styles.navRight}>

    {user ? (
      <>

        <h4>{user.primeiro_nome}</h4>
        <button onClick={handleLogout}>Logout</button>
      </>
    ) : (
      <Link to="/login" className={styles.navLogin}>Login</Link>
    )}
  </div>
  <Link to="/carrinho" className={styles.navCarrinho}>Carrinho</Link>
</nav>



      <main className={stylesProdutos.mainPublic}>
        <div className={stylesProdutos.produtosPublic}>
  <h1>Produtos</h1>
  {produtos.length > 0 ? (
    produtos.map((produto) => (
      <div key={produto.id} style={{ border: '1px solid #ccc', padding: '10px', width: '250px', margin: '10px' }}>
        <h3>{produto.nome}</h3>
        {produto.imagem_url && (
          <img 
            src={`http://localhost:3001${produto.imagem_url}`} 
            alt={produto.nome} 
            style={{ width: '100%', height: 'auto', marginBottom: '10px' }} 
          />
        )}
        <p>{produto.descricao}</p>
        <p><strong>Preço:</strong> {produto.preco}€</p>
        <p><strong>Tipo de Produto:</strong> {produto.tipo_produto}</p>

        {produto.especificacoes && (
          <div>
            <h4>Especificações:</h4>
            <ul>
              {Object.keys(produto.especificacoes).map(key => (
                <li key={key}><strong>{key}:</strong> {produto.especificacoes[key]}</li>
              ))}
            </ul>
          </div>
        )}

        <button onClick={() => handleAdicionarAoCarrinho(produto.id)}>Adicionar ao carrinho</button>
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
    </>
  )
}

export default Produtos;
