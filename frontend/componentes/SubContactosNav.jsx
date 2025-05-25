// Perfil /SubNavbarContactos.js
import { Link, useLocation } from "react-router-dom";
import styles from "../css/componente/SubContactosNav.module.css";

function SubContactosNav() {
  const location = useLocation();

  return (
  <div className={styles.subNav}>
    <Link to="/contactos" className={styles.subNavLink}>Contactos</Link>
    <Link to="/contacto-loja" className={styles.subNavLink}>Fale Conosco</Link>
    <Link to="/about-us" className={styles.subNavLink}>Sobre-nos</Link>
    <Link to="/perfil-contactos" className={styles.subNavLink}>Contactos</Link>
  </div>
  );
}

export default SubContactosNav;