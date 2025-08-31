import React, { useState } from 'react';
import { FaTimes, FaShieldAlt } from 'react-icons/fa';
import CambiarContrasenaAdminModal from './CambiarContrasenaAdminModal';
import TwoFactorAuthModal from './TwoFactorAuthModal';
import './SeguridadAdminModal.css';

const SeguridadAdminModal = ({ isOpen, onClose }) => {
    const [isCambiarContrasenaModalOpen, setIsCambiarContrasenaModalOpen] = useState(false);
    const [is2FAModalOpen, setIs2FAModalOpen] = useState(false);

    const openCambiarContrasenaModal = () => {
        setIsCambiarContrasenaModalOpen(true);
    };

    const closeCambiarContrasenaModal = () => {
        setIsCambiarContrasenaModalOpen(false);
    };

    const open2FAModal = () => {
        setIs2FAModalOpen(true);
    };

    const close2FAModal = () => {
        setIs2FAModalOpen(false);
    };

    if (!isOpen) {
        return null;
    }

    
    if (isCambiarContrasenaModalOpen) {
        return <CambiarContrasenaAdminModal isOpen={true} onClose={closeCambiarContrasenaModal} />;
    }

    if (is2FAModalOpen) {
        return <TwoFactorAuthModal isOpen={true} onClose={close2FAModal} />;
    }

    // ⭐ Este es el contenido del modal principal de seguridad
    return (
        <div className="seguridad-modal-overlay" onClick={onClose}>
            <div className="seguridad-modal-content" onClick={(e) => e.stopPropagation()}>
                <button className="seguridad-modal-close-button" onClick={onClose}>
                    <FaTimes />
                </button>
                <div className="seguridad-modal-header">
                    <FaShieldAlt size="50px" className="seguridad-icon" />
                    <h2 className="seguridad-modal-title">Ajustes de Seguridad</h2>
                    <p className="seguridad-modal-subtitle">Gestiona tu contraseña y la autenticación de dos factores.</p>
                </div>
                <div className="seguridad-options-container">
                    <button className="seguridad-option-button" onClick={openCambiarContrasenaModal}>
                        Cambiar Contraseña
                    </button>
                    <button className="seguridad-option-button" onClick={open2FAModal}>
                        Configurar Autenticación en Dos Pasos (2FA)
                    </button>
                </div>
            </div>
        </div>
    );
};

export default SeguridadAdminModal;