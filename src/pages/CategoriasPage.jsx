import React, { useState, useEffect } from 'react';
import { useNavigate, useLocation, Link } from 'react-router-dom';
import { FaSearch, FaPlus, FaEye, FaEdit, FaTrash } from 'react-icons/fa';
import Nav from '../components/Nav.jsx';
import Footer from '../components/Footer.jsx';
import DetallesCategoria from '../components/DetallesCategoria.jsx';
import DeleteCategorias from './DeleteCategorias.jsx'; 

export default function CategoriasPage() {
  const [categorias, setCategorias] = useState([
    { id: '001', nombre: 'Niños', descripcion: 'Ropa y accesorios para niñ@s', estado: true, fechaCreacion: '2024-05-01' },
    { id: '002', nombre: 'Femenina', descripcion: 'Ropa para mujeres', estado: true, fechaCreacion: '2024-05-03' },
    { id: '003', nombre: 'Masculina', descripcion: 'Ropa para hombres', estado: false, fechaCreacion: '2024-05-05' },

  ]);

  const [searchTerm, setSearchTerm] = useState('');
  const [menuCollapsed, setMenuCollapsed] = useState(false);
  const [categoriaSeleccionada, setCategoriaSeleccionada] = useState(null);
  const [editandoCategoria, setEditandoCategoria] = useState(null);

  // ➡️ NUEVO ESTADO para controlar el modal de eliminación
  const [categoriaAEliminar, setCategoriaAEliminar] = useState(null);

  const navigate = useNavigate();
  const location = useLocation();

  const toggleMenu = () => setMenuCollapsed(!menuCollapsed);

  useEffect(() => {
    if (location.state?.nuevaCategoria) {
      const nueva = {
        ...location.state.nuevaCategoria,
        id: String(categorias.length + 1).padStart(3, '0'),
        fechaCreacion: new Date().toISOString().split('T')[0],
      };
      setCategorias(prev => [...prev, nueva]);
      window.history.replaceState({}, document.title);
    }
  }, [location.state, categorias.length]);

  const filteredCategorias = categorias.filter(categoria =>
    Object.values(categoria).some(value =>
      String(value).toLowerCase().includes(searchTerm.toLowerCase())
    )
  );

  // ➡️ Funciones para el modal de detalles
  const handleVerDetalles = (categoria) => {
    setCategoriaSeleccionada(categoria);
  };

  const handleCerrarModalDetalles = () => {
    setCategoriaSeleccionada(null);
  };

  // ➡️ NUEVAS Funciones para el modal de eliminación
  const handleAbrirModalEliminar = (categoria) => {
    setCategoriaAEliminar(categoria);
  };

  const handleCerrarModalEliminar = () => {
    setCategoriaAEliminar(null);
  };

  const handleConfirmarEliminacion = (categoria) => {
    setCategorias(prev => prev.filter(c => c.id !== categoria.id));
    setCategoriaAEliminar(null);
    alert('Categoría eliminada exitosamente!');
  };

  return (
    <div className="container">
      <Nav menuCollapsed={menuCollapsed} toggleMenu={toggleMenu} />

      <div className={`main-content-area ${menuCollapsed ? 'expanded-margin' : ''}`}>
        <div className="header">
          <div className="header-left">
            <h1>Gestión de Categorías</h1>
          </div>
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
              <FaSearch color="#fff" /> Buscar
            </button>
          </div>

          <button className="add-button" onClick={() => navigate('/crearcategoria')}>
            <FaPlus style={{ marginRight: '8px' }} />
            Agregar categoría
          </button>
        </div>

        <div className="table-container">
          <table>
            <thead>
              <tr>
                <th>Nombre</th>
                <th>Descripción</th>
                <th>Estado</th>
                <th>Fecha de creación</th>
                <th>Acciones</th>
              </tr>
            </thead>
            <tbody>
              {filteredCategorias.map(c => (
                <tr key={c.id}>
                  <td>{c.nombre}</td>
                  <td>{c.descripcion}</td>
                  <td>
                    <label className="switch">
                      <input
                        type="checkbox"
                        checked={c.estado}
                        onChange={() => {
                          setCategorias(prev =>
                            prev.map(item =>
                              item.id === c.id ? { ...item, estado: !item.estado } : item
                            )
                          );
                        }}
                      />
                      <span className="slider round"></span>
                    </label>
                  </td>
                  <td>{c.fechaCreacion}</td>
                  <td className="icons">
                    <button className="icon-button black" title="Ver detalles" onClick={() => handleVerDetalles(c)}>
                      <FaEye />
                    </button>
                    <Link to='/categoriasedit' className="icon-button blue" title='editar'>
                      <FaEdit />
                    </Link>
                    {/* ➡️ AQUÍ CAMBIAMOS EL BOTÓN para usar el nuevo modal */}
                    <button className="icon-button red" title="Eliminar" onClick={() => handleAbrirModalEliminar(c)}>
                      <FaTrash />
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>

          {filteredCategorias.length === 0 && (
            <div className="no-results">
              <p>No se encontraron categorías</p>
            </div>
          )}
        </div>

        <div className="footer-productos-page">
          <Footer />
        </div>
      </div>

      {/* ➡️ Renderizado condicional del modal de detalles */}
      {categoriaSeleccionada && (
        <DetallesCategoria categoria={categoriaSeleccionada} onClose={handleCerrarModalDetalles} />
      )}

      {/* ➡️ NUEVO: Renderizado condicional del modal de eliminación */}
      {categoriaAEliminar && (
        <DeleteCategorias
          categoria={categoriaAEliminar}
          onClose={handleCerrarModalEliminar}
          onConfirm={handleConfirmarEliminacion}
        />
      )}
    </div>
  );
}