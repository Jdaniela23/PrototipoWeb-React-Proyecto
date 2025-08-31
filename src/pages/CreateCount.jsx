import './CreateCount.css';
import React, { useState } from 'react';
import Footer from '../components/Footer';
import { FaEyeSlash, FaEye } from 'react-icons/fa';
import { useNavigate, Link } from 'react-router-dom';

export default function CreateCount() {
  /* 🔑 Navegación */
  const navigate = useNavigate();

  /* 📦 Estado principal del formulario */
  const [formData, setFormData] = useState({
    tipoIdentificacion: '',
    numeroIdentificacion: '',
    correoElectronico: '',
    nombre: '',
    apellido: '',
    celular: '',
    barrio: '',
    direccion: '',
    nombreUsuario: '',
    contrasena: '',
    fotoPerfil: null,
    aceptoCondiciones: false,
  });

  /* ▶️ Estados auxiliares */
  const [imagePreviewUrl, setImagePreviewUrl] = useState(null);
  const [showPassword, setShowPassword] = useState(false);
  const [passwordError, setPasswordError] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [confirmError, setConfirmError] = useState('');

  /* 👁️ Cambiar visibilidad contraseña */
  const togglePasswordVisibility = () => setShowPassword(!showPassword);

  /* 🖊️ Maneja cambios de inputs */
  const handleChange = (e) => {
    const { name, value, type, checked, files } = e.target;

    if (type === 'checkbox') {
      setFormData(prev => ({ ...prev, [name]: checked }));
    } else if (type === 'file') {
      const file = files[0];
      if (file) {
        setFormData(prev => ({ ...prev, [name]: file }));
        const reader = new FileReader();
        reader.onloadend = () => setImagePreviewUrl(reader.result);
        reader.readAsDataURL(file);
      } else {
        setFormData(prev => ({ ...prev, [name]: null }));
        setImagePreviewUrl(null);
      }
    } else {
      setFormData(prev => ({ ...prev, [name]: value }));
    }

    // limpia errores al escribir
    if (name === 'contrasena') setPasswordError('');
  };

  /* 📌 Confirmar contraseña */
  const handleConfirmChange = (e) => {
    const value = e.target.value;
    setConfirmPassword(value);
    if (formData.contrasena && value !== formData.contrasena) {
      setConfirmError('Las contraseñas no coinciden');
    } else {
      setConfirmError('');
    }
  };

  /* 🔒 Validación de contraseña fuerte */
  const validatePassword = (pwd) => {
    const minLen = 8;
    const tests = [
      /.{8,}/,           // 8+ caracteres
      /[A-Z]/,           // mayúscula
      /[a-z]/,           // minúscula
      /[0-9]/,           // número
      /[!@#$%^&*()_+\-=[\]{};':"\\|,.<>/?]/ // especial
    ];
    return tests.every(t => t.test(pwd));
  };

  /* 📤 Enviar formulario */
  const handleSubmit = (e) => {
    e.preventDefault();

    // contraseña fuerte
    if (!validatePassword(formData.contrasena)) {
      setPasswordError('• La contraseña debe tener al menos 8 caracteres, incluir mayúsculas, minúsculas, números y caracteres especiales.');
      return;
    }

    // confirmación
    if (formData.contrasena !== confirmPassword) {
      setConfirmError('Las contraseñas no coinciden');
      return;
    }

    // aceptar condiciones
    if (!formData.aceptoCondiciones) {
      alert('Debes aceptar los términos y condiciones.');
      return;
    }

    console.log('Formulario enviado:', formData);
    alert('Cuenta creada correctamente');
    setTimeout(() => navigate('/loading'), 1200);
  };

  /* 🖼️ Texto dinámico del label de archivo */
  const fileLabel = formData.fotoPerfil ? `Archivo: ${formData.fotoPerfil.name}` : 'Foto de Perfil (opcional)';

  /* 🖥️ Render */
  return (
    <div className="registration-container">
      {/* Enlaces superiores */}
      <div className="boton-createcount">
        <Link to="/login">Iniciar sesión </Link>
        <Link to="/">Inicio</Link>
      </div>

      <div className="registration-form-section">
        <h1 className="welcome-title">¡Bienvenido!</h1>
        <h2 className="create-account-title">Crear una cuenta 👩🏻‍💻</h2>

        <form className="registration-form" onSubmit={handleSubmit}>
          {/* Tipo de identificación */}
          <div className="form-group">
            <label className="tipoIdentificacion">Tipo de Identificación: <span className="required-asterisk">*</span></label>
            <p className='parrafo-explicacion-createcount'>Selecciona una de las opciones: </p>
            <div className="identification-type-buttons">
              {['C.C', 'T.I'].map((tipo) => (
                <React.Fragment key={tipo}>
                  <input
                    type="radio"
                    id={tipo}
                    name="tipoIdentificacion"
                    value={tipo}
                    checked={formData.tipoIdentificacion === tipo}
                    onChange={handleChange}
                    required
                  />

                  <label htmlFor={tipo} className="id-type-button" data-tooltip={tipo === 'C.C' ? 'Cédula de Ciudadanía' : 'Tarjeta de Identidad'}>
                    {tipo}
                  </label>
                </React.Fragment>

              ))}
            </div>
          </div>

          {/* Número de identificación */}
          <div className="form-group">
            <label htmlFor="numeroIdentificacion">Número de Identificación: <span className="required-asterisk">*</span></label>
            <input
              id="numeroIdentificacion"
              name="numeroIdentificacion"
              className="input-createcount-identificacion"
              placeholder="Ingresar número de identificación"
              value={formData.numeroIdentificacion}
              onChange={handleChange}
              required
            />
          </div>

          {/* Correo */}
          <div className="form-group">
            <label htmlFor="correoElectronico">Correo electrónico: <span className="required-asterisk">*</span></label>
            <input
              type="email"
              id="correoElectronico"
              name="correoElectronico"
              placeholder="Ingresar email@"
              className="nombre-create"
              value={formData.correoElectronico}
              onChange={handleChange}
              required
            />
          </div>

          {/* Nombre y Apellido */}
          <div className="form-group">
            <label htmlFor="nombre">Nombre Completo: <span className="required-asterisk">*</span></label>
            <input
              id="nombre"
              name="nombre"
              className="nombre-create"
              placeholder="Ingresar nombre completo"
              value={formData.nombre}
              onChange={handleChange}
              required
            />
          </div>
          <div className="form-group">
            <label htmlFor="apellido">Apellido: <span className="required-asterisk">*</span></label>
            <input
              id="apellido"
              name="apellido"
              className="nombre-create"
              placeholder="Ingresar apellidos"
              value={formData.apellido}
              onChange={handleChange}
              required
            />
          </div>

          {/* Celular */}
          <div className="form-group">
            <label htmlFor="celular">Celular: <span className="required-asterisk">*</span></label>
            <input
              id="celular"
              name="celular"
              className="nombre-create"
              placeholder="Ingresar celular"
              value={formData.celular}
              onChange={handleChange}
              required
            />
          </div>

          {/* Barrio */}
          <div className="form-group">
            <label htmlFor="barrio">Barrio: <span className="required-asterisk">*</span></label>
            <select id="barrio" name="barrio" value={formData.barrio} onChange={handleChange} required className="barrio-select">
              <option value="">Selecciona un Barrio:</option>
              {['Niquia', 'Bellavista', 'San Martin', 'Villa Linda', 'Trapiche'].map(b => (
                <option key={b} value={b}>{b}</option>
              ))}
            </select>
          </div>

          {/*Dirección */}
          <div className="form-group">
            <label htmlFor="direccion">Dirección: <span className="required-asterisk">*</span></label>
            <input
              id="direccion"
              name="direccion"
              className="nombre-create"
              placeholder="Ingresar Dirección"
              value={formData.direccion}
              onChange={handleChange}
              required
            />
          </div>

          {/* Nombre de usuario */}
          <div className="form-group">
            <label htmlFor="nombreUsuario">Nombre de Usuario: <span className="required-asterisk">*</span></label>
            <input
              id="nombreUsuario"
              name="nombreUsuario"
              className="nombre-create"
              placeholder="Ingresar nombre de usuario"
              value={formData.nombreUsuario}
              onChange={handleChange}
              required
            />
          </div>

          {/* Contraseña */}
          <div className="form-group">
            <label htmlFor="contrasena">Contraseña: <span className="required-asterisk">*</span></label>
            <input
              type={showPassword ? 'text' : 'password'}
              id="contrasena"
              className="nombre-create"
              name="contrasena"
              placeholder="Ingresar contraseña"
              value={formData.contrasena}
              onChange={handleChange}
              required


            />
            <span className="password-toggle-icon-count" onClick={togglePasswordVisibility}>
              {showPassword ? <FaEyeSlash color="black" /> : <FaEye color="black" />}
            </span>
            {passwordError && <p className="password-validation-message error-message">{passwordError}</p>}
            {!passwordError && <p className="password-validation-message">• La contraseña debe tener al menos 8 caracteres, incluir mayúsculas, minúsculas, números y caracteres especiales.</p>}
          </div>

          {/* Confirmar contraseña */}
          <div className="form-group">
            <label>Confirmar contraseña: <span className="required-asterisk">*</span></label>
            <input type="password" value={confirmPassword} className="nombre-create" onChange={handleConfirmChange} required placeholder="Repetir contraseña" />
            {confirmError && <p className="password-validation-message error-message">{confirmError}</p>}
          </div>

          {/* Foto de perfil */}
          <div className="form-group">
            <label htmlFor="fotoPerfil" className="file-upload-label">{fileLabel}</label>
            <input id="fotoPerfil" name="fotoPerfil" type="file" accept="image/*" className="file-input" onChange={handleChange} />
            {imagePreviewUrl && <img src={imagePreviewUrl} alt="preview" className="preview-image-create-count" />}
          </div>

          {/* Acepto condiciones */}
          <div className="form-group checkbox-group">
            <input type="checkbox" id="aceptoCondiciones" name="aceptoCondiciones" checked={formData.aceptoCondiciones} onChange={handleChange} required />
            <label htmlFor="aceptoCondiciones" className="checkbox-label">Acepto la política de privacidad <span className="required-asterisk">*</span></label>
          </div>

          {/* Botón */}
          <button type="submit" className="submit-button">Crear Cuenta</button>
        </form>
      </div>
      <div className='footer-create-count'>
        <Footer />
      </div>
    </div>


  );
}