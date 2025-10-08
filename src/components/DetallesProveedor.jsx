import React, { useState, useEffect } from 'react';
import { FaUser, FaPhone, FaEnvelope, FaIdCard, FaMapMarkerAlt, FaHome, FaCalendarAlt, FaStore, FaCheck, FaTimes } from 'react-icons/fa';
import './Detalles.css';
import { getProveedorById } from '../api/proveedoresService.js';

export default function DetallesProveedor({ proveedorId, onClose }) {
  const [proveedor, setProveedor] = useState(null);
  const [cargando, setCargando] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const cargarDetallesProveedor = async () => {
      if (!proveedorId) {
        setError("No se proporcionó un ID de proveedor");
        setCargando(false);
        return;
      }

      try {
        setCargando(true);
        setError(null);
        
        console.log("🔍 Cargando detalles del proveedor ID:", proveedorId);
        
        // Llamada al API para obtener los detalles
        const data = await getProveedorById(proveedorId);
        
        console.log("✅ Datos recibidos del API:", data);
        
        setProveedor(data);
        
      } catch (err) {
        console.error("❌ Error al cargar detalles:", err);
        setError("No se pudieron cargar los detalles del proveedor");
      } finally {
        setCargando(false);
      }
    };

    cargarDetallesProveedor();
  }, [proveedorId]);

  // Formatear fecha
  const formatearFecha = (fecha) => {
    if (!fecha) return 'No disponible';
    try {
      const date = new Date(fecha);
      return date.toLocaleDateString('es-CO', {
        year: 'numeric',
        month: 'long',
        day: 'numeric',
        hour: '2-digit',
        minute: '2-digit'
      });
    } catch (error) {
      return fecha;
    }
  };



  // Si hay error
  if (error) {
    return (
      <div className="modal-overlay" onClick={onClose}>
        <div className="modal-content" onClick={(e) => e.stopPropagation()}>
          <div style={{ textAlign: 'center', padding: '40px' }}>
            <p style={{ fontSize: '18px', color: 'red' }}>❌ {error}</p>
            <button className="boton-cancelar-detalle" onClick={onClose} style={{ marginTop: '20px' }}>
              Cerrar
            </button>
          </div>
        </div>
      </div>
    );
  }

  // Si no hay proveedor
  if (!proveedor) {
    return null;
  }

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal-content" onClick={(e) => e.stopPropagation()}>
        <h2 className="titulo-modal-detalle-usuario">Detalles del Proveedor</h2>
        
        <div className="detalle-layout">
          <div className="detalle-info">
            {/* ID del Proveedor */}
            <p>
              <strong><FaIdCard /> ID Proveedor:</strong> {proveedor.idProveedor || 'N/A'}
            </p>

            {/* Nombre del Proveedor */}
            <p>
              <strong><FaStore /> Nombre del Proveedor:</strong> {proveedor.nombre || 'N/A'}
            </p>

            {/* Teléfono */}
            <p>
              <strong><FaPhone /> Teléfono:</strong> {proveedor.telefono || 'N/A'}
            </p>

            {/* Email */}
            <p>
              <strong><FaEnvelope /> Email:</strong> {proveedor.email || 'N/A'}
            </p>
            
            {/* Ciudad */}
            <p>
              <strong><FaMapMarkerAlt /> Ciudad:</strong> {proveedor.ciudad || 'N/A'}
            </p>

            {/* Dirección */}
            <p>
              <strong><FaHome /> Dirección:</strong> {proveedor.direccion || 'N/A'}
            </p>
            
            {/* Estado */}
            <p>
              <strong>Estado:</strong> 
              <span className={`estado-badge ${proveedor.estado ? 'activo' : 'inactivo'}`}>
                {proveedor.estado ? (
                  <>
                    <FaCheck style={{ marginRight: '5px' }} /> Activo
                  </>
                ) : (
                  <>
                    <FaTimes style={{ marginRight: '5px' }} /> Inactivo
                  </>
                )}
              </span>
            </p>

            {/* Información adicional - Solo se muestra si existe */}
            {proveedor.nombreRepresentante && (
              <p>
                <strong><FaUser /> Nombre Representante:</strong> {proveedor.nombreRepresentante}
              </p>
            )}
            
            {proveedor.apellidoRepresentante && (
              <p>
                <strong><FaUser /> Apellido Representante:</strong> {proveedor.apellidoRepresentante}
              </p>
            )}
            
            {proveedor.tipoDocumento && (
              <p>
                <strong>Tipo Documento:</strong> {proveedor.tipoDocumento}
              </p>
            )}
            
            {proveedor.numeroDocumento && (
              <p>
                <strong>Número Documento:</strong> {proveedor.numeroDocumento}
              </p>
            )}
            
            {proveedor.fecha_Creacion && (
              <p>
                <strong><FaCalendarAlt /> Fecha creación:</strong> {formatearFecha(proveedor.fecha_Creacion)}
              </p>
            )}
          </div>
        </div>

        <button className="boton-cancelar-detalle" onClick={onClose}>
          Cerrar
        </button>
      </div>
    </div>
  );
}