import React, { useState, useEffect, useCallback } from 'react';
import './Page.css';
import { FaSearch, FaPlus, FaEdit, FaTrash, FaEye } from 'react-icons/fa';
import Nav from '../components/Nav.jsx';
import { Link, useLocation } from 'react-router-dom';
import Footer from '../components/Footer.jsx';
import { getTallas, deleteTalla } from '../api/tallasService';
import ToastNotification from '../components/ToastNotification.jsx';
import DeleteTalla from './DeleteTallas.jsx';
import DetallesTalla from '../components/DetallesTalla.jsx'; //Modal detalles

export default function TallasPage() {
    const [allTallas, setAllTallas] = useState([]);
    const [filteredTallas, setFilteredTallas] = useState([]);
    const [searchTerm, setSearchTerm] = useState('');
    const [menuCollapsed, setMenuCollapsed] = useState(false);
    const location = useLocation();
    const [successMessage, setSuccessMessage] = useState(null);
    const [errorMessage, setErrorMessage] = useState(null);
    const [loading, setLoading] = useState(true);

    const [selectedTalla, setSelectedTalla] = useState(null);
    const [showDeleteModal, setShowDeleteModal] = useState(false);
    const [showDetalleModal, setShowDetalleModal] = useState(false); 

    const toggleMenu = () => setMenuCollapsed(!menuCollapsed);

    const [currentPage, setCurrentPage] = useState(1);
    const recordsPerPage = 5;

    // === LÓGICA DE PAGINACIÓN ===
    const indexOfLastRecord = currentPage * recordsPerPage;
    const indexOfFirstRecord = indexOfLastRecord - recordsPerPage;
    const currentRecords = filteredTallas.slice(indexOfFirstRecord, indexOfLastRecord);
    const totalPages = Math.ceil(filteredTallas.length / recordsPerPage);

    const handlePageChange = (pageNumber) => {
        setCurrentPage(pageNumber);
    };

    const handlePrevPage = () => {
        if (currentPage > 1) setCurrentPage(currentPage - 1);
    };

    const handleNextPage = () => {
        if (currentPage < totalPages) setCurrentPage(currentPage + 1);
    };

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


// === MANEJAR DATOS DE CREACIÓN INMEDIATA ===
useEffect(() => {

    if (location.state?.nuevaTalla) {
        const { nuevaTalla, successMessage } = location.state;
    
        setAllTallas(prevTallas => {
      
            const tallaParaMostrar = {
                ...nuevaTalla,
            
                id_Talla: nuevaTalla.id_Talla || `temp-${Date.now()}` 
            };
            return [tallaParaMostrar, ...prevTallas];
        });
        

        if (successMessage) {
            setSuccessMessage(successMessage);
            setErrorMessage(null);
        }

 
        window.history.replaceState({}, document.title, location.pathname);
    }
}, [location.state]); 
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
   
        console.error("Error al confirmar eliminación:", err); 

        const serverMessage = err.response?.data?.message || `No se pudo eliminar la talla '${talla.nombre_Talla}'. Inténtalo de nuevo.`;
        

        setErrorMessage(serverMessage); 
        setSuccessMessage(null);
        
        // Opcional: Cerrar el modal si el error no depende de él
        //setShowDeleteModal(false); 
        setSelectedTalla(null);
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
                                  onChange={(e) => {
                                    setSearchTerm(e.target.value);
                                    setCurrentPage(1); 
                                }}
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
                                    ) : currentRecords.length > 0 ? (
                                        currentRecords.map(talla => (
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
                                {filteredTallas.length > recordsPerPage && (
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
