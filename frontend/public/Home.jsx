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
        </div>
        <div className={stylesGlobal.navRight}>
          {user ? (
            <>
              <p>{user ? `${user.primeiro_nome}` : ''}</p>
              <p>
                <button onClick={handleLogout}>Logout</button>
              </p>
            </>
          ) : (
            <>
              <Link to="/login" className={stylesGlobal.navLogin}>Login</Link>
            </>
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
        <p>&copy; 2023 PCGalaxy. Todos os direitos reservados.</p>
      </footer>
    </div>
  )
}

export default Home

