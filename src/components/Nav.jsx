import { useState } from 'react';
import './Nav.css';
import { FaBars, FaCaretDown, FaCaretUp, FaChartBar, FaMoneyBillWave, FaTruck, FaStore,FaUsers, FaUserTag, FaSignOutAlt } from 'react-icons/fa';
import LogoUno from '../assets/img/Logo.png';
import { Link, useNavigate } from 'react-router-dom';
import LoadingSpinner from '../components/LoadingSpinner';

export default function Nav() {
  const [menuCollapsed, setMenuCollapsed] = useState(false);
  const [openMenus, setOpenMenus] = useState({}); // Estado para controlar los menús desplegables
  const [loading, setLoading] = useState(false);


  const navigate = useNavigate();

  const toggleMenu = () => {
    setMenuCollapsed(!menuCollapsed);
  };

  const toggleSubmenu = (menuName) => {
    setOpenMenus(prevState => ({
      ...prevState,
      [menuName]: !prevState[menuName],
    }));
  };

  //  Función para manejar el cierre de sesión 
const handleLogout = () => {
  setLoading(true); // muestra el spinner

  // Eliminamos el token inmediatamente
  localStorage.removeItem('userToken');
  localStorage.removeItem('userRole');

  //  Esperamos un poco antes de redirigir
  setTimeout(() => {
    navigate('/'); 
  }, 1500); 
};

if (loading) {
  return <LoadingSpinner message="Cerrando sesión..." />;
}


  return (
    <div className="nav-container">
      {/* Sidebar (Navegador) */}
      <div className={`sidebar ${menuCollapsed ? 'collapsed' : ''}`}>
        <div className="sidebar-header">
          {!menuCollapsed && <h3><img src={LogoUno} className="logo-nav" alt="Logo" /></h3>}
          <button className="toggle-menu-btn" onClick={toggleMenu}>
            <FaBars />
          </button>
        </div>

        {!menuCollapsed && (
          <div className="sidebar-menu-items">
            {/* Tienda (no desplegable) */}
            <div className="menu-item-group">
              <div className='link-menu'>
                <p>
                       <FaStore style={{ color: '#fff' }} />
                    <Link to='/tienda' className='nombre'>  <strong>Tienda</strong></Link>
                </p>
           
              </div>
            </div>

            {/* Dashboard */}
            <div className="menu-item-group">
           <div className='link-menu'>
                <p>
                  
                  <Link to='/dashboard' className='nombre'> <strong>Dashboard</strong></Link>
                </p>
             
            </div>
            </div>

            {/* Configuración */}
               <div className="menu-item-group">
           <div className='link-menu'>
                <p>
                 
                  <Link to='/roles' className='nombre'> <strong>Roles</strong></Link>
                </p>
            </div>
            </div>

            {/* Usuarios */}
             <div className="menu-item-group">
           <div className='link-menu'>
                <p>
                
                  <Link to='/usuarios' className='nombre'> <strong>Usuarios</strong></Link>
                </p>
            </div>
            </div>

            {/* Compras */}
            <div className="menu-item-group">
              <div className="menu-header" onClick={() => toggleSubmenu('compras')}>
                <p><strong className='nombre-modulo'>Compras</strong></p>
                {openMenus.compras ? <FaCaretUp /> : <FaCaretDown />}
              </div>
              {openMenus.compras && (
                <div className="submenu">
                  <Link to='/productos' className='link-menu'> Productos </Link>
                  <Link to='/tallas' className='link-menu'> Tallas </Link>
                  <Link to='/colores' className='link-menu'> Colores </Link>

                  <Link to='/categorias' className='link-menu'> Categoría Productos </Link>
                  <Link to='/proveedores' className='link-menu'> Proveedores </Link>
                  <Link to='/compras' className='link-menu'> Compras </Link>
                </div>
              )}
            </div>

            {/* Ventas */}
            <div className="menu-item-group">
              <div className="menu-header" onClick={() => toggleSubmenu('ventas')}>
                <p><strong className='nombre-modulo'>Ventas</strong></p>
                {openMenus.ventas ? <FaCaretUp /> : <FaCaretDown />}
              </div>
              {openMenus.ventas && (
                <div className="submenu">
                  <Link to='/pedidos' className='link-menu'> Pedidos </Link>
                    <Link to='/ventas' className='link-menu'> Ventas </Link>

                </div>
              )}
            </div>


            {/* Cerrar sesión (no desplegable) */}
            <div className="menu-item-group">
              <div onClick={handleLogout} className='link-menu'>
                <p><strong className='nombre'>Cerrar sesión <FaSignOutAlt style={{ color: '#fff', marginTop: '5px' }} /></strong></p>
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