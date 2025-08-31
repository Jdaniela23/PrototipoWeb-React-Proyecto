import React from 'react';
import { FaTrash } from 'react-icons/fa';
import './DeleteModal.css';

export default function DeleteCategorias({ categoria, onClose, onConfirm }) {
    if (!categoria) {
        return null; 
    }

    return (
        <div className="delete-overlay">
            <div className="delete-content">
                <h2>Confirmar Eliminación de Categoría</h2>
                <p className="delete-message">
                    Estás a punto de eliminar la categoría <strong>{categoria.nombre}</strong>. Esta acción es irreversible.<br/>
                    ¿Estás seguro de que deseas continuar?
                </p>

                <div className="delete-info-summary">
                  
                    <p><strong>ID:</strong> {categoria.id}</p>
                    <p><strong>Nombre:</strong> {categoria.nombre}</p>
                    <p><strong>Descripción:</strong> {categoria.descripcion}</p>
                    <p><strong>Fecha de Creación:</strong> {categoria.fechaCreacion}</p>
                </div>

                <div className="delete-buttons">
   
                    <button className="cancel-button" onClick={onClose}>
                        No, Cancelar
                    </button>
                    <button className="confirm-delete-button" onClick={() => onConfirm(categoria)}>
                        Sí, Eliminar Definitivamente <FaTrash />
                    </button>
                </div>
            </div>
        </div>
    );
}