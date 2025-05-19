import { Link } from "react-router-dom";
import styles from "../css/Global.module.css";

function Navbar({ user, handleLogout, pesquisa, setPesquisa}) {
  return (
    <nav className={styles.nav}>
      <div className={styles.navLeft}>
        <img src="../icons/logo.png" alt="Logo" className={styles.logoIcon} />
        <Link to="/" className={styles.navHome}>Home</Link>
        <Link to="/produtos" className={styles.navProdutos}>Produtos</Link>

        <div className={styles.dropdown}>
          <Link to="/produtos"><button className={styles.dropbtn}>Componentes ▾</button></Link>
          <div className={styles.dropdownContent}>
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

      <div className={styles.navCenter}>
        <input
          type="text"
          placeholder="Pesquisar produto..."
          value={pesquisa}
          onChange={(e) => setPesquisa(e.target.value)}
          className={styles.inputPesquisa}
        />
      </div>

      <div className={styles.navRight}>
        {user ? (
          <>
            <h4>{user.primeiro_nome}</h4>
            <button onClick={handleLogout}>Logout</button>
            <Link to="/carrinho" className={styles.navCarrinho}>Carrinho</Link>
          </>
        ) : (
          <Link to="/login" className={styles.navLogin}>Login</Link>
        )}
      </div>
    </nav>
  );
}

export default Navbar;