import "./Detalles.css";
import { FaUser, FaPhone, FaEnvelope, FaIdCard, FaMapMarkerAlt, FaHome, FaImage, FaCalendarAlt } from 'react-icons/fa';
import { formatFechaCorta } from './formatters'; 

export default function DetallesUser({ usuario, onClose }) {
    if (!usuario) {
        return null;
    }
    return (
        <div className="modal-overlay">
            <div className="modal-content">
                <div className="detalle-layout">
                    {/* Columna izquierda: Información */}
                    <div className="detalle-info">
                        <h2 className="titulo-modal-detalle-usuario">Detalles de Usuario:</h2 >

                        <p><strong><FaUser /> Nombre de Usuario:</strong> {usuario.nombreUsuario}</p>

                        <div className='container-foto'>
                            <p><strong><FaImage /> Foto:</strong></p>
                            <img src={usuario.foto} alt="Foto del usuario" className="foto-verdetalle-user" style={{ width: '45%', borderRadius: '50%' }} />
                        </div>

                        <p><strong><FaEnvelope ></FaEnvelope> Correo:</strong> {usuario.correo}✉️</p>
                        <p><strong><FaIdCard /> Id:</strong> {usuario.id}</p>
                        <p><strong>Estado:</strong> {usuario.estado ? '✅ Activo' : '❌ Inactivo'}</p>
                        <p><strong><FaUser /> Nombre Completo:</strong> {usuario.nombre_Completo}</p>
                        <p><strong>Apellido:</strong> {usuario.apellido}</p>
                        <p><strong><FaUser /> Rol de Usuario:</strong> {usuario.rol}</p>
                        <p><strong>Tipo de Identificación:</strong> {usuario.tipo_Identificacion}</p>
                        <p><strong>Número de Identificación:</strong> {usuario.numero_Identificacion}</p>
                        <p><strong><FaPhone /> Número de Contacto:</strong> {usuario.numero_Contacto}</p>
                        <p><strong><FaMapMarkerAlt /> Barrio:</strong> {usuario.barrio}</p>
                        <p><strong><FaHome /> Dirección:</strong> {usuario.direccion}</p>
                        <p><strong> <FaCalendarAlt /> Fecha de Creación:</strong> {formatFechaCorta(usuario.fecha_Creacion)}</p>


                        <button className="boton-cancelar-detalle" onClick={onClose}>Cerrar</button>
                    </div>
                </div>
            </div>
        </div>
    );
}