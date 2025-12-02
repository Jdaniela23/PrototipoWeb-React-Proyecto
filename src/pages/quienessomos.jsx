import './quienessomos.css';
import Footer from '../components/Footer';
import Imagen1 from '../assets/img/quienessomos1.jpg';
import Imagen2 from '../assets/img/quienessomos2.jpg';
import Imagen3 from '../assets/img/quienessomos3.jpg';
import ImagenCarrusel1 from '../assets/img/quienessomos4.jpg';
import ImagenCarrusel2 from '../assets/img/quienessomos5.jpg';
import LogoUno from '../assets/img/Logo.png';
import "react-responsive-carousel/lib/styles/carousel.min.css";
import { Carousel } from 'react-responsive-carousel';
import NavHome from '../components/Navhome';
import { FaMapMarkerAlt } from 'react-icons/fa';

export default function About() {
  const mapIframe = (
    <iframe src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3965.3787135731263!2d-75.55843142602636!3d6.344977925214271!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x8e442fbc109f42f9%3A0x4d15071e9b337015!2sAv.%2048a%20%2361-22%2C%20San%20Andres%2C%20Bello%2C%20Antioquia!5e0!3m2!1ses-419!2sco!4v1764476770178!5m2!1ses-419!2sco" width="600" height="400" style={{ marginLeft: '30%', borderRadius: '5px', borderColor: '  #a87c3fff ' }}  allowfullscreen="" loading="lazy" referrerpolicy="no-referrer-when-downgrade"></iframe>
  );
  return (
    <div className="about-page font-sans text-gray-800">
      <NavHome />
      <section className="grid md:grid-cols-2 gap-6 items-center py-16 px-8 max-w-6xl mx-auto">
        <div className='carrusel-quienes-somos '>
          <Carousel
            showArrows={false}        // Muestra las flechas de navegación
            infiniteLoop={true}      // Bucle infinito
            autoPlay={true}          // Reproducción automática
            interval={2000}          // Cambia de imagen cada 5 segundos (5000ms)
            showThumbs={false}       // Oculta las miniaturas debajo del carrusel
            showStatus={false}       // Oculta el estado 
          >
            <div>
              <img className='imagen-carrusel' src={Imagen1} alt="Quiénes somos 1" />
            </div>
            <div>
              <img className='imagen-carrusel' src={ImagenCarrusel1} alt="Carrusel imagen 2" />
            </div>
            <div>
              <img className='imagen-carrusel' src={ImagenCarrusel2} alt="Carrusel imagen 3" />
            </div>
          </Carousel>
        </div>


        <div className='presentacion-uno'>
          <div className="text-center md:text-left">
            <h1 className="text-tittle">Quiénes Somos</h1>
            <p className="text-quienesomos">
              En <span className="font-semibold">Julieta Streamline</span> creemos en la autenticidad, el
              crecimiento personal 🪄y el poder de inspirar a otros. Nuestro
              equipo está conformado por profesionales apasionados que buscan
              generar un impacto positivo en la vida de cada persona.
            </p>
          </div>
        </div>
      </section>

      {/* Sección 2 */}
      <section className="grid md:grid-cols-2 gap-6 items-center py-16 px-8 max-w-6xl mx-auto">
        <div className="order-2 md:order-1 text-center md:text-left">
          <p className='titulo-cursiva' >𝒞𝑜𝓃𝑜𝒸𝑒𝓃𝑜𝓈</p>
          <h2 className="text-2xl font-bold mb-4">Nuestra Historia</h2>
          <p className="text-lg leading-relaxed">
            Desde nuestros inicios hemos trabajado con la visión 👥 de acompañar a
            individuos y empresas en su camino hacia el éxito. Cada paso que
            damos está guiado por valores de compromiso, confianza y excelencia.
          </p>

          <p className='titulo-quienessomos-valores'>Valores</p>
          <ul class="lista-bonita">
            <li>Transparencia y honestidad en las interacciones</li>
            <li>Integridad en las decisiones</li>
            <li>Responsabilidad de las acciones</li>
            <li>Confianza & Credibilidad</li>
          </ul>
        </div>
        <div >
          <img
            src={Imagen2}
            alt="Historia"
            className="imagenes"
          />
        </div>
      </section>

      {/* Sección 3 */}
      <section className="grid md:grid-cols-2 gap-6 items-center py-16 px-8 max-w-6xl mx-auto">
        <div>
          <img
            src={Imagen3}
            alt="Equipo"
            className="imagenes"
          />
        </div>
        <div className="text-center md:text-left">
          <img src={LogoUno} className="logo-seccion-chico" />
          <p className='titulo-cursiva' >𝒮𝑜𝓁𝑜 𝑒𝓃 𝒥𝓊𝓁𝒾𝑒𝓉𝒶𝒮𝓉𝓇𝑒𝒶𝓂𝓁𝒾𝓃𝑒</p>
          <h2 className="text-2xl font-bold mb-4">Nuestro Equipo</h2>
          <p className="text-lg leading-relaxed">
            Somos un grupo diverso de profesionales con experiencia en
            liderazgo y desarrollo personal. Creemos que cada persona tiene un
            potencial único que merece ser descubierto y potenciado ✨.
          </p>
        </div>

      </section>
      <div className="map-container">
        <h2 className='titulo-map'>Donde estamos ubicados <FaMapMarkerAlt  style={{color: '  #a87c3fff ' }} /> </h2>
        <p className='subtitulo-cursiva'>𝓥𝓲𝓼𝓲𝓽𝓪𝓷𝓸𝓼, 𝓽𝓮 𝓮𝓼𝓹𝓮𝓻𝓪𝓶𝓸𝓼.</p>
        {mapIframe}
      </div>
      <Footer />
    </div>
  );
}