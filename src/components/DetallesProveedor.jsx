import React from 'react';
import {  FaUser, FaPhone, FaEnvelope, FaIdCard, FaMapMarkerAlt, FaHome, FaCalendarAlt } from 'react-icons/fa';
import './Detalles.css';

export default function DetallesProveedor({ proveedor, onClose }) {
  if (!proveedor) {
    return null;
  }

  return (
    <div className="modal-overlay">
      <div className="modal-content">
        <h2 className="titulo-modal-detalle-usuario">Detalles del Proveedor</h2>
        <div className="detalle-layout">
          <div className="detalle-info">
            <p>
              <strong><FaUser /> Nombre:</strong> {proveedor.nombreRepresentante} {proveedor.apellidoRepresentante}
            </p>
            <p className="short-field">
              <strong><FaIdCard /> ID:</strong> {proveedor.idProveedor}
            </p>
            <p>
              <strong><FaPhone /> Teléfono:</strong> {proveedor.numeroContacto}
            </p>
            <p>
              <strong><FaEnvelope /> Correo:</strong> {proveedor.correoElectronico}
            </p>
            <p>
              <strong>Tipo Documento:</strong> {proveedor.tipoDocumento}
            </p>
            <p>
              <strong>Número Documento:</strong> {proveedor.numeroDocumento}
            </p>
            <p>
              <strong><FaMapMarkerAlt /> Municipio:</strong> {proveedor.municipio}
            </p>
            <p>
              <strong><FaHome /> Dirección:</strong> {proveedor.direccion}
            </p>
            <p><strong> <FaCalendarAlt />Fecha creación:</strong> {proveedor.fecha_Creacion}</p>
            <p >
              <strong>Estado:</strong> {proveedor.estado}
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