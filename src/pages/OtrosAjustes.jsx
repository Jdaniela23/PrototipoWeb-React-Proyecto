import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { FaArrowLeft,  FaMoon, FaHistory, FaEye } from 'react-icons/fa';
import Nav from '../components/Nav';
import '../pages/AjustesAdmin.css';
import './OtrosAjustes.css';

function OtrosAjustes() {
    const navigate = useNavigate();
    const [menuCollapsed, setMenuCollapsed] = useState(false);
    const toggleMenu = () => setMenuCollapsed(!menuCollapsed);

    // Estado para el tema (claro/oscuro)
    const [isDarkMode, setIsDarkMode] = useState(false);

    // Estado para la accesibilidad (alto contraste)
    const [isHighContrast, setIsHighContrast] = useState(false);

    const handleThemeToggle = () => {
        setIsDarkMode(!isDarkMode);
        // ⭐ Lógica para cambiar el tema en toda la app (se puede implementar con Context o CSS variables) ⭐
    };

    const handleAccessibilityToggle = () => {
        setIsHighContrast(!isHighContrast);
        // ⭐ Lógica para aplicar los estilos de alto contraste ⭐
    };

    // Datos de historial de actividad (ejemplo)
    const historialDeActividad = [
        { id: 1, evento: 'Cambio de contraseña', fecha: '25 de Agosto, 2025' },
        { id: 2, evento: 'Inicio de sesión exitoso', fecha: '24 de Agosto, 2025' },
        { id: 3, evento: 'Actualización de perfil', fecha: '24 de Agosto, 2025' },
        { id: 4, evento: 'Inicio de sesión en un nuevo dispositivo', fecha: '23 de Agosto, 2025' },
    ];

    return (
        <div className="adjustments-container">
            <Nav menuCollapsed={menuCollapsed} toggleMenu={toggleMenu} />
            <div className={`adjustments-main-content-area ${menuCollapsed ? 'expanded-margin' : ''}`}>
                <div className="adjustments-settings-page">
                    <div className="otros-ajustes-header">
                        <FaArrowLeft className="back-arrow" onClick={() => navigate(-1)} />
                        <h1 className="adjustments-page-title">Otros Ajustes</h1>
                    </div>
                    <p className="adjustments-page-subtitle">Configuraciones generales de la plataforma y de la cuenta.</p>

                    {/* Sección de Tema y Apariencia */}
                    <div className="ajuste-seccion">
                        <div className="seccion-header">
                            <FaMoon className="seccion-icon" />
                            <h2 className="seccion-title">Tema y Apariencia</h2>
                        </div>
                        <div className="ajuste-opcion">
                            <span className="opcion-label">Modo Oscuro</span>
                            <label className="switch">
                                <input type="checkbox" checked={isDarkMode} onChange={handleThemeToggle} />
                                <span className="slider round"></span>
                            </label>
                        </div>
                    </div>

                    {/* Sección de Historial de Actividad */}
                    <div className="ajuste-seccion">
                        <div className="seccion-header">
                            <FaHistory className="seccion-icon" />
                            <h2 className="seccion-title">Historial de Actividad</h2>
                        </div>
                        <ul className="historial-lista">
                            {historialDeActividad.map(item => (
                                <li key={item.id} className="historial-item">
                                    <span className="historial-evento">{item.evento}</span>
                                    <span className="historial-fecha">{item.fecha}</span>
                                </li>
                            ))}
                        </ul>
                    </div>
                    
                    {/* Sección de Accesibilidad */}
                    <div className="ajuste-seccion">
                        <div className="seccion-header">
                            <FaEye className="seccion-icon" />
                            <h2 className="seccion-title">Accesibilidad</h2>
                        </div>
                        <div className="ajuste-opcion">
                            <span className="opcion-label">Modo de Alto Contraste</span>
                            <label className="switch">
                                <input type="checkbox" checked={isHighContrast} onChange={handleAccessibilityToggle} />
                                <span className="slider round"></span>
                            </label>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}

export default OtrosAjustes;