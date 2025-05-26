import { useNavigate } from 'react-router-dom'
import styles from '../css/Global.module.css'


function ModalErro({produtos, mensagem, onClose }) {

  const navigate = useNavigate();

  return (
    
    <div className={styles.modalOverlay}>
      <div className={styles.modalContent}>
        <h3>{produtos.nome}</h3>
         {produtos.imagem_url && (
          <img
            src={
            produtos.imagem_url.startsWith("http://") ||
            produtos.imagem_url.startsWith("https://")
             ? produtos.imagem_url
             : `http://localhost:3001${produtos.imagem_url}`
            }
            alt={produtos.nome}
              style={{
                width: "100%",
                height: "auto",
                marginBottom: "10px",
            }}
           />
          )}
        <p>{mensagem}</p>
        <button className={styles.buttonModal} onClick={onClose}>Continuar a Comprar</button>
        <button className={styles.buttonModal} onClick={() => navigate('/carrinho')}>Ir Para o Carrinho</button>
      </div>
    </div>
  ) 
}

export default ModalErro