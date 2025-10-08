import React, { useState, useEffect } from 'react';
import './FormAdd.css';
import Nav from '../components/Nav.jsx';
import { useNavigate } from 'react-router-dom';
import { FaSave } from 'react-icons/fa';
import { getProveedores } from "../api/proveedoresService.js";
import { getProducts } from "../api/productsService.js";
import { createCompras } from "../api/comprasService.js";

function Comprasform() {
  const [menuCollapsed, setMenuCollapsed] = useState(false);
  const [proveedores, setProveedores] = useState([]);
  const [productos, setProductos] = useState([]);
  const navigate = useNavigate();

  const [compraData, setCompraData] = useState({
    proveedor: '',
    fechaCompra: '',
    formaPago: 'Efectivo',
    estado: 'Activo',
    productos: [],
    subtotal: 0,
    iva: 0,
    descuento: 0,
    totalCompra: 0
  });

  const [nuevoProducto, setNuevoProducto] = useState({
    id_Producto: '',
    nombre_Producto: '',
    cantidad: 1,
    precio: 0
  });

  // Cargar proveedores y productos
  useEffect(() => {
    getProveedores()
      .then(data => setProveedores(data))
      .catch(err => console.error("Error al cargar proveedores:", err));

    getProducts()
      .then(data => setProductos(data))
      .catch(err => console.error("Error al cargar productos:", err));
  }, []);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setCompraData(prev => ({ ...prev, [name]: value }));
  };

  const handleProductoSelect = (e) => {
    const selectedId = parseInt(e.target.value, 10);
    const producto = productos.find(p => p.id_Producto === selectedId);

    if (producto) {
      setNuevoProducto({
        id_Producto: producto.id_Producto,
        nombre_Producto: producto.nombre_Producto,
        cantidad: 1,
        precio: producto.precio
      });
    } else {
      setNuevoProducto({ id_Producto: '', nombre_Producto: '', cantidad: 1, precio: 0 });
    }
  };

  const handleProductoChange = (e) => {
    const { name, value } = e.target;
    setNuevoProducto(prev => ({
      ...prev,
      [name]: name === 'cantidad' ? parseInt(value) || 0 : parseFloat(value) || 0
    }));
  };

  const agregarProducto = (e) => {
    e.preventDefault();
    if (!nuevoProducto.id_Producto || nuevoProducto.cantidad <= 0) {
      alert('Seleccione un producto y una cantidad válida');
      return;
    }

    const productoYaAgregado = compraData.productos.find(p => p.id_Producto === nuevoProducto.id_Producto);
    if (productoYaAgregado) {
      alert('El producto ya está agregado. Puede ajustar la cantidad desde la tabla.');
      return;
    }

    setCompraData(prev => {
      const subtotalProducto = nuevoProducto.cantidad * nuevoProducto.precio;
      const ivaProducto = subtotalProducto * 0.19;
      const totalProducto = subtotalProducto + ivaProducto;

      return {
        ...prev,
        productos: [...prev.productos, { ...nuevoProducto }],
        subtotal: prev.subtotal + subtotalProducto,
        iva: prev.iva + ivaProducto,
        totalCompra: prev.totalCompra + totalProducto
      };
    });

    setNuevoProducto({ id_Producto: '', nombre_Producto: '', cantidad: 1, precio: 0 });
  };

  const eliminarProducto = (id_Producto) => {
    setCompraData(prev => {
      const producto = prev.productos.find(p => p.id_Producto === id_Producto);
      if (!producto) return prev;

      const subtotalProducto = producto.cantidad * producto.precio;
      const ivaProducto = subtotalProducto * 0.19;
      const totalProducto = subtotalProducto + ivaProducto;

      return {
        ...prev,
        productos: prev.productos.filter(p => p.id_Producto !== id_Producto),
        subtotal: prev.subtotal - subtotalProducto,
        iva: prev.iva - ivaProducto,
        totalCompra: prev.totalCompra - totalProducto
      };
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!compraData.proveedor) {
      alert('Seleccione un proveedor');
      return;
    }

    if (compraData.productos.length === 0) {
      alert('Debe agregar al menos un producto');
      return;
    }

    // Asegurarnos de que el id_Proveedor sea un número válido
    const idProveedor = parseInt(compraData.proveedor, 10);
    if (isNaN(idProveedor)) {
      alert('Proveedor inválido');
      return;
    }

    // Formato correcto de fechas para .NET
    const fechaCompraProveedor = compraData.fechaCompra ? `${compraData.fechaCompra}T00:00:00.000Z` : null;
    const fechaRegistro = new Date().toISOString();

    // Payload CORREGIDO - según el controlador que me mostraste
    // El backend espera directamente un objeto Compras con DetalleCompras
    const compraPayload = {
      id_Proveedor: idProveedor,
      fecha_Compra_Proveedor: fechaCompraProveedor,
      fecha_registro: fechaRegistro,
      forma_Pago: compraData.formaPago,
      estado: "Activo",
      subtotal: compraData.subtotal,
      descuento: compraData.descuento,
      iva: compraData.iva,
      total: compraData.totalCompra,
      DetalleCompras: compraData.productos.map(producto => ({
        id_Producto: producto.id_Producto,
        cantidad: producto.cantidad,
        precio: producto.precio,
        subtotal: producto.cantidad * producto.precio
      }))
    };

    console.log("📤 Enviando compra con estructura CORRECTA:", compraPayload);

    try {
      // Crear la compra principal CON los detalles incluidos
      const compraResponse = await createCompras(compraPayload);
      console.log("✅ Compra creada exitosamente:", compraResponse);
      
      alert('Compra guardada exitosamente');
      navigate('/compras');
    } catch (error) {
      console.error('Error completo al guardar compra:', error);
      alert('Hubo un error al guardar la compra: ' + (error.message || 'Error desconocido'));
    }
  };

  return (
    <div className="role-form-container">
      <Nav menuCollapsed={menuCollapsed} toggleMenu={() => setMenuCollapsed(!menuCollapsed)} />
      <div className={`formulario-rol-main-content-area ${menuCollapsed ? 'expanded-margin' : ''}`}>
        <div className="formulario-roles">
          <h1 className="form-title">Nueva Compra</h1>
          <p className="form-info">Complete los campos para registrar una nueva compra en el sistema.</p><br /><br />

          <form onSubmit={handleSubmit} className="role-form">

            {/* Proveedor */}
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
                  {proveedores.map(p => (
                    <option key={p.idProveedor} value={p.idProveedor}>{p.nombre}</option>
                  ))}
                </select>
              </div>
            </div>

            {/* Fecha y forma de pago */}
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
                  required 
                />
              </div>
              <div className="form-group">
                <label htmlFor="formaPago" className="label-heading">Forma de Pago: <span className="required-asterisk">*</span></label>
                <select id="formaPago" name="formaPago" value={compraData.formaPago} onChange={handleChange} className="barrio-select">
                  <option value="Efectivo">Efectivo</option>
                  <option value="Transferencia">Transferencia</option>
                  <option value="Tarjeta">Tarjeta</option>
                  <option value="Cheque">Cheque</option>
                </select>
              </div>
            </div>

            {/* Productos */}
            <div className="form-section">
              <h3 className="section-title form-title">Productos</h3>
              <div className="form-row">
                <div className="form-group">
                  <label htmlFor="producto" className="label-heading">Producto:<span className="required-asterisk">*</span></label>
                  <select 
                    id="producto" 
                    name="id_Producto" 
                    value={nuevoProducto.id_Producto} 
                    onChange={handleProductoSelect} 
                    className="barrio-select"
                  >
                    <option value="">Seleccione un producto</option>
                    {productos.map(prod => (
                      <option key={prod.id_Producto} value={prod.id_Producto}>
                        {prod.nombre_Producto} - ${prod.precio.toLocaleString()}
                      </option>
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
                  />
                </div>

                <div className="form-group">
                  <button type="button" className="save-button" onClick={agregarProducto}>Agregar Producto</button>
                </div>
              </div>

              {/* Tabla de productos */}
              {compraData.productos.length > 0 && (
                <div style={{ display: 'flex', justifyContent: 'center', width: '100%', margin: '2rem 0' }}>
                  <div className="compra-product-table-container" style={{ width: '95%', maxWidth: '700px', fontSize: '0.85rem' }}>
                    <table className="compra-product-table" style={{ width: '100%', borderCollapse: 'collapse' }}>
                      <thead>
                        <tr>
                          <th>Producto</th>
                          <th>Cant.</th>
                          <th>Precio</th>
                          <th>Subtotal</th>
                          <th>Acción</th>
                        </tr>
                      </thead>
                      <tbody>
                        {compraData.productos.map((producto, index) => (
                          <tr key={`${producto.id_Producto}-${index}`}>
                            <td>{producto.nombre_Producto}</td>
                            <td style={{ textAlign: 'center' }}>{producto.cantidad}</td>
                            <td>${producto.precio.toLocaleString()}</td>
                            <td>${(producto.cantidad * producto.precio).toLocaleString()}</td>
                            <td style={{ textAlign: 'center' }}>
                              <button type="button" className="cancel-button" onClick={() => eliminarProducto(producto.id_Producto)}>✕</button>
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                </div>
              )}
            </div>

            {/* Resumen */}
            <div className="compra-summary" style={{ maxWidth: '250px', margin: '2rem auto', padding: '1rem' }}>
              <div className="compra-summary-row"><span className='subototal-addcompra'>Subtotal:</span><span className='subototal-addcompra'>${compraData.subtotal.toLocaleString()}</span></div>
              <div className="compra-summary-row"><span className='subototal-addcompra'>IVA (19%):</span><span className='subototal-addcompra'> ${compraData.iva.toLocaleString()}</span></div>
              <div className="compra-summary-row"><span className='subototal-addcompra'>Descuento: $0</span></div>
              <div className="compra-summary-divider"></div>
              <div className="compra-summary-row compra-total"><span className='subototal-addcompra'>Total:</span><span className='subototal-addcompra'>${compraData.totalCompra.toLocaleString()}</span></div>
            </div><br />

            <div className="form-buttons">
              <button type="button" className="cancel-button" onClick={() => navigate(-1)}>Cancelar</button>
              <button type="submit" className="save-button"><FaSave className="save-icon" /> Guardar Compra</button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}

export default Comprasform;