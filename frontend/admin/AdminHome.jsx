import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import NavbarAdmin from "../componentes/NavbarAdmin";
import styles from "../css/Global.module.css";

function AdminHome() {
  const [user, setUser] = useState(null);

  const navigate = useNavigate();

  useEffect(() => {
    const storedUser = localStorage.getItem('user');
    if (storedUser && storedUser !== 'undefined') {
      const user = JSON.parse(storedUser);
      if (user.tipo_utilizador === 'admin') {
        setUser(user);
      }
    }
  }, []);

  useEffect(() => {
    const userAdmin = JSON.parse(localStorage.getItem('user'));

    if (!userAdmin || userAdmin.tipo_utilizador !== 'admin') {
      navigate('/');
    }
  }, [navigate]);

  const navigater = useNavigate();

  const handleLogout = () => {
    localStorage.removeItem('user');
    navigate('/');
  };

  useEffect(() => {
              document.body.className = styles.bodyHomeAdmin;
              return () => {
                  document.body.className = '';
              };
          }, []);
    
  return (
    <>
      <NavbarAdmin user={user} handleLogout={handleLogout} />
    </>
  );
}

export default AdminHome;