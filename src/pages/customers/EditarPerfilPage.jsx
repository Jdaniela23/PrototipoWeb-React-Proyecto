import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { getMyProfile, updateMyProfile, getBarrios } from '../../api/authService';
import Nav from '../../components/customer/Nav';
import TopBar from '../../components/customer/TopBar';
import './EditarPerfilPage.css';
import { FaUserCircle, FaLock } from 'react-icons/fa';

function EditarPerfilPage() {
    const [profile, setProfile] = useState(null);
    const [barrios, setBarrios] = useState([]);
    const [newFile, setNewFile] = useState(null);
    const [isSaving, setIsSaving] = useState(false);
    const [successMsg, setSuccessMsg] = useState('');
    const [fieldErrors, setFieldErrors] = useState({});
    const [isSidebarCollapsed, setIsSidebarCollapsed] = useState(false);
    const [isDeletePhotoRequested, setIsDeletePhotoRequested] = useState(false);
    const navigate = useNavigate();

    const tipoDocumentoOptions = [
        { value: 'C.C', label: 'Cédula de Ciudadanía' },
        { value: 'T.I', label: 'Tarjeta de Identidad' },
        { value: 'C.E', label: 'Cédula de Extranjería' },
        { value: 'P.P', label: 'Pasaporte' },
    ];

    const toggleSidebar = () => setIsSidebarCollapsed(!isSidebarCollapsed);

    // -------------------- FETCH PROFILE Y BARRIOS --------------------
    useEffect(() => {
        let fotoPreviewUrl = null;

        const fetchData = async () => {
            try {
                const [profileData, barriosData] = await Promise.all([getMyProfile(), getBarrios()]);

                const barrioEncontrado = barriosData.find(
                    b => b.nombre.toLowerCase() === profileData.barrio?.toLowerCase()
                );

                const idBarrioInicial = barrioEncontrado
                    ? String(barrioEncontrado.id || barrioEncontrado.id_Barrio)
                    : '';

                setProfile({
                    nombreCompleto: profileData.nombreCompleto || '',
                    apellido: profileData.apellido || '',
                    nombreUsuario: profileData.nombreUsuario || '',
                    email: profileData.email || '',
                    numeroContacto: (profileData.numeroContacto || '').trim(),
                    documento: profileData.documento || '',
                    tipo_Documento: profileData.tipoDocumento || '',
                    direccion: profileData.direccion || '',
                    id_Barrio: idBarrioInicial,
                    foto: profileData.foto || '',
                    fotoPreview: null
                });

                setBarrios(barriosData);
            } catch (err) {
                console.error('Error cargando perfil o barrios:', err);
                setProfile({});
            }
        };

        fetchData();

        return () => {
            if (fotoPreviewUrl) URL.revokeObjectURL(fotoPreviewUrl);
        };
    }, []);

    // -------------------- HANDLE CHANGE --------------------
    const handleChange = (e) => {
        const { name, value } = e.target;

        if (name === 'documento') {
            if (!value) {
                setFieldErrors(prev => ({ ...prev, documento: 'El número de documento es obligatorio' }));
            } else if (!/^[0-9]+$/.test(value)) {
                setFieldErrors(prev => ({ ...prev, documento: 'El número de documento solo puede contener números' }));
            } else {
                setFieldErrors(prev => ({ ...prev, documento: undefined }));
            }
        } else if (name === 'nombreCompleto' || name === 'apellido') {
            if (!value) {
                setFieldErrors(prev => ({ ...prev, [name]: 'Este campo es obligatorio' }));
            } else if (/[^a-zA-ZáéíóúÁÉÍÓÚüÜñÑ\s]/.test(value)) {
                setFieldErrors(prev => ({ ...prev, [name]: 'Este campo no puede contener números ni símbolos' }));
            } else {
                setFieldErrors(prev => ({ ...prev, [name]: undefined }));
            }
        } else if (name === 'email') {
            const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
            if (!value) {
                setFieldErrors(prev => ({ ...prev, email: 'El correo es obligatorio' }));
            } else if (!emailRegex.test(value)) {
                setFieldErrors(prev => ({ ...prev, email: 'El correo no tiene un formato válido' }));
            } else {
                setFieldErrors(prev => ({ ...prev, email: undefined }));
            }
        } else if (name === 'numeroContacto') {
            if (!value) {
                setFieldErrors(prev => ({ ...prev, numeroContacto: 'El número de contacto es obligatorio' }));
            } else if (!/^[0-9]+$/.test(value)) {
                setFieldErrors(prev => ({ ...prev, numeroContacto: 'El número de contacto solo puede contener números y sin espacios' }));
            } else {
                setFieldErrors(prev => ({ ...prev, numeroContacto: undefined }));
            }
        }

        setProfile(prev => ({ ...prev, [name]: value }));
    };

    // -------------------- HANDLE FILE CHANGE --------------------
    const handleFileChange = (e) => {
        const file = e.target.files[0];

        if (profile.fotoPreview?.startsWith('blob:')) {
            URL.revokeObjectURL(profile.fotoPreview);
        }

        if (!file) {
            setNewFile(null);
            setProfile(p => ({ ...p, fotoPreview: null }));
            return;
        }

        const allowedTypes = ['image/jpeg', 'image/png', 'image/jpg'];
        if (!allowedTypes.includes(file.type)) {
            alert('Solo se permiten imágenes JPEG o PNG.');
            e.target.value = null;
            setNewFile(null);
            setProfile(p => ({ ...p, fotoPreview: null }));
            return;
        }

        setNewFile(file);
        setProfile(p => ({ ...p, fotoPreview: URL.createObjectURL(file) }));
    };

    // -------------------- HANDLE REMOVE PHOTO --------------------
    const handleRemovePhoto = () => {
        // Revocar URL blob si es una previsualización
        if (profile.fotoPreview?.startsWith('blob:')) {
            URL.revokeObjectURL(profile.fotoPreview);
        }

        if (profile.foto) {
            setIsDeletePhotoRequested(true);
        }
    
        setNewFile(null);
        setProfile(prev => ({
            ...prev,
            foto: null, // Esto simula el borrado
            fotoPreview: null
        }));
    };

    // -------------------- MAPEAR ERRORES DEL SERVIDOR --------------------
    const mapServerErrorMessage = (message) => {
        const errors = {};
        if (message.includes("correo electrónico ya está en uso")) errors.email = message;
        else if (message.includes("nombre de usuario ya está en uso")) errors.nombreUsuario = message;
        else if (message.includes("número de documento ya está registrado")) errors.documento = message;
        return Object.keys(errors).length > 0 ? errors : { general: message };
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setFieldErrors({});
        setSuccessMsg('');

        const errors = {};

        if (!profile.tipo_Documento) errors.tipo_Documento = 'Selecciona un tipo de documento';
        if (!profile.id_Barrio) errors.id_Barrio = 'Selecciona un barrio';
        if (!profile.nombreCompleto) errors.nombreCompleto = 'El nombre es obligatorio';
        if (!profile.apellido) errors.apellido = 'El apellido es obligatorio';
        if (!profile.documento) errors.documento = 'El número de documento es obligatorio';
        if (!profile.numeroContacto) errors.numeroContacto = 'El número de contacto es obligatorio';
        if (!profile.email) errors.email = 'El correo es obligatorio';
        if (!profile.nombreUsuario) errors.nombreUsuario = 'El nombre de usuario es obligatorio';

        // Validaciones de formato
        if (profile.nombreCompleto && /[^a-zA-ZáéíóúÁÉÍÓÚüÜñÑ\s]/.test(profile.nombreCompleto)) errors.nombreCompleto = 'El nombre no puede contener números ni símbolos';
        if (profile.apellido && /[^a-zA-ZáéíóúÁÉÍÓÚüÜñÑ\s]/.test(profile.apellido)) errors.apellido = 'El apellido no puede contener números ni símbolos';
        if (profile.documento && !/^[0-9]+$/.test(profile.documento)) errors.documento = 'El número de documento solo puede contener números';
        if (profile.numeroContacto && !/^[0-9]+$/.test(profile.numeroContacto)) errors.numeroContacto = 'El número de contacto solo puede contener números y sin espacios';
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (profile.email && !emailRegex.test(profile.email)) errors.email = 'El correo no tiene un formato válido';

        if (Object.keys(errors).length > 0) {
            setFieldErrors(errors);
            return;
        }

        setIsSaving(true);
        try {
            const formData = new FormData();
            // 1. LÓGICA DEL ARCHIVO (Subir/Reemplazar)
            if (newFile) {
                formData.append('File', newFile);
            }
            if (isDeletePhotoRequested && !newFile) {
                formData.append('DeleteFoto', 'true');
            }

            formData.append('NombreCompleto', profile.nombreCompleto);
            formData.append('Apellido', profile.apellido);
            formData.append('NombreUsuario', profile.nombreUsuario);
            formData.append('Email', profile.email);
            formData.append('NumeroContacto', profile.numeroContacto);
            formData.append('Documento', profile.documento);
            formData.append('Tipo_Documento', profile.tipo_Documento);
            formData.append('Direccion', profile.direccion);
            formData.append('Id_Barrio', profile.id_Barrio);

            await updateMyProfile(formData);
            setIsDeletePhotoRequested(false);

            setSuccessMsg('Perfil actualizado correctamente ✅');
            setFieldErrors({});

            const updatedProfile = await getMyProfile();
            setProfile(prev => ({
                ...prev,
                ...updatedProfile,
                foto: updatedProfile.foto || '',
                tipo_Documento: updatedProfile.tipoDocumento || '',
                id_Barrio: updatedProfile.id_Barrio ? String(updatedProfile.id_Barrio) : '',
                fotoPreview: null
            }));
            setNewFile(null);

            setTimeout(() => navigate('/pagecustomers'), 1000);
        } catch (err) {
            console.error(err);
            const serverMessage = err.response?.data?.message;
            if (serverMessage) {
                const mappedErrors = mapServerErrorMessage(serverMessage);
                if (mappedErrors.general) alert(`Error: ${mappedErrors.general}`);
                else setFieldErrors(mappedErrors);
            } else {
                alert(`Error: ${err.message || 'Error desconocido'}`);
            }
        } finally {
            setIsSaving(false);
        }
    };

    // -------------------- RENDER --------------------
    if (!profile) return <div className="loading-state">Cargando datos del perfil...</div>;

    return (
        <div className={`page-container ${isSidebarCollapsed ? 'sidebar-collapsed' : ''}`}>
            <Nav menuCollapsed={isSidebarCollapsed} toggleMenu={toggleSidebar} />
            <div className="content-wrapper">
                <TopBar
                    key={profile.foto || profile.nombreUsuario}
                    userName={profile.nombreUsuario || 'Cliente'}
                    foto={profile.foto || profile.fotoPreview || null}
                />

                <div className="editar-perfil-content centered-container">
                    <h2 className='titulo-editperfil'>Editar Perfil <FaUserCircle /></h2>
                    <p className='parrafo-customer'>Modifica la información que desees para mantener tu perfil actualizado ✅</p>

                    <form onSubmit={handleSubmit} className="editar-perfil-form">
                        {/* Campos de texto */}
                        <div className="form-row">
                            <label>Nombre: <span className="required-asterisk">*</span></label>
                            <input type="text" name="nombreCompleto" value={profile.nombreCompleto} onChange={handleChange} />
                            {fieldErrors.nombreCompleto && <p className="errores">{fieldErrors.nombreCompleto}</p>}
                        </div>

                        <div className="form-row">
                            <label>Apellido: <span className="required-asterisk">*</span></label>
                            <input type="text" name="apellido" value={profile.apellido} onChange={handleChange} />
                            {fieldErrors.apellido && <p className="errores">{fieldErrors.apellido}</p>}
                        </div>

                        <div className="form-row">
                            <label>Nombre de Usuario: <span className="required-asterisk">*</span></label>
                            <input type="text" name="nombreUsuario" value={profile.nombreUsuario} onChange={handleChange} />
                            {fieldErrors.nombreUsuario && <p className="errores">{fieldErrors.nombreUsuario}</p>}
                        </div>

                        <div className="form-row">
                            <label>Email: <span className="required-asterisk">*</span></label>
                            <input type="email" name="email" value={profile.email} onChange={handleChange} />
                            {fieldErrors.email && <p className="errores">{fieldErrors.email}</p>}
                        </div>

                        <div className="form-row">
                            <label>Número contacto: <span className="required-asterisk">*</span></label>
                            <input type="text" name="numeroContacto" value={profile.numeroContacto} onChange={handleChange} />
                            {fieldErrors.numeroContacto && <p className="errores">{fieldErrors.numeroContacto}</p>}
                        </div>

                        <div className="form-row">
                            <label>Documento: <span className="required-asterisk">*</span></label>
                            <input type="text" name="documento" value={profile.documento} onChange={handleChange} />
                            {fieldErrors.documento && <p className="errores">{fieldErrors.documento}</p>}
                        </div>

                        <div className="form-row">
                            <label>Tipo de Documento: <span className="required-asterisk">*</span></label>
                            <select name="tipo_Documento" value={profile.tipo_Documento} onChange={handleChange}>
                                <option value="">Selecciona tipo</option>
                                {tipoDocumentoOptions.map(opt => <option key={opt.value} value={opt.value}>{opt.label}</option>)}
                            </select>
                            {fieldErrors.tipo_Documento && <p className="errores">{fieldErrors.tipo_Documento}</p>}
                        </div>

                        <div className="form-row">
                            <label>Dirección: <span className="required-asterisk">*</span></label>
                            <input type="text" name="direccion" value={profile.direccion} onChange={handleChange} required />
                        </div>

                        <div className="form-row">
                            <label>Barrio: <span className="required-asterisk">*</span></label>
                            <select name="id_Barrio" value={profile.id_Barrio} onChange={handleChange} disabled={barrios.length === 0}>
                                <option value="">Selecciona un barrio</option>
                                {barrios.map(b => <option key={b.id} value={String(b.id)}>{b.nombre}</option>)}
                            </select>
                            {fieldErrors.id_Barrio && <p className="errores">{fieldErrors.id_Barrio}</p>}
                        </div>

                        {/* Bloque de foto de perfil */}
                        <div className="form-row">
                            <label>Foto de Perfil (Opcional):</label>
                            <input type="file" accept="image/*" onChange={handleFileChange} />
                        </div>

                        <div className="photo-preview-wrapper">
                            {profile.fotoPreview ? (
                                <img src={profile.fotoPreview} alt="Preview" className="foto-preview-large" />
                            ) : profile.foto ? (
                                <img src={profile.foto} alt="Foto de perfil" className="foto-preview-large" />
                            ) : (
                                null
                            )}

                            {(profile.foto || profile.fotoPreview) && (
                                <button type="button" onClick={handleRemovePhoto} className="btn-remove-photo-customer">
                                    Quitar foto
                                </button>
                            )}
                        </div>

                        {/* Botones de acción */}

                        <div className="form-actions">
                            {/* Contenedor para los botones secundarios/terciarios */}
                            <div className="secondary-actions">
                                <button type="button" className="cancel-button" onClick={() => navigate(-1)}>
                                    Cancelar
                                </button>
                                <button type="button" onClick={() => navigate('/passcustomers')} className="btn-secondary">
                                    Cambiar contraseña <FaLock />
                                </button>
                            </div>

                            {/* Botón principal (debe aparecer abajo) */}
                            <button type="submit" disabled={isSaving} className="btn-primary full-width-save">
                                {isSaving ? 'Guardando...' : 'Guardar cambios'}
                            </button>
                        </div>
                    
                        {successMsg && <p className="success-message">{successMsg}</p>}
                    </form>
                </div>
            </div>
        </div>
    );
}

export default EditarPerfilPage;
