// src/pages/CategoriasPage.jsx
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

  const [categorias, setCategorias] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [menuCollapsed, setMenuCollapsed] = useState(false);
  const [categoriaSeleccionada, setCategoriaSeleccionada] = useState(null);
  const [categoriaAEliminar, setCategoriaAEliminar] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  const [successMessage, setSuccessMessage] = useState(location.state?.successMessage || null);
  const [errorMessage, setErrorMessage] = useState(null);

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

  // Filtrado por nombre o descripción
  const filteredCategorias = categorias.filter(categoria =>
    (categoria.nombre_Categoria?.toLowerCase() || '').includes(searchTerm.toLowerCase()) ||
    (categoria.descripcion?.toLowerCase() || '').includes(searchTerm.toLowerCase())
  );

  // Modales y acciones
  const handleVerDetalles = (categoria) => setCategoriaSeleccionada(categoria);
  const handleCerrarModalDetalles = () => setCategoriaSeleccionada(null);

  const handleAbrirModalEliminar = (categoria) => setCategoriaAEliminar(categoria);
  const handleCerrarModalEliminar = () => setCategoriaAEliminar(null);

  const handleConfirmarEliminacion = async (categoria) => {
    try {
      await deleteCategoria(categoria.id_Categoria_Producto);
      setCategorias(prev => prev.filter(c => c.id_Categoria_Producto !== categoria.id_Categoria_Producto));
      setCategoriaAEliminar(null);
      setSuccessMessage(`Categoría '${categoria.nombre_Categoria}' eliminada exitosamente`);
      setErrorMessage(null);
    } catch (err) {
      console.error('Error al eliminar:', err);
      setErrorMessage(`No se pudo eliminar la categoría '${categoria.nombre_Categoria}'`);
      setSuccessMessage(null);
    }
  };

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
                ) : filteredCategorias.length === 0 ? (
                  <tr>
                    <td colSpan="3" style={{ textAlign: 'center', color: '#555' }}>
                      No se encontraron categorías
                    </td>
                  </tr>
                ) : (
                  filteredCategorias.map((c, index) => (
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
          </div>

          <div className="footer-page">
            <Footer />
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
