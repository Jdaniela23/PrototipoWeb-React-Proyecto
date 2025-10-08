import React from "react";
import "./Detalles.css"; 
import { FaIdCard, FaFont,  FaParagraph} from 'react-icons/fa';

export default function DetallesCategoria({ categoria, onClose }) {
  if (!categoria) return null;

  return (
    <div className="modal-overlay">
      <div className="modal-content">
        <h2 className="titulo-modal-detalle">DETALLES DE LA CATEGORÍA</h2>

        <div className="detalle-layout">
          <div className="detalle-info" style={{ color: "#fff" }}>
            <p><strong><FaIdCard/> ID:</strong> {categoria.id_Categoria_Producto}</p>
            <p><strong><FaFont/> Nombre:</strong> {categoria.nombre_Categoria}</p>
            <p><strong><FaParagraph/> Descripción:</strong> {categoria.descripcion || "Sin descripción"}</p>
          </div>
        </div>

        <button className="boton-cancelar-detalle" onClick={onClose}>
          Cerrar
        </button>
      </div>
    </div>
  );
}
