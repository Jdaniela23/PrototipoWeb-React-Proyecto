import React, { useState, useEffect } from 'react';
import { QRCodeSVG } from 'qrcode.react';
import { FaTimes, FaLock, FaCheckCircle, FaExclamationCircle } from 'react-icons/fa';
import './TwoFactorAuth.css';

const TwoFactorAuthModal = ({ isOpen, onClose, onSubmit }) => {
    const [shouldShow, setShouldShow] = useState(false);
    const [verificationCode, setVerificationCode] = useState('');
    const [isVerified, setIsVerified] = useState(null);

    const userEmail = 'Jessica@gmail.com';
    const twoFaSecret = 'JBSWY3DPEHPK3PXP';
    const otpAuthUrl = `otpauth://totp/MyAwesomeApp:${userEmail}?secret=${twoFaSecret}&issuer=MyAwesomeApp`;

    useEffect(() => {
        if (isOpen) {
            setShouldShow(true);
            setVerificationCode('');
            setIsVerified(null);
        } else {
            setShouldShow(false);
        }
    }, [isOpen]);

    if (!isOpen && !shouldShow) {
        return null;
    }

    const handleModalContentClick = (e) => {
        e.stopPropagation();
    };

    const handleVerify = () => {
        if (verificationCode.length === 6) {
            onSubmit(verificationCode);
        } else {
            setIsVerified(false);
        }
    };

    const renderVerificationStatus = () => {
        if (isVerified === true) {
            return (
                <div className="status-message success">
                    <FaCheckCircle className="status-icon" />
                    <span>¡Verificación exitosa! Tu 2FA está activa.</span>
                </div>
            );
        } else if (isVerified === false) {
            return (
                <div className="status-message error">
                    <FaExclamationCircle className="status-icon" />
                    <span>Código incorrecto. Inténtalo de nuevo.</span>
                </div>
            );
        }
        return null;
    };

    return (
        <div className="two-fa-modal-overlay" onClick={onClose}>
            <div className={`two-fa-modal-content ${shouldShow ? 'show' : ''}`} onClick={handleModalContentClick}>
                <button className="two-fa-modal-close-button" onClick={onClose}>
                    <FaTimes />
                </button>
                <div className="two-fa-modal-header">
                    <FaLock size="50px" className="two-fa-icon" />
                    <h2 className="two-fa-modal-title">Autenticación en Dos Pasos</h2>
                    <p className="two-fa-modal-subtitle">
                        Protege tu cuenta con una capa de seguridad adicional.
                    </p>
                </div>


                <div className="two-fa-info">
                    <h3>Paso 1: Escanear el código QR</h3>
                    <p className="two-fa-info-step">Utiliza tu aplicación de autenticación para escanear el siguiente código. Si no puedes escanearlo, ingresa el código manual:</p>
                    <div className="qr-code-container">
                        <QRCodeSVG value={otpAuthUrl} size={150} />
                    </div>
                    <p className="two-fa-secret-code">Código Manual: **{twoFaSecret}**</p>
                </div>

                <div className="two-fa-config-container">
                    <h3>Paso 2: Verificar el código</h3>
                    <p className="two-fa-info-step">Ingresa el código de 6 dígitos que aparece en tu aplicación de autenticación para completar la configuración.</p>
                    <div className="two-fa-verification-field">
                        <input
                            type="text"
                            className="two-fa-input-field"
                            value={verificationCode}
                            onChange={(e) => setVerificationCode(e.target.value)}
                            maxLength="6"
                            placeholder="Ingresa el código de 6 dígitos"
                        />
                        <button className="two-fa-verify-button" onClick={handleVerify}>
                            Verificar
                        </button>
                    </div>
                    {renderVerificationStatus()}
                </div>

                <div className="two-fa-modal-buttons-container">
                    <button className="two-fa-cancel-button" onClick={onClose}>
                        Cerrar
                    </button>
                </div>
            </div>
        </div>
    );
};

export default TwoFactorAuthModal;