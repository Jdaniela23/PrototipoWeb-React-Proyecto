import React, { useState, useEffect } from 'react';
import { useNavigate, useLocation, Link } from 'react-router-dom';
import { FaSearch, FaPlus, FaEye, FaEdit, FaTrash } from 'react-icons/fa';
import Nav from '../components/Nav.jsx';
import Footer from '../components/Footer.jsx';
import DetallesCategoria from '../components/DetallesCategoria.jsx';
import DeleteCategorias from './DeleteCategorias.jsx';
import ToastNotification from '../components/ToastNotification.jsx';
import { getCategorias, deleteCategoria } from '../api/categoriasService';
import './Page.css';

export default function CategoriasPage() {
  const navigate = useNavigate();
  const location = useLocation();

  // Estados
  const [categorias, setCategorias] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [menuCollapsed, setMenuCollapsed] = useState(false);
  const [categoriaSeleccionada, setCategoriaSeleccionada] = useState(null);
  const [categoriaAEliminar, setCategoriaAEliminar] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  const [successMessage, setSuccessMessage] = useState(location.state?.successMessage || null);
  const [errorMessage, setErrorMessage] = useState(null);

  // Estados de Paginación
  const [currentPage, setCurrentPage] = useState(1);
  const recordsPerPage = 6;

  const toggleMenu = () => setMenuCollapsed(!menuCollapsed);

  // Limpiar el state para que el toast no se repita al navegar
  useEffect(() => {
    if (location.state?.successMessage) {
      window.history.replaceState({}, document.title);
    }
  }, [location.state]);

  // Cargar categorías
  const fetchCategorias = async () => {
    setLoading(true);
    setError('');
    try {
      const data = await getCategorias();
      setCategorias(data);
    } catch (err) {
      console.error('Error cargando categorías:', err);
      setError(err.response?.data?.mensaje || 'Error al cargar las categorías');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchCategorias();
  }, []);

  // Modales y acciones
  const handleVerDetalles = (categoria) => setCategoriaSeleccionada(categoria);
  const handleCerrarModalDetalles = () => setCategoriaSeleccionada(null);

  const handleAbrirModalEliminar = (categoria) => setCategoriaAEliminar(categoria);
  const handleCerrarModalEliminar = () => setCategoriaAEliminar(null);

 const handleConfirmarEliminacion = async (categoria) => {
    try {
        await deleteCategoria(categoria.id_Categoria_Producto);
        
        // --- ÉXITO ---
        setCategorias(prev => prev.filter(c => c.id_Categoria_Producto !== categoria.id_Categoria_Producto));
        setCategoriaAEliminar(null);
        setSuccessMessage(`Categoría '${categoria.nombre_Categoria}' eliminada exitosamente`);
        setErrorMessage(null);

        // ... (Lógica de paginación)
        if (currentRecords.length === 1 && currentPage > 1) {
            setCurrentPage(prev => prev - 1);
        } else if (currentPage > totalPages) {
            setCurrentPage(totalPages > 0 ? totalPages : 1);
        }
    } catch (err) {
        console.error('Error al eliminar:', err);
        
        //  CAPTURAR el mensaje específico del Backend
        const errorMsg = err.response?.data?.mensaje ||
            `No se pudo eliminar la categoría '${categoria.nombre_Categoria}'. Error de conexión.`;
        
        //  ASIGNAR el mensaje del servidor al estado.
        setErrorMessage(errorMsg); 
        
        // LIMPIAR el mensaje de éxito y CERRAR el modal de eliminación.
        setSuccessMessage(null);
       
    }
};

  const filteredCategorias = categorias.filter(categoria =>
    (categoria.nombre_Categoria?.toLowerCase() || '').includes(searchTerm.toLowerCase()) ||
    (categoria.descripcion?.toLowerCase() || '').includes(searchTerm.toLowerCase())
  );

  // Cálculo de Paginación
  const indexOfLastRecord = currentPage * recordsPerPage;
  const indexOfFirstRecord = indexOfLastRecord - recordsPerPage;

  const currentRecords = filteredCategorias.slice(indexOfFirstRecord, indexOfLastRecord);
  const totalPages = Math.ceil(filteredCategorias.length / recordsPerPage);

  // Manejadores de Paginación
  const handleNextPage = () => {
    if (currentPage < totalPages) {
      setCurrentPage(currentPage + 1);
    }
  };

  const handlePrevPage = () => {
    if (currentPage > 1) {
      setCurrentPage(currentPage - 1);
    }
  };

  const handlePageChange = (pageNumber) => {
    setCurrentPage(pageNumber);
  };

  useEffect(() => {
    setCurrentPage(1);
  }, [searchTerm]);


  return (
    <div className="page-wrapper">
      <div className="container">
        <Nav menuCollapsed={menuCollapsed} toggleMenu={toggleMenu} />

        <div className={`main-content-area ${menuCollapsed ? 'expanded-margin' : ''}`}>
          <div className="header">
            <h1>Gestión de Categorías</h1>
          </div>

          <div className="actions">
            <div className="search-container">
              <input
                type="text"
                placeholder="Buscar categorías"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
              <button className="search-button">
                <FaSearch color="#fff" />
              </button>
            </div>

            <Link to="/crearcategoria" className="add-button">
              <FaPlus style={{ marginRight: '8px', color: '#fff' }} />
              Agregar categoría
            </Link>
          </div>

          <div className="table-container">
            <table>
              <thead>
                <tr>
                  <th>Nombre</th>
                  <th>Descripción</th>
                  <th style={{ textAlign: 'center' }}>Acciones</th>
                </tr>
              </thead>
              <tbody>
                {loading ? (
                  <tr>
                    <td colSpan="3" style={{ textAlign: 'center', padding: '20px' }}>
                      Cargando categorías...
                    </td>
                  </tr>
                ) : error ? (
                  <tr>
                    <td colSpan="3" style={{ textAlign: 'center', color: 'red' }}>
                      {error}
                    </td>
                  </tr>
                ) : currentRecords.length === 0 ? (
                  <tr>
                    <td colSpan="3" style={{ textAlign: 'center', color: '#555' }}>
                      No se encontraron categorías
                    </td>
                  </tr>
                ) : (
                  // Usamos currentRecords para renderizar la tabla
                  currentRecords.map((c, index) => (
                    <tr key={`categoria-${c.id_Categoria_Producto}-${index}`}>
                      <td>{c.nombre_Categoria}</td>
                      <td>{c.descripcion || 'Sin descripción'}</td>
                      <td className="icons" style={{ display: 'flex', justifyContent: 'center', gap: '8px' }}>
                        <button className="icon-button black" title="Ver detalles" onClick={() => handleVerDetalles(c)}>
                          <FaEye />
                        </button>
                        <button
                          className="icon-button blue"
                          title="Editar"
                          onClick={() => navigate(`/editarCategoria/${c.id_Categoria_Producto}`, { state: { categoria: c } })}
                        >
                          <FaEdit />
                        </button>
                        <button className="icon-button red" title="Eliminar" onClick={() => handleAbrirModalEliminar(c)}>
                          <FaTrash />
                        </button>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>

            {/* Componente de Paginación */}
            {totalPages > 1 && (
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
      {categoriaSeleccionada && (
        <DetallesCategoria
          categoria={categoriaSeleccionada}
          onClose={handleCerrarModalDetalles}
        />
      )}

      {categoriaAEliminar && (
        <DeleteCategorias
          categoria={categoriaAEliminar}
          onClose={handleCerrarModalEliminar}
          onConfirm={handleConfirmarEliminacion}
        />
      )}

      {/* ToastNotifications */}
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