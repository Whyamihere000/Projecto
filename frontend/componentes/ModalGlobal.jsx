import styles from '../css/Global.module.css'

function ModalGlobal({mensagem, onClose }) {
  return (    
    <div className={styles.modalOverlay}>
      <div className={styles.modalContent}>
        <h3>{mensagem}</h3>
        <button className={styles.buttonModal} onClick={onClose}>Fechar</button>
      </div>
    </div>
  ) 
}

export default ModalGlobal