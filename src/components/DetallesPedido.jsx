import { FaMoneyBillWave, FaTruck, FaFileAlt, FaIdCard, FaMapMarkerAlt, FaHome } from 'react-icons/fa';
import './Detalles.css';
import { useState, useEffect } from 'react';
import { getPedidoById } from '../api/pedidosService';

export default function DetallesPedido({ pedido, onClose }) {
  const [pedidoDetalle, setPedidoDetalle] = useState(null);
  const [loading, setLoading] = useState(true);

  // Cargar detalle completo desde el backend
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


  // --- AÑADE ESTO PARA DEPURAR ---
  if (pedidoDetalle) {
    console.log("Detalle del Pedido Cargado:", pedidoDetalle);
    console.log("Dirección en Pedido (direccion_Entrega):", pedidoDetalle.direccion_Entrega);
    console.log("Dirección en Usuario Anidado (usuario.direccion):", pedidoDetalle.usuario?.direccion);
  }
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
            <p><strong>Método de Pago: </strong>{pedidoDetalle.metodo_Pago}</p>
            {pedidoDetalle.metodoPago && (
              <p><strong><FaMoneyBillWave /> Método de Pago:</strong> {pedidoDetalle.metodoPago}</p>
            )}
            {pedidoDetalle.domicilio !== undefined && (
              <p><strong><FaTruck /> Requiere Domicilio:</strong> {pedidoDetalle.domicilio ? 'Sí' : 'No'}</p>
            )}
            <p>
              <strong> <FaMapMarkerAlt /> Dirección de Entrega:</strong>
              {
                // ⭐️ LÓGICA CORREGIDA ⭐️
                // Si existe y NO es una cadena vacía/falsa, úsala.
                // Si no, usa la dirección del usuario.
                pedidoDetalle.direccion_Entrega
                  ? pedidoDetalle.direccion_Entrega
                  : pedidoDetalle.usuario?.direccion || 'N/A'
              }
            </p>
            {pedidoDetalle.barrio_Entrega && (
              <p><strong><FaHome /> Barrio de Entrega:</strong> {pedidoDetalle.barrio_Entrega}</p>
            )}
           



            <button className="boton-cancelar-detalle" onClick={onClose}>Cerrar</button>
          </div>
        </div>
      </div>
    </div>
  );
}