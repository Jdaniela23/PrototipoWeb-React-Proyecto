import './DeleteModal.css'; 
import { FaTrash } from 'react-icons/fa';

export default function DeleteUser({ usuario, onClose, onConfirm }) {
  // El componente ahora recibe 'usuario', 'onClose' y 'onConfirm' como props.
  // Ya no necesita 'useLocation' ni 'useNavigate' porque no navega a otra página.

  // Si no se pasa un usuario, no se renderiza nada.
  if (!usuario) {
    return null;
  }

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

          <button className="confirm-delete-button" onClick={() => onConfirm(usuario)}>
            Sí, Eliminar Definitivamente <FaTrash />
          </button>
        </div>
      </div>
    </div>
  );
}