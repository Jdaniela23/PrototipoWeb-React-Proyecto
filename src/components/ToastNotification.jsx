// components/ToastNotification.jsx
import { useEffect, useState } from 'react';
import './ToastNotification.css'; // Crearemos este CSS

export default function ToastNotification({ message, type, duration = 5000, onClose }) {
  const [isVisible, setIsVisible] = useState(true);

  useEffect(() => {
    // Si no hay mensaje, no mostrar nada
    if (!message) {
      setIsVisible(false);
      return;
    }

    // Mostrar el toast y configurar temporizador para ocultarlo
    setIsVisible(true);
    const timer = setTimeout(() => {
      setIsVisible(false);
      if (onClose) onClose(); // Llamar a la función onClose para limpiar el estado en el padre
    }, duration);

    // Limpiar el temporizador si el componente se desmonta o el mensaje cambia
    return () => clearTimeout(timer);
  }, [message, duration, onClose]); // Dependencias del efecto

  if (!isVisible || !message) {
    return null; // No renderizar si no está visible o no hay mensaje
  }

  // Define el icono y la clase CSS según el tipo de mensaje
  let icon = null;
  let toastClass = 'toast-notification';

  switch (type) {
    case 'success':
      icon = '✅'; // O puedes usar un componente FaCheckCircle de react-icons
      toastClass += ' toast-success';
      break;
    case 'error':
      icon = '❌'; // O FaTimesCircle
      toastClass += ' toast-error';
      break;
    case 'warning':
      icon = '⚠️'; // O FaExclamationTriangle
      toastClass += ' toast-warning';
      break;
    default:
      icon = 'ℹ️'; // O FaInfoCircle
      toastClass += ' toast-info';
      break;
  }

  return (
    <div className={toastClass}>
      <span className="toast-icon">{icon}</span>
      <p className="toast-message">{message}</p>
      {/* Puedes añadir un botón de cerrar manual si lo deseas */}
      {/* <button className="toast-close" onClick={() => { setIsVisible(false); if (onClose) onClose(); }}>&times;</button> */}
    </div>
  );
}