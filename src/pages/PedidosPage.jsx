import { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import { FaSearch, FaPlus, FaEye, FaEdit } from "react-icons/fa";
import Nav from "../components/Nav.jsx";
import Footer from "../components/Footer.jsx";
import { getPedidos } from "../api/pedidosService.js";
import DetallesPedido from "../components/DetallesPedido";
import "./Page.css";

function PedidosPageA() {
  const navigate = useNavigate();
  const [pedidos, setPedidos] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [menuCollapsed, setMenuCollapsed] = useState(false);
  const [pedidoDetalleData, setPedidoDetalleData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const toggleMenu = () => setMenuCollapsed(!menuCollapsed);

  useEffect(() => {
    const fetchPedidos = async () => {
      setLoading(true);
      setError("");
      try {
        const data = await getPedidos();
        setPedidos(data);
      } catch (err) {
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
  }, [navigate]);

  const filteredPedidos = pedidos.filter(
    (p) =>
      p.fecha_Creacion.toLowerCase().includes(searchTerm.toLowerCase()) ||
      p.usuario?.nombre_Usuario.toLowerCase().includes(searchTerm.toLowerCase()) ||
      p.estado_Pedido.toLowerCase().includes(searchTerm.toLowerCase())
  );

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
                filteredPedidos.map((pedido) => (
                  <tr key={pedido.id_Pedido}>
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
                    </td>
                  </tr>
                ))}
            </tbody>
          </table>
        </div>

        <div className="footer-page">
          <Footer />
        </div>
      </div>

      {pedidoDetalleData && (
        <DetallesPedido
          pedido={pedidoDetalleData}
          onClose={() => setPedidoDetalleData(null)}
        />
      )}
    </div>
  );
}

export default PedidosPageA;
