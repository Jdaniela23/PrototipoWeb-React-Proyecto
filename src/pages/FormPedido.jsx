import React, { useState } from 'react';
import './FormAdd.css';
import Nav from '../components/Nav.jsx';
import { useNavigate } from 'react-router-dom';


// Fuente de datos para los productos y sus precios
const PRODUCTOS_PRECIOS = {
  "Camisas": "35.000",
  "Chanclas": "25.000",
  "Boxer": "15.000",
  "Pantalones": "60.000",
  "Zapatos": "80.000",
  "Medias": "10.000",
  "Gorras": "20.000",
  "Cinturones": "30.000",
  // Puedes añadir más productos aquí con sus precios correspondientes
};

function AgregarPedido() {
  const [menuCollapsed, setMenuCollapsed] = useState(false);
  const navigate = useNavigate();

  const toggleMenu = () => setMenuCollapsed(!menuCollapsed);

  const [pedido, setPedido] = useState({
    idPedido: '',
    fechaPedido: '',
    documentoCliente: '',
    metodoPago: '',
    domicilio: 'No',
    diaEntrega: '',
    horaEntrega: '',
    estadoPago: '',
    // ¡AHORA ES UN ARRAY DE OBJETOS PARA PRODUCTOS!
    productosSeleccionados: [{ nombre: '', cantidad: '', precio: '' }] // Un producto inicial por defecto
  });

  // Manejador de cambios para los campos del pedido (que no son productos)
  const handleChange = (e) => {
    const { name, value } = e.target;
    setPedido({ ...pedido, [name]: value });
  };

  // Manejador de cambios para los campos individuales de un producto
  const handleProductChange = (index, e) => {
    const { name, value } = e.target;
    const list = [...pedido.productosSeleccionados];

    if (name === 'nombre') {
      // Si el campo que cambió es 'nombre' del producto
      const precioAsociado = PRODUCTOS_PRECIOS[value] || '';
      list[index] = { ...list[index], [name]: value, precio: precioAsociado };
    } else if (name === 'cantidad' || name === 'precio') {
      // Asegurar que cantidad y precio sean números
      const sanitizedValue = value.replace(/[^0-9.]/g, '');
      list[index] = { ...list[index], [name]: sanitizedValue };
    } else {
      list[index] = { ...list[index], [name]: value };
    }

    setPedido({ ...pedido, productosSeleccionados: list });
  };

  // Función para añadir una nueva fila de producto
  const handleAddProduct = () => {
    setPedido({
      ...pedido,
      productosSeleccionados: [
        ...pedido.productosSeleccionados,
        { nombre: '', cantidad: '', precio: '' }
      ]
    });
  };

  // Función para eliminar una fila de producto
  const handleRemoveProduct = (index) => {
    const list = [...pedido.productosSeleccionados];
    list.splice(index, 1);
    setPedido({ ...pedido, productosSeleccionados: list });
  };

  const handleDomicilioChange = (value) => {
    setPedido((prev) => ({
      ...prev,
      domicilio: value,
      diaEntrega: value === 'Sí' ? prev.diaEntrega : '',
      horaEntrega: value === 'Sí' ? prev.horaEntrega : ''
    }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    console.log('Pedido guardado:', pedido);
    alert('Pedido registrado correctamente');
    setTimeout(() => navigate('/pedidos'), 1000);
  };

  return (
    <div className="role-form-container">
      <Nav menuCollapsed={menuCollapsed} toggleMenu={toggleMenu} />

      <div className={`formulario-rol-main-content-area ${menuCollapsed ? 'expanded-margin' : ''}`}>
        <div className="formulario-roles">
          <h1 className="form-title">Registro de Pedido</h1>
          <p className="form-info">Complete la información del pedido 🧾</p><br /><br></br>

          <form onSubmit={handleSubmit} className="role-form two-column-form">
            <div className="form-group">
              <label htmlFor="idPedido" className="label-heading">Id del Pedido: <span className="required-asterisk">*</span></label>
              <input type="text" id="idPedido" name="idPedido" value={pedido.idPedido} onChange={handleChange} required className="input-field" />
            </div>

            <div className="form-group">
              <label htmlFor="fechaPedido" className="label-heading">Fecha del Pedido: <span className="required-asterisk">*</span></label>
              <input type="date" id="fechaPedido" name="fechaPedido" value={pedido.fechaPedido} onChange={handleChange} required className="input-field" />
            </div>

            <div className="form-group">
              <label htmlFor="documentoCliente" className="label-heading">Documento del Cliente: <span className="required-asterisk">*</span></label>
              <input type="text" id="documentoCliente" name="documentoCliente" value={pedido.documentoCliente} onChange={handleChange} required className="input-field" />
            </div>

            <div className="form-group">
              <label htmlFor="metodoPago" className="label-heading">Método de Pago: <span className="required-asterisk">*</span></label>
              <select id="metodoPago" name="metodoPago" value={pedido.metodoPago} onChange={handleChange} required className="input-field">
                <option value="">Selecciona método</option>
                <option value="efectivo">Efectivo</option>
                <option value="credito">Crédito</option>
                <option value="transferencia">Transferencia</option>
              </select>
            </div>

            <div className="form-group full-width">
              <label className="label-heading">¿Requiere Domicilio? <span className="required-asterisk">*</span></label>
              <div className="domicilio-buttons" style={{
                display: 'flex',
                justifyContent: 'flex-end',  // Cambia de flex-start a flex-end
                paddingRight: '40%'  // Para separarlos del borde derecho

              }}>
                <button
                  type="button"
                  className={`save-button ${pedido.domicilio === 'Sí' ? 'selected' : ''}`}
                  onClick={() => handleDomicilioChange('Sí')}
                >
                  Sí
                </button>
                <button
                  type="button"
                  className={`save-button ${pedido.domicilio === 'No' ? 'selected' : ''}`}
                  onClick={() => handleDomicilioChange('No')}
                >
                  No
                </button>
              </div>
            </div>

            {pedido.domicilio === 'Sí' && (
              <>
                <div className="form-group">
                  <label htmlFor="diaEntrega" className="label-heading">Día Estimado de Entrega: <span className="required-asterisk">*</span></label>
                  <input type="date" id="diaEntrega" name="diaEntrega" value={pedido.diaEntrega} onChange={handleChange} required className="input-field" />
                </div>

                <div className="form-group">
                  <label htmlFor="horaEntrega" className="label-heading">Hora Estimada de Entrega: <span className="required-asterisk">*</span></label>
                  <input type="time" id="horaEntrega" name="horaEntrega" value={pedido.horaEntrega} onChange={handleChange} required className="input-field" />
                </div>
              </>
            )}

            <div className="form-group full-width">
              <label htmlFor="estadoPago" className="label-heading">Estado de Pago: <span className="required-asterisk">*</span></label>
              <select id="estadoPago" name="estadoPago" value={pedido.estadoPago} onChange={handleChange} required className="input-field">
                <option value="">Selecciona estado</option>
                <option value="proceso">Proceso de Pago</option>
                <option value="cuotas">Pago a Cuotas</option>
                <option value="pagado">Pagado</option>
                <option value="finalizado">Finalizado</option>
                <option value="anulado">Anulado</option>
              </select>
            </div>

            {/* SECCIÓN DE MÚLTIPLES PRODUCTOS */}
            <div className="form-group full-width" style={{ marginTop: '20px', borderTop: '1px solid #ccc', paddingTop: '20px' }}>
              <h2 className="label-heading">Detalle de Productos:</h2>
              {pedido.productosSeleccionados.map((product, index) => (
                <div key={index} className="form-group-triple multi-product-row"> {/* 'multi-product-row' para estilos específicos */}
                  <div className="form-group">
                    <label htmlFor={`nombreProducto-${index}`} className="label-heading">Producto #{index + 1} <span className="required-asterisk">*</span></label>
                    <select
                      id={`nombreProducto-${index}`}
                      name="nombre" // El 'name' aquí se refiere a la propiedad dentro del objeto producto
                      value={product.nombre}
                      onChange={(e) => handleProductChange(index, e)}
                      required
                      className="input-field"
                    >
                      <option value="">Selecciona un producto</option>
                      {Object.keys(PRODUCTOS_PRECIOS).map((prodName) => (
                        <option key={prodName} value={prodName}>
                          {prodName}
                        </option>
                      ))}
                    </select>
                  </div>

                  <div className="form-group">
                    <label htmlFor={`cantidadProducto-${index}`} className="label-heading">Cantidad: <span className="required-asterisk">*</span></label>
                    <input
                      type="number"
                      id={`cantidadProducto-${index}`}
                      name="cantidad" // 'name' se refiere a la propiedad dentro del objeto producto
                      value={product.cantidad}
                      onChange={(e) => handleProductChange(index, e)}
                      required
                      className="input-field"
                      min="1"
                    />
                  </div>

                  <div className="form-group">
                    <label htmlFor={`precioProducto-${index}`} className="label-heading">Precio: <span className="required-asterisk">*</span></label>
                    <input
                      type="text"
                      id={`precioProducto-${index}`}
                      name="precio" // 'name' se refiere a la propiedad dentro del objeto producto
                      value={product.precio}
                      onChange={(e) => handleProductChange(index, e)} // Permitir edición manual si se desea
                      required
                      className="input-field"
                      placeholder="Ej: 19.99"
                      readOnly // Mantenemos readOnly para que se autocomplete
                    />
                  </div>

                  {/* Botón para eliminar esta fila de producto */}
                  {pedido.productosSeleccionados.length > 1 && ( // No permitir eliminar si solo hay un producto
                    <button
                      type="button"
                      onClick={() => handleRemoveProduct(index)}
                      className="cancel-button-pedido" // Nueva clase para estilizar
                    >
                      Eliminar X
                    </button>
                  )}
                </div>
              ))}

              {/* Botón para añadir una nueva fila de producto */}
              <button
                type="button"
                onClick={handleAddProduct}
                className="save-button"
                style={{
                  display: 'block',
                  marginLeft: 'auto',
                  marginRight: '70%',
                  marginTop: '10px'
                }}
              >
                + Añadir Otro Producto
              </button>
            </div>

            <button className="cancel-button" onClick={() => navigate(-1)}>Cancelar</button>
            <button type="submit" className="save-button">
              Guardar Pedido
            </button>
          </form>
        </div>

      </div>
    </div>
  );
}

export default AgregarPedido;