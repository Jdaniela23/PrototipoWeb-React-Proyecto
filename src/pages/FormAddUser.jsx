import React, { useState, useEffect } from 'react';
import './FormAdd.css';
import Nav from '../components/Nav.jsx';
import { useNavigate } from 'react-router-dom';
import { createNewUser } from '../api/usersService';
import { getBarrios } from '../api/authService';
import { getRoles } from '../api/rolesService';

const validatePassword = (password, confirm) => {
    const failed = [];
    if (/\s/.test(password)) failed.push("No debe contener espacios.");
    if (!/.{8,}/.test(password)) failed.push("Debe tener al menos 8 caracteres.");
    if (!/[A-Z]/.test(password)) failed.push("incluir mayúsculas.");
    if (!/[a-z]/.test(password)) failed.push("Incluir minúsculas.");
    if (!/[0-9]/.test(password)) failed.push("números.");
    if (!/[!@#$%^&*()_+\-=[\]{};':"\\|,.<>/?]/.test(password)) failed.push("carácteres especiales.");

    const errors = {
        passwordTemporal: failed.length ? failed.join(" ") : "",
        confirmarPasswordTemporal: ""
    };

    // Validar coincidencia
    if (password && confirm && password !== confirm) {
        errors.confirmarPasswordTemporal = "Las contraseñas no coinciden.";
    }

    return errors;
};

function FormAddUser() {
    const [menuCollapsed, setMenuCollapsed] = useState(false);
    const [showPassword, setShowPassword] = useState(false);
    const [message, setMessage] = useState({ text: '', type: '' });
    const [loading, setLoading] = useState(false);
    const [fieldErrors, setFieldErrors] = useState({});
    const [barriosList, setBarriosList] = useState([]);
    const [rolesList, setRolesList] = useState([]);
    const [imagePreviewUrl, setImagePreviewUrl] = useState(null);
    const navigate = useNavigate();

    const [userData, setUserData] = useState({
        tipoIdentificacion: '',
        documento: '',
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

    useEffect(() => {
        const loadData = async () => {
            try {
                const bData = await getBarrios();
                setBarriosList(Array.isArray(bData) ? bData : bData.data || []);
                const rData = await getRoles();
                setRolesList(Array.isArray(rData) ? rData : rData.data || []);
            } catch (error) {
                console.error("❌ Error al cargar datos:", error.message);
                showMessage(`Error al cargar datos: ${error.message}.`, 'error');
            }
        };
        loadData();
    }, []);

    const toggleMenu = () => setMenuCollapsed(!menuCollapsed);
    const togglePasswordVisibility = () => setShowPassword(!showPassword);

    const showMessage = (text, type) => {
        setMessage({ text, type });
        setTimeout(() => setMessage({ text: '', type: '' }), 5000);
    };

    const handleChange = (e) => {
        const { name, value, files } = e.target;


        let newValue = value; //Validación número documento
        if (name === 'documento') {
            // Permitir solo dígitos 
            newValue = value.replace(/[^0-9]/g, '');
        }

        setUserData(prev => {
            const newUserData = { ...prev, [name]: newValue };

            //Validaciones de contraseña/confirmación
            if (name === 'passwordTemporal' || name === 'confirmarPasswordTemporal') {
                const { passwordTemporal, confirmarPasswordTemporal } = newUserData;
                const errors = validatePassword(passwordTemporal, confirmarPasswordTemporal);

                // Actualizar los errores de ambos campos de contraseña/confirmación
                setFieldErrors(prevErrors => ({
                    ...prevErrors,
                    passwordTemporal: errors.passwordTemporal,
                    confirmarPasswordTemporal: errors.confirmarPasswordTemporal,
                }));
            } else {
                //  Limpia el error específico al modificar cualquier otro campo
                setFieldErrors(prev => ({ ...prev, [name]: null }));
            }

            return newUserData;
        });

        // Lógica para la imagen (separada para mejor manejo de archivos)
        if (name === 'fotoPerfil') {
            const file = files[0];
            if (file) {
                setUserData(prev => ({ ...prev, [name]: file }));
                const reader = new FileReader();
                reader.onloadend = () => setImagePreviewUrl(reader.result);
                reader.readAsDataURL(file);
            } else {
                setUserData(prev => ({ ...prev, [name]: null }));
                setImagePreviewUrl(null);
            }
        }
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);
        // 1. Validar Contraseña
        const passwordErrors = validatePassword(
            userData.passwordTemporal,
            userData.confirmarPasswordTemporal
        );

        //Validar otros campos obligatorios 
        const requiredFields = {
            tipoIdentificacion: 'Tipo de Identificación',
            documento: 'Número de Identificación',
            correoElectronico: 'Correo Electrónico',
            nombre: 'Nombre',
            apellido: 'Apellido',
            celular: 'Número de contacto',
            barrio: 'Barrio',
            direccion: 'Dirección',
            rol: 'Rol',
            nombreUsuario: 'Nombre de Usuario',
            passwordTemporal: 'Contraseña Temporal',
            confirmarPasswordTemporal: 'Confirmar Contraseña',
        };
        const numericErrors = {};
        const documentoValue = String(userData.documento).trim();
        const nombreValue = String(userData.nombre).trim();
        const apellidoValue = String(userData.apellido).trim();
        const celularValue = String(userData.celular || '').trim();

        // Si el campo documento tiene valor Y contiene cualquier cosa que NO sea un dígito
        if (documentoValue && /[^0-9]/.test(documentoValue)) {
            numericErrors.documento = 'El Número de Identificación solo debe contener dígitos (0-9).';
        }

        if (nombreValue && /[0-9]/.test(nombreValue)) { // Usamos solo /[0-9]/ para detectar números
            numericErrors.nombre = 'El Nombre no debe contener números.';
        } else if (nombreValue && /[^a-zA-ZñÑáéíóúÁÉÍÓÚ\s]/.test(nombreValue)) { //permite ñ y acentos
            numericErrors.nombre = 'El Nombre solo debe contener letras.';
        }

        // APELLIDO (Si contiene números, muestra error)
        if (apellidoValue && /[0-9]/.test(apellidoValue)) { // Usamos solo /[0-9]/ para detectar números
            numericErrors.apellido = 'El Apellido no debe contener números.';
        } else if (apellidoValue && /[^a-zA-ZñÑáéíóúÁÉÍÓÚ\s]/.test(apellidoValue)) {
            numericErrors.apellido = 'El Apellido solo debe contener letras .';
        }

        if (celularValue && /[^0-9]/.test(celularValue)) {
            numericErrors.celular = 'El Número solo debe contener dígitos (0-9) \nNo debe tener espacios.';
        }
        const emptyFieldErrors = {};
        Object.keys(requiredFields).forEach(key => {
            if (!userData[key] || String(userData[key]).trim() === '') {
                emptyFieldErrors[key] = `El campo ${requiredFields[key]} es obligatorio.`;
            }
        });

        const allErrors = {
            ...fieldErrors, // Mantener errores de validación de backend
            ...emptyFieldErrors,
            ...passwordErrors,
            ...numericErrors
        };

        // Filtrar solo los errores que tienen un mensaje (vacío = no error)
        const currentErrors = Object.keys(allErrors).reduce((acc, key) => {
            if (allErrors[key] && allErrors[key] !== '') {
                acc[key] = allErrors[key];
            }
            return acc;
        }, {});

        setFieldErrors(currentErrors);

        // Detener el envío si hay errores
        if (Object.keys(currentErrors).length > 0) {
            showMessage('Por favor, corrige los errores en el formulario antes de guardar.', 'error');
            setLoading(false);
            return;
        }

        try {
            console.log("🟢 Enviando datos al backend:", userData);
            const formData = new FormData();
            formData.append('Tipo_Documento', userData.tipoIdentificacion);
            formData.append('Documento', userData.documento);
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
            navigate('/usuarios', {
                state: {
                    successMessage: `Usuario ${nuevoUsuario.nombre_Usuario || userData.nombreUsuario} creado exitosamente ✅`
                }
            });

        } catch (error) {
            console.error('Error al crear usuario:', error);

            const backendMessage =
                error.response?.data?.message ||
                (typeof error.response?.data === 'string' ? error.response.data : '') ||
                error.message ||
                "";

            console.log("📩 Mensaje del backend:", backendMessage);

            const newErrors = {};

            // Detección flexible de errores de backend
            if (backendMessage.toLowerCase().includes('email')) {
                newErrors.correoElectronico = 'El correo electrónico ya está registrado.';
            }
            if (backendMessage.toLowerCase().includes('documento')) {
                newErrors.documento = 'El Numero de documento ya está registrado.';
            }
            if (backendMessage.toLowerCase().includes('usuario')) {
                newErrors.nombreUsuario = 'El nombre de usuario ya está en uso.';
            }

            if (Object.keys(newErrors).length > 0) {
                setFieldErrors(prev => ({ ...prev, ...newErrors }));
            } else {
                showMessage('Ocurrió un error al registrar el usuario.', 'error');
            }

            setLoading(false);
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
                    <p className="form-info">
                        Información para registrar usuarios, selecciona un tipo de rol y guarda el usuario.
                    </p><br /><br />

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
                                            id={codigo}
                                            name="tipoIdentificacion"
                                            value={codigo}
                                            checked={userData.tipoIdentificacion === codigo}
                                            onChange={handleChange}

                                        />
                                        <label htmlFor={codigo} className="id-type-button" data-tooltip={nombre}>
                                            {codigo}
                                        </label>
                                    </React.Fragment>
                                ))}
                            </div>
                            {fieldErrors.tipoIdentificacion && <p className="error-message-rol">{fieldErrors.tipoIdentificacion}</p>}
                        </div>

                        {/* Número de Identificación */}
                        <div className="form-group">
                            <label htmlFor="documento" className="label-heading">
                                Número de Identificación: <span className="required-asterisk">*</span>
                            </label>
                            <input
                                id="documento"
                                name="documento"  // Deben coincidir con userData.documento
                                className="input-field"
                                placeholder="Ingresar número de identificación"
                                value={userData.documento}
                                onChange={handleChange}
                                required
                                type='text'
                            />
                            {fieldErrors.documento && (
                                <p className="error-message-rol">{fieldErrors.documento}</p>
                            )}
                        </div>


                        {/* Nombre */}
                        <div className="form-group">
                            <label htmlFor="nombre" className="label-heading">Nombre: <span className="required-asterisk">*</span></label>
                            <input
                                id="nombre"
                                name="nombre"
                                className="input-field"
                                placeholder="Ingresar nombre"
                                value={userData.nombre}
                                onChange={handleChange}
                                required
                            />
                            {fieldErrors.nombre && <p className="error-message-rol">{fieldErrors.nombre}</p>}
                        </div>

                        {/* Apellido */}
                        <div className="form-group">
                            <label htmlFor="apellido" className="label-heading">Apellido: <span className="required-asterisk">*</span></label>
                            <input
                                id="apellido"
                                name="apellido"
                                className="input-field"
                                placeholder="Ingresar apellidos"
                                value={userData.apellido}
                                onChange={handleChange}
                                required
                            />
                            {fieldErrors.apellido && <p className="error-message-rol">{fieldErrors.apellido}</p>}
                        </div>

                        {/* Correo */}
                        <div className="form-group">
                            <label htmlFor="correoElectronico" className="label-heading">
                                Correo electrónico: <span className="required-asterisk">*</span>
                            </label>
                            <input
                                type="email"
                                id="correoElectronico"
                                name="correoElectronico"
                                className="input-field"
                                placeholder="Ingresar email@"
                                value={userData.correoElectronico}
                                onChange={handleChange}
                                required
                            />
                            {fieldErrors.correoElectronico && <p className="error-message-rol">{fieldErrors.correoElectronico}</p>}
                        </div>

                        {/* Celular */}
                        <div className="form-group">
                            <label htmlFor="celular" className="label-heading">
                                Número de contacto: <span className="required-asterisk">*</span>
                            </label>
                            <input
                                id="celular"
                                name="celular"
                                className="input-field"
                                placeholder="Ingresar número"
                                value={userData.celular}
                                onChange={handleChange}
                                required
                            />
                            {fieldErrors.celular && (
                                <p className="error-message-rol">
                                    {fieldErrors.celular.split('\n').map((line, index, array) => (
                                        <React.Fragment key={index}>
                                            {line}
                                            {/*  <br /> solo si no es la última línea */}
                                            {index < array.length - 1 && <br />}
                                        </React.Fragment>
                                    ))}
                                </p>
                            )}
                        </div>

                        {/* Barrio */}
                        <div className="form-group">
                            <label htmlFor="barrio" className="label-heading">
                                Barrio: <span className="required-asterisk">*</span>
                            </label>
                            <select
                                id="barrio"
                                name="barrio"
                                className="input-field"
                                value={userData.barrio}
                                onChange={handleChange}
                                required
                            >
                                <option value="">Selecciona un Barrio:</option>
                                {barriosList.map(b => (
                                    <option key={b.id} value={String(b.id)}>{b.nombre}</option>
                                ))}
                            </select>
                            {fieldErrors.barrio && <p className="error-message-rol">{fieldErrors.barrio}</p>}
                        </div>

                        {/* Dirección */}
                        <div className="form-group">
                            <label htmlFor="direccion" className="label-heading">
                                Dirección: <span className="required-asterisk">*</span>
                            </label>
                            <input
                                id="direccion"
                                name="direccion"
                                className="input-field"
                                placeholder="Ingresar dirección"
                                value={userData.direccion}
                                onChange={handleChange}
                                required
                            />
                            {fieldErrors.direccion && <p className="error-message-rol">{fieldErrors.direccion}</p>}
                        </div>

                        {/* Rol */}
                        <div className="form-group">
                            <label htmlFor="rol" className="label-heading">Rol: <span className="required-asterisk">*</span></label>
                            <select
                                id="rol"
                                name="rol"
                                className="input-field"
                                value={userData.rol}
                                onChange={handleChange}
                                required
                            >
                                <option value="">Selecciona el rol</option>
                                {rolesList.map(r => (
                                    <option key={r.id_Rol} value={String(r.id_Rol)}>{r.nombre_Rol}</option>
                                ))}
                            </select>
                            {fieldErrors.rol && <p className="error-message">{fieldErrors.rol}</p>}
                        </div>

                        {/* Nombre de Usuario */}
                        <div className="form-group">
                            <label htmlFor="nombreUsuario" className="label-heading">
                                Nombre de Usuario: <span className="required-asterisk">*</span>
                            </label>
                            <input
                                id="nombreUsuario"
                                name="nombreUsuario"
                                className="input-field"
                                placeholder="Ingresar nombre de usuario"
                                value={userData.nombreUsuario}
                                onChange={handleChange}
                                required
                            />
                            {fieldErrors.nombreUsuario && <p className="error-message-rol">{fieldErrors.nombreUsuario}</p>}
                        </div>

                        {/* Contraseña */}
                        <div className="form-group password-group">
                            <label htmlFor="passwordTemporal" className="label-heading">
                                Contraseña Temporal: <span className="required-asterisk">*</span>
                            </label>
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
                            {fieldErrors.passwordTemporal && <p className="error-message">{fieldErrors.passwordTemporal}</p>}
                        </div>

                        {/* Confirmar Contraseña */}
                        <div className="form-group password-group">
                            <label htmlFor="confirmarPasswordTemporal" className="label-heading">
                                Confirmar Contraseña: <span className="required-asterisk">*</span>
                            </label>
                            <input
                                id="confirmarPasswordTemporal"
                                name="confirmarPasswordTemporal"
                                placeholder="Confirmar contraseña"
                                value={userData.confirmarPasswordTemporal}
                                onChange={handleChange}
                                type={showPassword ? 'text' : 'password'}
                                required
                                className="input-field"
                            />
                            <span onClick={togglePasswordVisibility} className="password-toggle">
                                {showPassword ? '👁️' : '🔒'}
                            </span>
                            {fieldErrors.confirmarPasswordTemporal && <p className="error-message">{fieldErrors.confirmarPasswordTemporal}</p>}
                        </div>

                        {/* Foto */}
                        <div className="form-group full-width">
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

                        <div className="form-buttons">
                            <button type="submit" className="save-button" disabled={loading}>
                                {loading ? 'Guardando...' : 'Guardar Usuario'}
                            </button>
                        </div>
                    </form>

                    <button type="button" className="cancel-button" onClick={() => navigate(-1)}>
                        Cancelar
                    </button>
                </div>
            </div>
        </div>
    );
}

export default FormAddUser;