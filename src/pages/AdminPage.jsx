import React from 'react';
import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import './PanelAdmin.css';
import Nav from '../components/Nav.jsx';
import ProfileCard from '../components/ProfileCard.jsx';
import ImagenDashboard from '../assets/imagen-dashboard.png';
import ImagenProveedores from '../assets/Proveedores-admin.jpg';
import Footer from '../components/Footer.jsx';

function PedidosPage() {
  const [menuCollapsed, setMenuCollapsed] = useState(false);

  const toggleMenu = () => {
    setMenuCollapsed(!menuCollapsed);
  };

  const navigate = useNavigate();

  return (
    <div className="admin-container">
      {/* El componente de navegación lateral */}
      <Nav menuCollapsed={menuCollapsed} toggleMenu={toggleMenu} />

 
      <div className={`admin-main-content-area ${menuCollapsed ? 'admin-expanded-margin' : ''}`}>
   
        <ProfileCard />
        <h2 className='admin-titulo'>Panel Administrativo</h2>
        <p className='admin-subtitulo'>¡Bienvenido al Panel de Administración! Desde aquí tiene el control total.<br />
          Gestione usuarios, configure ajustes y supervise todas las operaciones <br />
          con eficiencia accediendo a todos los modulos como Administrador.</p>
        <img src={ImagenDashboard} alt="Dashboard" className="imagen-dashboard" /><br />
        <Link to="/dashboard" className='admin-boton'>Ver dahsboard 📶</Link> {/*Links */}


        <div className="admin-proveedor-card">
          <div className="admin-proveedor-text-content">
            <h4 className='card-titulo-admin'>¿Necesitas algo?</h4>
            <p className='card-subtitulo-admin'>Mira todos los módulos disponibles, Por ejemplo mira nuestros proveedores. </p>
          </div>
          <img src={ImagenProveedores} alt="Proveedores" className='imagen-proveedores' />
          <Link to ="/proveedores" className='admin-boton-proveedores'>Ver proveedores 🧑🏻‍💻</Link>
        </div><br/>
        <br/>
        <Footer />
      </div>
    </div>

  );
}

export default PedidosPage;