import { Link } from "react-router-dom";
import styles from "../css/public/SucessoPagamento.module.css";
import Navbar from "../componentes/Navbar";
import { useEffect, useState } from "react";

function SucessoPagamento() {
  const [user, setUser] = useState(null);

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

  return (
    <div className={styles.pageContainer}>
      <Navbar user={user} handleLogout={handleLogout} />
      <div className={styles.mainContent}>
        <div className={styles.sucessoContainer}>
          <h1 className={styles.titulo}>Pagamento Concluído com Sucesso!</h1>
          <p className={styles.mensagem}>Obrigado pela sua compra. A sua encomenda está a ser processada.</p>
          <Link to="/" className={styles.linkBotao}>Voltar à página inicial</Link>
          <br />
          <Link to="/Perfil" className={styles.linkBotao}>Ver as minhas encomendas</Link>
        </div>
      </div>
    </div>
  );
}

export default SucessoPagamento;
