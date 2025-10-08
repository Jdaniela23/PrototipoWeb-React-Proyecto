import './quienessomos.css';
import Footer from '../components/Footer';
import Imagen1 from '../assets/img/quienessomos1.jpg';
import Imagen2 from '../assets/img/quienessomos2.jpg';
import Imagen3 from '../assets/img/quienessomos3.jpg';
import ImagenCarrusel1 from '../assets/img/quienessomos4.jpg';
import ImagenCarrusel2 from '../assets/img/quienessomos5.jpg';
import { Link } from 'react-router-dom';
import LogoUno from '../assets/img/Logo.png';
import { FaShoppingCart, FaUserCircle, FaUsers, FaHome } from 'react-icons/fa';
import "react-responsive-carousel/lib/styles/carousel.min.css";
import { Carousel } from 'react-responsive-carousel';



export default function About() {
  return (
    <div className="about-page font-sans text-gray-800">
    <div className="nav-home">
      <div className="container-titulo">
        <img src={LogoUno} className="logo-home" alt="Logo de Home" /> <strong className="Titulo-home"> JULIETA STREAMLINE</strong>
      </div>
      <div className="botones-home">
        <Link to="/"  className="enlace-con-icono" >Inicio <FaHome /></Link>
        <Link to="/quienessomos" className="enlace-con-icono">
          <span>Quienes Somos</span> <FaUsers />
        </Link>
        <Link to="/login" className="enlace-con-icono">
          <span>Productos Shop</span> <FaShoppingCart />
        </Link>
        <Link to="/login" className="enlace-con-icono">
          <span>Iniciar sesión | Crear Cuenta</span> <FaUserCircle />
        </Link>
      </div>
      </div>

      <section className="grid md:grid-cols-2 gap-6 items-center py-16 px-8 max-w-6xl mx-auto">
        <div className='carrusel-quienes-somos '>
          <Carousel
            showArrows={false}        // Muestra las flechas de navegación
            infiniteLoop={true}      // Bucle infinito
            autoPlay={true}          // Reproducción automática
            interval={5000}          // Cambia de imagen cada 5 segundos (5000ms)
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
            <p className='titulo-cursiva' >𝒮𝑜𝓁𝑜 𝑒𝓃 𝒥𝓊𝓁𝒾𝑒𝓉𝒶𝒮𝓉𝓇𝑒𝒶𝓂𝓁𝒾𝓃𝑒 </p>
          <h2 className="text-2xl font-bold mb-4">Nuestro Equipo</h2>
          <p className="text-lg leading-relaxed">
            Somos un grupo diverso de profesionales con experiencia en
            liderazgo y desarrollo personal. Creemos que cada persona tiene un
            potencial único que merece ser descubierto y potenciado ✨.
          </p>
        </div>
      </section>
      <Footer />
    </div>
  );
}