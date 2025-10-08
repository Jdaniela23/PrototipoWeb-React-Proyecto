import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import Nav from '../components/Nav.jsx';
import TopBar from '../components/customer/TopBar';
import Chart from 'react-apexcharts';
import './Dashboard.css';
import { getCompras } from "../api/comprasService.js";
import { getPedidos } from "../api/pedidosService.js";
import { getMyProfile } from "../api/authService"; // Traer perfil admin

const Dashboard = () => {
    const [isLoading, setIsLoading] = useState(true);
    const [menuCollapsed, setMenuCollapsed] = useState(false);

    // Perfil admin
    const [profile, setProfile] = useState(null);

    // Datos de la API
    const [comprasData, setComprasData] = useState([]);
    const [pedidosData, setPedidosData] = useState([]);
    const [ventasPorMes, setVentasPorMes] = useState([]);
    const [ventasProyectadas, setVentasProyectadas] = useState([]);
    const [costoPorCategoria, setCostoPorCategoria] = useState({});
    const [ventasPorCategoria, setVentasPorCategoria] = useState({});
    const [costoProyectado, setCostoProyectado] = useState({});
    const [ventasProyectadasCategoria, setVentasProyectadasCategoria] = useState({});

    const navigate = useNavigate();

    // --- Cargar perfil y datos ---
    useEffect(() => {
        const fetchData = async () => {
            try {
                const profileData = await getMyProfile();
                setProfile(profileData);

                const [compras, pedidos] = await Promise.all([getCompras(), getPedidos()]);
                setComprasData(compras);
                setPedidosData(pedidos);
                procesarDatos(compras, pedidos);
            } catch (error) {
                console.error("Error al cargar datos:", error);
            } finally {
                setIsLoading(false);
            }
        };

        fetchData();
    }, []);

    const procesarDatos = (compras, pedidos) => {
        const pedidosFinalizados = pedidos.filter(p => p.estado_Pedido === 'Completado');
        const pedidosActivos = pedidos.filter(p => p.estado_Pedido !== 'Cancelado');

        setVentasPorMes(calcularVentasPorMes(pedidosFinalizados));
        setVentasProyectadas(calcularVentasPorMes(pedidosActivos));

        setCostoPorCategoria(calcularCostosPorCategoria(compras));
        setVentasPorCategoria(calcularVentasPorCategoria(pedidosFinalizados));
        setVentasProyectadasCategoria(calcularVentasPorCategoria(pedidosActivos));
        setCostoProyectado(calcularCostosPorCategoria(compras));
    };

    const calcularVentasPorMes = (pedidos) => {
        const meses = Array(12).fill(0);
        pedidos.forEach(p => {
            const fecha = new Date(p.fecha_Creacion);
            meses[fecha.getMonth()] += p.total_Pedido;
        });
        return meses;
    };

    const calcularCostosPorCategoria = (compras) => {
        const costos = {};
        compras.forEach(c => {
            if (c.estado === 'Activo') {
                const categoria = c.proveedor?.nombre || 'Sin categoría';
                costos[categoria] = (costos[categoria] || 0) + c.total;
            }
        });
        return costos;
    };

    const calcularVentasPorCategoria = (pedidos) => {
        const ventas = {};
        pedidos.forEach(p => {
            p.detalle_Pedidos?.forEach(d => {
                const nombre = d.detalle_Producto?.producto?.nombre_Producto || 'Sin nombre';
                ventas[nombre] = (ventas[nombre] || 0) + d.subtotal;
            });
        });
        return ventas;
    };

    const calcularTotales = (obj) => Object.values(obj).reduce((sum, val) => sum + val, 0);

    const toggleMenu = () => setMenuCollapsed(!menuCollapsed);

    if (isLoading) return <div className="loading-container">Cargando...</div>;

    // --- Datos del perfil ---
    const nombreUsuario = profile?.nombreUsuario || 'Administrador';
    const foto = profile?.foto || null;

    // --- Totales y ganancias ---
    const totalCostos = calcularTotales(costoPorCategoria);
    const totalVentas = calcularTotales(ventasPorCategoria);
    const gananciaReal = totalVentas - totalCostos;

    const totalCostosProyectado = calcularTotales(costoProyectado);
    const totalVentasProyectadas = calcularTotales(ventasProyectadasCategoria);
    const gananciaProyectada = totalVentasProyectadas - totalCostosProyectado;

    // --- Gráficos ---
    const ventasOptions = {
        chart: { id: 'ventas-chart', toolbar: { show: false } },
        xaxis: { categories: ['Ene','Feb','Mar','Abr','May','Jun','Jul','Ago','Sep','Oct','Nov','Dic'] },
        colors: ['#c89b3c']
    };
    const ventasSeries = [{ name: 'Ventas Completadas', data: ventasPorMes }];

    const ventasProyectadasOptions = {
        chart: { id: 'ventas-proyectadas-chart', toolbar: { show: false } },
        xaxis: { categories: ['Ene','Feb','Mar','Abr','May','Jun','Jul','Ago','Sep','Oct','Nov','Dic'] },
        colors: ['#c89b3c']
    };
    const ventasProyectadasSeries = [{ name: 'Ventas Proyectadas', data: ventasProyectadas }];

    const costData = { labels: Object.keys(costoPorCategoria), values: Object.values(costoPorCategoria) };
    const salesData = { labels: Object.keys(ventasPorCategoria), values: Object.values(ventasPorCategoria) };

    const costDataProyectado = { labels: Object.keys(costoProyectado), values: Object.values(costoProyectado) };
    const salesDataProyectado = { labels: Object.keys(ventasProyectadasCategoria), values: Object.values(ventasProyectadasCategoria) };

    return (
        <div className="app-container size-a">
            <Nav menuCollapsed={menuCollapsed} toggleMenu={toggleMenu} />

            <div className={`dashboard-container ${menuCollapsed ? 'admin-expanded-margin' : ''}`}>
                <TopBar
                    userName={nombreUsuario}
                    foto={foto}
                    className={menuCollapsed ? 'collapsed-sidebar-customer' : ''}
                />

                <h1 className="titulo-dashboard">Dashboard de Ventas</h1>
                <p className='admin-subtitulo'>
                    Panel de Administración Desde aquí tiene el control total.
                    Gestione usuarios, configure ajustes y supervise todas las operaciones
                    con eficiencia accediendo a todos los módulos como Administrador.
                </p>

                <div className="dashboard-content">
                    {/* Ventas completadas */}
                    <div className="dashboard-row">
                        <div className="dashboard-card large">
                            <div className="card-header">
                                <h3>Ganancias de las ventas completadas</h3>
                            </div>
                            <Chart options={ventasOptions} series={ventasSeries} type="area" height={250} />
                            <hr />
                        </div>
                    </div>

                    {/* Métricas reales */}
                    <div className="dashboard-row">
                        <div className='contenedor-cartas'>
                            <hr />
                            <div className="metrics-container">
                                <div className="metric-card">
                                    <h2>Costo de Compras</h2>
                                    <ul className="data-list">
                                        {costData.labels.length > 0 ? costData.labels.map((cat,i)=>(
                                            <li key={i}>
                                                <span className="category">{cat}:</span>
                                                <span className="value">${costData.values[i].toLocaleString('es-CO', {minimumFractionDigits:2})}</span>
                                            </li>
                                        )) : <li>No hay datos disponibles</li>}
                                    </ul>
                                </div>

                                <div className="metric-card">
                                    <h2>Ventas (Completadas)</h2>
                                    <ul className="data-list">
                                        {salesData.labels.length > 0 ? salesData.labels.map((cat,i)=>(
                                            <li key={i}>
                                                <span className="category">{cat}:</span>
                                                <span className="value">${salesData.values[i].toLocaleString('es-CO', {minimumFractionDigits:2})}</span>
                                            </li>
                                        )) : <li>No hay datos disponibles</li>}
                                    </ul>
                                </div>

                                <div className="metric-card">
                                    <h2>Ganancias</h2>
                                    <div style={{padding:'20px', textAlign:'center', fontSize:'2em', fontWeight:'bold', color: gananciaReal>=0?'#c89b3c':'#FF4560'}}>
                                        ${gananciaReal.toLocaleString('es-CO', {minimumFractionDigits:2})}
                                    </div>
                                    <div style={{textAlign:'center', fontSize:'0.9em', color:'#666', marginTop:'10px'}}>
                                        <div>Total Ventas: ${totalVentas.toLocaleString('es-CO', {minimumFractionDigits:2})}</div>
                                        <div>Total Costos: ${totalCostos.toLocaleString('es-CO', {minimumFractionDigits:2})}</div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Ventas proyectadas */}
                    <div className="dashboard-row">
                        <div className="dashboard-card large">
                            <div className="card-header">
                                <h3>Proyección de ventas (Incluye pedidos pendientes)</h3>
                                <p style={{fontSize:'0.9em', color:'#666', marginTop:'5px'}}>
                                    Esta gráfica muestra cómo se verían las ventas si todos los pedidos no cancelados se completaran
                                </p>
                            </div>
                            <Chart options={ventasProyectadasOptions} series={ventasProyectadasSeries} type="area" height={250} />
                            <hr />
                        </div>
                    </div>

                    {/* Métricas proyectadas */}
                    <div className="dashboard-row">
                        <div className='contenedor-cartas'>
                            <h3 style={{textAlign:'center', color:'#c89b3c', marginBottom:'20px'}}>
                                📊 Ganancias Proyectadas (Si todos los pedidos se completan)
                            </h3>
                            <hr />
                            <div className="metrics-container">
                                <div className="metric-card" style={{borderColor:'#c89b3c'}}>
                                    <h2>Costo de Compras (Proyectado)</h2>
                                    <ul className="data-list">
                                        {costDataProyectado.labels.length > 0 ? costDataProyectado.labels.map((cat,i)=>(
                                            <li key={i}>
                                                <span className="category">{cat}:</span>
                                                <span className="value">${costDataProyectado.values[i].toLocaleString('es-CO', {minimumFractionDigits:2})}</span>
                                            </li>
                                        )) : <li>No hay datos disponibles</li>}
                                    </ul>
                                </div>

                                <div className="metric-card" style={{borderColor:'#c89b3c'}}>
                                    <h2>Ventas (Proyectadas)</h2>
                                    <ul className="data-list">
                                        {salesDataProyectado.labels.length > 0 ? salesDataProyectado.labels.map((cat,i)=>(
                                            <li key={i}>
                                                <span className="category">{cat}:</span>
                                                <span className="value">${salesDataProyectado.values[i].toLocaleString('es-CO', {minimumFractionDigits:2})}</span>
                                            </li>
                                        )) : <li>No hay datos disponibles</li>}
                                    </ul>
                                </div>

                                <div className="metric-card" style={{borderColor:'#c89b3c'}}>
                                    <h2>Ganancias (Proyectadas)</h2>
                                    <div style={{padding:'20px', textAlign:'center', fontSize:'2em', fontWeight:'bold', color: gananciaProyectada>=0?'#c89b3c':'#FF4560'}}>
                                        ${gananciaProyectada.toLocaleString('es-CO', {minimumFractionDigits:2})}
                                    </div>
                                    <div style={{textAlign:'center', fontSize:'0.9em', color:'#666', marginTop:'10px'}}>
                                        <div>Total Ventas: ${totalVentasProyectadas.toLocaleString('es-CO', {minimumFractionDigits:2})}</div>
                                        <div>Total Costos: ${totalCostosProyectado.toLocaleString('es-CO', {minimumFractionDigits:2})}</div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>

                </div>
            </div>
        </div>
    );
};

export default Dashboard;
