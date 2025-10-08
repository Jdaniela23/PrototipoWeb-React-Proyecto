import React, { useState, useRef, useEffect } from 'react';
import { FaFilePdf, FaEye, FaPlus, FaSearch, FaTrash } from 'react-icons/fa';
import { Link } from 'react-router-dom';
import Nav from '../components/Nav.jsx';
import DetallesCompras from '../components/DetallesCompras.jsx'; 
import './Page.css';
import Footer from '../components/Footer.jsx';
import jsPDF from 'jspdf';
import html2canvas from 'html2canvas';
import { getCompras, anularCompra } from "../api/comprasService.js";

const ComprasForm = () => {
  const [menuCollapsed, setMenuCollapsed] = useState(false);
  const toggleMenu = () => setMenuCollapsed(!menuCollapsed);

  const [compras, setCompras] = useState([]);
  const [compraSeleccionadaId, setCompraSeleccionadaId] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [loading, setLoading] = useState(false);
  const [cargandoDetalles, setCargandoDetalles] = useState(false);
  const pdfRef = useRef();

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

  const generarPDFConCierreAutomatico = async (compra) => {
    const input = pdfRef.current;
    const pdf = new jsPDF('p', 'mm', 'a4', true);
    const pdfWidth = pdf.internal.pageSize.getWidth();

    const canvas = await html2canvas(input, {
      scale: 2,
      useCORS: true,
      allowTaint: true
    });

    const imgData = canvas.toDataURL('image/png');
    const imgWidth = pdfWidth;
    const imgHeight = (canvas.height * imgWidth) / canvas.width;

    pdf.addImage(imgData, 'PNG', 0, 0, imgWidth, imgHeight);
    pdf.save(`compra_${compra.numeroCompra || compra.id_Compra}.pdf`);
  };

  // ✅ Filtro corregido
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
              placeholder="Buscar Compras"
              className="form-control"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              style={{ color: "black" }}  
            />
            <button 
              className="search-button"
              onClick={() => setSearchTerm(searchTerm)}
            >
              <FaSearch color="#fff" />
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
                    <td colSpan="5" >
                      Cargando Compras..
                    </td>
                  </tr>
                ) : filteredCompras.length > 0 ? (
                  filteredCompras.map((compra) => (
                    <tr key={compra.id_Compra}>
                      <td>
                        {new Date(compra.fecha_Compra_Proveedor).toLocaleDateString()}
                      </td>
                      <td>{compra.proveedor?.nombre ?? "Sin proveedor"}</td>
                      <td>${compra.total?.toLocaleString("es-CO")}</td>
                      <td>
                        <span
                          className={`badge ${
                            compra.estado === "Activo" ? "bg-success" : "bg-danger"
                          }`}
                        >
                          {compra.estado || "Activo"}
                        </span>
                      </td>
                      <td className="icons">
                        <button
                     
                          className="icon-button black"
                          onClick={() => verDetalles(compra)}
                          title="Ver detalles"
                          disabled={cargandoDetalles}
                        >
                          <FaEye />
                        </button>

                        <button
                          className="icon-button blue"
                          onClick={() => generarPDFConCierreAutomatico(compra)}
                          title="Generar PDF"
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
          </div>
        </div>

        <div className='footer-page'>
          <Footer />
        </div>

        {cargandoDetalles && (
          <div className="modal-overlay">
            <div className="modal-content" style={{ textAlign: 'center', padding: '40px' }}>
              <p>Cargando detalles...</p>
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