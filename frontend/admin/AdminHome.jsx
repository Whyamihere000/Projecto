import { useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import styles from "../css/Global.module.css";

function AdminHome() {
  // const navigate = useNavigate();

  // useEffect(() => {
  //   const user = JSON.parse(localStorage.getItem('user'));

  //   if (!user || user.tipo_utilizador !== 'admin') {
  //     navigate('/');
  //   }
  // }, [navigate]);

  // const navigater = useNavigate();

  // const handleLogout = () => {
  //   localStorage.removeItem('user');
  //   navigater('/');
  // };

  useEffect(() => {
        document.body.className = styles.bodyHome;
        return () => {
            document.body.className = ''; // Remove ao sair
        };
    }, []);
    
  return (
    <>
      <nav className={styles.navegacao_admin}>
        <Link to="/admin/categorias" className={styles.link}>Categorias</Link>
        <Link to="/admin/marcas" className={styles.link}>Marcas</Link>
        <Link to="/admin/produtos" className={styles.link}>Produtos</Link>
        <Link to="/admin/utilizadores" className={styles.link}>Utilizadores</Link>
        <Link to="/admin/mostrar-encomendas" className={styles.link}>Encomendas</Link>
        <Link to="/admin/mostrar-pagamentos" className={styles.link}>Pagamentos</Link>
        <button className={styles.logout}>Logout</button>
      </nav>
    </>
  );
}

export default AdminHome;