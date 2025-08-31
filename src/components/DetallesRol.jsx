import React from 'react';
import './Detalles.css';
import { FaUser, FaCheck, FaCalendarAlt, FaIdCard } from 'react-icons/fa';


export default function DetallesRol({ rol, onClose }) {
  if (!rol) {
    return null; // No muestra nada si no hay rol
  }

  // Se añade una función para formatear los permisos
  const renderPermisos = () => {
    return Object.entries(rol.permisos).map(([categoria, lista]) => (
      <div key={categoria} className="permisos-categoria">
        <h4 className="subtitulo-modal">{categoria}</h4>
        <ul className="permisos-lista">
          {lista.map((permiso, i) => (
            <li key={i}>{permiso}</li>
          ))}
        </ul>
      </div>
    ));
  };

  return (
    <div className="modal-overlay"> 
      <div className="modal-content"> 
        <h2 className="titulo-modal-detalle-usuario">Detalles del Rol</h2> 

        <div className="detalle-layout"> 
          <div className="detalle-info"> 
            <p><strong><FaIdCard /> Id:</strong> {rol.id}</p>
            <p><strong>Estado:</strong> {rol.estado ? '✅ Activo' : '❌ Inactivo'}</p>
            <p><strong><FaUser /> Nombre del Rol:</strong> {rol.nombreRol}</p>
            <p><strong><FaCalendarAlt /> Fecha de Creación: </strong> {rol.fecha_Creacion}</p>
            <p className="descripcion-campo">
              <strong><FaCheck /> Permisos:</strong>
              {renderPermisos()}
            </p>
            <p><strong>Descripción:</strong> {rol.descripcion}</p>

          </div>
        </div>
        <button className="boton-cancelar-detalle" onClick={onClose}>Cerrar</button>
      </div>
    </div>
  );
}