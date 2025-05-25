// Perfil /SubNavbar.js
import { Link, useLocation } from "react-router-dom";
import styles from "../css/componente/SubNavbar.module.css";

function SubNavbar() {
  const location = useLocation();

  return (
  <div className={styles.subNav}>
    <Link to="/perfil" className={styles.subNavLink}>Perfil</Link>
    <Link to="/perfil-encomendas" className={styles.subNavLink}>Encomendas</Link>
    <Link to="/perfil-favoritos" className={styles.subNavLink}>Favoritos</Link>
    <Link to="/perfil-contactos" className={styles.subNavLink}>Contactos</Link>
  </div>
  );
}

export default SubNavbar;
