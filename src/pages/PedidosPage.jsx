import { useState, useEffect } from "react";
import { Link, useNavigate, useLocation } from "react-router-dom";
import { FaSearch, FaPlus, FaEye, FaEdit, FaFilePdf } from "react-icons/fa";
import Nav from "../components/Nav.jsx";
import { getPedidos, getPedidoById } from "../api/pedidosService.js"; // 👈 Agrega getPedidoById aquí
import DetallesPedido from "../components/DetallesPedido";
import { generarPDFPedido } from '../components/PDFpedidos.jsx';
import ToastNotification from '../components/ToastNotification.jsx';
import "./Page.css";

function PedidosPageA() {

  const location = useLocation(); // 1. Inicializa useLocation

  // 2. Captura los mensajes del state (si existen)
  const navSuccessMessage = location.state?.successMessage;
  const navErrorMessage = location.state?.errorMessage; // Si manejaste el error en el formulario


  const navigate = useNavigate();
  const [pedidos, setPedidos] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [menuCollapsed, setMenuCollapsed] = useState(false);
  const [pedidoDetalleData, setPedidoDetalleData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  // 👈 2. NUEVOS ESTADOS PARA TOASTS
  const [successMessage, setSuccessMessage] = useState(null);
  const [errorMessage, setErrorMessage] = useState(null);

  const toggleMenu = () => setMenuCollapsed(!menuCollapsed);


  const [currentPage, setCurrentPage] = useState(1);
  const recordsPerPage = 7;
  // PedidosPageA.jsx (Bloque CORREGIDO de la función filteredPedidos)
  // PedidosPageA.jsx (Alrededor de la línea 60)

  const filteredPedidos = pedidos.filter(
    (p) => {
      // Convertir el término de búsqueda a minúsculas una sola vez
      const lowerSearchTerm = searchTerm.toLowerCase();

      // 1. Excluir pedidos completados primero
      if (p.estado_Pedido === "Completado") {
        return false;
      }

      // 2. Extraer solo la parte de la fecha (YYYY-MM-DD) para la búsqueda
      const fechaParte = p.fecha_Creacion.split("T")[0]; // Ej: "2025-12-01"

      // 3. Aplicar el filtro de búsqueda (USANDO || en todas partes)
      return (
        // Búsqueda por FECHA (Usamos la parte limpia de la fecha)
        fechaParte.includes(lowerSearchTerm) ||

        // Búsqueda por Usuario
        p.usuario?.nombre_Completo?.toLowerCase().includes(lowerSearchTerm) ||
        // Nota: Usé nombre_Completo en lugar de nombre_Usuario para que coincida con lo que se muestra en la tabla

        // Búsqueda por Estado
        p.estado_Pedido.toLowerCase().includes(lowerSearchTerm) ||




        // Búsqueda por ID de Pedido (Convertir ID a string antes de buscar)
        String(p.id_Pedido).includes(lowerSearchTerm) ||
        String(p.total_Pedido).includes(lowerSearchTerm)
      );
    }
  );
  // === LÓGICA DE PAGINACIÓN ===
  const indexOfLastRecord = currentPage * recordsPerPage;
  const indexOfFirstRecord = indexOfLastRecord - recordsPerPage;
  const currentRecords = filteredPedidos.slice(indexOfFirstRecord, indexOfLastRecord);
  const totalPages = Math.ceil(filteredPedidos.length / recordsPerPage);

  const handlePageChange = (pageNumber) => {
    setCurrentPage(pageNumber);
  };

  const handlePrevPage = () => {
    if (currentPage > 1) setCurrentPage(currentPage - 1);
  };

  const handleNextPage = () => {
    if (currentPage < totalPages) setCurrentPage(currentPage + 1);
  };

  // En PedidosPageA.jsx
  // ... (Tus importaciones y otros estados)

  // ...

  // ⭐️ NUEVO useEffect para manejar mensajes de navegación
  useEffect(() => {
    // 1. Lógica para cargar pedidos (MANTENER LA CARGA DE DATOS)
    const fetchPedidos = async () => {
      setLoading(true);
      setError("");
      try {
        const data = await getPedidos();
        setPedidos(data);
      } catch (err) {
        // ... (manejo de errores de carga)
        console.error("Error obteniendo pedidos:", err);
        if (err.response?.status === 401 || err.message.includes("No autorizado")) {
          navigate("/login");
        } else {
          setError("Error al cargar los pedidos.");
        }
      } finally {
        setLoading(false);
      }
    };

    fetchPedidos();

    // 2. Lógica para mostrar TOAST después de navegación (¡ESTO ES LO IMPORTANTE!)
    if (navSuccessMessage) {
      setSuccessMessage(navSuccessMessage);
      // Opcional: Limpiar el state de la navegación para que no se muestre al refrescar
      // navigate('.', { state: {}, replace: true });
    }
    if (navErrorMessage) {
      setErrorMessage(navErrorMessage);
      // Opcional: Limpiar el state de la navegación
      // navigate('.', { state: {}, replace: true });
    }

  }, [navigate, navSuccessMessage, navErrorMessage]); // Asegúrate de incluir las dependencias



  // 👇 Función para manejar la generación del PDF
  const handleGenerarPDF = async (pedido) => {
    try {
      // Cargar el pedido completo con detalles
      const pedidoCompleto = await getPedidoById(pedido.id_Pedido);
      await generarPDFPedido(pedidoCompleto);
      setSuccessMessage(`PDF del pedido #${pedido.id_Pedido} generado con éxito.`);
    } catch (error) {
      console.error('Error al generar PDF:', error);
      setErrorMessage('Error al generar el PDF del pedido.');
    }
  };

  return (
    <div className="container lowercase">
      <Nav menuCollapsed={menuCollapsed} toggleMenu={toggleMenu} />

      <div className={`main-content-area ${menuCollapsed ? "expanded-margin" : ""}`}>
        <div className="header">
          <h1>Gestión de Pedidos</h1>
        </div>

        <div className="actions">
          <div className="search-container">
            <input
              type="text"
              placeholder="Buscar por Fecha o Usuario"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
            <button className="search-button">
              <FaSearch color="#fff" />
            </button>
          </div>

          <Link to="/crearpedidos" className="add-button">
            <FaPlus style={{ marginRight: "8px" }} />
            Agregar Pedido
          </Link>
        </div>

        <div className="table-container">
          <table>
            <thead>
              <tr>
                <th>Código</th>
                <th>Fecha</th>
                <th>Usuario</th>
                <th>Total</th>
                <th>Estado</th>
                <th>Acciones</th>
              </tr>
            </thead>
            <tbody>
              {loading && (
                <tr>
                  <td colSpan="5" className="loading-message">
                    Cargando pedidos...
                  </td>
                </tr>
              )}

              {!loading && error && (
                <tr>
                  <td colSpan="5" className="error-message">
                    {error}
                  </td>
                </tr>
              )}

              {!loading && !error && filteredPedidos.length === 0 && (
                <tr>
                  <td colSpan="5" className="no-data-message">
                    No se encontraron pedidos.
                  </td>
                </tr>
              )}

              {!loading &&
                !error &&
                currentRecords.map((pedido) => (
                  <tr key={pedido.id_Pedido}>
                    <td>{pedido.id_Pedido}</td>
                    <td>{pedido.fecha_Creacion.split("T")[0]}</td>
                    <td>{pedido.usuario?.nombre_Completo}</td>
                    <td>${pedido.total_Pedido.toLocaleString()}</td>
                    <td>{pedido.estado_Pedido}</td>
                    <td className="icons">
                      <button
                        className="icon-button black"
                        title="Ver detalles"
                        onClick={() => setPedidoDetalleData(pedido)}
                      >
                        <FaEye />
                      </button>

                      <button
                        className={`icon-button blue ${pedido.estado_Pedido === 'Anulado' ? 'disabled' : ''}`}
                        title={pedido.estado_Pedido === 'Anulado' ? 'Pedido anulado' : 'Editar pedido'}
                        onClick={() => navigate(`/editpedido/${pedido.id_Pedido}`)}
                        disabled={pedido.estado_Pedido === 'Anulado'}
                      >
                        <FaEdit />
                      </button>

                      <button
                        className="icon-button red"
                        title="Descargar PDF"
                        onClick={() => handleGenerarPDF(pedido)}
                      >
                        <FaFilePdf />
                      </button>
                    </td>
                  </tr>
                ))}
            </tbody>
          </table>
          {filteredPedidos.length > recordsPerPage && (
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

      {pedidoDetalleData && (
        <DetallesPedido
          pedido={pedidoDetalleData}
          onClose={() => setPedidoDetalleData(null)}
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

export default PedidosPageA;