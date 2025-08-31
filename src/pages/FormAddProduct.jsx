import React, { useState, useRef } from 'react';
import './FormAdd.css';
import Nav from '../components/Nav.jsx';
import { useNavigate } from 'react-router-dom';

function FormAddProducts() {
    // Estado para controlar si el menú lateral
    const [menuCollapsed, setMenuCollapsed] = useState(false);
    const navigate = useNavigate();

    // Estado para los detalles principales del producto (Paso 1 del formulario)
    const [productData, setProductData] = useState({
        nombreProducto: '',
        descripcion: '',
        categoria: '',
        precio: '',
        marcaProducto: '', // Aseguramos que la marca también está en el estado
    });

    // Estado para gestionar las variaciones del producto (Paso 2 del formulario)
    const [productVariations, setProductVariations] = useState([{
        color: '',
        tallas: '',
        cantidad: '',
        imagenes: [],
    }]);

    // Estado para controlar qué paso del formulario es visible (Paso 1 o Paso 2)
    const [showVariationForm, setShowVariationForm] = useState(false);

    // Ref para el input de archivo de imágenes (ahora en la variación)
    const fileInputRefs = useRef([]);

    const toggleMenu = () => {
        setMenuCollapsed(!menuCollapsed);
    };

    const handleProductChange = (e) => {
        const { name, value } = e.target;
        setProductData({
            ...productData,
            [name]: value,
        });
    };

    const handleImageChange = (e, variationIndex) => {
        const files = Array.from(e.target.files);
        setProductVariations(prevVariations => prevVariations.map((variation, i) => {
            if (i === variationIndex) {
                return {
                    ...variation,
                    imagenes: [...variation.imagenes, ...files]
                };
            }
            return variation;
        }));
    };

    const handleRemoveImage = (variationIndex, imageIndexToRemove) => {
        setProductVariations(prevVariations => prevVariations.map((variation, i) => {
            if (i === variationIndex) {
                return {
                    ...variation,
                    imagenes: variation.imagenes.filter((_, idx) => idx !== imageIndexToRemove)
                };
            }
            return variation;
        }));
    };

    const handleVariationChange = (e, index) => {
        const { name, value } = e.target;
        const updatedVariations = productVariations.map((variation, i) =>
            i === index ? { ...variation, [name]: value } : variation
        );
        setProductVariations(updatedVariations);
    };

    const handleAddVariationRow = () => {
        setProductVariations([...productVariations, {
            color: '',
            tallas: '',
            cantidad: '',
            imagenes: [],
        }]);
    };

    const handleRemoveVariationRow = (indexToRemove) => {
        if (productVariations.length > 1) {
            setProductVariations(productVariations.filter((_, index) => index !== indexToRemove));
        } else {
            alert("Debe haber al menos una variación de producto.");
        }
    };

    const handleProceedToVariations = (e) => {
        e.preventDefault();

        if (!productData.nombreProducto || !productData.descripcion || !productData.categoria || !productData.precio || !productData.marcaProducto) {
            alert('Por favor, ingresa el nombre del producto, la descripción, la categoría, el precio y la marca antes de continuar.');
            return;
        }

        setShowVariationForm(true);
    };

    const handleSubmitCompleteProduct = (e) => {
        e.preventDefault();

        if (!productData.nombreProducto || !productData.descripcion || !productData.categoria || !productData.precio || !productData.marcaProducto) {
            alert('Por favor, ingresa la información principal del producto.');
            setShowVariationForm(false);
            return;
        }

        const areAllVariationsValid = productVariations.every(variation =>
            variation.color && variation.tallas && variation.cantidad && variation.imagenes.length > 0
        );

        if (!areAllVariationsValid) {
            alert('Por favor, asegúrate de que todas las variaciones tengan color, talla, cantidad y al menos una imagen.');
            return;
        }

        const finalProductData = {
            ...productData,
            variations: productVariations.map(variation => ({
                ...variation,
                imagenes: variation.imagenes.map(file => file.name),
            })),
        };

        console.log('Datos completos del producto a guardar:', finalProductData);
        alert('Producto guardado exitosamente!');

        setTimeout(() => {
            navigate('/productos');
        }, 1000);

        setProductData({
            nombreProducto: '',
            descripcion: '',
            categoria: '',
            precio: '',
            marcaProducto: '',
        });
        setProductVariations([{
            color: '',
            tallas: '',
            cantidad: '',
            imagenes: [],
        }]);
        setShowVariationForm(false);
    };

    return (
        <div className="role-form-container">
            <Nav menuCollapsed={menuCollapsed} toggleMenu={toggleMenu} />

            <div className={`formulario-rol-main-content-area ${menuCollapsed ? 'expanded-margin' : ''}`}>

                <div className="formulario-roles">
                    <h1 className="form-title">Registro de Productos</h1>
                    <p className="form-info">
                        Primero ingresa la información principal del producto y al darle click en <strong>Añadir Detalles +</strong>, ingresa los detalles y variaciones de cada producto🛍️.</p>

                    {/* --- Formulario de Detalles Principales del Producto (Paso 1) --- */}
                    <form onSubmit={handleProceedToVariations} className="role-form">
                        <h2 className="form-subtitle"><br />Información Principal del Producto</h2>
                        <div className="form-group">
                            <label htmlFor="nombreProducto" className="label-heading">Nombre del Producto:<span className="required-asterisk">*</span></label>
                            <input
                                type="text"
                                id="nombreProducto"
                                name="nombreProducto"
                                placeholder="Nombre del Producto"
                                value={productData.nombreProducto}
                                onChange={handleProductChange}
                                required
                                className="input-field"
                            />
                        </div>

                        <div className="form-group">
                            <label htmlFor="descripcion" className="label-heading">Descripción:<span className="required-asterisk">*</span></label>
                            <textarea
                                id="descripcion"
                                name="descripcion"
                                placeholder="Descripción detallada"
                                value={productData.descripcion}
                                onChange={handleProductChange}
                                required
                                className="input-field input-field-categoria-producto"
                            ></textarea>
                        </div>

                        {/* CATEGORÍA */}
                        <div className="form-group">
                            <label htmlFor="categoria-principal" className="label-heading">Categoría: <span className="required-asterisk">*</span></label>
                            <select
                                id="categoria-principal"
                                name="categoria"
                                value={productData.categoria}
                                onChange={handleProductChange}
                                required
                                className="barrio-select"
                            >
                                <option value="">Selecciona una categoría</option>
                                <option value="femenina">Femenina</option>
                                <option value="ninos">Niños</option>
                            </select>
                        </div>

                        {/* PRECIO */}
                        <div className="form-group">
                            <label htmlFor="precio-principal" className="label-heading">Precio: <span className="required-asterisk">*</span></label>
                            <input
                                type="number"
                                id="precio-principal"
                                name="precio"
                                placeholder="Precio base del producto"
                                value={productData.precio}
                                onChange={handleProductChange}
                                required
                                className="input-field"
                            />
                        </div>

                        {/* MARCA */}
                        <div className="form-group">
                            <label htmlFor="marcaProducto" className="label-heading">Marca del Producto:<span className="required-asterisk">*</span></label>
                            <input
                                type="text"
                                id="marcaProducto"
                                name="marcaProducto"
                                placeholder="Marca del Producto"
                                value={productData.marcaProducto}
                                onChange={handleProductChange}
                                required
                                className="input-field"
                            />
                        </div>

                        <div className="form-buttons-row">
                            {!showVariationForm && (
                                <button type="button" className="cancel-button" onClick={() => navigate(-1)}>
                                    Cancelar
                                </button>
                            )}
                            <button type="submit" className="save-button-producto">
                                Añadir Detalles +
                            </button>


                        </div>
                    </form>

                    {/* --- Formulario de Variaciones del Producto (Se despliega aquí) --- */}
                    {showVariationForm && (
                        <form onSubmit={handleSubmitCompleteProduct} className="role-form">
                            <hr style={{ margin: '40px 0', borderTop: '1px solid #ccc' }} />
                            <h2 className="form-subtitle"><br />Detalles y Variaciones del Producto</h2>
                            <p className="form-info">Añade los detalles de cada variación del producto (color, talla, cantidad e imágenes).</p>

                            {productVariations.map((variation, index) => (
                                <div key={index} className="variation-row">
                                    <h3>Variación #{index + 1}</h3>
                                    <div className="variation-fields-row">
                                        <div className="form-group">
                                            <label htmlFor={`color-${index}`} className="label-heading">Color <span className="required-asterisk">*</span></label>
                                            <input
                                                type="text"
                                                id={`color-${index}`}
                                                name="color"
                                                placeholder="Color*"
                                                value={variation.color}
                                                onChange={(e) => handleVariationChange(e, index)}
                                                required
                                                className="input-field"
                                            />
                                        </div>

                                        <div className="form-group">
                                            <label htmlFor={`tallas-${index}`} className="label-heading">Talla<span className="required-asterisk">*</span></label>
                                            <select
                                                id={`tallas-${index}`}
                                                name="tallas"
                                                value={variation.tallas}
                                                onChange={(e) => handleVariationChange(e, index)}
                                                required
                                                className="input-field"
                                            >
                                                <option value="">Seleccionar</option>
                                                <option value="XS">XS</option>
                                                <option value="S">S</option>
                                                <option value="M">M</option>
                                                <option value="L">L</option>
                                                <option value="XL">XL</option>
                                            </select>
                                        </div>

                                        <div className="form-group">
                                            <label htmlFor={`cantidad-${index}`} className="label-heading">Cantidad<span className="required-asterisk">*</span></label>
                                            <input
                                                type="number"
                                                id={`cantidad-${index}`}
                                                name="cantidad"
                                                placeholder="Cantidad *"
                                                value={variation.cantidad}
                                                onChange={(e) => handleVariationChange(e, index)}
                                                required
                                                className="input-field"
                                            />
                                        </div>
                                    </div>

                                    <div className="form-group">
                                        <label className="label-heading">Imágenes del producto <span className="required-asterisk">*</span></label>
                                        <input
                                            type="file"
                                            ref={el => fileInputRefs.current[index] = el}
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
                                            Seleccionar Archivos de Imagen
                                        </button>
                                        <div className="image-preview-container">
                                            {variation.imagenes.length === 0 && <p className="no-images-text">No hay imágenes seleccionadas para esta variación.</p>}
                                            {variation.imagenes.map((file, imgIndex) => (
                                                <div key={imgIndex} className="image-preview-item">
                                                    <img
                                                        src={URL.createObjectURL(file)}
                                                        alt={`Previsualización ${file.name}`}
                                                        className="product-thumbnail"
                                                        onLoad={() => URL.revokeObjectURL(file.name)}
                                                    />
                                                    <span className="image-name">{file.name}</span>
                                                    <button
                                                        type="button"
                                                        onClick={() => handleRemoveImage(index, imgIndex)}
                                                        className="remove-image-button"
                                                        aria-label={`Eliminar imagen ${file.name}`}
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
                                            Eliminar Variación x
                                        </button>
                                    )}
                                    <hr className="variation-divider" />
                                </div>
                            ))}

                            <button type="button" onClick={handleAddVariationRow} className="save-button-producto">
                                Añadir Otra Variación +
                            </button><br /><br /><br />
                            <button type="button" className="cancel-button" onClick={() => navigate(-1)}>
                                Cancelar
                            </button>
                            <div className="form-actions">
                                <button type="submit" className="save-button">
                                    Guardar Producto
                                </button>

                            </div>
                        </form>
                    )}
                </div>
            </div>
        </div>
    );
}

export default FormAddProducts;