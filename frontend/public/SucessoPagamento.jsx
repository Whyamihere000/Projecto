import { Link } from "react-router-dom";
import styles from "../css/Global.module.css";

function SucessoPagamento() {
  return (
    <div className={styles.container}>
      <h1>Pagamento Concluído com Sucesso!</h1>
      <p>Obrigado pela sua compra. A sua encomenda está a ser processada.</p>
      <Link to="/">Voltar à página inicial</Link>
      <br />
      <Link to="/minhas-encomendas">Ver as minhas encomendas</Link>
    </div>
  );
}

export default SucessoPagamento;