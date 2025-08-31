import React, { useState } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import Nav from '../components/Nav.jsx';

export default function EditUsuario() {
  // 1️⃣ Obtén el usuario que viene por el state del location
  const location = useLocation();
  const usuarioEdit = location.state?.usuario;

  // 2️⃣ Estado con todos los datos del usuario a editar
  const [usuarioData, setUsuarioData] = useState({
    nombre_Completo: usuarioEdit?.nombre_Completo || '',
    apellido: usuarioEdit?.apellido || '',
    tipo_Identificacion: usuarioEdit?.tipo_Identificacion || '',
    numero_Identificacion: usuarioEdit?.numero_Identificacion || '',
    correo: usuarioEdit?.correo || '',
    numero_Contacto: usuarioEdit?.numero_Contacto || '',
    barrio: usuarioEdit?.barrio || '',
    direccion: usuarioEdit?.direccion || '',
    rol: usuarioEdit?.rol || '',
    nombre_Usuario: usuarioEdit?.nombreUsuario || '',
    fotoPerfil: usuarioEdit?.fotoPerfil || null, 
  });

  // 3️⃣ Estado para la foto que se muestra y se puede actualizar
  const [fotoPreview, setFotoPreview] = useState(usuarioEdit?.fotoPerfil || '');

  // 4️⃣ Menú lateral y navegación
  const [menuCollapsed, setMenuCollapsed] = useState(false);
  const toggleMenu = () => setMenuCollapsed(!menuCollapsed);
  const navigate = useNavigate();

  // 5️⃣ Handler para cambios en inputs
  const handleChange = (e) => {
    const { name, value, type, files } = e.target;

    if (type === 'file') {
      const file = files[0];
      if (file) {
        setFotoPreview(URL.createObjectURL(file));
        setUsuarioData(prev => ({ ...prev, [name]: file }));
      }
    } else {
      setUsuarioData(prev => ({ ...prev, [name]: value }));
    }
  };

  // 6️⃣ Enviar formulario
  const handleSubmit = (e) => {
    e.preventDefault();

    // Aquí se puede hacer un fetch o axios para enviar el usuario actualizado al backend
    // Los datos del usuario están en el estado `usuarioData`
    console.log('Usuario actualizado:', usuarioData);
    alert('Usuario actualizado exitosamente!');
    setTimeout(() => navigate('/usuarios'), 800);
  };

  // 7️⃣ Renderizado del formulario con inputs controlados
  return (
    <div className="role-form-container">
      <Nav menuCollapsed={menuCollapsed} toggleMenu={toggleMenu} />

      <div className={`formulario-rol-main-content-area ${menuCollapsed ? 'expanded-margin' : ''}`}>
        <div className="formulario-roles">
          <h1 className="form-title">Editar Usuario</h1>
          <p className="form-info">Modifica los datos del usuario y luego haz clic en "Actualizar Usuario"</p>
          <br /><br />
          <form onSubmit={handleSubmit} className="role-form">

            {/* Campos de Nombre y Apellido */}
            <div className="form-group">
              <label htmlFor="nombre" className="label-heading">Nombre Completo:<span className="required-asterisk">*</span></label>
              <input
                id="nombre"
                name="nombre"
                className="input-field"
                placeholder="Ingresar nombre completo"
                value={usuarioData.nombre_Completo}
                onChange={handleChange}
                required
              />
            </div>
            <div className="form-group">
              <label htmlFor="apellido" className="label-heading">Apellido:<span className="required-asterisk">*</span></label>
              <input
                id="apellido"
                name="apellido"
                className="input-field"
                placeholder="Ingresar apellidos"
                value={usuarioData.apellido}
                onChange={handleChange}
                required
              />
            </div>

            {/* Tipo y Número de Identificación */}
            <div className="form-group">
              <label className="label-heading">Tipo de Identificación<span className="required-asterisk">*</span></label>
              <div className="identification-type-buttons">
                {['C.C', 'T.I'].map((tipo) => (
                  <React.Fragment key={tipo}>
                    <input
                      type="radio"
                      id={tipo}
                      name="tipo_Identificacion"
                      value={tipo}
                      checked={usuarioData.tipo_Identificacion === tipo}
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
            <div className="form-group">
              <label htmlFor="numeroIdentificacion" className="label-heading">Numero de Identificación: <span className="required-asterisk">*</span></label>
              <input
                id="numeroIdentificacion"
                name="numeroIdentificacion"
                className="input-field"
                placeholder="Ingresar número de identificación"
                value={usuarioData.numero_Identificacion}
                onChange={handleChange}
                required
              />
            </div>

            {/* Correo y Celular */}
            <div className="form-group">
              <label htmlFor="correoElectronico" className="label-heading">Correo Electrónico:<span className="required-asterisk">*</span></label>
              <input
                type="email"
                id="correoElectronico"
                name="correoElectronico"
                className="input-field"
                placeholder="Ingresar email@"
                value={usuarioData.correo}
                onChange={handleChange}
                required
              />
            </div>
            <div className="form-group">
              <label htmlFor="celular" className="label-heading">Número de contacto:<span className="required-asterisk">*</span></label>
              <input
                id="celular"
                name="celular"
                className="input-field"
                placeholder="Ingresar número"
                value={usuarioData.numero_Contacto}
                onChange={handleChange}
                required
              />
            </div>

            {/* Barrio y Dirección */}
            <div className="form-group">
              <label htmlFor="barrio" className="label-heading">Barrio: <span className="required-asterisk">*</span></label>
              <select id="barrio" name="barrio" value={usuarioData.barrio} onChange={handleChange} required className="barrio-select">
                <option value="">Selecciona un Barrio:</option>
                {['Niquia', 'Bellavista', 'San Martin', 'Villa Linda', 'Trapiche'].map(b => (
                  <option key={b} value={b}>{b}</option>
                ))}
              </select>
            </div>
            <div className="form-group">
              <label htmlFor="direccion" className="label-heading">Dirección:<span className="required-asterisk">*</span></label>
              <input
                id="direccion"
                name="direccion"
                className="input-field"
                placeholder="Ingresar dirección"
                value={usuarioData.direccion}
                onChange={handleChange}
                required
              />
            </div>

            {/* Rol y Nombre de Usuario */}
            <div className="form-group">
              <label htmlFor="rol" className="label-heading">Rol:<span className="required-asterisk">*</span></label>
              <select
                id="rol"
                name="rol"
                value={usuarioData.rol}
                onChange={handleChange}
                className="input-field"
                required
              >
                <option value="">-- Seleccione un rol --</option>
                <option value="Administrador">Administrador</option>
                <option value="Cliente">Cliente</option>
                <option value="Gestor">Gestor</option>
                <option value="Promotor">Promotor</option>
              </select>
            </div>
            <div className="form-group">
              <label htmlFor="nombreUsuario" className="label-heading">Nombre de Usuario:<span className="required-asterisk">*</span></label>
              <input
                id="nombreUsuario"
                name="nombreUsuario"
                className="input-field"
                value={usuarioData.nombre_Usuario}
                onChange={handleChange}
                required
              />
            </div>

            {/* Foto de perfil */}
            <div className="form-group">
              <label className="label-heading">Foto de Perfil (opcional)</label>
              <div className="image-upload-container">
                {fotoPreview && (
                  <img
                    src={fotoPreview}
                    alt="Previsualización"
                    className="preview-image"
                    value={usuarioData.foto}
                    style={{ width: '120px', borderRadius: '8px' }}
                  />
                )}
                <label htmlFor="fotoPerfil" className="custom-file-upload">
                  {fotoPreview ? 'Cambiar Foto' : 'Subir Foto'}
                </label>
                <input
                  id="fotoPerfil"
                  name="fotoPerfil"
                  type="file"
                  accept="image/*"
                  style={{ display: 'none' }}
                  onChange={handleChange}
                />
              </div>
            </div>

            {/* Botones */}
            <div className="form-buttons">
              <button type="button" className="cancel-button" onClick={() => navigate(-1)}>Cancelar</button>
              <button type="submit" className="save-button">
                Actualizar Usuario
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}