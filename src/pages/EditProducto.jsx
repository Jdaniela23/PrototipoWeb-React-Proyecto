import React, { useState } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import Nav from '../components/Nav.jsx';

import './FormAdd.css'; 

export default function EditProducto() {
  const location = useLocation();
  const productoEdit = location.state?.producto;

  // Lista de tallas disponibles (¡Ajusta esta lista según tus necesidades!)
  const tallasDisponibles = ['XS', 'S', 'M', 'L', 'XL', 'XXL', '36', '38', '40', '42', '44']; // EJEMPLO DE TALLAS

  /* 2️⃣ Estado principal del formulario */
  const [productosData, setProductosData] = useState({
    nombre: productoEdit?.nombre || '',
    descripcion: productoEdit?.descripcion || '',
    precio: productoEdit?.precio || '',
    // No traemos el estado si no es necesario en este formulario
    categoria: productoEdit?.categoria || '',
    marca: productoEdit?.marca || '',
    colores: productoEdit?.colores && productoEdit.colores.length > 0 ? productoEdit.colores[0] : '#000000', 
    talla: productoEdit?.talla || '', // Cambiamos a 'talla' singular para el select
    imagenes: [],
    fecha_actualizacion: new Date().toISOString().slice(0, 16),
  });

  /* 3️⃣ Estado para las imágenes cargadas (File | string) */
  const [imagenes, setImagenes] = useState(productoEdit?.imagenes || []);

  /* 4️⃣ Manejo del menú lateral y navegación */
  const [menuCollapsed, setMenuCollapsed] = useState(false);
  const toggleMenu = () => setMenuCollapsed(!menuCollapsed);
  const navigate = useNavigate();

  /* 5️⃣ Handlers -------------------------------------------------- */
  // Actualiza cualquier input ⇢ productosData
  const handleChange = (e) => {
    const { name, value, type, files } = e.target;

    if (type === 'file') {
      const filesArray = Array.from(files);
      setImagenes((prev) => [...prev, ...filesArray]);
    } else {
      setProductosData((prev) => ({ ...prev, [name]: value }));
    }
  };

  // Manejar cambio del color principal directamente
  const handleColorChange = (e) => {
    setProductosData((prev) => ({ ...prev, colores: e.target.value }));
  };

  // Elimina una imagen por índice
  const handleRemoveImage = (index) => {
    setImagenes((prev) => prev.filter((_, i) => i !== index));
  };

  // Envía el formulario (simulado)
  const handleSubmit = (e) => {
    e.preventDefault();
    /* Actualizamos productosData con las imágenes finales */
    const actualizado = {
      ...productosData,
      imagenes,
      fecha_actualizacion: new Date().toISOString().slice(0, 16)
    };

    console.log('Producto actualizado:', actualizado);
    alert('Producto actualizado exitosamente!');
    setTimeout(() => navigate('/productos'), 800);
  };

  const handleChangeduplicada = (e) => {
    const { name, value, type, files } = e.target;
    let newValue = value;

    
    if (type === 'file') {
      const filesArray = Array.from(files);
      setImagenes((prev) => [...prev, ...filesArray]);
      return;
    }

    // Manejo especial para el campo de precio
    if (name === 'precio') {
      // Elimina todos los caracteres que no sean números
      newValue = newValue.replace(/[^0-9]/g, '');
    }

    setProductosData((prev) => ({ ...prev, [name]: newValue }));
  };

  /* 6️⃣ Render ---------------------------------------------------- */
  return (
    <div className="role-form-container">
      <Nav menuCollapsed={menuCollapsed} toggleMenu={toggleMenu} />

      <div className={`formulario-rol-main-content-area ${menuCollapsed ? 'expanded-margin' : ''}`}>
   

        <div className="formulario-roles">
          <h1 className="form-title">Editar Producto</h1>
          <p className="form-info">Modifica los datos del producto y luego dale clic en Actualizar Productos ✅</p>
          <br /><br />
          <form onSubmit={handleSubmit} className="role-form">
            {/* Nombre */}
            <div className="form-group">
              <label className="label-heading-producto" htmlFor="nombre">
                Nombre: <span className="required-asterisk">*</span>
              </label>
              <input id="nombre" name="nombre" className="input-field" required value={productosData.nombre} onChange={handleChange} />
            </div>

            {/* Descripción */}
            <div className="form-group">
              <label className="label-heading-producto" htmlFor="descripcion">
                Descripción: <span className="required-asterisk">*</span>
              </label>
              <textarea id="descripcion" name="descripcion" rows="3" className="input-field textarea-field" required value={productosData.descripcion} onChange={handleChange} />
            </div>



            <div className="form-group">
              <label className="label-heading-producto" htmlFor="precio">
                Precio: <span className="required-asterisk">*</span>
              </label>
              <input
                id="precio"
                name="precio"
                type="text" 
                className="input-field"
                required
                value={productosData.precio}
                onChange={handleChange}
              />
            </div>

            {/* Imágenes */}
            <div className="form-group">
              <label className="label-heading-producto">Imágenes del producto:</label>
              <div className="image-upload-container">
                {imagenes.map((img, index) => (
                  <div key={index} className="preview-image-wrapper">
                    <img src={typeof img === 'string' ? img : URL.createObjectURL(img)} alt={`preview-${index}`} className="preview-image" style={{ width: '100px' }} />
                    <button type="button" className="remove-image-button" onClick={() => handleRemoveImage(index)}>X</button>
                  </div>
                ))}
                <br /><label htmlFor="file-upload" className="custom-file-upload">Seleccionar imagen</label>
                <input id="file-upload" type="file" accept="image/*" multiple style={{ display: 'none' }} onChange={handleChange} />
              </div>
            </div>

            {/* Color principal */}
            <div className="form-group">
              <label className="label-heading-producto">Color principal:</label>
              <div style={{ display: 'flex', gap: 8, alignItems: 'center' }}>
                <input type="color" value={productosData.colores} onChange={handleColorChange} className="color-picker" />
              </div>
            </div>

            {/* Tallas - CAMPO SELECT DESPLEGABLE */}
            <div className="form-group">
              <label className="label-heading-producto" htmlFor="talla">
                Talla: <span className="required-asterisk">*</span>
              </label>
              <select
                id="talla"
                name="talla"
                className="input-field"
                required
                value={productosData.talla}
                onChange={handleChange}
              >
                <option value="">-- Seleccione una talla --</option>
                {tallasDisponibles.map((tallaOption) => (
                  <option key={tallaOption} value={tallaOption}>
                    {tallaOption}
                  </option>
                ))}
              </select>
            </div>

            {/* Categoría */}
            <div className="form-group">
              <label className="label-heading-producto" htmlFor="categoria">
                Categoría: <span className="required-asterisk">*</span>
              </label>
              <input id="categoria" name="categoria" className="input-field" required value={productosData.categoria} onChange={handleChange} />
            </div>

            {/* Marca */}
            <div className="form-group">
              <label className="label-heading-producto" htmlFor="marca">
                Marca: <span className="required-asterisk">*</span>
              </label>
              <input id="marca" name="marca" className="input-field" required value={productosData.marca} onChange={handleChange} />
            </div>

            {/* Fecha de actualización */}
            <div className="form-group">
              <label className="label-heading-producto" htmlFor="fecha_actualizacion">Fecha de actualización</label>
              <input id="fecha_actualizacion" type="datetime-local" name="fecha_actualizacion" className="input-field" disabled value={productosData.fecha_actualizacion} />
            </div>

            {/* Botones de acción */}
            <div className="form-actions">
              <button type="submit" className="save-button">Actualizar Producto</button><br />
              <button type="button" className="cancel-button" onClick={() => navigate(-1)}>
                Cancelar
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}