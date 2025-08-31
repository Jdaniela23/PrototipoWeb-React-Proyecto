import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { FaEyeSlash, FaEye } from 'react-icons/fa';
import './RestablecerPass.css';
import { Link } from 'react-router-dom';

function RestablecerContrasena() {
  const navigate = useNavigate();
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [errorMensaje, setErrorMensaje] = useState('');
  const [mensajeExito, setMensajeExito] = useState('');

  const [showNewPassword, setShowNewPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  // Regex para la validación de la contraseña (al menos 8 caracteres, mayúscula, minúscula, número, especial)
  const passwordRegex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[!@#$%^&*()_+={}\[\]|\\:;"'<>,.?/~`]).{8,}$/;

  const handleNewPasswordChange = (e) => {
    setNewPassword(e.target.value);
    setErrorMensaje('');
    setMensajeExito('');
  };

  const handleConfirmPasswordChange = (e) => {
    setConfirmPassword(e.target.value);
    setErrorMensaje('');
    setMensajeExito('');
  };

  const toggleNewPasswordVisibility = () => {
    setShowNewPassword(prev => !prev);
  };

  const toggleConfirmPasswordVisibility = () => {
    setShowConfirmPassword(prev => !prev);
  };

  const handleGuardarContrasena = (e) => {
    e.preventDefault();

    setErrorMensaje('');
    setMensajeExito('');

    // 1. Validación de campo requerido (tanto para nueva como para confirmar)
    if (!newPassword.trim() || !confirmPassword.trim()) {
      setErrorMensaje('Todos los campos de contraseña son requeridos.');
      return;
    }

    // 2. Validación de requisitos de contraseña (la que debe cumplir)
    if (!passwordRegex.test(newPassword)) {
      // <--- CAMBIO CLAVE AQUÍ: Mensaje de error con los requisitos
      setErrorMensaje('• La contraseña debe tener al menos 8 caracteres, incluir mayúsculas, minúsculas, números y caracteres especiales como !, @, #, $, %, &, ., etc.');
      return;
    }

    // 3. Validación de coincidencia de contraseñas
    if (newPassword !== confirmPassword) {
      setErrorMensaje('Las contraseñas no coinciden.');
      return;
    }

    // --- Si todas las validaciones pasan ---
    setMensajeExito('¡Contraseña restablecida con éxito! Redireccionando al Login 👩🏻‍💻');
    console.log("Nueva contraseña guardada:", newPassword);

    setTimeout(() => {
      navigate('/login'); // O a una página de confirmación final
    }, 4000);
  };

  return (
    <div className='recuperar-contrasena-page-container'>
      <div className='recuperar-contrasena-card'>
        <h2>Recuperar contraseña 👩🏻‍💻</h2>

        <form onSubmit={handleGuardarContrasena}>
          <p className='instrucciones'>
            Ingrese su nueva contraseña:
          </p>
          <div className='input-group password-input-container'>
            <input
              type={showNewPassword ? 'text' : 'password'}
              placeholder='Ingresa nueva contraseña'
              className='password-input'
              aria-label='Nueva contraseña'
              id='new-password-id'
              value={newPassword}
              onChange={handleNewPasswordChange}
              required
            />
            <span
              className="password-toggle-icon"
              onClick={toggleNewPasswordVisibility}
            >
              {showNewPassword ? <FaEyeSlash /> : <FaEye />}
            </span>
          </div>

          {/* <--- ¡PARRAFO DE REQUISITOS ELIMINADO DE AQUÍ! */}

          <p className='instrucciones'>
            Confirmar contraseña:
          </p>
          <div className='input-group password-input-container'>
            <input
              type={showConfirmPassword ? 'text' : 'password'}
              placeholder='Confirma la contraseña'
              className='password-input'
              aria-label='Confirmar contraseña'
              id='confirm-password-id'
              value={confirmPassword}
              onChange={handleConfirmPasswordChange}
              required
            />
            <span
              className="password-toggle-icon"
              onClick={toggleConfirmPasswordVisibility}
            >
              {showConfirmPassword ? <FaEyeSlash /> : <FaEye />}
            </span>
          </div>

          {/* El mensaje de error ahora contendrá los requisitos si no se cumplen */}
          {errorMensaje && (
            <p className='mensaje-error'>
              {errorMensaje}
            </p>
          )}

          {mensajeExito && (
            <p className='mensaje-confirmacion'>
              {mensajeExito}
            </p>
          )}

          <button
            type='submit'
            className='btn-guardar-contrasena btn-gris'
          >
            Guardar nueva contraseña
          </button>
        </form>
      </div>
    </div>
  );
}

export default RestablecerContrasena;