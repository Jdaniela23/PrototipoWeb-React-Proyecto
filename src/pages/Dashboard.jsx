import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import Nav from '../components/Nav.jsx';
import TopBar from '../components/customer/TopBar';
import Chart from 'react-apexcharts';
import './Dashboard.css';
import { getCompras } from "../api/comprasService.js";
import { getPedidos } from "../api/pedidosService.js";
import { getMyProfile } from "../api/authService";
import LoadingSpinner from '../components/LoadingSpinner';

const Dashboard = () => {
    const [isLoading, setIsLoading] = useState(true);
    const [menuCollapsed, setMenuCollapsed] = useState(false);
    const [profile, setProfile] = useState(null);
    const [comprasData, setComprasData] = useState([]);
    const [pedidosData, setPedidosData] = useState([]);
    const [filtroReal, setFiltroReal] = useState('mes');
    const [filtroProyectado, setFiltroProyectado] = useState('mes');
    const [fechaReal, setFechaReal] = useState({ dia: '', mes: '', año: '' });
    const [fechaProyectada, setFechaProyectada] = useState({ dia: '', mes: '', año: '' });

    const navigate = useNavigate();

    useEffect(() => {
        const fetchData = async () => {
            try {
                const profileData = await getMyProfile();
                setProfile(profileData);
                const [compras, pedidos] = await Promise.all([getCompras(), getPedidos()]);
                setComprasData(compras);
                setPedidosData(pedidos);
                
                const hoy = new Date();
                setFechaReal({ dia: hoy.getDate(), mes: hoy.getMonth() + 1, año: hoy.getFullYear() });
                setFechaProyectada({ dia: hoy.getDate(), mes: hoy.getMonth() + 1, año: hoy.getFullYear() });
            } catch (error) {
                console.error("Error al cargar datos:", error);
            } finally {
                setIsLoading(false);
            }
        };
        fetchData();
    }, []);

    const obtenerFechasDisponibles = (pedidos) => {
        const fechas = new Set();
        pedidos.forEach(p => {
            const fecha = new Date(p.fecha_Creacion);
            fechas.add(`${fecha.getFullYear()}-${fecha.getMonth() + 1}-${fecha.getDate()}`);
        });
        return Array.from(fechas).map(f => {
            const [año, mes, dia] = f.split('-');
            return { año: parseInt(año), mes: parseInt(mes), dia: parseInt(dia) };
        });
    };

    const obtenerMesesDisponibles = (pedidos, año) => {
        const meses = new Set();
        pedidos.forEach(p => {
            const fecha = new Date(p.fecha_Creacion);
            if (fecha.getFullYear() === parseInt(año)) {
                meses.add(fecha.getMonth() + 1);
            }
        });
        return Array.from(meses).sort((a, b) => a - b);
    };

    const obtenerDiasDisponibles = (pedidos, año, mes) => {
        const dias = new Set();
        pedidos.forEach(p => {
            const fecha = new Date(p.fecha_Creacion);
            if (fecha.getFullYear() === parseInt(año) && fecha.getMonth() + 1 === parseInt(mes)) {
                dias.add(fecha.getDate());
            }
        });
        return Array.from(dias).sort((a, b) => a - b);
    };

    const obtenerAñosDisponibles = (pedidos) => {
        const años = new Set();
        pedidos.forEach(p => {
            const fecha = new Date(p.fecha_Creacion);
            años.add(fecha.getFullYear());
        });
        return Array.from(años).sort((a, b) => b - a);
    };

    const filtrarPorPeriodo = (pedidos, filtro, fecha) => {
        return pedidos.filter(p => {
            const fechaPedido = new Date(p.fecha_Creacion);
            if (filtro === 'dia') {
                return fechaPedido.getDate() === parseInt(fecha.dia) && 
                       fechaPedido.getMonth() + 1 === parseInt(fecha.mes) && 
                       fechaPedido.getFullYear() === parseInt(fecha.año);
            } else if (filtro === 'mes') {
                return fechaPedido.getMonth() + 1 === parseInt(fecha.mes) && 
                       fechaPedido.getFullYear() === parseInt(fecha.año);
            } else {
                return fechaPedido.getFullYear() === parseInt(fecha.año);
            }
        });
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

    if (isLoading) return <LoadingSpinner message="Cargando datos del Dashboard..." />;

    const nombreUsuario = profile?.nombreUsuario || 'Administrador';
    const foto = profile?.foto || null;

    const pedidosFinalizados = pedidosData.filter(p => p.estado_Pedido === 'Completado');
    const pedidosActivos = pedidosData.filter(p => p.estado_Pedido !== 'Cancelado');

    const añosReales = obtenerAñosDisponibles(pedidosFinalizados);
    const mesesReales = obtenerMesesDisponibles(pedidosFinalizados, fechaReal.año);
    const diasReales = obtenerDiasDisponibles(pedidosFinalizados, fechaReal.año, fechaReal.mes);

    const añosProyectados = obtenerAñosDisponibles(pedidosActivos);
    const mesesProyectados = obtenerMesesDisponibles(pedidosActivos, fechaProyectada.año);
    const diasProyectados = obtenerDiasDisponibles(pedidosActivos, fechaProyectada.año, fechaProyectada.mes);

    const pedidosFinalizadosFiltrados = filtrarPorPeriodo(pedidosFinalizados, filtroReal, fechaReal);
    const pedidosActivosFiltrados = filtrarPorPeriodo(pedidosActivos, filtroProyectado, fechaProyectada);

    const ventasPorMes = calcularVentasPorMes(pedidosFinalizados);
    const costoPorCategoria = calcularCostosPorCategoria(comprasData);
    const ventasPorCategoria = calcularVentasPorCategoria(pedidosFinalizadosFiltrados);
    const totalCostos = calcularTotales(costoPorCategoria);
    const totalVentas = calcularTotales(ventasPorCategoria);
    const gananciaReal = totalVentas - totalCostos;

    const ventasProyectadas = calcularVentasPorMes(pedidosActivos);
    const ventasProyectadasCategoria = calcularVentasPorCategoria(pedidosActivosFiltrados);
    const totalVentasProyectadas = calcularTotales(ventasProyectadasCategoria);
    const gananciaProyectada = totalVentasProyectadas - totalCostos;

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
    const salesDataProyectado = { labels: Object.keys(ventasProyectadasCategoria), values: Object.values(ventasProyectadasCategoria) };

    const selectStyle = {
        padding: '8px 12px',
        border: '1px solid #ddd',
        borderRadius: '5px',
        fontSize: '14px',
        cursor: 'pointer'
    };

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
                    <div className="dashboard-row">
                        <div className="dashboard-card large">
                            <div className="card-header">
                                <h3>Ganancias de las ventas completadas</h3>
                            </div>
                            <Chart options={ventasOptions} series={ventasSeries} type="area" height={250} />
                            <hr />
                        </div>
                    </div>

                    <div className="dashboard-row">
                        <div className='contenedor-cartas'>
                            <div style={{display:'flex', justifyContent:'space-between', alignItems:'center', marginBottom:'15px', flexWrap:'wrap', gap:'10px'}}>
                                <h3>Ventas Completadas</h3>
                                <div style={{display:'flex', gap:'10px', alignItems:'center', flexWrap:'wrap'}}>
                                    <button onClick={() => setFiltroReal('dia')} style={{padding:'8px 15px', backgroundColor: filtroReal==='dia'?'#c89b3c':'#f0f0f0', border:'none', borderRadius:'5px', cursor:'pointer'}}>Día</button>
                                    <button onClick={() => setFiltroReal('mes')} style={{padding:'8px 15px', backgroundColor: filtroReal==='mes'?'#c89b3c':'#f0f0f0', border:'none', borderRadius:'5px', cursor:'pointer'}}>Mes</button>
                                    <button onClick={() => setFiltroReal('año')} style={{padding:'8px 15px', backgroundColor: filtroReal==='año'?'#c89b3c':'#f0f0f0', border:'none', borderRadius:'5px', cursor:'pointer'}}>Año</button>
                                    
                                    <select value={fechaReal.año} onChange={(e) => setFechaReal({...fechaReal, año: e.target.value})} style={selectStyle}>
                                        {añosReales.map(año => <option key={año} value={año}>{año}</option>)}
                                    </select>
                                    
                                    {(filtroReal === 'mes' || filtroReal === 'dia') && (
                                        <select value={fechaReal.mes} onChange={(e) => setFechaReal({...fechaReal, mes: e.target.value})} style={selectStyle}>
                                            {mesesReales.map(mes => <option key={mes} value={mes}>{['Ene','Feb','Mar','Abr','May','Jun','Jul','Ago','Sep','Oct','Nov','Dic'][mes-1]}</option>)}
                                        </select>
                                    )}
                                    
                                    {filtroReal === 'dia' && (
                                        <select value={fechaReal.dia} onChange={(e) => setFechaReal({...fechaReal, dia: e.target.value})} style={selectStyle}>
                                            {diasReales.map(dia => <option key={dia} value={dia}>{dia}</option>)}
                                        </select>
                                    )}
                                </div>
                            </div>
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
                                    <h2>Ventas</h2>
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

                    <div className="dashboard-row">
                        <div className='contenedor-cartas'>
                            <div style={{display:'flex', justifyContent:'space-between', alignItems:'center', marginBottom:'15px', flexWrap:'wrap', gap:'10px'}}>
                                <h3 style={{color:'#c89b3c'}}>📊 Ganancias Proyectadas</h3>
                                <div style={{display:'flex', gap:'10px', alignItems:'center', flexWrap:'wrap'}}>
                                    <button onClick={() => setFiltroProyectado('dia')} style={{padding:'8px 15px', backgroundColor: filtroProyectado==='dia'?'#c89b3c':'#f0f0f0', border:'none', borderRadius:'5px', cursor:'pointer'}}>Día</button>
                                    <button onClick={() => setFiltroProyectado('mes')} style={{padding:'8px 15px', backgroundColor: filtroProyectado==='mes'?'#c89b3c':'#f0f0f0', border:'none', borderRadius:'5px', cursor:'pointer'}}>Mes</button>
                                    <button onClick={() => setFiltroProyectado('año')} style={{padding:'8px 15px', backgroundColor: filtroProyectado==='año'?'#c89b3c':'#f0f0f0', border:'none', borderRadius:'5px', cursor:'pointer'}}>Año</button>
                                    
                                    <select value={fechaProyectada.año} onChange={(e) => setFechaProyectada({...fechaProyectada, año: e.target.value})} style={selectStyle}>
                                        {añosProyectados.map(año => <option key={año} value={año}>{año}</option>)}
                                    </select>
                                    
                                    {(filtroProyectado === 'mes' || filtroProyectado === 'dia') && (
                                        <select value={fechaProyectada.mes} onChange={(e) => setFechaProyectada({...fechaProyectada, mes: e.target.value})} style={selectStyle}>
                                            {mesesProyectados.map(mes => <option key={mes} value={mes}>{['Ene','Feb','Mar','Abr','May','Jun','Jul','Ago','Sep','Oct','Nov','Dic'][mes-1]}</option>)}
                                        </select>
                                    )}
                                    
                                    {filtroProyectado === 'dia' && (
                                        <select value={fechaProyectada.dia} onChange={(e) => setFechaProyectada({...fechaProyectada, dia: e.target.value})} style={selectStyle}>
                                            {diasProyectados.map(dia => <option key={dia} value={dia}>{dia}</option>)}
                                        </select>
                                    )}
                                </div>
                            </div>
                            <hr />
                            <div className="metrics-container">
                                <div className="metric-card" style={{borderColor:'#c89b3c'}}>
                                    <h2>Costo de Compras (Proyectado)</h2>
                                    <ul className="data-list">
                                        {costData.labels.length > 0 ? costData.labels.map((cat,i)=>(
                                            <li key={i}>
                                                <span className="category">{cat}:</span>
                                                <span className="value">${costData.values[i].toLocaleString('es-CO', {minimumFractionDigits:2})}</span>
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
                                        <div>Total Costos: ${totalCostos.toLocaleString('es-CO', {minimumFractionDigits:2})}</div>
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