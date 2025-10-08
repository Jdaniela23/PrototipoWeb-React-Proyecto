import React, { useState } from 'react';
import './FormAdd.css';
import Nav from '../components/Nav.jsx';
import { useNavigate } from 'react-router-dom';
import { FaSave } from 'react-icons/fa';
import { createProveedor } from "../api/proveedoresService.js";

function CreateProveedor() {
    const [menuCollapsed, setMenuCollapsed] = useState(false);
    const toggleMenu = () => setMenuCollapsed(!menuCollapsed);
    const navigate = useNavigate();

    const [proveedorData, setProveedorData] = useState({
        idProveedor: 0,
        nombre: '',
        telefono: '',
        email: '',
        direccion: '',
        ciudad: '',
        estado: true,
        compras: null
    });

    const municipiosColombia = [
        'Bogotá', 'Cali', 'Barranquilla', 'Cartagena',
        'Bucaramanga', 'Pereira', 'Manizales', 'Armenia', 'Ibagué', 'Medellín'
    ];

    const handleChange = (e) => {
        const { name, value } = e.target;
        setProveedorData({ ...proveedorData, [name]: value });
    };

    const handleEstadoChange = (e) => {
        setProveedorData({ ...proveedorData, estado: e.target.checked });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            await createProveedor(proveedorData);
            // Redirigir a la tabla y mandar mensaje de éxito
            navigate('/proveedores', { state: { successMessage: ' Proveedor creado exitosamente!' } });
        } catch (error) {
            console.error("❌ Error al crear proveedor:", error);
            navigate('/proveedores', { state: { successMessage: ' Error al crear proveedor' } });
        }
    };

    return (
        <div className="role-form-container">
            <Nav menuCollapsed={menuCollapsed} toggleMenu={toggleMenu} />

            <div className={`formulario-rol-main-content-area ${menuCollapsed ? 'expanded-margin' : ''}`}>
                <div className="formulario-roles">
                    <h1 className="form-title">Nuevo Proveedor</h1>
                    <p className="form-info">Complete los campos para registrar un nuevo proveedor en el sistema.</p><br /><br />

                    <form onSubmit={handleSubmit} className="role-form">
                        <div className="two-columns">
                            <div className="form-column">
                                <div className="form-group">
                                    <label htmlFor="nombre" className="label-heading">Nombre:<span className="required-asterisk">*</span></label>
                                    <input
                                        type="text"
                                        id="nombre"
                                        name="nombre"
                                        placeholder="Ingresar nombre del proveedor"
                                        value={proveedorData.nombre}
                                        onChange={handleChange}
                                        required
                                        className="input-field"
                                    />
                                </div>

                                <div className="form-group">
                                    <label htmlFor="telefono" className="label-heading">Teléfono:<span className="required-asterisk">*</span></label>
                                    <input
                                        type="text"
                                        id="telefono"
                                        name="telefono"
                                        placeholder="Ingresar número de contacto"
                                        value={proveedorData.telefono}
                                        onChange={handleChange}
                                        required
                                        className="input-field"
                                    />
                                </div>

                                <div className="form-group">
                                    <label htmlFor="email" className="label-heading">Correo electrónico:<span className="required-asterisk">*</span></label>
                                    <input
                                        type="email"
                                        id="email"
                                        name="email"
                                        placeholder="Ingresar @email"
                                        value={proveedorData.email}
                                        onChange={handleChange}
                                        required
                                        className="input-field"
                                    />
                                </div>

                                <div className="form-group">
                                    <label>
                                        <input
                                            type="checkbox"
                                            checked={proveedorData.estado}
                                            onChange={handleEstadoChange}
                                        />
                                        Activo
                                    </label>
                                </div>
                            </div>

                            <div className="form-column">
                                <div className="form-group">
                                    <label htmlFor="ciudad" className="label-heading">Ciudad:<span className="required-asterisk">*</span></label>
                                    <select
                                        id="ciudad"
                                        name="ciudad"
                                        value={proveedorData.ciudad}
                                        onChange={handleChange}
                                        className="barrio-select"
                                        required
                                    >
                                        <option value="">Seleccione ciudad</option>
                                        {municipiosColombia.map((municipio, index) => (
                                            <option key={index} value={municipio}>{municipio}</option>
                                        ))}
                                    </select>
                                </div>

                                <div className="form-group">
                                    <label htmlFor="direccion" className="label-heading">Dirección:<span className="required-asterisk">*</span></label>
                                    <input
                                        type="text"
                                        id="direccion"
                                        name="direccion"
                                        placeholder='Ingresar dirección'
                                        required
                                        value={proveedorData.direccion}
                                        onChange={handleChange}
                                        className="input-field"
                                    />
                                </div>
                            </div>
                        </div>

                        <div className="form-buttons">
                            <button
                                type="button"
                                className="cancel-button"
                                onClick={() => navigate('/proveedores')}
                            >
                                Cancelar
                            </button>

                            <button type="submit" className="save-button">
                                <FaSave className="save-icon" /> Guardar Proveedor
                            </button>
                        </div>
                    </form>
                </div>
            </div>

            <style jsx>{`
                .two-columns { display: flex; gap: 30px; }
                .form-column { flex: 1; }
                @media (max-width: 768px) { .two-columns { flex-direction: column; gap: 0; } }
            `}</style>
        </div>
    );
}

export default CreateProveedor;
