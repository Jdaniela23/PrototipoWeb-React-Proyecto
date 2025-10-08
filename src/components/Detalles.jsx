import React from "react";
import { formatFechaCorta } from './formatters';
import "./Detalles.css";
import { FaTag, FaList, FaSortNumericDown, FaBox, FaCalendarAlt, FaIdCard } from 'react-icons/fa';

export default function Detalles({ producto, colores = [], onClose }) {
  if (!producto) return null;

  const todasImagenes = producto.detalles?.flatMap(d =>
    d.imagenes?.map(img => img.url_Imagen) || []
  ) || [];

  // Función para obtener el hex del color a partir de id_Color o nombre_Color
  const getHexColor = (colorIdOrName) => {
    const colorObj = colores.find(c =>
      c.id_Color === colorIdOrName || c.nombre_Color === colorIdOrName
    );
    return colorObj?.hex_color || "#000"; // negro por defecto
  };

  return (
    <div className="modal-overlay">
      <div className="modal-content">
        <h2 className="titulo-modal-detalle">{producto.nombre_Producto}</h2>

        <div className="detalle-layout">
          {/* Información principal */}
          <div className="detalle-info" style={{ color: "#fff" }}>
            <p><strong><FaIdCard /> Id:</strong> {producto.id_Producto}</p>
            <p><strong><FaSortNumericDown /> Cantidad Total:</strong> {producto.stock_Total}</p>
            <p><strong><FaTag /> Precio:</strong> {producto.precio}</p>
            <p><strong>Estado:</strong> {producto.estado_Producto ? 'Disponible ✅' : 'No disponible ❎'}</p>
            <p><strong><FaList /> Categoría:</strong> {producto.nombre_Categoria || 'N/A'}</p>
            <p><strong>Marca:</strong> {producto.marca_Producto}</p>
            <p><strong><FaCalendarAlt /> Fecha creación:</strong> {formatFechaCorta(producto.fecha_Creacion)}</p>
            <p><strong>Descripción:</strong> {producto.descripcion}</p>
          </div><br/>
        </div>

        <div>
          {/* Detalles horizontales */}
          <div className="detalle-detalles-horizontal">
            {producto.detalles?.map((d, i) => (
              <div key={i} className="detalle-item-horizontal">
                <p><strong>Talla:</strong> {d.talla}</p>
                <p>
                  <strong>Color:</strong> {d.color}{" "}
                  <span
                    style={{
                      display: "inline-block",
                      width: "20px",
                      height: "20px",
                      borderRadius: "50%",
                          backgroundColor: d.hexColor || "#000",
                      border: "1px solid #6b6b6bff",
                      marginLeft: "8px",
                      verticalAlign: "middle"
                    }}
                  />
                </p>
                <p><strong>Stock:</strong> {d.stock}</p>

                {d.imagenes?.length > 0 && (
                  <div className="imagenes-detalle-horizontal">
                    {d.imagenes.map((img, idx) => (
                      <img
                        key={idx}
                        src={img.url_Imagen}
                        alt={`Detalle ${i} imagen ${idx + 1}`}
                        className="imagen-producto-thumb"
                      />
                    ))}
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>

        {/* Todas las imágenes opcionales */}
        {todasImagenes.length > 0 && (
          <div className="detalle-imagenes-bottom">
            <h4 className="subtitulo-imagenes"><FaBox /> Todas las imágenes</h4>
            <div className="imagenes-grid">
              {todasImagenes.map((url, idx) => (
                <img key={idx} src={url} alt={`Imagen ${idx + 1}`} className="imagen-producto-thumb" />
              ))}
            </div>
          </div>
        )}

        <button className="boton-cancelar-detalle" onClick={onClose}>Cerrar</button>
      </div>
    </div>
  );
}
