// src/components/LoginForm.jsx

import { useNavigate, Link } from 'react-router-dom';
import './LoginForm.css';
import miImagen from '../assets/imagen-principal.png';
import { FaUserCircle } from 'react-icons/fa';
import { FaEyeSlash, FaEye } from 'react-icons/fa';
import React, { useState } from 'react';
import TwoFactorAuthModal from '../pages/TwoFactorAuthModal'; 

function LoginForm() {
  const navigate = useNavigate();
  const [showPassword, setShowPassword] = useState(false);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loginMessage, setLoginMessage] = useState('');
  
  const [is2FAModalOpen, setIs2FAModalOpen] = useState(false);
  const [emailFor2FA, setEmailFor2FA] = useState('');

  const togglePasswordVisibility = () => {
    setShowPassword(prevShowPassword => !prevShowPassword);
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    setLoginMessage('');

    // ⭐ Lógica de autenticación SIMULADA (corregida) ⭐
    // Simula credenciales correctas que requieren 2FA
    if (email === 'test@example.com' && password === '123456') {
      setLoginMessage('Verificación en dos pasos requerida.');
      setEmailFor2FA(email);
      setIs2FAModalOpen(true);
      return; // Detener la ejecución para que no continúe al siguiente 'if'
    } 
    
    // Simula el flujo que tenías originalmente
    const usernameLower = email.toLowerCase();
    if (usernameLower && usernameLower.endsWith('@gmail.com') && password) {
      setLoginMessage('¡Inicio de sesión exitoso!');
      setTimeout(() => {
        navigate('/loading');
      }, 1500);
    }
    // Si no cumple ninguna de las condiciones anteriores, son credenciales incorrectas.
    else {
      setLoginMessage('Error en el inicio de sesión. Credenciales incorrectas.');
    }
  };

  const handle2FASubmit = (code) => {
    // Lógica de verificación 2FA SIMULADA
    if (code === '123456') {
      setLoginMessage('¡Verificación 2FA exitosa!');
      setIs2FAModalOpen(false); 
      setTimeout(() => {
        navigate('/loading');
      }, 1500);
    } else {
      setLoginMessage('Código 2FA incorrecto. Inténtalo de nuevo.');
    }
  };
  
  const handleClose2FAModal = () => {
      setIs2FAModalOpen(false);
      setLoginMessage('');
  };


  return (
    <div className="layout-principal-split">
      <div className="boton-login">
        <Link to="/" >Inicio</Link>
      </div>
      <div className="izquierda-con-imagen">
        <img src={miImagen} alt="Ilustración de bienvenida" />
      </div>

      <div className="derecha-con-formulario">
        <div className="login-form-container">
          <h4>Bienvenido - Iniciar Sesión</h4>
          <FaUserCircle color='#9d6d28' size={50} />
          <form onSubmit={handleSubmit}>
            <div>
              <label htmlFor="email">Email:</label>
              <input
                type="email"
                id="email"
                name="email"
                placeholder='Ingrese su Email'
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
              />
            </div>
            <div className="password-input-container-login">
              <label htmlFor="password">Contraseña:</label>
              <input
                type={showPassword ? "text" : "password"}
                id="password"
                placeholder='Ingrese su Contraseña'
                name="password"
                required
                value={password}
                onChange={(e) => setPassword(e.target.value)}
              />
              <span
                className="password-toggle-icon-login"
                onClick={togglePasswordVisibility}
              >
                {showPassword ? <FaEyeSlash /> : <FaEye />}
              </span>
            </div>
            {loginMessage && (
              <p className={loginMessage.includes('exitoso') || loginMessage.includes('requerida') ? 'mensaje-exito' : 'mensaje-error'}>
                {loginMessage}
              </p>
            )}
            <button type="submit">Iniciar sesión</button>
            ¿Olvidaste tu contraseña? <Link className="link-pass" to="/recuperar">Recuperar contraseña</Link><br /><br />
            ¿No tienes cuenta? 👩🏻‍💻<Link className="link-pass" to="/crearcuenta">Crear cuenta</Link>
          </form>
        </div>
      </div>
      
      <TwoFactorAuthModal
        isOpen={is2FAModalOpen}
        onClose={handleClose2FAModal}
        onSubmit={handle2FASubmit}
      />
    </div>
  );
}

export default LoginForm;