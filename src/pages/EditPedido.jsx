import React, { useState, useEffect } from 'react';
import Nav from '../components/Nav.jsx';
import { useNavigate, useLocation } from 'react-router-dom';


export default function EditarPedido() {
  const navigate = useNavigate();
  const location = useLocation();

  // Si venimos desde /pedidos, esperamos que location.state.pedido contenga el objeto a editar
  const pedidoInicial = location.state?.pedido || {
    idPedido: '',
    fechaPedido: '',
    documentoCliente: '',
    metodoPago: '',
    domicilio: 'No',
    diaEntrega: '',
    horaEntrega: '',
    estadoPago: ''
  };

  const [menuCollapsed, setMenuCollapsed] = useState(false);
  const [pedido, setPedido] = useState(pedidoInicial);

  // Si el usuario refresca y no hay pedido, redirigimos de vuelta a la lista
  useEffect(() => {
    if (!location.state?.pedido) {
      navigate('/pedidos');
    }
  }, [location.state, navigate]);

  const toggleMenu = () => setMenuCollapsed(!menuCollapsed);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setPedido({ ...pedido, [name]: value });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    console.log('Pedido actualizado:', pedido);
    alert('Pedido actualizado correctamente');
    // Aqui se puede lllamar a  API de actualización...
    setTimeout(() => navigate('/pedidos'), 800);
  };

  return (
    <div className="role-form-container">
      <Nav menuCollapsed={menuCollapsed} toggleMenu={toggleMenu} />

      <div className={`formulario-rol-main-content-area ${menuCollapsed ? 'expanded-margin' : ''}`}>

        <div className="formulario-roles">
          <h1 className="form-title">Editar Pedido</h1>
          <p className="form-info">Modifica solo el estado del pedido 📝</p><br /><br />



          <form onSubmit={handleSubmit} className="role-form">
            {/* Campo del ID del Pedido - Se mantiene para mostrarlo pero está deshabilitado */}
            <div className="form-group">
              <label htmlFor="idPedido" className="label-heading">Id del Pedido:</label>
              <input
                type="text"
                id="idPedido"
                name="idPedido"
                value={pedido.idPedido}
                disabled // Deshabilitado para que no se pueda modificar
                className="input-field"
              />
            </div>

            {/* Campo para editar el estado de pago */}
            <div className="form-group">
              <label htmlFor="estadoPago" className="label-heading">Estado de pago:</label>
              <select
                id="estadoPago"
                name="estadoPago"
                value={pedido.estadoPago}
                onChange={handleChange}
                required
                className="barrio-select"
              >
                <option value="">selecciona estado</option>
                <option value="proceso">proceso de pago</option>
                <option value="cuotas">pago a cuotas</option>
                <option value="pagado">pagado</option>
                <option value="finalizado">finalizado</option>
                <option value="anulado">anulado</option>
              </select>
            </div>
            <button type="button" className="cancel-button" onClick={() => navigate(-1)}>
              Cancelar
            </button>
            <button type="submit" className="save-button">Actualizar pedido</button>

          </form>
        </div>

      </div>
    </div>
  );
}