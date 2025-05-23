import { useState, useEffect } from "react";
import axios from "axios";
import styles from "../css/Contactos.module.css";
import Navbar from "../componentes/Navbar";
import SubNavbar from "../componentes/SubNavbar";

function Contactos() {
  const [formData, setFormData] = useState({ nome: "", email: "", mensagem: "" });
  const [status, setStatus] = useState("");

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  useEffect(() => {
    document.body.className = styles.bodyHome;
    return () => {
      document.body.className = "";
    };
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setStatus("");
    try {
      await axios.post("http://localhost:3001/api/contactos", formData);
      setStatus("success");
      setFormData({ nome: "", email: "", mensagem: "" });
    } catch (err) {
      console.error(err);
      setStatus("error");
    }
  };

  return (
    <>
      <Navbar />
      <SubNavbar />
      <div className={styles.contactContainer}>
        <h2 className={styles.contactTitle}>Contacta-nos</h2>
        <form onSubmit={handleSubmit} className={styles.contactForm}>
          <div className={styles.formGroup}>
            <label htmlFor="nome" className={styles.formLabel}>Nome:</label>
            <input
              id="nome"
              name="nome"
              type="text"
              className={styles.formInput}
              value={formData.nome}
              onChange={handleChange}
              required
            />
          </div>
          <div className={styles.formGroup}>
            <label htmlFor="email" className={styles.formLabel}>Email:</label>
            <input
              id="email"
              name="email"
              type="email"
              className={styles.formInput}
              value={formData.email}
              onChange={handleChange}
              required
            />
          </div>
          <div className={styles.formGroup}>
            <label htmlFor="mensagem" className={styles.formLabel}>Mensagem:</label>
            <textarea
              id="mensagem"
              name="mensagem"
              rows="5"
              className={styles.formTextarea}
              value={formData.mensagem}
              onChange={handleChange}
              required
              style={{ resize: "none" }}
            ></textarea>
          </div>
          <button type="submit" className={styles.submitButton}>Enviar</button>
          {status === "success" && (
            <p className={styles.successMessage}>Mensagem enviada com sucesso!</p>
          )}
          {status === "error" && (
            <p className={styles.errorMessage}>Erro ao enviar mensagem. Tente novamente.</p>
          )}
        </form>
      </div>
    </>
  );
}

export default Contactos;
