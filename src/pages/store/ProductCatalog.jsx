import React, { useState, useEffect, useMemo } from 'react';
import { Link } from 'react-router-dom';
import { getProducts } from '../../api/productsService';
import { getColores } from '../../api/colorsService';
import './StorePage.css';
import {
    FaSearch, FaRedo, FaShoppingCart, FaRulerVertical,
    FaPalette,
    FaBoxes,
    FaTag
} from 'react-icons/fa';

// Reutilizamos colorMap (borrar)
const colorMap = {
    Azul: '#1E90FF',
    Negro: '#000000',
    Blanco: '#FFFFFF',
    Beige: '#F5F5DC',
    Rosado: '#FF69B4',
    Rojo: '#FF0000',
    Verde: '#28A745',
    Amarillo: '#FFD700',
    Gris: '#808080',
    Marron: '#A52A2A',
};

const ProductCatalog = () => {
    // 1. Estados iniciales y de datos 
    const [allProducts, setAllProducts] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    // 2. Estados para los filtros 
    const [searchTerm, setSearchTerm] = useState('');
    const [selectedCategory, setSelectedCategory] = useState('');
    const [selectedSize, setSelectedSize] = useState('');
    const [selectedColor, setSelectedColor] = useState('');
    const [colorData, setColorData] = useState([]);

    // useEffect para cargar los datos de Color 
    useEffect(() => {
        const fetchColors = async () => {
            try {

                const colors = await getColores();
                setColorData(colors);
            } catch (err) {
                console.error("Fallo al cargar datos de colores:", err);
            }
        };
        fetchColors();
    }, []);

    useEffect(() => {
        const fetchAllProducts = async () => {
            try {
                const data = await getProducts();
                const activos = data.filter(p => p.estado_Producto);
                console.log("Productos (muestra):", activos.slice(0, 2));
                console.log("Categorías extraídas:", activos.map(p => p.categoria_Producto));
                setAllProducts(activos);
            } catch (err) {
                console.error("Failed to fetch all products:", err);
                setError("No se pudieron cargar los productos de la tienda.");
            } finally {
                setLoading(false);
            }
        };
        fetchAllProducts();
    }, []);

    // 3. Lógica de Filtrado
    const filteredProducts = useMemo(() => {
        let currentProducts = allProducts;
        // ... (Lógica de filtrado)
        if (searchTerm) {
            currentProducts = currentProducts.filter(product =>
                product.nombre_Producto.toLowerCase().includes(searchTerm.toLowerCase())
            );
        }
        if (selectedCategory) {
            currentProducts = currentProducts.filter(product =>
                product.nombre_Categoria.toLowerCase() === selectedCategory.toLowerCase()
            );
        }
        if (selectedSize || selectedColor) {
            currentProducts = currentProducts.filter(product => {
                return product.detalles.some(det => {
                    const tallaMatch = !selectedSize || det.talla === selectedSize;
                    const colorMatch = !selectedColor || det.color === selectedColor;
                    return tallaMatch && colorMatch;
                });
            });
        }
        return currentProducts;
    }, [allProducts, searchTerm, selectedCategory, selectedSize, selectedColor]);

    // 4. Extracción de Opciones Únicas
    const uniqueCategories = [...new Set(allProducts.map(p => p.nombre_Categoria))];
    const uniqueSizes = [...new Set(allProducts.flatMap(p => p.detalles.map(d => d.talla)))];
    const uniqueColors = [...new Set(allProducts.flatMap(p => p.detalles.map(d => d.color)))];

    // Función para resetear todos los filtros
    const resetFilters = () => {
        setSearchTerm('');
        setSelectedCategory('');
        setSelectedSize('');
        setSelectedColor('');
    };
    const colorHexMap = useMemo(() => {
        return colorData.reduce((acc, color) => {
            // Mapea el nombre del color a su valor HEX
            acc[color.nombre_Color] = color.hex_color;
            return acc;
        }, {});
    }, [colorData]);

    if (loading) return <div className="catalog-loading-box">Cargando catálogo completo...</div>;
    if (error) return <div className="catalog-error-box">{error}</div>;

    return (
        <div className="catalog-main-wrapper">

            {/* BUSCADOR Y FILTROS */}
            <div className="catalog-filter-bar">
                {/* 1. Búsqueda por Nombre */}
                <div className="catalog-filter-group catalog-search-input">
                    <FaSearch className="catalog-search-icon" />
                    <input
                        type="text"
                        placeholder="Buscar por nombre..."
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                    />
                </div>

                {/* 2. Filtro por Categoría */}
                <div className="catalog-filter-group">
                    <select
                        value={selectedCategory}
                        onChange={(e) => setSelectedCategory(e.target.value)}
                    >
                        <option value="">Categoría</option>
                        {uniqueCategories.map(cat => (
                            <option key={cat} value={cat}>{cat}</option>
                        ))}
                    </select>
                </div>

                {/* 3. Filtro por Talla */}
                <div className="catalog-filter-group">
                    <select
                        value={selectedSize}
                        onChange={(e) => setSelectedSize(e.target.value)}
                    >
                        <option value=""> Talla</option>
                        {uniqueSizes.sort().map(size => (
                            <option key={size} value={size}>{size}</option>
                        ))}
                    </select>
                </div>

                {/* 4. Filtro por Color */}
                <div className="catalog-filter-group">
                    <select
                        value={selectedColor}
                        onChange={(e) => setSelectedColor(e.target.value)}
                    >
                        <option value="">Color</option>
                        {uniqueColors.map(color => (
                            <option key={color} value={color}>{color}</option>
                        ))}
                    </select>
                </div>
                <div className="catalog-action-buttons">
                    <Link to="/carrito" className="catalog-cart-btn">
                        <FaShoppingCart /> Carrito
                    </Link>

                    {/* Botón Resetear Filtros */}
                    <button className="catalog-reset-btn" onClick={resetFilters}><FaRedo /> Resetear Filtros</button>
                </div>
            </div>

            <p className="catalog-results-count">
                {/* Mostrando **{filteredProducts.length}** de {allProducts.length} productos */} {/*Muestra la cantidad de productos */}
            </p>

            {/* LISTA DE PRODUCTOS FILTRADOS */}
            <div className="catalog-list-grid">
                {filteredProducts.length > 0 ? (
                    filteredProducts.map(product => (
                        <div key={product.id_Producto} className="catalog-product-card">
                            {/* CÓDIGO DE TARJETA DE PRODUCTO */}
                            <img
                                src={
                                    product.detalles[0].imagenes.length > 0
                                        ? product.detalles[0].imagenes[0].url_Imagen
                                        : 'https://via.placeholder.com/250x250.png?text=Sin+imagen'
                                }
                                alt={product.nombre_Producto}
                                className="catalog-product-img"
                            />
                            <div className="catalog-product-details">
                                <h3 className="catalog-product-name"> < FaTag size={15} color="#c89b3c"/> {product.nombre_Producto}</h3>
                                <p className="catalog-product-price">COP {product.precio.toLocaleString()}</p>

                                {/* 1. Muestra la disponibilidad (igual) */}
                                <p className="catalog-product-stock">
                                    {product.stock_Total > 0 ? 'Disponible' : 'Agotado '}
                                </p>

                                {/* Muestra la cantidad total de stock */}
                                {product.stock_Total > 0 && (
                                    <p className="catalog-total-stock">
                                        Cantidad: {product.stock_Total} unidades
                                    </p>
                                )}

                                {/* Tallas Únicas */}
                                <div className="catalog-size-options">
                                    {[...new Set(product.detalles.map(det => det.talla))].map(talla => (
                                        <span key={talla} className="catalog-size-tag">Talla: {talla}</span>
                                    ))}
                                </div>
                                <div className="catalog-color-palette">
                                    {[...new Set(product.detalles.map(det => det.color))].map(colorName => (
                                        <span
                                            key={colorName}
                                            className="catalog-color-dot"
                                            style={{
                                                //  Buscar el HEX por el nombre del color
                                                backgroundColor: colorHexMap[colorName] || '#ccc'
                                            }}
                                            title={colorName}
                                        ></span>
                                    ))}
                                </div>

                                {/* Botones */}
                                <div className="catalog-card-actions">
                                    <Link to={`/productos/${product.id_Producto}`} className="catalog-details-link">Ver más</Link>
                                    <button className="catalog-add-cart-btn"> <FaShoppingCart /></button>
                                </div>
                            </div>
                        </div>
                    ))
                ) : (
                    <div className="catalog-no-results">
                        No se encontraron productos que coincidan con los filtros.
                    </div>
                )}
            </div>
        </div>
    );
};

export default ProductCatalog;