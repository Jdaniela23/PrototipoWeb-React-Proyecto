import { Navigate, Outlet } from 'react-router-dom';

const ProtectedRoute = ({ isAuthPage = false }) => { 
  //  Verifica si el usuario tiene sesión activa 
  const isAuthenticated = localStorage.getItem('userToken');

  if (isAuthenticated && isAuthPage) {
    // Si el usuario está autenticado Y está intentando acceder a la página de login/registro
    // Lo redirigimos al dashboard para evitar que "inicie sesión" de nuevo.
    return <Navigate to="/dashboard" replace />;
  }

  if (!isAuthenticated && !isAuthPage) {
    // Si el usuario NO está autenticado Y está intentando acceder a una ruta protegida a login.
    return <Navigate to="/login" replace />;
  }
  
  // Si pasa las verificaciones 
  // Permite el acceso a la ruta hija.
  return <Outlet />;
};

export default ProtectedRoute;