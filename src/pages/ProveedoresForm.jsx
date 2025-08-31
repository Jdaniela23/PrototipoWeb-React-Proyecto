import React, { useState } from 'react';
import './FormAdd.css';
import Nav from '../components/Nav.jsx';
import { useNavigate } from 'react-router-dom';
import { FaSave} from 'react-icons/fa';

function CreateProveedor() {
    const toggleMenu = () => {
        setMenuCollapsed(!menuCollapsed);
    };
    const [menuCollapsed, setMenuCollapsed] = useState(false);
    const navigate = useNavigate();

    // Estado formulario
    const [proveedorData, setProveedorData] = useState({
        idProveedor: '',
        nombreRepresentante: '',
        apellidoRepresentante: '',
        numeroContacto: '',
        tipoDocumento: 'CC',
        numeroDocumento: '',
        correoElectronico: '',
        estado: 'activo',
        municipio: '',
        direccion: '',
        img: 'https://placehold.co/150x150/E0BBE4/FFFFFF?text=Prov'
    });

    // Lista de municipios de Colombia (ejemplo)
    const municipiosColombia = [
        'Bogotá', 'Cali', 'Barranquilla', 'Cartagena',
        'Bucaramanga', 'Pereira', 'Manizales', 'Armenia', 'Ibagué'
    ];

    // Manejar cambio inputs formulario
    const handleChange = (e) => {
        const { name, value } = e.target;
        setProveedorData({
            ...proveedorData,
            [name]: value,
        });
    };

    // Enviar formulario
    const handleSubmit = (e) => {
        e.preventDefault();
        console.log('Datos del proveedor:', proveedorData);
        alert('Proveedor creado exitosamente!');
        navigate('/proveedores');
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
                            {/* Columna izquierda */}
                            <div className="form-column">
                                <div className="form-group">
                                    <label htmlFor="nombreRepresentante" className="label-heading">Nombre Representante:<span className="required-asterisk">*</span></label>
                                    <input
                                        type="text"
                                        id="nombreRepresentante"
                                        name="nombreRepresentante"
                                        placeholder="Ingresar nombre completo"
                                        value={proveedorData.nombreRepresentante}
                                        onChange={handleChange}
                                        required
                                        className="input-field"
                                    />
                                </div>

                                <div className="form-group">
                                    <label htmlFor="apellidoRepresentante" className="label-heading">Apellido Representante:<span className="required-asterisk">*</span></label>
                                    <input
                                        type="text"
                                        id="apellidoRepresentante"
                                        placeholder="Ingresar apellido"
                                        name="apellidoRepresentante"
                                        value={proveedorData.apellidoRepresentante}
                                        onChange={handleChange}
                                        required
                                        className="input-field"
                                    />
                                </div>

                                <div className="form-group">
                                    <label htmlFor="numeroContacto" className="label-heading">Número de contacto:<span className="required-asterisk">*</span></label>
                                    <input
                                        type="text"
                                        id="numeroContacto"
                                        name="numeroContacto"
                                        placeholder="Ingresar número"
                                        value={proveedorData.numeroContacto}
                                        onChange={handleChange}
                                        required
                                        className="input-field"
                                    />
                                </div>

                                <div className="form-group">
                                    <label htmlFor="correoElectronico" className="label-heading">Correo electrónico:<span className="required-asterisk">*</span></label>
                                    <input
                                        type="text"
                                        id="correoElectronico"
                                        name="correoElectronico"
                                        placeholder="Ingresar @email"
                                        value={proveedorData.correoElectronico}
                                        onChange={handleChange}
                                        required
                                        className="input-field"
                                    />
                                </div>
                            </div>

                            {/* Columna derecha */}
                            <div className="form-column">
                                <div className="form-group">
                                    <label htmlFor="tipoDocumento" className="label-heading">Tipo de Documento:<span className="required-asterisk">*</span></label>
                                    <select
                                        id="tipoDocumento"
                                        name="tipoDocumento"
                                        value={proveedorData.tipoDocumento}
                                        onChange={handleChange}
                                        className="input-field"
                                    >
                                        <option value="CC">Cédula de Ciudadanía</option>
                                        <option value="CE">Cédula de Extranjería</option>
                                        <option value="NIT">NIT</option>
                                        <option value="Pasaporte">Pasaporte</option>
                                        <option value="TI">Tarjeta de Identidad</option>
                                    </select>
                                </div>

                                <div className="form-group">
                                    <label htmlFor="numeroDocumento" className="label-heading">Número de Documento:<span className="required-asterisk">*</span></label>
                                    <input
                                        type="text"
                                        id="numeroDocumento"
                                        name="numeroDocumento"
                                        placeholder="Ingresar número"
                                        value={proveedorData.numeroDocumento}
                                        onChange={handleChange}
                                        required
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

                                <div className="form-group">
                                    <label htmlFor="direccion" className="label-heading">Dirección<span className='required-asterisk'>*</span></label>
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

            {/* Estilos para las columnas y el campo de imagen completo */}
            <style jsx>{`
                .two-columns {
                    display: flex;
                    gap: 30px;
                }
                .form-column {
                    flex: 1;
                }
                .full-width {
                    width: 100%;
                    margin-top: 20px;
                }
                @media (max-width: 768px) {
                    .two-columns {
                        flex-direction: column;
                        gap: 0;
                    }
                }
            `}</style>
        </div>
    );
}

export default CreateProveedor; 