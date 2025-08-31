import React from 'react';
import { FaIdCard, FaMoneyBillAlt, FaUser, FaClipboardCheck, FaFileAlt } from 'react-icons/fa';
import './Detalles.css'; 

export default function DetallesCredito({ credito, onClose }) {
  if (!credito) {
    return null;
  }

  return (
    <div className="modal-overlay">
      <div className="modal-content">
        <div className="detalle-layout">
          <div className="detalle-info">
            <h2 className="titulo-modal-detalle">Detalles del Crédito</h2>
              <p><strong><FaIdCard /> Id:</strong> {credito.idCredito}</p>
            <p><strong><FaUser /> Nombre:</strong> {credito.nombreCompleto}</p>
            <p><strong><FaMoneyBillAlt /> Monto Crédito:</strong> {credito.montoCredito.toLocaleString('es-CO', { style: 'currency', currency: 'COP' })}</p>
            <p><strong><FaMoneyBillAlt /> Valor Adeudado:</strong> {credito.valorDebe.toLocaleString('es-CO', { style: 'currency', currency: 'COP' })}</p>
            <p><strong><FaClipboardCheck /> Cantidad Restante:</strong> {credito.cantidadFalta.toLocaleString('es-CO', { style: 'currency', currency: 'COP' })}</p>
            <p><strong><FaClipboardCheck /> Estado:</strong> {credito.estado ? '✅ Activo' : '❌ Inactivo'}</p>
            <p><strong><FaFileAlt /> Fecha:</strong> {credito.fecha_Creacion}</p>
            <button className="boton-cancelar-detalle" onClick={onClose}>
              Cerrar
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}