import React from "react";
import "./Detalles.css";
import { FaParagraph,  FaIdCard, FaFont} from 'react-icons/fa';

export default function DetallesTalla({ talla, onClose }) {
  if (!talla) return null;

  return (
    <div className="modal-overlay">
      <div className="modal-content">
        <h2 className="titulo-modal-detalle">DETALLES DE LA TALLA</h2>

        <div className="detalle-layout">
          <div className="detalle-info" style={{ color: "#fff" }}>
            <p><strong> <FaIdCard/> ID:</strong> {talla.id_Talla}</p>
            <p><strong> <FaFont/> Nombre:</strong> {talla.nombre_Talla}</p>
            <p><strong> <FaParagraph/>Descripción:</strong> {talla.descripcion || "Sin descripción"}</p>
          </div>
        </div>

        <button className="boton-cancelar-detalle" onClick={onClose}>
          Cerrar
        </button>
      </div>
    </div>
  );
}
