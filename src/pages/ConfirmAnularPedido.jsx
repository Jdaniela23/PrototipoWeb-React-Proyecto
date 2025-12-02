// src/components/ConfirmAnularPedido.jsx (Ejemplo de ubicación)
import React, { useState } from 'react';
import { FaExclamationTriangle, FaLock } from 'react-icons/fa';
import './DeleteModal.css'; // Asegúrate de que esta ruta sea correcta para tus estilos

export default function ConfirmAnularPedido({ pedidoId, onClose, onConfirm }) {
    const [isConfirming, setIsConfirming] = useState(false);

    const handleConfirm = async () => {
        setIsConfirming(true);
        try {
            await onConfirm(); // Ejecuta la función handleAnularConfirm de la página principal
        } finally {
            // El modal debe cerrarse en la función onConfirm o al navegar, 
            // pero lo dejamos aquí para manejar el estado de carga del botón.
            setIsConfirming(false); 
        }
    };

    return (
        <div className="delete-overlay">
            <div className="delete-content">
                <h2 >
                  
                    Confirmar Anulación de Pedido
                </h2>
                
                <p className="delete-message" style={{ textAlign: 'center' }}>
                    Estás a punto de cambiar el estado del pedido <strong>{pedidoId}</strong> a <strong>ANULADO</strong>
                </p>

                <div className="delete-info-summary">
                    <p>
                       
                        <strong>   <FaExclamationTriangle/> ADVERTENCIA:</strong> Una vez anulado, el pedido no podrá ser editado de nuevo y el stock de los productos será devuelto al inventario.
                    </p>
                </div>

                <div className="delete-buttons">
                    <button className="cancel-button" onClick={onClose} disabled={isConfirming}>
                        No, Cancelar
                    </button>
                    <button
                        className="confirm-delete-button" 
                        type="button"
                        onClick={handleConfirm}
                        disabled={isConfirming}
                    >
                        {isConfirming ? 'Anulando...' : 'Sí, Anular Definitivamente'}
                    </button>
                </div>
            </div>
        </div>
    );
}