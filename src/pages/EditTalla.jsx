import React, { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import Nav from '../components/Nav.jsx';
import Footer from '../components/Footer.jsx';
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
    const [errorMessage, setErrorMessage] = useState(null);

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
            setErrorMessage('Error al cargar la talla');
        } finally {
            setLoading(false);
        }
    };

    const handleChange = (e) => {
        const { name, value } = e.target;
        setTallaData(prev => ({ ...prev, [name]: value }));
    };

    const handleSubmit = async (e) => {
        e.preventDefault();

        if (!tallaData.nombre_Talla.trim()) {
            setErrorMessage('El nombre de la talla es obligatorio');
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
            setErrorMessage(null);

            setTimeout(() => navigate('/tallas'), 1500);
        } catch (error) {
            console.error(error);
            const msg = error.response?.data?.mensaje || 'Error al actualizar la talla';
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
                    <p className="form-info">
                        Modifica los datos de la talla y guarda los cambios 👩🏻‍💻
                    </p><br/>
                    <p className="form-info">
                        Talla: {tallaData.nombre_Talla}
                    </p>
                    <br /><br />

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
                                required
                                maxLength={100}
                                disabled={submitting}
                                className="input-field"
                            />
                        </div>

                        {/* Descripción */}
                        <div className="form-group">
                            <label htmlFor="descripcion" className="label-heading">Descripción: <span className="required-asterisk">*</span></label>
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
                        <button type="button" className="cancel-button" onClick={() => navigate('/tallas')} disabled={submitting}>
                            Cancelar
                        </button>
                        <button type="submit" className="save-button" disabled={submitting}>
                            <FaSave style={{ marginRight: '8px' }} />
                            {submitting ? 'Actualizando...' : 'Actualizar Talla'}
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
