import React, { useState, useEffect } from 'react';
import { FaTimes } from 'react-icons/fa';
import './PerfilAdmin.css';

// ✨ Simulación de los datos del usuario logueado


const usuarioLogueado = {
    id: '01',
    nombre_Completo: 'Jessica',
    apellido: 'Lopez Perez',
    tipo_Identificacion: 'C.C',
    numero_Identificacion: '1036589745',
    correo: 'Jessica@gmail.com',
    numero_Contacto: '3109876543',
    barrio: 'Bellavista',
    direccion: 'Calle 10 # 20-30',
    rol: 'Administrador',
    
};

const PerfilAdminModal = ({ isOpen, onClose }) => {
    const [shouldShow, setShouldShow] = useState(false);

    useEffect(() => {
        if (isOpen) {
            setTimeout(() => setShouldShow(true), 10);
        } else {
            setShouldShow(false);
        }
    }, [isOpen]);

    if (!isOpen && !shouldShow) return null;

    const handleModalContentClick = (e) => {
        e.stopPropagation();
    };

    return (
        <div className="profile-admin-modal-overlay" onClick={onClose}>
            <div className={`profile-admin-modal-content ${shouldShow ? 'show' : ''}`} onClick={handleModalContentClick}>
                <button className="profile-admin-modal-close-button" onClick={onClose}>
                    <FaTimes />
                </button>
                <div className="profile-admin-modal-header">
                    <h2 className="profile-admin-modal-title">Mi Perfil</h2>
                    <p className="profile-admin-modal-subtitle">Información general de tu cuenta.</p>
                </div>
                <div className="profile-admin-modal-view-content">
                
                    <div className="profile-admin-details-grid">
                        <div className="profile-admin-detail-item">
                            <span className="profile-admin-label-heading">Nombre Completo:</span>
                            <p className="profile-admin-detail-text">{usuarioLogueado.nombre_Completo} {usuarioLogueado.apellido}</p>
                        </div>
                        <div className="profile-admin-detail-item">
                            <span className="profile-admin-label-heading">Tipo y N° de Identificación:</span>
                            <p className="profile-admin-detail-text">{usuarioLogueado.tipo_Identificacion} - {usuarioLogueado.numero_Identificacion}</p>
                        </div>
                        <div className="profile-admin-detail-item">
                            <span className="profile-admin-label-heading">Correo Electrónico:</span>
                            <p className="profile-admin-detail-text">{usuarioLogueado.correo}</p>
                        </div>
                        <div className="profile-admin-detail-item">
                            <span className="profile-admin-label-heading">Número de Contacto:</span>
                            <p className="profile-admin-detail-text">{usuarioLogueado.numero_Contacto}</p>
                        </div>
                        <div className="profile-admin-detail-item">
                            <span className="profile-admin-label-heading">Barrio:</span>
                            <p className="profile-admin-detail-text">{usuarioLogueado.barrio}</p>
                        </div>
                        <div className="profile-admin-detail-item">
                            <span className="profile-admin-label-heading">Dirección:</span>
                            <p className="profile-admin-detail-text">{usuarioLogueado.direccion}</p>
                        </div>
                        <div className="profile-admin-detail-item">
                            <span className="profile-admin-label-heading">Rol:</span>
                            <p className="profile-admin-detail-text">{usuarioLogueado.rol}</p>
                        </div>
                    </div>

                </div>
            </div>
        </div>
    );
};

export default PerfilAdminModal;