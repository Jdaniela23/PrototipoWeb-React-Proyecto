import React, { useState } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import Nav from '../components/Nav.jsx';

import { FaSave } from 'react-icons/fa';

export default function EditPedido() {
  // 1️⃣ Obtén el pedido que viene por el state del location
  const location = useLocation();
  const pedidoEdit = location.state?.pedido;

  // 2️⃣ Estado inicial con datos del pedido o valores por defecto
  const [pedidoData, setPedidoData] = useState({
    nombre: pedidoEdit?.nombre || 'juan pérez',
    montoCredito: pedidoEdit?.montoCredito || 5000000,
    valorDebe: pedidoEdit?.valorDebe || 3500000,
    saldo: pedidoEdit?.saldo || 1500000,
    estado: pedidoEdit?.estado || 'activo',
    // Agrega otros campos necesarios para el pedido
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
          <h1 className="form-title">Editar Credito</h1>
          <p className="form-info">Complete los campos a continuación para editar el pedido</p>
          <br /><br />

          <form onSubmit={handleSubmit} className="role-form">
            {/* Campo nombre */}
            <div className="form-group">
              <label className="label-heading-producto" htmlFor="nombre">
                Nombre:<span className="required-asterisk">*</span>
              </label>
              <input
                id="nombre"
                name="nombre"
                className="input-field"
                required
                value={pedidoData.nombre}
                onChange={handleChange}
              />
            </div>

            {/* Campo monto crédito */}
            <div className="form-group">
              <label className="label-heading-producto" htmlFor="montoCredito">
                Monto Crédito:<span className="required-asterisk">*</span>
              </label>
              <input
                id="montoCredito"
                name="montoCredito"
                type="number"
                className="input-field"
                required
                value={pedidoData.montoCredito}
                onChange={handleChange}
              />
            </div>

            {/* Campo valor debe */}
            <div className="form-group">
              <label className="label-heading-producto" htmlFor="valorDebe">
                Valor Debe:<span className="required-asterisk">*</span>
              </label>
              <input
                id="valorDebe"
                name="valorDebe"
                type="number"
                className="input-field"
                required
                value={pedidoData.valorDebe}
                onChange={handleChange}
              />
            </div>

            {/* Campo saldo (calculado o ingresado) */}
            <div className="form-group">
              <label className="label-heading-producto" htmlFor="saldo">
                Saldo:<span className="required-asterisk">*</span>
              </label>
              <input
                id="saldo"
                name="saldo"
                type="number"
                className="input-field"
                required
                value={pedidoData.saldo}
                onChange={handleChange}
              />
            </div>

            {/* Campo estado */}
            <div className="form-group">
              <label className="label-heading-producto" htmlFor="estado">
                Estado:<span className="required-asterisk">*</span>
              </label>
              <select
                id="estado"
                name="estado"
                value={pedidoData.estado}
                onChange={handleChange}
                className="barrio-select"
                required
              >
                <option value="activo">Activo</option>
                <option value="inactivo">Inactivo</option>
                <option value="pendiente">Pendiente</option>
                <option value="completado">Completado</option>
              </select>
            </div>

            {/* Botones */}
            <div className="button-group">
              <button
                type="button"
                className="cancel-button"
                onClick={() => navigate(-1)}
              >
                Cancelar
              </button>
              <button type="submit" className="save-button"><FaSave style={{ marginRight: '8px' }} /> Guardar Cambios</button>

            </div>
          </form>
        </div>
      </div>
    </div>
  );
}