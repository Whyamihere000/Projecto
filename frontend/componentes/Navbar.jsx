import { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import styles from "../css/Global.module.css";

function Navbar({ user, handleLogout, pesquisa, setPesquisa}) {
  const navigate = useNavigate();

  // Estado local para o input
  const [inputValue, setInputValue] = useState(pesquisa || "");

  // Sincroniza o inputValue quando pesquisa muda (ex: ao limpar a pesquisa no pai)
  useEffect(() => {
    setInputValue(pesquisa || "");
  }, [pesquisa]);

  // Atualiza pesquisa global só ao carregar Enter
  const handleKeyDown = (e) => {
    if (e.key === "Enter" && inputValue.trim() !== "") {
      navigate(`/produtos?pesquisa=${encodeURIComponent(inputValue.trim())}`);
    }

    if (e.key === "Enter" && inputValue.trim() === "") {
      navigate("/produtos");
    }
  };
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
          value={inputValue}
          onChange={(e) => setInputValue(e.target.value)}          
          onKeyDown={handleKeyDown}
          className={styles.inputPesquisa}
        />
        {/* <button onClick={() => {
          if (inputValue.trim() !== '') {
            navigate(`/produtos?pesquisa=${encodeURIComponent(inputValue.trim())}`);
          }
          }}>
            Pesquisar
        </button> */}
      </div>

      <div className={styles.navRight}>
        {user ? (
          <>
            <Link to={'/perfil'} className={styles.navPerfil}>{user.primeiro_nome}</Link>
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