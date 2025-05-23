import { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import NavbarAdmin from "../componentes/NavbarAdmin";
import stylesAdminHome from "../css/Global.module.css";

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
    const user = JSON.parse(localStorage.getItem('user'));

    if (!user || user.tipo_utilizador !== 'admin') {
      navigate('/');
    }
  }, [navigate]);

  const navigater = useNavigate();

  const handleLogout = () => {
    localStorage.removeItem('user');
    navigater('/');
  };

  useEffect(() => {
        document.body.className = stylesAdminHome.bodyHome;
        return () => {
            document.body.className = ''; // Remove ao sair
        };
    }, []);
    
  return (
    <>
      <NavbarAdmin user={user} handleLogout={handleLogout} />
    </>
  );
}

export default AdminHome;