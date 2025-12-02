import './DeleteModal.css'; 
import { FaTrash } from 'react-icons/fa';
import { useState } from 'react';

export default function DeleteUser({ usuario, onClose, onConfirm }) {
    const [isDeleting, setIsDeleting] = useState(false); 

  if (!usuario) {
    return null;
  }
 const handleDelete = async () => {
    setIsDeleting(true);
    try {
      await onConfirm(usuario); 
    } finally {
      setIsDeleting(false); 
    }
  };
  return (
    <div className="delete-overlay">
      <div className="delete-content">
        <h2>Confirmar Eliminación de Usuario</h2>
        <p className="delete-message">
          Estás a punto de eliminar el siguiente usuario. Esta acción es irreversible.
          ¿Estás absolutamente seguro de que deseas continuar?
        </p>

        {/* Muestra un resumen de la información del usuario a eliminar */}
        <div className="delete-info-summary">
          <p><strong>Nombre de Usuario:</strong>  {usuario.nombreUsuario}</p>
          <p><strong>Correo:</strong> {usuario.correo} ✉️</p>
          <p><strong>Estado:</strong> {usuario.estado ? '✅ Activo' : '❌ Inactivo'}</p>
          <p><strong>Rol:</strong> {usuario.rol}</p>
        </div>

        <div className="delete-buttons">

          <button className="cancel-button" onClick={onClose}>
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