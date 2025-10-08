import React, { useState, useEffect } from 'react';
import './FormAdd.css';
import Nav from '../components/Nav.jsx';
import { useNavigate } from 'react-router-dom';

// Servicios
import { createNewUser } from '../api/usersService';
import { getBarrios } from '../api/authService';
import { getRoles } from '../api/rolesService';

function FormAddUser() {
    const [menuCollapsed, setMenuCollapsed] = useState(false);
    const [showPassword, setShowPassword] = useState(false);
    const [message, setMessage] = useState({ text: '', type: '' });
    const [loading, setLoading] = useState(false); // 👈 estado para el botón
    const navigate = useNavigate();

    const [barriosList, setBarriosList] = useState([]);
    const [rolesList, setRolesList] = useState([]);

    const [userData, setUserData] = useState({
        tipoIdentificacion: '',
        numeroIdentificacion: '',
        correoElectronico: '',
        nombre: '',
        apellido: '',
        celular: '',
        barrio: '',
        direccion: '',
        rol: '',
        nombreUsuario: '',
        passwordTemporal: '',
        confirmarPasswordTemporal: '',
        fotoPerfil: null,
    });

    const [imagePreviewUrl, setImagePreviewUrl] = useState(null);

    // Cargar barrios y roles
    useEffect(() => {
        const loadData = async () => {
            try {
                const bData = await getBarrios();
                setBarriosList(Array.isArray(bData) ? bData : bData.data || []);

                const rData = await getRoles();
                setRolesList(Array.isArray(rData) ? rData : rData.data || []);
            } catch (error) {
                console.error("❌ Error al cargar datos de API:", error.message);
                showMessage(`Error al cargar datos: ${error.message}.`, 'error');
            }
        };
        loadData();
    }, []);

    const toggleMenu = () => { setMenuCollapsed(!menuCollapsed); };
    const togglePasswordVisibility = () => { setShowPassword(!showPassword); };
    const showMessage = (text, type) => {
        setMessage({ text, type });
        setTimeout(() => setMessage({ text: '', type: '' }), 5000);
    };

    const handleChange = (e) => {
        const { name, value, files } = e.target;

        if (name === 'fotoPerfil') {
            const file = files[0];
            if (file) {
                setUserData(prev => ({ ...prev, [name]: file }));
                const reader = new FileReader();
                reader.onloadend = () => { setImagePreviewUrl(reader.result); };
                reader.readAsDataURL(file);
            } else {
                setUserData(prev => ({ ...prev, [name]: null }));
                setImagePreviewUrl(null);
            }
        } else {
            setUserData(prev => ({ ...prev, [name]: value }));
        }
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);
        const requiredFields = [
            'tipoIdentificacion', 'numeroIdentificacion', 'correoElectronico',
            'nombre', 'apellido', 'celular', 'barrio', 'direccion', 'rol',
            'nombreUsuario', 'passwordTemporal', 'confirmarPasswordTemporal'
        ];

        const missingField = requiredFields.find(field => !userData[field]);
        if (missingField) {
            const friendlyName = missingField.replace(/([A-Z])/g, ' $1').toLowerCase();
            showMessage(`El campo '${friendlyName}' es obligatorio.`, 'error');
            return;
        }

        if (userData.passwordTemporal !== userData.confirmarPasswordTemporal) {
            showMessage('Las contraseñas no coinciden.', 'error');
            return;
        }

        try {

            const formData = new FormData();
            formData.append('Tipo_Documento', userData.tipoIdentificacion);
            formData.append('Documento', userData.numeroIdentificacion);
            formData.append('Email', userData.correoElectronico);
            formData.append('Nombre_Completo', userData.nombre);
            formData.append('Apellido', userData.apellido);
            formData.append('NumeroContacto', userData.celular);
            formData.append('Direccion', userData.direccion);
            formData.append('Id_Barrio', Number(userData.barrio));
            formData.append('Id_Rol', Number(userData.rol));
            formData.append('Nombre_Usuario', userData.nombreUsuario);
            formData.append('Password', userData.passwordTemporal);
            if (userData.fotoPerfil) {
                formData.append('File', userData.fotoPerfil);
            }


            const nuevoUsuario = await createNewUser(formData);

            // 📌 Navegar a /usuarios con mensaje de éxito
            navigate('/usuarios', {
                state: {
                    successMessage: `Usuario ${nuevoUsuario.nombre_Usuario || userData.nombreUsuario} creado exitosamente `
                }
            });

        } catch (error) {
            console.error('Error al agregar usuario:', error);
            showMessage(`Error al guardar: ${error.message} ❌`, 'error');
        } finally {
            setLoading(false); // 👈 resetear estado
        }
    };

    return (
        <div className="role-form-container">
            <Nav menuCollapsed={menuCollapsed} toggleMenu={toggleMenu} />

            <div className={`formulario-rol-main-content-area ${menuCollapsed ? 'expanded-margin' : ''}`}>
                {message.text && (
                    <div className={`form-message ${message.type}`}>
                        {message.text}
                    </div>
                )}
                <div className="formulario-roles">
                    <h1 className="form-title">Registro de Usuarios</h1>
                    <p className="form-info">Información para registrar usuarios, selecciona un tipo de rol y guarda el usuario.</p><br /><br />

                    <form onSubmit={handleSubmit} className="role-form">

                        {/* Tipo de identificación */}
                        <div className="form-group">
                            <label className="label-heading">Tipo de Identificación<span className="required-asterisk">*</span></label>
                            <div className="identification-type-buttons">
                                {['C.C', 'T.I'].map((tipo) => (
                                    <React.Fragment key={tipo}>
                                        <input
                                            type="radio"
                                            id={tipo}
                                            name="tipoIdentificacion"
                                            value={tipo}
                                            checked={userData.tipoIdentificacion === tipo}
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
                            <label htmlFor="numeroIdentificacion" className="label-heading">Numero de Identificación: <span className="required-asterisk">*</span></label>
                            <input
                                id="numeroIdentificacion"
                                name="numeroIdentificacion"
                                className="input-field"
                                placeholder="Ingresar número de identificación"
                                value={userData.numeroIdentificacion}
                                onChange={handleChange}
                                required
                            />
                        </div>

                        {/* Correo electrónico */}
                        <div className="form-group">
                            <label htmlFor="correoElectronico">Correo electrónico: <span className="required-asterisk">*</span></label>
                            <input
                                type="email"
                                id="correoElectronico"
                                name="correoElectronico"
                                placeholder="Ingresar email@"
                                value={userData.correoElectronico}
                                onChange={handleChange}
                                required
                                className='input-field'
                            />
                        </div>

                        {/* Nombre */}
                        <div className="form-group">
                            <label htmlFor="nombre" className="label-heading">Nombre:<span className="required-asterisk">*</span></label>
                            <input
                                id="nombre"
                                name="nombre"
                                className="input-field"
                                placeholder="Ingresar nombre"
                                value={userData.nombre}
                                onChange={handleChange}
                                required
                            />
                        </div>

                        {/* Apellido */}
                        <div className="form-group">
                            <label htmlFor="apellido" className="label-heading">Apellido:<span className="required-asterisk">*</span></label>
                            <input
                                id="apellido"
                                name="apellido"
                                className="input-field"
                                placeholder="Ingresar apellidos"
                                value={userData.apellido}
                                onChange={handleChange}
                                required
                            />
                        </div>

                        {/* Celular */}
                        <div className="form-group">
                            <label htmlFor="celular" className="label-heading">Número de contacto:<span className="required-asterisk">*</span></label>
                            <input
                                id="celular"
                                name="celular"
                                className="input-field"
                                placeholder="Ingresar número"
                                value={userData.celular}
                                onChange={handleChange}
                                required
                            />
                        </div>

                        {/* Barrio */}
                        <div className="form-group">
                            <label htmlFor="barrio">Barrio: <span className="required-asterisk">*</span></label>
                            <select
                                id="barrio"
                                name="barrio"
                                value={userData.barrio}
                                onChange={handleChange}
                                required
                                className="input-field"
                            >
                                <option value="">Selecciona un Barrio:</option>
                                {barriosList.map(b => (
                                    <option key={b.id} value={String(b.id)}>
                                        {b.nombre}
                                    </option>
                                ))}
                            </select>
                        </div>

                        {/* Dirección */}
                        <div className="form-group">
                            <label htmlFor="direccion" className="label-heading">Dirección:<span className="required-asterisk">*</span></label>
                            <input
                                id="direccion"
                                name="direccion"
                                className="input-field"
                                placeholder="Ingresar dirección"
                                value={userData.direccion}
                                onChange={handleChange}
                                required
                            />
                        </div>

                        {/* Rol */}
                        <div className="form-group">
                            <label htmlFor="rol" className="label-heading">Rol:<span className="required-asterisk">*</span></label>
                            <select
                                id="rol"
                                name="rol"
                                value={userData.rol}
                                onChange={handleChange}
                                required
                                className="input-field"
                            >
                                <option value="">Selecciona el rol</option>
                                {rolesList.map(r => (
                                    <option key={r.id_Rol} value={String(r.id_Rol)}>
                                        {r.nombre_Rol}
                                    </option>
                                ))}
                            </select>
                        </div>

                        {/* Nombre de Usuario */}
                        <div className="form-group">
                            <label htmlFor="nombreUsuario" className="label-heading">Nombre de Usuario:<span className="required-asterisk">*</span></label>
                            <input
                                id="nombreUsuario"
                                name="nombreUsuario"
                                className="input-field"
                                placeholder="Ingresar nombre de usuario"
                                value={userData.nombreUsuario}
                                onChange={handleChange}
                                required
                            />
                        </div>

                        {/* Contraseña Temporal */}
                        <div className="form-group password-group">
                            <label htmlFor="passwordTemporal" className="label-heading">Contraseña Temporal:<span className="required-asterisk">*</span></label>
                            <input
                                id="passwordTemporal"
                                name="passwordTemporal"
                                placeholder="Ingresar contraseña temporal"
                                value={userData.passwordTemporal}
                                onChange={handleChange}
                                type={showPassword ? 'text' : 'password'}
                                required
                                className="input-field"
                            />
                            <span onClick={togglePasswordVisibility} className="password-toggle">
                                {showPassword ? '👁️' : '🔒'}
                            </span>
                        </div>

                        {/* Confirmación de Contraseña Temporal */}
                        <div className="form-group password-group">
                            <label htmlFor="confirmarPasswordTemporal" className='label-heading'>Confirmar Contraseña:<span className="required-asterisk">*</span></label>
                            <input
                                id="confirmarPasswordTemporal"
                                name="confirmarPasswordTemporal"
                                placeholder="Confirmar contraseña temporal"
                                value={userData.confirmarPasswordTemporal}
                                onChange={handleChange}
                                type={showPassword ? 'text' : 'password'}
                                required
                                className="input-field"
                            />
                            <span onClick={togglePasswordVisibility} className="password-toggle">
                                {showPassword ? '👁️' : '🔒'}
                            </span>
                        </div>

                        {/* Foto de perfil */}
                        <div className="form-group">
                            <label htmlFor="fotoPerfil" className="label-heading">Foto de Perfil (opcional)</label>
                            <input
                                id="fotoPerfil"
                                name="fotoPerfil"
                                type="file"
                                accept="image/*"
                                onChange={handleChange}
                                style={{ display: 'none' }}
                            />
                            <label htmlFor="fotoPerfil" className="custom-file">
                                {imagePreviewUrl ? 'Cambiar Foto' : 'Subir Foto ✅'}
                            </label>
                            {imagePreviewUrl && (
                                <img src={imagePreviewUrl} alt="Previsualización" className="preview-image" />
                            )}
                        </div>

                        {/* Botones */}
                        <div className="form-buttons">
                            <button type="button" className="cancel-button" onClick={() => navigate(-1)}>Cancelar</button>
                            <button type="submit" className="save-button" disabled={loading}>
                                {loading ? 'Guardando...' : 'Guardar Usuario'}
                            </button>
                        </div>
                    </form>
                </div>
            </div>
        </div>
    );
}

export default FormAddUser;
