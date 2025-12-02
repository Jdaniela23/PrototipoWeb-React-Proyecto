import React, { useState, useEffect } from 'react';
import NavAdmin from '../../components/Nav.jsx';
import NavCustomer from '../../components/customer/Nav.jsx';
import TopBar from '../../components/customer/TopBar';
import { getMyProfile } from '../../api/authService';
import Imagen2 from '../../assets/img/carruselstore2.jpeg';
import Imagen3 from '../../assets/img/Prueba.jpeg';
import Imagen1 from '../../assets/img/carruselstore3.jpeg';
import "react-responsive-carousel/lib/styles/carousel.min.css";
import { Carousel } from "react-responsive-carousel";
import './Store.css';
import ProductCatalog from './ProductCatalog.jsx';

const Store = () => {
    const [menuCollapsed, setMenuCollapsed] = useState(false);
    const [profile, setProfile] = useState(null);

    const role = localStorage.getItem("userRole"); 

    const toggleMenu = () => setMenuCollapsed(!menuCollapsed);

    useEffect(() => {
        const fetchProfile = async () => {
            try {
                const data = await getMyProfile();
                setProfile(data);
            } catch (error) {
                console.error("Error cargando perfil:", error);
            }
        };
        fetchProfile();
    }, []);

    const nombreUsuario = profile?.nombreUsuario || "Cliente";
    const foto = profile?.foto || null;

    return (
        <div className="app-container size-a">

            {/* <-- NAV DINÁMICO */}
            {role === "Administrador" ? (
                <NavAdmin menuCollapsed={menuCollapsed} toggleMenu={toggleMenu} />
            ) : (
                <NavCustomer menuCollapsed={menuCollapsed} toggleMenu={toggleMenu} />
            )}

           <div className={`dashboard-container ${menuCollapsed ? 'admin-expanded-margin' : ''}`}>
    <TopBar
        userName={nombreUsuario}
        foto={foto}
        className={menuCollapsed ? 'collapsed-sidebar-customer' : ''}
    />

    <div 
        className="container-store"
        style={{
            marginLeft: role === "Administrador" 
                ? (menuCollapsed ? '-35%' : '-40%')
                : (menuCollapsed ? '-40%' : '-40%')
        }}
    >
        <div className='carrusel-store'>
            <section className="grid md:grid-cols-2 gap-6 items-center py-16 px-8 max-w-6xl mx-auto">
                <Carousel autoPlay interval={4000} infiniteLoop showArrows={false} showThumbs={false} showStatus={false}>
                    <div>
                        <img className='imagen-store' src={Imagen2} alt="" />
                        <div class="slide-text"><h2>SHOP</h2></div>
                    </div>
                    {/* resto del carrusel... */}
                                <div>
                                    <img className='imagen-store' src={Imagen1} alt="" />
                                    <div class="slide-text"><h2>SHOP</h2></div>
                                </div>

                                <div>
                                    <img className='imagen-store' src={Imagen3} alt="" />
                                    <div class="slide-text"><h2>SHOP</h2></div>
                                </div>
                            </Carousel>
                        </section>
                    </div>
                </div>

                {/* Catalogo */}
                <ProductCatalog />

            </div>
        </div>
    );
};

export default Store;
