import React, { useState, useRef, useEffect } from 'react';
import './FormAdd.css';
import Nav from '../components/Nav.jsx';
import { useNavigate } from 'react-router-dom';
import { createProduct, getCategorias } from '../api/productsService';
import { getColores } from '../api/colorsService';
import { getTallas } from '../api/tallasService';
import { FaTag } from 'react-icons/fa';
import ToastNotification from '../components/ToastNotification.jsx';

function FormAddProducts() {
  const [menuCollapsed, setMenuCollapsed] = useState(false);
  const navigate = useNavigate();


  const [categorias, setCategorias] = useState([]);
  const [colores, setColores] = useState([]);
  const [tallas, setTallas] = useState([]);
  const [backendErrors, setBackendErrors] = useState({});

  const [productData, setProductData] = useState({
    nombreProducto: '',
    descripcion: '',
    categoria: '',
    precio: '',
    marcaProducto: '',
  });

  const [productVariations, setProductVariations] = useState([
    { color: '', tallas: '', cantidad: '', imagenes: [] },
  ]);

  const [showVariationForm, setShowVariationForm] = useState(false);
  const [loadingSubmit, setLoadingSubmit] = useState(false);

  const fileInputRefs = useRef([]);

  // Toast messages
  const [successMessage, setSuccessMessage] = useState(null);
  const [errorMessage, setErrorMessage] = useState(null);

  const toggleMenu = () => setMenuCollapsed(!menuCollapsed);

  // ESTADO DE ERRORES PARA INCLUIR TODOS LOS CAMPOS
  const [fieldErrors, setFieldErrors] = useState({
    nombreProducto: '',
    descripcion: '',
    categoria: '',
    precio: '',
    marcaProducto: '',
  });

  // Cargar datos iniciales
  useEffect(() => {
    const fetchData = async () => {
      try {
        const [catRes, colorRes, tallaRes] = await Promise.all([
          getCategorias(),
          getColores(),
          getTallas(),
        ]);
        setCategorias(catRes);
        setColores(colorRes);
        setTallas(tallaRes);
      } catch (error) {
        console.error('Error cargando datos:', error);
        setErrorMessage('No se pudieron cargar los datos iniciales.');
      }
    };
    fetchData();
  }, []);

  const handleProductChange = (e) => {
    const { name, value } = e.target;
    // Limpiar el error del campo al escribir
    setFieldErrors((prev) => ({ ...prev, [name]: '' }));
    setProductData({ ...productData, [name]: value });



  };

  const handleVariationChange = (e, index) => {
    const { name, value } = e.target;
    setProductVariations((prev) =>
      prev.map((variation, i) =>
        i === index ? { ...variation, [name]: value } : variation
      )
    );
  };

  const handleImageChange = (e, variationIndex) => {
    const files = Array.from(e.target.files);
    setProductVariations((prev) =>
      prev.map((variation, i) =>
        i === variationIndex
          ? { ...variation, imagenes: [...variation.imagenes, ...files] }
          : variation
      )
    );
    // Limpiar el input de archivo para poder seleccionar los mismos archivos de nuevo
    e.target.value = null;
  };

  const handleRemoveImage = (variationIndex, imgIndex) => {
    setProductVariations((prev) =>
      prev.map((variation, i) =>
        i === variationIndex
          ? {
            ...variation,
            imagenes: variation.imagenes.filter((_, idx) => idx !== imgIndex),
          }
          : variation
      )
    );
  };

  const handleAddVariationRow = () => {
    setProductVariations([
      ...productVariations,
      { color: '', tallas: '', cantidad: '', imagenes: [] },
    ]);
  };

  const handleRemoveVariationRow = (index) => {
    if (productVariations.length > 1) {
      setProductVariations(productVariations.filter((_, i) => i !== index));
      fileInputRefs.current.splice(index, 1);
    } else {
      setErrorMessage('Debe haber al menos una variación de producto.');
    }
  };

  const validateProductData = () => {
    let errors = {};
    let isValid = true;

    if (!productData.nombreProducto.trim()) {
      errors.nombreProducto = 'El nombre del producto es obligatorio.';
      isValid = false;
    }

    // Verifica si hay un error de nombre repetido ya establecido
    // Esta es la clave para detener el avance
    if (fieldErrors.nombreProducto) {
      errors.nombreProducto = fieldErrors.nombreProducto;
      isValid = false;
    }

    // No permite números 
    else if (/\d/.test(productData.nombreProducto)) {
      errors.nombreProducto = 'El nombre del producto no debe contener números.';
      isValid = false;
    }
    if (!productData.descripcion.trim()) {
      errors.descripcion = 'La descripción es obligatoria.';
      isValid = false;
    }
    if (!productData.categoria) {
      errors.categoria = 'La categoría es obligatoria.';
      isValid = false;
    }

    // Validación de precio: solo múltiplos de mil con punto como separador
    const precioPattern = /^\d{1,3}(\.\d{3})*$/;

    if (!productData.precio || productData.precio.trim() === '') {
      errors.precio = 'El precio es obligatorio.';
      isValid = false;
    } else if (!precioPattern.test(productData.precio)) {
      errors.precio = 'El precio debe estar en formato de miles (ej: 1.000, 60.000).';
      isValid = false;
    }


    setFieldErrors(errors);
    return isValid;
  };

  const handleProceedToVariations = (e) => {
    e.preventDefault();
    if (validateProductData()) {
      setErrorMessage(null); // Limpiar cualquier error anterior de formulario
      setShowVariationForm(true);
    } else {
      setErrorMessage('Por favor, revisa y completa todos los campos obligatorios antes de continuar.');
    }
  };


  const handleSubmitCompleteProduct = async (e) => {
    e.preventDefault();
    setLoadingSubmit(true);
    setErrorMessage(null); // Limpiar mensajes de error previos

    // Validación de Variaciones 
    const valid = productVariations.every(
      (v) => v.color && v.tallas && parseInt(v.cantidad) > 0 && v.imagenes.length > 0
    );

    if (!valid) {
      setErrorMessage('Todas las variaciones deben tener color, talla, cantidad (>0) e imágenes.');
      setLoadingSubmit(false);
      return;
    }

    try {
      // Construir el FormData
      const formData = new FormData();

      formData.append('Nombre_Producto', productData.nombreProducto);
      formData.append('Descripcion', productData.descripcion);
      formData.append('Id_Categoria_Producto', parseInt(productData.categoria));
      const precioNumerico = parseInt(productData.precio.replace(/\./g, ''), 10);
      formData.append('Precio', precioNumerico);

      formData.append('Marca_Producto', productData.marcaProducto);

      productVariations.forEach((variation, index) => {
        formData.append(`Detalles[${index}].Id_Color`, parseInt(variation.color));
        formData.append(`Detalles[${index}].Id_Talla`, parseInt(variation.tallas));
        formData.append(`Detalles[${index}].Stock`, parseInt(variation.cantidad));

        variation.imagenes.forEach((file) => {
          formData.append(`Detalles[${index}].Files`, file);
        });
      });

      //  Llamada a la API
      await createProduct(formData);


      setSuccessMessage('✅ Producto creado exitosamente.');
      navigate('/productos');

    } catch (error) {

      console.log("ERROR BACK", error.response?.data);

      if (error.response?.status === 400 && error.response?.data) {

        const e = error.response.data; // El objeto de errores del servidor

        if (typeof e === 'object' && e !== null) {

          let newFieldErrors = {};

          if (e.Nombre_Producto) {
            newFieldErrors.nombreProducto = e.Nombre_Producto[0];
            setShowVariationForm(false);
          }

          if (e.Descripcion) newFieldErrors.descripcion = e.Descripcion[0];
          if (e.Id_Categoria_Producto) newFieldErrors.categoria = e.Id_Categoria_Producto[0];
          if (e.Precio) newFieldErrors.precio = e.Precio[0];
          if (e.Marca_Producto) newFieldErrors.marcaProducto = e.Marca_Producto[0];

          // Actualiza los errores del formulario y muestra el toast
          setFieldErrors(prev => ({ ...prev, ...newFieldErrors }));
          setErrorMessage('❌ El producto no se pudo guardar. Revisa los errores marcados.');
          return;
        }
      }

      if (error.response?.data?.message) {
        setErrorMessage(error.response.data.message);
        return;
      }

      // Error de Red o Desconocido
      setErrorMessage(error.message || 'Error de conexión desconocido.');

    } finally {
      setLoadingSubmit(false);
    }
  };


  return (
    <div className="role-form-container">
      <Nav menuCollapsed={menuCollapsed} toggleMenu={toggleMenu} />

      <div className={`formulario-rol-main-content-area ${menuCollapsed ? 'expanded-margin' : ''}`}>
        <div className="formulario-roles">
          <h1 className="form-title-products">Registro De Productos</h1>
          <p className="form-info">
            Primero ingresa la información principal del producto y luego en{' '}
            <strong>Añadir Detalles +</strong> agrega variaciones (color, talla, cantidad e imágenes).
          </p><br />

          {/* Paso 1 */}
          <form onSubmit={handleProceedToVariations} className="role-form two-columns">
            <p className="form-subtitle"><FaTag /> Información Principal del Producto</p><br />


            <div className="form-group">
              <label className="label-heading">Nombre del Producto <span className="required-asterisk">*</span></label>
              <input
                type="text"
                name="nombreProducto"
                value={productData.nombreProducto}
                onChange={handleProductChange}
                required
                placeholder="Ingresa nombre del producto"
                className="input-field"
              />

              {fieldErrors.nombreProducto && (
                <p className="error-message-rol">{fieldErrors.nombreProducto}</p>
              )}

            </div>

            <div className="form-group">
              <label className="label-heading">Descripción <span className="required-asterisk">*</span></label>
              <textarea
                name="descripcion"
                value={productData.descripcion}
                onChange={handleProductChange}
                required
                placeholder="Ingresa descripción"
                className="input-field input-field-categoria-producto"
              ></textarea>
              {/* MUESTRA EL ERROR ESPECÍFICO */}
              {fieldErrors.descripcion && (
                <p className="error-message-rol">{fieldErrors.descripcion}</p>
              )}
            </div>

            <div className="form-group">
              <label className="label-heading">Categoría <span className="required-asterisk">*</span></label>
              <select
                name="categoria"
                value={productData.categoria}
                onChange={handleProductChange}
                required
                className="input-field"
              >
                <option value="">Selecciona una categoría</option>
                {categorias.map((cat) => (
                  <option key={cat.id_Categoria_Producto} value={cat.id_Categoria_Producto}>
                    {cat.nombre_Categoria}
                  </option>
                ))}
              </select>
              {/* MUESTRA EL ERROR ESPECÍFICO */}
              {fieldErrors.categoria && (
                <p className="error-message-rol">{fieldErrors.categoria}</p>
              )}
            </div>

            <div className="form-group">
              <label className="label-heading">Precio <span className="required-asterisk">*</span></label>
              <input
                type="text"
                name="precio"
                value={productData.precio}
                onChange={handleProductChange}
                required
                className="input-field"
                placeholder="Ej: 1.000"
                pattern="^\d{1,3}(\.\d{3})*$"
              />
              {/* MUESTRA EL ERROR ESPECÍFICO */}
              {fieldErrors.precio && (
                <p className="error-message-rol">{fieldErrors.precio}</p>
              )}
            </div>

            <div className="form-group">
              <label className="label-heading">Marca <span className="required-asterisk">*</span></label>
              <input
                type="text"
                name="marcaProducto"
                value={productData.marcaProducto}
                onChange={handleProductChange}
                required
                className="input-field"
                placeholder="Ingresa marca "
              />
              {/* MUESTRA EL ERROR ESPECÍFICO */}
              {fieldErrors.marcaProducto && (
                <p className="error-message-rol">{fieldErrors.marcaProducto}</p>
              )}
            </div>

            <div className="form-buttons-row">
              {!showVariationForm && (
                <button type="button" className="cancel-button" onClick={() => navigate(-1)}>
                  Cancelar
                </button>
              )}
              <button type="submit" className="save-button-producto">
                Siguiente
              </button>
            </div>
          </form>

          {/* Paso 2 */}
          {showVariationForm && (
            <form onSubmit={handleSubmitCompleteProduct} className="role-form">
              <hr />
              <p className="form-subtitle">Detalles y Variaciones del Producto</p>

              {productVariations.map((variation, index) => (
                <div key={index} className="variation-row">
                  <h3>Variación #{index + 1}</h3>

                  <div className="variation-fields-row">
                    <div className="form-group">
                      <label className="label-heading">
                        Color <span className="required-asterisk">*</span>
                      </label>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                        <select
                          name="color"
                          value={variation.color}
                          onChange={(e) => handleVariationChange(e, index)}
                          required
                          className="input-field"
                        >
                          <option value="">Seleccionar</option>
                          {colores.map((c) => (
                            <option key={c.id_Color} value={c.id_Color}>
                              {c.nombre_Color}
                            </option>
                          ))}
                        </select>

                        {/* Círculo con color seleccionado */}
                        {variation.color && (
                          <span
                            style={{
                              display: 'inline-block',
                              width: '25px',
                              height: '25px',
                              borderRadius: '50%',
                              backgroundColor: colores.find(c => c.id_Color === parseInt(variation.color))?.hex_color || '#000',
                              border: '1px solid #000'
                            }}
                          />
                        )}
                      </div>
                    </div>
                    <div className="form-group">
                      <label className="label-heading">Talla <span className="required-asterisk">*</span></label>
                      <select
                        name="tallas"
                        value={variation.tallas}
                        onChange={(e) => handleVariationChange(e, index)}
                        required
                        className="input-field"
                      >
                        <option value="">Seleccionar</option>
                        {tallas.map((t) => (
                          <option key={t.id_Talla} value={t.id_Talla}>
                            {t.nombre_Talla}
                          </option>
                        ))}
                      </select>
                    </div>

                    <div className="form-group">
                      <label className="label-heading">Cantidad <span className="required-asterisk">*</span></label>
                      <input
                        type="number"
                        name="cantidad"
                        value={variation.cantidad}
                        onChange={(e) => handleVariationChange(e, index)}
                        required
                        min="1"
                        className="input-field"
                      />
                    </div>
                  </div>

                  <div className="form-group">
                    <label className="label-heading">Imágenes <span className="required-asterisk">*</span></label>
                    <input
                      type="file"
                      ref={(el) => (fileInputRefs.current[index] = el)}
                      onChange={(e) => handleImageChange(e, index)}
                      multiple
                      accept="image/*"
                      style={{ display: 'none' }}
                    />
                    <button
                      type="button"
                      onClick={() => fileInputRefs.current[index].click()}
                      className="add-image-button"
                    >
                      Seleccionar Imágenes
                    </button>

                    <div className="image-preview-container">
                      {variation.imagenes.length === 0 && (
                        <p className="no-images-text">No hay imágenes seleccionadas.</p>
                      )}
                      {variation.imagenes.map((file, imgIndex) => (
                        <div key={imgIndex} className="image-preview-item">
                          <img
                            src={URL.createObjectURL(file)}
                            alt={`Previsualización ${file.name}`}
                            className="product-thumbnail"
                          />
                          <span className="image-name">{file.name}</span>
                          <button
                            type="button"
                            onClick={() => handleRemoveImage(index, imgIndex)}
                            className="remove-image-button"
                          >
                            X
                          </button>
                        </div>
                      ))}
                    </div>
                  </div>

                  {productVariations.length > 1 && (
                    <button
                      type="button"
                      onClick={() => handleRemoveVariationRow(index)}
                      className="remove-variation-button-producto"
                    >
                      Eliminar Variación ×
                    </button>
                  )}
                  <hr className="variation-divider" />
                </div>
              ))}

              <button type="button" onClick={handleAddVariationRow} className="save-button-producto">
                Añadir Otra Variación +
              </button> <br /><br />

              <button type="button" className="cancel-button" onClick={() => navigate(-1)}>
                Cancelar
              </button>
              <button type="submit" className="save-button">
                {loadingSubmit ? 'Guardando...' : 'Guardar Producto'}
              </button>
            </form>
          )}
        </div>
      </div>

      {/* TOASTS */}
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

export default FormAddProducts;