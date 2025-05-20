import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import axios from 'axios';
import styles from '../css/Home.module.css';
import stylesGlobal from '../css/Global.module.css';
import Navbar from '../componentes/Navbar';

function Home() {
  const [user, setUser] = useState(null);
  const [produtosDestaque, setProdutosDestaque] = useState([]);
  const [novidades, setNovidades] = useState([]);

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

  const renderProdutos = (produtos) => (
    <div className={styles.listaProdutos}>
      {produtos.map((produto) => (
        <div key={produto.id} className={styles.cardProduto}>
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
      <Navbar user={user} handleLogout={handleLogout} />

      <main className={styles.mainHome}>
        <section className={styles.secaoProdutos}>
          <h2 className={styles.tituloSecao}>Produtos em Destaque</h2>
          {produtosDestaque.length > 0 ? renderProdutos(produtosDestaque) : <p>Nenhum produto em destaque.</p>}
        </section>

        <section>
          <h2 className={styles.tituloSecao}>Novidades</h2>
          {novidades.length > 0 ? renderProdutos(novidades) : <p>Sem novidades no momento.</p>}
        </section>
      </main>
    </div>
  );
}

export default Home;
