import { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import styles from "../css/Global.module.css";

function NavbarAdmin({ handleLogout, user }) {
    return (
    <>
      <nav className={styles.navegacao_admin}>
        <Link to="/admin/categorias" ><button className={styles.linkAdmin}>Categorias</button></Link>
        <Link to="/admin/marcas" ><button className={styles.linkAdmin}>Marcas</button></Link>
        <Link to="/admin/produtos" ><button className={styles.linkAdmin}>Produtos</button></Link>
        <Link to="/admin/utilizadores" ><button className={styles.linkAdmin}>Utilizadores</button></Link>
        <Link to="/admin/mostrar-encomendas" ><button className={styles.linkAdmin}>Encomendas</button></Link>
        <Link to="/admin/mostrar-pagamentos" ><button className={styles.linkAdmin}>Pagamentos</button></Link>
        <Link to="/admin/mostrar-contactos" ><button className={styles.linkAdmin}>Contactos</button></Link>
        <p>Olá, {user?.primeiro_nome}</p>
        <button className={styles.logoutAdmin} onClick={handleLogout}>Logout</button>
      </nav>
    </>
);
}

export default NavbarAdmin;