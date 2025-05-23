import { Navigate } from 'react-router-dom';

function RotaPrivadaAdmin({ children }) {
  let user;

  try {
    user = JSON.parse(localStorage.getItem('user'));
  } catch (err) {
    user = null;
  }

  const isAdmin = user?.tipo_utilizador === 'admin';

  return isAdmin ? children : <Navigate to="/" replace />;
}

export default RotaPrivadaAdmin;
