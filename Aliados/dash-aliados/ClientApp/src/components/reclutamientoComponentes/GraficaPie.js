import React from "react";
import { Chart as ChartJS, ArcElement, Tooltip, Legend } from "chart.js";
import { Pie } from "react-chartjs-2";

ChartJS.register(ArcElement, Tooltip, Legend);

const GraficaPie = ({ datosGrafica }) => {
  const { rechazados, seleccionados, finalistas, contratados } = datosGrafica;

  const data = {
    labels: ["Rechazados", "Aceptados", "Finalistas", "Contratados"],
    datasets: [
      {
        label: "Cantidad",
        data: [rechazados, seleccionados, finalistas, contratados],
        backgroundColor: ["#e24444", " #e89f2f", " #efca39 ", " #b4c400 "],
        borderColor: ["#e24444", " #e89f2f ", " #efca39 ", " #b4c400 "],
        borderWidth: 1,
      },
    ],
  };

  const options = {
    plugins: {
      legend: {
        labels: {
          // Cambia el tamaño del texto aquí para las leyendas
          font: {
            size: 14, 
          },
        },
      },
      tooltip: {
        // Configuraciones de estilo para las tooltips
        bodyFont: {
          size: 14, 
        },
        titleFont: {
          size: 16, 
        },
      },
    },
  };
  return (
    <div>
      <Pie data={data} options={options} />
    </div>
  );
};
export default GraficaPie;
