
import { FaMoneyBillWave, FaTruck, FaFileAlt, FaIdCard } from 'react-icons/fa';
import './Detalles.css'; 

export default function DetallesPedido({ pedido, onClose }) {
  if (!pedido) {
    return null;
  }

  return (
    <div className="modal-overlay">
      <div className="modal-content">
        <div className="detalle-layout">
          <div className="detalle-info">
            <h2 className="titulo-modal-detalle">Detalles del Pedido</h2>
            <p><strong><FaIdCard /> Id:</strong> {pedido.idPedido}</p>
            <p><strong><FaFileAlt /> Fecha:</strong> {pedido.fecha}</p>
            <p><strong><FaFileAlt /> Documento Cliente:</strong> {pedido.documentoCliente}</p>
            <p><strong><FaMoneyBillWave /> Método de Pago:</strong> {pedido.metodoPago}</p>
            <p><strong><FaTruck /> Requiere Domicilio:</strong> {pedido.domicilio}</p>
            <p><strong><FaMoneyBillWave /> Estado de Pago:</strong> {pedido.estadoPago}</p>

            {/* Si necesitas un diseño de dos columnas, puedes añadir el otro div, aunque esté vacío. */}
            {/* <div className="detalle-imagenes"></div> */}

            <button className="boton-cancelar-detalle" onClick={onClose}>Cerrar</button>
          </div>
        </div>
      </div>
    </div>
  );
}