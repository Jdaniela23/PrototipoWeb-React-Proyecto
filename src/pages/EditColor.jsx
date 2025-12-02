import React, { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import Nav from '../components/Nav.jsx';
import { FaSave } from 'react-icons/fa';
import ToastNotification from '../components/ToastNotification.jsx';
import { getColorById, updateColor } from '../api/colorsService';

export default function EditColor() {
    const { id } = useParams();
    const navigate = useNavigate();

    const [menuCollapsed, setMenuCollapsed] = useState(false);
    const [loading, setLoading] = useState(true);
    const [submitting, setSubmitting] = useState(false);
    const [successMessage, setSuccessMessage] = useState(null);
    const [errorMessage, setErrorMessage] = useState(null);
    const [fieldErrors, setFieldErrors] = useState({});

    const [colorData, setColorData] = useState({
        id_Color: '',
        nombre_Color: '',
        descripcion: '',

    });

    const toggleMenu = () => setMenuCollapsed(!menuCollapsed);

    // Función auxiliar para mostrar mensajes de error/éxito temporales
    const showMessage = (text, type) => {
        if (type === 'error') {
            setErrorMessage(text);
            setSuccessMessage(null);
        } else if (type === 'success') {
            setSuccessMessage(text);
            setErrorMessage(null);
        }
    };

    useEffect(() => {
        if (id) fetchColor();
    }, [id]);

    const fetchColor = async () => {
        try {
            setLoading(true);
            const data = await getColorById(id);
            setColorData({
                id_Color: data.id_Color,
                nombre_Color: data.nombre_Color || '',
                descripcion: data.descripcion || '',
                hex_color: data.hex_color || '#000000' 
            });
        } catch (error) {
            console.error(error);
            setErrorMessage('Error al cargar el color');
        } finally {
            setLoading(false);
        }
    };

    const handleChange = (e) => {
        const { name, value } = e.target;
        setColorData(prev => ({ ...prev, [name]: value }));
        // Limpiar el error de campo al escribir
        setFieldErrors(prev => ({ ...prev, [name]: null }));
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setFieldErrors({});
        setErrorMessage(null);
        setSuccessMessage(null);
        
        const hasNumbers = /\d/.test(colorData.nombre_Color);
        
        // 1. Validación de obligatoriedad del Nombre
        if (!colorData.nombre_Color.trim()) {
            setFieldErrors({ nombre_Color: 'El nombre del color es obligatorio.' });
            showMessage('El nombre del color es obligatorio.', 'error');
            return;
        }
        
        // 2. Validación de obligatoriedad del Tono
        if (!colorData.hex_color || colorData.hex_color.trim() === '' || !/^#([0-9A-F]{3}){1,2}$/i.test(colorData.hex_color)) {
            setFieldErrors({
                hex_color: 'El tono del color (valor hexadecimal) es obligatorio y debe ser válido.'
            });
            showMessage('Debes seleccionar un tono de color válido.', 'error');
            return;
        }
        
        // 3. Validación de Números en el Nombre
        if (hasNumbers) {
            setFieldErrors({
                nombre_Color: 'El nombre del color no debe contener números.'
            });
            showMessage('Por favor, corrige el nombre del color.', 'error');
            return;
        }

        try {
            setSubmitting(true);
            await updateColor(id, {
                id_Color: parseInt(id),
                nombre_Color: colorData.nombre_Color.trim(),
                descripcion: colorData.descripcion?.trim() || '',
                hex_color: colorData.hex_color
            });
            
            setSuccessMessage(`Color '${colorData.nombre_Color}' actualizado exitosamente`);
            setTimeout(() => navigate('/colores', { state: { successMessage: `Color ${colorData.nombre_Color} actualizado exitosamente.` } }), 1500);
            
        } catch (error) {
            console.error(error);
            
            //  Manejar error 409 (Unicidad del backend)
            if (error.response?.status === 409) {
                const errorMessageText = error.response.data.message || 'Error de unicidad al actualizar.';
                let newFieldErrors = {};
                
                // Identificar qué campo falló basándose en el mensaje del backend
                if (errorMessageText.includes("nombre de color") || errorMessageText.includes("mismo nombre")) {
                    newFieldErrors.nombre_Color = errorMessageText;
                } else if (errorMessageText.includes("tono de color") || errorMessageText.includes("valor hexadecimal")) {
                    newFieldErrors.hex_color = errorMessageText;
                }
                
                if (Object.keys(newFieldErrors).length > 0) {
                    setFieldErrors(newFieldErrors);
                    showMessage(errorMessageText, 'error');
                } else {
                    // Si el error 409 es ambiguo, se muestra solo en la alerta
                    showMessage(errorMessageText, 'error');
                }
            } else {
                // Error genérico (404, 500, etc.)
                const msg = error.response?.data?.message || 'Error al actualizar el color';
                showMessage(msg, 'error');
            }
        } finally {
            setSubmitting(false);
        }
    };
    //---

    if (loading) {
        return (
            <div className="role-form-container">
                <Nav menuCollapsed={menuCollapsed} toggleMenu={toggleMenu} />
                <div className={`formulario-rol-main-content-area ${menuCollapsed ? 'expanded-margin' : ''}`}>
                    <p>Cargando color...</p>
                </div>
            </div>
        );
    }

    return (
        <div className="role-form-container">
            <Nav menuCollapsed={menuCollapsed} toggleMenu={toggleMenu} />

            <div className={`formulario-rol-main-content-area ${menuCollapsed ? 'expanded-margin' : ''}`}>
                <div className="formulario-roles">
                    <h1 className="form-title">Editar Color 🎨</h1>
                    <p className="form-info">
                        Modifica los datos del color y guarda los cambios 👩🏻‍💻
                    </p><br />
                    <p className="form-info">
                        Color actual: **{colorData.nombre_Color}**
                    </p>
                    <br /><br />

                    <form onSubmit={handleSubmit} className="role-form">
                        
                        {/* ID (Mantener aquí el ID, pero sin error del nombre) */}
                        <div className="form-group">
                            <label htmlFor="id_Color" className="label-heading">ID:</label>
                            <input
                                type="text"
                                id="id_Color"
                                name="id_Color"
                                value={colorData.id_Color}
                                disabled
                                className="input-field"
                            />
                        </div>

                        {/* Nombre */}
                        <div className="form-group">
                            <label htmlFor="nombre_Color" className="label-heading">
                                Nombre: <span className="required-asterisk">*</span>
                            </label>
                            <input
                                type="text"
                                id="nombre_Color"
                                name="nombre_Color"
                                value={colorData.nombre_Color}
                                onChange={handleChange}
                                required
                                maxLength={100}
                                disabled={submitting}
                                className="input-field"
                            />
                            {/* 🚩 ERROR DEL NOMBRE - REUBICADO */}
                            {fieldErrors.nombre_Color && (
                                <p className="error-talla">{fieldErrors.nombre_Color}</p>
                            )}
                        </div>

                        {/* Descripción */}
                        <div className="form-group">
                            <label htmlFor="descripcion" className="label-heading">Descripción:<span className="required-asterisk">*</span></label>
                            <textarea
                                id="descripcion"
                                name="descripcion"
                                value={colorData.descripcion}
                                onChange={handleChange}
                                rows="4"
                                maxLength={500}
                                disabled={submitting}
                                className="input-field"
                                required
                            />
                        </div>
                        
                        {/* Tono del Color (Hex) */}
                        <div className="form-group">
                            <label htmlFor="hex_color" className="label-heading">Tono del Color: <span className="required-asterisk">*</span></label>
                            <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                                <input
                                    type="color"
                                    id="hex_color"
                                    name="hex_color"
                                    value={colorData.hex_color}
                                    onChange={handleChange}
                                    disabled={submitting}
                                    style={{ width: '60px', height: '40px', padding: 0, border: 'none', cursor: 'pointer' }}
                                    required
                                />
                                <span style={{
                                    display: 'inline-block',
                                    width: '40px',
                                    height: '40px',
                                    borderRadius: '50%',
                                    backgroundColor: colorData.hex_color,
                                    border: '2px solid #000'
                                }} />
                                <span>{colorData.hex_color}</span>
                            </div>
                            {/* 🚩 ERROR DEL TONO */}
                            {fieldErrors.hex_color && (
                                <p className="error-talla">{fieldErrors.hex_color}</p>
                            )}
                        </div>

                        {/* Botones */}
                        <div className="form-buttons">
                            <button type="button" className="cancel-button" onClick={() => navigate('/colores')} disabled={submitting}>
                                Cancelar
                            </button>
                            <button type="submit" className="save-button" disabled={submitting}>
                                <FaSave style={{ marginRight: '8px' }} />
                                {submitting ? 'Actualizando...' : 'Actualizar Color'}
                            </button>
                        </div>
                    </form>
                </div>
            </div>

            {/* Toasts */}
            <ToastNotification message={successMessage} type="success" onClose={() => setSuccessMessage(null)} />
            <ToastNotification message={errorMessage} type="error" onClose={() => setErrorMessage(null)} />
        </div>
    );
}