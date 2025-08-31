import React, { useState } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import Nav from '../components/Nav.jsx';

export default function EditPedido() {
  // 1️⃣ Obtén el pedido que viene por el state del location
  const location = useLocation();
  const pedidoEdit = location.state?.pedido;

  // 2️⃣ Estado inicial con datos del pedido o valores por defecto
  const [pedidoData, setPedidoData] = useState({
    documento: pedidoEdit?.documento || '123456789',
    estadoPago: pedidoEdit?.estadoPago || 'en proceso',
   
  });

  // 3️⃣ Menú lateral y navegación
  const [menuCollapsed, setMenuCollapsed] = useState(false);
  const toggleMenu = () => setMenuCollapsed(!menuCollapsed);
  const navigate = useNavigate();

  // 4️⃣ Handler para cambios en inputs
  const handleChange = (e) => {
    const { name, value } = e.target;
    setPedidoData(prev => ({ ...prev, [name]: value }));
  };

  // 5️⃣ Enviar formulario
  const handleSubmit = (e) => {
    e.preventDefault();
    console.log('Pedido actualizado:', pedidoData);
    alert('Pedido actualizado exitosamente!');
    setTimeout(() => navigate('/pedidos'), 800);
  };

  // 6️⃣ Renderizado del formulario
  return (
    <div className="role-form-container">
      <Nav menuCollapsed={menuCollapsed} toggleMenu={toggleMenu} />

      <div className={`formulario-rol-main-content-area ${menuCollapsed ? 'expanded-margin' : ''}`}>
        <div className="formulario-roles">
          <h1 className="form-title">Editar Pedido</h1>
          <p className="form-info">Documento: {pedidoData.documento} - Estado de pago: {pedidoData.estadoPago}</p>
          <br /><br />

          <form onSubmit={handleSubmit} className="role-form">
            {/* Campo documento */}
            <div className="form-group">
              <label className="label-heading-producto" htmlFor="documento">
                Documento<span className="required-asterisk">*</span>
              </label>
              <input
                id="documento"
                name="documento"
                className="input-field"
                required
                value={pedidoData.documento}
                onChange={handleChange}
              />
            </div>

            {/* Campo estado de pago */}
            <div className="form-group">
              <label className="label-heading-producto" htmlFor="estadoPago">
                Estado de Pago<span className="required-asterisk">*</span>
              </label>
              <select
                id="estadoPago"
                name="estadoPago"
                value={pedidoData.estadoPago}
                onChange={handleChange}
                className="input-field"
                required
              >
                <option value="en proceso">En proceso</option>
                <option value="completado">Completado</option>
                <option value="rechazado">Rechazado</option>
                <option value="pendiente">Pendiente</option>
              </select>
            </div>

            {/* Botones */}
            <div className="button-group">
              <button type="submit" className="save-button">Guardar</button>
              <button
                type="button"
                className="cancel-button"
                onClick={() => navigate(-1)}
              >
                Cancelar
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}