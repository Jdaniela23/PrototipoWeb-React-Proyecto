import React from 'react';
import { FaTrash } from 'react-icons/fa';
import './DeleteModal.css';

export default function DeleteTalla({ talla, onClose, onConfirm }) {
    if (!talla) return null;

    return (
        <div className="delete-overlay">
            <div className="delete-content">
                <h2>Confirmar Eliminación de Talla</h2>
                <p className="delete-message">
                    Estás a punto de eliminar la talla <strong>{talla.nombre_Talla}</strong>. Esta acción es irreversible.<br/>
                    ¿Estás seguro de que deseas continuar?
                </p>

                <div className="delete-info-summary">
                    <p><strong>ID:</strong> {talla.id_Talla}</p>
                    <p><strong>Nombre:</strong> {talla.nombre_Talla}</p>
                    <p><strong>Descripción:</strong> {talla.descripcion || 'Sin descripción'}</p>
                </div>

                <div className="delete-buttons">
                    <button className="cancel-button" onClick={onClose}>
                        No, Cancelar
                    </button>
                    <button className="confirm-delete-button" onClick={() => onConfirm(talla)}>
                        Sí, Eliminar Definitivamente <FaTrash />
                    </button>
                </div>
            </div>
        </div>
    );
}
