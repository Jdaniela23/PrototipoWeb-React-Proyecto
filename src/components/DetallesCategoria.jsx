import './Detalles.css';
import { FaList, FaCalendarAlt, FaIdCard } from 'react-icons/fa';

export default function DetallesCategoria({ categoria, onClose }) {
  if (!categoria) {
    return null;
  }

  return (
    <div className="modal-overlay">
      <div className="modal-content">
        <div className="detalle-layout">
          <div className="detalle-info">
            <h2 className="titulo-modal-detalle">Detalles de la Categoría</h2>
            <p><strong><FaIdCard /> Id:</strong> {categoria.id}</p>
            <p><strong>Descripción:</strong> {categoria.descripcion}</p>
            <p><strong><FaList /> Nombre:</strong> {categoria.nombre}</p>

            <p><strong>< FaCalendarAlt /> Fecha de creación:</strong> {categoria.fechaCreacion}</p>
            <p><strong>Estado:</strong> {categoria.estado ? 'Activa ✅' : 'Inactiva ❌'}</p>
          </div>

        </div>
        <button className="boton-cancelar-detalle" onClick={onClose}>Cerrar</button>
      </div>

    </div>
  );
}