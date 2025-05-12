import React, { useContext, useState } from 'react';
import { Bar } from 'react-chartjs-2';
import { DarkModeContext } from '../../context/DarkModeContext';
import Chart from 'chart.js/auto';

const GraficoProvincias = ({ data }) => {
    const darkMode = useContext(DarkModeContext);

    // Seleccionar la primera provincia para obtener los meses disponibles
    const primeraProvincia = Object.values(data)[0] || {};
    const meses = primeraProvincia?.nombresMeses || [];

    // Estado para el mes seleccionado, por defecto el mes más reciente (meses[0])
    const [mesSeleccionado, setMesSeleccionado] = useState(meses[0]);

    // Obtener el índice del mes seleccionado en el array `nombresMeses`
    const mesIndex = meses.indexOf(mesSeleccionado);

    // Función para obtener los datos de cada provincia para el mes seleccionado usando el índice
    const obtenerDatosPorMes = (provincia) => {
        if (mesIndex === -1) return { totalesBruto: 0, brutoMenosInflacion: 0};
        return {
            totalesBruto: provincia?.totalesBruto?.[mesIndex] || 0,
            brutoMenosInflacion: provincia?.brutoMenosInflacion?.[mesIndex] || 0,
        };
    };

    // Ordenar las provincias por `totalesBruto` de mayor a menor
    const provinciasOrdenadas = Object.keys(data)
        .filter(key => key !== 'nombresMeses')
        .map(provincia => ({
            nombre: provincia,
            ...obtenerDatosPorMes(data[provincia]),
        }))
        .sort((a, b) => b.totalesBruto - a.totalesBruto);

    // Crear datos para el gráfico utilizando el mes seleccionado
    const chartData = {
        labels: provinciasOrdenadas.map(item => item.nombre),
        datasets: [
            {
                label: 'Bruto',
                data: provinciasOrdenadas.map(item => item.totalesBruto),
                backgroundColor: '#4CAF50',
                hoverBackgroundColor: '#45A049',
                barThickness: 20,
                yAxisID: 'y',
            },
            {
                label: 'Bruto ajustado a Inflación',
                data: provinciasOrdenadas.map(item => item.brutoMenosInflacion),
                backgroundColor: '#FF7043',
                hoverBackgroundColor: '#FF5722',
                barThickness: 20,
                yAxisID: 'y',
            },
        ],
    };

    const options = {
        responsive: true,
        maintainAspectRatio: false,
        plugins: {
            legend: { display: true },
            tooltip: {
                callbacks: {
                    label: function (tooltipItem) {
                        const value = tooltipItem.raw || 0;
                        return tooltipItem.datasetIndex === 2 ? `${value}%` : `$${value.toLocaleString()}`;
                    }
                }
            },
        },
        scales: {
            y: {
                type: 'linear',
                position: 'left',
                title: { display: true, text: 'Valores (en millones de $)' },
            },
        
        },
        interaction: { mode: 'index', intersect: false },
    };

    return (
        <>
            <h6 className="text-center lato-bold fs-17" style={{ marginTop: "20px" }}>Evolución Terminales</h6>

            {/* Selector de Mes */}
            <div className="text-center mb-4">
            <div
        style={{
            display: "flex",
            alignItems: "center",
            justifyContent: "center", // Centra el contenido horizontalmente
            gap: "10px", // Espaciado entre el label y el select
        }}
    >
        <label
            className="fs-18 lato-bold mb-0"
            style={{ color: "#292B2F" }}
            htmlFor="mesSeleccionado"
        >
            Seleccionar Mes:
        </label>
        <select
            className="form-control"
            style={{
                width: "auto", // Ajusta el tamaño del input a lo necesario
                height: "44px", // Ajusta la altura para que coincida con la del botón
                background: "#B4C400",
                borderRadius: "32px",
                padding: "0 12px", // Ajusta el espaciado interno
            }}
            id="mesSeleccionado"
            value={mesSeleccionado}
            onChange={(e) => setMesSeleccionado(e.target.value)}
        >
            {meses.map((mes, index) => (
                <option key={index} value={mes}>
                    {mes}
                </option>
            ))}
        </select>
    </div>
            </div>

            {/* Gráfico */}
            <div style={{ paddingTop: "20px", height: "40em" }} className={darkMode ? "bg-grafica px-5 pb-4" : "bg-grafica-dark px-5 pb-4"}>
                <Bar data={chartData} options={options} />
            </div>
        </>
    );
};

export default GraficoProvincias;
