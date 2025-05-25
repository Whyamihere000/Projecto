import styles from "../css/componente/Footer.module.css";
import { FaFacebookF, FaInstagram, FaTwitter, FaYoutube } from "react-icons/fa";
import { Link } from "react-router-dom";

function Footer() {
  return (
    <div className={styles.footer}>
      <div className={styles.container}>
        <div className={styles.brand}>
          <h2>PCGalaxy</h2>
          <p>A tua loja de confiança em tecnologia.</p>
        </div>

        <div className={styles.links}>
          <h3>Links Rápidos</h3>
          <ul>
            <li><Link to="/">Início</Link></li>
            <li><Link to="/produtos">Produtos</Link></li>
            <li><Link to="/contacto">Contactos</Link></li>
          </ul>
        </div>

        <div className={styles.social}>
          <h3>Siga-nos</h3>
          <div className={styles.icons}>
            <a href="https://facebook.com" target="_blank" rel="noreferrer"><FaFacebookF /></a>
            <a href="https://instagram.com" target="_blank" rel="noreferrer"><FaInstagram /></a>
            <a href="https://twitter.com" target="_blank" rel="noreferrer"><FaTwitter /></a>
            <a href="https://youtube.com" target="_blank" rel="noreferrer"><FaYoutube /></a>
          </div>
        </div>
      </div>

      <div className={styles.bottomBar}>
        <p>&copy; {new Date().getFullYear()} PCG axaly. Todos os direitos reservados.</p>
      </div>
    </div>
  );
}

export default Footer;
