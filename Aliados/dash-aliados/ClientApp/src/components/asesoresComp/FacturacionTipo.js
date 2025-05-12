import React, { useContext, useEffect, useRef } from "react";
import Chart from "chart.js/auto";
import { DarkModeContext } from "../../context/DarkModeContext";

const FacturacionTipo = ({ dato }) => {
  const { darkMode } = useContext(DarkModeContext);
  const chartRef = useRef(null);
  const Credito = dato?.credito || 0;
  const Debito = dato?.debito || 0;
  const Pago1 = dato?.pago1 || 0;
  const dataCreditoDebitoPago = [Credito, Pago1, Debito];

  useEffect(() => {
    const ctx = document.getElementById("myChart");

    if (ctx) {
      if (chartRef.current) {
        // Si ya existe un gráfico, lo destruimos antes de crear uno nuevo
        chartRef.current.destroy();
      }

      const data = {
        labels: ["Crédito", "1 pago", "Débito"],
        datasets: [
          {
            label: "monto $",
            data: dataCreditoDebitoPago,
            backgroundColor: ["#b4c400", "#b4c400", "#b4c400"],
            borderColor: ["#b4c400", "#b4c400", "#b4c400"],
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
                font: {
                  size: 9,
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
                font: {
                  size: 9,
                },
              },
            },
          },
          plugins: {
            legend: {
              display: false,
            },
          },
        },
      };

      chartRef.current = new Chart(ctx, config);
    }
  }, [dato, darkMode]);

  return (
    <div className="container">
      <div className="">
        <canvas className="custom-canvas" id="myChart"></canvas>
      </div>
    </div>
  );
};

export default FacturacionTipo;
