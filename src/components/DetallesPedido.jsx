// src/components/DetallesPedido.jsx
import { FaMoneyBillWave, FaTruck, FaFileAlt, FaIdCard } from 'react-icons/fa';
import './Detalles.css'; 
import { useState, useEffect } from 'react';
import { getPedidoById } from '../api/pedidosService';

export default function DetallesPedido({ pedido, onClose }) {
  const [pedidoDetalle, setPedidoDetalle] = useState(null);
  const [loading, setLoading] = useState(true);

  // 🔥 Cargar detalle completo desde el backend
  useEffect(() => {
    const fetchPedido = async () => {
      try {
        setLoading(true);
        const data = await getPedidoById(pedido.id_Pedido);
        setPedidoDetalle(data);
      } catch (error) {
        console.error('Error cargando pedido:', error);
        alert('No se pudo cargar el detalle del pedido');
        onClose();
      } finally {
        setLoading(false);
      }
    };
    
    if (pedido?.id_Pedido) {
      fetchPedido();
    }
  }, [pedido, onClose]);



  if (!pedidoDetalle) return null;

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal-content" onClick={(e) => e.stopPropagation()}>
        <div className="detalle-layout">
          <div className="detalle-info">
            <h2 className="titulo-modal-detalle">Detalles del Pedido</h2>
            
            <p><strong><FaIdCard /> Id:</strong> {pedidoDetalle.id_Pedido}</p>
            <p><strong><FaFileAlt /> Fecha:</strong> {new Date(pedidoDetalle.fecha_Creacion).toLocaleDateString()}</p>
            <p><strong><FaFileAlt /> Usuario:</strong> {pedidoDetalle.usuario?.nombre_Completo || 'N/A'}</p>
            <p><strong><FaMoneyBillWave /> Total:</strong> ${pedidoDetalle.total_Pedido?.toLocaleString()}</p>
            <p><strong><FaTruck /> Estado:</strong> {pedidoDetalle.estado_Pedido}</p>

            {/* Si tu API devuelve más campos, agrégalos aquí */}
            {pedidoDetalle.metodoPago && (
              <p><strong><FaMoneyBillWave /> Método de Pago:</strong> {pedidoDetalle.metodoPago}</p>
            )}
            {pedidoDetalle.domicilio !== undefined && (
              <p><strong><FaTruck /> Requiere Domicilio:</strong> {pedidoDetalle.domicilio ? 'Sí' : 'No'}</p>
            )}

            <button className="boton-cancelar-detalle" onClick={onClose}>Cerrar</button>
          </div>
        </div>
      </div>
    </div>
  );
}