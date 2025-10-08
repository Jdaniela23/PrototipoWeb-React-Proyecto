import React, { useState, useEffect, useCallback } from 'react';
import './Page.css';
import { FaSearch, FaPlus, FaEye, FaEdit, FaTrash } from 'react-icons/fa';
import Nav from '../components/Nav.jsx';
import Footer from '../components/Footer.jsx';
import Detalles from '../components/Detalles.jsx';
import DeleteProducts from './DeleteProductos.jsx';
import { useLocation, Link } from 'react-router-dom';
import { getProductsAdmin , changeProductState, deleteProduct } from '../api/productsService';
import ToastNotification from '../components/ToastNotification.jsx';

export default function ProductosPage() {
    const location = useLocation();
    const navSuccessMessage = location.state?.successMessage;

    // === ESTADOS ===
    const [menuCollapsed, setMenuCollapsed] = useState(false);
    const [productos, setProductos] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [searchTerm, setSearchTerm] = useState('');

    const [productoSeleccionado, setProductoSeleccionado] = useState(null);
    const [productoAEliminar, setProductoAEliminar] = useState(null);

    const [successMessage, setSuccessMessage] = useState(navSuccessMessage || null);
    const [errorMessage, setErrorMessage] = useState(null);
    const [loadingAction, setLoadingAction] = useState(false);

    const toggleMenu = () => setMenuCollapsed(!menuCollapsed);

    // === CARGA INICIAL DE PRODUCTOS ===
    const fetchProducts = useCallback(async () => {
        setError(null);
        setLoading(true);
        try {
            const data = await getProductsAdmin();
            setProductos(data);
        } catch (err) {
            console.error(err);
            setError("No se pudieron cargar los productos. Por favor, intenta de nuevo.");
        } finally {
            setLoading(false);
        }
    }, []);

    useEffect(() => {
        fetchProducts();
    }, [fetchProducts]);

    // === FILTRADO ===
    const filteredProductos = productos.filter(producto =>
        Object.values(producto).some(value =>
            String(value).toLowerCase().includes(searchTerm.toLowerCase())
        )
    );

    // === TOGGLE ESTADO PRODUCTO ===
    const toggleEstadoProducto = async (idProducto, estadoActual) => {
        setLoadingAction(true);
        try {
            await changeProductState(idProducto, !estadoActual);
            setProductos(prev =>
                prev.map(p =>
                    p.id_Producto === idProducto ? { ...p, estado_Producto: !estadoActual } : p
                )
            );
            setSuccessMessage(`Estado del producto ID ${idProducto} actualizado correctamente.`);
            setErrorMessage(null);
        } catch (err) {
            console.error(err);
            setErrorMessage("Error al cambiar el estado del producto.");
            setSuccessMessage(null);
        } finally {
            setLoadingAction(false);
        }
    };

    // === DETALLES MODAL ===
    const handleVerDetalles = (producto) => setProductoSeleccionado(producto);
    const handleCerrarModal = () => setProductoSeleccionado(null);

    // === ELIMINAR PRODUCTO ===
    const handleAbrirModalEliminar = (producto) => setProductoAEliminar(producto);
    const handleCerrarModalEliminar = () => setProductoAEliminar(null);

    const handleConfirmarEliminar = async (producto) => {
        setLoadingAction(true);
        try {
            await deleteProduct(producto.id_Producto);
            await fetchProducts();
            setProductoAEliminar(null);
            setSuccessMessage(`Producto '${producto.nombre_Producto}' eliminado exitosamente.`);
            setErrorMessage(null);
        } catch (err) {
            console.error(err);
            setErrorMessage(`No se pudo eliminar el producto '${producto.nombre_Producto}'.`);
            setSuccessMessage(null);
        } finally {
            setLoadingAction(false);
        }
    };

    return (
        <div className="container">
            <Nav menuCollapsed={menuCollapsed} toggleMenu={toggleMenu} />

            <div className={`main-content-area ${menuCollapsed ? 'expanded-margin' : ''}`}>
                <div className="header">
                    <div className="header-left">
                        <h1>Gestión de Productos</h1>
                    </div>
                </div>

                <div className="actions">
                    <div className="search-container">
                        <input
                            type="text"
                            placeholder="Buscar Productos"
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                        />
                        <button className="search-button">
                            <FaSearch size={15} /> 
                        </button>
                    </div>
                    <Link className="add-button" to="/formproduct">
                        <FaPlus style={{ marginRight: '8px', color: "#fff" }} />
                        Agregar Producto
                    </Link>
                </div>

                <div className="table-container">
                    <table>
                        <thead>
                            <tr>
                                <th>Nombre</th>
                                <th>Cantidad</th>
                                <th>Precio</th>
                                <th>Estado</th>
                                <th>Acciones</th>
                            </tr>
                        </thead>
                        <tbody>
                            {loading ? (
                                <tr>
                                    <td colSpan="5" className="loading-message">Cargando productos...</td>
                                </tr>
                            ) : error ? (
                                <tr>
                                    <td colSpan="5" style={{ textAlign: 'center', color: 'red' }}>
                                        {error}
                                    </td>
                                </tr>
                            ) : filteredProductos.length === 0 ? (
                                <tr>
                                    <td colSpan="5" style={{ textAlign: 'center' }}>No se encontraron productos.</td>
                                </tr>
                            ) : (
                                filteredProductos.map(p => (
                                    <tr key={p.id_Producto}>
                                        <td>{p.nombre_Producto}</td>
                                        <td>{p.stock_Total}</td>
                                        <td>{p.precio}</td>
                                        <td>
                                            <label className="switch" title={p.estado_Producto ? 'Activo' : 'Inactivo'}>
                                                <input
                                                    type="checkbox"
                                                    checked={p.estado_Producto}
                                                    disabled={loadingAction}
                                                    onChange={() => toggleEstadoProducto(p.id_Producto, p.estado_Producto)}
                                                />
                                                <span className="slider round"></span>
                                            </label>
                                        </td>
                                        <td className="icons">
                                            <button onClick={() => handleVerDetalles(p)} className="icon-button black">
                                                <FaEye />
                                            </button>
                                            <Link
                                                to="/editarProducto"
                                                state={{ producto: p }}
                                                className="icon-button blue"
                                            >
                                                <FaEdit />
                                            </Link>
                                            <button
                                                className="icon-button red"
                                                disabled={loadingAction}
                                                onClick={() => handleAbrirModalEliminar(p)}
                                            >
                                                { <FaTrash />}
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

            {/* MODAL DETALLES */}
            {productoSeleccionado && (
                <Detalles producto={productoSeleccionado} onClose={handleCerrarModal} />
            )}

            {/* MODAL ELIMINAR */}
            {productoAEliminar && (
                <DeleteProducts
                    producto={productoAEliminar}
                    onClose={handleCerrarModalEliminar}
                    onConfirm={handleConfirmarEliminar}
                />
            )}

            {/* TOASTS */}
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
