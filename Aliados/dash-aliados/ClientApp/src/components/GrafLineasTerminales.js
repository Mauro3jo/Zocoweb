import React, { useContext } from 'react';
import { Bar } from 'react-chartjs-2';
import { DarkModeContext } from '../context/DarkModeContext';
import Chart from 'chart.js/auto';

const GrafLineasTerminales = ({ data }) => {
    const darkMode = useContext(DarkModeContext);

    // Invertir los datos de los arrays
    const meses = data?.nombresMeses?.length > 0 ? [...data.nombresMeses].reverse() : ['N/A'];
    const brutos = data?.totalesBruto?.length > 0 ? [...data.totalesBruto].reverse() : [0];
    const brutoMenosInflacion = data?.brutoMenosInflacion?.length > 0 ? [...data.brutoMenosInflacion].reverse() : [0];
    const inflacionMensual = data?.inflacionPorMes?.length > 0 ? [...data.inflacionPorMes].reverse() : [0];


    const chartData = {
        labels: meses,
        datasets: [
            {
                label: 'Bruto',
                data: brutos,
                backgroundColor: '#4CAF50',
                hoverBackgroundColor: '#45A049',
                barThickness: 20,
                type: 'bar',
                yAxisID: 'y',
                order: 2,
            },
            {
                label: 'Bruto menos Inflación',
                data: brutoMenosInflacion,
                backgroundColor: '#FF7043',
                hoverBackgroundColor: '#FF5722',
                barThickness: 20,
                type: 'bar',
                yAxisID: 'y',
                order: 3,
            },
            {
                label: 'Inflación Mensual',
                data: inflacionMensual,
                borderColor: '#FFD700',
                backgroundColor: '#FFD700',
                borderWidth: 2,
                pointBackgroundColor: '#E89F2F',
                fill: false,
                type: 'line',
                tension: 0.4,
                yAxisID: 'y1',
                order: 1,
            },
        ],
    };

    const options = {
        responsive: true,
        maintainAspectRatio: false,
        plugins: {
            legend: {
                display: true,
            },
            tooltip: {
                callbacks: {
                    label: function (tooltipItem) {
                        const value = tooltipItem.raw || 0;
                        if (tooltipItem.datasetIndex === 2) {
                            return `${value}%`;
                        }
                        return `$${value.toLocaleString()}`;
                    },
                },
            },
        },
        scales: {
            x: {
                ticks: {
                    autoSkip: false,
                },
            },
            y: {
                type: 'linear',
                display: true,
                position: 'left',
                title: {
                    display: true,
                    text: 'Valores (en millones de $)',
                },
            },
            y1: {
                type: 'linear',
                display: true,
                position: 'right',
                title: {
                    display: true,
                    text: 'Inflación (%)',
                },
                grid: {
                    drawOnChartArea: false,
                },
            },
        },
        interaction: {
            mode: 'index',
            intersect: false,
        },
    };

    return (
        <>
            <h6 className="text-center lato-bold fs-17" style={{ marginTop: '20px' }}>
                Evolución Terminales
            </h6>
            <div style={{ paddingTop: '20px', height: '40em' }} className={darkMode ? 'bg-grafica px-5 pb-4' : 'bg-grafica-dark px-5 pb-4'}>
                <Bar data={chartData} options={options} />
            </div>
        </>
    );
};

export default GrafLineasTerminales;
