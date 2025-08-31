import React, { useState } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import Nav from '../components/Nav.jsx';

export default function EditCategoria() {
  // 1️⃣ Obtén la categoría que viene por el state del location
  const location = useLocation();
  const categoriaEdit = location.state?.categoria;

  // 2️⃣ Estado inicial con datos de la categoría o valores por defecto
  const [categoriaData, setCategoriaData] = useState({
    nombre: categoriaEdit?.nombre || '',
    descripcion: categoriaEdit?.descripcion || '',
  });

  // 3️⃣ Menú lateral y navegación
  const [menuCollapsed, setMenuCollapsed] = useState(false);
  const toggleMenu = () => setMenuCollapsed(!menuCollapsed);
  const navigate = useNavigate();

  // 4️⃣ Handler para cambios en inputs
  const handleChange = (e) => {
    const { name, value } = e.target;
    setCategoriaData(prev => ({ ...prev, [name]: value }));
  };

  // 5️⃣ Enviar formulario
  const handleSubmit = (e) => {
    e.preventDefault();
    console.log('Categoría actualizada:', categoriaData);
    alert('Categoría actualizada exitosamente!');
    setTimeout(() => navigate('/categorias'), 800);
  };

  // 6️⃣ Renderizado del formulario
  return (
    <div className="role-form-container">
      <Nav menuCollapsed={menuCollapsed} toggleMenu={toggleMenu} />

      <div className={`formulario-rol-main-content-area ${menuCollapsed ? 'expanded-margin' : ''}`}>
        <div className="formulario-roles">
          <h1 className="form-title">{categoriaEdit ? 'Editar Categoría' : 'Crear Categoría'}</h1>
          <p className="form-info">Complete los campos obligatorios para {categoriaEdit ? 'editar' : 'crear'} la categoría</p>
          <br /><br />

          <form onSubmit={handleSubmit} className="role-form">
            {/* Campo nombre de la categoría */}
            <div className="form-group">
              <label className="label-heading-producto" htmlFor="nombre">
                Nombre de la categoría: <span className="required-asterisk">*</span>
              </label>
              <input
                id="nombre"
                name="nombre"
                className="input-field"
                required
                placeholder="Ej. Ropa deportiva"
                value={categoriaData.nombre}
                onChange={handleChange}
              />
            </div>

            {/* Campo descripción */}
            <div className="form-group">
              <label className="label-heading-producto" htmlFor="descripcion">
                Descripción: <span className="required-asterisk">*</span>
              </label>
              <textarea
                id="descripcion"
                name="descripcion"
                className="input-field"
                required
                placeholder="Describe brevemente esta categoría"
                rows="4"
                value={categoriaData.descripcion}
                onChange={handleChange}
              />
            </div>

            <button type="button" className="cancel-button" onClick={() => navigate(-1)}>
              Cancelar
            </button>
            <div className="form-actions">

              <button type="submit" className="save-button">
                Guardar Categoría
              </button>

            </div>
          </form>
        </div>
      </div>
    </div>
  );
}