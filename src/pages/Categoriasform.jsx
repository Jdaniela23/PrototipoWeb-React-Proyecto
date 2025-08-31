import React, { useState } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import Nav from '../components/Nav.jsx';

export default function EditCategoria() {
  const location = useLocation();
  const categoriaEdit = location.state?.categoria;

  const [categoriaData, setCategoriaData] = useState({
    nombre: categoriaEdit?.nombre || '',
    descripcion: categoriaEdit?.descripcion || '',
    estado: categoriaEdit?.estado || 'Activa',
    fechaCreacion: categoriaEdit?.fechaCreacion || '01/05/2024',
  });

  const [menuCollapsed, setMenuCollapsed] = useState(false);
  const toggleMenu = () => setMenuCollapsed(!menuCollapsed);
  const navigate = useNavigate();

  const handleChange = (e) => {
    const { name, value } = e.target;
    setCategoriaData(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    console.log('Categoría actualizada:', categoriaData);
    alert('Categoría actualizada exitosamente!');
    setTimeout(() => navigate('/categorias'), 800);
  };

  return (
    <div className="role-form-container">
      <Nav menuCollapsed={menuCollapsed} toggleMenu={toggleMenu} />

      <div className={`formulario-rol-main-content-area ${menuCollapsed ? 'expanded-margin' : ''}`}>
        <div className="formulario-roles">
          <h1 className="form-title">Editar Categoría</h1>
          <p className="form-info">Categoría: {categoriaData.nombre}</p>
          <br /><br />

          <form onSubmit={handleSubmit} className="role-form">
            {/* Campo nombre */}
            <div className="form-group">
              <label className="label-heading-producto" htmlFor="nombre">
                Nombre<span className="required-asterisk">*</span>
              </label>
              <input
                id="nombre"
                name="nombre"
                className="input-field"
                required
                value={categoriaData.nombre}
                onChange={handleChange}
              />
            </div>

            {/* Campo descripción */}
            <div className="form-group">
              <label className="label-heading-producto" htmlFor="descripcion">
                Descripción<span className="required-asterisk">*</span>
              </label>
              <textarea
                id="descripcion"
                name="descripcion"
                className="input-field"
                required
                value={categoriaData.descripcion}
                onChange={handleChange}
                rows="4"
              />
            </div>

            {/* Campo estado */}
            <div className="form-group">
              <label className="label-heading-producto" htmlFor="estado">
                Estado<span className="required-asterisk">*</span>
              </label>
              <select
                id="estado"
                name="estado"
                value={categoriaData.estado}
                onChange={handleChange}
                className="input-field"
                required
              >
                <option value="Activa">Activa</option>
                <option value="Inactiva">Inactiva</option>
              </select>
            </div>

            {/* Campo fecha de creación */}
            <div className="form-group">
              <label className="label-heading-producto" htmlFor="fechaCreacion">
                Fecha de creación<span className="required-asterisk">*</span>
              </label>
              <input
                id="fechaCreacion"
                name="fechaCreacion"
                type="date"
                className="input-field"
                required
                value={categoriaData.fechaCreacion}
                onChange={handleChange}
              />
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