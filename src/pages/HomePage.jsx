import LogoUno from '../assets/Logo.png';
import './HomePage.css';
import { Link } from 'react-router-dom';
import ImagenHome from '../assets/imagenHome.png';
import Footer from '../components/Footer';
import VideoHome from '../assets/Videos/VideoHome.mp4';



function Home() {
    return (
        <div className="container-home">
            <div className="container-titulo">
                <img src={LogoUno} className="logo-home" alt="Logo de Home" /> <strong className="Titulo-home">  JULIETA STREAMLINE</strong>
            </div>
            <div className="botones-home">
                <Link to="/login" >Iniciar sesión 👩🏻‍💻</Link>
                <Link to="/crearcuenta" >Crear Cuenta </Link>
            </div>
            <div className="container-welcome">
                <p className="titulo-secundario">BIENVENIDO A</p>
                <strong className='titulo-h1'>JULIETA</strong>
                <p className="parrafo-principal-home">Julieta es una tienda online de ropa, un lugar que ofrece<br />
                    una amplia selección de estilos donde encontraras <br />prendas femeninas con muchos estilos
                    arternativos <br /> y una categoría hecha para los niños "mylittlejulieta".</p>


                {/*Imagen del home */}
                {/* <img src={ImagenHome} className="imagenHome" />*/}
                <div className="VideoHome"> 
                    <video  autoPlay loop muted className='video'>
                        <source src={VideoHome} type="video/mp4" />
                        Tu navegador no soporta la etiqueta de video.
                    </video>
                </div>
            </div>
            <Footer />
        </div>
    );
}

export default Home; 