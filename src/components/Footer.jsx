import { useNavigate, Link } from 'react-router-dom';
import './Footer.css';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faWhatsapp, faInstagram } from '@fortawesome/free-brands-svg-icons';
import { FaMapMarkerAlt } from 'react-icons/fa';
import { faEnvelope } from '@fortawesome/free-solid-svg-icons';
import LogoUno from '../assets/img/Logo.png';
import React, { useState, useEffect } from 'react';
import { useScrollToTop } from './useScrollToTop';


function Footer() {

const { isVisible, scrollToTop } = useScrollToTop(100);
  const currentYear = new Date().getFullYear();
  return (

    <footer className="main-footer">

      <div className="footer-top">
        <h2 className="footer-brand">#JulietaStreamline</h2>
        <hr className="footer-divider" />
      </div>

      <div className="footer-columns">
        {/* Columna 1: La novedad */}
        <div className="footer-column">
          <h3 className="column-title">Compañia</h3>
          <ul className="footer-list">
            <li><Link to="/novedades/prendas-nuevas">Acerca de nosotros</Link></li>
            <li><Link to="/novedades/prenda-temporada">Contactos</Link></li>
            <li> < FaMapMarkerAlt /> Avenida 48a #61-22 - Niquía</li>


          </ul>
        </div>

        {/* Columna 2: Contacto y Redes */}
        <div className="footer-column contact-column">
          <h3 className="column-title">Síguenos:</h3>
          <ul className="footer-list">
            <li>
              <a href="https://www.instagram.com/" target="_blank" rel="noopener noreferrer">
                [Instagram] <FontAwesomeIcon icon={faInstagram} size="lg" style={{ color: "#f8f6f3ff", }} />
              </a>
            </li>
          </ul>

          <h3 className="column-title">Teléfono:</h3>
          <p>3242807261 <a href="https://wa.me/573242807261" target="_blank" rel="noopener noreferrer"><FontAwesomeIcon icon={faWhatsapp} size="lg" style={{ color: "#f8f6f3ff", }} /></a></p>
        </div>

        {/* Columna 3: Ayuda y Contacto */}
        <div className="footer-column ">
          <h3 className="column-title">Mi cuenta</h3>
          <ul className="footer-list">
            <li><Link to="/ayuda/pqrf">Iniciar sesión</Link></li>
            <li><Link to="/ayuda/pqrf">Registrarse</Link></li>
            <li>
              <h3 className="column-title">Gmail de contacto: <FontAwesomeIcon icon={faEnvelope} size="lg" style={{ color: "#f8f6f3ff", }} /></h3>
              <p>JulietaStreamline@gmail.com</p>
            </li>
          </ul>
        </div>

        <div className="footer-column logo-column">
          <h3 className="column-title">Julieta Streamline</h3>
          <img src={LogoUno} alt="Logo de la marca"
            style={{
              width: '160px',
              height: 'auto'
            }} />

        </div>
        <div className="footer-bottom">
          <p className="copyright">
            &copy; {currentYear} JulietaStreamline. Todos los derechos reservados.
          </p>
        </div>
      </div>
   {/* 🚨 2. RENDERIZAR EL BOTÓN AQUÍ 🚨 */}
      {/* Esto asegura que flote sobre toda la página, no solo sobre el Footer o Nav */}
      {isVisible && (
        <button
          onClick={scrollToTop}
          className="scroll-to-top" 
          aria-label="Volver arriba de la página"
        >
          <FontAwesomeIcon icon={faArrowUp} size="lg" />
        </button>
      )}


    </footer>
    
  );
}

export default Footer;
