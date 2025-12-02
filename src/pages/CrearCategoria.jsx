import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { FaSave } from 'react-icons/fa';
import Nav from '../components/Nav.jsx';
import ToastNotification from '../components/ToastNotification.jsx';
import { createCategoria } from '../api/categoriasService';
import './FormAdd.css';

export default function CrearCategoria() {
  const navigate = useNavigate();
  const [menuCollapsed, setMenuCollapsed] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [formData, setFormData] = useState({ nombre_Categoria: '', descripcion: '' });
  const [errors, setErrors] = useState({});
  const [errorMessage, setErrorMessage] = useState(null);

  const toggleMenu = () => setMenuCollapsed(!menuCollapsed);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
    if (errors[name]) setErrors(prev => ({ ...prev, [name]: '' }));
  };

  const validateForm = () => {
    const newErrors = {};
    const name = formData.nombre_Categoria.trim();
    const descripcion = formData.descripcion.trim();
    if (!name) {
      // Campo obligatorio
      newErrors.nombre_Categoria = 'El nombre es obligatorio';
    } else if (/\d/.test(name)) { 
      newErrors.nombre_Categoria = 'El nombre no debe contener números (dígitos)';
    }
    if (formData.descripcion && formData.descripcion.length > 1000) newErrors.descripcion = 'Solo se permite 1000 caracteres';
    if (!descripcion) {
      newErrors.descripcion = 'El campo es obligatorio';
    }
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validateForm()) return;

    try {
      setSubmitting(true);
      await createCategoria(formData);

      // Pasamos el mensaje al estado de la página de categorías
      navigate('/categorias', {
        state: { successMessage: `Categoría '${formData.nombre_Categoria}' creada exitosamente` }
      });

    } catch (error) {
      const errorMsg = error.response?.data?.mensaje || 'Error al crear la categoría.';
      setErrorMessage(errorMsg); 
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
          <p className="form-info">Completa todos los campos antes de Guardar: </p><br /><br />

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
              /><br />
              {errors.nombre_Categoria && <span className="error-message-rol">{errors.nombre_Categoria}</span>}
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
              /><br />
              {errors.descripcion && <span className="error-message-rol">{errors.descripcion}</span>}
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

      <ToastNotification
        message={errorMessage}
        type="error"
        onClose={() => setErrorMessage(null)}
      />
    </div>
  );
}
