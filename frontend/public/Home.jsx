import React, { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'
import styles from '../css/Home.module.css'
import stylesGlobal from '../css/Global.module.css'

function Home() {
  const [user, setUser] = useState(null)

  useEffect(() => {
    const storedUser = localStorage.getItem('user')
    if (storedUser && storedUser !== 'undefined') {
      const user = JSON.parse(storedUser)
      if (user.tipo_utilizador === 'cliente') {
        setUser(user)
      }
    }
  }, [])

  const handleLogout = () => {
    localStorage.removeItem('user')
    window.location.reload()
  }

  useEffect(() => {
    document.body.className = styles.bodyHome
    return () => {
      document.body.className = '' // Remove ao sair
    }
  }, [])

  return (
    <div className={styles.home}>
     <nav className={stylesGlobal.nav}>

      <div className={stylesGlobal.navLeft}>
            <img src="../icons/logo.png" alt="Logo" className={styles.logoIcon} />
                <Link to="/" className={stylesGlobal.navHome}>Home</Link>
                <Link to="/produtos" className={stylesGlobal.navProdutos}>Produtos</Link>

    <div className={stylesGlobal.dropdown}>
      <Link to="/produtos"><button className={stylesGlobal.dropbtn}>Componentes▾</button></Link>
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
        <Link to="/perfil" className={stylesGlobal.navNome}>{user.primeiro_nome}</Link>
        <button onClick={handleLogout} className={stylesGlobal.navLogout}>Logout</button>
      </>
    ) : (
      <Link to="/login" className={stylesGlobal.navLogin}>Login</Link>
    )}
  </div>
</nav>


      <main className={styles.main}>
        <section className={styles.section}>
          <h2>Explore o nosso site</h2>
        </section>

        <section className={styles.section}>
          <h2>Faça parte da nossa comunidade</h2>
        </section>
      </main>

      <footer className={styles.footer}>
        <p>&copy; 2025 PCGalaxy. Todos os direitos reservados.</p>
      </footer>
    </div>
  )
}

export default Home

