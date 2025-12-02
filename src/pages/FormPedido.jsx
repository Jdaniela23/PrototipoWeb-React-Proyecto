import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { FaSave, FaPlus } from 'react-icons/fa';
import Nav from '../components/Nav';
import { createPedido } from '../api/pedidosService';
import { getDetalleProductos } from '../api/detalleProductosService';
import { getAllUsers } from '../api/usersService';
import { getListaBarrios } from '../api/barriosService';
import { getListaMunicipios } from '../api/municipiosService';
import './Page.css';
import { MdDeliveryDining } from 'react-icons/md';

export default function FormPedido() {
  const navigate = useNavigate();
  const [menuCollapsed, setMenuCollapsed] = useState(false);
  const [saving, setSaving] = useState(false);

  const [usuarios, setUsuarios] = useState([]);
  const [detalleProductos, setDetalleProductos] = useState([]);

  const [barriosDisponibles, setBarriosDisponibles] = useState([]); // ⭐️ NUEVO: Lista de barrios de la API
  const [barrioEditable, setBarrioEditable] = useState({});

  const [municipiosDisponibles, setMunicipiosDisponibles] = useState([]);
  const [costoDomicilio, setCostoDomicilio] = useState(0);

  const [barrioUsuario, setBarrioUsuario] = useState('');
  const [productosSeleccionados, setProductosSeleccionados] = useState([{ id_Detalle_Producto: '', cantidad: 1 }]);
  const [stockErrors, setStockErrors] = useState({});
  const [direccionUsuario, setDireccionUsuario] = useState('');

  const [direccionEditable, setDireccionEditable] = useState('');
  const [mostrarCampoEdicion, setMostrarCampoEdicion] = useState(false);
  const [dateErrors, setDateErrors] = useState({
    fecha_Entrega_Estimada: '',
    hora_Entrega_Estimada: ''
  });
  const [formData, setFormData] = useState({
    id_Usuario: '',
    metodo_Pago: '',
    domicilio: false,
    barrio_Entrega: '',
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

  // ... (Despues del useEffect para cargar usuarios)

  useEffect(() => {
    const fetchMunicipios = async () => {
      try {
        // ⭐️ FUNCIÓN DE API PARA CARGAR MUNICIPIOS (con el costoDomicilio)
        const data = await getListaMunicipios();
        setMunicipiosDisponibles(data);
      } catch (error) {
        console.error('Error cargando municipios:', error);
      }
    };
    fetchMunicipios();
  }, []);


  const getDireccionUsuario = (id) => {
    const usuarioSeleccionado = usuarios.find(u => u.id_Usuario === parseInt(id));

    let barrioObjCargado = {};
    if (usuarioSeleccionado && usuarioSeleccionado.direccion) {
      setDireccionUsuario(usuarioSeleccionado.direccion);
      // ⭐️ Inicializa el campo editable con la dirección del usuario
      setDireccionEditable(usuarioSeleccionado.direccion);
    } else {
      setDireccionUsuario('Dirección no encontrada o no especificada.');
      // ⭐️ Inicializa el campo editable vacío o con el mensaje de error
      setDireccionEditable('');
    }

    if (usuarioSeleccionado && usuarioSeleccionado.barrio) {
      // setBarrioUsuario es para mostrar el nombre
      setBarrioUsuario(usuarioSeleccionado.barrio.nombre);
      // setBarrioEditable es el objeto completo que se usará para editar y enviar
      setBarrioEditable(usuarioSeleccionado.barrio);
      barrioObjCargado = usuarioSeleccionado.barrio;
    } else {
      setBarrioUsuario('Barrio no especificado.');
      setBarrioEditable({}); // Importante inicializar como objeto vacío si no hay barrio
      setCostoDomicilio(0);
    }
    // Al cambiar de usuario, siempre volvemos al modo de visualización no editable
    setMostrarCampoEdicion(false);
    if (barrioObjCargado.id) {
      // 1. Intentamos obtener el barrio completo de la lista cargada (que tiene idMunicipio)
      const barrioCompleto = barriosDisponibles.find(b => b.id === barrioObjCargado.id);

      // Asignamos el ID del municipio
      const idMun = barrioCompleto?.idMunicipio;

      if (idMun) {
        // 2. Buscar el municipio en la lista cargada para obtener el costo
        const municipioObj = municipiosDisponibles.find(m => m.id === idMun);

        if (municipioObj) {
          // 3. ESTABLECER EL COSTO DE DOMICILIO INICIAL
          setCostoDomicilio(municipioObj.costoDomicilio || 0);
        } else {
          setCostoDomicilio(0);
        }
      } else {
        setCostoDomicilio(0); // Si no se encuentra el idMunicipio, el costo es 0
      }
    }
  };
  // ... (Después de tu useEffect para cargar usuarios)

  useEffect(() => {
    const fetchBarrios = async () => {
      try {
        const data = await getListaBarrios(); // ⭐️ Llama a tu función de la API
        setBarriosDisponibles(data);
        console.log("Datos de Barrios cargados:", data);
      } catch (error) {
        console.error('Error cargando barrios:', error);
      }
    };
    fetchBarrios();
  }, []); // Se ejecuta una sola vez al montar el componente
  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;

    if (name === 'id_Usuario' && value) {
      getDireccionUsuario(value); // Llama a la nueva función si el usuario cambia
    }

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

  const handleModificarDireccion = () => {
    setMostrarCampoEdicion(true);
  };

  const handleDireccionEditableChange = (e) => {
    setDireccionEditable(e.target.value);
  };

  // Convierte hora 24h -> 12h con AM/PM
  function convertir24a12h(hora24) {
    if (!hora24) return null;
    let [hours, minutes] = hora24.split(':').map(Number);
    const ampm = hours >= 12 ? 'PM' : 'AM';
    hours = hours % 12;
    if (hours === 0) hours = 12;
    return `${hours}:${minutes.toString().padStart(2, '0')} ${ampm}`;
  }

  const handleBarrioEditableChange = (e) => {
    const idBarrioSeleccionado = parseInt(e.target.value);

    if (idBarrioSeleccionado) {
      const barrioObj = barriosDisponibles.find(b => b.id === idBarrioSeleccionado);

      if (barrioObj) {
        // 1. OBTENER EL ID DEL MUNICIPIO DEL OBJETO BARRIO
        const idMun = barrioObj.idMunicipio; // Asume que la API ahora lo envía

        // 2. BUSCAR EL MUNICIPIO PARA OBTENER EL COSTO
        const municipioObj = municipiosDisponibles.find(m => m.id === idMun);

        // 3. ACTUALIZAR ESTADOS
        setBarrioEditable(barrioObj);
        setBarrioUsuario(barrioObj.nombre);

        // 4. ⭐️ ESTABLECER EL COSTO DE DOMICILIO
        if (municipioObj) {
          setCostoDomicilio(municipioObj.costoDomicilio || 0); // Usamos el costo del municipio
        } else {
          setCostoDomicilio(0); // Costo 0 si no se encuentra el municipio
        }
      }
    } else {
      setBarrioEditable({});
      setBarrioUsuario('Barrio no especificado.');
      setCostoDomicilio(0);// Si no hay barrio, el costo es 0
    }
  };


  // ... (Después de tu función handleSubmit)

  // ⭐️ FUNCIÓN PARA CALCULAR EL TOTAL DEL PEDIDO
  const calcularTotal = () => {
    // 1. Subtotal de productos
    const subtotalProductos = productosSeleccionados.reduce((total, p) => {
      if (!p.id_Detalle_Producto || p.cantidad <= 0) return total;

      const detalle = detalleProductos.find(d => d.id_Detalle_Producto === parseInt(p.id_Detalle_Producto));
      const precio = detalle?.producto?.precio || 0;
      return total + (precio * p.cantidad);
    }, 0);

    // 2. Costo del domicilio (solo si está marcado)
    const costoEnvio = formData.domicilio ? costoDomicilio : 0;

    return {
      subtotal: subtotalProductos,
      envio: costoEnvio,
      total: subtotalProductos + costoEnvio
    };
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    // 1️⃣ Filtrar productos válidos
    const productosValidos = productosSeleccionados
      .filter(p => p.id_Detalle_Producto !== '' && p.cantidad > 0)
      .map(p => ({
        id_Detalle_Producto: parseInt(p.id_Detalle_Producto),
        cantidad: p.cantidad
      }));

    if (productosValidos.length === 0) {
      alert('Debes seleccionar al menos un producto');
      return;
    }

    if (!formData.id_Usuario) {
      alert('Debes seleccionar un usuario');
      return;
    }

    // 2️⃣ Validaciones de fecha y hora si requiere domicilio
    setDateErrors({ fecha_Entrega_Estimada: '', hora_Entrega_Estimada: '' });
    let hasError = false;

    if (formData.domicilio) {
      const fechaSeleccionada = new Date(formData.fecha_Entrega_Estimada);
      const hoy = new Date();
      const hoySinHora = new Date(hoy.getFullYear(), hoy.getMonth(), hoy.getDate());
      const fechaSelSinHora = new Date(fechaSeleccionada.getFullYear(), fechaSeleccionada.getMonth(), fechaSeleccionada.getDate());

      if (fechaSelSinHora < hoySinHora) {
        setDateErrors(prev => ({ ...prev, fecha_Entrega_Estimada: '❌ La fecha no puede ser anterior a la actual.' }));
        hasError = true;
      } else if (fechaSelSinHora.getTime() === hoySinHora.getTime()) {
        const [selHours, selMinutes] = formData.hora_Entrega_Estimada.split(':').map(Number);
        if (selHours < hoy.getHours() || (selHours === hoy.getHours() && selMinutes <= hoy.getMinutes())) {
          setDateErrors(prev => ({ ...prev, hora_Entrega_Estimada: '❌ La hora debe ser posterior a la hora actual.' }));
          hasError = true;
        }
      }

      if (!direccionEditable) {
        alert('Debes ingresar la dirección de entrega.');
        hasError = true;
      }

      if (!barrioEditable.id) {
        alert('Debes seleccionar el barrio de entrega.');
        hasError = true;
      }
    }

    if (hasError) return;

    // 3️⃣ Calcular total
    const totalCalculado = calcularTotal().total;

    // 4️⃣ Construir objeto a enviar
    const pedidoData = {
      id_Usuario: parseInt(formData.id_Usuario),
      metodo_Pago: formData.metodo_Pago,
      domicilio: formData.domicilio,
      total_Pedido: totalCalculado,
      productos: productosValidos,
      // Solo enviar campos de domicilio si aplica
      ...(formData.domicilio && {
        direccion_Entrega: direccionEditable,
        barrio_Entrega: barrioEditable.nombre,
        id_Barrio: barrioEditable.id,
        fecha_Entrega_Estimada: formData.fecha_Entrega_Estimada,
        hora_Entrega_Estimada: convertir24a12h(formData.hora_Entrega_Estimada)
      })
    };

    console.log("📦 Datos a enviar al backend:", JSON.stringify(pedidoData, null, 2));

    try {
      setSaving(true);
      await createPedido(pedidoData);
      navigate('/pedidos', {
        state: { successMessage: 'El pedido fue creado con éxito.' }
      });
    } catch (error) {
      console.error('❌ Error creando pedido:', error.response?.data || error.message);
      alert('Error al crear el pedido. Revisa la consola para más detalles.');
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="role-form-container">
      <Nav menuCollapsed={menuCollapsed} toggleMenu={toggleMenu} />

      <div className={`formulario-rol-main-content-area ${menuCollapsed ? 'expanded-margin' : ''}`}>
        <div className="formulario-roles ">
          <h1 className="form-title">Agregar Pedido</h1>

          <form onSubmit={handleSubmit} className="role-form two-columns ">

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
                <option value="Transferencia">Transferencia</option>
              </select>
            </div>
            {/* Domicilio (Checkbox) */}
            <div className="domicilio-check">
              <div className="form-group">

                <label className="label-heading">
                  <input type="checkbox" name="domicilio" checked={formData.domicilio} onChange={handleChange} style={{ marginRight: '10px' }} />

                  ¿Requiere domicilio ?
                </label>
                <p style={{
                  fontSize: "13px",
                  color: "#555",
                  marginTop: "5px",
                  maxWidth: "320px",     // evita el desborde
                  lineHeight: "1.3",
                  wordWrap: "break-word"
                }}>
                  Verificar dirección de entrega sea correcta, ya que una vez confirmado el pedido no se podrá cambiar en caso de domicilio.
                </p>
              </div>
            </div>

            {/* BLOQUE CONDICIONAL PARA DOMICILIO (Dirección, Fecha y Hora) */}
            {formData.domicilio && (
              <>
                {/* Contenedor de la dirección (Editable) */}
                <div className="form-group" style={{ border: '1px solid #000000ff', padding: '10px', borderRadius: '8px', borderColor: '#c89b3c', backgroundColor: '#f9f9f9', color: '#c89b3c' }}>
                  <label className="label-heading">Dirección de Entrega:</label>

                  {formData.id_Usuario ? (
                    // Si NO se está editando, muestra el texto con el botón
                    !mostrarCampoEdicion ? (
                      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginTop: '25px' }}>
                        <div style={{ flexGrow: 1, margin: 0 }}>
                          {/* Dirección (negrita) */}
                          <p style={{ fontWeight: 'bold', margin: '0 0 5px 0' }}>
                            Dirección: {direccionEditable || 'Dirección no especificada, haga clic en cambiar para ingresarla.'}
                          </p>
                          {/* Barrio (normal) */}
                          <p style={{ fontWeight: 'normal', margin: 0, fontSize: '15px' }}>
                            Barrio: {barrioUsuario}
                          </p>
                        </div>

                        <button
                          type="button"
                          onClick={handleModificarDireccion}
                          className="add-button"
                          style={{ padding: '5px 10px', fontSize: '12px', marginLeft: '10px' }}
                        >
                          Cambiar Dirección
                        </button>
                      </div>
                    ) : (
                      // Si SÍ se está editando, muestra los campos de edición de Dirección Y Barrio
                      <div style={{ marginTop: '5px' }}>
                        {/* Campo de Selección de Barrio */}
                        <label className="label-heading" style={{ marginTop: '5px' }}>Seleccionar Barrio: <span className="required-asterisk">*</span></label>
                        <select
                          // ⭐️ Usa barrioEditable.id para el valor seleccionado
                          value={barrioEditable.id || ''}
                          onChange={handleBarrioEditableChange}
                          className="barrio-select"
                          required
                        >
                          <option value="">-- Selecciona un barrio --</option>
                          {barriosDisponibles.map(b => (
                            <option key={b.id} value={b.id}>
                              {b.nombre}
                            </option>
                          ))}
                        </select>

                        {/* Campo de Dirección (Calle y Número) */}
                        <label className="label-heading" style={{ marginTop: '10px' }}>Dirección (Calle y Número):</label>
                        <div style={{ display: 'flex', gap: '10px' }}>
                          <input
                            type="text"
                            value={direccionEditable}
                            onChange={handleDireccionEditableChange}
                            className="input-field"
                            required
                            placeholder="Ingresa la dirección de entrega"
                            style={{ flexGrow: 1 }}
                          />
                          <button
                            type="button"
                            onClick={() => setMostrarCampoEdicion(false)}
                            className="cancel-button"
                            style={{ padding: '5px 10px', fontSize: '12px' }}
                          >
                            Aceptar
                          </button>
                        </div>
                      </div>
                    )
                  ) : (
                    <p style={{ color: '#888' }}>Selecciona un usuario para establecer la dirección de entrega.</p>
                  )}
                </div>

                {/* Fecha y hora de entrega */}
                <div className="form-group">
                  <label className="label-heading">Fecha de Entrega: <span className="required-asterisk">*</span></label>
                  <input type="date" name="fecha_Entrega_Estimada" value={formData.fecha_Entrega_Estimada} onChange={handleChange} required className="input-field" />
                  {dateErrors.fecha_Entrega_Estimada && <p className="error-message-rol">{dateErrors.fecha_Entrega_Estimada}</p>}
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
                  {dateErrors.hora_Entrega_Estimada && <p className="error-message-rol">{dateErrors.hora_Entrega_Estimada}</p>}
                </div>
              </>
            )}

            {/* Productos */}
            <div className="form-group">
              <label className="label-heading">Productos: <span className="required-asterisk">*</span></label>

              {productosSeleccionados.map((producto, index) => {
                // 1. Encontramos el detalle del producto
                const detalle = detalleProductos.find(p => p.id_Detalle_Producto === parseInt(producto.id_Detalle_Producto));
                const FALLBACK_URL = 'https://picsum.photos/250/250';
                const imagenUrl =
                  detalle?.imagenes?.[0]?.url_Imagen || FALLBACK_URL;
                console.log("URL imagen FINAL:", imagenUrl);
                console.log("DETALLE PRODUCTOS RAW:", detalleProductos);

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
                      color: '#000',
                      boxShadow: '0 2px 6px rgba(0,0,0,0.1)',
                    }}
                  >

                    {/* Selección de producto (Select) */}
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

                    {/* Info del producto (Se muestra solo si 'detalle' existe) */}
                    {detalle && (
                      <div style={{
                        display: 'flex',
                        alignItems: 'flex-start',
                        gap: '15px',
                        marginTop: '10px',
                        padding: '10px',
                        border: '1px solid #eee',
                        borderRadius: '5px',
                        backgroundColor: '#f9f9f9',
                        fontSize: '14px'
                      }}>

                        {/* IMAGEN: Usamos la URL definida arriba, con verificación */}
                        {imagenUrl && (
                          <img
                            src={imagenUrl}
                            alt={detalle.producto?.nombre_Producto}
                            style={{
                              width: '100px',
                              height: '100px',
                              objectFit: 'cover',
                              flexShrink: 0,
                              borderRadius: '5px',
                              marginRight: '20%'
                            }}
                          />
                        )}

                        {/* TEXTO */}
                        <div style={{ display: 'flex', flexDirection: 'column', gap: '4px' }}>
                          <strong>{detalle.producto?.nombre_Producto}</strong>
                          <span>Color: <span style={{ color: detalle.hexColor }}>{detalle.color}</span></span>
                          <span>Talla: {detalle.talla}</span>
                          <span>Stock disponible: {detalle.stock}</span>
                          <span>Precio: ${detalle.producto?.precio?.toLocaleString()}</span>
                        </div>
                      </div>
                    )}
                    {stockErrors[index] && <p className="error-message-rol" style={{ marginTop: '5px' }}>{stockErrors[index]}</p>}
                    {/* Botón eliminar */}
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
                        fontSize: '40px',
                        cursor: 'pointer',
                        padding: 0,
                        lineHeight: 1,
                      }}
                      title="Eliminar producto"
                    >
                      ×
                    </button>

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

            <div
              style={{

                borderStyle: 'solid',
                marginTop: '30px',
                fontSize: '1.1em',
                color: '#000000ff',
                width: '100%',
                height: 'auto',
                textAlign: 'center',

              }}>

              <p className='subtotal-pedidos'>Subtotal Productos:
                <strong>COP {calcularTotal().subtotal.toLocaleString()}</strong>
              </p><br /><br />
              {formData.domicilio && (
                <p className='costo-pedidos'>< MdDeliveryDining size={30} /> Costo Domicilio:
                  <strong>COP   {calcularTotal().envio.toLocaleString()}</strong>
                </p>
              )}
              <p style={{ fontWeight: 'bold', marginLeft: '-20px' }}>
                ✅ Total del Pedido:  COP {calcularTotal().total.toLocaleString()}
              </p>
            </div>

            {/* Botones */}
            <div className="form-buttons">
              <button type="submit" className="save-button" disabled={saving}>
                <FaSave style={{ marginRight: '8px' }} />
                {saving ? 'Guardando...' : 'Guardar Pedido'}
              </button>
            </div>
          </form>
          <button type="button" className="cancel-button" onClick={() => navigate(-1)}>
            Cancelar
          </button>
        </div>
      </div>
    </div>
  );
}
