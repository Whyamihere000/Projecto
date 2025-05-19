import { Link } from "react-router-dom";
import styles from "../css/SucessoPagamento.module.css";

function SucessoPagamento() {
  return (
    <div className={styles.sucessoContainer}>
      <h1 className={styles.titulo}>Pagamento Concluído com Sucesso!</h1>
      <p className={styles.mensagem}>Obrigado pela sua compra. A sua encomenda está a ser processada.</p>
      <Link to="/" className={styles.linkBotao}>Voltar à página inicial</Link>
      <br />
      <Link to="/minhas-encomendas" className={styles.linkBotao}>Ver as minhas encomendas</Link>
    </div>
  );
}

export default SucessoPagamento;
