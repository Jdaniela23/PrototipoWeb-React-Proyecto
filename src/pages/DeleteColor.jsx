import React from 'react';
import { FaTrash } from 'react-icons/fa';
import './DeleteModal.css';

export default function DeleteColor({ color, onClose, onConfirm }) {
    if (!color) return null;

    return (
        <div className="delete-overlay">
            <div className="delete-content">
                <h2>Confirmar Eliminación de Color</h2>
                <p className="delete-message">
                    Estás a punto de eliminar el color <strong>{color.nombre_Color}</strong>. Esta acción es irreversible.<br />
                    ¿Estás seguro de que deseas continuar?
                </p>

                <div className="delete-info-summary">
                    <p><strong>ID:</strong> {color.id_Color}</p>
                    <p><strong>Nombre:</strong> {color.nombre_Color}</p>
                    <p><strong>Descripción:</strong> {color.descripcion || 'Sin descripción'}</p>
                </div>

                <div className="delete-buttons">
                    <button className="cancel-button" onClick={onClose}>
                        No, Cancelar
                    </button>
                    <button className="confirm-delete-button" onClick={() => onConfirm(color)}>
                        Sí, Eliminar Definitivamente <FaTrash />
                    </button>
                </div>
            </div>
        </div>
    );
}
