// import hoja de estilo css
import "./GraficaData.css";

// import hooks 
import { useContext } from "react";

// import context 
import { DarkModeContext } from "../context/DarkModeContext";

// import librerias 
import { Bar } from "react-chartjs-2";
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  BarElement,
  Title,
  Tooltip,
  Legend,
  Filler,
} from "chart.js";

// import assets 
import TarjetasLogo from "./TarjetasLogo";
import TarjetasLogoBlanco from "./TarjetasLogoBlanco";

// import helpers 
import formatearValores, { formatearAPeso } from "../helpers/formatearAPeso";

ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  BarElement,
  Title,
  Tooltip,
  Legend,
  Filler
);

const GraficaData = ({ datos }) => {
  // variable para extraer los array de los datos
  const { descuentosPorTarjeta = [] } = datos;

  descuentosPorTarjeta.sort(
    (a, b) => b.totalConDescuento - a.totalConDescuento
  );

  // variable para pintar los beneficios
  var beneficios = descuentosPorTarjeta.map(
    (tarjeta) => tarjeta.totalConDescuento || 0
  );

  // Formatear cada valor en la variable beneficios a pesos
  var beneficiosFormateados = formatearValores(...beneficios);

  // Crea una versión formateada de beneficios para mostrar en los tooltips
  var beneficiosFormateados = beneficios.map(formatearAPeso);

  var tarjetasOrdenadas = descuentosPorTarjeta.map(
    (tarjeta) => tarjeta.tarjeta
  );

  const { darkMode } = useContext(DarkModeContext);
  const tickColor = darkMode ? "#fff" : "#292B2F";
  var misoptions = {
    responsive: true,
    
    plugins: {
      legend: {
        display: false,
      },
      tooltip: {
        enabled: true,
        mode: "index",
        intersect: false,
        bodyFont: {
          size: 12, 
        },
        padding: 10, 
        boxWidth: 6, 
        boxHeight: 6, 
        callbacks: {
          label: function (context) {
            let label = context.dataset.label || "";
            if (label) {
              label += ": ";
            }
            // Usa la versión formateada de beneficios para el tooltip
            label += beneficiosFormateados[context.dataIndex];
            return label;
          },
        },
      },
    },
    scales: {
      y: {
        display: false,
        grid: {
          color: darkMode ? "blue" : "red",
          borderColor: "transparent",
        },
      },
      x: {
        display: false,
        grid: {
          display: false,
        },
        ticks: {
          color: tickColor,
        },
      },
    },
  };

  var midata = {
    labels: tarjetasOrdenadas,
    datasets: [
      {
        label: "Monto $",
        data: beneficios,
        backgroundColor: "#B4C400",
      },
    ],
  };

  midata.datasets.forEach(function (dataset) {
    dataset.barPercentage = 1;
    dataset.barThickness = 40;
  });

  return (
    <section translate="no" className="container ">
      <article
        className={
          darkMode
            ? " bg-grafica-dark px-5 pb-4 position-relative"
            : "bg-grafica position-relative px-5 pb-3"
        }
      >
        <h2
          className="fs-18 py-4 position-absolute start-50 translate-middle-x"
          style={{ top: "3%" }}
        >
          Facturación por tarjeta
        </h2>

        <Bar
          className="padding-top-grafica "
          data={midata}
          options={misoptions}
        />
        {darkMode ? (
          <>
            <TarjetasLogoBlanco tarjetasOrdenadas={tarjetasOrdenadas} />
          </>
        ) : (
          <>
            <TarjetasLogo tarjetasOrdenadas={tarjetasOrdenadas} />
          </>
        )}
      </article>
    </section>
  );
};

export default GraficaData;
