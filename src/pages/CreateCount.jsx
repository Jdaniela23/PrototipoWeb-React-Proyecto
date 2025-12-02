import './CreateCount.css';
import React, { useState, useEffect } from 'react';
import miImagen from '../assets/img/imagen-principal.png';
import { FaEyeSlash, FaEye, FaHome } from 'react-icons/fa';
import { useNavigate, Link } from 'react-router-dom';
import { registerUser, getBarrios } from '../api/authService';
import Swal from 'sweetalert2';


// 🔒 Validación de contraseña fuerte 
const validatePassword = (password, confirm) => {
    const failed = [];
    if (!/.{8,}/.test(password)) failed.push("Debe tener al menos 8 caracteres.");
    if (!/[A-Z]/.test(password)) failed.push("Incluir mayúsculas.");
    if (!/[a-z]/.test(password)) failed.push("Incluir minúsculas.");
    if (!/[0-9]/.test(password)) failed.push("números.");
    if (!/[!@#$%^&*()_+\-=[\]{};':"\\|,.<>/?]/.test(password)) failed.push("caracteres especiales.");

    const errors = {
        contrasena: failed.length ? "• La contraseña debe: " + failed.join(" ") : "",
        confirmPassword: ""
    };

    if (password && confirm && password !== confirm) {
        errors.confirmPassword = "Las contraseñas no coinciden.";
    }

    return errors;
};


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
    const [confirmPassword, setConfirmPassword] = useState('');
    const [loading, setLoading] = useState(false);
    const [barrios, setBarrios] = useState([]);

    // ⭐ ESTADO DE ERRORES: Para manejar errores de frontend y duplicados de backend ⭐
    const [fieldErrors, setFieldErrors] = useState({
        contrasena: '',
        confirmPassword: '',
        documento: '', // Mapea a numeroIdentificacion
        correoElectronico: '',
        nombreUsuario: '',
    });

    // Carga de barrios al inicio
    useEffect(() => {
        const fetchBarrios = async () => {
            try {
                const data = await getBarrios();
                setBarrios(data);
            } catch (error) {
                console.error("Error al cargar barrios:", error);
            }
        };
        fetchBarrios();
    }, []);


    /* 👁️ Cambiar visibilidad contraseña */
    const togglePasswordVisibility = () => setShowPassword(!showPassword);

    /* 🖊️ Maneja cambios de inputs */
    const handleChange = (e) => {
        const { name, value, type, checked, files } = e.target;

        setFormData(prev => {
            let newFormData = { ...prev };

            if (type === 'checkbox') {
                newFormData[name] = checked;
            } else if (type === 'file') {
                const file = files[0];
                newFormData[name] = file || null;

                if (file) {
                    const reader = new FileReader();
                    reader.onloadend = () => setImagePreviewUrl(reader.result);
                    reader.readAsDataURL(file);
                } else {
                    setImagePreviewUrl(null);
                }
            } else {
                // El campo 'barrio' debe ser un número (Id_Barrio)
                newFormData[name] = name === 'barrio' ? Number(value) : value;
            }

            // Lógica de validación de contraseña/confirmación en tiempo real
            if (name === 'contrasena') {
                const errors = validatePassword(newFormData.contrasena, confirmPassword);
                setFieldErrors(prevErrors => ({
                    ...prevErrors,
                    contrasena: errors.contrasena,
                    confirmPassword: errors.confirmPassword
                }));
            } else {
                // Limpia el error de CUALQUIERA de los campos cuando se edita
                // Manejo especial para el campo de documento
                const errorKey = name === 'numeroIdentificacion' ? 'documento' : name;
                // Limpiamos los errores de correo, documento y usuario cuando se editan
                if (errorKey === 'correoElectronico' || errorKey === 'documento' || errorKey === 'nombreUsuario') {
                    // Solo limpiamos si el campo tenía un error previo del backend
                    setFieldErrors(prevErrors => {
                        if (prevErrors[errorKey]) {
                            return { ...prevErrors, [errorKey]: '' };
                        }
                        return prevErrors;
                    });
                }
            }

            return newFormData;
        });
    };

    /* 📌 Confirmar contraseña */
    const handleConfirmChange = (e) => {
        const value = e.target.value;
        setConfirmPassword(value);

        const errors = validatePassword(formData.contrasena, value);

        setFieldErrors(prevErrors => ({
            ...prevErrors,
            confirmPassword: errors.confirmPassword
        }));
    };

    /* 📤 Enviar formulario (VERSIÓN FINALIZADA) */
    const handleSubmit = async (e) => {
        e.preventDefault();

        // 1. Validaciones de Contraseña
        const errorsBeforeSubmit = validatePassword(formData.contrasena, confirmPassword);
        setFieldErrors(prev => ({
            ...prev,
            contrasena: errorsBeforeSubmit.contrasena,
            confirmPassword: errorsBeforeSubmit.confirmPassword
        }));

        if (errorsBeforeSubmit.contrasena || errorsBeforeSubmit.confirmPassword) {
            alert('Por favor, corrige los errores de contraseña.');
            return;
        }

        // Validación simple de campos requeridos
        if (!formData.tipoIdentificacion || !formData.numeroIdentificacion || !formData.correoElectronico ||
            !formData.nombre || !formData.apellido || !formData.celular || !formData.barrio ||
            !formData.direccion || !formData.nombreUsuario) {
            alert('Por favor, complete todos los campos obligatorios.');
            return;
        }

        if (!formData.aceptoCondiciones) {
            alert('Debes aceptar los términos y condiciones.');
            return;
        }

        setLoading(true);

        // 2. Crear FormData para la petición (Mapeando a los nombres que espera el backend)
        const formDataToSend = new FormData();
        formDataToSend.append('Nombre_Usuario', formData.nombreUsuario);
        formDataToSend.append('Email', formData.correoElectronico);
        formDataToSend.append('Password', formData.contrasena);
        formDataToSend.append('Nombre_Completo', formData.nombre);
        formDataToSend.append('Apellido', formData.apellido);
        formDataToSend.append('NumeroContacto', formData.celular);
        formDataToSend.append('Documento', formData.numeroIdentificacion);
        formDataToSend.append('Tipo_Documento', formData.tipoIdentificacion);
        formDataToSend.append('Direccion', formData.direccion);
        formDataToSend.append('Id_Rol', 2); // Asumiendo que 2 es el rol de cliente/usuario regular
        formDataToSend.append('Id_Barrio', formData.barrio);

        if (formData.fotoPerfil) {
            // El backend espera el nombre 'File' para el IFormFile
            formDataToSend.append('File', formData.fotoPerfil);
        }

        try {
            await registerUser(formDataToSend);

            Swal.fire({
                title: '¡Cuenta creada con éxito! 🎉',
                text: 'Serás redirigido al inicio de sesión en unos segundos.',
                icon: 'success',
                showConfirmButton: false,
                timer: 2500,
                timerProgressBar: true,
                iconColor: '#c89b3c'
            });

            navigate('/login');

        } catch (error) {

            // ⭐ 3. AJUSTE CRÍTICO: El mensaje ahora viene de error.message
            const backendMessage = error.message
                ? error.message
                : 'Hubo un problema al crear tu cuenta. Inténtalo de nuevo.';

            console.error('Error al registrar el usuario:', backendMessage);

            // ⭐ 4. Lógica para detectar errores de "ya en uso" mediante palabras clave ⭐
            const newErrors = {};
            let isErrorDetected = false;

            // Busca palabras clave que indiquen duplicado
            if (backendMessage.toLowerCase().includes('email') || backendMessage.toLowerCase().includes('correo')) {
                newErrors.correoElectronico = 'El correo electrónico ya está registrado. ❌';
                isErrorDetected = true;
            }
            if (backendMessage.toLowerCase().includes('documento') || backendMessage.toLowerCase().includes('identificacion')) {
                newErrors.documento = 'El Número de identificación ya está registrado. ❌';
                isErrorDetected = true;
            }
            if (backendMessage.toLowerCase().includes('usuario')) {
                newErrors.nombreUsuario = 'El nombre de usuario ya está en uso. ❌';
                isErrorDetected = true;
            }

            if (isErrorDetected) {
                // Si encontramos un error de campo repetido, actualizamos el estado y se muestra debajo del campo.
                setFieldErrors(prev => ({
                    ...prev,
                    ...newErrors,
                    // Mantenemos los errores de contraseña
                    contrasena: errorsBeforeSubmit.contrasena,
                    confirmPassword: errorsBeforeSubmit.confirmPassword
                }));
                // No mostramos alert, confiamos en la UI.
            } else {
                // Si el error NO es de campo repetido, mostramos el alert genérico con el mensaje del backend.
                alert(backendMessage);
            }

        } finally {
            setLoading(false);
        }
    };


    /* 🖼️ Texto dinámico del label de archivo */
    const fileLabel = formData.fotoPerfil ? `Archivo: ${formData.fotoPerfil.name}` : 'Foto de Perfil (opcional)';

    /* 🖥️ Render */
    return (
        <div className="registration-container">
            <div className="registration-form-section">
                <h2 className="welcome-title">¡Bienvenido!</h2>
                <h3 className="create-account-title">Crear una cuenta 👩🏻‍💻</h3>
                <hr />

                <form className="registration-form" onSubmit={handleSubmit}>

                    {/* Grid de campos organizados en 2 columnas */}
                    <div className="form-grid">

                        {/* Tipo de identificación */}
                        <div className="form-group">
                            <label className="label-heading">
                                Tipo de Identificación <span className="required-asterisk">*</span>
                            </label>
                            <p className='parrafo-explicacion-createcount'>Selecciona una de las opciones: </p>
                            <div className="identification-type-buttons">
                                {[
                                    { codigo: 'C.C', nombre: 'Cédula de Ciudadanía' },
                                    { codigo: 'T.I', nombre: 'Tarjeta de Identidad' },
                                    { codigo: 'C.E', nombre: 'Cédula de Extranjería' }, // ¡Nueva opción!
                                    { codigo: 'P.P', nombre: 'Pasaporte' }, // ¡Nueva opción!
                                ].map(({ codigo, nombre }) => (
                                    <React.Fragment key={codigo}>
                                        <input
                                            type="radio"
                                            id={codigo}
                                            name="tipoIdentificacion"
                                            value={codigo}
                                            // ⭐ Usamos formData.tipoIdentificacion para mantener consistencia ⭐
                                            checked={formData.tipoIdentificacion === codigo}
                                            onChange={handleChange}
                                            required
                                        />
                                        <label htmlFor={codigo} className="id-type-button" data-tooltip={nombre}>
                                            {codigo}
                                        </label>
                                    </React.Fragment>
                                ))}
                            </div>
                            {/* He quitado la línea {fieldErrors.tipoIdentificacion && <p className="error-message">{fieldErrors.tipoIdentificacion}</p>}
                                Ya que el campo radio es obligatorio y el error se maneja con la propiedad required de HTML.
                            */}

                        </div>

                        {/* Número de identificación - Columna 1 */}
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
                            {/* ⭐ ERROR DE DUPLICADO (Documento) ⭐ */}
                            {fieldErrors.documento && <p className="error-message">{fieldErrors.documento}</p>}
                        </div>

                        {/* Correo - Columna 2 */}
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
                            {/* ⭐ ERROR DE DUPLICADO (Correo) ⭐ */}
                            {fieldErrors.correoElectronico && <p className="error-message">{fieldErrors.correoElectronico}</p>}
                        </div>

                        {/* Nombre - Columna 1 */}
                        <div className="form-group">
                            <label htmlFor="nombre">Nombre: <span className="required-asterisk">*</span></label>
                            <input
                                id="nombre"
                                name="nombre"
                                className="nombre-create"
                                placeholder="Ingresar nombre "
                                value={formData.nombre}
                                onChange={handleChange}
                                required
                            />
                        </div>

                        {/* Apellido - Columna 2 */}
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

                        {/* Celular - Columna 1 */}
                        <div className="form-group">
                            <label htmlFor="celular">Número de Contacto: <span className="required-asterisk">*</span></label>
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

                        {/* Barrio - Columna 2 */}
                        <div className="form-group">
                            <label htmlFor="barrio">Barrio: <span className="required-asterisk">*</span></label>
                            <select
                                id="barrio"
                                name="barrio"
                                value={formData.barrio}
                                onChange={handleChange}
                                required
                                className="barrio-select"
                            >
                                <option value="">Selecciona un Barrio:</option>
                                {barrios.map(b => (
                                    <option key={b.id} value={b.id}>
                                        {b.nombre}
                                    </option>
                                ))}
                            </select>
                        </div>

                        {/* Dirección - Fila completa */}
                        <div className="form-group ">
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

                        {/* Nombre de usuario - Columna 1 */}
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
                            {/* ⭐ ERROR DE DUPLICADO (Nombre de Usuario) ⭐ */}
                            {fieldErrors.nombreUsuario && <p className="error-message">{fieldErrors.nombreUsuario}</p>}
                        </div>

                        {/* Foto de perfil - Columna 2 */}
                        <div className="form-group" >
                            <label htmlFor="fotoPerfil" className="file-upload-label">{fileLabel}</label>
                            <input id="fotoPerfil" name="fotoPerfil" type="file" accept="image/*" className="file-input" onChange={handleChange} />
                            {imagePreviewUrl && <img src={imagePreviewUrl} alt="preview" className="preview-image-create-count" />}
                        </div>

                        {/* Contraseña - Fila completa se pone full-width*/}
                        <div className="form-group ">
                            <label htmlFor="contrasena">Contraseña: <span className="required-asterisk">*</span></label>
                            <div style={{ position: 'relative' }}>
                                <input
                                    type={showPassword ? 'text' : 'password'}
                                    id="contrasena"
                                    className="nombre-create"
                                    name="contrasena"
                                    placeholder="Ingresar contraseña"
                                    value={formData.contrasena}
                                    onChange={handleChange}
                                    required
                                    style={{ paddingRight: '50px' }}
                                />
                                <span className="password-toggle-icon-count" onClick={togglePasswordVisibility}>
                                    {showPassword ? <FaEyeSlash color="black" /> : <FaEye color="black" />}
                                </span>
                            </div>
                            {/* Mantiene el error de fortaleza o el mensaje de guía */}
                            {fieldErrors.contrasena && <p className="password-validation-message error-message">{fieldErrors.contrasena}</p>}
                            {!fieldErrors.contrasena && <p className="password-validation-message">• La contraseña debe tener al menos 8 caracteres, incluir mayúsculas, minúsculas, números y caracteres especiales.</p>}
                        </div>

                        {/* Confirmar contraseña - Fila completa */}
                        <div className="form-group ">
                            <label>Confirmar contraseña: <span className="required-asterisk">*</span></label>
                            <input
                                type="password"
                                value={confirmPassword}
                                className="nombre-create"
                                onChange={handleConfirmChange}
                                required
                                placeholder="Repetir contraseña"
                            />
                            {/* Mantiene el error de coincidencia */}
                            {fieldErrors.confirmPassword && <p className="password-validation-message error-message">{fieldErrors.confirmPassword}</p>}
                        </div>

                    </div>

                    {/* Acepto condiciones - Fuera del grid */}
                    <div className="form-group checkbox-group full-width">
                        <input type="checkbox" id="aceptoCondiciones" name="aceptoCondiciones" checked={formData.aceptoCondiciones} onChange={handleChange} required />
                        <label htmlFor="aceptoCondiciones" className="checkbox-label">Acepto la política de privacidad <span className="required-asterisk">*</span></label>
                    </div>

                    {/* Botón - Fuera del grid */}
                    <div className="botones-container">
                        <button type="button" className="submit-regresar" onClick={() => { navigate('/login') }}>
                            ⬅️Regresar
                        </button>
                        <button type="submit" className="submit-button" disabled={loading}>
                            {loading ? 'Creando cuenta...' : 'Crear Cuenta'}
                        </button>
                    </div>

                </form>
            </div>
            <div className="derecha-con-imagen">
                <img src={miImagen} alt="Ilustración de bienvenida" />
                <div className="boton-createcount">
                    <Link to="/"><FaHome /></Link>
                </div>
            </div>
        </div>
    );
}