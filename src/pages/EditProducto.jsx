import React, { useState, useEffect, useRef } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import Nav from "../components/Nav.jsx";
import { FaSave } from "react-icons/fa";
import "./FormAdd.css";
import ToastNotification from "../components/ToastNotification.jsx";
import { getCategorias, updateProduct } from "../api/productsService";
import { getColores } from "../api/colorsService";
import { getTallas } from "../api/tallasService";


export default function EditProducto() {
  const [variacionesEliminadas, setVariacionesEliminadas] = useState([]);
  const location = useLocation();
  const productoEdit = location.state?.producto;
  const navigate = useNavigate();
  const [fieldErrors, setFieldErrors] = useState({});

  const [menuCollapsed, setMenuCollapsed] = useState(false);
  const toggleMenu = () => setMenuCollapsed(!menuCollapsed);

  const [categorias, setCategorias] = useState([]);
  const [colores, setColores] = useState([]);
  const [tallas, setTallas] = useState([]);

  const formatPrice = (price) => {
    if (!price) return '';
    const cleanValue = price.toString().replace(/\./g, '');
    const numberValue = parseInt(cleanValue, 10);
    if (isNaN(numberValue)) return '';
    return new Intl.NumberFormat('es-CO', { minimumFractionDigits: 0 }).format(numberValue);
  };


  const [productData, setProductData] = useState({
    id_Producto: productoEdit?.id_Producto || 0,
    nombreProducto: productoEdit?.nombre_Producto || "",
    descripcion: productoEdit?.descripcion || "",
    categoria: productoEdit?.id_Categoria_Producto || "",
    precio: formatPrice(productoEdit?.precio || ""),
    marcaProducto: productoEdit?.marca_Producto || "",
  });
  const handlePriceChange = (e) => {
    const value = e.target.value.replace(/\D/g, ''); // solo números
    const formatted = formatPrice(value);
    setProductData(prev => ({ ...prev, precio: formatted }));
  };

  const [variaciones, setVariaciones] = useState(
    productoEdit?.detalles?.map((d) => ({
      id_Detalle_Producto: d.id_Detalle_Producto,
      color: d.id_Color,
      talla: d.id_Talla,
      stock: d.stock,
      imagenesExistentes: d.imagenes || [],
      nuevasImagenes: [],
    })) || []
  );

  const [successMessage, setSuccessMessage] = useState(null);
  const [errorMessage, setErrorMessage] = useState(null);
  const [loadingSubmit, setLoadingSubmit] = useState(false);
  const fileInputRefs = useRef([]);

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
        console.error("Error cargando datos:", error);
        setErrorMessage("No se pudieron cargar los datos iniciales.");
      }
    };
    fetchData();
  }, []);

  const handleDeleteVariacion = (index) => {
    const variacionAEliminar = variaciones[index];
    if (variacionAEliminar.id_Detalle_Producto > 0) {
      setVariacionesEliminadas((prev) => [
        ...prev,
        variacionAEliminar.id_Detalle_Producto,
      ]);
    }
    setVariaciones((prev) => prev.filter((_, i) => i !== index));
  };

  const handleProductChange = (e) => {
    const { name, value } = e.target;
    setProductData((prev) => ({ ...prev, [name]: value }));
  };

  const handleVariationChange = (e, index) => {
    const { name, value } = e.target;
    setVariaciones((prev) =>
      prev.map((v, i) => (i === index ? { ...v, [name]: value } : v))
    );
  };

  const handleAddVariationRow = () => {
    setVariaciones((prev) => [
      ...prev,
      {
        id_Detalle_Producto: 0,
        color: "",
        talla: "",
        stock: "",
        imagenesExistentes: [],
        nuevasImagenes: [],
      },
    ]);
  };

  const handleImageChange = (e, index) => {
    const files = Array.from(e.target.files);
    setVariaciones((prev) =>
      prev.map((v, i) =>
        i === index
          ? { ...v, nuevasImagenes: [...v.nuevasImagenes, ...files] }
          : v
      )
    );
  };

  const handleRemoveExistingImage = (variationIndex, imgIndex) => {
    setVariaciones((prev) =>
      prev.map((v, i) =>
        i === variationIndex
          ? {
            ...v,
            imagenesExistentes: v.imagenesExistentes.filter(
              (_, idx) => idx !== imgIndex
            ),
          }
          : v
      )
    );
  };

  const handleRemoveNewImage = (variationIndex, imgIndex) => {
    setVariaciones((prev) =>
      prev.map((v, i) =>
        i === variationIndex
          ? {
            ...v,
            nuevasImagenes: v.nuevasImagenes.filter((_, idx) => idx !== imgIndex),
          }
          : v
      )
    );
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoadingSubmit(true);
    setFieldErrors({});
    const errors = {};
    let isValid = true;
    let variationErrors = [];


    if (!productData.nombreProducto.trim()) {
      errors.nombreProducto = "El nombre es obligatorio.";
      isValid = false;
    } else if (/\d/.test(productData.nombreProducto)) {
      // Usamos 'else if' porque si el campo está vacío, no necesitamos comprobar si tiene números.
      errors.nombreProducto = 'El nombre del producto no debe contener números.';
      isValid = false;
    }

    const precioPattern = /^\d{1,3}(\.\d{3})*$/;

    if (!productData.precio || productData.precio.trim() === '') {
      errors.precio = 'El precio es obligatorio.';
      isValid = false;
    } else if (!precioPattern.test(productData.precio)) {
      errors.precio = 'El precio debe estar en formato de miles (ej: 1.000, 60.000).';
      isValid = false;
    }

    // Validar Variaciones (Stock, Color, Talla, y Unicidad)
    const existingCombinations = new Set();

    variationErrors = variaciones.map((v, index) => {
      const vErrors = {};
      const stockNum = parseInt(v.stock, 10);
      const combinationKey = `${v.color}-${v.talla}`;

      // Campos obligatorios y Stock
      if (!v.color) { vErrors.color = "Color obligatorio."; isValid = false; }
      if (!v.talla) { vErrors.talla = "Talla obligatoria."; isValid = false; }

      if (isNaN(stockNum) || stockNum < 0 || !Number.isInteger(stockNum)) {
        vErrors.stock = "El Stock debe ser un número entero no negativo.";
        isValid = false;
      }

      // CValidar Unicidad (Color + Talla)
      // Solo verificamos la unicidad si ambos campos están seleccionados
      if (v.color && v.talla) {
        if (existingCombinations.has(combinationKey)) {
          vErrors.color = "Esta variación (Color/Talla) ya existe.";
          vErrors.talla = "Esta variación (Color/Talla) ya existe.";
          isValid = false;
        } else {
          existingCombinations.add(combinationKey);
        }
      }
      if ((!v.imagenesExistentes || v.imagenesExistentes.length === 0) &&
        (!v.nuevasImagenes || v.nuevasImagenes.length === 0)) {
        vErrors.imagen = "Se requiere al menos una imagen para esta variación.";
        isValid = false;
      }
      return vErrors;
    });

    if (!isValid) {
      setFieldErrors({
        ...errors,
        variations: variationErrors // Pasamos los errores de variaciones anidadas
      });
      setErrorMessage("Verifica los campos con errores.");
      setLoadingSubmit(false);
      return; // Detiene el envío del formulario.
    }

    try {
      const formData = new FormData();
      formData.append("Id_Producto", productData.id_Producto);
      formData.append("Nombre_Producto", productData.nombreProducto);
      formData.append("Descripcion", productData.descripcion);
      formData.append("Id_Categoria_Producto", productData.categoria);
      formData.append("Precio", productData.precio.replace(/\./g, ''));

      formData.append("Marca_Producto", productData.marcaProducto);

      // Variaciones activas
      variaciones.forEach((v, index) => {
        formData.append(`Detalles[${index}].Id_Detalle_Producto`, v.id_Detalle_Producto || 0);
        formData.append(`Detalles[${index}].Id_Color`, v.color);
        formData.append(`Detalles[${index}].Id_Talla`, v.talla);
        formData.append(`Detalles[${index}].Stock`, v.stock);

        // Imágenes existentes
        (v.imagenesExistentes || []).forEach((img, i) => {
          const url = typeof img === "string" ? img : img.url_Imagen;
          if (url)
            formData.append(
              `Detalles[${index}].Urls_Imagenes_Existentes[${i}]`,
              url
            );
        });

        // enviar nuevas imágenes con índice
        (v.nuevasImagenes || []).forEach((file, i) => {
          formData.append(
            `Detalles[${index}].NuevasImagenes[${i}]`,
            file
          );
        });
      });

      // IDs de variaciones eliminadas
      variacionesEliminadas.forEach((id, i) => {
        formData.append(`Ids_Detalles_Eliminados[${i}]`, id);
      });

      await updateProduct(productData.id_Producto, formData);

      setSuccessMessage("Producto actualizado exitosamente.");
      setTimeout(() => navigate("/productos"), 1500);
    } catch (error) {
      console.error("Error al actualizar producto:", error);
      setErrorMessage("Error al actualizar el producto.");
      if (error.response && error.response.status === 400 && error.response.data) {

        const serverErrors = error.response.data.errors || error.response.data;
        const newFieldErrors = {};

        // Manejar el error de unicidad (Nombre_Producto)
        if (serverErrors.Nombre_Producto && serverErrors.Nombre_Producto.length > 0) {
          newFieldErrors.nombreProducto = serverErrors.Nombre_Producto[0];
        }

        if (serverErrors.Nombre_Producto) {
          newFieldErrors.nombreProducto = serverErrors.Nombre_Producto[0];
        }


        setFieldErrors(newFieldErrors);


        if (Object.keys(newFieldErrors).length === 0) {
          setErrorMessage("Error al actualizar el producto. Por favor, verifica los datos.");
        } else {
          setErrorMessage("Verifica los campos con errores."); // Mensaje general para Toast
        }

      } else {
        // Manejo de errores no 400 (ej. 500, network error)
        setErrorMessage("Error de conexión o error desconocido al actualizar el producto.");
      }
    } finally {
      setLoadingSubmit(false);
    }
  };

  return (
    <div className="role-form-container">
      <Nav menuCollapsed={menuCollapsed} toggleMenu={toggleMenu} />

      <div
        className={`formulario-rol-main-content-area ${menuCollapsed ? "expanded-margin" : ""
          }`}
      >
        <div className="formulario-roles">
          <h1 className="form-title">Editar Producto</h1>
          <p className="form-info">
            Modifica los datos del producto y guarda los cambios 👩🏻‍💻.
          </p><br /><br></br>
          <form onSubmit={handleSubmit} className="role-form two-columns">
            {/* PRODUCTO */}
            <div className="form-group">
              <label>Nombre: <span className="required-asterisk">*</span></label>
              <input
                name="nombreProducto"
                value={productData.nombreProducto}
                onChange={handleProductChange}
                required
                className="input-field"
              />
              {fieldErrors.nombreProducto && (
                <p className="error-message-rol">{fieldErrors.nombreProducto}</p>
              )}
            </div>

            <div className="form-group">
              <label>Descripción: <span className="required-asterisk">*</span></label>
              <textarea
                name="descripcion"
                value={productData.descripcion}
                onChange={handleProductChange}
                required
                className="input-field"
              />
            </div>

            <div className="form-group">
              <label>Categoría:  <span className="required-asterisk">*</span></label>
              <select
                name="categoria"
                value={productData.categoria}
                onChange={handleProductChange}
                required
                className="input-field"
              >
                <option value="">Selecciona una categoría</option>
                {categorias.map((c) => (
                  <option key={c.id_Categoria_Producto} value={c.id_Categoria_Producto}>
                    {c.nombre_Categoria}
                  </option>
                ))}
              </select>
            </div>

            <div className="form-group">
              <label>Precio:  <span className="required-asterisk">*</span></label>
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

            </div>

            <div className="form-group">
              <label>Marca:  <span className="required-asterisk">*</span></label>
              <input
                name="marcaProducto"
                value={productData.marcaProducto}
                onChange={handleProductChange}
                required
                className="input-field"
              />
            </div>

            <hr />
            <p className="form-subtitle">Variaciones: </p><br />
            {variaciones.map((v, index) => (
              <div key={index} className="variation-row">
                <h4 className="subtitle-variacion">Variación #{index + 1}</h4>

                <div className="form-group">
                  <label>Color</label>
                  <select
                    name="color"
                    value={v.color}
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
                  {fieldErrors.variations && fieldErrors.variations[index]?.color && (
                    <p className="error-message-rol">{fieldErrors.variations[index].color}</p>
                  )}
                </div>

                <div className="form-group">
                  <label>Talla</label>
                  <select
                    name="talla"
                    value={v.talla}
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
                  {fieldErrors.variations && fieldErrors.variations[index]?.talla && (
                    <p className="error-message-rol">{fieldErrors.variations[index].talla}</p>
                  )}
                </div>

                <div className="form-group">
                  <label>Stock</label>
                  <input
                    type="number"
                    name="stock"
                    value={v.stock}
                    onChange={(e) => handleVariationChange(e, index)}
                    required
                    className="input-field"
                  />
                  {fieldErrors.variations && fieldErrors.variations[index]?.stock && (
                    <p className="error-message-rol">{fieldErrors.variations[index].stock}</p>
                  )}
                </div>

                {/* Imágenes existentes */}
                <div className="form-group">
                  <label>Imágenes actuales</label>
                  {v.imagenesExistentes.map((imgObj, i) => (
                    <div key={i} className="image-preview-item">
                      <img
                        src={imgObj.url_Imagen || imgObj}
                        alt={`Imagen ${i + 1}`}
                        className="product-thumbnail"
                      />
                      <button
                        type="button"
                        onClick={() => handleRemoveExistingImage(index, i)}
                        className="remove-image-button"
                      >
                        X
                      </button>
                    </div>
                  ))}
                </div>

                {/* Nuevas imágenes */}
                <div className="form-group">
                  <label>Nuevas imágenes</label>
                  <input
                    type="file"
                    ref={(el) => (fileInputRefs.current[index] = el)}
                    onChange={(e) => handleImageChange(e, index)}
                    multiple
                    accept="image/*"
                    style={{ display: "none" }}
                  />
                  {fieldErrors.variations && fieldErrors.variations[index]?.imagen && (
                    <p className="error-message-rol">{fieldErrors.variations[index].imagen}</p>
                  )}

                  <button
                    type="button"
                    onClick={() => fileInputRefs.current[index].click()}
                    className="add-image-button"
                  >
                    Seleccionar imágenes
                  </button>

                  <div className="image-preview-container">
                    {v.nuevasImagenes.map((file, imgIndex) => (
                      <div key={imgIndex} className="image-preview-item">
                        <img
                          src={URL.createObjectURL(file)}
                          alt={file.name}
                          className="product-thumbnail"
                        />
                        <button
                          type="button"
                          onClick={() => handleRemoveNewImage(index, imgIndex)}
                          className="remove-image-button"
                        >
                          X
                        </button>
                      </div>
                    ))}
                  </div>
                </div>

                <button
                  type="button"
                  onClick={() => handleDeleteVariacion(index)}
                  className="remove-variation-button-producto"
                >
                  Eliminar variación ×
                </button>

                <hr />
              </div>
            ))}

            <button
              type="button"
              onClick={handleAddVariationRow}
              className="save-button-producto"
            >
              Añadir otra variación +
            </button>


            <div className="form-actions">
              <button type="submit" className="save-button">
                {loadingSubmit ? "Actualizando..." : <><FaSave /> Actualizar Producto</>}
              </button>

            </div>
            <button
              type="button"
              className="cancel-button-editproducto"
              onClick={() => navigate(-1)}
            >
              Cancelar
            </button>
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
