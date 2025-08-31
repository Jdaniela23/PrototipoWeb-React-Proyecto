import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { FaArrowLeft, FaBell, FaEnvelope, FaTag } from 'react-icons/fa';
import Nav from '../components/Nav';
import '../pages/AjustesAdmin.css';
import './Notificaciones.css'; 

function Notificaciones() {
    const navigate = useNavigate();
    const [menuCollapsed, setMenuCollapsed] = useState(false);
    const toggleMenu = () => setMenuCollapsed(!menuCollapsed);

    const [notificaciones, setNotificaciones] = useState({
        correosPersonalizados: false,
        disponibilidadProductos: false,
        notificacionesPush: false,
    });

    const handleCheckboxChange = (event) => {
        const { name, checked } = event.target;
        setNotificaciones({
            ...notificaciones,
            [name]: checked,
        });
    };

    const handleSaveChanges = () => {
        // Lógica para enviar la configuración al backend
        console.log('Guardando cambios:', notificaciones);
        alert('¡Cambios guardados con éxito!');
        navigate(-1); // Regresa a la página anterior
    };

    return (
        //Aquí utilizamos la misma estructura que AjustesAdmin
        <div className="adjustments-container">
            <Nav menuCollapsed={menuCollapsed} toggleMenu={toggleMenu} />
            <div className={`adjustments-main-content-area ${menuCollapsed ? 'expanded-margin' : ''}`}>
                <div className="adjustments-settings-page">
                    <div className="notificaciones-header">
                        <FaArrowLeft  className="back-arrow" onClick={() => navigate(-1)} />
                        <h1 className="adjustments-page-title">Notificaciones</h1>
                    </div>
                    <p className="adjustments-page-subtitle">Elige qué alertas y mensajes deseas recibir.</p>

                    <div className="notificaciones-options">
                        <div className="opcion-item">
                            <div className="card-icon-wrapper">
                                <FaEnvelope size="24px" />
                            </div>
                            <label className="opcion-label" htmlFor="correosPersonalizados">
                                <input
                                    type="checkbox"
                                    id="correosPersonalizados"
                                    name="correosPersonalizados"
                                    checked={notificaciones.correosPersonalizados}
                                    onChange={handleCheckboxChange}
                                />
                                Permitir que la tienda Julieta me envíe correos electrónicos personalizados.
                            </label>
                        </div>
                        
                        <div className="opcion-item">
                            <div className="card-icon-wrapper">
                                <FaTag size="24px" />
                            </div>
                            <label className="opcion-label" htmlFor="disponibilidadProductos">
                                <input
                                    type="checkbox"
                                    id="disponibilidadProductos"
                                    name="disponibilidadProductos"
                                    checked={notificaciones.disponibilidadProductos}
                                    onChange={handleCheckboxChange}
                                />
                                Recibir notificaciones de disponibilidad de productos.
                            </label>
                        </div>

                        <div className="opcion-item">
                            <div className="card-icon-wrapper">
                                <FaBell size="24px" />
                            </div>
                            <label className="opcion-label" htmlFor="notificacionesPush">
                                <input
                                    type="checkbox"
                                    id="notificacionesPush"
                                    name="notificacionesPush"
                                    checked={notificaciones.notificacionesPush}
                                    onChange={handleCheckboxChange}
                                />
                                Recibir notificaciones push sobre actualizaciones de cuenta.
                            </label>
                        </div>
                    </div>

                    <button className="guardar-cambios-btn" onClick={handleSaveChanges}>
                        Guardar cambios
                    </button>
                </div>
            </div>
        </div>
    );
}

export default Notificaciones;