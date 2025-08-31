import React from 'react';
import { FaTrash } from 'react-icons/fa';
import './DeleteModal.css'; 

// PaletaColores 
function PaletaColores({ colores }) {
  return (
    <div className="product-color-palette">
      {colores.map((color, i) => (
        <div
          key={i}
          className="product-color-swatch"
          style={{ backgroundColor: color }}
          title={color}
        />
      ))}
    </div>
  );
}

export default function DeleteProducts({ producto, onClose, onConfirm }) {
  if (!producto) {
    return null; 
  }

  return (
    <div className="delete-overlay">
      <div className="delete-content">
        <h2>Eliminar Producto: {producto.nombre}</h2>

        <p className="delete-message">
          Estás a punto de eliminar este producto de forma permanente. Esta acción es irreversible.
          ¿Estás seguro de que deseas continuar?
        </p>

 
        <div className="delete-info-summary">
          <p><strong>Cantidad:</strong> {producto.cantidad}</p>

          <p><strong>Estado:</strong> {producto.estado ? '✅ Disponible' : '❌ No disponible'}</p>

          <p><strong>Categoría:</strong> {producto.categoria}</p>
          <p><strong>Marca:</strong> {producto.marca}</p>
          <p><strong>Fecha creación:</strong> {producto.fecha_Creacion}</p>
        </div>


        <div className="delete-buttons">
          <button className="cancel-button" onClick={onClose}>
            No, Cancelar
          </button>
          <button className="confirm-delete-button" type="button" onClick={() => onConfirm(producto)}>
            Sí, Eliminar Definitivamente <FaTrash />
          </button>
        </div>
      </div>
    </div>
  );
}