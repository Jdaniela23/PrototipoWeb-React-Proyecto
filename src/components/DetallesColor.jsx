import React from "react";
import "./Detalles.css"; // Reutilizamos el mismo CSS
import { FaPalette,  FaIdCard, FaFont,  FaParagraph} from 'react-icons/fa';

export default function DetallesColor({ color, onClose }) {
  if (!color) return null;

  return (
    <div className="modal-overlay">
      <div className="modal-content">
        <h2 className="titulo-modal-detalle">DETALLES DEL COLOR</h2>

        <div className="detalle-layout">
          <div className="detalle-info" style={{ color: "#fff" }}>
            <p><strong> <FaIdCard/> ID:</strong> {color.id_Color}</p>
            <p><strong><FaFont/> Nombre:</strong> {color.nombre_Color}</p>
            <p><strong>  <FaParagraph/>Descripción:</strong> {color.descripcion || "Sin descripción"}</p>
            <p>
              <strong><FaPalette/> Tono:</strong>
              <span style={{
                display: 'inline-block',
                width: '25px',
                height: '25px',
                borderRadius: '50%',
                backgroundColor: color.hex_color || '#000',
                border: '1px solid #000',
                marginLeft: '10px',
                verticalAlign: 'middle'
              }}></span>
              <span style={{ marginLeft: '8px' }}>{color.hex_color}</span>
            </p>
          </div>
        </div>

        <button className="boton-cancelar-detalle" onClick={onClose}>
          Cerrar
        </button>
      </div>
    </div>
  );
}
