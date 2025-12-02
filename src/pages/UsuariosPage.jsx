import { useState, useEffect } from 'react';
import './Page.css';
import { FaSearch, FaPlus, FaEye, FaEdit, FaTrash } from 'react-icons/fa';
import Nav from '../components/Nav.jsx';
import { Link, useLocation } from 'react-router-dom';
import Footer from '../components/Footer.jsx';
import DetallesUser from '../components/DetallesUser.jsx';
import DeleteUser from './DeleteUsuarios.jsx';
import { getAllUsers, deleteUser, toggleUserState } from '../api/usersService.js';
import ToastNotification from '../components/ToastNotification.jsx';

export default function UsuariosPage() {

    const location = useLocation();
    const navSuccessMessage = location.state?.successMessage;

    // ESTADOS
    const [menuCollapsed, setMenuCollapsed] = useState(false);
    const [usuarios, setUsuarios] = useState([]);
    const [usuarioSeleccionado, setUsuarioSeleccionado] = useState(null);
    const [usuarioAEliminar, setUsuarioAEliminar] = useState(null);

    // Estados de API/UI
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [searchTerm, setSearchTerm] = useState('');
    const [successMessage, setSuccessMessage] = useState(navSuccessMessage || null);
    const [errorMessage, setErrorMessage] = useState(null);


    const toggleMenu = () => {
        setMenuCollapsed(!menuCollapsed);
    };

    const fetchUsuarios = async () => {
        setLoading(true);
        try {
            const data = await getAllUsers();
            const mappedUsers = data.map(u => ({
                id: u.id_Usuario,
                nombre_Completo: u.nombre_Completo,
                nombreUsuario: u.nombre_Usuario,
                apellido: u.apellido,
                correo: u.email,
                estado: u.estado_Usuario === true,
                rol: u.rol?.nombre_Rol || 'N/A',
                foto: u.foto,
                tipo_Identificacion: u.tipo_Documento,
                numero_Identificacion: u.documento,
                numero_Contacto: u.numeroContacto,
                barrio: u.barrio?.nombre || 'N/A',
                direccion: u.direccion,
                fecha_Creacion: u.fecha_Creacion || 'N/A'
            }));

            setUsuarios(mappedUsers);
            setError(null);
        } catch (err) {
            console.error("Error al cargar usuarios:", err);
            setError(err.message || "Error desconocido al cargar los usuarios.");
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchUsuarios();
    }, []);


    const toggleEstadoUsuario = async (idUsuario) => {
        const usuarioActual = usuarios.find(u => u.id === idUsuario);
        if (!usuarioActual) return;

        // ... (código para determinar nuevoEstadoLogico y nuevoEstadoApi)
        const nuevoEstadoLogico = !usuarioActual.estado;
        const nuevoEstadoApi = nuevoEstadoLogico;

        try {
            await toggleUserState(usuarioActual.id, nuevoEstadoApi);

            setUsuarios(prevUsuarios => prevUsuarios.map(u =>
                u.id === idUsuario ? { ...u, estado: nuevoEstadoLogico } : u
            ));

            setSuccessMessage(`El estado de '${usuarioActual.nombreUsuario}' se ha actualizado a ${nuevoEstadoLogico ? 'Activo' : 'Inactivo'} con éxito.`);
            setErrorMessage(null);

        } catch (err) {
            console.error("Error al cambiar el estado del usuario:", err);

            const serverErrorMessage = err.message || `Error al actualizar el estado de '${usuarioActual.nombreUsuario}'.`;

            setErrorMessage(serverErrorMessage);
            setSuccessMessage(null);
        }
    };

    // ELIMINAR USUARIO (HANDLER DE CONFIRMACIÓN)
    const handleConfirmarEliminar = async (usuario) => {
        try {
            await deleteUser(usuario.id);

            handleCerrarModalEliminar();

            // Actualiza el estado local
            setUsuarios(prevUsuarios => prevUsuarios.filter(u => u.id !== usuario.id));

            setSuccessMessage(`El usuario '${usuario.nombreUsuario}' ha sido eliminado exitosamente.`);
            setErrorMessage(null);

        } catch (err) {
            console.error("Error al eliminar el usuario:", err);
            setErrorMessage(err.message || `Error desconocido al eliminar el usuario '${usuario.nombreUsuario}'.`);
            setSuccessMessage(null);
        }
    }

    // Funciones para modales (Detalles)
    const handleVerDetalles = (usuario) => {
        setUsuarioSeleccionado(usuario);
    };

    const handleCerrarModal = () => {
        setUsuarioSeleccionado(null);
    };

    // Funciones para modales (Eliminar)
    const handleAbrirModalEliminar = (usuario) => {
        setUsuarioAEliminar(usuario);
    };

    const handleCerrarModalEliminar = () => {
        setUsuarioAEliminar(null);
    };

    // Filtrado (basado en el estado `usuarios` real)
    const filteredUsuarios = usuarios.filter(usuario =>
        Object.values(usuario).some(value =>
            String(value).toLowerCase().includes(searchTerm.toLowerCase())
        )
    );
    const [currentPage, setCurrentPage] = useState(1);
    const recordsPerPage = 6;

    // === LÓGICA DE PAGINACIÓN ===
    const indexOfLastRecord = currentPage * recordsPerPage;
    const indexOfFirstRecord = indexOfLastRecord - recordsPerPage;
    const currentRecords = filteredUsuarios.slice(indexOfFirstRecord, indexOfLastRecord);
    const totalPages = Math.ceil(filteredUsuarios.length / recordsPerPage);

    const handlePageChange = (pageNumber) => {
        setCurrentPage(pageNumber);
    };

    const handlePrevPage = () => {
        if (currentPage > 1) setCurrentPage(currentPage - 1);
    };

    const handleNextPage = () => {
        if (currentPage < totalPages) setCurrentPage(currentPage + 1);
    };

    // Renderizado de la tabla
    const renderTable = () => {
        if (loading) return <tr><td colSpan="5" className="loading-message">Cargando usuarios...</td></tr>;
        if (error && currentRecords.length === 0) return <tr><td colSpan="5" className="error-message">Error: {error}</td></tr>;
        if (currentRecords.length === 0) return <tr><td colSpan="5" className="no-data-message">No se encontraron usuarios.</td></tr>;

        return currentRecords.map(u => (
            <tr key={u.id}>
                <td>{u.nombreUsuario}</td>
                <td>{u.correo}</td>
                <td className='estado' title={u.estado ? 'Activo' : 'Inactivo'}>
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
                    <button onClick={() => handleVerDetalles(u)} className="icon-button black" title="Ver detalles">
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
                    <button
                        className="icon-button red"
                        title="Eliminar"
                        onClick={() => handleAbrirModalEliminar(u)}
                    >
                        <FaTrash />
                    </button>
                </td>
            </tr>
        ));
    };

    // RENDERIZADO PRINCIPAL
    return (
        <div className="page-wrapper">
            <div className="container">
                <Nav menuCollapsed={menuCollapsed} toggleMenu={toggleMenu} />

                <div className={`main-content-area ${menuCollapsed ? 'expanded-margin' : ''}`}>

                    {error && loading === false && <div className="alert alert-error">{error}</div>}

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
                                onChange={(e) => {
                                    setSearchTerm(e.target.value);
                                    setCurrentPage(1); 
                                }}
                            />
                            <button className="search-button">
                                <FaSearch color="#fff" />
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
                                    {renderTable()}
                                </tbody>
                            </table>
                            {filteredUsuarios.length > recordsPerPage && (
                                <div className="pagination-container">
                                    <button
                                        className="pagination-arrow"
                                        onClick={handlePrevPage}
                                        disabled={currentPage === 1}
                                    >
                                        ‹
                                    </button>

                                    {[...Array(totalPages)].map((_, index) => (
                                        <button
                                            key={index + 1}
                                            className={`pagination-number ${currentPage === index + 1 ? 'active' : ''}`}
                                            onClick={() => handlePageChange(index + 1)}
                                        >
                                            {index + 1}
                                        </button>
                                    ))}

                                    <button
                                        className="pagination-arrow"
                                        onClick={handleNextPage}
                                        disabled={currentPage === totalPages}
                                    >
                                        ›
                                    </button>
                                </div>
                            )}
                        </div>
                    </div>
             
                </div>

                {/* Modales */}
                {usuarioSeleccionado && (
                    <DetallesUser usuario={usuarioSeleccionado} onClose={handleCerrarModal} />
                )}

                {usuarioAEliminar && (
                    <DeleteUser
                        usuario={usuarioAEliminar}
                        onClose={handleCerrarModalEliminar}
                        onConfirm={handleConfirmarEliminar}
                    />
                )}

                {/* Notificaciones Toast */}
                <ToastNotification
                    message={successMessage}
                    type="success"
                    onClose={() => setSuccessMessage(null)}
                />
                <ToastNotification
                    message={errorMessage}
                    type="error"
                    onClose={() => setErrorMessage(null)}
                />
            </div>
        </div>
    );
}