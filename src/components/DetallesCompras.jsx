import React from 'react';
import { FaUser, FaCalendar, FaMoneyBillWave } from 'react-icons/fa';
import './Detalles.css'; 

export default function DetallesCompras({ compraData, onClose }) {
  if (!compraData) {
    return null;
  }

  return (
    <div className="modal-overlay">
      <div className="modal-content">
        <h2 className="titulo-modal-detalle">Detalles de la Compra</h2>

        <div className="detalle-layout">
          <div className="detalle-info">
            <p className="short-field"><strong>Número de Compra:</strong> {compraData.numeroCompra}</p>
            <p className="short-field"><strong><FaUser /> Proveedor:</strong> {compraData.proveedor}</p>
            <p className="short-field"><strong><FaCalendar /> Fecha:</strong> {compraData.fechaCompra}</p>
            <p className="short-field"><strong><FaMoneyBillWave /> Forma de Pago:</strong> {compraData.formaPago}</p>
            <p>
              <strong>Estado:</strong> {compraData.estado}
            </p>
          </div>
        </div>

        <div className="detalle-imagenes-bottom">
          <h4 className="subtitulo-imagenes">Productos de la Compra</h4>
          <table className="detalle-tabla-productos">
            <thead>
              <tr>
                <th>Prenda</th>
                <th>Talla</th>
                <th>Color</th>
                <th>Cantidad</th>
                <th>Precio Unitario</th>
                <th>Subtotal</th>
              </tr>
            </thead>
            <tbody>
              {compraData.productos.map((producto) => (
                <tr key={producto.id}>
                  <td>{producto.nombre}</td>
                  <td>{producto.talla}</td>
                  <td>{producto.color}</td>
                  <td>{producto.cantidad}</td>
                  <td>${producto.precio.toLocaleString()}</td>
                  <td>${(producto.cantidad * producto.precio).toLocaleString()}</td>
                </tr>
              ))}
            </tbody>
          </table>

          {/* Resumen de la compra */}
          <div className="resumen-compra">
            <p><strong>Subtotal:</strong> <span>${compraData.subtotal.toLocaleString()}</span></p>
            <p><strong>IVA (19%):</strong> <span>${compraData.iva.toLocaleString()}</span></p>
            <p><strong>Total:</strong> <span>${compraData.totalCompra.toLocaleString()}</span></p>
          </div>
        </div>

        <button className="boton-cancelar-detalle" onClick={onClose}>Cerrar</button>
      </div>
    </div>
  );
}