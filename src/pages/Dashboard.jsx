import React, { useState } from 'react';
import Nav from '../components/Nav.jsx';
import Chart from 'react-apexcharts';
import './Dashboard.css';


const Dashboard = () => {
    const [selectedYear, setSelectedYear] = useState(null);
    const [selectedMonth, setSelectedMonth] = useState(null);

    const categories = ['camisas', 'pantalones', 'vestidos', 'faldas', 'chaquetas'];

    const costData = {
        labels: categories,
        values: [535.97, 370.59, 311.35, 394.32, 416.83]
    };

    const salesData = {
        labels: categories,
        values: [443.79, 495.74, 216.45, 514.43, 314.34]
    };

    const profitData = {
        labels: categories,
        values: costData.values.map((cost, index) => salesData.values[index] - cost)
    };

    const ventasOptions = {
        chart: { id: 'ventas-chart', toolbar: { show: false } },
        xaxis: { categories: ['Ene', 'Feb', 'Mar', 'Abr', 'May', 'Jun'] },
        colors: ['#c89b3c']
    };

    const ventasSeries = [{ name: 'Ventas', data: [3000, 4000, 3500, 5000, 4900, 2000] }];

    const serviciosOptions = {
        labels: ['Camisas', 'Pantalones', 'Vestidos', 'Faldas', 'Chaquetas', 'Blusas'],
        colors: ['#008FFB', '#00E396', '#FEB019', '#FF4560', '#c89b3c', '#34495e']
    };

    const serviciosSeries = [44, 55, 13, 33, 20, 12];

    const years = [2022, 2023, 2024, 2025];
    const months = ['Ene', 'Feb', 'Mar', 'Abr', 'Jun', 'Jul', 'Ago', 'Sep', 'Oct', 'Nov', 'Dic'];

    const [menuCollapsed, setMenuCollapsed] = useState(false);
    const toggleMenu = () => {
        setMenuCollapsed(!menuCollapsed);
    };

    return (
        <div className="app-container size-a">
            <Nav menuCollapsed={menuCollapsed} toggleMenu={toggleMenu} />

            <div className="dashboard-container">

                <h1 className="titulo-dashboard">Dashboard de Ventas</h1>
                <div className="date-range">Filtrar Dashboard por año</div>
                <div className="date-range">
                    {years.map(year => (
                        <button
                            key={year}
                            className={`Boton-año ${selectedYear === year ? 'Boton-seleccionado' : ''}`}
                            onClick={() => setSelectedYear(year)}
                            style={{ backgroundColor: selectedYear !== year ? '#c89b3c' : '' }}
                        >
                            {year}
                        </button>
                    ))}
                </div>

                {/* Contenido ampliado: Gráficos y estadísticas */}
                <div className="dashboard-content">
                    {/* Fila 1: Gráfico de ganancias */}
                    <div className="dashboard-row">
                        <div className="dashboard-card large">
                            <div className="card-header">
                                <h3>Ganancias de las ventas</h3>
                            </div>
                            <Chart options={ventasOptions} series={ventasSeries} type="area" height={250} />
                            <hr />
                        </div>
                    </div>

                    {/* Fila 2: Servicios y métricas */}
                    <div className="dashboard-row">
                        <div className="dashboard-card">
                            <div className="card-header">
                                <h3>Porcentaje de subcategorias vendidas</h3>
                            </div>
                            <Chart options={serviciosOptions} series={serviciosSeries} type="pie" height={250} />
                        </div>

                        <div className='contenedor-cartas'>
                            <hr />
                            <div className="metrics-container">
                                <div className="metric-card">
                                    <h2>Costo de Ventas</h2>
                                    <ul className="data-list">
                                        {costData.labels.map((category, index) => (
                                            <li key={index}>
                                                <span className="category">{category}:</span>
                                                <span className="value">${costData.values[index].toFixed(2)}</span>
                                            </li>
                                        ))}
                                    </ul>
                                </div>

                                <div className="metric-card">
                                    <h2>Ventas</h2>
                                    <ul className="data-list">
                                        {salesData.labels.map((category, index) => (
                                            <li key={index}>
                                                <span className="category">{category}:</span>
                                                <span className="value">${salesData.values[index].toFixed(2)}</span>
                                            </li>
                                        ))}
                                    </ul>
                                </div>

                                <div className="metric-card">
                                    <h2>Ganancias</h2>
                                    <ul className="data-list">
                                        {profitData.labels.map((category, index) => (
                                            <li key={index}>
                                                <span className="category">{category}:</span>
                                                <span className={`value ${profitData.values[index] >= 0 ? 'positive' : 'negative'}`}>
                                                    ${profitData.values[index].toFixed(2)}
                                                </span>
                                            </li>
                                        ))}
                                    </ul>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Filtros por meses */}
                <div className="filtros-meses">
                    {months.map(month => (
                        <button
                            key={month}
                            className={`Boton-mes ${selectedMonth === month ? 'Boton-seleccionado' : ''}`}
                            onClick={() => setSelectedMonth(month)}
                            style={{ backgroundColor: selectedMonth !== month ? '#c89b3c' : '' }}
                        >
                            {month}
                        </button>
                    ))}
                </div>
            </div>

        </div>

    );
};

export default Dashboard;