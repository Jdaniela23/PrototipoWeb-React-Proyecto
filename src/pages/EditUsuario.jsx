import React, { useState, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import Nav from '../components/Nav.jsx';
import { updateUser } from '../api/usersService.js';
import { getRoles } from '../api/rolesService.js';
import { getBarrios } from '../api/authService';

function EditUsuario() {

  const location = useLocation();
  const navigate = useNavigate();
  const usuarioEdit = location.state?.usuario;
  const userId = usuarioEdit?.id;
  console.log("Usuario recibido para editar:", usuarioEdit);


  const [usuarioData, setUsuarioData] = useState({
    nombre_Completo: usuarioEdit?.nombre_Completo || '',
    apellido: usuarioEdit?.apellido || '',
    tipo_Identificacion: usuarioEdit?.tipo_Identificacion || '',
    documento: usuarioEdit?.numero_Identificacion || '',
    email: usuarioEdit?.correo || '',
    numeroContacto: usuarioEdit?.numero_Contacto || '',
    Id_Barrio: usuarioEdit?.id_Barrio ? String(usuarioEdit.id_Barrio) : '',
    direccion: usuarioEdit?.direccion || '',
    Id_Rol: usuarioEdit?.id_Rol ? String(usuarioEdit.id_Rol) : '',
    nombre_Usuario: usuarioEdit?.nombreUsuario || '',
    foto: usuarioEdit?.foto || null,
    fotoFile: null,
  });

  const [fotoPreview, setFotoPreview] = useState(usuarioEdit?.foto || '');
  const [fieldErrors, setFieldErrors] = useState({});
  const [successMessage, setSuccessMessage] = useState('');
  const [errorMessage, setErrorMessage] = useState('');
  const [loading, setLoading] = useState(false);
  const [roles, setRoles] = useState([]);
  const [barrios, setBarrios] = useState([]);
  const [menuCollapsed, setMenuCollapsed] = useState(false);

  // Cargar roles y barrios
  useEffect(() => {
    const fetchDropdownData = async () => {
      try {
        const [fetchedRoles, fetchedBarrios] = await Promise.all([getRoles(), getBarrios()]);
        console.log("Roles recibidos:", fetchedRoles);
        console.log("Barrios recibidos:", fetchedBarrios);
        console.log("Ejemplo de Rol:", fetchedRoles[0]);
        console.log("Ejemplo de Barrio:", fetchedBarrios[0]);

        const rolesData = Array.isArray(fetchedRoles)
          ? fetchedRoles.map(r => ({ ...r, id_Rol: String(r.id_Rol) }))
          : fetchedRoles.data?.map(r => ({ ...r, id_Rol: String(r.id_Rol) })) || [];

        const barriosData = Array.isArray(fetchedBarrios)
          ? fetchedBarrios.map(b => ({
            id_Barrio: String(b.id_Barrio || b.id),
            nombre: b.nombre
          }))
          : fetchedBarrios.data?.map(b => ({
            id_Barrio: String(b.id_Barrio || b.id),
            nombre: b.nombre
          })) || [];

        console.log("ID_Barrio usuario:", usuarioEdit?.id_Barrio);
        console.log("Barrios cargados:", barriosData.map(b => b.id));

        setRoles(rolesData);
        setBarrios(barriosData);


      } catch (err) {
        console.error("Error cargando roles/barrios:", err);
        setErrorMessage("Error al cargar opciones de roles y barrios.");
      }
    };
    fetchDropdownData();
  }, []);


  //  Sincronizar barrio y rol después de que se carguen los datos
  useEffect(() => {
    if (usuarioEdit && barrios.length > 0 && roles.length > 0) {
      const barrioEncontrado = barrios.find(
        b => b.nombre.toLowerCase().includes(usuarioEdit.barrio.toLowerCase().trim())
      );

      const rolEncontrado = roles.find(
        r => r.nombre_Rol.toLowerCase().trim() === usuarioEdit.rol.toLowerCase().trim()
      );

      console.log("Barrio encontrado:", barrioEncontrado);
      console.log("Rol encontrado:", rolEncontrado);

      setUsuarioData(prev => ({
        ...prev,
        Id_Barrio: barrioEncontrado ? barrioEncontrado.id_Barrio : '',
        Id_Rol: rolEncontrado ? rolEncontrado.id_Rol : '',
      }));
    }
  }, [usuarioEdit, barrios, roles]);

  const toggleMenu = () => setMenuCollapsed(!menuCollapsed);

  const handleChange = (e) => {
    const { name, value, files } = e.target;

    if (name === 'fotoFile') {
      const file = files[0];
      if (file) {
        setFotoPreview(URL.createObjectURL(file));
        setUsuarioData(prev => ({ ...prev, fotoFile: file }));
      } else {
        setFotoPreview(usuarioData.foto);
        setUsuarioData(prev => ({ ...prev, fotoFile: null }));
      }
    } else {
      setUsuarioData(prev => ({ ...prev, [name]: value }));
      setFieldErrors(prev => ({ ...prev, [name]: null }));
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setSuccessMessage('');
    setErrorMessage('');

    const requiredFields = {
      tipo_Identificacion: 'Tipo Identificación',
      documento: 'Número Identificación',
      email: 'Correo Electrónico',
      nombre_Completo: 'Nombre',
      apellido: 'Apellido',
      numeroContacto: 'Número de contacto',
      Id_Barrio: 'Barrio',
      direccion: 'Dirección',
      Id_Rol: 'Rol',
      nombre_Usuario: 'Nombre de Usuario'
    };

    const emptyFieldErrors = {};
    Object.keys(requiredFields).forEach(key => {
      if (!usuarioData[key] || String(usuarioData[key]).trim() === '') {
        emptyFieldErrors[key] = `El campo ${requiredFields[key]} es obligatorio.`;
      }
    });

    const documentoValue = String(usuarioData.documento || '').trim();
    const nombreValue = String(usuarioData.nombre_Completo || '').trim();
    const apellidoValue = String(usuarioData.apellido || '').trim();
    const contactoValue = String(usuarioData.numeroContacto || '').trim();
    const emailValue = String(usuarioData.email || '').trim();

    const formatErrors = {};
    if (!emptyFieldErrors.documento && documentoValue && /[^0-9]/.test(documentoValue))
      formatErrors.documento = 'El Número de Identificación solo debe contener dígitos (0-9).';
    if (!emptyFieldErrors.numeroContacto && contactoValue && /[^0-9]/.test(contactoValue))
      formatErrors.numeroContacto = 'El Número  solo debe contener dígitos (0-9).';
    if (!emptyFieldErrors.numeroContacto && contactoValue && /\s/.test(contactoValue))
      formatErrors.numeroContacto = 'El Número no debe tener espacios.';
    const regexLetras = /[^a-zA-ZñÑáéíóúÁÉÍÓÚ\s]/;
    if (!emptyFieldErrors.nombre_Completo && nombreValue && regexLetras.test(nombreValue))
      formatErrors.nombre_Completo = 'El Nombre solo debe contener letras.';
    if (!emptyFieldErrors.apellido && apellidoValue && regexLetras.test(apellidoValue))
      formatErrors.apellido = 'El Apellido solo debe contener letras.';
    const regexEmail = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emptyFieldErrors.email && emailValue && !regexEmail.test(emailValue))
      formatErrors.email = 'Formato de correo electrónico inválido.';

    const allErrors = { ...emptyFieldErrors, ...formatErrors };
    setFieldErrors(allErrors);

    if (Object.keys(allErrors).length > 0) {
      setLoading(false);
      setErrorMessage('Por favor, corrige los errores antes de actualizar.');
      return;
    }

    try {
      const formData = new FormData();
      const nombreActual = String(usuarioData.nombre_Usuario || '').trim();
      const nombreOriginal = String(usuarioEdit.nombreUsuario || '').trim();

      if (nombreActual !== nombreOriginal) {
        formData.append('NombreUsuario', usuarioData.nombre_Usuario);
      }

      if (usuarioData.nombre_Completo !== usuarioEdit.nombre_Completo)
        formData.append('NombreCompleto', usuarioData.nombre_Completo);

      if (usuarioData.apellido !== usuarioEdit.apellido)
        formData.append('Apellido', usuarioData.apellido);
      if (usuarioData.documento !== usuarioEdit.numero_Identificacion)
        formData.append('Documento', usuarioData.documento);
      if (usuarioData.tipo_Identificacion !== usuarioEdit.tipo_Identificacion)
        formData.append('Tipo_Documento', usuarioData.tipo_Identificacion);
      if (usuarioData.email !== usuarioEdit.correo)
        formData.append('Email', usuarioData.email);
      if (usuarioData.numeroContacto !== usuarioEdit.numero_Contacto)
        formData.append('NumeroContacto', usuarioData.numeroContacto);
      if (usuarioData.direccion !== usuarioEdit.direccion)
        formData.append('Direccion', usuarioData.direccion);
      if (usuarioData.Id_Barrio && usuarioData.Id_Barrio !== String(usuarioEdit.id_Barrio))
        formData.append('Id_Barrio', usuarioData.Id_Barrio);
      if (usuarioData.Id_Rol && usuarioData.Id_Rol !== String(usuarioEdit.id_Rol))
        formData.append('Id_Rol', usuarioData.Id_Rol);
      if (usuarioData.fotoFile)
        formData.append('File', usuarioData.fotoFile);
      else if (usuarioData.foto && !usuarioData.fotoFile)
        formData.append('Foto', usuarioData.foto);

      await updateUser(userId, formData);

      setSuccessMessage(`Usuario '${usuarioData.nombre_Usuario}' actualizado con éxito.`);
      setTimeout(() => navigate('/usuarios', { state: { successMessage: `Usuario '${usuarioData.nombre_Usuario}' actualizado.` } }), 1500);

    } catch (error) {
      console.error("Error al actualizar:", error);
      const backendMessage = (error.response?.data?.message || error.message || '').toLowerCase();
      const newErrors = {};


      if (backendMessage.match(/\b(correo|email|e-mail)\b/) && backendMessage.includes('registrado')) {
        newErrors.email = 'El correo ya está registrado.';
      }

      if (backendMessage.match(/\b(documento|identificación|cedula)\b/) && backendMessage.includes('registrado')) {
        newErrors.documento = 'El número de identificación ya está registrado.';
      }

      if (backendMessage.match(/\bnombre.*usuario\b/) && backendMessage.includes('uso')) {
        newErrors.nombre_Usuario = 'El nombre de usuario ya está en uso.';
      }

      if (Object.keys(newErrors).length > 0) {
        setFieldErrors(prev => ({ ...prev, ...newErrors }));
      } else {
        setErrorMessage(backendMessage || 'Error al actualizar el usuario. Revisa la consola.');
      }
    } finally {
      setLoading(false);
    }
  };

  if (!usuarioEdit) return null;

  return (
    <div className="role-form-container">
      <Nav menuCollapsed={menuCollapsed} toggleMenu={toggleMenu} />
      <div className={`formulario-rol-main-content-area ${menuCollapsed ? 'expanded-margin' : ''}`}>
        <div className="formulario-roles">
          <h1 className="form-title">Editar Usuario 👩🏻‍💻</h1>
          {successMessage && <div className="form-message success">{successMessage}</div>}
          {errorMessage && <div className="form-message error">{errorMessage}</div>}

          <form onSubmit={handleSubmit} className="role-form two-columns">
            {/* Tipo de Identificación */}
            <div className="form-group">
              <label className="label-heading">
                Tipo de Identificación <span className="required-asterisk">*</span>
              </label>
              <div className="identification-type-buttons">
                {[
                  { codigo: 'C.C', nombre: 'Cédula de Ciudadanía' },
                  { codigo: 'T.I', nombre: 'Tarjeta de Identidad' },
                  { codigo: 'C.E', nombre: 'Cédula de Extranjería' },
                  { codigo: 'P.P', nombre: 'Pasaporte' },
                ].map(({ codigo, nombre }) => (
                  <React.Fragment key={codigo}>
                    <input
                      type="radio"
                      id={`edit-${codigo}`}
                      name="tipo_Identificacion"
                      value={codigo}
                      checked={usuarioData.tipo_Identificacion === codigo}
                      onChange={handleChange}
                    />
                    <label htmlFor={`edit-${codigo}`} className="id-type-button" data-tooltip={nombre}>
                      {codigo}
                    </label>
                  </React.Fragment>
                ))}
              </div>
              {fieldErrors.tipo_Identificacion && <p className="error-message-rol">{fieldErrors.tipo_Identificacion}</p>}
            </div>

            {/* Documento */}
            <div className="form-group">
              <label htmlFor="documento" className="label-heading">
                Número de Identificación <span className="required-asterisk">*</span>
              </label>
              <input
                id="documento"
                name="documento"
                className="input-field"
                value={usuarioData.documento}
                onChange={handleChange}
              />
              {fieldErrors.documento && <p className="error-message-rol">{fieldErrors.documento}</p>}
            </div>

            {/* Nombre */}
            <div className="form-group">
              <label htmlFor="nombre_Completo" className="label-heading">
                Nombre <span className="required-asterisk">*</span>
              </label>
              <input
                id="nombre_Completo"
                name="nombre_Completo"
                className="input-field"
                value={usuarioData.nombre_Completo}
                onChange={handleChange}
              />
              {fieldErrors.nombre_Completo && <p className="error-message-rol">{fieldErrors.nombre_Completo}</p>}
            </div>

            {/* Apellido */}
            <div className="form-group">
              <label htmlFor="apellido" className="label-heading">
                Apellido <span className="required-asterisk">*</span>
              </label>
              <input
                id="apellido"
                name="apellido"
                className="input-field"
                value={usuarioData.apellido}
                onChange={handleChange}
              />
              {fieldErrors.apellido && <p className="error-message-rol">{fieldErrors.apellido}</p>}
            </div>

            {/* Correo */}
            <div className="form-group">
              <label htmlFor="email" className="label-heading">
                Correo Electrónico <span className="required-asterisk">*</span>
              </label>
              <input
                id="email"
                name="email"
                type="email"
                className="input-field"
                value={usuarioData.email}
                onChange={handleChange}
              />
              {fieldErrors.email && <p className="error-message-rol">{fieldErrors.email}</p>}
            </div>

            {/* Número de contacto */}
            <div className="form-group">
              <label htmlFor="numeroContacto" className="label-heading">
                Número de contacto <span className="required-asterisk">*</span>
              </label>
              <input
                id="numeroContacto"
                name="numeroContacto"
                className="input-field"
                value={usuarioData.numeroContacto}
                onChange={handleChange}
              />
              {fieldErrors.numeroContacto && <p className="error-message-rol">{fieldErrors.numeroContacto}</p>}
            </div>

            {/* Barrio */}
            <div className="form-group">
              <label htmlFor="Id_Barrio" className="label-heading">
                Barrio <span className="required-asterisk">*</span>
              </label>
              <select
                id="Id_Barrio"
                name="Id_Barrio"
                className="input-field"
                value={usuarioData.Id_Barrio}
                onChange={handleChange}
                disabled={barrios.length === 0}
              >
                <option value="">Seleccione un rol</option>
                {barrios.map(barrio => (
                  <option key={barrio.id_Barrio} value={barrio.id_Barrio}>
                    {barrio.nombre}
                  </option>
                ))}

              </select>

              {fieldErrors.Id_Barrio && <p className="error-message-rol">{fieldErrors.Id_Barrio}</p>}
            </div>

            {/* Dirección */}
            <div className="form-group">
              <label htmlFor="direccion" className="label-heading">
                Dirección <span className="required-asterisk">*</span>
              </label>
              <input
                id="direccion"
                name="direccion"
                className="input-field"
                value={usuarioData.direccion}
                onChange={handleChange}
              />
              {fieldErrors.direccion && <p className="error-message-rol">{fieldErrors.direccion}</p>}
            </div>

            {/* Rol */}
            <div className="form-group">
              <label htmlFor="Id_Rol" className="label-heading">
                Rol <span className="required-asterisk">*</span>
              </label>
              <select
                id="Id_Rol"
                name="Id_Rol"
                className="input-field"
                value={usuarioData.Id_Rol}
                onChange={handleChange}
                disabled={roles.length === 0}
              >
                <option value="">Seleccione un rol</option>
                {roles.map(r => (
                  <option key={r.id_Rol} value={r.id_Rol}>
                    {r.nombre_Rol}
                  </option>
                ))}
              </select>
              {fieldErrors.Id_Rol && <p className="error-message">{fieldErrors.Id_Rol}</p>}
            </div>

            {/* Nombre de usuario */}
            <div className="form-group">
              <label htmlFor="nombre_Usuario" className="label-heading">
                Nombre de Usuario <span className="required-asterisk">*</span>
              </label>
              <input
                id="nombre_Usuario"
                name="nombre_Usuario"
                className="input-field"
                value={usuarioData.nombre_Usuario}
                onChange={handleChange}
              />
              {fieldErrors.nombre_Usuario && <p className="error-message-rol">{fieldErrors.nombre_Usuario}</p>}
            </div>

            {/* Foto */}
            <div className="form-group full-width">
              <label className="label-heading">Foto de Perfil (opcional)</label>
              {fotoPreview && <img src={fotoPreview} alt="Previsualización" className="preview-image" />}
              <br />
              <label htmlFor="fotoFile" className="custom-file">
                {fotoPreview ? 'Cambiar Foto ✅' : 'Añadir Foto'}
              </label>
              {fotoPreview && (
                <button
                  type="button"
                  className="btn-quitar-foto"
                  onClick={async () => {
                    try {
                      // Eliminar en backend si el usuario tenía una foto guardada
                      if (usuarioEdit.foto) {
                        await updateUser(userId, { Foto: '' }); // Envía campo vacío para borrarla
                      }

                      // Actualiza el estado local
                      setFotoPreview(null);
                      setUsuarioData((prev) => ({
                        ...prev,
                        foto: '',
                        fotoFile: null,
                      }));

                      setSuccessMessage('Foto eliminada correctamente.');
                      setTimeout(() => setSuccessMessage(''), 2500);
                    } catch (error) {
                      console.error("Error al eliminar foto:", error);
                      setErrorMessage('Error al eliminar la foto.');
                      setTimeout(() => setErrorMessage(''), 3000);
                    }
                  }}
                >
                  Quitar Foto
                </button>
              )}

              <input
                id="fotoFile"
                name="fotoFile"
                type="file"
                accept="image/*"
                style={{ display: 'none' }}
                onChange={handleChange}
              />
            </div>

            {/* Botones */}
            <div className="form-buttons">
              <button type="submit" className="save-button" disabled={loading}>
                {loading ? 'Actualizando...' : 'Actualizar Usuario'}
              </button>
            </div>
          </form>

          <button type="button" className="cancel-button" onClick={() => navigate(-1)} disabled={loading}>
            Cancelar
          </button>
        </div>
      </div>
    </div>
  );
}

export default EditUsuario;
