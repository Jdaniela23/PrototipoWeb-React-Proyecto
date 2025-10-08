import { useState } from 'react';
import './Nav.css';
import { FaBars, FaCaretDown, FaCaretUp, FaStore, FaSignOutAlt } from 'react-icons/fa';
import LogoUno from '../assets/img/Logo.png';
import { Link, useNavigate } from 'react-router-dom';

export default function Nav() {
  const [menuCollapsed, setMenuCollapsed] = useState(false);
  const [openMenus, setOpenMenus] = useState({}); // Estado para controlar los menús desplegables

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

  // ⭐ Función para manejar el cierre de sesión ⭐
  const handleLogout = () => {
    // Elimina el token de autenticación del localStorage
    localStorage.removeItem('userToken');
    // Elimina el rol del usuario del localStorage
    localStorage.removeItem('userRole');
    // Redirige al usuario a la página de inicio
    navigate('/');
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
              <div className='link-menu'>
                <p>
                  <strong className='nombre-modulo'>Tienda</strong>
                </p>
                <FaStore style={{ color: '#fff' }} />
              </div>
            </div>

            {/* Dashboard */}
            <div className="menu-item-group">
              <div className="menu-header" onClick={() => toggleSubmenu('dashboard')}>
                <p><strong className='nombre-modulo'>Dashboard</strong></p>
                {openMenus.dashboard ? <FaCaretUp /> : <FaCaretDown />}
              </div>
              {openMenus.dashboard && (
                <div className="submenu">
                  <Link to='/dashboard' className='link-menu'> Dashboard </Link>
                </div>
              )}
            </div>

            {/* Configuración */}
            <div className="menu-item-group">
              <div className="menu-header" onClick={() => toggleSubmenu('configuracion')}>
                <p><strong className='nombre-modulo'>Configuración</strong></p>
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
                <p><strong className='nombre-modulo'>Usuarios</strong></p>
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
             
                </div>
              )}
            </div>


            {/* Cerrar sesión (no desplegable) */}
            <div className="menu-item-group">
              {/* ⭐ Usar un botón o div para el evento de clic ⭐ */}
              <div onClick={handleLogout} className='link-menu'>
                <p><strong className='nombre-modulo'>Cerrar sesión <FaSignOutAlt style={{ color: '#fff', marginTop: '5px' }} /></strong></p>
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