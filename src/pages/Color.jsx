import React, { useState, useEffect, useCallback } from 'react';
import './Page.css';
import { FaSearch, FaPlus, FaEdit, FaTrash, FaEye } from 'react-icons/fa';
import Nav from '../components/Nav.jsx';
import { Link } from 'react-router-dom';
import Footer from '../components/Footer.jsx';
import { getColores, deleteColor } from '../api/colorsService';
import ToastNotification from '../components/ToastNotification.jsx';
import DeleteColor from './DeleteColor.jsx';
import DetallesColor from '../components/DetallesColor.jsx';

export default function ColoresPage() {
    const [allColores, setAllColores] = useState([]);
    const [filteredColores, setFilteredColores] = useState([]);
    const [searchTerm, setSearchTerm] = useState('');
    const [menuCollapsed, setMenuCollapsed] = useState(false);

    const [successMessage, setSuccessMessage] = useState(null);
    const [errorMessage, setErrorMessage] = useState(null);
    const [loading, setLoading] = useState(true);

    const [selectedColor, setSelectedColor] = useState(null);
    const [showDeleteModal, setShowDeleteModal] = useState(false);
    const [showDetalleModal, setShowDetalleModal] = useState(false);

    const toggleMenu = () => setMenuCollapsed(!menuCollapsed);

    // === CARGAR COLORES ===
    const fetchColores = useCallback(async () => {
        setLoading(true);
        try {
            const data = await getColores();
            setAllColores(data);
        } catch (err) {
            console.error(err);
            setErrorMessage("No se pudieron cargar los colores.");
        } finally {
            setLoading(false);
        }
    }, []);

    useEffect(() => {
        fetchColores();
    }, [fetchColores]);

    // === FILTRADO ===
    useEffect(() => {
        const results = allColores.filter(color =>
            Object.values(color).some(value =>
                String(value).toLowerCase().includes(searchTerm.toLowerCase())
            )
        );
        setFilteredColores(results);
    }, [searchTerm, allColores]);

    // === ABRIR MODAL DE ELIMINAR ===
    const handleEliminarColor = (color) => {
        setSelectedColor(color);
        setShowDeleteModal(true);
    };

    // === CONFIRMAR ELIMINACIÓN ===
    const handleConfirmDelete = async (color) => {
        try {
            await deleteColor(color.id_Color);
            
            // Lógica de éxito
            setShowDeleteModal(false);
            setSelectedColor(null);
            await fetchColores();
            setSuccessMessage(`Color '${color.nombre_Color}' eliminado correctamente.`);
            setErrorMessage(null);

        } catch (err) {
            console.error(err);
            // Este 'err.message' ahora contiene el mensaje detallado del backend (DbUpdateException)
            const messageToShow = err.message || `No se pudo eliminar el color '${color.nombre_Color}'. Error desconocido.`;

            setErrorMessage(messageToShow);
            setSuccessMessage(null);
        }
    };

    // === ABRIR MODAL DE DETALLES ===
    const handleVerDetalles = (color) => {
        setSelectedColor(color);
        setShowDetalleModal(true);
    };
    const [currentPage, setCurrentPage] = useState(1);
        const recordsPerPage = 7;
    
        // === LÓGICA DE PAGINACIÓN ===
        const indexOfLastRecord = currentPage * recordsPerPage;
        const indexOfFirstRecord = indexOfLastRecord - recordsPerPage;
        const currentRecords = filteredColores.slice(indexOfFirstRecord, indexOfLastRecord);
        const totalPages = Math.ceil(filteredColores.length / recordsPerPage);
    
        const handlePageChange = (pageNumber) => {
            setCurrentPage(pageNumber);
        };
    
        const handlePrevPage = () => {
            if (currentPage > 1) setCurrentPage(currentPage - 1);
        };
    
        const handleNextPage = () => {
            if (currentPage < totalPages) setCurrentPage(currentPage + 1);
        };

    return (
        <div className="page-wrapper">
            <div className="container">
                <Nav menuCollapsed={menuCollapsed} toggleMenu={toggleMenu} />

                <div className={`main-content-area ${menuCollapsed ? 'expanded-margin' : ''}`}>
                    <div className="header">
                        <div className="header-left">
                            <h1>Gestión de Colores</h1>
                        </div>
                    </div>

                    <div className="actions">
                        <div className="search-container">
                            <input
                                type="text"
                                placeholder="Buscar Colores"
                                value={searchTerm}
                                onChange={(e) => setSearchTerm(e.target.value)}
                            />
                            <button className="search-button">
                                <FaSearch color="#fff" />
                            </button>
                        </div>

                        <Link className="add-button" to="/createcolor">
                            <FaPlus style={{ marginRight: '8px', color: "#fff" }} />
                            Agregar Color
                        </Link>
                    </div>

                    <div className="table-container">
                        <div className="table-wrapper">
                            <table>
                                <thead>
                                    <tr>
                                        <th style={{ textAlign: 'left' }}>Nombre</th>
                                        <th style={{ textAlign: 'left' }}>Descripción</th>
                                        <th style={{ textAlign: 'left' }}>Color</th>
                                        <th style={{ textAlign: 'center' }}>Acciones</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {loading ? (
                                        <tr>
                                            <td colSpan="4" style={{ textAlign: 'center', padding: '20px' }}>
                                                Cargando colores...
                                            </td>
                                        </tr>
                                    ) : currentRecords.length > 0 ? (
                                        currentRecords.map(color => (
                                            <tr key={color.id_Color}>
                                                <td>{color.nombre_Color}</td>
                                                <td>{color.descripcion}</td>
                                                <td>
                                                    <span style={{
                                                        display: 'inline-block',
                                                        width: '21px',
                                                        height: '21px',
                                                        borderRadius: '50%',
                                                        backgroundColor: color.hex_color || '#ccc',
                                                        border: '1px solid #504f4fff'
                                                    }} />
                                                </td>
                                                <td style={{ display: 'flex', justifyContent: 'center', gap: '8px' }}>
                                                    <Link
                                                        to={`/editcolor/${color.id_Color}`}
                                                        state={{ color }}
                                                        className="icon-button blue"
                                                        title="Editar"
                                                    >
                                                        <FaEdit />
                                                    </Link>
                                                    <button
                                                        className="icon-button red"
                                                        title="Eliminar"
                                                        onClick={() => handleEliminarColor(color)}
                                                    >
                                                        <FaTrash />
                                                    </button>
                                                    <button
                                                        className="icon-button black"
                                                        title="Ver detalles"
                                                        onClick={() => handleVerDetalles(color)}
                                                    >
                                                        <FaEye />
                                                    </button>
                                                </td>
                                            </tr>
                                        ))
                                    ) : (
                                        <tr>
                                            <td colSpan="4" style={{ textAlign: 'center', padding: '20px' }}>
                                                No se encontraron colores.
                                            </td>
                                        </tr>
                                    )}
                                </tbody>
                            </table>
                             {filteredColores.length > recordsPerPage && (
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
            </div>

            {/* MODAL ELIMINACIÓN */}
            {showDeleteModal && selectedColor && (
                <DeleteColor
                    color={selectedColor}
                    onClose={() => setShowDeleteModal(false)}
                    onConfirm={handleConfirmDelete}
                />
            )}

            {/* MODAL DETALLES */}
            {showDetalleModal && selectedColor && (
                <DetallesColor
                    color={selectedColor}
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
