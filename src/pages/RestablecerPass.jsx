import React, { useState, useEffect } from 'react';
import { useNavigate, useLocation, Link } from 'react-router-dom';
import { FaEyeSlash, FaEye } from 'react-icons/fa';
import './RestablecerPass.css';
import { resetPassword } from '../api/authService';
import Footer from '../components/Footer';
import LogoUno from '../assets/img/Logo.png';
import { FaShoppingCart, FaUserCircle, FaUsers, FaHome } from 'react-icons/fa';

function RestablecerContrasena() {
    const navigate = useNavigate();
    const location = useLocation();

    const [email, setEmail] = useState('');
    const [code, setCode] = useState('');

    const [newPassword, setNewPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');
    const [errorMensaje, setErrorMensaje] = useState('');
    const [mensajeExito, setMensajeExito] = useState('');
    const [showNewPassword, setShowNewPassword] = useState(false);
    const [showConfirmPassword, setShowConfirmPassword] = useState(false);

    const passwordRegex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[!@#$%^&*()_+={}\[\]|\\:;"'<>,.?/~`]).{8,}$/;

    useEffect(() => {
        const query = new URLSearchParams(location.search);
        const emailFromUrl = query.get('email');
        const codeFromUrl = query.get('code');

        if (emailFromUrl && codeFromUrl) {
            setEmail(emailFromUrl);
            setCode(codeFromUrl);
        } else {
            // ⭐ Si faltan los parámetros, redirige a la página inicial de recuperación.
            navigate('/recuperar');
        }
    }, [location, navigate]);

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

    const handleGuardarContrasena = async (e) => {
        e.preventDefault();

        setErrorMensaje('');
        setMensajeExito('');

        // Validaciones del front-end
        if (!newPassword.trim() || !confirmPassword.trim()) {
            setErrorMensaje('Todos los campos de contraseña son requeridos.');
            return;
        }

        if (!passwordRegex.test(newPassword)) {
            setErrorMensaje('La contraseña debe tener al menos 8 caracteres, incluir mayúsculas, minúsculas, números y caracteres especiales.');
            return;
        }

        if (newPassword !== confirmPassword) {
            setErrorMensaje('Las contraseñas no coinciden.');
            return;
        }

        try {
            await resetPassword(email, code, newPassword);
            setMensajeExito('¡Contraseña restablecida con éxito! Redireccionando al Login 👩🏻‍💻');

            setTimeout(() => {
                navigate('/login');
            }, 4000);

        } catch (error) {
            // ⭐ LÍNEA CORREGIDA AQUÍ
            // Accede al mensaje de error del objeto error que lanza la función en authService.js
            const errorMessage = error.message || 'Ocurrió un error al restablecer la contraseña. Asegúrate de que el código y el email son correctos.';
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
                <h2 className="titulo-restablecerpass">Restablecer Contraseña👩🏻‍💻</h2 >

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

            </div><br/>
            <Footer />
        </div>
    );
}

export default RestablecerContrasena;