import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import axios from 'axios';

import styles from '../css/public/Home.module.css';
import stylesGlobal from '../css/Global.module.css';

import ComponentesNav from "../componentes/ComponentesNav";
import Navbar from '../componentes/Navbar';
import Footer from '../componentes/Footer';
import "react-responsive-carousel/lib/styles/carousel.min.css";
import { Carousel } from 'react-responsive-carousel';



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
        <Link key={produto.id} to={`/produto/${produto.id}`} className={styles.cardLink}>
          <div className={styles.cardProduto}>
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
    <div className={styles.home}>
      <Navbar user={user} handleLogout={handleLogout} />

      <section>
        <Carousel className={styles.carrosselContainer}
          autoPlay
          infiniteLoop
          showThumbs={false}
          showStatus={false}
          interval={5000}
          dynamicHeight={false}
        >
          <div>
            <img src="https://computerlounge.co.nz/cdn/shop/articles/RX_9070_Blog_main_banner_499f62a7-c08a-4bc8-999e-0a4e1a1459fa.jpg?v=1739147028&width=1600" alt="Promoção 1" />
          </div>
          <div>
            <img src="https://computerlounge.co.nz/cdn/shop/articles/RX_9070_Blog_main_banner_499f62a7-c08a-4bc8-999e-0a4e1a1459fa.jpg?v=1739147028&width=1600" alt="Promoção 2" />
          </div>
          <div>
            <img src="https://computerlounge.co.nz/cdn/shop/articles/RX_9070_Blog_main_banner_499f62a7-c08a-4bc8-999e-0a4e1a1459fa.jpg?v=1739147028&width=1600" alt="Promoção 3" />
          </div>
        </Carousel>
      </section>

      <main className={styles.mainHome}>
        <section className={styles.secaoProdutos}>
          <ComponentesNav/>
          <h2 className={styles.tituloSecao}>Produtos em Destaque</h2>
          {produtosDestaque.length > 0 ? renderProdutos(produtosDestaque) : <p>Nenhum produto em destaque.</p>}
        </section>

        <section className={styles.tituloSecao}> 
          <img src="https://img.globaldata.pt/cms/images/block/global-1banner-produtosemana25_1219-desktop.png" alt="imagem promoção" />
        </section>

        <section>
          <h2 className={styles.tituloSecao}>Novidades</h2>
          {novidades.length > 0 ? renderProdutos(novidades) : <p>Sem novidades no momento.</p>}
        </section>

        
      </main>
    </div>
    <Footer />
    </>
  );
}

export default Home;
