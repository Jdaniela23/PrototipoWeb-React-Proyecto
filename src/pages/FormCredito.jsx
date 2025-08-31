import React, { useState } from 'react';
import Footer from '../components/Footer.jsx';
import Nav from '../components/Nav.jsx';
import { useNavigate } from 'react-router-dom';

// Lista de clientes para el select 
const CLIENTES_AZAR = [
  "Juan Pérez",
  "Laura Gómez",
  "Roberto Carlos",
  "Sofía Hernández"
];

function FormCredito() {
  const [menuCollapsed, setMenuCollapsed] = useState(false);
  const navigate = useNavigate();

  const toggleMenu = () => {
    setMenuCollapsed(!menuCollapsed);
  };

  const [formData, setFormData] = useState({
    clienteId: '', // Nuevo campo para el ID o nombre del cliente seleccionado
    ocupacion: '',
    celular: '',
    barrioResidencia: '',
    valorCredito: '',
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    console.log('Datos del crédito a guardar:', formData);
    alert('¡Crédito guardado exitosamente!');

    setTimeout(() => {
      navigate('/usuarios'); // Redirige a /usuarios después de guardar
    }, 1000);

    // Opcional: Resetea el formulario después de enviar
    setFormData({
      clienteId: '',
      ocupacion: '',
      celular: '',
      barrioResidencia: '',
      valorCredito: '',
    });
  };

  return (
    <div className="role-form-container">
      <Nav menuCollapsed={menuCollapsed} toggleMenu={toggleMenu} />
      <div className={`formulario-rol-main-content-area ${menuCollapsed ? 'expanded-margin' : ''}`}>
        <div className="formulario-roles">
          <h1 className="form-title">Registro de Crédito</h1>
          <p className="form-info">Información para registrar créditos 🙍🏻‍♀️</p><br /><br />

          <form onSubmit={handleSubmit} className="role-form">
            {/* Nuevo campo de selección de cliente */}
            <div className="form-group">
              <label htmlFor="clienteId" className="label-heading">
                Cliente a quien solicitar el Crédito: <span className="required-asterisk">*</span>
              </label>
              <select
                id="clienteId"
                name="clienteId"
                value={formData.clienteId}
                onChange={handleChange}
                required
                className="barrio-select"
              >
                <option value="">Selecciona un cliente</option>
                {CLIENTES_AZAR.map((cliente, index) => (
                  <option key={index} value={cliente}>
                    {cliente}
                  </option>
                ))}
              </select>
            </div>

            <div className="form-group">
              <label htmlFor="ocupacion" className="label-heading">
                Ocupación: <span className="required-asterisk">*</span>
              </label>
              <input
                type="text"
                id="ocupacion"
                name="ocupacion"
                placeholder="Ej: Comerciante, Estudiante"
                value={formData.ocupacion}
                onChange={handleChange}
                required
                className="barrio-select"
              />
            </div>

            <div className="form-group">
              <label htmlFor="celular" className="label-heading">
                Número de Contacto: <span className="required-asterisk">*</span>
              </label>
              <input
                type="tel"
                id="celular"
                name="celular"
                placeholder="Ej: 3001234567"
                value={formData.celular}
                onChange={handleChange}
                required
                className="input-field"
              />
            </div>
            {/* Barrio */}
            <div className="form-group">
              <label htmlFor="barrio">Barrio: <span className="required-asterisk">*</span></label>
              <select id="barrio" name="barrio" onChange={handleChange} required className="barrio-select">
                <option value="">Selecciona un Barrio:</option>
                {['Niquia', 'Bellavista', 'San Martin', 'Villa Linda', 'Trapiche'].map(b => (
                  <option key={b} value={b}>{b}</option>
                ))}
              </select>
            </div>


            <div className="form-group">
              <label htmlFor="valorCredito" className="label-heading">
                Valor del Crédito que Necesita: <span className="required-asterisk">*</span>
              </label>
              <input
                type="number"
                id="valorCredito"
                name="valorCredito"
                placeholder="Ej: 2000000"
                value={formData.valorCredito}
                onChange={handleChange}
                required
                className="input-field"
              />
            </div>

            <button className="cancel-button" onClick={() => navigate(-1)}>Cancelar</button>
            <button type="submit" className="save-button">
              Guardar Crédito
            </button>
          </form>
        </div>
      </div>

    </div>

  );
}

export default FormCredito; 