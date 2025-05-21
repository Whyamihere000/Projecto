import { useState, useEffect } from "react";
import styles from '../css/Global.module.css'


function ModalErro({produto, produtos, nome, mensagem, onClose }) {
  return (
    
    <div className={styles.modalOverlay}>
      <div className={styles.modalContent}>
        <h3>{produtos}</h3>
         {produtos.imagem_url && (
                          <img
                            src={
                              produtos.imagem_url.startsWith("http://") ||
                              produtos.imagem_url.startsWith("https://")
                                ? produto.imagem_url
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
        <button className={styles.buttonModal} onClick={onClose}>Fechar</button>
      </div>
    </div>
  ) 
}

export default ModalErro