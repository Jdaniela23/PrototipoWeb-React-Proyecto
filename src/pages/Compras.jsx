import React, { useState, useRef, useEffect } from 'react';
import { FaFilePdf, FaEye, FaPlus, FaSearch, FaTrash } from 'react-icons/fa';
import { Link } from 'react-router-dom';
import Nav from '../components/Nav.jsx';
import DetallesCompras from '../components/DetallesCompras.jsx';
import { generarPDFCompra } from '../components/PDFcompras.jsx';
import './Page.css';
import Footer from '../components/Footer.jsx';
import { getCompras, anularCompra } from "../api/comprasService.js";
import { getDetalleCompras } from '../api/detallescomprasService.js';

const ComprasForm = () => {
  const [menuCollapsed, setMenuCollapsed] = useState(false);
  const toggleMenu = () => setMenuCollapsed(!menuCollapsed);

  const [compras, setCompras] = useState([]);
  const [compraSeleccionadaId, setCompraSeleccionadaId] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [loading, setLoading] = useState(false);
  const [cargandoDetalles, setCargandoDetalles] = useState(false);
  const [generandoPDF, setGenerandoPDF] = useState(false);

  const [currentPage, setCurrentPage] = useState(1);
  const recordsPerPage = 7;

  const cargarCompras = async () => {
    try {
      setLoading(true);
      const data = await getCompras();
      setCompras(data);
      console.log("✅ Compras cargadas:", data);
    } catch (error) {
      console.error("Error cargando compras:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    cargarCompras();
  }, []);

  const verDetalles = async (compra) => {
    try {
      setCargandoDetalles(true);
      console.log("🔍 Obteniendo detalles de la compra ID:", compra.id_Compra);
      setCompraSeleccionadaId(compra.id_Compra);
      document.body.style.overflow = 'hidden';
    } catch (error) {
      console.error("❌ Error al obtener detalles de la compra:", error);
      alert("No se pudieron cargar los detalles de la compra");
    } finally {
      setCargandoDetalles(false);
    }
  };

  const cerrarModal = () => {
    console.log("❌ Cerrando modal");
    setCompraSeleccionadaId(null);
    document.body.style.overflow = 'auto';
  };

  const handleAnularCompra = async (compra) => {
    const confirmar = window.confirm(
      `⚠️ ¿Está seguro que desea ANULAR la compra?\n\n` +
      `Proveedor: ${compra.proveedor?.nombre || "N/A"}\n` +
      `Fecha: ${new Date(compra.fecha_Compra_Proveedor).toLocaleDateString()}\n` +
      `Total: $${compra.total?.toLocaleString("es-CO")}\n\n` +
      `Esta acción no se puede deshacer.`
    );

    if (!confirmar) return;

    try {
      await anularCompra(compra);
      alert("✅ Compra anulada correctamente");
      await cargarCompras();
    } catch (error) {
      console.error("Error al anular compra:", error);
      alert("❌ Error al anular la compra");
    }
  };

  const handleGenerarPDF = async (compra) => {
    try {
      setGenerandoPDF(true);
      console.log("📄 Generando PDF para compra ID:", compra.id_Compra);

      // Obtener todos los detalles de compras
      const todosLosDetalles = await getDetalleCompras();

      // Filtrar solo los detalles de esta compra
      const detallesFiltrados = todosLosDetalles.filter(
        detalle => detalle.idCompra == compra.id_Compra
      );

      console.log("📦 Detalles encontrados:", detallesFiltrados);

      // Generar el PDF
      await generarPDFCompra(compra, detallesFiltrados);

      console.log("✅ PDF generado exitosamente");
    } catch (error) {
      console.error("❌ Error al generar PDF:", error);
      alert("Error al generar el PDF: " + error.message);
    } finally {
      setGenerandoPDF(false);
    }
  };

  // Filtro corregido
  const filteredCompras = compras.filter(compra => {
    const term = searchTerm.toLowerCase();

    return (
      String(compra.id_Compra).toLowerCase().includes(term) ||
      (compra.proveedor?.nombre || "").toLowerCase().includes(term) ||
      (compra.proveedor?.email || "").toLowerCase().includes(term) ||
      String(compra.total ?? "").includes(term) ||
      (compra.estado || "").toLowerCase().includes(term)
    );
  });
  // === LÓGICA DE PAGINACIÓN ===
  const indexOfLastRecord = currentPage * recordsPerPage;
  const indexOfFirstRecord = indexOfLastRecord - recordsPerPage;
  const currentRecords = filteredCompras.slice(indexOfFirstRecord, indexOfLastRecord);
  const totalPages = Math.ceil(filteredCompras.length / recordsPerPage);

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
        <div className="header">
          <div className="header-left">
            <h1>Gestión de Compras</h1>
          </div>
        </div>

        <div className="actions">
          <div className="search-container">
            <input
              type="text"
              placeholder="Buscar Compras "
              className="form-control"
              value={searchTerm}
              onChange={(e) => {
                setSearchTerm(e.target.value);
                setCurrentPage(1);
              }}
              style={{ color: "black" }}
            />
            <button
              className="search-button"
              onClick={() => setSearchTerm(searchTerm)}
            >
              <FaSearch color="#fff" /> Buscar
            </button>
          </div>
          <Link to='/comprasform' className="add-button">
            <FaPlus style={{ marginRight: '8px', color: "#fff" }} /> Nueva Compra
          </Link>
        </div>

        <div className="table-container">
          <div className="table-wrapper">
            <table className="table table-striped table-hover">
              <thead>
                <tr>
                  <th>Fecha Compra</th>
                  <th>Proveedor</th>
                  <th>Total</th>
                  <th>Estado</th>
                  <th>Acciones</th>
                </tr>
              </thead>
              <tbody>
                {loading ? (
                  <tr>
                    <td colSpan="5" style={{ textAlign: "center", padding: 20 }}>
                      Cargando...
                    </td>
                  </tr>
                ) : currentRecords.length > 0 ? (
                  currentRecords.map((compra) => (
                    <tr key={compra.id_Compra}>
                      <td>
                        {new Date(compra.fecha_Compra_Proveedor).toLocaleDateString()}
                      </td>
                      <td>{compra.proveedor?.nombre ?? "Sin proveedor"}</td>
                      <td>${compra.total?.toLocaleString("es-CO")}</td>
                      <td>
                        <span
                          className={`badge ${compra.estado === "Activo" ? "bg-success" : "bg-danger"
                            }`}
                        >
                          {compra.estado || "Activo"}
                        </span>
                      </td>
                      <td className="icons">
                        <button
                          style={{ color: "#fbbf24" }}
                          className="icon-button black"
                          onClick={() => verDetalles(compra)}
                          title="Ver detalles"
                          disabled={cargandoDetalles}
                        >
                          <FaEye />
                        </button>

                        <button
                          className="icon-button blue"
                          onClick={() => handleGenerarPDF(compra)}
                          title="Generar PDF"
                          disabled={generandoPDF}
                        >
                          <FaFilePdf />
                        </button>

                        {compra.estado === "Activo" && (
                          <button
                            className="icon-button red"
                            onClick={() => handleAnularCompra(compra)}
                            title="Anular compra"
                          >
                            <FaTrash />
                          </button>
                        )}
                      </td>
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td colSpan="5" style={{ textAlign: "center", padding: 20 }}>
                      {compras.length === 0 ? "No hay compras registradas" : "No se encontraron compras"}
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
            {filteredCompras.length > recordsPerPage && (
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

        {cargandoDetalles && (
          <div className="modal-overlay">
            <div className="modal-content" style={{ textAlign: 'center', padding: '40px' }}>
              <p>Cargando detalles...</p>
            </div>
          </div>
        )}

        {generandoPDF && (
          <div className="modal-overlay">
            <div className="modal-content" style={{ textAlign: 'center', padding: '40px' }}>
              <p>📄 Generando PDF...</p>
            </div>
          </div>
        )}

        {compraSeleccionadaId && !cargandoDetalles && (
          <DetallesCompras
            compraId={compraSeleccionadaId}
            onClose={cerrarModal}
          />
        )}
      </div>
    </div>
  );
};

export default ComprasForm;