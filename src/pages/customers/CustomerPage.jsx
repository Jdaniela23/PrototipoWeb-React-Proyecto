import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import Nav from '../../components/customer/Nav';
import TopBar from '../../components/customer/TopBar';
import { getMyProfile } from '../../api/authService';
import { FaEdit } from 'react-icons/fa';
import './CustomerPage.css';

function CustomerPage() {
  const [isSidebarCollapsed, setIsSidebarCollapsed] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const navigate = useNavigate();

  const [profile, setProfile] = useState(null);
  const [error, setError] = useState('');

  useEffect(() => {
    const fetchProfile = async () => {
      try {
        const profileData = await getMyProfile();
        if (profileData) {
          setProfile(profileData);
          setError('');
        } else {
          setError('No se pudo cargar la información del perfil.');
          setProfile(null);
        }
      } catch (err) {
        setError(err.message || 'Error al cargar el perfil.');
        if (err.message.includes('token') || err.message.includes('No se encontró')) {
          navigate('/login');
        }
      } finally {
        setIsLoading(false);
      }
    };

    fetchProfile();
  }, [navigate]);

  const toggleSidebar = () => setIsSidebarCollapsed(!isSidebarCollapsed);

  if (isLoading) return null;

  if (error)
    return (
      <div className="error-container-customer">
        <h2>Error</h2>
        <p>{error}</p>
        <button onClick={() => window.location.reload()}>Volver a cargar la página</button>
      </div>
    );

  if (!profile)
    return (
      <div className="no-profile-container-customer">
        <h2>Perfil no disponible</h2>
        <p>No se pudo cargar la información de tu perfil en este momento.</p>
        <button onClick={() => window.location.reload()}>Recargar</button>
      </div>
    );

  // --- Campos del perfil ---
  const {
    nombreUsuario,
    nombreCompleto,
    apellido,
    email,
    numeroContacto,
    documento,
    tipoDocumento,
    direccion,
    barrio,
    foto
  } = profile;

  const initials = nombreCompleto ? nombreCompleto.split(' ').map(n => n[0]).join('') : '';

  return (
    <div className="customer-app-layout">
      <Nav menuCollapsed={isSidebarCollapsed} toggleMenu={toggleSidebar} />

      <TopBar
        userName={nombreUsuario || 'Cliente'}
        foto={foto}
        className={isSidebarCollapsed ? 'collapsed-sidebar-customer' : ''}
      />

      <div className={`customer-main-content ${isSidebarCollapsed ? 'expanded-margin-customer' : ''}`}>
        <div className="info-card-customer">
          <div className="titulo-miperfil-header">
            <h2 className="titulo-miperfil-customer">Mi perfil</h2>
            <button
              type="button"
              className="edit-profile-btn"
              onClick={() => navigate('/editarcustomers')}
            >
              <FaEdit />
            </button>
          </div>

          <div className="profile-details-container-customer">
            <div className="profile-image-section-customer">
              <img
                src={foto ? foto : `https://placehold.co/100x100/A2D2FF/000000?text=${initials}`}
                alt="Customer Profile"
                className="profile-avatar-customer"
              />
              <div className="profile-name-email-customer">
                <h3>{nombreCompleto || 'N/A'}</h3>
                <p>{email || 'N/A'}</p>
                <p>Usuario: {nombreUsuario || 'N/A'}</p>
              </div>
            </div>

            <div className="details-grid-customer">
              <div className="detail-item-customer">
                <label>Teléfono</label>
                <p>{numeroContacto || 'N/A'}</p>
              </div>
              <div className="detail-item-customer">
                <label>Dirección</label>
                <p>{direccion || 'N/A'}</p>
              </div>
              <div className="detail-item-customer">
                <label>Barrio</label>
                <p>{barrio || 'N/A'}</p>
              </div>
              <div className="detail-item-customer">
                <label>Documento</label>
                <p>{documento || 'N/A'}</p>
              </div>
              <div className="detail-item-customer">
                <label>Tipo Documento</label>
                <p>{tipoDocumento || 'N/A'}</p>
              </div>
              <div className="detail-item-customer">
                <label>Apellido</label>
                <p>{apellido || ''}</p>
              </div>
            </div>
          </div>
          <br />
        </div>
      </div>
    </div>
  );
}

export default CustomerPage;