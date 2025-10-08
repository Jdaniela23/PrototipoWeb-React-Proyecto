import React, { useState } from 'react';
import './FormAdd.css';
import Nav from '../components/Nav.jsx';
import { useNavigate } from 'react-router-dom';
import { createColor } from '../api/colorsService'; // Ajusta según tu servicio

function FormAddColor() {
    const [menuCollapsed, setMenuCollapsed] = useState(false);
    const [message, setMessage] = useState({ text: '', type: '' });
    const [loading, setLoading] = useState(false);
    const navigate = useNavigate();

    const [colorData, setColorData] = useState({
        nombre_Color: '',
        descripcion: '',
        hex_color: '#000000' // Valor inicial negro
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

        if (!colorData.nombre_Color) {
            showMessage('El nombre del color es obligatorio.', 'error');
            setLoading(false);
            return;
        }

        try {
            await createColor(colorData);
            navigate('/colores', { state: { successMessage: `Color ${colorData.nombre_Color} creado exitosamente.` } });
        } catch (error) {
            console.error(error);
            showMessage(`Error al guardar: ${error.message}`, 'error');
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
                            <label htmlFor="nombre_Color" className="label-heading">Nombre del Color <span className="required-asterisk">*</span></label>
                            <input
                                id="nombre_Color"
                                name="nombre_Color"
                                className="input-field"
                                placeholder="Ingresar nombre del color"
                                value={colorData.nombre_Color}
                                onChange={handleChange}
                                required
                            />
                        </div>

                        <div className="form-group">
                            <label htmlFor="descripcion" className="label-heading">Descripción<span className="required-asterisk">*</span></label>
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
                            <label htmlFor="hex_color" className="label-heading">Tono del Color <span className="required-asterisk">*</span></label>
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
