import React, { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
//import loadingRopaGif from '../assets/mi-gif-cargando.gif'; 
import './LoadingSpinner.css'; // Mantenemos tu CSS existente para el spinner

function LoadingPage() { // Renombramos de LoadingSpinner a LoadingPage
  const navigate = useNavigate();

  useEffect(() => {
    // Esta función se ejecuta una vez que el componente se monta
    const simulateLoad = async () => {
      // Simula el tiempo de carga (3 segundos)
      await new Promise(resolve => setTimeout(resolve, 3000)); 
      
      // Después de la simulación, redirige a la página de pedidos
      navigate('/panelAdmin', { replace: true }); 
    };

    simulateLoad(); // Llama a la función de simulación
  }, [navigate]); // Dependencia 'navigate' para evitar advertencias de ESLint
 

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