import { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import styles from "../css/Global.module.css";

function NavbarAdmin({ handleLogout, user }) {
    return (
    <>
      <nav className={styles.navegacao_admin}>
        <Link to="/admin/categorias" className={styles.linkAdmin}>Categorias</Link>
        <Link to="/admin/marcas" className={styles.linkAdmin}>Marcas</Link>
        <Link to="/admin/produtos" className={styles.linkAdmin}>Produtos</Link>
        <Link to="/admin/utilizadores" className={styles.linkAdmin}>Utilizadores</Link>
        <Link to="/admin/mostrar-encomendas" className={styles.linkAdmin}>Encomendas</Link>
        <Link to="/admin/mostrar-pagamentos" className={styles.linkAdmin}>Pagamentos</Link>
        <p>Olá, {user.primeiro_nome}</p>
        <button className={styles.logoutAdmin} onClick={handleLogout}>Logout</button>
      </nav>
    </>
);
}

export default NavbarAdmin;