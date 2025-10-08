import { Navigate, Outlet } from 'react-router-dom';

const ProtectedRoute = () => {
  // ⭐ Verifica si el token y el rol del usuario existen en el almacenamiento local ⭐
  const isAuthenticated = localStorage.getItem('userToken');

  // Si el usuario está autenticado, permite el acceso a la ruta hija.
  // Si no, lo redirige a la página de login.
  return isAuthenticated ? <Outlet /> : <Navigate to="/login" />;
};

export default ProtectedRoute;