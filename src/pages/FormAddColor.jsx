import React, { useState } from 'react';
import './FormAdd.css';
import Nav from '../components/Nav.jsx';
import { useNavigate } from 'react-router-dom';
import { createColor } from '../api/colorsService'; //Servicio

function FormAddColor() {
    const [menuCollapsed, setMenuCollapsed] = useState(false);
    const [message, setMessage] = useState({ text: '', type: '' });
    const [loading, setLoading] = useState(false);
    const navigate = useNavigate();
    const [fieldErrors, setFieldErrors] = useState({}); //Manejo de errores

    const [colorData, setColorData] = useState({
        nombre_Color: '',
        descripcion: '',

    });

    const toggleMenu = () => setMenuCollapsed(!menuCollapsed);
    const showMessage = (text, type) => {
        setMessage({ text, type });
        setTimeout(() => setMessage({ text: '', type: '' }), 5000);
    };

    const handleChange = (e) => {
        const { name, value } = e.target;
        setColorData(prev => ({ ...prev, [name]: value }));
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);
        setFieldErrors({});
        const hasNumbers = /\d/.test(colorData.nombre_Color);



        if (!colorData.nombre_Color) {
            showMessage('El nombre del color es obligatorio.', 'error');
            setLoading(false);
            return;
        }
        if (!colorData.hex_color || colorData.hex_color.trim() === '') {
            setFieldErrors({
                hex_color: 'El tono del color (valor hexadecimal) es obligatorio.'
            });
            showMessage('Debes seleccionar un tono de color.', 'error');
            setLoading(false);
            return;
        }
        if (hasNumbers) {
            setFieldErrors({
                nombre_Color: 'El nombre del color no debe contener números.'
            });
            showMessage('Por favor, corrige el nombre del color.', 'error');
            setLoading(false);
            return;
        }

        try {
            await createColor(colorData);
            navigate('/colores', { state: { successMessage: `Color ${colorData.nombre_Color} creado exitosamente.` } });
        } catch (error) {
            console.error(error);

            // Revisar si el error es 409 del backend
          if (error.response?.status === 409) {
            const errorMessage = error.response.data.message || 'Error de unicidad.';
            
            let newFieldErrors = {};

            if (errorMessage.includes("mismo nombre") || errorMessage.includes("existe con el mismo nombre")) {
                newFieldErrors.nombre_Color = errorMessage;
            } 
            // 2. Si el error contiene frases relacionadas con el TONO/HEXADECIMAL:
            else if (errorMessage.includes("tono") || errorMessage.includes("valor hexadecimal")) {
                newFieldErrors.hex_color = errorMessage;
            } else {
                // Si el mensaje es ambiguo, muestra el error en la alerta superior
                showMessage(`Error de unicidad: ${errorMessage}`, 'error');
            }
            setFieldErrors(newFieldErrors);
            
        } else {
            // Error genérico o de otra categoría
            showMessage(`Error al guardar: ${error.response?.data?.message || error.message}`, 'error');
        }

        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="role-form-container">
            <Nav menuCollapsed={menuCollapsed} toggleMenu={toggleMenu} />
            <div className={`formulario-rol-main-content-area ${menuCollapsed ? 'expanded-margin' : ''}`}>
                {message.text && <div className={`form-message ${message.type}`}>{message.text}</div>}
                <div className="formulario-roles">
                    <h1 className="form-title">Agregar Color</h1>
                    <p className="form-info">Registra nuevos colores, completa todos los campos antes de Guardar 👩🏻‍💻</p><br /><br />
                    <form onSubmit={handleSubmit} className="role-form">
                        <div className="form-group">
                            <label htmlFor="nombre_Color" className="label-heading">Nombre del Color:<span className="required-asterisk">*</span></label>
                            <input
                                id="nombre_Color"
                                name="nombre_Color"
                                className="input-field"
                                placeholder="Ingresar nombre del color"
                                value={colorData.nombre_Color}
                                onChange={handleChange}
                                required
                            />
                            {fieldErrors.nombre_Color && (
                                <p className="error-talla">{fieldErrors.nombre_Color}</p>
                            )}
                        </div>

                        <div className="form-group">
                            <label htmlFor="descripcion" className="label-heading">Descripción: <span className="required-asterisk">*</span></label>
                            <textarea
                                id="descripcion"
                                name="descripcion"
                                className="input-field"
                                placeholder="Descripción del color"
                                value={colorData.descripcion}
                                onChange={handleChange}
                                required
                            />
                        </div>
                        {/* Campo color con preview */}
                        <div className="form-group">
                            <label htmlFor="hex_color" className="label-heading">Tono del Color: <span className="required-asterisk">*</span></label>
                            <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                                <input
                                    type="color"
                                    id="hex_color"
                                    name="hex_color"
                                    value={colorData.hex_color}
                                    onChange={handleChange}
                                    required
                                    style={{ width: '60px', height: '40px', padding: 0, border: 'none', cursor: 'pointer' }}
                                />
                                {/* Círculo de preview */}
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
                            {fieldErrors.hex_color && (
                                <p className="error-talla">{fieldErrors.hex_color}</p>
                                
                            )}
                        </div>
                        <div className="form-buttons">
                            <button type="button" className="cancel-button" onClick={() => navigate(-1)}>Cancelar</button>
                            <button type="submit" className="save-button" disabled={loading}>
                                {loading ? 'Guardando...' : 'Guardar Color'}
                            </button>
                        </div>
                    </form>
                </div>
            </div>
        </div>
    );
}

export default FormAddColor;
