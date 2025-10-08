import React, { useState, useEffect } from 'react';
import { FaStore, FaCalendarAlt, FaMoneyBillWave, FaCreditCard, FaBoxOpen, FaIdCard, FaCheck, FaTimes } from 'react-icons/fa';
import './Detalles.css';
import { getCompraById } from '../api/comprasService.js';
import { getDetalleCompras } from '../api/detallescomprasService.js';

export default function DetallesCompras({ compraId, onClose }) {
  const [compra, setCompra] = useState(null);
  const [cargando, setCargando] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const cargarDetallesCompra = async () => {
      if (!compraId) {
        setError("No se proporcionó un ID de compra");
        setCargando(false);
        return;
      }

      try {
        setCargando(true);
        setError(null);
        
        console.log("🔍 Cargando detalles de la compra ID:", compraId);
        
        // Llamada al API para obtener los detalles de la compra por ID
        const data = await getCompraById(compraId);
        
        console.log("✅ Datos recibidos del API:", data);
        
        // Obtener TODOS los detalles de compras
        const todosLosDetalles = await getDetalleCompras();
        console.log("📦 Todos los detalles obtenidos:", todosLosDetalles);
        
        // Filtrar solo los detalles que pertenecen a esta compra
        // Usar idCompra (en minúscula) que es como viene en el JSON
        const detallesFiltrados = todosLosDetalles.filter(
          detalle => detalle.idCompra == compraId
        );
        
        console.log(`📦 Detalles filtrados para compra ${compraId}:`, detallesFiltrados);
        console.log("📦 Total de productos:", detallesFiltrados.length);
        
        // Agregar los detalles filtrados a la compra
        data.detalleCompras = detallesFiltrados;
        
        setCompra(data);
        
      } catch (err) {
        console.error("❌ Error al cargar detalles:", err);
        setError("No se pudieron cargar los detalles de la compra: " + err.message);
      } finally {
        setCargando(false);
      }
    };

    cargarDetallesCompra();
  }, [compraId]);

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

  // Formatear moneda
  const formatearMoneda = (valor) => {
    if (!valor && valor !== 0) return 'N/A';
    return `$${Number(valor).toLocaleString('es-CO')}`;
  };

  // Mientras carga
  if (cargando) {
    return (
      <div className="modal-overlay" onClick={onClose}>
        <div className="modal-content" onClick={(e) => e.stopPropagation()}>
          <div style={{ textAlign: 'center', padding: '40px' }}>
            <p style={{ fontSize: '18px' }}>⏳ Cargando detalles de la compra...</p>
          </div>
        </div>
      </div>
    );
  }

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

  // Si no hay compra
  if (!compra) {
    return null;
  }

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal-content" onClick={(e) => e.stopPropagation()}>
        <h2 className="titulo-modal-detalle-usuario">Detalles de la Compra</h2>
        
        <div className="detalle-layout">
          <div className="detalle-info">
            {/* ID de la Compra */}
            <p>
              <strong><FaIdCard /> ID Compra:</strong> {compra.id_Compra || 'N/A'}
            </p>

            {/* Proveedor */}
            <p>
              <strong><FaStore /> Proveedor:</strong> {compra.proveedor?.nombre || 'N/A'}
            </p>

            {/* Teléfono del Proveedor */}
            {compra.proveedor?.telefono && (
              <p>
                <strong>Teléfono Proveedor:</strong> {compra.proveedor.telefono}
              </p>
            )}

            {/* Email del Proveedor */}
            {compra.proveedor?.email && (
              <p>
                <strong>Email Proveedor:</strong> {compra.proveedor.email}
              </p>
            )}

            {/* Dirección del Proveedor */}
            {compra.proveedor?.direccion && (
              <p>
                <strong>Dirección Proveedor:</strong> {compra.proveedor.direccion}
              </p>
            )}

            {/* Ciudad del Proveedor */}
            {compra.proveedor?.ciudad && (
              <p>
                <strong>Ciudad:</strong> {compra.proveedor.ciudad}
              </p>
            )}

            {/* Fecha de Compra */}
            <p>
              <strong><FaCalendarAlt /> Fecha de Compra:</strong> {formatearFecha(compra.fecha_Compra_Proveedor)}
            </p>

            {/* Fecha de Registro */}
            {compra.fecha_registro && (
              <p>
                <strong><FaCalendarAlt /> Fecha de Registro:</strong> {formatearFecha(compra.fecha_registro)}
              </p>
            )}

            {/* Forma de Pago */}
            <p>
              <strong><FaCreditCard /> Forma de Pago:</strong> {compra.forma_Pago || 'N/A'}
            </p>

            {/* Estado */}
            <p>
              <strong>Estado:</strong> 
              <span className={`estado-badge ${compra.estado === 'Activo' ? 'activo' : 'inactivo'}`}>
                {compra.estado === 'Activo' ? (
                  <>
                    <FaCheck style={{ marginRight: '5px' }} /> Activo
                  </>
                ) : (
                  <>
                    <FaTimes style={{ marginRight: '5px' }} /> Anulado
                  </>
                )}
              </span>
            </p>
          </div>
        </div>

        {/* Tabla de Productos */}
        <div className="detalle-imagenes-bottom">
          <h4 className="subtitulo-imagenes">
            <FaBoxOpen style={{ marginRight: '8px' }} />
            Productos de la Compra
          </h4>
          
          {compra.detalleCompras && compra.detalleCompras.length > 0 ? (
            <div style={{ overflowX: 'auto' }}>
              <table className="detalle-tabla-productos">
                <thead>
                  <tr>
                    <th>#</th>
                    <th>ID Producto</th>
                    <th>Cantidad</th>
                    <th>Precio Unitario</th>
                    <th>Subtotal Producto</th>
                  </tr>
                </thead>
                <tbody className='tbody-productoscompra'>
                  {compra.detalleCompras.map((detalle, index) => (
                    <tr key={detalle.idDetalleCompra || index}>
                      <td>{index + 1}</td>
                      <td style={{ textAlign: 'center' }}>
                        {detalle.producto?.nombre || `Producto #${detalle.id_producto}`}
                      </td>
                      <td style={{ textAlign: 'center', fontWeight: 'bold' }}>
                        {detalle.cantidad || 0}
                      </td>
                      <td style={{ textAlign: 'right' }}>
                        {formatearMoneda(detalle.precio_unitario)}
                      </td>
                      <td style={{ textAlign: 'right', fontWeight: 'bold', color: '#28a745' }}>
                        {formatearMoneda(detalle.subtotalProducto)}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          ) : (
            <div style={{ 
              textAlign: 'center', 
              padding: '30px', 
              color: '#666',
              backgroundColor: '#f8f9fa',
              borderRadius: '8px'
            }}>
              <FaBoxOpen style={{ fontSize: '3em', marginBottom: '15px', opacity: 0.3 }} />
              <p style={{ fontSize: '1.1em', margin: 0 }}>No hay productos registrados en esta compra</p>
            </div>
          )}
        </div>

        {/* Resumen Financiero */}
        <div className="detalle-imagenes-bottom" style={{ marginTop: '20px' }}>
          <h4 className="subtitulo-imagenes">
            <FaMoneyBillWave style={{ marginRight: '8px' }} />
            Resumen de la Compra
          </h4>
          
          <div className="resumen-compra">
            <p>
              <strong className='datosresumen-detallecompra'>Subtotal:</strong> 
              <span className='datosresumen-detallecompra'>{formatearMoneda(compra.subtotal)}</span>
            </p>
            
            {compra.descuento > 0 && (
              <p>
                <strong className='datosresumen-detallecompra'>Descuento:</strong> 
                <span className='datosresumen-detallecompra' style={{ color: '#dc3545' }}>-{formatearMoneda(compra.descuento)}</span>
              </p>
            )}
            
            <p>
              <strong className='datosresumen-detallecompra'>IVA (19%): </strong> 
              <span className='datosresumen-detallecompra' >{formatearMoneda(compra.iva)}</span>
            </p>
            
            <p style={{ 
              fontSize: '1.2em', 
              borderTop: '2px solid #ddd', 
              paddingTop: '15px', 
              marginTop: '15px',
              fontWeight: 'bold'
            }}>
              <strong className='datosresumen-detallecompra'>Total:</strong> 
              <span style={{ color: '#28a745' }}>
                {formatearMoneda(compra.total)}
              </span>
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