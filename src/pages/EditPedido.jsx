import React, { useState, useEffect, useMemo } from 'react';
import Nav from '../components/Nav.jsx';
import { useNavigate, useParams } from 'react-router-dom';
import { FaSave, FaTrashAlt, FaPlus, FaTimes } from 'react-icons/fa';
import { getPedidoById, updatePedido } from '../api/pedidosService';
import './Page.css'; // Asegúrate de tener los estilos para la tabla y botones.
import { getDetalleProductos } from '../api/detalleProductosService';
import ConfirmAnularPedido from './ConfirmAnularPedido.jsx';

// Componente de Utilidad para Mostrar Mensajes
const ErrorMessage = ({ message }) => {
  if (!message) return null;
  return <div style={{ color: 'red', margin: '10px 0', padding: '10px', border: '1px solid red', borderRadius: '4px' }}>{message}</div>;
};

// EDITAR PEDIDO
export default function EditarPedido() {
  const navigate = useNavigate();
  const { id } = useParams(); // Obtener ID desde la URL

  const [menuCollapsed, setMenuCollapsed] = useState(false);
  const [pedido, setPedido] = useState(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [errorMsg, setErrorMsg] = useState('');

  const [showAnularModal, setShowAnularModal] = useState(false);
  const [productosDisponibles, setProductosDisponibles] = useState([]);
  const [newProductEntry, setNewProductEntry] = useState([]); // Array temporal para nuevos formularios de selección

  const [selectedDetailId, setSelectedDetailId] = useState(''); // ID seleccionado en el <select>
  const [cantidadToAdd, setCantidadToAdd] = useState(1);
  const [selectedProductInfo, setSelectedProductInfo] = useState(null); // Info detallada del producto seleccionado 
  const toggleMenu = () => setMenuCollapsed(!menuCollapsed);

  // ⭐ 1. Cargar el pedido con sus detalles
  // 🔥 Cargar el pedido Y la lista completa de detalles de productos disponibles
  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);

        // 1. Cargar el pedido existente
        const pedidoData = await getPedidoById(id);
        console.log('Objeto de Pedido recibido:', pedidoData);
        setPedido(pedidoData);

        // 2. Cargar todos los detalles de producto disponibles para el selector
        // REEMPLAZA ESTA LÍNEA CON TU LLAMADA REAL A LA API
        const disponiblesData = await getDetalleProductos();
        setProductosDisponibles(disponiblesData);

      } catch (error) {
        console.error('Error al cargar datos:', error);
        // ... manejo de error
      } finally {
        setLoading(false);
      }
    };

    if (id) {
      fetchData();
    } else {
      navigate('/pedidos');
    }
  }, [id, navigate]);

  const handleAddProductEntry = () => {
    // Añade una entrada vacía al array de nuevos productos
    setNewProductEntry(prev => [
      ...prev,
      {
        tempId: Date.now(), // ID temporal para React key
        id_Detalle_Producto: '',
        cantidad: 1
      }
    ]);
  };
  const handleNewEntryChange = (tempId, field, value) => {
    setNewProductEntry(prev =>
      prev.map(entry => {
        if (entry.tempId === tempId) {
          const updatedEntry = { ...entry, [field]: value };

          // Si el campo cambiado es id_Detalle_Producto, actualizamos el precio/stock
          if (field === 'id_Detalle_Producto' && value) {
            const selectedDetail = productosDisponibles.find(p => p.id_Detalle_Producto === parseInt(value));

            if (selectedDetail) {
              updatedEntry.precio_Unitario = selectedDetail.producto.precio;
              updatedEntry.stock = selectedDetail.stock;
              updatedEntry.producto = selectedDetail.producto; // Para mostrar la info
              updatedEntry.talla = selectedDetail.talla;
              updatedEntry.color = selectedDetail.color;
            }
          }

          return updatedEntry;
        }
        return entry;
      })
    );
  };

  const handleRemoveNewEntry = (tempId) => {
    setNewProductEntry(prev => prev.filter(entry => entry.tempId !== tempId));
  };
  // ... (código anterior hasta la línea donde se define useState y useEffect)

  // ⭐ 2. Calcular el Subtotal de Productos en tiempo real (useMemo)
  //    Esto calcula el total de la tabla (productos * cantidad)
  const subtotalProductosCalculado = useMemo(() => {
    // Protección: Si pedido es null o detalle_Pedidos es null/vacío, regresa 0
    if (!pedido || !pedido.detalle_Pedidos) return 0;

    // Solo sumar el total de los productos en la tabla
    return pedido.detalle_Pedidos.reduce((acc, detalle) => {
      // Usamos el precio unitario y la cantidad
      // Usamos el subtotal que ya fue pre-calculado en handleCantidadChange o handleAddProductToTable
      return acc + (detalle.subtotal || (detalle.precio_Unitario * detalle.cantidad));
    }, 0);
  }, [pedido?.detalle_Pedidos]); // Dependencia más específica: solo si cambian los detalles

  // ⭐ 3. Calcular el Total Final (Subtotal de Productos + Costo de Domicilio)
  const totalCalculado = useMemo(() => {
    if (!pedido) return 0;
    const COSTO_DOMICILIO_FIJO = 10000;

    // Usamos el costo fijo si 'pedido.domicilio' es true, sino es 0.
    const costoDomicilio = pedido.domicilio ? COSTO_DOMICILIO_FIJO : 0;

    console.log('Costo de Domicilio:', costoDomicilio); // ¡Ahora debe ser 10000!

    // Sumamos el subtotal de productos calculado MÁS el costo del domicilio
    return subtotalProductosCalculado + costoDomicilio;
    // La dependencia debe ser el subtotal de productos y la propiedad 'domicilio'
  }, [subtotalProductosCalculado, pedido?.domicilio]);

  // ⭐ 4. Manejar cambios en la cantidad de un producto específico
  // ... (el resto del código sigue igual)

  // ⭐ 4. Manejar cambios en la cantidad de un producto específico
  const handleCantidadChange = (index, nuevaCantidad) => {
    setErrorMsg('');
    const cantidadInt = parseInt(nuevaCantidad, 10);

    if (isNaN(cantidadInt) || cantidadInt < 1) return;

    const nuevosDetalles = pedido.detalle_Pedidos.map((detalle, i) => {
      if (i === index) {
        // Actualiza solo la cantidad y recalcula el subtotal localmente
        return {
          ...detalle,
          cantidad: cantidadInt,
          subtotal: detalle.precio_Unitario * cantidadInt // Recalcular subtotal
        };
      }
      return detalle;
    });

    // Actualizar el estado del pedido con los nuevos detalles
    setPedido({ ...pedido, detalle_Pedidos: nuevosDetalles });
  };
  // Funciones para manejar la anulación del pedido
const handleAnularConfirm = () => {
    // 1. Establecer el estado del pedido a Anulado
    setPedido(prevPedido => ({ ...prevPedido, estado_Pedido: 'Anulado' }));
    // 2. Ocultar el modal
    setShowAnularModal(false);
    // 3. ¡Ahora el pedido está listo para ser guardado con el nuevo estado!
    //    El usuario debe presionar el botón "Actualizar Pedido" para enviarlo al backend.
};

const handleAnularClose = () => {
    // Si cancela, volvemos a mostrar el estado anterior
    setShowAnularModal(false);
    // Hacemos que el <select> vuelva a su valor anterior (el que tenía antes de seleccionar 'Anulado')
    setPedido(prevPedido => ({ ...prevPedido, estado_Pedido: prevPedido.estado_Pedido })); 
    // Nota: El select de React lo hará automáticamente si está enlazado a `pedido.estado_Pedido`
};

  // ⭐ 3. Manejar cambios en el campo de estado (¡Función faltante!)
  // ⭐ 3. Manejar cambios en el campo de estado
  const handleChangeEstado = (e) => {
    const { value } = e.target;

    if (value === 'Anulado') {
      // Si el usuario selecciona 'Anulado', mostramos el modal de confirmación
      setShowAnularModal(true);
    } else {
      // Para cualquier otro estado, actualizamos el estado del pedido directamente
      setPedido({ ...pedido, estado_Pedido: value });
    }
    setErrorMsg('');
  };
  // ⭐ 5. Eliminar un producto del pedido (Esto invoca la devolución de stock en el backend)
  const handleRemoveDetalle = (index) => {
    setErrorMsg('');
    const nuevosDetalles = pedido.detalle_Pedidos.filter((_, i) => i !== index);

    // El total calculado se actualizará automáticamente gracias a useMemo
    setPedido({ ...pedido, detalle_Pedidos: nuevosDetalles });
  };


  const handleSubmit = async (e) => {
    e.preventDefault();

    // 1. Productos ya existentes en la tabla
    const productosExistentes = pedido.detalle_Pedidos.map(detalle => ({
      id_Detalle_Producto: detalle.detalle_Producto.id_Detalle_Producto,
      cantidad: detalle.cantidad,
      id_Pedido_Detalle: detalle.id_Pedido_Detalle,
      precio_Unitario: detalle.precio_Unitario
    }));

    // 2. Productos nuevos
    const productosNuevos = newProductEntry
      .filter(entry => entry.id_Detalle_Producto && entry.cantidad > 0)
      .map(entry => ({
        id_Detalle_Producto: parseInt(entry.id_Detalle_Producto),
        cantidad: entry.cantidad,
        id_Pedido_Detalle: 0,
        precio_Unitario: entry.precio_Unitario,

      }));

    // 3. Unir todo
    const productosFinal = [...productosExistentes, ...productosNuevos];

    if (productosFinal.length === 0) {
      setErrorMsg("❌ El pedido debe contener al menos un producto.");
      return;
    }

    // 4. Crear objeto FINAL sin depender del setState de React
    const pedidoActualizado = {
      id_Pedido: pedido.id_Pedido,
      estado_Pedido: pedido.estado_Pedido,
      domicilio: pedido.domicilio,
      metodo_Pago: pedido.metodo_Pago || 'Efectivo',
      direccion_Entrega: pedido.domicilio ? pedido.direccion_Entrega : null,
      barrio_Entrega: pedido.domicilio ? pedido.barrio_Entrega : null,
      total_Pedido: totalCalculado,
      productos: productosFinal

    };

    console.log("PEDIDO QUE SE ENVÍA AL BACKEND:", pedidoActualizado);

    try {
      await updatePedido(id, pedidoActualizado);
      navigate('/pedidos', {
        state: { successMessage: 'El pedido fue actualizado con éxito.' }
      });
    } catch (err) {
      console.log(err);
      setErrorMsg("Error al actualizar el pedido.");
    }
  };

  const handleSelectChange = (e) => {
    const id = parseInt(e.target.value);
    setSelectedDetailId(id);
    setCantidadToAdd(1); // Resetear cantidad

    const info = productosDisponibles.find(p => p.id_Detalle_Producto === id) || null;
    setSelectedProductInfo(info);
  };
  const handleAddProductToTable = () => {
    if (!selectedProductInfo || cantidadToAdd < 1) {
      setErrorMsg('Seleccione un producto y una cantidad válida.');
      return;
    }

    // 1. Verificar si ya existe en la tabla para evitar duplicados
    const detalleExistente = pedido.detalle_Pedidos.find(
      (d) => d.detalle_Producto.id_Detalle_Producto === selectedProductInfo.id_Detalle_Producto
    );

    if (detalleExistente) {
      setErrorMsg('Este producto ya está en el pedido. Modifique la cantidad en la tabla.');
      return;
    }

    // 2. Crear la estructura del detalle del pedido
    const nuevoDetalle = {
      id_Pedido_Detalle: 0, // 0 indica que es un nuevo registro
      detalle_Producto: selectedProductInfo, // Usamos la info completa
      precio_Unitario: selectedProductInfo.producto.precio,
      cantidad: cantidadToAdd,
      subtotal: selectedProductInfo.producto.precio * cantidadToAdd,

    };

    // 3. Actualizar el estado del pedido (añadir a la lista)
    setPedido({
      ...pedido,
      detalle_Pedidos: [...pedido.detalle_Pedidos, nuevoDetalle],
    });


    // 4. Resetear el selector para la siguiente adición
    setSelectedDetailId('');
    setSelectedProductInfo(null);
    setCantidadToAdd(1);
    setErrorMsg('');
  };

  // Mostrar loading
  if (loading) {
    return (
      <div className="role-form-container">
        <Nav menuCollapsed={menuCollapsed} toggleMenu={toggleMenu} />
        <div className={`formulario-rol-main-content-area ${menuCollapsed ? 'expanded-margin' : ''}`}>
          <div className="formulario-roles">
            <p>Cargando pedido...</p>
          </div>
        </div>
      </div>
    );
  }

  if (!pedido) return null;

  return (
    <div className="role-form-container">
      <Nav menuCollapsed={menuCollapsed} toggleMenu={toggleMenu} />

      <div className={`formulario-rol-main-content-area ${menuCollapsed ? 'expanded-margin' : ''}`}>
        <div className="formulario-edicion-pedido">
          <h1 className="form-title">Editar Pedido {pedido.id_Pedido}</h1>
          <p className="form-info">Modifique el estado y los detalles de los productos del pedido. Los cambios afectan el inventario.</p>

          {/* Mensaje de Error */}
          <ErrorMessage message={errorMsg} />

          <form onSubmit={handleSubmit} className="role-form">

            {/* --- SECCIÓN PRINCIPAL DEL PEDIDO --- */}
            <div className="form-section-header">Información General</div>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: '20px', marginBottom: '30px' }}>
              {/* ID del Pedido - Solo lectura */}
              <div className="form-group">
                <label htmlFor="id_Pedido" className="label-heading">ID:</label>
                <input type="text" id="id_Pedido" value={pedido.id_Pedido || ''} disabled className="input-field" />
              </div>

              {/* Cliente */}
              <div className="form-group">
                <label htmlFor="cliente" className="label-heading">Cliente:</label>
                <input type="text" id="cliente" value={pedido.usuario?.nombre_Completo || 'N/A'} disabled className="input-field" />
              </div>
              <div className="form-group">
                <label htmlFor="direccion_Entrega" className="label-heading">Dirección:</label>
                <input
                  type="text"
                  id="direccion_Entrega"
                  value={pedido.direccion_Entrega || 'No aplica'}
                  disabled
                  className="input-field"
                />
              </div>
              <div className="form-group">
                <label htmlFor="barrio_Entrega" className="label-heading">Barrio:</label>
                <input
                  type="text"
                  id="barrio_Entrega"
                  value={pedido.barrio_Entrega || 'No aplica'}
                  disabled
                  className="input-field"
                />
              </div>

              {/* Estado del Pedido - EDITABLE */}
              <div className="form-group">
                <label htmlFor="estado_Pedido" className="label-heading">
                  Estado: <span style={{ color: 'red' }}>*</span>
                </label>
                <select
                  id="estado_Pedido"
                  name="estado_Pedido"
                  value={pedido.estado_Pedido || ''}
                  onChange={handleChangeEstado}
                  required
                  className="barrio-select"
                >
                  <option value="En Proceso">En Proceso</option>
                  <option value="Pendiente">Pendiente</option>
                  <option value="Completado">Completado</option>
                  <option value="Anulado">Anulado</option> {/* ⭐ Acción crítica de stock */}
                </select>
              </div>

            </div>

            {/* --- DETALLES DEL PEDIDO (PRODUCTOS) --- */}
            < div style={{ marginBottom: '30px', padding: '15px', border: '1px solid #ddd', borderRadius: '8px' }}>
              <h3 style={{ marginTop: 0 }}>➕ Añadir Producto</h3>

              {/* SELECTOR */}
              <div className="form-group">
                <label htmlFor="product-selector">Detalle de Producto Disponible:</label>
                <select
                  id="product-selector"
                  value={selectedDetailId}
                  onChange={handleSelectChange}
                  className="input-field" // Asegúrate de tener un estilo para .input-field
                  style={{ width: '100%' }}
                >
                  <option value="">Selecciona un producto...</option>
                  {productosDisponibles.map(p => (
                    <option key={p.id_Detalle_Producto} value={p.id_Detalle_Producto}>
                      {p.producto?.nombre_Producto} - Color: {p.color} - Talla: {p.talla} - Stock: {p.stock} - ${p.producto?.precio?.toLocaleString()}
                    </option>
                  ))}
                </select>
              </div>

              {/* INFO DETALLADA Y BOTÓN DE AÑADIR */}
              {selectedProductInfo && (
                <div style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: '20px',
                  marginTop: '15px',
                  padding: '10px',
                  border: '1px solid #eee',
                  borderRadius: '5px'
                }}>
                  {/* TEXTO DETALLADO (adaptado de tu ejemplo) */}
                  <div style={{ display: 'flex', flexDirection: 'column', gap: '4px', flexGrow: 1 }}>
                    <strong>{selectedProductInfo.producto?.nombre_Producto}</strong>
                    <span>Color: {selectedProductInfo.color} | Talla: {selectedProductInfo.talla}</span>
                    <span>Stock: **{selectedProductInfo.stock}** | Precio Unit.: **${selectedProductInfo.producto?.precio?.toLocaleString()}**</span>
                  </div>

                  {/* CANTIDAD Y BOTÓN */}
                  <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                    <label>Cantidad:</label>
                    <input
                      type="number"
                      min="1"
                      max={selectedProductInfo.stock}
                      value={cantidadToAdd}
                      onChange={(e) => setCantidadToAdd(parseInt(e.target.value))}
                      className="input-field"
                      style={{ width: 60, textAlign: 'center' }}
                    />

                    <button
                      type="button"
                      onClick={handleAddProductToTable}
                      className="add-button"
                      disabled={cantidadToAdd < 1 || cantidadToAdd > selectedProductInfo.stock || !selectedProductInfo}

                    >
                      Añadir a Tabla
                    </button>
                  </div>
                </div>
              )}

              {/* Mensaje de error si aplica */}
              {errorMsg && <p className="error-message-rol" style={{ marginTop: '10px' }}>{errorMsg}</p>}
            </div>
            <div className="form-section-productos">Productos ({pedido.detalle_Pedidos?.length || 0})</div>

            {pedido.detalle_Pedidos && pedido.detalle_Pedidos.length > 0 ? (

              <div className="table-responsive-container">

                <table className="products-table">
                  <thead>
                    <tr>
                      <th>Producto</th>
                      <th>Talla/Color</th>
                      <th>Stock Disp.</th>
                      <th>Precio Unit.</th>
                      <th>Cantidad</th>
                      <th>Subtotal</th>
                      <th>Acción</th>
                    </tr>
                  </thead>

                  <tbody>

                    {pedido.detalle_Pedidos.map((detalle, index) => (
                      <tr key={detalle.detalle_Producto.id_Detalle_Producto}>
                        <td>{detalle.detalle_Producto.producto?.nombre_Producto}</td>
                        <td>
                          {detalle.detalle_Producto.talla || 'N/A'} / {detalle.detalle_Producto.color || 'N/A'}
                        </td>
                        <td>
                          {/* Mostrar el stock disponible del DetalleProducto */}
                          {detalle.detalle_Producto.stock + detalle.cantidad}
                        </td>
                        <td>{`$${detalle.precio_Unitario?.toLocaleString()}`}</td>
                        <td>
                          <div className="form-group-inline">
                            <label></label>
                            <input
                              type="number"
                              min="1"
                              max={detalle.detalle_Producto.stock + detalle.cantidad}
                              value={detalle.cantidad}
                              onChange={(e) => handleCantidadChange(index, e.target.value)}
                              className="input-cantidad"
                            />
                          </div>
                        </td>
                        <td>{`$${(detalle.subtotal || 0).toLocaleString()}`}</td>
                        <td>
                          <button
                            type="button"
                            onClick={() => handleRemoveDetalle(index)}
                            className="delete-button-small"
                            disabled={saving}
                          >
                            <FaTrashAlt />
                          </button>
                        </td>
                      </tr>
                    ))}






                  </tbody>
                </table>
              </div>
            ) : (
              <p className="error-talla" style={{ marginTop: '20px' }}>Este pedido no contiene productos. Debe anularlo o agregar uno.</p>
            )}

            <br />
            {/* --- TOTAL DEL PEDIDO --- */}
            <div className="total-calculation-summary-pedido">

              <div className="summary-line-pedido">
                <span>Subtotal Productos:</span>
                <span>{`$${subtotalProductosCalculado.toLocaleString(undefined, { minimumFractionDigits: 0 })}`}</span>
              </div>


              <div className="total-box">
                <strong>Total Final: (Incl. Domicilio)</strong>
                <span className="total-amount">
                  {`$${totalCalculado.toLocaleString(undefined, { minimumFractionDigits: 0 })}`}
                </span>
              </div>
            </div>

            {/* Botones */}
            <div className="form-buttons" style={{ marginTop: '30px' }}>
              <button
                type="button"
                className="cancel-button"
                onClick={() => navigate('/pedidos')}
                disabled={saving}
              >
                Cancelar
              </button>
              <button
                type="submit"
                className="save-button"
                disabled={saving || !pedido.detalle_Pedidos?.length} // No se puede guardar sin productos
              >
                <FaSave style={{ marginRight: '8px' }} />
                {saving ? 'Guardando...' : 'Actualizar Pedido'}
              </button>
            </div>
            
          </form>
        </div>
        
      </div>
      {showAnularModal && (
        <ConfirmAnularPedido 
          pedidoId={pedido.id_Pedido}
          onClose={handleAnularClose}
          onConfirm={handleAnularConfirm}
        />
      )}
    </div>
  );
}

