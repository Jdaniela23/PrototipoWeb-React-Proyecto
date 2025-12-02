import React from 'react';
import ProductCatalog from '../pages/store/ProductCatalog';
import Imagen2 from '../assets/img/carruselstore2.jpeg';
import Imagen3 from '../assets/img/Prueba.jpeg';
import Imagen1 from '../assets/img/carruselstore3.jpeg';
import "react-responsive-carousel/lib/styles/carousel.min.css";
import { Carousel } from "react-responsive-carousel";
import './ProductsShop.css';
import Footer from '../components/Footer';
import NavHome from '../components/Navhome';

export default function ProductsShop() {
  return (

    <div className='container-shop'>
      <NavHome/>
      <div className='catalogo-carrusel'>
        <div className='carrusel-store'>
          <section className="grid md:grid-cols-2 gap-6 items-center py-16 px-8 max-w-6xl mx-auto">
            <Carousel autoPlay interval={4000} infiniteLoop showArrows={false} showThumbs={false} showStatus={false}>
              <div className='imagen-catalogo'>
                <img className='imagen-store' src={Imagen2} alt="" />
                <div class="slide-text-catalogo"><h2>SHOP</h2></div>
              </div>
              {/* resto del carrusel... */}
              <div>
                <img className='imagen-store' src={Imagen1} alt="" />
                <div class="slide-text-catalogo"><h2>SHOP</h2></div>
              </div>

              <div>
                <img className='imagen-store' src={Imagen3} alt="" />
                <div class="slide-text-catalogo"><h2>SHOP</h2></div>
              </div>

            </Carousel>
          </section>
        </div>
        <div className='catalago-shop'>
          <ProductCatalog />
        </div>
      </div>
      <Footer />
    </div>




  );
}; 