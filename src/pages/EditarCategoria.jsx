import React, { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { FaArrowLeft, FaSave } from 'react-icons/fa';
import Nav from '../components/Nav.jsx';
import Footer from '../components/Footer.jsx';



export default function EditarCategoria() {
  const navigate = useNavigate();
  const { id } = useParams();
  const [menuCollapsed, setMenuCollapsed] = useState(false);
  const [formData, setFormData] = useState({
    nombre: '',
    descripcion: '',
    estado: true,
    fechaCreacion: ''
  });
  const [errors, setErrors] = useState({});



  useEffect(() => {
    // 1. Log para verificar el ID recibido de la URL
    console.log('ID recibido:', id);

    // 2. Buscar la categoría a editar solo si el ID existe
    if (id) {
      const categoria = categoriasEjemplo.find(cat => cat.id === id);

      // 3. Log para ver si se encontró la categoría
      console.log('Categoría encontrada:', categoria);

      if (categoria) {
        setFormData(categoria);
      } else {
        // Redirigir si no se encuentra la categoría
        console.log('Categoría no encontrada. Redirigiendo...');
        navigate('/categorias');
      }
    } else {
      // Si no hay ID, redirigir
      console.log('No se recibió ID. Redirigiendo...');
      navigate('/categorias');
    }
  }, [id, navigate]);

  const toggleMenu = () => setMenuCollapsed(!menuCollapsed);

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value
    }));

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
      // Aquí iría la lógica para guardar los cambios (API, contexto, etc.)
      console.log('Categoría actualizada:', formData);

      // Redirigir a la página de categorías
      navigate('/categorias');
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
            <h1>Editar Categoría</h1>
          </div>
        </div>

        <div className="form-container">
          <form onSubmit={handleSubmit} className="category-form">
            <div className="form-group">
              <label htmlFor="nombre">
                Nombre de la categoría: <span className="required">*</span>
              </label>
              <input
                type="text"
                id="nombre"
                name="nombre"
                value={formData?.nombre || ''}
                onChange={handleChange}
                className={errors.nombre ? 'error' : ''}
              />
              {errors.nombre && <span className="error-message">{errors.nombre}</span>}
            </div>

            <div className="form-group">
              <label htmlFor="descripcion">
                Descripción: <span className="required">*</span>
              </label>
              <textarea
                id="descripcion"
                name="descripcion"
                value={formData?.descripcion || ''}
                onChange={handleChange}
                className={errors.descripcion ? 'error' : ''}
                rows="4"
              />
              {errors.descripcion && <span className="error-message">{errors.descripcion}</span>}
            </div>

            <div className="form-group">
              <label htmlFor="estado">
                Estado: <span className="required">*</span>
              </label>
              <select
                id="estado"
                name="estado"
                value={formData.estado ? '1' : '0'}
                onChange={(e) => setFormData({ ...formData, estado: e.target.value === '1' })}
              >
                <option value="1">Activa</option>
                <option value="0">Inactiva</option>
              </select>
            </div>

            <div className="form-group">
              <label htmlFor="fechaCreacion">
                Fecha de creación: <span className="required">*</span>
              </label>
              <input
                type="date"
                id="fechaCreacion"
                name="fechaCreacion"
                value={formData.fechaCreacion}
                onChange={handleChange}
              />
            </div>

            <div className="form-buttons">
              <button type="submit" className="submit-button">
                <FaSave /> Guardar Cambios
              </button>
              <button
                type="button"
                className="cancel-button"
                onClick={() => navigate('/categorias')}
              >
                Cancelar
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