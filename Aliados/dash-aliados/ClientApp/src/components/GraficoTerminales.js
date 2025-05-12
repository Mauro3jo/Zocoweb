import React, { useContext } from 'react';
import { Pie } from 'react-chartjs-2';
import styles from './grafTerminal.css'; // Importa los estilos
import { DarkModeContext } from '../context/DarkModeContext';
import ChartDataLabels from 'chartjs-plugin-datalabels'; // Importar el plugin
import Chart from 'chart.js/auto'; // Importar Chart de chart.js para registrar plugins

// Chart.register(ChartDataLabels); // Registrar el plugin


const GraficoTerminales = ({ data }) => {
    const darkMode= useContext(DarkModeContext)

    const chartData = {
        labels: [
            `Facturan: ${data.porcentajeFacturan}%`, 
            `No facturan: ${data.porcentajeNoFacturan}%`, 
        ],
        datasets: [{
            data: [
                data.totalFacturan, 
                data.totalNoFacturan, 
                
            ],
            backgroundColor: ['#4CAF50',  '#FF6384'],
            hoverBackgroundColor: ['#45A049',  '#FF4264']
        }],
    };

    const options = {
        responsive: true,
        maintainAspectRatio: false,
        cutout: '60%',  
        plugins: {
            legend: {
                display: true,
                position: 'bottom'
            },
            tooltip: {
                callbacks: {
                    label: function(tooltipItem) {
                        const label = tooltipItem.label || '';
                        const value = tooltipItem.raw || 0;
                        return `${value}`;
                    }
                }
            },
            datalabels: {
                color: 'black',
                textAlign: 'center',
                font: {
                    weight: 'bold',
                    size: 16
                },
                formatter: (value, ctx) => {
                    if (ctx.dataIndex === 0) { // Asume que el primer segmento es 'Con Facturación'
                        return `Terminales en uso\n${data.porcentajeFacturan}%`;
                    } else {
                        return ''; // No muestra nada en los otros segmentos
                    }
                },
                display: true    // Asegúrate de que los datalabels estén habilitados
        }
    }
};

    

    return (
        <>
                 <h6 className="text-center lato-bold fs-17"> Terminales facturando</h6>

        <div style={{ paddingTop: "20px", height: "100%" }}
        className={
          darkMode ? "bg-grafica px-5 pb-4"  : "bg-grafica-dark px-5 pb-4"
        }> {/* Usando la clase del archivo CSS */}
        
            <Pie data={chartData} key={`${data.porcentajeFacturan}-${data.porcentajeNoFacturan}-${data.totalFacturan}-${data.totalNoFacturan}`}  options={options} />
        </div>
        </>
        
    );
};

export default GraficoTerminales;
