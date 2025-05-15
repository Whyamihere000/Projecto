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
    <Link to="/produtos" className={stylesGlobal.navProdutos}>Produtos</Link>

    <div className={stylesGlobal.dropdown}>
      <button className={stylesGlobal.dropbtn}>Componentes ▾</button>
      <div className={stylesGlobal.dropdownContent}>
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

  <div className={stylesGlobal.navRight}>
    {user ? (
      <>
        <p>{user.primeiro_nome}</p>
        <button onClick={handleLogout}>Logout</button>
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

