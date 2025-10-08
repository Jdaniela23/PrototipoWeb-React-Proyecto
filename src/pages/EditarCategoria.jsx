// src/pages/EditarCategorias.jsx
import React, { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import Nav from '../components/Nav.jsx';
import Footer from '../components/Footer.jsx';
import { FaSave } from 'react-icons/fa';
import ToastNotification from '../components/ToastNotification.jsx';
import { getCategoriaById, updateCategoria } from '../api/categoriasService';
import './FormAdd.css'; // mismo CSS que colores

export default function EditarCategorias() {
  const { id } = useParams();
  const navigate = useNavigate();

  const [menuCollapsed, setMenuCollapsed] = useState(false);
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [categoriaData, setCategoriaData] = useState({
    Id_Categoria_Producto: '',
    Nombre_Categoria: '',
    Descripcion: ''
  });

  const [successMessage, setSuccessMessage] = useState(null);
  const [errorMessage, setErrorMessage] = useState(null);

  const toggleMenu = () => setMenuCollapsed(!menuCollapsed);

  useEffect(() => {
    if (id) fetchCategoria();
  }, [id]);

  const fetchCategoria = async () => {
    try {
      setLoading(true);
      const data = await getCategoriaById(id);
      setCategoriaData({
        Id_Categoria_Producto: data.id_Categoria_Producto || data.Id_Categoria_Producto,
        Nombre_Categoria: data.nombre_Categoria || data.Nombre_Categoria || '',
        Descripcion: data.descripcion || data.Descripcion || ''
      });
    } catch (error) {
      console.error('Error al cargar categoría:', error);
      setErrorMessage('Error al cargar la categoría');
    } finally {
      setLoading(false);
    }
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setCategoriaData(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!categoriaData.Nombre_Categoria.trim()) {
      setErrorMessage('El nombre de la categoría es obligatorio');
      return;
    }

    try {
      setSubmitting(true);
      await updateCategoria(id, {
        Id_Categoria_Producto: parseInt(id),
        Nombre_Categoria: categoriaData.Nombre_Categoria.trim(),
        Descripcion: categoriaData.Descripcion?.trim() || ''
      });
      setSuccessMessage('Categoría actualizada exitosamente');
      setErrorMessage(null);

      // Redirigir a categorías después de un breve delay para que se vea el toast
      setTimeout(() => {
        navigate('/categorias', { state: { successMessage: 'Categoría actualizada exitosamente' } });
      }, 1200);
    } catch (error) {
      console.error('Error al actualizar:', error);
      const errorMsg = error.response?.data?.mensaje || 'Error al actualizar la categoría';
      setErrorMessage(errorMsg);
      setSuccessMessage(null);
    } finally {
      setSubmitting(false);
    }
  };

  if (loading) {
    return (
      <div className="role-form-container">
        <Nav menuCollapsed={menuCollapsed} toggleMenu={toggleMenu} />
        <div className={`formulario-rol-main-content-area ${menuCollapsed ? 'expanded-margin' : ''}`}>
          <p>Cargando categoría...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="role-form-container">
      <Nav menuCollapsed={menuCollapsed} toggleMenu={toggleMenu} />

      <div className={`formulario-rol-main-content-area ${menuCollapsed ? 'expanded-margin' : ''}`}>
        <div className="formulario-roles">
          <h1 className="form-title">Editar Categoría</h1>
          <p className="form-info">Categoría: {categoriaData.Nombre_Categoria}</p><br /><br />

          <form onSubmit={handleSubmit} className="role-form">
            <div className="form-group">
              <label htmlFor="Id_Categoria_Producto" className="label-heading">ID de la Categoría:</label>
              <input
                type="text"
                id="Id_Categoria_Producto"
                name="Id_Categoria_Producto"
                value={categoriaData.Id_Categoria_Producto}
                disabled
                className="input-field"
              />
            </div>

            <div className="form-group">
              <label htmlFor="Nombre_Categoria" className="label-heading">
                Nombre: <span className="required-asterisk">*</span>
              </label>
              <input
                type="text"
                id="Nombre_Categoria"
                name="Nombre_Categoria"
                value={categoriaData.Nombre_Categoria}
                onChange={handleChange}
                maxLength={100}
                disabled={submitting}
                className="input-field"
              />
            </div>

            <div className="form-group">
              <label htmlFor="Descripcion" className="label-heading">
                Descripción: <span className="required-asterisk">*</span>
              </label>
              <textarea
                id="Descripcion"
                name="Descripcion"
                value={categoriaData.Descripcion}
                onChange={handleChange}
                maxLength={500}
                rows="4"
                disabled={submitting}
                className="input-field"
              />
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
                <FaSave style={{ marginRight: '8px' }} />
                {submitting ? 'Actualizando...' : 'Actualizar Categoría'}
              </button>
            </div>
          </form>
        </div>
      </div>

      <ToastNotification
        message={successMessage}
        type="success"
        onClose={() => setSuccessMessage(null)}
      />
      <ToastNotification
        message={errorMessage}
        type="error"
        onClose={() => setErrorMessage(null)}
      />

    </div>
  );
}
