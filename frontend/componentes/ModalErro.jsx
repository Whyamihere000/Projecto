import { useState, useEffect } from "react";
import styles from '../css/Global.module.css'


function ModalErro({produtos, nome, mensagem, onClose }) {
  return (
    
    <div className={styles.modalOverlay}>
      <div className={styles.modalContent}>
        <h3>{produtos}</h3>
        <p>{mensagem}</p>
        <button className={styles.buttonModal} onClick={onClose}>Fechar</button>
      </div>
    </div>
  ) 
}

export default ModalErro