import React, { useState, useEffect } from 'react';
import { FaEye, FaSearch, FaEdit, FaTrash, FaPlus } from 'react-icons/fa';
import { Link, useLocation } from 'react-router-dom';
import Nav from '../components/Nav.jsx';
import DetallesProveedor from '../components/DetallesProveedor.jsx';
import ToastNotification from '../components/ToastNotification.jsx';
import { getProveedores, toggleEstadoProveedor } from "../api/proveedoresService.js";
import './Page.css';

const ProveedoresPage = () => {
  const location = useLocation();
  const [menuCollapsed, setMenuCollapsed] = useState(false);
  const toggleMenu = () => setMenuCollapsed(!menuCollapsed);


  const [proveedores, setProveedores] = useState([]);
  const [proveedorSeleccionadoId, setProveedorSeleccionadoId] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [searchTrigger, setSearchTrigger] = useState('');
  const [cargandoDetalles, setCargandoDetalles] = useState(false);

  const [currentPage, setCurrentPage] = useState(1);
  const recordsPerPage = 7;

  const [toastMessage, setToastMessage] = useState(location.state?.successMessage || '');
  const [toastType, setToastType] = useState('success');


  useEffect(() => {
    const fetchProveedores = async () => {
      try {
        const data = await getProveedores();
        setProveedores(data);
      } catch (error) {
        console.error("Error al cargar proveedores:", error);
        setToastMessage("❌ Error al cargar proveedores");
        setToastType("error");
      }
    };
    fetchProveedores();
  }, []);

  const verDetalles = async (proveedor) => {
    setCargandoDetalles(true);
    setProveedorSeleccionadoId(proveedor.idProveedor);
    document.body.style.overflow = 'hidden';
    setCargandoDetalles(false);
  };

  const cerrarModal = () => {
    setProveedorSeleccionadoId(null);
    document.body.style.overflow = 'auto';
  };

  const cambiarEstadoProveedor = async (proveedor) => {
    try {
      const proveedoresActualizados = proveedores.map(p =>
        p.idProveedor === proveedor.idProveedor
          ? { ...p, estado: !p.estado }
          : p
      );
      setProveedores(proveedoresActualizados);

      await toggleEstadoProveedor(proveedor);

      setToastMessage(
        proveedor.estado ? "✅ El proveedor fue ANULADO correctamente." :
          "✅ El proveedor fue ACTIVADO correctamente."
      );
      setToastType("success");

      const dataActualizada = await getProveedores();
      setProveedores(dataActualizada);

    } catch (error) {
      console.error(error);
      const proveedoresOriginales = proveedores.map(p =>
        p.idProveedor === proveedor.idProveedor
          ? { ...p, estado: proveedor.estado }
          : p
      );
      setProveedores(proveedoresOriginales);
      setToastMessage("❌ No se pudo cambiar el estado del proveedor.");
      setToastType("error");
    }
  };

  const filteredProveedores = proveedores.filter(proveedor => {
    const term = (searchTrigger || searchTerm).toLowerCase();
    const estadoTexto = proveedor.estado ? "activo" : "inactivo";

    return (
      String(proveedor.nombre).toLowerCase().includes(term) ||
      String(proveedor.telefono).toLowerCase().includes(term) ||
      String(proveedor.email).toLowerCase().includes(term) ||
      String(proveedor.ciudad).toLowerCase().includes(term) ||
      estadoTexto.includes(term)
    );
  });

  
  // === LÓGICA DE PAGINACIÓN ===
  const indexOfLastRecord = currentPage * recordsPerPage;
  const indexOfFirstRecord = indexOfLastRecord - recordsPerPage;
  const currentRecords = filteredProveedores.slice(indexOfFirstRecord, indexOfLastRecord);
  const totalPages = Math.ceil(filteredProveedores.length / recordsPerPage);

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
    <div className="container">
      <Nav menuCollapsed={menuCollapsed} toggleMenu={toggleMenu} />

      <div className={`main-content-area ${menuCollapsed ? 'expanded-margin' : ''}`}>
        {toastMessage && (
          <ToastNotification
            message={toastMessage}
            type={toastType}
            onClose={() => setToastMessage('')}
          />
        )}

        <div className="header">
          <h1>Gestión de Proveedores</h1>
        </div>

        <div className="actions">
          <div className="search-container">
            <input
              type="text"
              placeholder="Buscar Proveedor"
              className="form-control"
              value={searchTerm}
              onChange={(e) => {
                setSearchTerm(e.target.value);
                setCurrentPage(1);
              }}
            />
            <button
              className="search-button"
              onClick={() => setSearchTrigger(searchTerm)}
            >
              <FaSearch color="#fff" />
            </button>
          </div>

          <Link to='/createproveedores' className="add-button">
            <FaPlus style={{ marginRight: '8px', color: "#fff" }} /> Agregar Proveedor
          </Link>
        </div>

        <div className="table-container">
          <table className="table table-striped table-hover">
            <thead>
              <tr>
                <th>Nombre</th>
                <th>Teléfono</th>
                <th>Email</th>
                <th>Ciudad</th>
                <th>Estado</th>
                <th>Acciones</th>
              </tr>
            </thead>
            <tbody>
              {currentRecords.length > 0 ? (
                currentRecords.map((proveedor) => (
                  <tr key={proveedor.idProveedor}>
                    <td>{proveedor.nombre}</td>
                    <td>{proveedor.telefono}</td>
                    <td>{proveedor.email}</td>
                    <td>{proveedor.ciudad}</td>
                    <td>
                      <span className={`badge ${proveedor.estado ? 'bg-success' : 'bg-danger'}`}>
                        {proveedor.estado ? "Activo" : "Inactivo"}
                      </span>
                    </td>
                    <td className="icons">
                      <button
                        className="icon-button black"
                        onClick={() => verDetalles(proveedor)}
                      >
                        <FaEye />
                      </button>

                      <Link
                        to={`/editproveedor/${proveedor.idProveedor}`}
                        className="icon-button blue"
                      >
                        <FaEdit />
                      </Link>

                      <button
                        className="icon-button red"
                        onClick={() => cambiarEstadoProveedor(proveedor)}
                      >
                        {proveedor.estado ? <FaTrash /> : <FaPlus />}
                      </button>
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan="6">
                    {proveedores.length === 0 ? 'Cargando Proveedores...' : 'No se encontraron proveedores'}
                  </td>
                </tr>
              )}
            </tbody>
          </table>
          {filteredProveedores.length > recordsPerPage && (
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


        {cargandoDetalles && (
          <div className="modal-overlay">
            <div className="modal-content">
              <p>Cargando detalles...</p>
            </div>
          </div>
        )}

        {proveedorSeleccionadoId && !cargandoDetalles && (
          <DetallesProveedor
            proveedorId={proveedorSeleccionadoId}
            onClose={cerrarModal}
          />
        )}
      </div>
    </div>
  );
};

export default ProveedoresPage;
