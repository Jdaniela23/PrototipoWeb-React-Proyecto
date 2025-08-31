import React, { useState, useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import './ConfirmarPass.css'; 
import Footer from '../components/Footer';

function RecuperarPassConfirmacion() {
  const navigate = useNavigate();
  const [codigo, setCodigo] = useState('');
  const [errorMensaje, setErrorMensaje] = useState('');
  const [mensajeExito, setMensajeExito] = useState('');
  const [tiempoRestante, setTiempoRestante] = useState(180); // 3 minutos = 180 segundos
  const [intervalId, setIntervalId] = useState(null); // Para almacenar el ID del intervalo

  // Efecto para el contador de tiempo
  useEffect(() => {
    // Si no hay un intervalo en marcha y el tiempo es positivo, inicia el contador
    if (tiempoRestante > 0 && !intervalId) {
      const id = setInterval(() => {
        setTiempoRestante(prevTime => prevTime - 1);
      }, 1000);
      setIntervalId(id); // Guarda el ID para poder limpiarlo
    } else if (tiempoRestante === 0 && intervalId) {
      // Si el tiempo llega a cero, limpia el intervalo
      clearInterval(intervalId);
      setIntervalId(null);
    }

    // Función de limpieza para cuando el componente se desmonte
    return () => {
      if (intervalId) {
        clearInterval(intervalId);
      }
    };
  }, [tiempoRestante, intervalId]); // Dependencias: se ejecuta cuando el tiempo o el ID cambian

  // Función para formatear el tiempo (MM:SS)
  const formatTime = (seconds) => {
    const minutes = Math.floor(seconds / 60);
    const remainingSeconds = seconds % 60;
    return `${minutes.toString().padStart(2, '0')}:${remainingSeconds.toString().padStart(2, '0')}`;
  };

  const handleCodigoChange = (e) => {
    setCodigo(e.target.value);
    setErrorMensaje(''); // Limpiar mensajes al escribir
    setMensajeExito('');
  };

  const handleVerificarCodigo = () => {
    // Limpiar mensajes anteriores
    setErrorMensaje('');
    setMensajeExito('');

    // Validación de campo requerido
    if (!codigo.trim()) {
      setErrorMensaje('Por favor, ingresa el código de verificación.');
      return;
    }

    // Aquí se puede añadir tu lógica de validación de código real.
    // Por ejemplo, un código fijo:
    if (codigo === '123456') { // Código de ejemplo
      setMensajeExito('¡Código verificado correctamente!');
      // Si el código es correcto, puedes redirigir a una página para cambiar la contraseña
      setTimeout(() => {
        navigate('/restablecer'); // Ruta a página para restablecer contraseña
      }, 1500);
    } else {
      setErrorMensaje('El código ingresado es incorrecto.');
    }
  };

  const handleEnviarNuevoCodigo = () => {
    // Lógica para reenviar el código.
    // Simplemente reiniciamos el contador y mostramos un mensaje.
    setTiempoRestante(180); // Reiniciar a 3 minutos
    setMensajeExito('Se ha enviado un nuevo código a tu correo.');
    setErrorMensaje(''); // Limpiar cualquier error anterior
    if (intervalId) { // Limpiar el intervalo anterior si existe
      clearInterval(intervalId);
    }
    setIntervalId(null); // Asegurarse de que se reinicie el efecto
  };

  return (
    <div className='recuperar-contrasena-page-container'> {/* Reusamos el contenedor principal */}
      <div className='recuperar-contrasena-card'> {/* Reusamos la tarjeta */}
        <h2>Recuperar contraseña</h2>

        <p className='instrucciones'>
          Ingresa el código enviado a tu correo electrónico:
        </p>

        <h3 className='codigo-label'>Código  </h3> {/* Título para el input de código */}
        <p className='instrucciones-small'>
          Ingresa el código de verificación que hemos enviado a example@gmail.com
        </p>

        <div className='input-group'>
          <input
            type='text' // Tipo de texto para el código
            placeholder='Digita tu código de verificación'
            className='codigo-input' // Nueva clase para este input
            aria-label='Código de verificación'
            id='codigo-input-id'
            value={codigo}
            onChange={handleCodigoChange}
            required
          />
          <label htmlFor='codigo-input-id' className='input-label-hidden'>Código</label> {/* Oculta esta etiqueta si el placeholder es suficiente */}
        </div>

        {/* Mensajes de error o éxito */}
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

        {/* Botones */}
        <div className='buttons-grid'>
          <button
            className='btn-verificar-codigo'
            onClick={handleVerificarCodigo}
          >
            Verificar Código
          </button>

          <button
            className='btn-enviar-nuevo-codigo'
            onClick={handleEnviarNuevoCodigo}
            disabled={tiempoRestante > 0} // Deshabilita el botón mientras el contador está activo
          >
            {tiempoRestante > 0 ? formatTime(tiempoRestante) : 'Enviar nuevo código'}
          </button>
          
          {/* El botón rojo se elimina de aquí, según tu petición anterior */}
          {/* <button className='btn-verificar-codigo btn-rojo'>Verificar Código</button> */}

          <Link to="/login" className='btn-volver-link'> {/* Enlace a la página de login */}
            <button className='btn-volver'>
              {'<- Volver'}
            </button>
          </Link>

          <Link to="/login" className='btn-iniciar-sesion-link'> {/* Enlace a la página de login */}
            <button className='btn-iniciar-sesion'>
              Iniciar sesión
            </button>
          </Link>
        </div>
      </div><br/>
       <div className='my-footer'> {/*Creamos un div para el footer debido a que por el estilo del div principal su tamaño se encoje */}
        <Footer />
      </div>
    </div>
  );
}

export default RecuperarPassConfirmacion;