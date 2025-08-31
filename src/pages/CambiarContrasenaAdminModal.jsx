import React, { useState, useEffect } from 'react';
import './CambiarContrasenaAdmin.css';
import { FaTimes, FaLock, FaEye, FaEyeSlash } from 'react-icons/fa';

const CambiarContrasenaAdminModal = ({ isOpen, onClose }) => {
    const [passwords, setPasswords] = useState({
        currentPassword: '',
        newPassword: '',
        confirmNewPassword: ''
    });

    const [shouldShow, setShouldShow] = useState(false);
    const [passwordError, setPasswordError] = useState('');
    const [confirmError, setConfirmError] = useState('');
    const [showCurrentPassword, setShowCurrentPassword] = useState(false);
    const [showNewPassword, setShowNewPassword] = useState(false);
    const [showConfirmNewPassword, setShowConfirmNewPassword] = useState(false);

    useEffect(() => {
        if (isOpen) {
            setTimeout(() => setShouldShow(true), 10);
        } else {
            setShouldShow(false);
        }
    }, [isOpen]);

    if (!isOpen && !shouldShow) {
        return null;
    }

    const handleChange = (e) => {
        const { name, value } = e.target;
        setPasswords(prev => ({ ...prev, [name]: value }));
        
        // Limpiar errores al escribir
        if (name === 'newPassword') {
            setPasswordError('');
            if (value !== passwords.confirmNewPassword && passwords.confirmNewPassword) {
                setConfirmError('Las contraseñas no coinciden');
            } else {
                setConfirmError('');
            }
        }
        if (name === 'confirmNewPassword') {
            if (value !== passwords.newPassword) {
                setConfirmError('Las contraseñas no coinciden');
            } else {
                setConfirmError('');
            }
        }
    };
    
    const togglePasswordVisibility = (field) => {
        if (field === 'current') setShowCurrentPassword(!showCurrentPassword);
        if (field === 'new') setShowNewPassword(!showNewPassword);
        if (field === 'confirm') setShowConfirmNewPassword(!showConfirmNewPassword);
    };

    /* 🔒 Validación de contraseña fuerte */
    const validatePassword = (pwd) => {
        const minLen = 8;
        const tests = [
            /.{8,}/,            // 8+ caracteres
            /[A-Z]/,            // mayúscula
            /[a-z]/,            // minúscula
            /[0-9]/,            // número
            /[!@#$%^&*()_+\-=[\]{};':"\\|,.<>/?]/ // especial
        ];
        return tests.every(t => t.test(pwd));
    };

    const handleSubmit = (e) => {
        e.preventDefault();

        // Validación de nueva contraseña fuerte
        if (!validatePassword(passwords.newPassword)) {
            setPasswordError('• La contraseña debe tener al menos 8 caracteres, incluir mayúsculas, minúsculas, números y caracteres especiales.');
            return;
        } else {
            setPasswordError('');
        }

        // Validación de confirmación
        if (passwords.newPassword !== passwords.confirmNewPassword) {
            setConfirmError('Las contraseñas no coinciden');
            return;
        } else {
            setConfirmError('');
        }

        // Si todas las validaciones pasan
        console.log('Datos de contraseña a cambiar:', passwords);
        alert('Contraseña actualizada con éxito.');
        onClose();
    };
    
    const handleModalContentClick = (e) => {
        e.stopPropagation();
    };

    return (
        <div className="change-pass-modal-overlay" onClick={onClose}>
            <div className={`change-pass-modal-content ${shouldShow ? 'show' : ''}`} onClick={handleModalContentClick}>
                <button className="change-pass-modal-close-button" onClick={onClose}>
                    <FaTimes />
                </button>
                <div className="change-pass-modal-header">
                    <FaLock size="50px" className="change-pass-icon" />
                    <h2 className="change-pass-modal-title">Cambiar Contraseña</h2>
                    <p className="change-pass-modal-subtitle">Asegura tu cuenta actualizando tu contraseña periódicamente.</p>
                </div>
                <form onSubmit={handleSubmit}>
                    <div className="change-pass-form-group">
                        <label className="change-pass-label-heading">Contraseña Actual:</label>
                        <div className="change-pass-input-container">
                            <input
                                type={showCurrentPassword ? 'text' : 'password'}
                                name="currentPassword"
                                value={passwords.currentPassword}
                                onChange={handleChange}
                                className="change-pass-input-field"
                                required
                            />
                            <span className="change-pass-toggle-icon" onClick={() => togglePasswordVisibility('current')}>
                                {showCurrentPassword ? <FaEyeSlash /> : <FaEye />}
                            </span>
                        </div>
                    </div>
                    <div className="change-pass-form-group">
                        <label className="change-pass-label-heading">Nueva Contraseña:</label>
                        <div className="change-pass-input-container">
                            <input
                                type={showNewPassword ? 'text' : 'password'}
                                name="newPassword"
                                value={passwords.newPassword}
                                onChange={handleChange}
                                className="change-pass-input-field"
                                required
                            />
                            <span className="change-pass-toggle-icon" onClick={() => togglePasswordVisibility('new')}>
                                {showNewPassword ? <FaEyeSlash /> : <FaEye />}
                            </span>
                        </div>
                        {passwordError ? (
                            <p className="change-pass-validation-message error-message">{passwordError}</p>
                        ) : (
                            <p className="change-pass-validation-message">• La contraseña debe tener al menos 8 caracteres, incluir mayúsculas, minúsculas, números y caracteres especiales.</p>
                        )}
                    </div>
                    <div className="change-pass-form-group">
                        <label className="change-pass-label-heading">Confirmar Nueva Contraseña:</label>
                        <div className="change-pass-input-container">
                            <input
                                type={showConfirmNewPassword ? 'text' : 'password'}
                                name="confirmNewPassword"
                                value={passwords.confirmNewPassword}
                                onChange={handleChange}
                                className="change-pass-input-field"
                                required
                            />
                            <span className="change-pass-toggle-icon" onClick={() => togglePasswordVisibility('confirm')}>
                                {showConfirmNewPassword ? <FaEyeSlash /> : <FaEye />}
                            </span>
                        </div>
                        {confirmError && <p className="change-pass-validation-message error-message">{confirmError}</p>}
                    </div>
                    <div className="change-pass-modal-buttons-container">
                        <button type="button" className="change-pass-cancel-button" onClick={onClose}>
                            Cancelar
                        </button>
                        <button type="submit" className="change-pass-save-button">
                            Guardar Cambios
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
};

export default CambiarContrasenaAdminModal;