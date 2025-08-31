import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import Nav from '../components/Nav';
import { FaUserCircle, FaCog, FaBell, FaGlobe, FaShieldAlt } from 'react-icons/fa';
import './AjustesAdmin.css';
import PerfilAdminModal from './PerfilAdminModal';
import SeguridadAdminModal from './SeguridadAdminModal';

export default function AjustesAdmin() {
    const [menuCollapsed, setMenuCollapsed] = useState(false);
    const toggleMenu = () => setMenuCollapsed(!menuCollapsed);
    const navigate = useNavigate();

    const [isPerfilModalOpen, setIsPerfilModalOpen] = useState(false);
    const [isSeguridadModalOpen, setIsSeguridadModalOpen] = useState(false);

    const openPerfilModal = () => {
        setTimeout(() => setIsPerfilModalOpen(true), 50);
    };

    const closePerfilModal = () => setIsPerfilModalOpen(false);

    const openSeguridadModal = () => {
        setTimeout(() => setIsSeguridadModalOpen(true), 50);
    };

    const closeSeguridadModal = () => setIsSeguridadModalOpen(false);

    return (
        <div className="adjustments-container">
            <Nav menuCollapsed={menuCollapsed} toggleMenu={toggleMenu} />
            <div className={`adjustments-main-content-area ${menuCollapsed ? 'expanded-margin' : ''}`}>
                <div className="adjustments-settings-page">
                    <h1 className="adjustments-page-title">Ajustes</h1>
                    <p className="adjustments-page-subtitle">Personaliza y gestiona la configuración de tu cuenta.</p>
                    <div className="adjustments-options-grid">
                        <div className="adjustments-option-card" onClick={openPerfilModal}>
                            <div className="card-icon-wrapper">
                                <FaUserCircle size="40px" />
                            </div>
                            <div className="card-content">
                                <h2 className="card-title">Mi Perfil</h2>
                                <p className="card-description">Mira tu información y detalles de contacto.</p>
                            </div>
                        </div>
                        <div className="adjustments-option-card" onClick={openSeguridadModal}>
                            <div className="card-icon-wrapper">
                                <FaShieldAlt size="40px" />
                            </div>
                            <div className="card-content">
                                <h2 className="card-title">Seguridad</h2>
                                <p className="card-description">Cambia tu contraseña y configura la autenticación de dos factores.</p>
                            </div>
                        </div>

                        <Link to="/notificaciones" className="adjustments-option-card">
                            <div className="card-icon-wrapper">
                                <FaBell size="40px" />
                            </div>
                            <div className="card-content">
                                <h2 className="card-title">Notificaciones</h2>
                                <p className="card-description">Elige qué alertas y mensajes deseas recibir.</p>
                            </div>
                        </Link>

                        {/* ⭐ Tarjeta de Otros Ajustes (con Link) ⭐ */}
                        <Link to="/otrosAjustes" className="adjustments-option-card">
                            <div className="card-icon-wrapper">
                                <FaCog size="40px" />
                            </div>
                            <div className="card-content">
                                <h2 className="card-title">Otros Ajustes</h2>
                                <p className="card-description">Configuraciones generales de la plataforma y de la cuenta.</p>
                            </div>
                        </Link>
                    </div>
                </div>
            </div>

            <PerfilAdminModal
                isOpen={isPerfilModalOpen}
                onClose={closePerfilModal}
            />
            <SeguridadAdminModal
                isOpen={isSeguridadModalOpen}
                onClose={closeSeguridadModal}
            />
        </div>
    );
}