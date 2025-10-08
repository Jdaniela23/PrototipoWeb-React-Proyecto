import React, { useState, useEffect } from 'react';
import { useNavigate, Link, useLocation } from 'react-router-dom';
import './ConfirmarPass.css';
import { verifyCode, resendForgotPasswordCode } from '../api/authService';
import Footer from '../components/Footer';
import LogoUno from '../assets/img/Logo.png';
import { FaShoppingCart, FaUserCircle, FaUsers, FaHome } from 'react-icons/fa';


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

    // ⭐ Lógica del temporizador 
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

        if (!codigo.trim() || !email) {
            setErrorMensaje('Por favor, ingresa el código y asegúrate de que el correo es válido.');
            return;
        }

        try {
            await verifyCode(email, codigo);
            setMensajeExito('¡Código verificado correctamente! Redirigiendo para restablecer la contraseña...');

            setTimeout(() => {
                navigate(`/restablecer?email=${email}&code=${codigo}`);
            }, 1500);

        } catch (error) {
            const errorMessage = error.response?.data?.message || 'El código ingresado es incorrecto o ha expirado.';
            setErrorMensaje(errorMessage);
        }
    };

    const handleEnviarNuevoCodigo = async () => {
        setMensajeExito('');
        setErrorMensaje('');

        if (!email) {
            setErrorMensaje('No se puede reenviar el código sin un correo válido.');
            return;
        }

        try {
            await resendForgotPasswordCode(email);
            setMensajeExito('Se ha enviado un nuevo código a tu correo.');
            setTiempoRestante(180); // Reinicia el temporizador

        
        } catch (error) {
            const errorMessage = error.response?.data?.message || 'Ocurrió un error al reenviar el código.';
            setErrorMensaje(errorMessage);
        }
    };

    return (
        <div className='recuperar-contrasena-page-container'>
            <div className="container-titulo">
                <img src={LogoUno} className="logo-home" alt="Logo de Home" /> <strong className="Titulo-home">  JULIETA STREAMLINE</strong>
            </div>
            <div className="botones-home">
                <Link to="/" ><FaHome /></Link>
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
                    <p className='mensaje-error'>
                        {errorMensaje}
                    </p>
                )}
                {mensajeExito && (
                    <p className='mensaje-confirmacion'>
                        {mensajeExito}
                    </p>
                )}
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
                        disabled={tiempoRestante > 0}
                    >
                        {tiempoRestante > 0 ? formatTime(tiempoRestante) : 'Enviar nuevo código'}
                    </button>
                    <Link to="/login" className='btn-volver-link'>
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