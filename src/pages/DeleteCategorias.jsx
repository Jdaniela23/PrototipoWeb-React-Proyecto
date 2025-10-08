// src/pages/DeleteCategorias.jsx
import React from 'react';
import { FaTrash } from 'react-icons/fa';
import './DeleteModal.css';

export default function DeleteCategorias({ categoria, onClose, onConfirm }) {
    if (!categoria) return null;

    return (
        <div className="delete-overlay">
            <div className="delete-content">
                <h2>Confirmar Eliminación de Categoría</h2>
                <p className="delete-message">
                    Estás a punto de eliminar la categoría <strong>{categoria.nombre_Categoria}</strong>. 
                    Esta acción es irreversible.<br/>
                    ¿Estás seguro de que deseas continuar?
                </p>

                <div className="delete-info-summary">
                    <p><strong>ID:</strong> {categoria.id_Categoria_Producto}</p>
                    <p><strong>Nombre:</strong> {categoria.nombre_Categoria}</p>
                    <p><strong>Descripción:</strong> {categoria.descripcion || 'Sin descripción'}</p>
                </div>

                <div className="delete-buttons">
                    <button
                        className="cancel-button"
                        onClick={onClose}
                    >
                        No, Cancelar
                    </button>
                    <button
                        className="confirm-delete-button"
                        onClick={() => onConfirm(categoria)}
                    >
                        Sí, Eliminar Definitivamente <FaTrash style={{ marginLeft: '5px' }} />
                    </button>
                </div>
            </div>
        </div>
    );
}
