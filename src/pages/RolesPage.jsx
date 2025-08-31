import { useState, useEffect } from 'react';
import './UsuariosPage.css';
import { FaSearch, FaPlus, FaEye, FaEdit, FaTrash } from 'react-icons/fa';
import Nav from '../components/Nav.jsx';
import { Link } from 'react-router-dom';
import Footer from '../components/Footer.jsx';
import DetallesRol from '../components/DetallesRol.jsx';
import DeleteRol from './DeleteRol.jsx';

export default function RolesPage() {
    const [menuCollapsed, setMenuCollapsed] = useState(false);

    // ➡️ Estado para manejar el rol seleccionado para el modal de detalles
    const [rolSeleccionado, setRolSeleccionado] = useState(null);

    // ➡️ Estado para manejar el rol seleccionado para el modal de eliminación
    const [rolAEliminar, setRolAEliminar] = useState(null);

    const toggleMenu = () => {
        setMenuCollapsed(!menuCollapsed);
    };

    const [roles, setRoles] = useState([
        {
            id: '1',
            nombreRol: 'Administrador',
            descripcion: 'Responsable de gestionar y supervisar todos los procesos ',
            estado: true,
            fecha_Creacion: '2025-06-01',
            permisos: {
                'Gestión de Usuarios': ['Gestión de Usuarios'],
                'Gestión de Productos': ['Gestión de Productos'],
                'Gestión de Pedidos': ['Gestión de Pedidos'],
                'Gestión de Roles y Permisos': ['Gestión de Roles'],
                'Gestión de Clientes': ['Gestión de Clientes'],
                'Gestión de Compras': ['Gestión de Compras'],
                'Gestión de Ventas': ['Gestión de Ventas'],
                'Dashboard': ['Ver dashboard con información clave de Compras y Ventas'],
            },
        },
        {
            id: '2',
            nombreRol: 'Cliente',
            descripcion: 'El usuario final que compra en la tienda',
            estado: true,
            fecha_Creacion: '2025-06-09',
            permisos: {
                'Gestión de Perfil': ['Gestión de Perfil'],
                'Gestión de Compras': ['Gestión de Compras'],
            },
        },
    ]);

    const toggleEstadoRol = (idRol) => {
        setRoles(prev =>
            prev.map(r =>
                r.id === idRol ? { ...r, estado: !r.estado } : r
            )
        );
    };

    const [searchTerm, setSearchTerm] = useState('');

    const filteredRoles = roles.filter(rol =>
        Object.values(rol).some(value =>
            String(value).toLowerCase().includes(searchTerm.toLowerCase())
        )
    );

    // ➡️ Funciones para abrir y cerrar el modal de DetallesRol
    const handleVerDetalles = (rol) => {
        setRolSeleccionado(rol);
    };

    const handleCerrarModal = () => {
        setRolSeleccionado(null);
    };

    // ➡️ Funciones para el modal de eliminación
    const handleAbrirModalEliminar = (rol) => {
        setRolAEliminar(rol);
    };

    const handleCerrarModalEliminar = () => {
        setRolAEliminar(null);
    };

    const handleConfirmarEliminar = (rol) => {
        // Lógica para eliminar el rol del estado
        setRoles(prev => prev.filter(r => r.id !== rol.id));
        setRolAEliminar(null); // Cierra el modal después de la acción
        alert(`Rol '${rol.nombreRol}' eliminado correctamente.`);
    };

    return (
        <div className="container">
            <Nav menuCollapsed={menuCollapsed} toggleMenu={toggleMenu} />

            <div className={`main-content-area ${menuCollapsed ? 'expanded-margin' : ''}`}>
                <div className="header">
                    <div className="header-left">
                        <h1>Gestión de Roles</h1>
                    </div>
                </div>

                <div className="actions">
                    <div className="search-container">
                        <input
                            type="text"
                            placeholder="Buscar Roles"
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                        />
                        <button className="search-button">
                            <FaSearch color="#fff" /> Buscar
                        </button>
                    </div>

                    <Link className="add-button" to="/formroles">
                        <FaPlus style={{ marginRight: '8px', color: "#fff" }} />
                        Agregar Rol
                    </Link>
                </div>

                <div className="table-container">
                    <table>
                        <thead>
                            <tr>
                                <th>Nombre Rol</th>
                                <th>Descripción</th>
                                <th>Estado</th>
                                <th>Acciones</th>
                            </tr>
                        </thead>
                        <tbody>
                            {filteredRoles.map(rol => (
                                <tr key={rol.id}>
                                    <td>{rol.nombreRol}</td>
                                    <td>{rol.descripcion}</td>
                                    <td>
                                        <label className="switch">
                                            <input
                                                type="checkbox"
                                                checked={rol.estado}
                                                onChange={() => toggleEstadoRol(rol.id)}
                                            />
                                            <span className="slider round"></span>
                                        </label>
                                    </td>
                                    <td className="icons">
                                        <button
                                            onClick={() => handleVerDetalles(rol)}
                                            className="icon-button black"
                                            title="Ver detalles del rol"
                                        >
                                            <FaEye />
                                        </button>
                                        <Link
                                            to="/editarRol"
                                            state={{ rol }}
                                            className="icon-button blue"
                                            title="Editar"
                                        >
                                            <FaEdit />
                                        </Link>
                                        {/* ➡️ Botón para abrir el modal de eliminación */}
                                        <button
                                            className="icon-button red"
                                            title="Eliminar"
                                            onClick={() => handleAbrirModalEliminar(rol)}
                                        >
                                            <FaTrash />
                                        </button>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
                <div className="footer-productos-page"> <Footer /></div>
            </div>

            {/* ➡️ Renderizado condicional del modal de detalles */}
            {rolSeleccionado && (
                <DetallesRol rol={rolSeleccionado} onClose={handleCerrarModal} />
            )}

            {/* ➡️ Renderizado condicional del modal de eliminación */}
            {rolAEliminar && (
                <DeleteRol
                    rol={rolAEliminar}
                    onClose={handleCerrarModalEliminar}
                    onConfirm={handleConfirmarEliminar}
                />
            )}
        </div>
    );
}