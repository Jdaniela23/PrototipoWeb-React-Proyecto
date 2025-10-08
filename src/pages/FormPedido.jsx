// src/pages/FormPedido.jsx
import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { FaSave, FaPlus } from 'react-icons/fa';
import Nav from '../components/Nav';
import { createPedido } from '../api/pedidosService';
import { getDetalleProductos } from '../api/detalleProductosService';
import { getAllUsers } from '../api/usersService';
import './Page.css';

export default function FormPedido() {
  const navigate = useNavigate();
  const [menuCollapsed, setMenuCollapsed] = useState(false);
  const [saving, setSaving] = useState(false);

  const [usuarios, setUsuarios] = useState([]);
  const [detalleProductos, setDetalleProductos] = useState([]);
  const [productosSeleccionados, setProductosSeleccionados] = useState([{ id_Detalle_Producto: '', cantidad: 1 }]);

  const [formData, setFormData] = useState({
    id_Usuario: '',
    metodo_Pago: '',
    domicilio: false,
    fecha_Entrega_Estimada: '',
    hora_Entrega_Estimada: ''
  });

  const toggleMenu = () => setMenuCollapsed(!menuCollapsed);

  useEffect(() => {
    const fetchDetalleProductos = async () => {
      try {
        const data = await getDetalleProductos();
        setDetalleProductos(data);
      } catch (error) {
        console.error('Error cargando detalle productos:', error);
      }
    };
    fetchDetalleProductos();
  }, []);

  useEffect(() => {
    const fetchUsuarios = async () => {
      try {
        const data = await getAllUsers();
        setUsuarios(data);
      } catch (error) {
        console.error('Error cargando usuarios:', error);
      }
    };
    fetchUsuarios();
  }, []);

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData({ ...formData, [name]: type === 'checkbox' ? checked : value });
  };

  const handleProductoChange = (index, idDetalle) => {
    const nuevos = [...productosSeleccionados];
    nuevos[index] = { ...nuevos[index], id_Detalle_Producto: idDetalle };
    setProductosSeleccionados(nuevos);
  };

  const handleCantidadChange = (index, cantidad) => {
    const nuevos = [...productosSeleccionados];
    const detalle = detalleProductos.find(p => p.id_Detalle_Producto === parseInt(nuevos[index].id_Detalle_Producto));
    const maxStock = detalle?.stock || 999;
    let cant = parseInt(cantidad) || 1;
    if (cant > maxStock) cant = maxStock;
    if (cant < 1) cant = 1;
    nuevos[index].cantidad = cant;
    setProductosSeleccionados(nuevos);
  };

  const agregarProducto = () => {
    setProductosSeleccionados([...productosSeleccionados, { id_Detalle_Producto: '', cantidad: 1 }]);
  };

  const eliminarProducto = (index) => {
    setProductosSeleccionados(productosSeleccionados.filter((_, i) => i !== index));
  };

  // Convierte hora 24h -> 12h con AM/PM
  function convertir24a12h(hora24) {
    if (!hora24) return null;
    let [hours, minutes] = hora24.split(':').map(Number);
    const ampm = hours >= 12 ? 'PM' : 'AM';
    hours = hours % 12;
    if (hours === 0) hours = 12;
    return `${hours}:${minutes.toString().padStart(2,'0')} ${ampm}`;
  }

  const handleSubmit = async (e) => {
    e.preventDefault();
    const productosValidos = productosSeleccionados.filter(p => p.id_Detalle_Producto !== '' && p.cantidad > 0);
    if (productosValidos.length === 0) { alert('Debes seleccionar al menos un producto'); return; }
    if (!formData.id_Usuario) { alert('Debes seleccionar un usuario'); return; }

    try {
      setSaving(true);
      const pedidoData = {
        id_Usuario: parseInt(formData.id_Usuario),
        metodo_Pago: formData.metodo_Pago,
        domicilio: formData.domicilio,
        fecha_Entrega_Estimada: formData.domicilio ? formData.fecha_Entrega_Estimada : null,
        hora_Entrega_Estimada: formData.domicilio ? convertir24a12h(formData.hora_Entrega_Estimada) : null,
        productos: productosValidos.map(p => ({
          id_Detalle_Producto: parseInt(p.id_Detalle_Producto),
          cantidad: p.cantidad
        }))
      };

      console.log("📦 Pedido a enviar:", pedidoData);

      await createPedido(pedidoData);
      alert('✅ Pedido creado correctamente');
      navigate('/pedidos');
    } catch (error) {
      console.error('Error creando pedido:', error);
      alert('❌ Error al crear el pedido');
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="role-form-container">
      <Nav menuCollapsed={menuCollapsed} toggleMenu={toggleMenu} />

      <div className={`formulario-rol-main-content-area ${menuCollapsed ? 'expanded-margin' : ''}`}>
        <div className="formulario-roles">
          <h1 className="form-title">Agregar Pedido</h1>

          <form onSubmit={handleSubmit} className="role-form">

            {/* Usuario */}
            <div className="form-group">
              <label className="label-heading">Seleccionar Usuario: <span className="required-asterisk">*</span></label>
              <select name="id_Usuario" value={formData.id_Usuario} onChange={handleChange} required className="barrio-select">
                <option value="">-- Selecciona un usuario --</option>
                {usuarios.map(u => (
                  <option key={u.id_Usuario} value={u.id_Usuario}>
                    {u.nombre_Completo} ({u.email})
                  </option>
                ))}
              </select>
            </div>

            {/* Método de pago */}
            <div className="form-group">
              <label className="label-heading">Método de Pago: <span className="required-asterisk">*</span></label>
              <select name="metodo_Pago" value={formData.metodo_Pago} onChange={handleChange} required className="barrio-select">
                <option value="">-- Selecciona --</option>
                <option value="Efectivo">Efectivo</option>
                <option value="Tarjeta">Tarjeta</option>
                <option value="Transferencia">Transferencia</option>
              </select>
            </div>

            {/* Domicilio */}
            <div className="form-group">
              <label className="label-heading">
                <input type="checkbox" name="domicilio" checked={formData.domicilio} onChange={handleChange} style={{ marginRight: '10px' }} />
                ¿Requiere domicilio?
              </label>
            </div>

            {/* Fecha y hora de entrega */}
            {formData.domicilio && (
              <>
                <div className="form-group">
                  <label className="label-heading">Fecha de Entrega: <span className="required-asterisk">*</span></label>
                  <input type="date" name="fecha_Entrega_Estimada" value={formData.fecha_Entrega_Estimada} onChange={handleChange} required className="input-field" />
                </div>
                <div className="form-group">
                  <label className="label-heading">Hora de Entrega: <span className="required-asterisk">*</span></label>
                  <input
                    type="time"
                    name="hora_Entrega_Estimada"
                    value={formData.hora_Entrega_Estimada}
                    onChange={handleChange}
                    className="input-field"
                  />
                </div>
              </>
            )}

            {/* Productos */}
            <div className="form-group">
              <label className="label-heading">Productos: <span className="required-asterisk">*</span></label>

              {productosSeleccionados.map((producto, index) => {
                const detalle = detalleProductos.find(p => p.id_Detalle_Producto === parseInt(producto.id_Detalle_Producto));

                return (
                  <div
                    key={index}
                    style={{
                      position: 'relative',
                      display: 'flex',
                      flexDirection: 'column',
                      border: '1px solid #ddd',
                      borderRadius: '10px',
                      padding: '15px',
                      marginBottom: '15px',
                      backgroundColor: '#fff',
                      boxShadow: '0 2px 6px rgba(0,0,0,0.1)',
                    }}
                  >
                    {/* Botón eliminar simple */}
                    <button
                      type="button"
                      onClick={() => eliminarProducto(index)}
                      style={{
                        position: 'absolute',
                        top: '5px',
                        right: '5px',
                        background: 'transparent',
                        border: 'none',
                        color: '#ff4d4f',
                        fontSize: '20px',
                        cursor: 'pointer',
                        padding: 0,
                        lineHeight: 1,
                      }}
                      title="Eliminar producto"
                    >
                      ×
                    </button>

                    {/* Selección de producto */}
                    <select
                      value={producto.id_Detalle_Producto}
                      onChange={(e) => handleProductoChange(index, e.target.value)}
                      required
                      className="barrio-select"
                    >
                      <option value="">Selecciona un producto</option>
                      {detalleProductos.map(p => (
                        <option key={p.id_Detalle_Producto} value={p.id_Detalle_Producto}>
                          {p.producto?.nombre_Producto} - Color: {p.color} - Talla: {p.talla} - Stock: {p.stock} - ${p.producto?.precio?.toLocaleString()}
                        </option>
                      ))}
                    </select>

                    {/* Info del producto */}
                    {detalle && (
                      <div style={{
                        display: 'flex',
                        flexDirection: 'column',
                        gap: '4px',
                        marginTop: '10px',
                        padding: '10px',
                        border: '1px solid #eee',
                        borderRadius: '5px',
                        backgroundColor: '#f9f9f9',
                        fontSize: '14px'
                      }}>
                        <strong>{detalle.producto?.nombre_Producto}</strong>
                        <span>Color: <span style={{ color: detalle.hexColor }}>{detalle.color}</span></span>
                        <span>Talla: {detalle.talla}</span>
                        <span>Stock disponible: {detalle.stock}</span>
                        <span>Precio: ${detalle.producto?.precio?.toLocaleString()}</span>
                      </div>
                    )}

                    {/* Cantidad */}
                    <div style={{ marginTop: '10px' }}>
                      <label>Cantidad:</label>
                      <input
                        type="number"
                        min="1"
                        max={detalle?.stock || 999}
                        value={producto.cantidad}
                        onChange={(e) => handleCantidadChange(index, e.target.value)}
                        className="input-field"
                        style={{ width: 60, textAlign: 'center', marginLeft: '10px' }}
                      />
                    </div>
                  </div>
                );
              })}

              <button type="button" onClick={agregarProducto} className="add-button" style={{ marginTop: '10px' }}>
                <FaPlus style={{ marginRight: '8px' }} />
                Agregar Producto
              </button>
            </div>

            {/* Botones */}
            <div className="form-buttons">
              <button type="button" className="cancel-button" onClick={() => navigate('/pedidos')} disabled={saving}>Cancelar</button>
              <button type="submit" className="save-button" disabled={saving}>
                <FaSave style={{ marginRight: '8px' }} />
                {saving ? 'Guardando...' : 'Guardar Pedido'}
              </button>
            </div>

          </form>
        </div>
      </div>
    </div>
  );
}
