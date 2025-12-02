import React, { useState } from 'react';
import './FormAdd.css';
import Nav from '../components/Nav.jsx';
import { useNavigate } from 'react-router-dom';
import { createTalla } from '../api/tallasService'; 

function FormAddTalla() {
    const [menuCollapsed, setMenuCollapsed] = useState(false);
    const [message, setMessage] = useState({ text: '', type: '' });
    const [loading, setLoading] = useState(false);
    const navigate = useNavigate();


    const [fieldErrors, setFieldErrors] = useState({});

    const [tallaData, setTallaData] = useState({
        nombre_Talla: '',
        descripcion: ''
    });

    const toggleMenu = () => setMenuCollapsed(!menuCollapsed);
    const showMessage = (text, type) => {
        setMessage({ text, type });
        setTimeout(() => setMessage({ text: '', type: '' }), 5000);
    };

    const handleChange = (e) => {
        const { name, value } = e.target;
        setTallaData(prev => ({ ...prev, [name]: value }));
        setFieldErrors(prev => ({ ...prev, [name]: '' }));
    };

    const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setFieldErrors({});

    if (!tallaData.nombre_Talla) {
        setFieldErrors({ nombre_Talla: 'El nombre de la talla es obligatorio.' });
        setLoading(false);
        return;
    }

    try {
        await createTalla(tallaData);
        navigate('/tallas', { 
            state: { successMessage: `Talla ${tallaData.nombre_Talla} creada exitosamente.` } 
        });
    } catch (error) {
        console.error('Error al guardar la talla:', error);

        // Revisar si el error es 409 del backend
        if (error.response?.status === 409) {
            setFieldErrors({ 
                nombre_Talla: error.response.data.message || 'Este nombre de talla ya está en uso.' 
            });
        } else {
            // Error genérico
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
                    <h1 className="form-title">Agregar Talla</h1>
                      <p className="form-info">Registra nuevas tallas, completa todos los campos antes de Guardar 👩🏻‍💻</p><br/><br/>
                    <form onSubmit={handleSubmit} className="role-form">
                        <div className="form-group">
                            <label htmlFor="nombre_Talla" className="label-heading">Nombre de Talla <span className="required-asterisk">*</span></label>
                            <input
                                id="nombre_Talla"
                                name="nombre_Talla"
                                className="input-field"
                                placeholder="Ingresar nombre de talla"
                                value={tallaData.nombre_Talla}
                                onChange={handleChange}
                                required
                            />
                            {fieldErrors.nombre_Talla && (
                                <p className="error-talla">{fieldErrors.nombre_Talla}</p>
                            )}
                        </div>

                        <div className="form-group">
                            <label htmlFor="descripcion" className="label-heading">Descripción<span className="required-asterisk">*</span></label>
                            <textarea
                                id="descripcion"
                                name="descripcion"
                                className="input-field"
                                placeholder="Descripción de la talla"
                                value={tallaData.descripcion}
                                onChange={handleChange}
                                required
                            />
                        </div>

                        <div className="form-buttons">
                            <button type="button" className="cancel-button" onClick={() => navigate(-1)}>Cancelar</button>
                            <button type="submit" className="save-button" disabled={loading}>
                                {loading ? 'Guardando...' : 'Guardar Talla'}
                            </button>
                        </div>
                    </form>
                </div>
            </div>
        </div>
    );
}

export default FormAddTalla;
