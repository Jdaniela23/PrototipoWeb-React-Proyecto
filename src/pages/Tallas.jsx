import React, { useState, useEffect, useCallback } from 'react';
import './Page.css';
import { FaSearch, FaPlus, FaEdit, FaTrash, FaEye } from 'react-icons/fa';
import Nav from '../components/Nav.jsx';
import { Link } from 'react-router-dom';
import Footer from '../components/Footer.jsx';
import { getTallas, deleteTalla } from '../api/tallasService';
import ToastNotification from '../components/ToastNotification.jsx';
import DeleteTalla from './DeleteTallas.jsx'; 
import DetallesTalla from '../components/DetallesTalla.jsx'; // 👈 Modal detalles

export default function TallasPage() {
    const [allTallas, setAllTallas] = useState([]);
    const [filteredTallas, setFilteredTallas] = useState([]);
    const [searchTerm, setSearchTerm] = useState('');
    const [menuCollapsed, setMenuCollapsed] = useState(false);

    const [successMessage, setSuccessMessage] = useState(null);
    const [errorMessage, setErrorMessage] = useState(null);
    const [loading, setLoading] = useState(true);

    const [selectedTalla, setSelectedTalla] = useState(null);
    const [showDeleteModal, setShowDeleteModal] = useState(false);
    const [showDetalleModal, setShowDetalleModal] = useState(false); // 👈 Nuevo estado detalles

    const toggleMenu = () => setMenuCollapsed(!menuCollapsed);

    // === CARGAR TALLAS ===
    const fetchTallas = useCallback(async () => {
        setLoading(true);
        try {
            const data = await getTallas();
            setAllTallas(data);
        } catch (err) {
            console.error(err);
            setErrorMessage("No se pudieron cargar las tallas.");
        } finally {
            setLoading(false);
        }
    }, []);

    useEffect(() => {
        fetchTallas();
    }, [fetchTallas]);

    // === FILTRADO ===
    useEffect(() => {
        const results = allTallas.filter(talla =>
            Object.values(talla).some(value =>
                String(value).toLowerCase().includes(searchTerm.toLowerCase())
            )
        );
        setFilteredTallas(results);
    }, [searchTerm, allTallas]);

    // === ABRIR MODAL DE ELIMINAR ===
    const handleEliminarTalla = (talla) => {
        setSelectedTalla(talla);
        setShowDeleteModal(true);
    };

    // === ABRIR MODAL DE DETALLES ===
    const handleVerDetalles = (talla) => {
        setSelectedTalla(talla);
        setShowDetalleModal(true);
    };

    // === CONFIRMAR ELIMINACIÓN ===
    const handleConfirmDelete = async (talla) => {
        try {
            await deleteTalla(talla.id_Talla);
            setShowDeleteModal(false);
            setSelectedTalla(null);
            await fetchTallas();
            setSuccessMessage(`Talla '${talla.nombre_Talla}' eliminada correctamente.`);
            setErrorMessage(null);
        } catch (err) {
            console.error(err);
            setErrorMessage(`No se pudo eliminar la talla '${talla.nombre_Talla}'.`);
            setSuccessMessage(null);
        }
    };

    return (
        <div className="page-wrapper">
            <div className="container">
                <Nav menuCollapsed={menuCollapsed} toggleMenu={toggleMenu} />

                <div className={`main-content-area ${menuCollapsed ? 'expanded-margin' : ''}`}>
                    <div className="header">
                        <div className="header-left">
                            <h1>Gestión de Tallas</h1>
                        </div>
                    </div>

                    <div className="actions">
                        <div className="search-container">
                            <input
                                type="text"
                                placeholder="Buscar Tallas"
                                value={searchTerm}
                                onChange={(e) => setSearchTerm(e.target.value)}
                            />
                            <button className="search-button">
                                <FaSearch color="#fff" />
                            </button>
                        </div>

                        <Link className="add-button" to="/createtalla">
                            <FaPlus style={{ marginRight: '8px', color: "#fff" }} />
                            Agregar Talla
                        </Link>
                    </div>

                    <div className="table-container">
                        <div className="table-wrapper">
                            <table>
                                <thead>
                                    <tr>
                                        <th style={{ textAlign: 'left' }}>Nombre</th>
                                        <th style={{ textAlign: 'left' }}>Descripción</th>
                                        <th style={{ textAlign: 'center' }}>Acciones</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {loading ? (
                                        <tr>
                                            <td colSpan="3" style={{ textAlign: 'center', padding: '20px' }}>
                                                Cargando tallas...
                                            </td>
                                        </tr>
                                    ) : filteredTallas.length > 0 ? (
                                        filteredTallas.map(talla => (
                                            <tr key={talla.id_Talla}>
                                                <td>{talla.nombre_Talla}</td>
                                                <td>{talla.descripcion}</td>
                                                <td style={{ display: 'flex', justifyContent: 'center', gap: '8px' }}>
                                                    <Link
                                                       to={`/edittalla/${talla.id_Talla}`}
                                                        state={{ talla }}
                                                        className="icon-button blue"
                                                        title="Editar"
                                                    >
                                                        <FaEdit />
                                                    </Link>
                                                    <button
                                                        className="icon-button red"
                                                        title="Eliminar"
                                                        onClick={() => handleEliminarTalla(talla)}
                                                    >
                                                        <FaTrash />
                                                    </button>
                                                    <button
                                                        className="icon-button black"
                                                        title="Ver detalles"
                                                        onClick={() => handleVerDetalles(talla)}
                                                    >
                                                        <FaEye />
                                                    </button>
                                                </td>
                                            </tr>
                                        ))
                                    ) : (
                                        <tr>
                                            <td colSpan="3" style={{ textAlign: 'center', padding: '20px' }}>
                                                No se encontraron tallas.
                                            </td>
                                        </tr>
                                    )}
                                </tbody>
                            </table>
                        </div>
                    </div>

                    <div className='footer-page'>
                        <Footer />
                    </div>
                </div>
            </div>

            {/* MODAL ELIMINACIÓN */}
            {showDeleteModal && selectedTalla && (
                <DeleteTalla
                    talla={selectedTalla}
                    onClose={() => setShowDeleteModal(false)}
                    onConfirm={handleConfirmDelete}
                />
            )}

            {/* MODAL DETALLES */}
            {showDetalleModal && selectedTalla && (
                <DetallesTalla
                    talla={selectedTalla}
                    onClose={() => setShowDetalleModal(false)}
                />
            )}

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
