import { Link, useNavigate } from 'react-router-dom';
import { useState } from 'react';
import '../Nav.css';
import { FaBars, FaStore, FaSignOutAlt, FaUser, FaHistory, FaClock } from 'react-icons/fa';
import LogoUno from '../../assets/img/Logo.png';
import LoadingSpinner from '../../components/LoadingSpinner';

export default function NavCustomer({ menuCollapsed, toggleMenu }) {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);

  const handleLogout = () => {
    setLoading(true);
    localStorage.removeItem("userToken");
    localStorage.removeItem("userRole");
    setTimeout(() => navigate("/"), 1500);
  };

  if (loading) {
    return <LoadingSpinner message="Cerrando sesión..." />;
  }

  return (
    <div className="nav-container">
      {/* Sidebar (Navegador) */}
      <div className={`sidebar ${menuCollapsed ? "collapsed" : ""}`}>
        <div className="sidebar-header">
          {!menuCollapsed && <h3><img src={LogoUno} className="logo-nav" alt="Logo" /></h3>}
          <button className="toggle-menu-btn" onClick={toggleMenu}>
            <FaBars />
          </button>
        </div>

        {!menuCollapsed && (
          <div className="sidebar-menu-items">
            
            {/* Mi perfil */}
            <div className="menu-item-group">
              <div className='link-menu'>
                <p>
                  <Link to='/pagecustomers' className='nombre'> 
                    <strong>Mi perfil</strong>
                  </Link>
                </p>
              <FaUser style={{ color: '#fff', fontSize: '15px' }} />
              </div>
            </div>

            {/* Tienda */}
            <div className="menu-item-group">
              <div className='link-menu'>
                <p>
                  <Link to='/tienda' className='nombre'> 
                    <strong>Tienda</strong>
                  </Link>
                </p>
                <FaStore style={{ color: '#fff' }} />
              </div>
            </div>

            {/* Historial de pedidos */}
            <div className="menu-item-group">
              <div className='link-menu'>
                <p>
                  <Link to='/historialpedidos' className='nombre'> 
                    <strong>Historial de pedidos</strong>
                  </Link>
                </p>
                <FaHistory style={{ color: '#fff', fontSize: '24px' }}/>
              </div>
            </div>

            {/* Pedidos pendientes */}
            <div className="menu-item-group">
              <div className='link-menu'>
                <p>
                  <Link to='/pedidospendientes' className='nombre'> 
                    <strong>Pedidos pendientes</strong>
                  </Link>
                </p>
                <FaClock style={{ color: '#fff', fontSize: '24px' }} />
              </div>
            </div>

            {/* Cerrar sesión (no desplegable) */}
            <div className="menu-item-group">
              <div onClick={handleLogout} className='link-menu'>
                <p>
                  <strong className='nombre'>Cerrar sesión</strong>
                </p>
                <FaSignOutAlt style={{ color: '#fff', fontSize: '24px' }} /> 
              </div>
            </div>

          </div>
        )}
      </div>
      <div className={`main ${menuCollapsed ? 'expanded' : ''}`}>
         <p>Contenido principal de la aplicación aquí...</p>
      </div> 
      
      
    </div>
    
  );
}