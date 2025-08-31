import React, { useState, useRef } from 'react';
import { FaFilePdf, FaEye, FaPlus, FaSearch, FaTrash } from 'react-icons/fa';
import { Link } from 'react-router-dom';
import Nav from '../components/Nav.jsx';
import DetallesCompras from '../components/DetallesCompras.jsx';

import './UsuariosPage.css';

import jsPDF from 'jspdf';
import html2canvas from 'html2canvas';

const ComprasForm = () => {
  const [menuCollapsed, setMenuCollapsed] = useState(false);
  const toggleMenu = () => {
    setMenuCollapsed(!menuCollapsed);
  };

  const [compras, setCompras] = useState([
    {
      id: 1,
      numeroCompra: 'C-001',
      proveedor: 'Proveedor A',
      fechaCompra: '2023-05-15',
      totalCompra: 12500,
      estado: 'Activo',
      formaPago: 'Transferencia',
      fechaRegistro: '2023-05-15T10:30:00',
      productos: [
        { id: 1, nombre: 'Producto 1', cantidad: 2, precio: 2500, talla: 'M', color: 'Azul' },
        { id: 2, nombre: 'Producto 2', cantidad: 1, precio: 7500, talla: 'S', color: 'Negro' }
      ],
      subtotal: 12500,
      iva: 2000,
      descuento: 0.0
    },
    {
      id: 2,
      numeroCompra: 'C-002',
      proveedor: 'Proveedor B',
      fechaCompra: '2023-05-18',
      totalCompra: 8400,
      estado: 'Activo',
      formaPago: 'Efectivo',
      fechaRegistro: '2023-05-18T14:15:00',
      productos: [
        { id: 3, nombre: 'Producto 3', cantidad: 3, precio: 2800, talla: 'M', color: 'Azul' }
      ],
      subtotal: 8400,
      iva: 2000,
      descuento: 0.0
    },
    {
      id: 3,
      numeroCompra: 'C-003',
      proveedor: 'Proveedor C',
      fechaCompra: '2025-07-28',
      totalCompra: 8400,
      estado: 'Anulado',
      formaPago: 'Efectivo',
      fechaRegistro: '2023-05-18T14:15:00',
      productos: [
        { id: 3, nombre: 'Producto 3', cantidad: 3, precio: 2800, talla: 'M', color: 'Azul' }
      ],
      subtotal: 8400,
      iva: 2000,
      descuento: 0.0
    }
  ]);

  const [nuevaCompra, setNuevaCompra] = useState({
    numeroCompra: '',
    proveedor: '',
    fechaCompra: new Date().toISOString().split('T')[0],
    totalCompra: 0,
    estado: 'activo',
    formaPago: 'Efectivo',
    fechaRegistro: new Date().toISOString(),
    productos: [],
    subtotal: 0,
    iva: 2000,
    descuento: 0.0
  });

  const [nuevoProducto, setNuevoProducto] = useState({
    nombre: '',
    cantidad: 1,
    precio: 0
  });

  const [mostrarFormulario, setMostrarFormulario] = useState(false);
  const [mostrarDetalles, setMostrarDetalles] = useState(null);
  const [mostrarModalDetalles, setMostrarModalDetalles] = useState(null);
  const [compraAAnular, setCompraAAnular] = useState(null);
  const pdfRef = useRef();

  // Función para generar PDF con cierre automático
  const generarPDFConCierreAutomatico = async (compra) => {
    const input = pdfRef.current;

    // Crear un nuevo PDF
    const pdf = new jsPDF('p', 'mm', 'a4', true);
    const pdfWidth = pdf.internal.pageSize.getWidth();
    const pdfHeight = pdf.internal.pageSize.getHeight();

    // Capturar el contenido como imagen
    const canvas = await html2canvas(input, {
      scale: 2,
      useCORS: true,
      allowTaint: true
    });

    const imgData = canvas.toDataURL('image/png');
    const imgWidth = pdfWidth;
    const imgHeight = (canvas.height * imgWidth) / canvas.width;

    // Agregar la imagen al PDF
    pdf.addImage(imgData, 'PNG', 0, 0, imgWidth, imgHeight);

    // Guardar el PDF
    pdf.save(`compra_${compra.numeroCompra}.pdf`);

    // Programar cierre automático después de 2 segundos
    setTimeout(() => {
      setMostrarDetalles(null);
    }, 2000);
  };

  // Manejar cambios en los inputs
  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setNuevaCompra({
      ...nuevaCompra,
      [name]: value
    });
  };

  const handleProductoChange = (e) => {
    const { name, value } = e.target;
    setNuevoProducto({
      ...nuevoProducto,
      [name]: name === 'cantidad' || name === 'precio' ? parseFloat(value) : value
    });
  };

  // Agregar producto a la compra
  const agregarProducto = () => {
    if (!nuevoProducto.nombre || nuevoProducto.precio <= 0) return;

    const producto = {
      id: Date.now(),
      ...nuevoProducto
    };

    const subtotal = nuevaCompra.subtotal + (producto.cantidad * producto.precio);
    const totalCompra = subtotal + nuevaCompra.iva - nuevaCompra.descuento;

    setNuevaCompra({
      ...nuevaCompra,
      productos: [...nuevaCompra.productos, producto],
      subtotal: subtotal,
      totalCompra: totalCompra
    });

    setNuevoProducto({
      nombre: '',
      cantidad: 1,
      precio: 0
    });
  };

  // Guardar nueva compra
  const guardarCompra = () => {
    if (!nuevaCompra.numeroCompra || !nuevaCompra.proveedor || nuevaCompra.productos.length === 0) {
      alert('Complete todos los campos obligatorios');
      return;
    }

    const compraConId = {
      ...nuevaCompra,
      id: Date.now()
    };

    setCompras([...compras, compraConId]);
    setNuevaCompra({
      numeroCompra: '',
      proveedor: '',
      fechaCompra: new Date().toISOString().split('T')[0],
      totalCompra: 0,
      estado: 'activo',
      formaPago: 'Efectivo',
      fechaRegistro: new Date().toISOString(),
      productos: [],
      subtotal: 0,
      iva: 2000,
      descuento: 0.0
    });
    setMostrarFormulario(false);
  };

  // Mostrar modal de confirmación para anular compra
  const confirmarAnulacion = (id) => {
    setCompraAAnular(id);
  };

  // Anular compra después de confirmación
  const anularCompra = () => {
    setCompras(compras.map(compra =>
      compra.id === compraAAnular ? { ...compra, estado: 'anulado' } : compra
    ));
    setCompraAAnular(null);
  };

  // Ver detalles y abrir modal
  const handleVerDetalles = (compra) => {
    setMostrarModalDetalles(compra);
  };

  // Ver detalles
  const verDetalles = (id) => {
    setMostrarDetalles(compras.find(compra => compra.id === id));
  };

  // Filtrar compras
  const filteredCompras = compras;

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
            />
            <button className="search-button">
              <FaSearch color="#fff" /> Buscar
            </button>
          </div>
          <Link to='/comprasform' className="add-button"><FaPlus style={{ marginRight: '8px', color: "#fff" }} /> Nueva Compra</Link>
        </div>

        <div className="table-container">
          <div className="table-wrapper">
            <table className="table table-striped table-hover">
              <thead>
                <tr>
                  <th>Número Compra</th>
                  <th>Proveedor</th>
                  <th>Fecha Compra</th>
                  <th>Total</th>
                  <th>Estado</th>
                  <th>Acciones</th>
                </tr>
              </thead>
              <tbody>
                {filteredCompras.length > 0 ? (
                  filteredCompras.map((compra) => (
                    <tr key={compra.id}>
                      <td>{compra.numeroCompra}</td>
                      <td>{compra.proveedor}</td>
                      <td>{compra.fechaCompra}</td>
                      <td>${compra.totalCompra.toLocaleString()}</td>
                      <td>
                        <span className={`badge ${compra.estado === 'activo' ? 'bg-success' : 'bg-danger'}`}>
                          {compra.estado}
                        </span>
                      </td>
                      <td className="icons">
                        <button
                          className="icon-button blue"
                          onClick={() => {
                            verDetalles(compra.id);
                            setTimeout(() => generarPDFConCierreAutomatico(compra), 500);
                          }}
                          title="Generar PDF"
                        >
                          <FaFilePdf />
                        </button>
                        <button onClick={() => handleVerDetalles(compra)} className="icon-button black">
                          <FaEye />
                        </button>
                        {compra.estado === 'activo' && (
                          <button
                            className="icon-button red"
                            onClick={() => confirmarAnulacion(compra.id)}
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
                    <td colSpan="6" style={{ textAlign: 'center', padding: '20px' }}>
                      No se encontraron compras.
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </div>
        <br /><br /><br /><br /><br />

        {/* Modal para detalles y generación de PDF */}
        {mostrarDetalles && (
          <div className="modal">
            <div className="modal-dialog modal-lg">
              <div className="modal-content">
                <div className="modal-header">
                  <h5 className="modal-title">Detalles de Compra {mostrarDetalles.numeroCompra}</h5>
                  <button
                    type="button"
                    className="btn-close"
                    onClick={() => setMostrarDetalles(null)}
                  ></button>
                </div>
                <div className="modal-body" ref={pdfRef}>
                  <div style={{ padding: '20px', fontFamily: 'Arial, sans-serif' }}>
                    <div style={{ textAlign: 'center', marginBottom: '20px' }}>
                      <h2 style={{ color: '#333' }}>Comprobante de Compra</h2>
                      <p style={{ color: '#666' }}>N°: {mostrarDetalles.numeroCompra}</p>
                    </div>

                    <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '20px' }}>
                      <div>
                        <h4 style={{ color: '#333', marginBottom: '10px' }}>Datos del Proveedor</h4>
                        <p><strong>Nombre:</strong> {mostrarDetalles.proveedor}</p>
                      </div>
                      <div style={{ textAlign: 'right' }}>
                        <p><strong>Fecha:</strong> {mostrarDetalles.fechaCompra}</p>
                        <p><strong>Estado:</strong>
                          <span style={{
                            color: mostrarDetalles.estado === 'activo' ? 'green' : 'red',
                            fontWeight: 'bold',
                            marginLeft: '5px'
                          }}>
                            {mostrarDetalles.estado.toUpperCase()}
                          </span>
                        </p>
                      </div>
                    </div>

                    <h4 style={{ color: '#333', marginBottom: '15px' }}>Detalle de Productos</h4>
                    <table style={{ width: '100%', borderCollapse: 'collapse', marginBottom: '20px' }}>
                      <thead>
                        <tr style={{ backgroundColor: '#f5f5f5' }}>
                          <th style={{ padding: '10px', border: '1px solid #ddd', textAlign: 'left' }}>Producto</th>
                          <th style={{ padding: '10px', border: '1px solid #ddd', textAlign: 'center' }}>Cantidad</th>
                          <th style={{ padding: '10px', border: '1px solid #ddd', textAlign: 'right' }}>Precio Unitario</th>
                          <th style={{ padding: '10px', border: '1px solid #ddd', textAlign: 'right' }}>Subtotal</th>
                        </tr>
                      </thead>
                      <tbody>
                        {mostrarDetalles.productos.map((producto) => (
                          <tr key={producto.id}>
                            <td style={{ padding: '10px', border: '1px solid #ddd' }}>{producto.nombre}</td>
                            <td style={{ padding: '10px', border: '1px solid #ddd', textAlign: 'center' }}>{producto.cantidad}</td>
                            <td style={{ padding: '10px', border: '1px solid #ddd', textAlign: 'right' }}>${producto.precio.toLocaleString()}</td>
                            <td style={{ padding: '10px', border: '1px solid #ddd', textAlign: 'right' }}>${(producto.cantidad * producto.precio).toLocaleString()}</td>
                          </tr>
                        ))}
                      </tbody>
                    </table>

                    <div style={{ float: 'right', width: '300px', border: '1px solid #ddd', padding: '15px', backgroundColor: '#f9f9f9' }}>
                      <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '8px' }}>
                        <span><strong>Subtotal:</strong></span>
                        <span>${mostrarDetalles.subtotal.toLocaleString()}</span>
                      </div>
                      <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '8px' }}>
                        <span><strong>IVA:</strong></span>
                        <span>${mostrarDetalles.iva.toLocaleString()}</span>
                      </div>
                      <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '8px' }}>
                        <span><strong>Descuento:</strong></span>
                        <span>${mostrarDetalles.descuento.toLocaleString()}</span>
                      </div>
                      <hr style={{ margin: '10px 0', borderColor: '#ddd' }} />
                      <div style={{ display: 'flex', justifyContent: 'space-between', fontWeight: 'bold', fontSize: '1.1em' }}>
                        <span><strong>TOTAL:</strong></span>
                        <span>${mostrarDetalles.totalCompra.toLocaleString()}</span>
                      </div>
                    </div>

                    <div style={{ clear: 'both', marginTop: '50px', paddingTop: '20px', borderTop: '1px solid #ddd', textAlign: 'center' }}>
                      <p style={{ color: '#666' }}>Forma de Pago: {mostrarDetalles.formaPago}</p>
                      <p style={{ color: '#666', fontStyle: 'italic' }}>Gracias por su compra</p>
                    </div>
                  </div>
                </div>
                <div className="modal-footer">
                  <button
                    type="button"
                    className="btn btn-secondary me-2"
                    onClick={() => generarPDFConCierreAutomatico(mostrarDetalles)}
                  >
                    <FaFilePdf /> Generar PDF
                  </button>
                  <button
                    type="button"
                    className="btn btn-secondary"
                    onClick={() => setMostrarDetalles(null)}
                  >
                    Cerrar
                  </button>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Modal de confirmación para anular compra */}
        {compraAAnular && (
          <div className="delete-rol-overlay">
            <div className="delete-rol-content inner-confirmation-modal">
              <div className="modal-header" style={{ borderBottom: 'none', paddingBottom: '0' }}>
                <h5 className="modal-title" style={{ color: '#ff4d4f', fontSize: '1.8rem' }}>Confirmar Anulación</h5>

              </div>
              <div className="modal-body" style={{ textAlign: 'center' }}>
                <p className="delete-message" style={{ color: '#666' }}>¿Está seguro que desea anular esta compra?</p>
                <p className="text-danger" style={{ color: '#e70017', fontWeight: 'bold' }}>Una vez anulada no se podrá volver a habilitar.</p>
              </div>
              <div className="modal-footer" style={{ borderTop: 'none', paddingTop: '0', justifyContent: 'center' }}>
                <button
                  type="button"
                  className="cancel-button"
                  onClick={() => setCompraAAnular(null)}
                >
                  Cancelar
                </button>
                <button
                  type="button"
                  className="confirm-delete-button"
                  onClick={anularCompra}
                >
                  Anular Compra <FaTrash />
                </button>
              </div>
            </div>
          </div>
        )}

        {/* Modal de detalles de compra */}
        {mostrarModalDetalles && (
          <DetallesCompras
            compraData={mostrarModalDetalles}
            onClose={() => setMostrarModalDetalles(null)}
          />
        )}
      </div>
    </div>
  );
};

export default ComprasForm;