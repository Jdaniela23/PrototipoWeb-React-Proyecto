import './LoadingSpinner.css';

// Recibe un mensaje opcional para personalizar el texto
function LoadingSpinner({ message = "Cargando..." }) {
  return (
    <div className="hola" style={{ 
      display: 'flex', 
      justifyContent: 'center', 
      alignItems: 'center', 
      height: '100vh', // Para que ocupe toda la pantalla
      width: '100vw',
      position: 'fixed', // Para que cubra toda la pantalla
      top: 0,
      left: 0,
      backgroundColor: 'white', // Fondo blanco para cubrir lo que está debajo
      zIndex: 9999 // Asegura que esté por encima de todo
    }}>
      <div className="loader-container">
        <div className="loader"></div> 
        <p className="texto-cargando">{message}</p>
      </div>
    </div>
  );
}

export default LoadingSpinner;