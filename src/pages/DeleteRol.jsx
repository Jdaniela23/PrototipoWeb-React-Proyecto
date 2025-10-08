import './DeleteModal.css'; 
import { FaTrash } from 'react-icons/fa';

export default function DeleteRol({ rol, onClose, onConfirm }) {


  if (!rol) {
    return null; 
  }

  return (
    <div className="delete-overlay">
      <div className="delete-content">
        <h2>Confirmar Eliminación de Rol </h2>
        <p className="delete-message">
          Estás a punto de eliminar ❌ el siguiente rol. <br/>Esta acción es irreversible y los usuarios asignados perderán todos los permisos asociados con este rol.
          ¿Estás absolutamente seguro de que deseas continuar?
        </p>


        <div className="delete-info-summary">
          <p><strong>Nombre del Rol:</strong> {rol.nombreRol}</p>
          <p><strong>Descripción:</strong> {rol.descripcion}</p>
          <p><strong>Estado:</strong> {rol.estado ? '✅ Activo' : '❌ Inactivo'}</p>
        </div>

        <div className="delete-buttons">
          <button className="cancel-button" onClick={onClose}>
           No, Cancelar
          </button>
          <button className="confirm-delete-button" onClick={() => onConfirm(rol)}>
           Si, Eliminar <FaTrash />
          </button>
        </div>
      </div>
    </div>
  );
}