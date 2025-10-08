import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { getProducts } from '../api/productsService';
import './FeaturedProducts.css';
import { FaStore } from 'react-icons/fa';

const FeaturedProducts = () => {
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
    // agrega más colores según tu API
};
    const [products, setProducts] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        const fetchProducts = async () => {
            try {
                const data = await getProducts();
                // Filtramos solo productos activos
                const activos = data.filter(p => p.estado_Producto);
                // Tomamos los primeros 8 como destacados
                setProducts(activos.slice(0, 8));
            } catch (err) {
                console.error("Failed to fetch featured products:", err);
                setError("No se pudieron cargar los productos destacados.");
            } finally {
                setLoading(false);
            }
        };
        fetchProducts();
    }, []);

    if (loading) return <div className="loading-container-home">Cargando productos destacados...</div>;

    return (
        <section className="featured-products-section">
            <h4 className="section-title-home">PRENDAS DESTACADAS</h4>
            <p className='section-subtitle'>
                Descubre muchas prendas con diversos estilos, colores y tallas en nuestra tienda <FaStore/>. 
            </p>

            <div className="product-list-container">
                {products.length > 0 ? (
                    products.map(product => (
                        <div key={product.id_Producto} className="product-card">
                            <img
                                src={
                                    product.detalles[0].imagenes.length > 0
                                    ? product.detalles[0].imagenes[0].url_Imagen
                                    : 'https://via.placeholder.com/250x250.png?text=Sin+imagen'
                                }
                                alt={product.nombre_Producto}
                                className="product-image"
                            />
                            <div className="product-info">
                                <h3 className="product-name">{product.nombre_Producto}</h3>
                                <p className="product-price">COP {product.precio.toLocaleString()}$</p>

                                {/* Stock */}
                                <p className="product-stock">
                                    {product.stock_Total > 0 ? 'Disponible' : 'Agotado'}
                                </p>

                                {/* Tallas */}
                                <div className="product-sizes">
                                    {product.detalles.map(det => (
                                        <span key={det.id_Detalle_Producto}>{det.talla}</span>
                                    ))}
                                </div>

                                {/* Paleta de colores */}
                             <div className="product-colors">
                                    {product.detalles.map(det => (
                                        <span
                                            key={det.id_Detalle_Producto}
                                            className="color-dot"
                                            style={{
                                                backgroundColor: colorMap[det.color] || '#ccc'
                                            }}
                                            title={det.color}
                                        ></span>
                                    ))}
                                </div>

                                {/* Botones */}
                                <div className="product-buttons">
                                    <Link to={`/productos/${product.id_Producto}`} className="details-button">Ver más</Link>
                                    <button className="add-to-cart-button"> 🛒</button>
                                </div>
                            </div>
                        </div>
                    ))
                ) : (
                    <div className="no-products-message">No hay productos destacados para mostrar.</div>
                )}
            </div>

            <div className="view-all-button-container">
                <Link to="/productos" className="view-all-button">Ver todo el catálogo</Link>
            </div>
        </section>
    );
};

export default FeaturedProducts;
