import React, { useState } from 'react';
import './ProductosPage.css';
import { FaHome, FaSearch, FaPlus, FaEye, FaEdit, FaTrash } from 'react-icons/fa';
import Nav from '../components/Nav.jsx';
import Footer from '../components/Footer.jsx';
import Detalles from '../components/Detalles.jsx';
import DeleteProducts from './DeleteProductos.jsx';

import { useLocation, Link } from 'react-router-dom';

export default function ProductosPage() {
    const [menuCollapsed, setMenuCollapsed] = useState(false);
    // ➡️ Estado para manejar el modal de detalles
    const [productoSeleccionado, setProductoSeleccionado] = useState(null);

    // ➡️ Estado para manejar el modal de eliminación (NUEVO)
    const [productoAEliminar, setProductoAEliminar] = useState(null);

    const toggleMenu = () => {
        setMenuCollapsed(!menuCollapsed);
    };

    // Datos de los productos (ejemplo)
    const [productos, setProductos] = useState([
        {
            id: 1, nombre: 'Blusa Estraple', cantidad: 10, precio: '$60.000', estado: true, descripcion: 'blusa estraple de algodón suave y facil de cuidar.', talla: 'M',
            imagenes: [
                'src/assets/Imagen-producto1.png',
                'src/assets/Imagen-producto1.png',

            ],
            colores: ['#000'], //negro
            categoria: 'Femenina',
            marca: 'Deluxe',
            fecha_Creacion: '20-06-2025'
        },
        {
            id: 2, nombre: 'Vestigo Manga Larga', cantidad: 5, precio: '$70.000', estado: true, descripcion: 'Vestido medio corto de manga larga tela en lino.', talla: 'L',
            imagenes: [
                'src/assets/vestido-producto2.png',
                'src/assets/vestido-producto2.png',
                'src/assets/vestido-producto2.png',

            ],
            colores: ['#000'],
            categoria: 'Femenina',
            marca: 'Elena boteli',
            fecha_Creacion: '20-06-2025'
        },
        {
            id: 3, nombre: 'Cargo con Camisa', cantidad: 4, precio: '$50.000', estado: true, descripcion: 'Conjuto de camisa y cargo tono claro.', talla: 'XS',
            imagenes: [
                'src/assets/Imagen3-producto3.png',
                'src/assets/Imagen3-producto3.png',
            ],
            colores: ['#d1d5db'],
            categoria: 'Niños',
            marca: 'Baby',
            fecha_Creacion: '20-06-2025'
        },
    ]);

    const [searchTerm, setSearchTerm] = useState('');
    const location = useLocation();

    const filteredProductos = productos.filter(producto =>
        Object.values(producto).some(value =>
            String(value).toLowerCase().includes(searchTerm.toLowerCase())
        )
    );

    const toggleEstadoProducto = (idProducto) => {
        setProductos(prev =>
            prev.map(p =>
                p.id === idProducto ? { ...p, estado: !p.estado } : p
            )
        );
    };

    // ➡️ Funciones para abrir y cerrar el modal de detalles
    const handleVerDetalles = (producto) => {
        setProductoSeleccionado(producto);
    };

    const handleCerrarModal = () => {
        setProductoSeleccionado(null);
    };

    // ➡️ Funciones para el modal de eliminación 
    const handleAbrirModalEliminar = (producto) => {
        setProductoAEliminar(producto);
    };

    const handleCerrarModalEliminar = () => {
        setProductoAEliminar(null);
    };

    const handleConfirmarEliminar = (producto) => {
        // Lógica para eliminar el producto del estado
        setProductos(prev => prev.filter(p => p.id !== producto.id));
        setProductoAEliminar(null); // Cierra el modal después de la acción
        alert(`Producto '${producto.nombre}' eliminado correctamente.`);
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
                            <FaSearch color="#fff" /> Buscar
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
                            {filteredProductos.map(p => (
                                <tr key={p.id}>
                                    <td>{p.nombre}</td>
                                    <td>{p.cantidad}</td>
                                    <td>{p.precio}</td>
                                    <td>
                                        <label className="switch">
                                            <input
                                                type="checkbox"
                                                checked={p.estado}
                                                onChange={() => toggleEstadoProducto(p.id)}
                                            />
                                            <span className="slider round"></span>
                                        </label>
                                    </td>
                                    <td className="icons">
                                        {/* ➡️ Botón para ver detalles del producto actual (p) */}
                                        <button onClick={() => handleVerDetalles(p)} className="icon-button black">
                                            <FaEye />
                                        </button>
                                        <Link
                                            to="/editarProducto"
                                            state={{ producto: p }}
                                            className="icon-button blue"
                                            title="Editar"
                                        >
                                            <FaEdit />
                                        </Link>
                                        {/* ➡️ Botón para abrir el modal de eliminación (AQUÍ ESTÁ EL CAMBIO) */}
                                        <button
                                            className="icon-button red"
                                            title="Eliminar"
                                            onClick={() => handleAbrirModalEliminar(p)}
                                        >
                                            <FaTrash />
                                        </button>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
                <div className="footer-productos-page"> <Footer /></div>

            </div>

            {/* ➡️ El modal de detalles se renderiza aquí */}
            {productoSeleccionado && (
                <Detalles producto={productoSeleccionado} onClose={handleCerrarModal} />
            )}

            {/* ➡️ El modal de eliminación se renderiza aquí (NUEVO) */}
            {productoAEliminar && (
                <DeleteProducts
                    producto={productoAEliminar}
                    onClose={handleCerrarModalEliminar}
                    onConfirm={handleConfirmarEliminar}
                />
            )}
        </div>
    );
}