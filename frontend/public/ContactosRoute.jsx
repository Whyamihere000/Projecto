import { useState, useEffect } from "react";
import axios from "axios";
import styles from "../css/public/Contactos.module.css";
import Navbar from "../componentes/Navbar";
import SubNavbar from "../componentes/SubNavbar";
import { Link } from "react-router-dom";
import Footer from "../componentes/Footer";

function Contactos() {
  const [user, setUser] = useState(null);
  const [formData, setFormData] = useState({ nome: "", email: "", mensagem: "" });
  const [status, setStatus] = useState("");

  useEffect(() => {
    const storedUser = localStorage.getItem('user');
    if (storedUser && storedUser !== 'undefined') {
      const user = JSON.parse(storedUser);
      if (user.tipo_utilizador === 'cliente') {
        setUser(user);
      }
    }
  }, []);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleLogout = () => {
    localStorage.removeItem('user');
    window.location.reload();
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setStatus("");
    try {
      await axios.post("http://localhost:3001/api/contactos/contactos", formData);
      setStatus("success");
      setFormData({ nome: "", email: "", mensagem: "" });
    } catch (err) {
      console.error(err);
      setStatus("error");
    }
  };

  return (
    <>
      <Navbar user={user} handleLogout={handleLogout} />
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
           <Link to="/contacto-loja" className={styles.subNavLink}>Informações</Link>
          {status === "success" && (
            <p className={styles.successMessage}>Mensagem enviada com sucesso!</p>
          )}
          {status === "error" && (
            <p className={styles.errorMessage}>Erro ao enviar mensagem. Tente novamente.</p>
          )}
        </form>
      </div>
      <Footer />

    </>
  );
}

export default Contactos;
