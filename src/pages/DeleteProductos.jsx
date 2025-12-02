import { FaTrash } from 'react-icons/fa';
import { useState } from 'react';
import './DeleteModal.css'; 
import { formatFechaCorta } from '../components/formatters';

export default function DeleteProducts({ producto, onClose, onConfirm }) {
  const [isDeleting, setIsDeleting] = useState(false); 

  if (!producto) {
    return null; 
  }

  const handleDelete = async () => {
    setIsDeleting(true);
    try {
      await onConfirm(producto); 
    } finally {
      setIsDeleting(false); 
    }
  };

  return (
    <div className="delete-overlay">
      <div className="delete-content">
        <h2>Confirmar Eliminación Producto</h2>

        <p className="delete-message">
          Estás a punto de eliminar este producto de forma permanente. Esta acción es irreversible.
          ¿Estás seguro de que deseas continuar?
        </p>

        <div className="delete-info-summary">
          <p><strong>Nombre:</strong> {producto.nombre_Producto}</p> 
          <p><strong>Cantidad:</strong> {producto.stock_Total}</p>
          <p><strong>Estado:</strong> {producto.estado_Producto ? '✅ Disponible' : '❌ No disponible'}</p>
          <p><strong>Categoría:</strong> {producto.nombre_Categoria}</p>
          <p><strong>Marca:</strong> {producto.marca_Producto}</p>
          <p><strong>Fecha creación:</strong>{formatFechaCorta(producto.fecha_Creacion)}</p>
        </div>

        <div className="delete-buttons">
          <button className="cancel-button" onClick={onClose} disabled={isDeleting}>
            No, Cancelar
          </button>
          <button
            className="confirm-delete-button"
            type="button"
            onClick={handleDelete}
            disabled={isDeleting} // evita clicks múltiples
          >
            {isDeleting ? 'Eliminando...' : 'Sí, Eliminar Definitivamente'} <FaTrash />
          </button>
        </div>
      </div>
    </div>
  );
}
