import React from 'react';
import './ProfileCard.css';
import { Link } from 'react-router-dom';
import profilePic from '../assets/foto-perfil.jpeg';
import { FaEdit, FaEllipsisV } from 'react-icons/fa';


function ProfileCard() {
  return (
    <div className="profile-card-container">
      <div className="profile-card-left">
        <img src={profilePic} alt="Profile" className="profile-card-image" />
      </div>
      <div className="profile-card-center">
        <h2 className="profile-card-username">Jessica_1234</h2>
        <p className="profile-card-email">Jessica@gmail.com</p>
      </div>
      <div className="profile-card-right">
        <Link to="/editperfilAdmin" className="profile-card-icon-wrapper">
          <FaEdit color="#9d6d28" size="20px" />
          <span className="icon-tooltip">Editar</span>
        </Link>
        {/* Icono de Tres Puntos/Opciones */}
        <div className="profile-card-icon-wrapper">
          <Link to="/ajustesAdmin ">
            <FaEllipsisV color=" #9d6d28" size="20px" />
            <span className="icon-tooltip">Opciones de Ajuste</span>
          </Link>
        </div>
      </div>
    </div>
  );
}

export default ProfileCard;