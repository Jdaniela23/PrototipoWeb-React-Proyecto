import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import './RecuperarPass.css';
import Footer from '../components/Footer';
import { Link } from 'react-router-dom';
import { forgotPassword } from '../api/authService';
import LogoUno from '../assets/img/Logo.png';
import { FaShoppingCart, FaUserCircle, FaUsers, FaHome } from 'react-icons/fa';


function RecuperarPass() {
  const navigate = useNavigate();

  const [email, setEmail] = useState('');
  const [mensajeEnviado, setMensajeEnviado] = useState(false);
  const [errorMensaje, setErrorMensaje] = useState('');

  const handleEmailChange = (event) => {
    setEmail(event.target.value);
    setErrorMensaje('');
    setMensajeEnviado(false);
  };

  const handleEnviarCorreo = async () => {
    const emailLower = email.toLowerCase();

    // ⭐ Lógica de validación: se ejecuta primero y detiene el flujo si hay un error
    if (!emailLower.trim()) {
      setErrorMensaje('Este campo es requerido.');
      return;
    }

    if (!emailLower.endsWith('@gmail.com')) {
      setErrorMensaje('Por favor, ingresa un correo de Gmail válido.');
      return;
    }

    // ⭐ Lógica de envío y navegación: solo se ejecuta si la validación es exitosa
    try {
      await forgotPassword(email);

      setMensajeEnviado(true);
      setErrorMensaje('');

      setTimeout(() => {
        // ⭐ Navegar a la ruta correcta que tienes en App.jsx
        navigate(`/confirmar?email=${email}`);
      }, 3000);

    } catch (error) {
      const errorMessage = error.message || 'Ocurrió un error al enviar el correo. Por favor, inténtalo de nuevo.';
      setErrorMensaje(errorMessage);
      setMensajeEnviado(false);
    }
  };

  return (
    <div className='recuperar-contrasena-page-container'>
      <div className="container-titulo">
        <img src={LogoUno} className="logo-home" alt="Logo de Home" /> <strong className="Titulo-home">  JULIETA STREAMLINE</strong>
      </div>
      <div className="botones-home">
        <Link to="/" ><FaHome/></Link>
        <Link to="/quienessomos" className="enlace-con-icono">
          <span>Quienes Somos</span> <FaUsers />
        </Link>
        <Link to="/login" className="enlace-con-icono">
          <span>Productos Shop</span> <FaShoppingCart />
        </Link>
        <Link to="/login" className="enlace-con-icono">
          <span>Iniciar sesión | Crear Cuenta</span> <FaUserCircle />
        </Link>
      </div>
      <div className='recuperar-card'>
        <h2 className='titulo-recuperar-contrasena'>Recuperar contraseña 👩🏻‍💻</h2>
        <p className='instrucciones'>
          <strong className='strong-recuperar-contrasena'>Hola bienvenido:</strong><br />
          Ingresa el correo electrónico con el que te registraste para recibir <br />
          instrucciones para restablecer tu contraseña.
        </p>
        <div className='input-group'>
          <input
            type='email'
            placeholder='ejemplo@gmail.com'
            className='email-input-contrasena'
            aria-label='Correo electrónico'
            id='email-input-id'
            value={email}
            onChange={handleEmailChange}
            required
          />
          <label htmlFor='email-input-id' className='input-label'>Correo electrónico</label>
        </div>
        {errorMensaje && (
          <p className='mensaje-error'>
            {errorMensaje}
          </p>
        )}
        {mensajeEnviado && (
          <p className='mensaje-confirmacion'>
            ¡Correo de recuperación enviado! Revisa tu bandeja de entrada.
          </p>
        )}
        <button
          className='btn-enviar-correo'
          onClick={handleEnviarCorreo}
        >
          Enviar correo
        </button>
      </div><br />
      <div className='my-footer'>
        <Footer />
      </div>
    </div>
  );
}

export default RecuperarPass;