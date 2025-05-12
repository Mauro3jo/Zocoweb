import React, { useContext, useEffect, useState, useRef } from "react";
import Chart from "chart.js/auto";
import { DarkModeContext } from "../context/DarkModeContext";
import { formatearAPeso } from "../helpers/formatearAPeso";

const EvolucionMensualCelular = ({ datosBack }) => {
  const { darkMode } = useContext(DarkModeContext);
  const color = darkMode ? "#fff" : "dark";
  const backgroundColor = darkMode ? "#fff" : "#292B2F";
  const { resumenUltimos7Meses } = datosBack;
  const datosResumenUltimosMeses = resumenUltimos7Meses || [];
  const totalBruto7Meses = datosResumenUltimosMeses.map(
    (dato) => dato.totalBruto
  );

  const totalOperaciones = datosResumenUltimosMeses.map(
    (dato) => dato.cantidadDatos
  );
  const ultimos7Meses = datosResumenUltimosMeses.map((dato) => dato.mes);
  const totalBrutoMenosInflacion = datosResumenUltimosMeses.map(
    (dato) => dato.totalBrutoMenosInflacion
  );

  let totalBruto = totalBruto7Meses;
  let totalBrutoInflacion = totalBrutoMenosInflacion;
  let operaciones = totalOperaciones;
  let meses = ultimos7Meses;
  const chartRef = useRef(null); 
  const chartInstance = useRef(null); 

  useEffect(() => {
    const data = {
      labels: meses,
      datasets: [
        {
          label: "Por monto $",
          data: totalBruto || [],
          backgroundColor: ["#b4c400"],
          borderWidth: 1,
        },
        {
          label: "Por inflacion $",
          data: totalBrutoInflacion || [],
          backgroundColor: [backgroundColor],
          borderWidth: 1,
        },
        {
          label: " Por cantidad de operaciones $",
          data: operaciones || [],
          backgroundColor: ["#B3B5BF"],
          borderWidth: 1,
        },
      ],
    };

    const config = {
      type: "bar",
      data,
      options: {
        layout: {
          padding: {
            left: 35,
          },
        },
        indexAxis: "y",
        scales: {
          x: {
            beginAtZero: true,
            display: false,
            grid: {
              display: false,
            },
            ticks: {
              color,
              font: {
                size: 4,
              },
            },
          },
          y: {
            beginAtZero: true,
            display: true,
            grid: {
              display: false,
            },
            ticks: {
              color,
              font: {
                size: 10,
              },
            },
          },
        },
        plugins: {
          legend: {
            display: false,
          },
          tooltip: {
            enabled: true,
            mode: "index",
            intersect: false,
            bodyFont: {
              size: 16, // Aumenta el tamaño de la fuente del texto del tooltip
            },
            padding: 16, // Aumenta el padding alrededor del texto
            boxWidth: 18, // Ajusta el ancho de la caja del color de fondo
            boxHeight: 18, // Ajusta la altura de la caja del color de fondo

            callbacks: {
              label: function (context) {
                let label = context.dataset.label || "";
                if (label) {
                  label += ": ";
                }
                if (context.parsed.y !== null) {
                  // Formatea el valor a pesos para mostrar en el tooltip
                  label += formatearAPeso(context.parsed.y);
                }
                return label;
              },
            },
          },
        },
      },
    };

    if (chartInstance.current) {
      chartInstance.current.destroy();
    }

    const ctx = chartRef.current;
    chartInstance.current = new Chart(ctx, config);
  }, [datosResumenUltimosMeses]);

  return (
    <div translate="no" className="container">
      <div
        className={darkMode ? "bg-grafica-celular-dark" : "bg-grafica-celular"}
      >
        <div className="text-center pt-3">
          <h6 className="lato-bold fs-16">Evolución mensual</h6>
        </div>
        <canvas
          className="pe-5 ps-1"
          id="myChartEvolucionMensual"
          height="500"
          ref={chartRef}
        ></canvas>
      </div>
    </div>
  );
};

export default EvolucionMensualCelular;
