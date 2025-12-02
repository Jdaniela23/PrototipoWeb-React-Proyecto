import React from 'react';
import './Categoria.css';
import ImagenFemenina1 from '../assets/img/cfemenina.jpeg'; 
import ImagenFemenina2 from '../assets/img/cfemenina2.jpeg'; 
import ImagenNinos1 from '../assets/img/cniños.jpeg'; 
import ImagenNinos2 from '../assets/img/cniños2.jpeg'; 

function CategoriaComponent() {
    return (
        <div className="contenedor-cards-categorias">
            
            {/* CARD 1: */}
            <div className="categoria-card negro-estilo">
                
                {/* Contenedor que se deslizará (width: 200% en CSS) */}
                <div className="card-imagenes-carrusel"> 
                    <div 
                        className="card-imagen-carrusel-item" 
                        style={{ backgroundImage: `url(${ImagenFemenina1})` }}
                    >
                        <h2 className="card-titulo-overlay blanco">CATEGORÍA FEMENINA</h2>
                    </div>
                    <div 
                        className="card-imagen-carrusel-item" 
                        style={{ backgroundImage: `url(${ImagenFemenina2})` }}
                    >
                        <h2 className="card-titulo-overlay blanco">LO MEJOR AQUÍ!</h2> 
                    </div>

                </div>
                <div className="card-contenido">
                    <h2 className="card-titulo">ROPA QUE TE HACE SENTIR SEGURA Y RADIANTE ✨</h2>
                    <p className="card-descripcion">
                        Descubre más de nuestras prendas para mujeres que se atreven a ser diferentes. Desde 
                        vestidos elegantes hasta conjuntos casuales, tenemos todo lo que necesitas para expresar
                        tu estilo y personalidad.
                    </p>
                </div>
            </div>

            {/* CARD 2 */}
            <div className="categoria-card dorado-estilo">
                <div className="card-imagenes-carrusel"> 
                    <div 
                        className="card-imagen-carrusel-item" 
                        style={{ backgroundImage: `url(${ImagenNinos1})` }}
                    >
                        <h2 className="card-titulo-overlay blanco">CATEGORÍA DE NIÑOS</h2>
                    </div>
                    <div 
                        className="card-imagen-carrusel-item" 
                        style={{ backgroundImage: `url(${ImagenNinos2})` }}
                    >
                    </div>

                </div>
                <div className="card-contenido">
                    <h2 className="card-titulo">PEQUEÑOS ESTILOS ✌🏻</h2>
                    <p className="card-descripcion">
                        Nuestras prendas para niños y niñas son diseñadas para que se sientan cómidos y felices.
                        Desde ropa de calle hasta pijamas, tenemos todo lo que necesitas para vestir a tus pequeños
                        con estilo y personalidad.
                    </p>
                </div>
            </div>

        </div>
    );
}

export default CategoriaComponent;