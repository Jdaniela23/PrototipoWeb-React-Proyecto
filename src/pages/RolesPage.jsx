import { useState, useEffect } from 'react';
import './Page.css';
import { FaSearch, FaPlus, FaEye, FaEdit, FaTrash } from 'react-icons/fa';
import Nav from '../components/Nav.jsx';
import { Link, useLocation } from 'react-router-dom';
import Footer from '../components/Footer.jsx';
import DetallesRol from '../components/DetallesRol.jsx';
import DeleteRol from './DeleteRol.jsx';
import { getRoles, updateRol, deleteRol } from '../api/rolesService.js';
import ToastNotification from '../components/ToastNotification.jsx';

export default function RolesPage() {
    const location = useLocation();
    const navSuccessMessage = location.state?.successMessage;

    // ESTADOS
    const [menuCollapsed, setMenuCollapsed] = useState(false);
    const [rolSeleccionado, setRolSeleccionado] = useState(null); 
    const [rolAEliminar, setRolAEliminar] = useState(null);
    const [roles, setRoles] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [searchTerm, setSearchTerm] = useState('');
    const [successMessage, setSuccessMessage] = useState(navSuccessMessage || null);
    const [errorMessage, setErrorMessage] = useState(null);

    const toggleMenu = () => {
        setMenuCollapsed(!menuCollapsed);
    };

    // === CARGA INICIAL DE ROLES ===
    useEffect(() => {
        const fetchRoles = async () => {
            try {
                const data = await getRoles();

                const mappedRoles = data.map(r => ({
                    id: r.id_Rol,
                    nombreRol: r.nombre_Rol,
                    descripcion: r.descripcion_Rol || '',
                    estado: r.estado_Rol,
                    permisos: r.permisos || [],
                    fecha_Creacion: r.fecha_Creacion || 'N/A'
                }));

                setRoles(mappedRoles);
                setError(null);
            } catch (err) {
                console.error("Error al cargar roles:", err);
                setError(err.message || "Error desconocido al cargar los roles.");
                setErrorMessage(err.message);
                setSuccessMessage(null);
            } finally {
                setLoading(false);
            }
        };
        fetchRoles();
    }, []);

    // === TOGGLE ESTADO (ACTIVAR/DESACTIVAR) ===
    const toggleEstadoRol = async (idRol) => {
        const rolActual = roles.find(r => r.id === idRol);
        if (!rolActual) return;

        const nuevoEstado = !rolActual.estado;

        try {
            // 👇 Mapeo PascalCase para el backend
            const rolActualizado = {
                Id_Rol: rolActual.id,
                Nombre_Rol: rolActual.nombreRol,
                Descripcion_Rol: rolActual.descripcion,
                Estado_Rol: nuevoEstado,
                // 🔑 Enviar permisos como array de strings (ej: ["Usuarios_Leer", "Usuarios_Crear"])
                Permisos: Object.entries(rolActual.permisos || {}).flatMap(([modulo, acciones]) =>
                    acciones.map((accion) => `${modulo}_${accion}`)
                ),
            };

            await updateRol(rolActualizado);

            setRoles(prevRoles =>
                prevRoles.map(r => r.id === idRol ? { ...r, estado: nuevoEstado } : r)
            );

            setSuccessMessage(
                `El estado del rol '${rolActual.nombreRol}' se actualizó a ${nuevoEstado ? 'Activo' : 'Inactivo'}.`
            );
            setErrorMessage(null);
        } catch (err) {
            console.error("Error al cambiar estado:", err);
            setErrorMessage(`Error al actualizar el rol '${rolActual.nombreRol}'.`);
            setSuccessMessage(null);
        }
    };

    // === ELIMINAR ROL ===
    const handleConfirmarEliminar = async (rol) => {
        try {
            await deleteRol(rol.id);

            setRoles(prevRoles => prevRoles.filter(r => r.id !== rol.id));
            setRolAEliminar(null);

            setSuccessMessage(`El rol '${rol.nombreRol}' fue eliminado con éxito.`);
            setErrorMessage(null);
        } catch (err) {
            console.error("Error al eliminar:", err);
            setErrorMessage(`No se pudo eliminar el rol '${rol.nombreRol}'.`);
            setSuccessMessage(null);
        }
    };

    // === MANEJO DE MODALES ===
    const handleVerDetalles = (rol) => setRolSeleccionado(rol);
    const handleCerrarDetalles = () => setRolSeleccionado(null);

    const handleAbrirModalEliminar = (rol) => setRolAEliminar(rol);
    const handleCerrarModalEliminar = () => setRolAEliminar(null);

    // === FILTRADO ===
    const filteredRoles = roles.filter(rol =>
        Object.values(rol).some(value =>
            String(value).toLowerCase().includes(searchTerm.toLowerCase())
        )
    );

    // === RENDER TABLA ===
    const renderTable = () => {
        if (loading) return (
            <tr><td colSpan="4" className="loading-message">Cargando roles...</td></tr>
        );
        if (error && filteredRoles.length === 0) return (
            <tr><td colSpan="4" className="error-message">Error: {error}</td></tr>
        );
        if (filteredRoles.length === 0) return (
            <tr><td colSpan="4" className="no-data-message">No se encontraron roles.</td></tr>
        );

        return filteredRoles.map(rol => (
            <tr key={rol.id}>
                <td>{rol.nombreRol}</td>
                <td>{rol.descripcion}</td>
                <td title={rol.estado ? "Activo" : "Inactivo"}>
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
                        title="Ver detalles"
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
                    <button
                        className="icon-button red"
                        title="Eliminar"
                        onClick={() => handleAbrirModalEliminar(rol)}
                    >
                        <FaTrash />
                    </button>
                </td>
            </tr>
        ));
    };

    return (
        <div className="container">
            <Nav menuCollapsed={menuCollapsed} toggleMenu={toggleMenu} />

            <div className={`main-content-area ${menuCollapsed ? 'expanded-margin' : ''}`}>
                {error && !loading && <div className="alert alert-error">{error}</div>}

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
                            <FaSearch color="#fff" size={15}  /> 
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
                            {renderTable()}
                        </tbody>
                    </table>
                </div>
                
                <div className="footer-page"> 
                    <Footer />
                </div>
            </div>

            {/* MODAL DETALLES */}
            {rolSeleccionado && (
                <DetallesRol rol={rolSeleccionado} onClose={handleCerrarDetalles} />
            )}

            {/* MODAL ELIMINACIÓN */}
            {rolAEliminar && (
                <DeleteRol
                    rol={rolAEliminar}
                    onClose={handleCerrarModalEliminar}
                    onConfirm={handleConfirmarEliminar}
                />
            )}

            {/* TOASTS */}
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
    );
}
