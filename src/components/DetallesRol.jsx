import React from 'react';
import './Detalles.css';
import { FaUser, FaCheck, FaCalendarAlt, FaIdCard } from 'react-icons/fa';
import { formatFechaCorta } from './formatters'; 


export default function DetallesRol({ rol, onClose }) {
  if (!rol) {
    return null; // No muestra nada si no hay rol
  }

  // Se añade una función para formatear los permisos
  const renderPermisos = () => {
    const permisos = rol.permisos || {};
     if (Object.keys(permisos).length === 0) {
        return <p className="permisos-lista">No hay permisos definidos.</p>;
    }
    return Object.entries(rol.permisos).map(([categoria, lista]) => (
      <div key={categoria} className="permisos-categoria">
    
        <ul className="permisos-lista">
            {(Array.isArray(lista) ? lista : [lista]).map((permiso, i) => (
            <p key={i}>{permiso}</p>
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
            <p><strong><FaCalendarAlt /> Fecha de Creación: </strong> {formatFechaCorta(rol.fecha_Creacion)}</p>
           
            <p><strong>Descripción:</strong> {rol.descripcion}</p><br/>
             <p className="descripcion-campo">
            
              <strong><FaCheck /> Permisos:</strong>
              {renderPermisos()}
            </p>
            

          </div>
        </div>
        <button className="boton-cancelar-detalle" onClick={onClose}>Cerrar</button>
      </div>
    </div>
  );
}