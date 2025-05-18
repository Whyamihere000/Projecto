import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import axios from 'axios';
import styles from '../css/Home.module.css';
import stylesGlobal from '../css/Global.module.css';

function Home() {
  const [user, setUser] = useState(null);
  const [todosProdutos, setTodosProdutos] = useState([]);

  useEffect(() => {
    const storedUser = localStorage.getItem('user');
    if (storedUser && storedUser !== 'undefined') {
      const user = JSON.parse(storedUser);
      if (user.tipo_utilizador === 'cliente') {
        setUser(user);
      }
    }
  }, []);

  const handleLogout = () => {
    localStorage.removeItem('user');
    window.location.reload();
  };

  useEffect(() => {
    document.body.className = styles.bodyHome;
    return () => {
      document.body.className = '';
    };
  }, []);

  useEffect(() => {
    const fetchProdutos = async () => {
      try {
        const res = await axios.get('http://localhost:3001/api/produtos/buscar/destaque');
        setTodosProdutos(res.data);
      } catch (error) {
        console.error('Erro ao buscar produtos:', error);
      }
    };

    fetchProdutos();
  }, []);

  const renderProdutos = (produtos) => (
    <div className={styles.listaProdutos}>
      {produtos.map((produto) => (
        <div key={produto.id} className={styles.cardProduto}>
          <h3>{produto.nome}</h3>
          {produto.imagem_url && (
            <img
              src={`http://localhost:3001${produto.imagem_url}`}
              alt={produto.nome}
              className={styles.imagemProduto}
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
      ))}
    </div>
  );

  return (
    <div className={styles.home}>
      <nav className={stylesGlobal.nav}>
        <div className={stylesGlobal.navLeft}>
          <img src="../icons/logo.png" alt="Logo" className={stylesGlobal.logoIcon} />
          <Link to="/" className={stylesGlobal.navHome}>Home</Link>
          <Link to="/produtos" className={stylesGlobal.navProdutos}>Produtos</Link>
          <div className={stylesGlobal.dropdown}>
            <button className={stylesGlobal.dropbtn}>Componentes▾</button>
            <div className={stylesGlobal.dropdownContent}>
              <Link to="/produtos?tipo_produto=Memória">Memória</Link>
              <Link to="/produtos?tipo_produto=Processador">Processador</Link>
              <Link to="/produtos?tipo_produto=Placa Gráfica">Placa Gráfica</Link>
              <Link to="/produtos?tipo_produto=MotherBoard">MotherBoard</Link>
              <Link to="/produtos?tipo_produto=Armazenamento">Armazenamento</Link>
              <Link to="/produtos?tipo_produto=Fonte de Alimentação">Fonte de Alimentação</Link>
              <Link to="/produtos?tipo_produto=Caixa">Caixas</Link>
              <Link to="/produtos?tipo_produto=Monitor">Monitor</Link>
              <Link to="/produtos?tipo_produto=Periféricos">Periféricos</Link>
            </div>
          </div>
        </div>

        <div className={stylesGlobal.navRight}>
          {user ? (
            <>
              <h4>{user.primeiro_nome}</h4>
              <button onClick={handleLogout}>Logout</button>
              <Link to="/carrinho" className={stylesGlobal.navCarrinho}>Carrinho</Link>
            </>
          ) : (
            <Link to="/login" className={stylesGlobal.navLogin}>Login</Link>
          )}
        </div>
      </nav>

      <main className={styles.mainHome}>
        <section>
          <h2 className={styles.tituloSecao}>Produtos em Destaque</h2>
          {todosProdutos.length > 0 ? renderProdutos(todosProdutos) : <p>Nenhum produto em destaque.</p>}
        </section>

        {/* <section>
          <h2 className={styles.tituloSecao}>Novidades</h2>
          {novidades.length > 0 ? renderProdutos(novidades) : <p>Sem novidades no momento.</p>}
        </section> */}
      </main>
    </div>
  );
}

export default Home;
