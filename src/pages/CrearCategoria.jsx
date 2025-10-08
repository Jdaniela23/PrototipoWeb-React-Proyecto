// src/pages/CrearCategoria.jsx
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { FaSave } from 'react-icons/fa';
import Nav from '../components/Nav.jsx';
import Footer from '../components/Footer.jsx';
import ToastNotification from '../components/ToastNotification.jsx';
import { createCategoria } from '../api/categoriasService';
import './FormAdd.css'; // mismo CSS que colores

export default function CrearCategoria() {
  const navigate = useNavigate();
  const [menuCollapsed, setMenuCollapsed] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [formData, setFormData] = useState({ nombre_Categoria: '', descripcion: '' });
  const [errors, setErrors] = useState({});

  const toggleMenu = () => setMenuCollapsed(!menuCollapsed);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
    if (errors[name]) setErrors(prev => ({ ...prev, [name]: '' }));
  };

  const validateForm = () => {
    const newErrors = {};
    if (!formData.nombre_Categoria.trim()) newErrors.nombre_Categoria = 'El nombre es obligatorio';
    if (formData.descripcion && formData.descripcion.length > 500) newErrors.descripcion = 'Máx 500 caracteres';
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validateForm()) return;

    try {
      setSubmitting(true);
      await createCategoria(formData);

      // 🚀 Pasamos el mensaje al estado de la página de categorías
      navigate('/categorias', {
        state: { successMessage: `Categoría '${formData.nombre_Categoria}' creada exitosamente` }
      });

    } catch (error) {
      console.error(error);
      alert('Error al crear la categoría');
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="role-form-container">
      <Nav menuCollapsed={menuCollapsed} toggleMenu={toggleMenu} />

      <div className={`formulario-rol-main-content-area ${menuCollapsed ? 'expanded-margin' : ''}`}>
        <div className="formulario-roles">
          <h1 className="form-title">Crear Nueva Categoría</h1>
          <p className="form-info">Completa todos los campos antes de Guardar 👩🏻‍💻</p><br /><br />

          <form onSubmit={handleSubmit} className="role-form">
            <div className="form-group">
              <label htmlFor="nombre_Categoria" className="label-heading">
                Nombre de la categoría <span className="required-asterisk">*</span>
              </label>
              <input
                type="text"
                id="nombre_Categoria"
                name="nombre_Categoria"
                className="input-field"
                placeholder="Ej: Ropa deportiva"
                value={formData.nombre_Categoria}
                onChange={handleChange}
                disabled={submitting}
              />
              {errors.nombre_Categoria && <span className="error-message">{errors.nombre_Categoria}</span>}
            </div>

            <div className="form-group">
              <label htmlFor="descripcion" className="label-heading">
                Descripción <span className="required-asterisk">*</span>
              </label>
              <textarea
                id="descripcion"
                name="descripcion"
                className="input-field"
                placeholder="Describe brevemente esta categoría (opcional)"
                value={formData.descripcion}
                onChange={handleChange}
                rows="4"
                disabled={submitting}
              />
              {errors.descripcion && <span className="error-message">{errors.descripcion}</span>}
            </div>

            <div className="form-buttons">
              <button
                type="button"
                className="cancel-button"
                onClick={() => navigate('/categorias')}
                disabled={submitting}
              >
                Cancelar
              </button>
              <button
                type="submit"
                className="save-button"
                disabled={submitting}
              >
                <FaSave /> {submitting ? 'Creando...' : 'Crear Categoría'}
              </button>
            </div>
          </form>
        </div>
      </div>


    </div>
  );
}
