import React, { useState } from 'react';
import './FormAdd.css';
import Nav from '../components/Nav.jsx';
import { useNavigate } from 'react-router-dom';
import { FaSave } from 'react-icons/fa';
import { Link } from 'react-router-dom';

function FormAdd() {
    const toggleMenu = () => {
        setMenuCollapsed(!menuCollapsed);
    };
    const [menuCollapsed, setMenuCollapsed] = useState(false);
    const navigate = useNavigate();

    // Opciones para los selects
    const prendas = ['Camisas', 'Pantalones', 'Vestidos', 'Faldas', 'Chaquetas', 'Blusas'];
    const tallas = ['XS', 'S', 'M', 'L', 'XL', 'XXL'];
    const colores = ['Rojo', 'Azul', 'Negro', 'Blanco', 'Verde', 'Amarillo', 'Gris', 'Rosa'];

    // Estado formulario
    const [compraData, setCompraData] = useState({
        numeroCompra: '',
        proveedor: '',
        fechaCompra: '',
        formaPago: 'Efectivo',
        estado: 'activo',
        productos: [],
        subtotal: 0,
        iva: 0,
        descuento: 0,
        totalCompra: 0
    });

    const [nuevoProducto, setNuevoProducto] = useState({
        id: Date.now(),
        nombre: '',
        talla: 'M',
        color: 'Negro',
        cantidad: 1,
        precio: 0
    });

    // Manejar cambio inputs formulario principal
    const handleChange = (e) => {
        const { name, value } = e.target;
        setCompraData({
            ...compraData,
            [name]: value,
        });
    };

    // Manejar cambio inputs de productos
    const handleProductoChange = (e) => {
        const { name, value } = e.target;
        setNuevoProducto({
            ...nuevoProducto,
            [name]: name === 'cantidad' || name === 'precio' ? parseFloat(value) || 0 : value,
        });
    };

    // Agregar producto a la lista
    const agregarProducto = (e) => {
        e.preventDefault();

        if (!nuevoProducto.nombre || nuevoProducto.cantidad <= 0 || nuevoProducto.precio <= 0) {
            alert('Por favor complete todos los campos del producto');
            return;
        }

        const subtotalProducto = nuevoProducto.cantidad * nuevoProducto.precio;
        const ivaProducto = subtotalProducto * 0.19;
        const totalProducto = subtotalProducto + ivaProducto;

        setCompraData(prev => ({
            ...prev,
            productos: [...prev.productos, { ...nuevoProducto }],
            subtotal: prev.subtotal + subtotalProducto,
            iva: prev.iva + ivaProducto,
            totalCompra: prev.totalCompra + totalProducto
        }));

        // Resetear el formulario de producto
        setNuevoProducto({
            id: Date.now(),
            nombre: '',
            talla: 'M',
            color: 'Negro',
            cantidad: 1,
            precio: 0
        });
    };

    // Eliminar producto
    const eliminarProducto = (id) => {
        const producto = compraData.productos.find(p => p.id === id);
        if (!producto) return;

        const subtotalProducto = producto.cantidad * producto.precio;
        const ivaProducto = subtotalProducto * 0.19;
        const totalProducto = subtotalProducto + ivaProducto;

        setCompraData(prev => ({
            ...prev,
            productos: prev.productos.filter(p => p.id !== id),
            subtotal: prev.subtotal - subtotalProducto,
            iva: prev.iva - ivaProducto,
            totalCompra: prev.totalCompra - totalProducto
        }));
    };

    // Enviar formulario
    const handleSubmit = (e) => {
        e.preventDefault();
        if (compraData.productos.length === 0) {
            alert('Debe agregar al menos un producto');
            return;
        }
        console.log('Datos de la compra:', compraData);
        alert('Compra guardada exitosamente!');
    };

    return (
        <div className="role-form-container">
            <Nav menuCollapsed={menuCollapsed} toggleMenu={toggleMenu} />

            <div className={`formulario-rol-main-content-area ${menuCollapsed ? 'expanded-margin' : ''}`}>

                <div className="formulario-roles">
                    <h1 className="form-title">Nueva Compra</h1>
                    <p className="form-info">Complete los campos para registrar una nueva compra en el sistema.</p><br /><br />

                    <form onSubmit={handleSubmit} className="role-form">
                        {/* Primera fila */}
                        <div className="form-row">
                            <div className="form-group">
                                <label htmlFor="proveedor" className="label-heading">Proveedor: <span className="required-asterisk">*</span></label>
                                <select
                                    id="proveedor"
                                    name="proveedor"
                                    value={compraData.proveedor}
                                    onChange={handleChange}
                                    required
                                    className="barrio-select"
                                >
                                    <option value="">Seleccione proveedor</option>
                                    <option value="Heydol Loaiza">Heydol Loaiza</option>
                                    <option value="Jennifer Vergara">Jennifer Vergara</option>
                                    <option value="Andrew Hincapie">Andrew Hincapie</option>
                                </select>
                            </div>
                        </div>

                        {/* Segunda fila */}
                        <div className="form-row">
                            <div className="form-group">
                                <label htmlFor="fechaCompra" className="label-heading">Fecha Compra: <span className="required-asterisk">*</span></label>
                                <input
                                    type="date"
                                    id="fechaCompra"
                                    name="fechaCompra"
                                    value={compraData.fechaCompra}
                                    onChange={handleChange}
                                    className="input-field"
                                />
                            </div>

                            <div className="form-group">
                                <label htmlFor="formaPago" className="label-heading">Forma de Pago: <span className="required-asterisk">*</span></label>
                                <select
                                    id="formaPago"
                                    name="formaPago"
                                    value={compraData.formaPago}
                                    onChange={handleChange}
                                    className="barrio-select"
                                >
                                    <option value="Efectivo">Efectivo</option>
                                    <option value="Transferencia">Transferencia</option>
                                    <option value="Tarjeta">Tarjeta</option>
                                    <option value="Cheque">Cheque</option>
                                </select>
                            </div>
                        </div>

                        {/* Sección de productos */}
                        <div className="form-section">
                            <h3 className="section-title form-title">Productos</h3>

                            <div className="form-row">
                                <div className="form-group">
                                    <label htmlFor="nombre" className="label-heading">Prenda:<span className="required-asterisk">*</span></label>
                                    <select
                                        id="nombre"
                                        name="nombre"
                                        value={nuevoProducto.nombre}
                                        onChange={handleProductoChange}
                                        className="barrio-select"
                                        required
                                    >
                                        <option value="">Seleccione una prenda</option>
                                        {prendas.map((prenda, index) => (
                                            <option key={index} value={prenda}>{prenda}</option>
                                        ))}
                                    </select>
                                </div>

                                {/* Grupo de campos en línea - CENTRADO Y ALINEADO */}
                                <div style={{
                                    display: 'flex',
                                    gap: '15px',
                                    alignItems: 'flex-end',
                                    justifyContent: 'center',
                                    margin: '0 auto',
                                    width: '100%',
                                    maxWidth: '500px'
                                }}>
                                    <div className="form-group" style={{ width: '100px' }}>
                                        <label htmlFor="talla" className="label-heading">Talla:<span className="required-asterisk">*</span></label>
                                        <select
                                            id="talla"
                                            name="talla"
                                            value={nuevoProducto.talla}
                                            onChange={handleProductoChange}
                                            className="barrio-select"
                                            required
                                            style={{ width: '100%' }}
                                        >
                                            {tallas.map((talla, index) => (
                                                <option key={index} value={talla}>{talla}</option>
                                            ))}
                                        </select>
                                    </div>

                                    <div className="form-group" style={{ width: '150px' }}>
                                        <label htmlFor="color" className="label-heading">Color:<span className="required-asterisk">*</span></label>
                                        <select
                                            id="color"
                                            name="color"
                                            value={nuevoProducto.color}
                                            onChange={handleProductoChange}
                                            className="barrio-select"
                                            required
                                            style={{ width: '100%' }}
                                        >
                                            {colores.map((color, index) => (
                                                <option key={index} value={color}>{color}</option>
                                            ))}
                                        </select>
                                    </div>

                                    <div className="form-group" style={{ width: '100px' }}>
                                        <label htmlFor="cantidad" className="label-heading">Cantidad:<span className="required-asterisk">*</span></label>
                                        <input
                                            type="number"
                                            id="cantidad"
                                            name="cantidad"
                                            min="1"
                                            value={nuevoProducto.cantidad}
                                            onChange={handleProductoChange}
                                            className="input-field"
                                            required
                                            style={{ width: '100%' }}
                                        />
                                    </div>
                                    <div className="form-group" style={{ width: '90px' }}>
                                        <label htmlFor="precio" className="label-heading">Precio:<span className="required-asterisk">*</span></label>
                                        <input
                                            type="number"
                                            id="precio"
                                            name="precio"
                                            min="0"
                                            step="0.01"
                                            value={nuevoProducto.precio}
                                            onChange={handleProductoChange}
                                            className="input-field"
                                            required
                                            style={{ width: '100%' }}
                                        />
                                    </div>

                                </div>

                                <div className="form-group">
                                    <button
                                        type="button"
                                        className="save-button"
                                        onClick={agregarProducto}
                                    >
                                        Agregar Compra
                                    </button>
                                </div>
                            </div>

                            {/* Tabla de productos - MÁS PEQUEÑA Y CENTRADA */}
                            {compraData.productos.length > 0 && (
                                <div style={{
                                    display: 'flex',
                                    justifyContent: 'center',
                                    width: '100%',
                                    margin: '2rem 0'
                                }}>
                                    <div
                                        className="compra-product-table-container"
                                        style={{
                                            width: '95%',
                                            maxWidth: '700px',
                                            fontSize: '0.85rem'
                                        }}
                                    >
                                        <table
                                            className="compra-product-table"
                                            style={{
                                                width: '100%',
                                                borderCollapse: 'collapse'
                                            }}
                                        >
                                            <thead>
                                                <tr>
                                                    <th style={{ padding: '0.75rem 0.5rem', fontSize: '0.8rem' }}>Prenda</th>
                                                    <th style={{ padding: '0.75rem 0.3rem', fontSize: '0.8rem' }}>Talla</th>
                                                    <th style={{ padding: '0.75rem 0.3rem', fontSize: '0.8rem' }}>Color</th>
                                                    <th style={{ padding: '0.75rem 0.3rem', fontSize: '0.8rem' }}>Cant.</th>
                                                    <th style={{ padding: '0.75rem 0.4rem', fontSize: '0.8rem' }}>Precio</th>
                                                    <th style={{ padding: '0.75rem 0.4rem', fontSize: '0.8rem' }}>Subtotal</th>
                                                    <th style={{ padding: '0.75rem 0.3rem', fontSize: '0.8rem' }}>Acción</th>
                                                </tr>
                                            </thead>
                                            <tbody>
                                                {compraData.productos.map((producto) => (
                                                    <tr key={producto.id}>
                                                        <td
                                                            className='negro'
                                                            style={{ padding: '0.6rem 0.5rem', fontSize: '0.8rem' }}
                                                        >
                                                            {producto.nombre}
                                                        </td>
                                                        <td
                                                            className='negro'
                                                            style={{ padding: '0.6rem 0.3rem', fontSize: '0.8rem', textAlign: 'center' }}
                                                        >
                                                            {producto.talla}
                                                        </td>
                                                        <td
                                                            className='negro'
                                                            style={{ padding: '0.6rem 0.3rem', fontSize: '0.8rem' }}
                                                        >
                                                            {producto.color}
                                                        </td>
                                                        <td
                                                            className='negro'
                                                            style={{ padding: '0.6rem 0.3rem', fontSize: '0.8rem', textAlign: 'center' }}
                                                        >
                                                            {producto.cantidad}
                                                        </td>
                                                        <td
                                                            className='negro'
                                                            style={{ padding: '0.6rem 0.4rem', fontSize: '0.8rem' }}
                                                        >
                                                            ${producto.precio.toLocaleString()}
                                                        </td>
                                                        <td
                                                            className='negro'
                                                            style={{ padding: '0.6rem 0.4rem', fontSize: '0.8rem' }}
                                                        >
                                                            ${(producto.cantidad * producto.precio).toLocaleString()}
                                                        </td>
                                                        <td style={{ padding: '0.6rem 0.3rem', textAlign: 'center' }}>
                                                            <button
                                                                className="cancel-button"
                                                                onClick={() => eliminarProducto(producto.id)}
                                                                style={{
                                                                    fontSize: '0.7rem',
                                                                    padding: '0.4rem 0.6rem'
                                                                }}
                                                            >
                                                                ✕
                                                            </button>
                                                        </td>
                                                    </tr>
                                                ))}
                                            </tbody>
                                        </table>
                                    </div>
                                </div>
                            )}
                        </div>

                        {/* Resumen de compra - CENTRADO Y MÁS PEQUEÑO */}
                        <div
                            className="compra-summary"
                            style={{
                                maxWidth: '250px',
                                margin: '2rem auto',
                                padding: '1rem'
                            }}
                        >
                            <div className="compra-summary-row">
                                <span className='negro' style={{ fontSize: '0.9rem' }}>Subtotal:</span>
                                <span className='negro' style={{ fontSize: '0.9rem' }}>${compraData.subtotal.toLocaleString()}</span>
                            </div>
                            <div className="compra-summary-row">
                                <span className='negro' style={{ fontSize: '0.9rem' }}>IVA (19%):</span>
                                <span className='negro' style={{ fontSize: '0.9rem' }}>${compraData.iva.toLocaleString()}</span>
                            </div>
                            <div className="compra-summary-row">
                                <span className='negro' style={{ fontSize: '0.9rem' }}>Descuento: $ 0.0</span>
                            </div>
                            <div className="compra-summary-divider"></div>
                            <div className="compra-summary-row compra-total">
                                <span className='negro' style={{ fontSize: '1rem' }}>Total:</span>
                                <span className='negro' style={{ fontSize: '1rem' }}>${compraData.totalCompra.toLocaleString()}</span>
                            </div>
                        </div><br />

                        <div className="form-buttons">
                            <button
                                type="button"
                                className="cancel-button"
                                onClick={() => navigate(-1)}
                            >
                                Cancelar
                            </button>

                            <Link to='/compras' className='save-button-compra'>
                                <FaSave className="save-icon" /> Guardar Compra
                            </Link>
                        </div>
                    </form>
                </div>
            </div>
        </div>
    );
}

export default FormAdd;