import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import Nav from '../components/Nav.jsx';


// ✨ SIMULACIÓN: Aquí se importaría el contexto o estado global del usuario logueado.
// Por ahora, simularemos un objeto de usuario fijo.
const usuarioLogueado = {
  id: '01',
  nombre_Completo: 'Jessica',
  apellido: 'Lopez Perez',
  tipo_Identificacion: 'C.C',
  numero_Identificacion: '1036589745',
  correo: 'Jessica@gmail.com',
  numero_Contacto: '3109876543',
  barrio: 'Bellavista',
  direccion: 'Calle 10 # 20-30',
  rol: 'Administrador', // Este campo no se edita en el perfil
  nombre_Usuario: 'Jessica_1234', 

};


export default function EditPerfil() {
  const navigate = useNavigate();

  // 1️⃣ Estado inicial con los datos del usuario logueado.
  // Usamos useEffect para asegurarnos de que el estado se inicialice después del render.
  const [perfilData, setPerfilData] = useState({
    nombre_Completo: usuarioLogueado.nombre_Completo || '',
    apellido: usuarioLogueado.apellido || '',
    tipo_Identificacion: usuarioLogueado.tipo_Identificacion || '',
    numero_Identificacion: usuarioLogueado.numero_Identificacion || '',
    correo: usuarioLogueado.correo || '',
    numero_Contacto: usuarioLogueado.numero_Contacto || '',
    barrio: usuarioLogueado.barrio || '',
    direccion: usuarioLogueado.direccion || '',
    fotoPerfil: usuarioLogueado.fotoPerfil || null,
  });

  // 2️⃣ Estado para la previsualización de la foto
  const [fotoPreview, setFotoPreview] = useState(usuarioLogueado.fotoPerfil || '');

  // 3️⃣ Estado para el menú lateral
  const [menuCollapsed, setMenuCollapsed] = useState(false);
  const toggleMenu = () => setMenuCollapsed(!menuCollapsed);

  // 4️⃣ Handler para los cambios en los inputs
  const handleChange = (e) => {
    const { name, value, type, files } = e.target;

    if (type === 'file') {
      const file = files[0];
      if (file) {
        setFotoPreview(URL.createObjectURL(file));
        setPerfilData(prev => ({ ...prev, [name]: file }));
      }
    } else {
      setPerfilData(prev => ({ ...prev, [name]: value }));
    }
  };

  // 5️⃣ Manejador del envío del formulario
  const handleSubmit = (e) => {
    e.preventDefault();

    // Aquí se enviaría la data al backend para actualizar el perfil del administrador
    console.log('Datos del perfil a actualizar:', perfilData);

    // Simulación de una llamada a la API
    alert('¡Perfil actualizado exitosamente!');

    // Navegar de vuelta a la página de inicio o a la página del perfil
    setTimeout(() => navigate('/panelAdmin'), 800);
  };

  // 6️⃣ Renderizado del formulario
  return (
    <div className="role-form-container">
      <Nav menuCollapsed={menuCollapsed} toggleMenu={toggleMenu} />

      <div className={`formulario-rol-main-content-area ${menuCollapsed ? 'expanded-margin' : ''}`}>
        <div className="formulario-roles">
          <h1 className="form-title">Editar Mi Perfil</h1>
          <p className="form-info">Actualiza tu información personal y luego haz clic en "Guardar Cambios".</p>
          <br /><br />
          <form onSubmit={handleSubmit} className="role-form">

            {/* Campos de Nombre y Apellido */}
            <div className="form-group">
              <label htmlFor="nombre" className="label-heading">Nombre Completo:<span className="required-asterisk">*</span></label>
              <input
                id="nombre_Completo"
                name="nombre_Completo"
                className="input-field"
                placeholder="Ingresar nombre completo"
                value={perfilData.nombre_Completo}
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
                value={perfilData.apellido}
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
                      checked={perfilData.tipo_Identificacion === tipo}
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
                id="numero_Identificacion"
                name="numero_Identificacion"
                className="input-field"
                placeholder="Ingresar número de identificación"
                value={perfilData.numero_Identificacion}
                onChange={handleChange}
                required
              />
            </div>

            {/* Correo y Celular */}
            <div className="form-group">
              <label htmlFor="correoElectronico" className="label-heading">Correo Electrónico:<span className="required-asterisk">*</span></label>
              <input
                type="email"
                id="correo"
                name="correo"
                className="input-field"
                placeholder="Ingresar email@"
                value={perfilData.correo}
                onChange={handleChange}
                required
              />
            </div>
            <div className="form-group">
              <label htmlFor="celular" className="label-heading">Número de contacto:<span className="required-asterisk">*</span></label>
              <input
                id="numero_Contacto"
                name="numero_Contacto"
                className="input-field"
                placeholder="Ingresar número"
                value={perfilData.numero_Contacto}
                onChange={handleChange}
                required
              />
            </div>

            {/* Barrio y Dirección */}
            <div className="form-group">
              <label htmlFor="barrio" className="label-heading">Barrio: <span className="required-asterisk">*</span></label>
              <select id="barrio" name="barrio" value={perfilData.barrio} onChange={handleChange} required className="barrio-select">
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
                value={perfilData.direccion}
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
              <button type="button" className="cancel-button" onClick={() => navigate('/panelAdmin')}>Cancelar</button>
              <button type="submit" className="save-button">
                Guardar Cambios
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}