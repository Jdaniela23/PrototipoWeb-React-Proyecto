import React from "react";
import "./Detalles.css";
import { FaTag, FaList, FaSortNumericDown, FaBox, FaCalendarAlt, FaIdCard } from 'react-icons/fa';

function PaletaColores({ colores }) {
  return (
    <div style={{ display: 'flex', gap: '10px', marginTop: '10px' }}>
      {colores.map((color, i) => (
        <div
          key={i}
          style={{
            width: '25px',
            height: '25px',
            borderRadius: '50%',
            backgroundColor: color,
            border: '1px solid #ccc',
            cursor: 'pointer'
          }}
          title={color}
        />
      ))}
    </div>
  );
}

export default function Detalles({ producto, onClose }) {
  if (!producto) {
    return null;
  }

  return (
    <div className="modal-overlay">
      <div className="modal-content">
        <h2 className="titulo-modal-detalle">{producto.nombre}</h2>
        <div className="detalle-layout">
          <div className="detalle-info">
            <p><strong><FaIdCard /> Id:</strong> {producto.id}</p>
            <p><strong><FaSortNumericDown /> Cantidad:</strong> {producto.cantidad}</p>
            <p><strong>  <FaTag /> Precio:</strong> {producto.precio}</p>
            <p><strong>Estado:</strong> {producto.estado ? 'Disponible ✅' : 'No disponible ❎'}</p>

            <p><strong>Talla:</strong> {producto.talla}</p>
            <p><strong>Color:</strong> <PaletaColores colores={producto.colores || []} /></p>
            <p><strong><FaList /> Categoría:</strong> {producto.categoria}</p>
            <p><strong>Marca:</strong> {producto.marca}</p>
            <p><strong> <FaCalendarAlt />Fecha creación:</strong> {producto.fecha_Creacion}</p>
            <p ><strong>Descripción:</strong> {producto.descripcion}</p>
          </div>
        </div>

        {/* ➡️ Contenedor de imágenes movido fuera del `detalle-layout` */}
        <div className="detalle-imagenes-bottom">
          <h4 className="subtitulo-imagenes"><FaBox /> Imágenes del Producto</h4>
          {producto.imagenes?.length > 0 ? (
            <div className="imagenes-grid">
              {producto.imagenes.map((url, index) => (
                <img
                  key={index}
                  src={url}
                  alt={`${producto.nombre} imagen ${index + 1}`}
                  className="imagen-producto-thumb" 
                />
              ))}
            </div>
          ) : (
            <p className="no-imagenes-mensaje">No hay imágenes disponibles para este producto.</p>
          )}
        </div>

        <button className="boton-cancelar-detalle" onClick={onClose}>Cerrar</button>
      </div>
    </div>
  );
}