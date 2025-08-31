import { useState } from 'react';
import './Nav.css';
import { FaBars, FaCaretDown, FaCaretUp, FaStore } from 'react-icons/fa';
import LogoUno from '../assets/Logo.png';
import { Link } from 'react-router-dom';


export default function Nav() { 
  const [menuCollapsed, setMenuCollapsed] = useState(false);
  const [openMenus, setOpenMenus] = useState({}); // Estado para controlar los menús desplegables

  const toggleMenu = () => {
    setMenuCollapsed(!menuCollapsed);
  };

  const toggleSubmenu = (menuName) => {
    setOpenMenus(prevState => ({
      ...prevState,
      [menuName]: !prevState[menuName],
    }));
  };

  return (
    <div className="container">
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
              <Link to='/panelAdmin' className="link-menu">
                <p><strong>Inicio</strong></p>
              </Link>
              <p>
                <strong>Tienda<FaStore style={{ color: '#e1b94c', marginLeft: '8px' }} /></strong>
              </p>
            </div>

            {/* Configuración */}
            <div className="menu-item-group">
              <div className="menu-header" onClick={() => toggleSubmenu('configuracion')}>
                <p><strong>Configuración</strong></p>
                {openMenus.configuracion ? <FaCaretUp /> : <FaCaretDown />}
              </div>
              {openMenus.configuracion && (
                <div className="submenu">
                  <Link to='/roles' className='link-menu'> Roles </Link>
                </div>
              )}
            </div>

            {/* Usuarios */}
            <div className="menu-item-group">
              <div className="menu-header" onClick={() => toggleSubmenu('usuarios')}>
                <p><strong>Usuarios</strong></p>
                {openMenus.usuarios ? <FaCaretUp /> : <FaCaretDown />}
              </div>
              {openMenus.usuarios && (
                <div className="submenu">
                  <Link to='/usuarios' className='link-menu'> Usuarios </Link>
                </div>
              )}
            </div>

            {/* Compras */}
            <div className="menu-item-group">
              <div className="menu-header" onClick={() => toggleSubmenu('compras')}>
                <p><strong>Compras</strong></p>
                {openMenus.compras ? <FaCaretUp /> : <FaCaretDown />}
              </div>
              {openMenus.compras && (
                <div className="submenu">
                  <Link to='/productos' className='link-menu'> Productos </Link>
                  <Link to='/categorias' className='link-menu'> Categoría Productos </Link>
                  <Link to='/proveedores' className='link-menu'> Proveedores </Link>
                  <Link to='/compras' className='link-menu'> Compras </Link>
                </div>
              )}
            </div>

            {/* Ventas */}
            <div className="menu-item-group">
              <div className="menu-header" onClick={() => toggleSubmenu('ventas')}>
                <p><strong>Ventas</strong></p>
                {openMenus.ventas ? <FaCaretUp /> : <FaCaretDown />}
              </div>
              {openMenus.ventas && (
                <div className="submenu">
                  <Link to='/pedidos' className='link-menu'> Pedidos </Link>
                  <Link to='/creditos' className='link-menu'> Créditos </Link>
                </div>
              )}
            </div>

            {/* Dashboard */}
            <div className="menu-item-group">
              <div className="menu-header" onClick={() => toggleSubmenu('dashboard')}>
                <p><strong>Dashboard</strong></p>
                {openMenus.dashboard ? <FaCaretUp /> : <FaCaretDown />}
              </div>
              {openMenus.dashboard && (
                <div className="submenu">
                  <Link to='/dashboard' className='link-menu'> Dashboard </Link>
                </div>
              )}
            </div>

            {/* Cerrar sesión (no desplegable) */}
            <div className="menu-item-group">
              <Link to='/' className='link-menu'>
                <p><strong>Cerrar sesión</strong></p>
              </Link>
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