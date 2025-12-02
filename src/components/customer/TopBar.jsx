import React from 'react';
import './TopBar.css';

function TopBar({ userName, foto }) {
  const getInitials = (name) => {
    if (!name) return 'C';
    return name.split(' ').map(n => n[0].toUpperCase()).join('');
  };

  return (
    <div className="topbar-container">
      <div className="topbar-left">
        <span className="topbar-page-title">Julieta Streamline</span>
      </div>

      <div className="topbar-right">
        <div className="topbar-profile">
          {foto ? (
            <img
              //Usa la URL de Cloudinary directamente
              src={foto}
              alt="Customer Profile"
              className="topbar-profile-image"
            />
          ) : (
            <div className="topbar-profile-placeholder">
              {getInitials(userName)}
            </div>
          )}
          <span className="topbar-profile-name">{userName || 'Cliente'}</span>
        </div>
      </div>
    </div>
  );
}

export default TopBar;
