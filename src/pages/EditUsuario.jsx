import React, { useState, useEffect, useCallback } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import Nav from '../components/Nav.jsx';
import { FaSave } from 'react-icons/fa';
import { updateUser } from '../api/usersService.js';
import ToastNotification from '../components/ToastNotification.jsx';
//  IMPORTACIÓN DE SERVICIOS
import { getRoles } from '../api/rolesService.js';
import { getBarrios } from '../api/authService.js';


export default function EditUsuario() {
  const location = useLocation();
  const navigate = useNavigate();

  // 1️⃣ Obtén el usuario y su ID
  const usuarioEdit = location.state?.usuario;
  const userId = usuarioEdit?.id;

  // Redirige si no hay datos de usuario
  useEffect(() => {
    if (!usuarioEdit) {
      console.warn("No hay datos de usuario para editar. Redirigiendo.");
      navigate('/usuarios', { replace: true });
    }
  }, [usuarioEdit, navigate]);


  // 2️⃣ ESTADOS PRINCIPALES: Inicializados con la información actual del usuario
  const [usuarioData, setUsuarioData] = useState({
    // Datos básicos
    nombre_Completo: usuarioEdit?.nombre_Completo || '',
    apellido: usuarioEdit?.apellido || '',

    // Identificación
    tipo_Identificacion: usuarioEdit?.tipo_Identificacion || '',
    documento: usuarioEdit?.numero_Identificacion || '',

    // Contacto
    email: usuarioEdit?.correo || '',
    numeroContacto: usuarioEdit?.numero_Contacto || '',

    // Ubicación
    // Guardamos los IDs como String para inicializar correctamente el <select>
    Id_Barrio: usuarioEdit?.idBarrio ? String(usuarioEdit.idBarrio) : '',
    direccion: usuarioEdit?.direccion || '',

    // Perfil y Rol
    Id_Rol: usuarioEdit?.idRol ? String(usuarioEdit.idRol) : '',
    nombre_Usuario: usuarioEdit?.nombreUsuario || '',

    // Foto
    foto: usuarioEdit?.foto || '', // URL actual de la foto (Cloudinary)
    fotoFile: null, // Objeto File para subir
  });

  // 3️⃣ ESTADOS DE UI Y SERVICIO
  const [fotoPreview, setFotoPreview] = useState(usuarioEdit?.foto || '');
  const [menuCollapsed, setMenuCollapsed] = useState(false);
  const [successMessage, setSuccessMessage] = useState(null);
  const [errorMessage, setErrorMessage] = useState(null);
  const [loading, setLoading] = useState(false);

  // Estados para los dropdowns
  const [roles, setRoles] = useState([]);
  const [barrios, setBarrios] = useState([]);
  const [loadingOptions, setLoadingOptions] = useState(true);

  // Función de limpieza de URL (memoria)
  const cleanupPreview = useCallback(() => {
    if (fotoPreview && fotoPreview.startsWith('blob:')) {
      URL.revokeObjectURL(fotoPreview);
    }
  }, [fotoPreview]);


  // 4️⃣ Efecto para cargar roles y barrios de la API y limpiar la preview
  useEffect(() => {
    const fetchDropdownData = async () => {
      setLoadingOptions(true);
      try {
        const [fetchedRoles, fetchedBarrios] = await Promise.all([getRoles(), getBarrios()]);
        setRoles(fetchedRoles);
        setBarrios(fetchedBarrios);
      } catch (err) {
        console.error("Error al cargar roles o barrios:", err);
        setErrorMessage(err.message || "Error al cargar opciones de roles/barrios.");
      } finally {
        setLoadingOptions(false);
      }
    };
    fetchDropdownData();

    return () => {
      cleanupPreview(); // Limpia al desmontar
    };
  }, [cleanupPreview]);


  // 5️⃣ Handlers
  const toggleMenu = () => setMenuCollapsed(!menuCollapsed);

  const handleChange = (e) => {
    const { name, value, type, files } = e.target;

    if (type === 'file') {
      const file = files[0];
      cleanupPreview(); // Limpiar la URL de blob anterior

      if (file) {
        setFotoPreview(URL.createObjectURL(file));
        setUsuarioData(prev => ({ ...prev, fotoFile: file }));
      } else {
        // Si la selección se cancela, volvemos a la foto URL original
        setFotoPreview(usuarioData.foto);
        setUsuarioData(prev => ({ ...prev, fotoFile: null }));
      }
    } else {
      // Actualización general para todos los demás campos
      setUsuarioData(prev => ({ ...prev, [name]: value }));
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setSuccessMessage(null);
    setErrorMessage(null);

    if (!userId) {
      setErrorMessage("ID de usuario no encontrado.");
      setLoading(false);
      return;
    }

    try {
      // ⭐ CLAVE: Usamos FormData para enviar datos y, potencialmente, el archivo de la foto
      const formData = new FormData();

      // 🚨 CORRECCIÓN DE CASING: Usamos PascalCase para coincidir con el DTO de C#
      // DTO: NombreCompleto, Apellido, Tipo_Documento, Documento, etc.

      // Campos OBLIGATORIOS (texto/número)
      formData.append('NombreCompleto', usuarioData.nombre_Completo);
      formData.append('Apellido', usuarioData.apellido);
      formData.append('Tipo_Documento', usuarioData.tipo_Identificacion);
      formData.append('Documento', usuarioData.documento);
      formData.append('Email', usuarioData.email);
      formData.append('NumeroContacto', usuarioData.numeroContacto);
      formData.append('Direccion', usuarioData.direccion);
      formData.append('NombreUsuario', usuarioData.nombre_Usuario);

      // IDs opcionales (Solo se agregan si tienen un valor)
      if (usuarioData.Id_Barrio) {
        formData.append('Id_Barrio', usuarioData.Id_Barrio);
      }
      if (usuarioData.Id_Rol) {
        formData.append('Id_Rol', usuarioData.Id_Rol);
      }

      // Gestión de la Foto (para el backend C#)
      if (usuarioData.fotoFile) {
        // Si hay archivo nuevo, lo enviamos con la clave 'File' que C# espera
        formData.append('File', usuarioData.fotoFile);
      }
      else if (usuarioData.foto) {
        // Si NO hay archivo nuevo, enviamos la URL actual para que C# la conserve
        formData.append('Foto', usuarioData.foto);
      }


      // ⭐ Ejecutar la actualización con FormData.
      await updateUser(userId, formData);

      setSuccessMessage(`Usuario '${usuarioData.nombre_Usuario}' actualizado con éxito.`);

      setTimeout(() => {
        navigate('/usuarios', { state: { successMessage: `Usuario '${usuarioData.nombre_Usuario}' actualizado.` } });
      }, 1500);

    } catch (error) {
      console.error("Fallo al actualizar el usuario:", error);
      const detail = error.response?.data?.message || error.response?.data?.title || error.message;
      setErrorMessage(`Error al actualizar el usuario. Detalles: ${detail || "Revisa la consola."}`);
    } finally {
      setLoading(false);
    }
  };


  if (!usuarioEdit) {
    return null;
  }

  if (loadingOptions) {
    return (
      <div className="page-wrapper">
        <Nav menuCollapsed={menuCollapsed} toggleMenu={toggleMenu} />
        <div className={`main-content-area ${menuCollapsed ? 'expanded-margin' : ''}`}>
          <div className="loading-message">Cargando opciones de barrios y roles...</div>
        </div>
      </div>
    );
  }


  // 6️⃣ RENDERIZADO DEL FORMULARIO
  return (
    <div className="role-form-container">
      <Nav menuCollapsed={menuCollapsed} toggleMenu={toggleMenu} />

      <div className={`formulario-rol-main-content-area ${menuCollapsed ? 'expanded-margin' : ''}`}>
        <div className="formulario-roles">
          <h1 className="form-title">Editar Usuario 👩🏻‍💻 (ID: {userId})</h1>
          <p className="form-info">Modifica los datos del usuario. Solo los campos con asterisco (*) son obligatorios.</p>
          <br /><br />

          <form onSubmit={handleSubmit} className="role-form">

            {/* Campos de Nombre y Apellido */}
            <div className="form-group">
              <label htmlFor="nombre_Completo" className="label-heading">Nombre Completo:<span className="required-asterisk">*</span></label>
              <input
                id="nombre_Completo"
                name="nombre_Completo"
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
                  // ✅ CORRECCIÓN DE KEY DE RADIO BUTTONS
                  <div key={tipo}>
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
                  </div>
                ))}
              </div>
            </div>
            <div className="form-group">
              <label htmlFor="documento" className="label-heading">Numero de Identificación: <span className="required-asterisk">*</span></label>
              <input
                id="documento"
                name="documento"
                className="input-field"
                placeholder="Ingresar número de identificación"
                value={usuarioData.documento}
                onChange={handleChange}
                required
              />
            </div>

            {/* Correo y Celular */}
            <div className="form-group">
              <label htmlFor="email" className="label-heading">Correo Electrónico:<span className="required-asterisk">*</span></label>
              <input
                type="email"
                id="email"
                name="email"
                className="input-field"
                placeholder="Ingresar email@"
                value={usuarioData.email}
                onChange={handleChange}
                required
              />
            </div>
            <div className="form-group">
              <label htmlFor="numeroContacto" className="label-heading">Número de contacto:<span className="required-asterisk">*</span></label>
              <input
                id="numeroContacto"
                name="numeroContacto"
                className="input-field"
                placeholder="Ingresar número"
                value={usuarioData.numeroContacto}
                onChange={handleChange}
                required
              />
            </div>

            {/* Barrio (Opcional) y Dirección (Obligatoria) */}
            <div className="form-group">
              <label htmlFor="Id_Barrio" className="label-heading">Barrio: <span className="optional-label">(Opcional)</span></label>
              <select
                id="Id_Barrio"
                name="Id_Barrio"
                value={usuarioData.Id_Barrio || ''}
                onChange={handleChange}
                className="input-field"
              >
                {/* ⭐ CORRECCIÓN FINAL: Añadir key a la opción estática */}
                <option key="default-barrio" value="">Selecciona un Barrio:</option>
                {barrios.map(b => (
                  // ✅ Opción mapeada con key
                  <option key={b.id} value={String(b.id)}>
                    {b.nombre}
                  </option>
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

            {/* Rol (Opcional) y Nombre de Usuario (Obligatorio) */}
            <div className="form-group">
              <label htmlFor="Id_Rol" className="label-heading">Rol: <span className="optional-label">(Opcional)</span></label>
              <select
                id="Id_Rol"
                name="Id_Rol"
                value={usuarioData.Id_Rol || ''}
                onChange={handleChange}
                className="input-field"
              >
                <option key="default-rol" value="">Selecciona un Rol:</option>
                {roles.map((r) => (
                  <option key={r.id_Rol} value={String(r.id_Rol)}>
                    {r.nombre_Rol}
                  </option>
                ))}
              </select>
            </div>


            {/* Foto de perfil (Con previsualización de Cloudinary o Blob) */}
            <div className="form-group">
              <label className="label-heading">Foto de Perfil (opcional)</label>
              <div className="image-upload-container">

                <div className="photo-preview-wrapper">
                  {/* Muestra la previsualización (Blob URL o Cloudinary URL) */}
                  {fotoPreview && (
                    <img
                      src={fotoPreview}
                      alt="Previsualización"
                      className="foto-preview-large"
                      style={{ width: '120px', height: '120px', borderRadius: '50%', objectFit: 'cover' }}
                    />
                  )}
                </div>


                <label htmlFor="fotoFile" className="custom-file">
                  {fotoPreview ? 'Cambiar Foto ✅' : (usuarioData.foto ? 'Actualizar Foto' : 'Añadir Foto')}
                </label>
                <input
                  id="fotoFile"
                  name="fotoFile"
                  type="file"
                  accept="image/*"
                  style={{ display: 'none' }}
                  onChange={handleChange}
                />

                {/* Botón para Quitar la foto actual de Cloudinary (si existe) */}
                {usuarioData.foto && (
                  <button
                    type="button"
                    onClick={() => {
                      setUsuarioData(prev => ({ ...prev, foto: '', fotoFile: null }));
                      setFotoPreview(null);
                      cleanupPreview();
                    }}
                    className="remove-photo-button"
                    disabled={loading}
                  >
                   ❌ Quitar Foto Actual 
                  </button>
                )}
              </div>
            </div>

            {/* Botones */}
            <div className="form-buttons">
              <button type="button" className="cancel-button" onClick={() => navigate(-1)} disabled={loading}>Cancelar</button>
              <button type="submit" className="save-button" disabled={loading}>
                {loading ? 'Actualizando...' : <><FaSave style={{ marginRight: '8px' }} /> Actualizar Usuario</>}
              </button>
            </div>
          </form>
        </div>
      </div>

      {/* Notificaciones */}
      <ToastNotification
        message={successMessage}
        type="success"
        onClose={() => setSuccessMessage(null)}
      />
      <ToastNotification
        message={errorMessage}
        type="error"
        onClose={() => setErrorMessage(null)}
      />
    </div>
  );
}