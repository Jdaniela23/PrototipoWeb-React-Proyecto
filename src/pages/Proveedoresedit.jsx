import React, { useState, useEffect } from 'react';
import './FormAdd.css';
import Nav from '../components/Nav.jsx';
import { useNavigate, useParams } from 'react-router-dom';
import { FaSave, FaSpinner } from 'react-icons/fa';
import { getProveedorById, updateProveedor, validateProveedorData } from '../api/proveedoresService.js';

function EditProveedor() {
    const { id } = useParams();
    const navigate = useNavigate();
    const [menuCollapsed, setMenuCollapsed] = useState(false);
    const [cargando, setCargando] = useState(true);
    const [enviando, setEnviando] = useState(false);
    const [errores, setErrores] = useState({});
    const [errorGeneral, setErrorGeneral] = useState('');

    const toggleMenu = () => setMenuCollapsed(!menuCollapsed);

    const [proveedorData, setProveedorData] = useState({
        nombre: '',
        telefono: '',
        email: '',
        direccion: '',
        ciudad: 'Medellín',
        estado: true
    });

    const municipiosColombia = [
        'Medellín', 'Bogotá', 'Cali', 'Barranquilla', 'Cartagena',
        'Bucaramanga', 'Pereira', 'Manizales', 'Armenia', 'Ibagué',
        'Pasto', 'Cúcuta', 'Villavicencio', 'Santa Marta', 'Montería'
    ];

    useEffect(() => {
        const cargarProveedor = async () => {
            try {
                setCargando(true);
                setErrorGeneral('');
                const data = await getProveedorById(id);
                setProveedorData({
                    nombre: data.nombre || '',
                    telefono: data.telefono || '',
                    email: data.email || '',
                    direccion: data.direccion || '',
                    ciudad: data.ciudad || 'Medellín',
                    estado: data.estado !== false
                });
            } catch (error) {
                setErrorGeneral(`Error al cargar el proveedor: ${error.message}`);
            } finally {
                setCargando(false);
            }
        };
        if (id) cargarProveedor();
        else setTimeout(() => navigate('/proveedores'), 2000);
    }, [id, navigate]);

    const handleChange = (e) => {
        const { name, value } = e.target;
        setProveedorData(prev => ({ ...prev, [name]: value }));
        if (errores[name]) setErrores(prev => ({ ...prev, [name]: '' }));
    };

    const handleEstadoChange = (e) => {
        setProveedorData(prev => ({ ...prev, estado: e.target.value === 'true' }));
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setEnviando(true);
        setErrores({});
        setErrorGeneral('');

        const validation = validateProveedorData(proveedorData);
        if (!validation.isValid) {
            setErrores(validation.errors);
            setEnviando(false);
            return;
        }

        try {
            const datosActualizados = {
                nombre: proveedorData.nombre.trim(),
                telefono: proveedorData.telefono.trim(),
                email: proveedorData.email.trim(),
                direccion: proveedorData.direccion.trim(),
                ciudad: proveedorData.ciudad,
                estado: proveedorData.estado
            };
            await updateProveedor(id, datosActualizados);
            // Redirigir con mensaje de éxito
            navigate('/proveedores', { state: { successMessage: ' Proveedor actualizado exitosamente!' } });
        } catch (error) {
            setErrorGeneral(`Error al actualizar: ${error.message}`);
        } finally {
            setEnviando(false);
        }
    };

    if (cargando) return (
        <div className="role-form-container">
            <Nav menuCollapsed={menuCollapsed} toggleMenu={toggleMenu} />
            <div className={`formulario-rol-main-content-area ${menuCollapsed ? 'expanded-margin' : ''}`}>
                <div className="formulario-roles">
                    <h1 className="form-title"><FaSpinner className="spinning" /> Cargando proveedor...</h1>
                </div>
            </div>
        </div>
    );

    return (
        <div className="role-form-container">
            <Nav menuCollapsed={menuCollapsed} toggleMenu={toggleMenu} />

            <div className={`formulario-rol-main-content-area ${menuCollapsed ? 'expanded-margin' : ''}`}>
                <div className="formulario-roles">
                    <h1 className="form-title">Editar Proveedor</h1>
                    <p className="form-info">ID del Proveedor: {id}</p>

                    {errorGeneral && <div className="error-alert">{errorGeneral}</div>}

                    <form onSubmit={handleSubmit} className="role-form">
                        <div className="form-row">
                            <div className="form-group">
                                <label className="label-heading">Nombre: <span className="required-asterisk">*</span></label>
                                <input
                                    type="text"
                                    name="nombre"
                                    value={proveedorData.nombre}
                                    onChange={handleChange}
                                    className={`input-field ${errores.nombre ? 'error' : ''}`}
                                    required
                                />
                            </div>

                            <div className="form-group">
                                <label className="label-heading">Estado: <span className="required-asterisk">*</span></label>
                                <select
                                    name="estado"
                                    value={proveedorData.estado.toString()}
                                    onChange={handleEstadoChange}
                                    className="barrio-select"
                                >
                                    <option value="true">Activo</option>
                                    <option value="false">Inactivo</option>
                                </select>
                            </div>
                        </div>

                        <div className="form-row">
                            <div className="form-group">
                                <label className="label-heading">Teléfono: <span className="required-asterisk">*</span></label>
                                <input
                                    type="text"
                                    name="telefono"
                                    value={proveedorData.telefono}
                                    onChange={handleChange}
                                    className={`input-field ${errores.telefono ? 'error' : ''}`}
                                    required
                                />
                            </div>

                            <div className="form-group">
                                <label className="label-heading">Email: <span className="required-asterisk">*</span></label>
                                <input
                                    type="email"
                                    name="email"
                                    value={proveedorData.email}
                                    onChange={handleChange}
                                    className={`input-field ${errores.email ? 'error' : ''}`}
                                    required
                                />
                            </div>
                        </div>

                        <div className="form-row">
                            <div className="form-group">
                                <label className="label-heading">Dirección: <span className="required-asterisk">*</span></label>
                                <input
                                    type="text"
                                    name="direccion"
                                    value={proveedorData.direccion}
                                    onChange={handleChange}
                                    className="input-field"
                                    required
                                />
                            </div>

                            <div className="form-group">
                                <label className="label-heading">Ciudad: <span className="required-asterisk">*</span></label>
                                <select
                                    name="ciudad"
                                    value={proveedorData.ciudad}
                                    onChange={handleChange}
                                    className="barrio-select"
                                    required
                                >
                                    {municipiosColombia.map((municipio, index) => (
                                        <option key={index} value={municipio}>{municipio}</option>
                                    ))}
                                </select>
                            </div>
                        </div>

                        <div className="form-buttons">
                            <button type="button" className="cancel-button" onClick={() => navigate('/proveedores')} disabled={enviando}>Cancelar</button>
                            <button type="submit" className="save-button" disabled={enviando}>
                                {enviando ? <FaSpinner className="spinning" /> : <FaSave />} {enviando ? 'Actualizando...' : 'Actualizar'}
                            </button>
                        </div>
                    </form>
                </div>
            </div>
        </div>
    );
}

export default EditProveedor;
