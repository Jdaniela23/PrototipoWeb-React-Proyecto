import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import './RecuperarPass.css';
import Footer from '../components/Footer';
import NavHome from '../components/Navhome';
import { forgotPassword } from '../api/authService';

function RecuperarPass() {
  const navigate = useNavigate();

  const [email, setEmail] = useState('');
  const [mensajeEnviado, setMensajeEnviado] = useState(false);
  const [errorMensaje, setErrorMensaje] = useState('');
  const [isLoading, setIsLoading] = useState(false); 

  const handleEmailChange = (event) => {
    setEmail(event.target.value);
    setErrorMensaje('');
    setMensajeEnviado(false);
  };

  const handleEnviarCorreo = async () => {
    const emailLower = email.toLowerCase();

    setIsLoading(true); 

    if (!emailLower.trim()) {
      setErrorMensaje('Este campo es requerido.');
      setIsLoading(false); 
      return;
    }

    if (!emailLower.endsWith('@gmail.com')) {
      setErrorMensaje('Por favor, ingresa un correo de Gmail válido.');
      setIsLoading(false); 
      return;
    }

    try {
      await forgotPassword(email);

      setMensajeEnviado(true);
      setErrorMensaje('');
      setIsLoading(false); 

      setTimeout(() => {
        navigate(`/confirmar?email=${email}`);
      }, 3000);

    } catch (error) {
      const errorMessage = error.message || 'Ocurrió un error al enviar el correo. Por favor, inténtalo de nuevo.';
      setErrorMensaje(errorMessage);
      setMensajeEnviado(false);
      setIsLoading(false); 
    }
  };

  return (
    <div className='recuperar-contrasena-page-container'>
      <NavHome/>
      <div className='recuperar-card'>
        <h2 className='titulo-recuperar-contrasena'>Recuperar contraseña 👩🏻‍💻</h2>
        <p className='instrucciones'>
          <strong className='strong-recuperar-contrasena-saludo'>Hola bienvenido:</strong><br />
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
          <p className='mensaje-error-login'>
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
          disabled={isLoading}
        >
          {isLoading ? 'Enviando...' : 'Enviar correo'}
        </button>
      </div><br />
      <div className='my-footer'>
        <Footer />
      </div>
    </div>
  );
}

export default RecuperarPass;