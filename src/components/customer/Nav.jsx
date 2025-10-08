import { useState } from 'react';
import './Nav.css';
import { FaBars, FaStore, FaSignOutAlt, FaUser, FaHistory, FaClock} from 'react-icons/fa';
import LogoUno from '../../assets/img/Logo.png';
import { Link, useNavigate } from 'react-router-dom';

export default function Nav() {
  const [menuCollapsed, setMenuCollapsed] = useState(false);

  const navigate = useNavigate();

  const toggleMenu = () => {
    setMenuCollapsed(!menuCollapsed);
  };

  const handleLogout = () => {
    localStorage.removeItem('userToken');
    localStorage.removeItem('userRole');
    navigate('/');
  };

  
  return (
    <div className="container">
      <div className={`sidebar ${menuCollapsed ? 'collapsed' : ''}`}>
        <div className="sidebar-header">
          {!menuCollapsed && <h3><img src={LogoUno} className="logo-nav" alt="Logo" /></h3>}
          <button className="toggle-menu-btn" onClick={toggleMenu}>
            <FaBars />
          </button>
        </div>

        {!menuCollapsed && (
          <div className="sidebar-menu-items">
            {/* Mi perfil */}
            <Link to="/pagecustomers" className="menu-item link-menu">
              <FaUser style={{ color: '#fff' }} />
              <p className="nombre-modulo"><strong>Mi perfil</strong></p>
            </Link>

            {/* Tienda */}
            <Link to="/tienda" className="menu-item link-menu">
              <FaStore style={{ color: '#fff' }} />
              <p><strong className='nombre-modulo'>Tienda</strong></p>
            </Link>

            {/* Historial de pedidos */}
            <Link to="/historialpedidos" className="menu-item link-menu">
              <FaHistory style={{ color: '#fff' }} />
              <p><strong className='nombre-modulo'>Historial de pedidos</strong></p>
            </Link>

            {/* Pedidos pendientes */}
            <Link to="/pedidospendientes" className="menu-item link-menu">
              <FaClock style={{ color: '#fff' }} />
              <p><strong className='nombre-modulo'>Pedidos pendientes</strong></p>
            </Link>

            {/* Cerrar sesión */}
            <div onClick={handleLogout} className='menu-item link-menu'>
              <FaSignOutAlt style={{ color: '#fff' }} />
                 <p><strong className='nombre-modulo'>Cerrar sesión</strong></p>
            </div>
          </div>
        )}
      </div>

    </div>
  );
}