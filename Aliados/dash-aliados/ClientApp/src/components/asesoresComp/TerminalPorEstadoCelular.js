import React, { useContext, useEffect, useRef } from "react";
import Chart from "chart.js/auto";
import { DarkModeContext } from "../../context/DarkModeContext";

const TerminalPorEstadoCelular = ({ decisiones = [], cantidades = [] }) => {
  const { darkMode } = useContext(DarkModeContext);
  const chartRef = useRef(null); // Uso de useRef para acceder al canvas

  useEffect(() => {
    // Asegurarse de que el canvas esté listo y los datos estén disponibles
    if (chartRef.current && decisiones.length && cantidades.length) {
      const ctx = chartRef.current.getContext('2d');

      // Configuración del gráfico, incluyendo imágenes según decisiones
      const config = {
        type: "bar",
        data: {
          labels: decisiones,
          datasets: [{
            label: "",
            data: cantidades,
            backgroundColor: darkMode ? ["#b4c400 "] : ["#b4c400 "],
            borderColor: darkMode ? ["#b4c400 "] : ["#b4c400 "],
            borderWidth: 1,
          }],
        },
        options: {
          layout: {
            padding: { left: 25 },
          },
          indexAxis: "y",
          scales: {
            x: { beginAtZero: false, display: false },
            y: { display: true },
          },
          plugins: { legend: { display: false } },
        },
        plugins: [{
          id: 'imageItems',
          afterDraw: chart => {
            // Dibujar imágenes aquí, asegurándose de que se carguen
          },
        }],
      };

      // Crear el gráfico
      new Chart(ctx, config);
    }
  }, [decisiones, cantidades, darkMode]); // Asegurarse de que useEffect se ejecute cuando cambien estos valores

  return (
    <div className="container">
      <div >
        <canvas ref={chartRef} id="myChart" height="500"></canvas>
      </div>
    </div>
  );
};

export default TerminalPorEstadoCelular;
