import React, { useState, useEffect } from 'react';
import { useNavigate, Link, useLocation } from 'react-router-dom';
import './ConfirmarPass.css';
import { verifyCode, resendForgotPasswordCode } from '../api/authService';
import Footer from '../components/Footer';
import NavHome from '../components/Navhome';

function RecuperarPassConfirmacion() {
    const navigate = useNavigate();
    const location = useLocation();

    // Declaración de estados
    const [email, setEmail] = useState('');
    const [codigo, setCodigo] = useState('');
    const [errorMensaje, setErrorMensaje] = useState('');
    const [mensajeExito, setMensajeExito] = useState('');
    const [tiempoRestante, setTiempoRestante] = useState(180);
    const [intervalId, setIntervalId] = useState(null);
    
    // ⭐ NUEVOS ESTADOS DE CARGA Y ENVÍO
    const [isVerifying, setIsVerifying] = useState(false); 
    const [isResending, setIsResending] = useState(false);
    const [resendSuccess, setResendSuccess] = useState(false);

    // Funciones de ayuda (helpers)
    const formatTime = (seconds) => {
        const minutes = Math.floor(seconds / 60);
        const remainingSeconds = seconds % 60;
        return `${minutes.toString().padStart(2, '0')}:${remainingSeconds.toString().padStart(2, '0')}`;
    };

    const handleCodigoChange = (e) => {
        setCodigo(e.target.value);
        setErrorMensaje('');
        setMensajeExito('');
    };

    // Efectos de React (Hooks)
    useEffect(() => {
        const query = new URLSearchParams(location.search);
        const emailFromUrl = query.get('email');
        if (emailFromUrl) {
            setEmail(emailFromUrl);
        } else {
            navigate('/recuperar');
        }
    }, [location, navigate]);

    // Lógica del temporizador 
    useEffect(() => {
        let id;
        if (tiempoRestante > 0) {
            id = setInterval(() => {
                setTiempoRestante(prevTime => prevTime - 1);
            }, 1000);
        }

        // Función de limpieza que se ejecuta cuando el componente se desmonta o el efecto se vuelve a ejecutar
        return () => {
            if (id) {
                clearInterval(id);
            }
        };
    }, [tiempoRestante]);

    // Funciones de manejo de eventos (handlers)
    const handleVerificarCodigo = async () => {
        setErrorMensaje('');
        setMensajeExito('');
        setIsVerifying(true); // Iniciar verificación

        if (!codigo.trim() || !email) {
            setErrorMensaje('Por favor, ingresa el código y asegúrate de que el correo es válido.');
            setIsVerifying(false); // Detener si hay error de validación
            return;
        }

        try {
            await verifyCode(email, codigo);
            setMensajeExito('¡Código verificado correctamente! Redirigiendo para restablecer la contraseña...');
            setIsVerifying(false); // Detener la carga

            setTimeout(() => {
                navigate(`/restablecer?email=${email}&code=${codigo}`);
            }, 1500);

        } catch (error) {
            const errorMessage = error.response?.data?.message || 'El código ingresado es incorrecto o ha expirado.';
            setErrorMensaje(errorMessage);
            setIsVerifying(false); //  Detener la carga si hay error de API
        }
    };

    const handleEnviarNuevoCodigo = async () => {
        setMensajeExito('');
        setErrorMensaje('');
        setIsResending(true); //  Iniciar reenvío

        if (!email) {
            setErrorMensaje('No se puede reenviar el código sin un correo válido.');
            setIsResending(false); // Detener si no hay email
            return;
        }

        try {
            await resendForgotPasswordCode(email);
            setMensajeExito('Se ha enviado un nuevo código a tu correo.');
            
            setResendSuccess(true); // Mostrar "Enviado..."
            setTiempoRestante(180); // Reinicia el temporizador

            // Ocultar el estado de "Enviado..." después de 2 segundos
            setTimeout(() => {
                setResendSuccess(false);
            }, 2000);
        
        } catch (error) {
            const errorMessage = error.response?.data?.message || 'Ocurrió un error al reenviar el código.';
            setErrorMensaje(errorMessage);
            setResendSuccess(false); // Asegurar que no se muestre "Enviado..."
        } finally {
            setIsResending(false); //  Detener el estado de carga al finalizar
        }
    };

    return (
        <div className='recuperar-contrasena-page-container'>
           <NavHome/>
            <div className='recuperar-contrasena-card'>
                <h2>Recuperar contraseña</h2>
                <p className='instrucciones-small'>
                    Ingresa el código de verificación que hemos enviado a {email || 'example@gmail.com'}
                </p>
                <h3 className='codigo-label'>Código</h3>
                <div className='input-group'>
                    <input
                        type='text'
                        placeholder='Digita tu código de verificación'
                        className='codigo-input'
                        aria-label='Código de verificación'
                        id='codigo-input-id'
                        value={codigo}
                        onChange={handleCodigoChange}
                        required
                    />
                    <label htmlFor='codigo-input-id' className='input-label-hidden'>Código</label>
                </div>
                {errorMensaje && (
                    <p className='mensaje-error-confirmar'>
                        {errorMensaje}
                    </p>
                )}
                {mensajeExito && (
                    <p className='mensaje-exito'>
                        {mensajeExito}
                    </p>
                )}
                <div className='buttons-grid'>
                    <button
                        className='btn-verificar-codigo'
                        onClick={handleVerificarCodigo}
                        disabled={isVerifying || isResending} // Deshabilitar si está verificando o reenviando
                    >
                        {isVerifying ? 'Verificando...' : 'Verificar Código'}
                    </button>
                    <button
                        className='btn-enviar-nuevo-codigo'
                        onClick={handleEnviarNuevoCodigo}
                        disabled={tiempoRestante > 0 || isResending || isVerifying}
                    >
                        {isResending 
                            ? 'Enviando...' 
                            : resendSuccess 
                                ? '✅ Enviado!' 
                                : tiempoRestante > 0 
                                    ? formatTime(tiempoRestante) 
                                    : 'Enviar nuevo código'}
                    </button>
                    <Link to="/recuperar" className='btn-volver-link'>
                        <button className='btn-volver'>
                            ⬅️{'Volver'}
                        </button>
                    </Link>
                    <Link to="/login" className='btn-iniciar-sesion-link'>
                        <button className='btn-iniciar-sesion'>
                            Iniciar sesión
                        </button>
                    </Link>
                </div>
            </div><br />

            <Footer />

        </div>
    );
}

export default RecuperarPassConfirmacion;