import  { useState, useEffect } from 'react';
import './UsuariosPage.css';
import {  FaSearch, FaPlus, FaEye, FaEdit, FaTrash } from 'react-icons/fa';
import Nav from '../components/Nav.jsx';
import { Link } from 'react-router-dom';
import Footer from '../components/Footer.jsx';
import DetallesUser from '../components/DetallesUser.jsx';
import DeleteUser from './DeleteUsuarios.jsx'; 

export default function UsuariosPage() {

    // ➡️ Estado para el modal de eliminación
    const [usuarioAEliminar, setUsuarioAEliminar] = useState(null);

    const [allUsers, setAllUsers] = useState([
        {
            id: '010',
            nombre_Completo: 'Luisa Maria',
            nombreUsuario: 'Luisa_29',
            apellido: 'Lemus velez',
            correo: 'Luisa@gmail.com',
            estado: true,
            rol: 'Administrador',
            foto: 'src/assets/foto-perfil.jpeg',
            tipo_Identificacion: 'Cedula de Ciudadanía',
            numero_Identificacion: '1020410318',
            numero_Contacto: '3247890361',
            barrio: 'Bellavista',
            direccion: 'Calle 67 #35C 78',
            fecha_Creacion: '2024-05-01'
        },
        {
            id: '020',
            nombre_Completo: 'Jenifer Daniela',
            nombreUsuario: 'jenifer23',
            apellido: 'Vergara Serna',
            correo: 'Jenifer@gmail.com',
            estado: true,
            rol: 'Cliente',
            foto: 'src/assets/foto-perfil.jpeg',
            tipo_Identificacion: 'Cedula de Ciudadanía',
            numero_Identificacion: '1020410318',
            numero_Contacto: '3242807261',
            barrio: 'Trapiche',
            direccion: 'Calle 67 #35C 78',
            fecha_Creacion: '2024-05-01'
        },

    ]);

    const [searchTerm, setSearchTerm] = useState('');
    const [filteredUsuarios, setFilteredUsuarios] = useState(allUsers);
    const [menuCollapsed, setMenuCollapsed] = useState(false);

    // ➡️ Estado para manejar la apertura y cierre del modal de detalles
    const [usuarioSeleccionado, setUsuarioSeleccionado] = useState(null);

    // useEffect para el filtrado de usuarios
    useEffect(() => {
        const results = allUsers.filter(usuario =>
            Object.values(usuario).some(value =>
                String(value).toLowerCase().includes(searchTerm.toLowerCase())
            )
        );
        setFilteredUsuarios(results);
    }, [searchTerm, allUsers]);

    // Función para cambiar el estado del switch
    const toggleEstadoUsuario = (idUsuario) => {
        setAllUsers(prev =>
            prev.map(u =>
                u.id === idUsuario ? { ...u, estado: !u.estado } : u
            )
        );
    };

    const toggleMenu = () => {
        setMenuCollapsed(!menuCollapsed);
    };

    const handleSearchButtonClick = () => {
        const results = allUsers.filter(usuario =>
            Object.values(usuario).some(value =>
                String(value).toLowerCase().includes(searchTerm.toLowerCase())
            )
        );
        setFilteredUsuarios(results);
    };

    // ➡️ Funciones para abrir y cerrar el modal de detalles
    const handleVerDetalles = (usuario) => {
        setUsuarioSeleccionado(usuario);
    };

    const handleCerrarModal = () => {
        setUsuarioSeleccionado(null);
    };

    // ➡️ Funciones para el modal de eliminación (NUEVAS)
    const handleAbrirModalEliminar = (usuario) => {
        setUsuarioAEliminar(usuario);
    };

    const handleCerrarModalEliminar = () => {
        setUsuarioAEliminar(null);
    };

    const handleConfirmarEliminar = (usuario) => {
        // Lógica para eliminar el usuario del estado
        setAllUsers(prev => prev.filter(u => u.id !== usuario.id));
        setUsuarioAEliminar(null); // Cierra el modal después de la acción
        alert(`Usuario '${usuario.nombreUsuario}' eliminado correctamente.`);
    };

    return (
        <div className="container">
            <Nav menuCollapsed={menuCollapsed} toggleMenu={toggleMenu} />

            <div className={`main-content-area ${menuCollapsed ? 'expanded-margin' : ''}`}>
                <div className="header">
                    <div className="header-left">
                        <h1>Gestión de Usuarios</h1>
                    </div>
                </div>

                <div className="actions">
                    <div className="search-container">
                        <input
                            type="text"
                            placeholder="Buscar Usuarios"
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                        />
                        <button className="search-button" onClick={handleSearchButtonClick}>
                            <FaSearch color="#fff" /> Buscar
                        </button>
                    </div>

                    <Link className="add-button" to="/formuser">
                        <FaPlus style={{ marginRight: '8px', color: "#fff" }} />
                        Agregar Usuario
                    </Link>
                </div>

                <div className="table-container">
                    <div className="table-wrapper">
                        <table>
                            <thead>
                                <tr>
                                    <th>Nombre Usuario</th>
                                    <th>Correo Electrónico</th>
                                    <th>Estado</th>
                                    <th>Rol</th>
                                    <th>Acciones</th>
                                </tr>
                            </thead>
                            <tbody>
                                {filteredUsuarios.length > 0 ? (
                                    filteredUsuarios.map(u => (
                                        <tr key={u.id}>
                                            <td>{u.nombreUsuario}</td>
                                            <td>{u.correo}</td>
                                            <td>
                                                <label className="switch">
                                                    <input
                                                        type="checkbox"
                                                        checked={u.estado}
                                                        onChange={() => toggleEstadoUsuario(u.id)}
                                                    />
                                                    <span className="slider round"></span>
                                                </label>
                                            </td>
                                            <td>{u.rol}</td>
                                            <td className="icons">
                                                {/* ➡️ Botón para abrir el modal */}
                                                <button onClick={() => handleVerDetalles(u)} className="icon-button black">
                                                    <FaEye />
                                                </button>
                                                <Link
                                                    to="/editarUsuario"
                                                    state={{ usuario: u }}
                                                    className="icon-button blue"
                                                    title="Editar"
                                                >
                                                    <FaEdit />
                                                </Link>
                                                {/* ➡️ Botón que abre el modal de eliminación  */}
                                                <button
                                                    className="icon-button red"
                                                    title="Eliminar"
                                                    onClick={() => handleAbrirModalEliminar(u)}
                                                >
                                                    <FaTrash />
                                                </button>
                                            </td>
                                        </tr>
                                    ))
                                ) : (
                                    <tr>
                                        <td colSpan="6" style={{ textAlign: 'center', padding: '20px' }}>
                                            No se encontraron usuarios que coincidan con la búsqueda.
                                        </td>
                                    </tr>
                                )}
                            </tbody>
                        </table>
                    </div>
                </div>
                <div className="footer-productos-page"> <Footer /></div>
            </div>

            {/* ➡️ El modal de detalles se renderiza aquí, fuera de la tabla */}
            {usuarioSeleccionado && (
                <DetallesUser usuario={usuarioSeleccionado} onClose={handleCerrarModal} />
            )}

            {/* ➡️ El modal de eliminación se renderiza aquí  */}
            {usuarioAEliminar && (
                <DeleteUser
                    usuario={usuarioAEliminar}
                    onClose={handleCerrarModalEliminar}
                    onConfirm={handleConfirmarEliminar}
                />
            )}
        </div>
    );
}