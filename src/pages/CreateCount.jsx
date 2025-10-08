import './CreateCount.css';
import React, { useState, useEffect } from 'react';
import miImagen from '../assets/img/imagen-principal.png';
import { FaEyeSlash, FaEye, FaHome } from 'react-icons/fa';
import { useNavigate, Link } from 'react-router-dom';
import { registerUser, getBarrios } from '../api/authService';


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
        barrio: '', // Guardará el ID del barrio
        direccion: '',
        nombreUsuario: '',
        contrasena: '',
        fotoPerfil: null, // Será el objeto File
        aceptoCondiciones: false,
    });

    /* ▶️ Estados auxiliares */
    const [imagePreviewUrl, setImagePreviewUrl] = useState(null);
    const [showPassword, setShowPassword] = useState(false);
    const [passwordError, setPasswordError] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');
    const [confirmError, setConfirmError] = useState('');
    const [loading, setLoading] = useState(false);
    const [barrios, setBarrios] = useState([]); // Estado para guardar la lista de los barrios 

    // ⭐ El useEffect para cargar los barrios al inicio ⭐
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

        if (type === 'checkbox') {
            setFormData(prev => ({ ...prev, [name]: checked }));
        } else if (type === 'file') {
            const file = files[0];
            if (file) {
                setFormData(prev => ({ ...prev, [name]: file }));
                const reader = new FileReader();
                reader.onloadend = () => setImagePreviewUrl(reader.result);
                reader.readAsDataURL(file); // Usado solo para la vista previa
            } else {
                setFormData(prev => ({ ...prev, [name]: null }));
                setImagePreviewUrl(null);
            }
        } else {
            setFormData(prev => ({
                ...prev,
                // Convertir el ID del barrio a número si el nombre del campo es 'barrio'
                [name]: name === 'barrio' ? Number(value) : value
            }));
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
            /.{8,}/,            // 8+ caracteres
            /[A-Z]/,            // mayúscula
            /[a-z]/,            // minúscula
            /[0-9]/,            // número
            /[!@#$%^&*()_+\-=[\]{};':"\\|,.<>/?]/ // especial
        ];
        return tests.every(t => t.test(pwd));
    };

    /* 📤 Enviar formulario (CORREGIDO) */
    const handleSubmit = async (e) => {
        e.preventDefault();

        // 1. Validaciones
        if (!validatePassword(formData.contrasena)) {
            setPasswordError('• La contraseña debe tener al menos 8 caracteres, incluir mayúsculas, minúsculas, números y caracteres especiales.');
            return;
        }

        if (formData.contrasena !== confirmPassword) {
            setConfirmError('Las contraseñas no coinciden');
            return;
        }

        if (!formData.aceptoCondiciones) {
            alert('Debes aceptar los términos y condiciones.');
            return;
        }

        setLoading(true);

        // ⭐ INICIO DEL CAMBIO: USAR FORM DATA PARA ENVIAR EL ARCHIVO ⭐
        const formDataToSend = new FormData();

        // Mapeo de datos al formato de C# (RegisterRequestDto)
        formDataToSend.append('Nombre_Usuario', formData.nombreUsuario);
        formDataToSend.append('Email', formData.correoElectronico);
        formDataToSend.append('Password', formData.contrasena);
        formDataToSend.append('Nombre_Completo', formData.nombre);
        formDataToSend.append('Apellido', formData.apellido);
        formDataToSend.append('NumeroContacto', formData.celular);
        formDataToSend.append('Documento', formData.numeroIdentificacion);
        formDataToSend.append('Tipo_Documento', formData.tipoIdentificacion);
        formDataToSend.append('Direccion', formData.direccion);
        formDataToSend.append('Id_Rol', 2); // Asumiendo que el rol 2 es para Clientes

        // Asegurarse de que el barrio sea un número, si está seleccionado
        if (formData.barrio) {
            formDataToSend.append('Id_Barrio', formData.barrio);
        } else {
            // Manejar si el barrio es requerido y no está seleccionado
            setLoading(false);
            alert("Debe seleccionar un barrio.");
            return;
        }

        // ⭐ EL CAMPO DE ARCHIVO CRÍTICO: Debe llamarse 'File' para coincidir con C#
        if (formData.fotoPerfil) {
            formDataToSend.append('File', formData.fotoPerfil);
        }
        // ⭐ FIN DEL CAMBIO ⭐

        try {
            // ⭐ Petición POST a tu API enviando el objeto FormData ⭐
            const response = await registerUser(formDataToSend);

            console.log('Respuesta de la API:', response.data);
            alert('¡Cuenta creada correctamente! Serás redirigido al inicio de sesión.');

            navigate('/login');

        } catch (error) {
            console.error('Error al registrar el usuario:', error.response ? error.response.data : error.message);

            const errorMessage = error.response && error.response.data.message
                ? error.response.data.message
                : 'Hubo un problema al crear tu cuenta. Inténtalo de nuevo.';
            alert(errorMessage);
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

                        {/* Tipo de identificación  */}
                        <div className="form-group ">
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

                        {/* Dirección - Fila completa:  se pone full-width al lado de form-group */}
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
                        </div>

                        {/* Foto de perfil - Columna 2 */}
                        <div className="form-group "    >
                            <label htmlFor="fotoPerfil" className="file-upload-label">{fileLabel}</label>
                            <input id="fotoPerfil" name="fotoPerfil" type="file" accept="image/*" className="file-input" onChange={handleChange} />
                            {imagePreviewUrl && <img src={imagePreviewUrl} alt="preview" className="preview-image-create-count" />}
                        </div>

                        {/* Contraseña - Fila completa (por el ícono y validación) */}
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
                            {passwordError && <p className="password-validation-message error-message">{passwordError}</p>}
                            {!passwordError && <p className="password-validation-message">• La contraseña debe tener al menos 8 caracteres, incluir mayúsculas, minúsculas, números y caracteres especiales.</p>}
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
                            {confirmError && <p className="password-validation-message error-message">{confirmError}</p>}
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