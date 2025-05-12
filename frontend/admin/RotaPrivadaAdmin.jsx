import { Navigate } from 'react-router-dom';

function RotaPrivadaAdmin({ children }) {
  const user = JSON.parse(localStorage.getItem('user'));

  // Se não estiver autenticado ou não for admin, redirecionar para página inicial
  if (!user || user.tipo_utilizador !== 'admin') {
    return <Navigate to="/" replace />;
  }

  // Se for admin, mostrar os filhos (ex: o painel admin)
  return children;
}

export default RotaPrivadaAdmin;