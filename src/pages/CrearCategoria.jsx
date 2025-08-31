import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { FaArrowLeft, FaSave } from 'react-icons/fa';
import Nav from '../components/Nav.jsx';
import Footer from '../components/Footer.jsx';
import './CategoriaForm.css';

export default function CrearCategoria() {
  const navigate = useNavigate();
  const [menuCollapsed, setMenuCollapsed] = useState(false);
  const [formData, setFormData] = useState({
    nombre: '',
    descripcion: ''
  });
  const [errors, setErrors] = useState({});

  const toggleMenu = () => setMenuCollapsed(!menuCollapsed);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));

    // Limpiar error del campo cuando se modifica
    if (errors[name]) {
      setErrors(prev => ({
        ...prev,
        [name]: ''
      }));
    }
  };

  const validateForm = () => {
    const newErrors = {};

    if (!formData.nombre.trim()) {
      newErrors.nombre = 'El nombre es obligatorio';
    }

    if (!formData.descripcion.trim()) {
      newErrors.descripcion = 'La descripción es obligatoria';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    if (validateForm()) {
      // Guardar en localStorage o enviar a API
      const nuevaCategoria = {
        ...formData,
        estado: true,
        fechaCreacion: new Date().toISOString().split('T')[0]
      };

      // Redirigir a la página de categorías con los datos
      navigate('/categorias', {
        state: { nuevaCategoria }
      });
    }
  };

  return (
    <div className="container">
      <Nav menuCollapsed={menuCollapsed} toggleMenu={toggleMenu} />

      <div className={`main-content-area ${menuCollapsed ? 'expanded-margin' : ''}`}>
        <div className="header">
          <div className="header-left">
            <button
              className="back-button"
              onClick={() => navigate('/categorias')}
            >
              <FaArrowLeft />
            </button>
            <h1>Crear Nueva Categoría</h1>
          </div>
        </div>

        <div className="form-container">
          <form onSubmit={handleSubmit} className="category-form">
            <div className="form-group">
              <label htmlFor="nombre">
                Nombre de la categoría <span className="required">*</span>
              </label>
              <input
                type="text"
                id="nombre"
                name="nombre"
                value={formData.nombre}
                onChange={handleChange}
                className={errors.nombre ? 'error' : ''}
                placeholder="Ej: Ropa deportiva"
              />
              {errors.nombre && <span className="error-message">{errors.nombre}</span>}
            </div>

            <div className="form-group">
              <label htmlFor="descripcion">
                Descripción <span className="required">*</span>
              </label>
              <textarea
                id="descripcion"
                name="descripcion"
                value={formData.descripcion}
                onChange={handleChange}
                className={errors.descripcion ? 'error' : ''}
                placeholder="Describe brevemente esta categoría"
                rows="4"
              />
              {errors.descripcion && <span className="error-message">{errors.descripcion}</span>}
            </div>

            <div className="form-buttons">
              <button
                type="button"
                className="cancel-button"
                onClick={() => navigate('/categorias')}
              >
                Cancelar
              </button>
              <button type="submit" className="submit-button">
                <FaSave /> Crear Categoría
              </button>
            </div>
          </form>
        </div>

        <div className="footer-productos-page">
          <Footer />
        </div>
      </div>
    </div>
  );
}