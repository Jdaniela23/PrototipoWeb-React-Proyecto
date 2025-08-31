import React from 'react';
import { FaArrowLeft } from 'react-icons/fa';
import { Link } from 'react-router-dom';
import { useState } from 'react';
import Nav from '../components/Nav2';

function ShowPurchase() {
    const [menuCollapsed, setMenuCollapsed] = useState(false);

    const compraData = {
        numeroCompra: 'COMP-2023-001',
        proveedor: 'Heydol Loaiza',
        fechaCompra: '2023-05-15',
        formaPago: 'Efectivo',
        estado: 'activo',
        productos: [
            { id: 1, nombre: 'Camisas', talla: 'M', color: 'Azul', cantidad: 3, precio: 25000 },
            { id: 2, nombre: 'Pantalones', talla: 'L', color: 'Negro', cantidad: 2, precio: 45000 }
        ],
        subtotal: 165000,
        iva: 31350,
        totalCompra: 196350
    };

    return (
        <div style={{
            display: 'flex',
            minHeight: '100vh',
            fontFamily: 'Arial, sans-serif',
            color: '#000000'
        }}>
            {/* Componente Nav */}
            <Nav menuCollapsed={menuCollapsed} toggleMenu={() => setMenuCollapsed(!menuCollapsed)} />

            {/* Contenedor principal NO FLEX */}
            <div style={{
                width: '100%'
            }}>
                {/* Contenido principal */}
                <div style={{
                    padding: '20px',
                    marginLeft: menuCollapsed ? '80px' : '250px',
                    backgroundColor: '#ffffff',
                    transition: 'margin 0.3s ease',
                    minHeight: '100vh'
                }}>
                    {/* Título principal */}
                    <h1 style={{
                        fontSize: '24px',
                        fontWeight: 'bold',
                        marginBottom: '20px',
                        color: '#c89b3c'
                    }}>
                        Detalle De compra
                    </h1>

                    {/* Botón de volver */}
                    <div style={{ marginBottom: '20px' }}>
                        <Link to="/compras" style={{
                            display: 'inline-flex',
                            alignItems: 'center',
                            color: '#000000',
                            textDecoration: 'none',
                            fontWeight: '500'
                        }}>
                            <FaArrowLeft style={{ marginRight: '8px' }} /> Volver a compras
                        </Link>
                    </div>

                    {/* Título de la compra */}
                    <h2 style={{
                        fontSize: '18px',
                        fontWeight: '600',
                        margin: '0 0 20px 0',
                        paddingBottom: '10px',
                        borderBottom: '1px solid #eee',
                        color: '#c89b3c'
                    }}>
                        Detalle de Compra #{compraData.numeroCompra}
                    </h2>

                    {/* Información de la compra */}
                    <table style={{
                        width: '100%',
                        borderCollapse: 'collapse',
                        marginBottom: '25px',
                        fontSize: '14px'
                    }}>
                        <tbody>
                            <tr>
                                <td style={{ padding: '5px 10px', fontWeight: '600', width: '120px' }}>Proveedor:</td>
                                <td style={{ padding: '5px 10px' }}>{compraData.proveedor}</td>
                                <td style={{ padding: '5px 10px', fontWeight: '600', width: '80px' }}>Fecha:</td>
                                <td style={{ padding: '5px 10px' }}>{compraData.fechaCompra}</td>
                            </tr>
                            <tr>
                                <td style={{ padding: '5px 10px', fontWeight: '600' }}>Forma de pago:</td>
                                <td style={{ padding: '5px 10px' }}>{compraData.formaPago}</td>
                                <td style={{ padding: '5px 10px', fontWeight: '600' }}>Estado:</td>
                                <td style={{
                                    padding: '5px 10px',
                                    color: compraData.estado === 'activo' ? '#28a745' : '#dc3545'
                                }}>
                                    {compraData.estado}
                                </td>
                            </tr>
                        </tbody>
                    </table>

                    {/* Tabla de productos */}
                    <table style={{
                        width: '100%',
                        borderCollapse: 'collapse',
                        marginBottom: '25px',
                        fontSize: '14px'
                    }}>
                        <thead>
                            <tr style={{
                                backgroundColor: '#f8f9fa',
                                borderBottom: '1px solid #dee2e6',
                                borderTop: '1px solid #dee2e6'
                            }}>
                                <th style={{ padding: '10px', textAlign: 'left', fontWeight: '600' }}>Prenda</th>
                                <th style={{ padding: '10px', textAlign: 'left', fontWeight: '600' }}>Talla</th>
                                <th style={{ padding: '10px', textAlign: 'left', fontWeight: '600' }}>Color</th>
                                <th style={{ padding: '10px', textAlign: 'left', fontWeight: '600' }}>Cantidad</th>
                                <th style={{ padding: '10px', textAlign: 'left', fontWeight: '600' }}>Precio Unitario</th>
                                <th style={{ padding: '10px', textAlign: 'left', fontWeight: '600' }}>Subtotal</th>
                            </tr>
                        </thead>
                        <tbody>
                            {compraData.productos.map((producto) => (
                                <tr key={producto.id} style={{ borderBottom: '1px solid #eee' }}>
                                    <td style={{ padding: '10px' }}>{producto.nombre}</td>
                                    <td style={{ padding: '10px' }}>{producto.talla}</td>
                                    <td style={{ padding: '10px' }}>{producto.color}</td>
                                    <td style={{ padding: '10px' }}>{producto.cantidad}</td>
                                    <td style={{ padding: '10px' }}>${producto.precio.toLocaleString()}</td>
                                    <td style={{ padding: '10px' }}>${(producto.cantidad * producto.precio).toLocaleString()}</td>
                                </tr>
                            ))}
                        </tbody>
                    </table>

                    {/* Resumen de compra */}
                    <div style={{
                        width: '250px',
                        fontSize: '14px',
                        marginTop: '20px'
                    }}>
                        <div style={{
                            display: 'flex',
                            justifyContent: 'space-between',
                            marginBottom: '5px'
                        }}>
                            <span>Subtotal:</span>
                            <span>${compraData.subtotal.toLocaleString()}</span>
                        </div>
                        <div style={{
                            display: 'flex',
                            justifyContent: 'space-between',
                            marginBottom: '5px'
                        }}>
                            <span>IVA (19%):</span>
                            <span>${compraData.iva.toLocaleString()}</span>
                        </div>
                        <div style={{
                            display: 'flex',
                            justifyContent: 'space-between',
                            marginTop: '10px',
                            paddingTop: '10px',
                            borderTop: '1px solid #dee2e6',
                            fontWeight: '600'
                        }}>
                            <span>Total:</span>
                            <span>${compraData.totalCompra.toLocaleString()}</span>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}

export default ShowPurchase;