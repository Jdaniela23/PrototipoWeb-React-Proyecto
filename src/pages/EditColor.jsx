import React, { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import Nav from '../components/Nav.jsx';
import Footer from '../components/Footer.jsx';
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

    const [colorData, setColorData] = useState({
        id_Color: '',
        nombre_Color: '',
        descripcion: '',
        hex_color:  '#000000' // valor por defecto
    });

    const toggleMenu = () => setMenuCollapsed(!menuCollapsed);

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
                hex_color: data.hex_color ||'#000'
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
    };

    const handleSubmit = async (e) => {
        e.preventDefault();

        if (!colorData.nombre_Color.trim()) {
            setErrorMessage('El nombre del color es obligatorio');
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
            setErrorMessage(null);

            setTimeout(() => navigate('/colores'), 1500);
        } catch (error) {
            console.error(error);
            const msg = error.response?.data?.mensaje || 'Error al actualizar el color';
            setErrorMessage(msg);
            setSuccessMessage(null);
        } finally {
            setSubmitting(false);
        }
    };

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
                        Color: {colorData.nombre_Color}
                    </p>
                    <br /><br />

                    <form onSubmit={handleSubmit} className="role-form">
                        {/* ID */}
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
                            />
                        </div>
                        <div className="form-group">
                            <label htmlFor="hex_color" className="label-heading">Tono del Color <span className="required-asterisk">*</span></label>
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
                        </div>

                        {/* Botones */}
                        <button type="button" className="cancel-button" onClick={() => navigate('/colores')} disabled={submitting}>
                            Cancelar
                        </button>
                        <button type="submit" className="save-button" disabled={submitting}>
                            <FaSave style={{ marginRight: '8px' }} />
                            {submitting ? 'Actualizando...' : 'Actualizar Color'}
                        </button>
                    </form>
                </div>


            </div>

            {/* Toasts */}
            <ToastNotification message={successMessage} type="success" onClose={() => setSuccessMessage(null)} />
            <ToastNotification message={errorMessage} type="error" onClose={() => setErrorMessage(null)} />
        </div>
    );
}
