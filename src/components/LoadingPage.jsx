// src/components/LoadingPage.jsx

import React, { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import './LoadingSpinner.css'; 

function LoadingPage() {
  const navigate = useNavigate();

  useEffect(() => {
    const handleNavigation = async () => {
      // ⭐ Simula el tiempo de carga, puedes ajustarlo si necesitas
      await new Promise(resolve => setTimeout(resolve, 2000)); 
      
      // ⭐ Obtiene el rol del usuario desde el almacenamiento local
      const userRole = localStorage.getItem('userRole'); 

      // ⭐ Redirigir al usuario dependiendo su rol a su perfil, despúes que el token es decodificado en el inicio de sesión ⭐
      // ⭐ Lógica condicional para redirigir según el rol ⭐
      if (userRole === 'Administrador') { 
        navigate('/dashboard', { replace: true });
      } else if (userRole === 'Cliente') {
        // Redirige al cliente a su perfil o dashboard
        navigate('/pagecustomers', { replace: true }); 
      } else {
        // Si no hay un rol definido, lo redirige al inicio de sesión o a una página de error
        navigate('/login', { replace: true });
      }
    };

    handleNavigation();
  }, [navigate]); 

  return (
    <div className="hola">
      <div className="loader-container">
        <div className="loader"></div>
        <p className="texto-cargando">Entrando a la cuenta...</p>
      </div>
    </div>
  );
}

export default LoadingPage;