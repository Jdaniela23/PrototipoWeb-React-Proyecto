import { useNavigate, Link } from 'react-router-dom';
import './LoginForm.css';
import miImagen from '../assets/img/imagen-principal.png';
import { FaUserCircle } from 'react-icons/fa';
import { FaEyeSlash, FaEye, FaHome } from 'react-icons/fa';
import React, { useState } from 'react';
import TwoFactorAuthModal from '../pages/TwoFactorAuthModal';
import { loginUser } from '../api/authService';
import { jwtDecode } from 'jwt-decode'; //Para decodificar el rol del token JWT

function LoginForm() {

  //Estados de variables 
  const navigate = useNavigate();
  const [showPassword, setShowPassword] = useState(false);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [message, setMessage] = useState('');
  const [isLoggingIn, setIsLoggingIn] = useState(false);

  const [is2FAModalOpen, setIs2FAModalOpen] = useState(false);
  const [emailFor2FA, setEmailFor2FA] = useState('');

  const togglePasswordVisibility = () => {
    setShowPassword(prevShowPassword => !prevShowPassword);
  };

  const handleSubmit = async (e) => {
    e.preventDefault(); //  Prevenir recargar la pagina 
    setMessage('');
    setIsLoggingIn(true);

    try {
      // ⭐ Llama a la función de la API con los datos del formulario ⭐
      const userData = await loginUser(email, password);
      // ⭐ Decodificar el token para obtener el rol y otros datos ⭐
      const decodedToken = jwtDecode(userData.token);

      console.log('Token decodificado:', decodedToken);

      // ⭐️ Obtén la clave del rol y el nombre directamente del token decodificado ⭐️
      const roleKey = 'http://schemas.microsoft.com/ws/2008/06/identity/claims/role';
      const nameKey = 'http://schemas.xmlsoap.org/ws/2005/05/identity/claims/name';

      // ⭐ Guardar el rol, el nombre/email y el email del usuario en localStorage ⭐
      // Se guarda el email de manera explícita para asegurar que esté disponible.
      localStorage.setItem('userRole', decodedToken[roleKey]);
      localStorage.setItem('userName', decodedToken[nameKey] || email);
      localStorage.setItem('userEmail', email);
      localStorage.setItem('userToken', userData.token);

      console.log('¡Inicio de sesión exitoso!', userData);

      // Maneja la respuesta de la API para el 2FA (Aún no se tiene)
      if (userData.is2FARequired) {
        setMessage('Verificación en dos pasos requerida.');
        setEmailFor2FA(email);
        setIs2FAModalOpen(true);
      } else {
        //setMessage('¡Inicio de sesión exitoso!');
        setTimeout(() => {
          navigate('/loading');
        }, 1500);
      }

    } catch (error) {
      console.error("Error en el inicio de sesión:", error);
      const errorMessage = error.response?.data?.message || 'Error en el inicio de sesión. Credenciales incorrectas.';
      setMessage(errorMessage);

    } finally {
      setIsLoggingIn(false);
    }
  };

  // Esta función simula la verificación 2FA. 

  const handle2FASubmit = (code) => {
    if (code === '123456') {
      setMessage('¡Verificación 2FA exitosa!');
      setIs2FAModalOpen(false);
      setTimeout(() => {
        navigate('/loading');
      }, 1500);
    } else {
      setMessage('Código 2FA incorrecto. Inténtalo de nuevo.');
    }
  };

  const handleClose2FAModal = () => {
    setIs2FAModalOpen(false);
    setMessage('');
  };


  return (
    <div className="layout-principal-split">
      <div className="boton-login">
        <Link to="/" ><FaHome /></Link>
      </div>
      <div className="izquierda-con-imagen">
        <img src={miImagen} alt="Ilustración de bienvenida" />
      </div>

      <div className="derecha-con-formulario">
        <div className="login-form-container">
          <h4>Bienvenido - Iniciar Sesión</h4>
          <FaUserCircle color='#9d6d28' size={50} />
          <form onSubmit={handleSubmit}>
            <div className="password-input-container-login">
              <label htmlFor="email">Email:</label>
              <input
                type="email"
                id="email"
                name="email"
                placeholder='Ingrese su Email'
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                  className="password-input"
              />
            </div>
            <div className="password-field-wrapper">
              <label htmlFor="password">Contraseña:</label>

              <div className="password-input-container-login">
                <input
                  type={showPassword ? "text" : "password"}
                  id="password"
                  placeholder='Ingrese su Contraseña'
                  name="password"
                  required
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="password-input"
                />
                <span
                  className="password-toggle-icon-login"
                  onClick={togglePasswordVisibility}
                  aria-label="Mostrar contraseña"
                  role="button"
                >
                  {showPassword ? <FaEyeSlash /> : <FaEye />}
                </span>
              </div>
            </div>

            {message && (
              <p
                className={`mensaje-base ${message.includes('exitoso')
                  ? 'mensaje-exito'
                  : message.includes('requerida')
                    ? 'mensaje-info'
                    : 'mensaje-error-login'
                  }`}
              >
                {message}
              </p>
            )}

            <button type="submit" disabled={isLoggingIn}>
              {isLoggingIn ? 'Iniciando...' : 'Iniciar sesión'}
            </button>
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
