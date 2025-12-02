import { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import { FaSearch, FaPlus, FaEye, FaFilePdf } from "react-icons/fa";
import Nav from "../components/Nav.jsx";
import Footer from "../components/Footer.jsx";
import { getPedidos, getPedidoById } from "../api/pedidosService.js"; 
import DetallesPedido from "../components/DetallesPedido";
import { generarPDFPedido } from '../components/PDFpedidos.jsx';
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


    const [currentPage, setCurrentPage] = useState(1);
    const recordsPerPage = 7;

    const filteredPedidos = pedidos.filter(
        (p) =>
            p.estado_Pedido == "Completado" &&
            (
                p.fecha_Creacion.toLowerCase().includes(searchTerm.toLowerCase()) ||
                p.usuario?.nombre_Usuario.toLowerCase().includes(searchTerm.toLowerCase()) ||
                p.estado_Pedido.toLowerCase().includes(searchTerm.toLowerCase())
            )
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


    const handleGenerarPDF = async (pedido) => {
        try {
            // Cargar el pedido completo con detalles
            const pedidoCompleto = await getPedidoById(pedido.id_Pedido);
            await generarPDFPedido(pedidoCompleto);
        } catch (error) {
            console.error('Error al generar PDF:', error);
            alert('Error al generar el PDF del pedido');
        }
    };

    return (
        <div className="container lowercase">
            <Nav menuCollapsed={menuCollapsed} toggleMenu={toggleMenu} />

            <div className={`main-content-area ${menuCollapsed ? "expanded-margin" : ""}`}>
                <div className="header">
                    <h1>Registro De Ventas</h1>
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
                                currentRecords.map((pedido) => (
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
        </div>
    );
}

export default PedidosPageA;