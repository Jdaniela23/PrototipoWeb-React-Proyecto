import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { getMyProfile, changePassword } from '../../api/authService';
import TopBar from '../../components/customer/TopBar';
import Nav from '../../components/customer/Nav';
import './CambiarPasswordPage.css';
import { FaEye, FaEyeSlash, FaLock } from 'react-icons/fa';

function CambiarPasswordPage() {
  const [profile, setProfile] = useState({ nombreUsuario: '', fotoBase64: '', fotoPreview: '' });
  const [currentPassword, setCurrentPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [showCurrent, setShowCurrent] = useState(false);
  const [showNew, setShowNew] = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const [message, setMessage] = useState('');
  const [isSidebarCollapsed, setIsSidebarCollapsed] = useState(false);
  const navigate = useNavigate();

  // Cargar perfil para TopBar
  useEffect(() => {
    const fetchProfile = async () => {
      try {
        const data = await getMyProfile();
        if (data.fotoBase64) {
          data.fotoPreview = `data:image/png;base64,${data.fotoBase64}`;
        }
        setProfile(data);
      } catch (err) {
        console.error('Error cargando perfil:', err);
      }
    };
    fetchProfile();
  }, []);

  const toggleSidebar = () => setIsSidebarCollapsed(!isSidebarCollapsed);

  const validatePassword = (pwd) => {
    const tests = [
      /.{8,}/,           // 8+ caracteres
      /[A-Z]/,           // mayúscula
      /[a-z]/,           // minúscula
      /[0-9]/,           // número
      /[!@#$%^&*()_+\-=[\]{};':"\\|,.<>/?]/ // especial
    ];
    return tests.every(t => t.test(pwd));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (newPassword !== confirmPassword) {
      setMessage('Las contraseñas no coinciden ❌');
      return;
    }

    if (!validatePassword(newPassword)) {
      setMessage('La nueva contraseña no es válida ⚠️');
      return;
    }

    setIsSaving(true);
    try {
      await changePassword({
        ContrasenaActual: currentPassword,
        NuevaContrasena: newPassword,
        ConfirmarNuevaContrasena: confirmPassword
      });

      setMessage('Contraseña cambiada con éxito ✅');
      setTimeout(() => navigate('/pagecustomers'), 1000);
    } catch (err) {
      console.error('Error en changePassword:', err);
      setMessage(err.message || 'Error al cambiar la contraseña ❌');
    } finally {
      setIsSaving(false);
    }
  };

  return (
    <div className={`cambiar-pass-page ${isSidebarCollapsed ? 'sidebar-collapsed' : ''}`}>
      <Nav menuCollapsed={isSidebarCollapsed} toggleMenu={toggleSidebar} />
      <div className="content-wrapper">
        {/* TopBar con foto y nombre de usuario */}
        <TopBar userName={profile.nombreUsuario || 'Cliente'} foto={profile.fotoBase64 || profile.foto} />

        <div className="cambiar-pass-container">
          <h2><FaLock color='#c89b3c' /> Cambiar Contraseña </h2>
          <form onSubmit={handleSubmit} className="cambiar-pass-form">

            <div className="input-group">
              <label>Contraseña actual:</label>
              <div className="password-input-wrapper">
                <input
                  type={showCurrent ? "text" : "password"}
                  value={currentPassword}
                  onChange={(e) => setCurrentPassword(e.target.value)}
                  required
                />
                <span className="toggle-password" onClick={() => setShowCurrent(!showCurrent)}>
                  {showCurrent ? <FaEyeSlash color="black" /> : <FaEye color="black" />}
                </span>
              </div>
            </div>

            <div className="input-group">
              <label>Nueva contraseña:</label>
              <div className="password-input-wrapper">
                <input
                  type={showNew ? "text" : "password"}
                  value={newPassword}
                  onChange={(e) => setNewPassword(e.target.value)}
                  required
                />
                <span className="toggle-password" onClick={() => setShowNew(!showNew)}>
                  {showNew ? <FaEyeSlash color="black" /> : <FaEye color="black" />}
                </span>
              </div>
            </div>

            <div className="input-group">
              <label>Confirmar nueva contraseña:</label>
              <div className="password-input-wrapper">
                <input
                  type={showConfirm ? "text" : "password"}
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  required
                />
                <span className="toggle-password" onClick={() => setShowConfirm(!showConfirm)}>
                  {showConfirm ? <FaEyeSlash color="black" /> : <FaEye color="black" />}
                </span>
              </div>
            </div>

            <button type="submit" disabled={isSaving}>
              {isSaving ? 'Guardando...' : 'Cambiar contraseña'}
            </button>
            <button type="button" className="cancel-button" onClick={() => navigate(-1)}>
              Cancelar
            </button>
          </form>

          {/* Mensaje en negro */}
          {message && <p style={{ color: 'black', marginTop: '10px' }}>{message}</p>}
        </div>
      </div>
    </div>
  );
}

export default CambiarPasswordPage;
