import LogoUno from '../assets/img/Logo.png';
import './HomePage.css';
import { Link } from 'react-router-dom';
import { FaShoppingCart, FaUserCircle, FaUsers} from 'react-icons/fa';
import Footer from '../components/Footer';
import VideoHome from '../assets/Videos/VideoHome.mp4';
import FeaturedProducts from '../components/FeaturedProducts';



function Home() {
    return (
        <div className="container-home">
            <div className="nav-home">
            <div className="container-titulo">
                <img src={LogoUno} className="logo-home" alt="Logo de Home" /> <strong className="Titulo-home">  JULIETA STREAMLINE</strong>
            </div>
            <div className="botones-home">
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
            <div className="container-welcome">
                <p className="titulo-secundario">BIENVENIDO A</p>
                <strong className='titulo-h1'>JULIETA</strong>
                <p className="parrafo-principal-home">Julieta es una tienda online de ropa, un lugar que ofrece<br />
                    una amplia selección de estilos donde encontraras <br />prendas femeninas con muchos estilos
                    arternativos <br /> y una categoría hecha para los niños <span className='span-home'>"mylittlejulieta" </span>.</p>

                <p className='parrafo-segundo-home'>Registrare y conoce más acerca de nosotros y de los <br />
                    productos disponibles, ofrecemos tallas para todas las <br />
                    edades  y estilos para todos los
                    gustos que solo <br />encontraras en nuestra tienda. </p>

                    <p className='parrafo-tercero-home'>
                        Todo lo encuentras en Julieta Streamline disfruta <br/>
                        de la variedad y confianza al comprar solamente <br/>
                        aquí, Inicia sesión y mira todos nuestros productos <br/>
                        que te encantaran. 🫶🏻
                    </p>


                {/*Imagen del home */}
                {/* <img src={ImagenHome} className="imagenHome" />*/}
                <div className="VideoHome">
                    <video autoPlay loop muted className='video'>
                        <source src={VideoHome} type="video/mp4" />
                        Tu navegador no soporta la etiqueta de video.
                    </video>
                </div>
            </div>
           <hr/>
             <div className="sección-products-home">
                <FeaturedProducts/>
             </div>
          
            <Footer />
        </div>
    );
}

export default Home; 