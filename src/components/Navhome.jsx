import { useState } from 'react'; // 👈 Importamos useState
import '../pages/HomePage.css';
import { FaShoppingCart, FaHome, FaUser, FaChartBar, FaSignInAlt } from 'react-icons/fa'; 
import LogoUno from '../assets/img/Logo.png';
import { Link } from 'react-router-dom';

function NavHome() {
    // Se considera autenticado si existe un 'userToken' en el localStorage
    const isAuthenticated = !!localStorage.getItem('userToken');

    return (
        <div className="nav-home">
            <div className="container-titulo">
                <img src={LogoUno} className="logo-home" alt="Logo de Home" /> 
                <strong className="Titulo-home"> JULIETA STREAMLINE</strong>
            </div>
            
            <div className="botones-home">
                <Link to="/" className="enlace-con-icono" ><FaHome /> Inicio </Link>
                
                <Link to="/shop" className="enlace-con-icono">
                    <span><FaShoppingCart /> Productos </span>
                </Link>
                
                <Link to="/quienessomos" className="enlace-con-icono">
                    <span><FaUser /> Quienes Somos</span>
                </Link>
                {isAuthenticated ? (
                    // Si está autenticado, muestra el enlace al Dashboard
                    <Link to="/dashboard" className="enlace-con-icono enlace-dashboard">
                        <span><FaChartBar /> Ver Dashboard</span>
                    </Link>
                ) : (
                    // Si NO está autenticado, muestra el enlace para Iniciar Sesión
                    <Link to="/login" className="enlace-con-icono enlace-login">
                        <span>Iniciar sesión | Crear Cuenta</span>
                    </Link>
                )}
            </div>
        </div>
    );
}

export default NavHome;