// src/pages/DeleteCategorias.jsx
import React from 'react';
import { FaTrash } from 'react-icons/fa';
import './DeleteModal.css';
import { useState } from 'react';

export default function DeleteCategorias({ categoria, onClose, onConfirm }) {
    const [isDeleting, setIsDeleting] = useState(false);
    if (!categoria) return null;
 const handleDelete = async () => {
        setIsDeleting(true);
        try {
            await onConfirm(categoria);
        } finally {
            setIsDeleting(false);
        }
    };
    return (
        <div className="delete-overlay">
            <div className="delete-content">
                <h2>Confirmar Eliminación de Categoría</h2>
                <p className="delete-message">
                    Estás a punto de eliminar la categoría <strong>{categoria.nombre_Categoria}</strong>.
                    Esta acción es irreversible.<br />
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
                        type="button"
                        onClick={handleDelete}
                        disabled={isDeleting}
                    >
                        {isDeleting ? 'Eliminando...' : 'Sí, Eliminar Definitivamente'} <FaTrash />
                    </button>
                </div>
            </div>
        </div>
    );
}
