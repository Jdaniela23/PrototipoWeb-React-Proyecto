import React, { useState } from 'react';
import './FormAdd.css';
import Nav from '../components/Nav.jsx';
import { useNavigate } from 'react-router-dom';
import { FaSave } from 'react-icons/fa';

function EditProveedor() {
    const toggleMenu = () => {
        setMenuCollapsed(!menuCollapsed);
    };
    const [menuCollapsed, setMenuCollapsed] = useState(false);
    const navigate = useNavigate();

    const [proveedorData, setProveedorData] = useState({
        id: 1,
        idProveedor: 'P-001',
        nombreRepresentante: 'Carlos',
        apellidoRepresentante: 'Gómez',
        numeroContacto: '3101234567',
        tipoDocumento: 'CC',
        numeroDocumento: '123456789',
        correoElectronico: 'carlos.gomez@proveedor.com',
        estado: 'activo',
        municipio: 'Bogotá',
        direccion: 'Calle 123 #45-67',
        img: 'https://placehold.co/150x150/E0BBE4/FFFFFF?text=Prov1'
    });

    const municipiosColombia = [
        'Bogotá', 'Medellín', 'Cali', 'Barranquilla', 'Cartagena',
        'Bucaramanga', 'Pereira', 'Manizales', 'Armenia', 'Ibagué'
    ];

    const handleChange = (e) => {
        const { name, value } = e.target;
        setProveedorData({
            ...proveedorData,
            [name]: value,
        });
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        console.log('Datos actualizados:', proveedorData);
        alert('Proveedor actualizado exitosamente!');
        navigate('/proveedores');
    };

    return (
        <div className="role-form-container">
            <Nav menuCollapsed={menuCollapsed} toggleMenu={toggleMenu} />

            <div className={`formulario-rol-main-content-area ${menuCollapsed ? 'expanded-margin' : ''}`}>
                <div className="formulario-roles">
                    <h1 className="form-title">Editar Proveedor</h1>
                    <p className="form-info">Modifique los campos que desee actualizar</p>
                    <br /><br />

                    <form onSubmit={handleSubmit} className="role-form">
                        {/* Fila 1 */}
                        <div className="form-row">
                            <div className="form-group">
                                <label className="label-heading">ID Proveedor:</label>
                                <input
                                    type="text"
                                    name="idProveedor"
                                    value={proveedorData.idProveedor}
                                    onChange={handleChange}
                                    className="input-field"
                                    disabled
                                />
                            </div>

                            <div className="form-group">
                                <label className="label-heading">Estado: <span className="required-asterisk">*</span></label>
                                <select
                                    name="estado"
                                    value={proveedorData.estado}
                                    onChange={handleChange}
                                    className="barrio-select"
                                >
                                    <option value="activo">Activo</option>
                                    <option value="inactivo">Inactivo</option>
                                </select>
                            </div>
                        </div>

                        {/* Fila 2 */}
                        <div className="form-row">
                            <div className="form-group">
                                <label className="label-heading">Nombre Representante:  <span className="required-asterisk">*</span></label>
                                <input
                                    type="text"
                                    name="nombreRepresentante"
                                    value={proveedorData.nombreRepresentante}
                                    onChange={handleChange}
                                    className="input-field"
                                />
                            </div>

                            <div className="form-group">
                                <label className="label-heading">Apellido Representante:  <span className="required-asterisk">*</span></label>
                                <input
                                    type="text"
                                    name="apellidoRepresentante"
                                    value={proveedorData.apellidoRepresentante}
                                    onChange={handleChange}
                                    className="input-field"
                                />
                            </div>
                        </div>

                        {/* Fila 3 */}
                        <div className="form-row">
                            <div className="form-group">
                                <label className="label-heading">Número de Contacto:  <span className="required-asterisk">*</span></label>
                                <input
                                    type="text"
                                    name="numeroContacto"
                                    value={proveedorData.numeroContacto}
                                    onChange={handleChange}
                                    className="input-field"
                                />
                            </div>

                            <div className="form-group">
                                <label className="label-heading">Tipo Documento: <span className="required-asterisk">*</span></label>
                                <select
                                    name="tipoDocumento"
                                    value={proveedorData.tipoDocumento}
                                    onChange={handleChange}
                                    className="barrio-select"
                                >
                                    <option value="CC">Cédula</option>
                                    <option value="CE">Extranjería</option>
                                    <option value="NIT">NIT</option>
                                </select>
                            </div>

                            <div className="form-group">
                                <label className="label-heading">Número de Documento: <span className="required-asterisk">*</span></label>
                                <input
                                    type="text"
                                    name="numeroDocumento"
                                    value={proveedorData.numeroDocumento}
                                    onChange={handleChange}
                                    className="input-field"
                                />
                            </div>
                        </div>

                        {/* Fila 4 */}
                        <div className="form-row">
                            <div className="form-group">
                                <label className="label-heading">Correo Electrónico: <span className="required-asterisk">*</span></label>
                                <input
                                    type="text"
                                    name="correoElectronico"
                                    value={proveedorData.correoElectronico}
                                    onChange={handleChange}
                                    className="input-field"
                                />
                            </div>

                            <div className="form-group">
                                <label htmlFor="municipio" className="label-heading">Ciudad: <span className="required-asterisk">*</span></label>
                                <select
                                    id="municipio"
                                    name="municipio"
                                    value={proveedorData.municipio}
                                    onChange={handleChange}
                                    className="barrio-select"
                                >
                                    <option value="">Medellín</option>
                                    {municipiosColombia.map((municipio, index) => (
                                        <option key={index} value={municipio}>{municipio}</option>
                                    ))}
                                </select>
                            </div>
                        </div>

                        {/* Fila 5 */}
                        <div className="form-row">
                            <div className="form-group">
                                <label className="label-heading">Dirección: <span className="required-asterisk">*</span></label>
                                <input
                                    type="text"
                                    name="direccion"
                                    value={proveedorData.direccion}
                                    onChange={handleChange}
                                    className="input-field"
                                />
                            </div>
                        </div>

                        {/* Botones */}
                        <div className="form-buttons">
                            <button
                                type="button"
                                className="cancel-button"
                                onClick={() => navigate('/proveedores')}
                            >
                                Cancelar
                            </button>
                            <button type="submit" className="save-button">
                                <FaSave /> Actualizar
                            </button>
                        </div>
                    </form>
                </div>
            </div>
        </div>
    );
}

export default EditProveedor; 