import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import './RecuperarPass.css';
import Footer from '../components/Footer';
import { Link } from 'react-router-dom';

function RecuperarPass() {
  const navigate = useNavigate();

  // Estado para almacenar el valor del correo electrónico
  const [email, setEmail] = useState('');
  // Estado para controlar la visibilidad del mensaje de éxito
  const [mensajeEnviado, setMensajeEnviado] = useState(false);
  // Estado para controlar la visibilidad y contenido del mensaje de error
  const [errorMensaje, setErrorMensaje] = useState('');

  // Función que maneja el cambio en el input del correo
  const handleEmailChange = (event) => {
    setEmail(event.target.value);
    // Limpiar mensajes de error/éxito al empezar a escribir de nuevo
    setErrorMensaje('');
    setMensajeEnviado(false);
  };

  // Función que se ejecuta al hacer clic en el botón "Enviar correo"
  const handleEnviarCorreo = () => {
    // Convertir el email a minúsculas para una validación insensible a mayúsculas/minúsculas
    const emailLower = email.toLowerCase();

    // --- Lógica de Validación ---

    // 1. Validación de REQUERIDO (campo vacío)
    if (!emailLower.trim()) { // .trim() elimina espacios en blanco al inicio/final
      setErrorMensaje('Este campo es requerido.');
      setMensajeEnviado(false);
      return; // Detiene la ejecución
    }

    // 2. Validación de FORMATO (debe terminar en @gmail.com)
    if (!emailLower.endsWith('@gmail.com')) {
      setErrorMensaje('Por favor, ingresa un correo de Gmail válido.');
      setMensajeEnviado(false);
      return; // Detiene la ejecución
    }

    // --- Si todas las validaciones anteriores pasan ---
    setErrorMensaje(''); // Limpia cualquier mensaje de error anterior
    setMensajeEnviado(true); // Muestra el mensaje de éxito

    // Opcional: Lógica de envío real aquí (ej. llamada a una API)

    // Opcional: Ocultar el mensaje de éxito después de unos segundos y limpiar el campo
    setTimeout(() => {
      setMensajeEnviado(false);
      setEmail(''); // Limpia el campo de correo

      // navigate('/alguna-otra-pagina'); // Si quieres redirigir después del éxito
      navigate('/confirmar');
    }, 3000); // El mensaje de éxito desaparecerá después de 3 segundos
  };

  return (

    <div className='recuperar-contrasena-page-container'>
      {/*Botones */}
      <div className='recuperar-card'>
        <div className="botones-home">
          <Link to="/login" >Iniciar sesión 👩🏻‍💻</Link>
          <Link to="/crearcuenta" >Crear Cuenta</Link>
        </div>
        <h2 className='titulo-recuperar-contrasena'>Recuperar contraseña 👩🏻‍💻</h2>

        <p className='instrucciones'>
          <strong className='strong-recuperar-contrasena'>Hola bienvenido:</strong><br />
          Ingresa el correo electrónico con el que te registraste para recibir <br />
          instrucciones para restablecer tu contraseña.
        </p>

        <div className='input-group'>
          <input
            type='email' // Usar type='email' ayuda a los navegadores con la validación básica
            placeholder='ejemplo@gmail.com'
            className='email-input-contrasena'
            aria-label='Correo electrónico'
            id='email-input-id'
            value={email} // Conecta el valor del input con el estado
            onChange={handleEmailChange} // Actualiza el estado al escribir
            required // Añadimos el atributo required de HTML5 (aunque la validación JS es más robusta)
          />
          <label htmlFor='email-input-id' className='input-label'>Correo electrónico</label>
        </div>

        {/* Mensajes de error o éxito */}
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
      <div className='my-footer'> {/*Creamos un div para el footer debido a que por el estilo del div principal su tamaño se encoje */}
        <Footer />
      </div>

    </div>

  );
}

export default RecuperarPass;