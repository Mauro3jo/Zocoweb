// IMPORT HOOK,CONTEXT Y LIBRERIAS
import React, { useContext, useEffect, useRef } from "react";
import Chart from "chart.js/auto";
import { DarkModeContext } from "../../context/DarkModeContext";

const FacturacionRubroCelular = ({ datos }) => {
  // DARKMODE PARA MODIFICAR LA FUNCIONALIDAD DE MODO OSCURO.
  const { darkMode } = useContext(DarkModeContext);

  // EXTRAIGO LOS ELEMENTOS RUBROS DE LOS DATOS ENVIADOS DE LA BASE.
  const rubros =
    datos?.sumaPorRubro?.map((item) => item.rubro || "Desconocido") ?? [];
  const sumatorias =
    datos?.sumaPorRubro?.map((item) => item.sumatoriaFacturacionMesEnCurso) ??
    [];

  // Referencia para almacenar el gráfico
  const chartRef = useRef(null);
  useEffect(() => {
    var data = {
      labels: rubros,
      datasets: [
        {
          label: "Facturación Mes En Curso $ ",
          data: sumatorias,
          backgroundColor: "#B4C400", 
          barPercentage: 1,
          barThickness: 30, 
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
              font: {
                size: 5,
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
              color: darkMode ? "#fafafa" : "#292B2F", 
              font: { size: 10 },
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
            backgroundColor: "#FFF", 
            titleColor: "#000", 
            bodyColor: "#000", 
            borderColor: "rgba(0,0,0,0.1)", 
            borderWidth: 1, 
            bodyFont: {
              size: 14,
            },
          },
        },
      },
    };

    const ctx = document.getElementById("myChartRubro");
    chartRef.current = new Chart(ctx, config); 

    // Función de limpieza para destruir el gráfico
    return () => {
      if (chartRef.current) {
        chartRef.current.destroy();
      }
    };
  }, [darkMode, datos]); 

  return (
    <div className="container">
      <div
        className={
          darkMode
            ? "bg-grafica-celular-dark container px-4"
            : "bg-grafica-celular container px-4"
        }
      >
        <div className="text-center pt-3">
          <h6 className="lato-bold fs-16">Facturación por rubro</h6>
        </div>
        <canvas id="myChartRubro" height="500"></canvas>
      </div>
    </div>
  );
};

export default FacturacionRubroCelular;
