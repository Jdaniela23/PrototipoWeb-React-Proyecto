import React, { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import Nav from '../components/Nav.jsx';
import { FaSave } from 'react-icons/fa';
import ToastNotification from '../components/ToastNotification.jsx';
import { getTallaById, updateTalla } from '../api/tallasService';

export default function EditTalla() {
    const { id } = useParams();
    const navigate = useNavigate();

    const [menuCollapsed, setMenuCollapsed] = useState(false);
    const [loading, setLoading] = useState(true);
    const [submitting, setSubmitting] = useState(false);
    const [successMessage, setSuccessMessage] = useState(null);
    const [fieldErrors, setFieldErrors] = useState({});
    const [tallaData, setTallaData] = useState({
        id_Talla: '',
        nombre_Talla: '',
        descripcion: ''
    });

    const toggleMenu = () => setMenuCollapsed(!menuCollapsed);

    // Cargar talla
    useEffect(() => {
        if (id) fetchTalla();
    }, [id]);

    const fetchTalla = async () => {
        try {
            setLoading(true);
            const data = await getTallaById(id);
            setTallaData({
                id_Talla: data.id_Talla,
                nombre_Talla: data.nombre_Talla || '',
                descripcion: data.descripcion || ''
            });
        } catch (error) {
            console.error(error);
            setFieldErrors({ global: 'Error al cargar la talla' });
        } finally {
            setLoading(false);
        }
    };

    const handleChange = (e) => {
        const { name, value } = e.target;
        setTallaData(prev => ({ ...prev, [name]: value }));
        setFieldErrors(prev => ({ ...prev, [name]: '' })); // limpiar error al escribir
    };

    const handleSubmit = async (e) => {
        e.preventDefault();

        setFieldErrors({});
        if (!tallaData.nombre_Talla.trim()) {
            setFieldErrors({ nombre_Talla: 'El nombre de la talla es obligatorio' });
            return;
        }

        try {
            setSubmitting(true);
            await updateTalla(id, {
                id_Talla: parseInt(id),
                nombre_Talla: tallaData.nombre_Talla.trim(),
                descripcion: tallaData.descripcion?.trim() || ''
            });

            setSuccessMessage(`Talla '${tallaData.nombre_Talla}' actualizada exitosamente`);
            setFieldErrors({});
            setTimeout(() => navigate('/tallas'), 1500);

        } catch (error) {
            console.error(error);

            // Captura error de nombre duplicado (409)
            if (error.response?.status === 409) {
                setFieldErrors({ nombre_Talla: error.response.data.message || 'Este nombre ya está en uso' });
            } else {
                setFieldErrors({ global: error.response?.data?.mensaje || 'Error al actualizar la talla' });
            }

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
                    <p>Cargando talla...</p>
                </div>
            </div>
        );
    }

    return (
        <div className="role-form-container">
            <Nav menuCollapsed={menuCollapsed} toggleMenu={toggleMenu} />

            <div className={`formulario-rol-main-content-area ${menuCollapsed ? 'expanded-margin' : ''}`}>
                <div className="formulario-roles">
                    <h1 className="form-title">Editar Talla</h1>
                    <p className="form-info">Modifica los datos de la talla y guarda los cambios 👩🏻‍💻</p><br />

                    {fieldErrors.global && (
                        <p className="error-message-rol">{fieldErrors.global}</p>
                    )}

                    <form onSubmit={handleSubmit} className="role-form">
                        {/* ID */}
                        <div className="form-group">
                            <label htmlFor="id_Talla" className="label-heading">ID:</label>
                            <input
                                type="text"
                                id="id_Talla"
                                name="id_Talla"
                                value={tallaData.id_Talla}
                                disabled
                                className="input-field"
                            />
                        </div>

                        {/* Nombre */}
                        <div className="form-group">
                            <label htmlFor="nombre_Talla" className="label-heading">
                                Nombre: <span className="required-asterisk">*</span>
                            </label>
                            <input
                                type="text"
                                id="nombre_Talla"
                                name="nombre_Talla"
                                value={tallaData.nombre_Talla}
                                onChange={handleChange}
                                disabled={submitting}
                                className="input-field"
                                maxLength={100}
                            />
                            {fieldErrors.nombre_Talla && (
                                <p className="error-talla">{fieldErrors.nombre_Talla}</p>
                            )}
                        </div>

                        {/* Descripción */}
                        <div className="form-group">
                            <label htmlFor="descripcion" className="label-heading">
                                Descripción: <span className="required-asterisk">*</span>
                            </label>
                            <textarea
                                id="descripcion"
                                name="descripcion"
                                value={tallaData.descripcion}
                                onChange={handleChange}
                                rows="4"
                                maxLength={500}
                                disabled={submitting}
                                className="input-field"
                                required
                            />
                        </div>

                        {/* Botones */}
                        <div className="form-buttons">
                            <button type="button" className="cancel-button" onClick={() => navigate('/tallas')} disabled={submitting}>
                                Cancelar
                            </button>
                            <button type="submit" className="save-button" disabled={submitting}>
                                <FaSave style={{ marginRight: '8px' }} />
                                {submitting ? 'Actualizando...' : 'Actualizar Talla'}
                            </button>
                        </div>
                    </form>
                </div>
            </div>

            {/* Toasts */}
            <ToastNotification message={successMessage} type="success" onClose={() => setSuccessMessage(null)} />
            <ToastNotification message={fieldErrors.global} type="error" onClose={() => setFieldErrors(prev => ({ ...prev, global: '' }))} />
        </div>
    );
}
