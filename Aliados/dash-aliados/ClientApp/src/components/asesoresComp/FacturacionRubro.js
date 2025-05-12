// import css del proyecto
import "./FacturacionRubro.css";

// import hooks, context y librerias
import React, { useContext } from "react";
import { DarkModeContext } from "../../context/DarkModeContext";
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

// import component
import FacturacionRubroCelular from "./FacturacionRubroCelular";

// import helpers : funciones de auxilio para formatear a peso los datos utilizado de la grafica
import formatearApesoGrafica from "../../helpers/formatearApesoGrafica";

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

const FacturacionRubro = ({ datos }) => {
  // Darkmode context para modificar el modo oscuro.
  const { darkMode } = useContext(DarkModeContext);

  // Extrayendo 'sumaPorRubro' de los datos recibidos
  const rubros =
    datos?.sumaPorRubro?.map((item) => item.rubro || "Desconocido") ?? [];
  const sumatorias =
    datos?.sumaPorRubro?.map((item) => item.sumatoriaFacturacionMesEnCurso) ??
    [];

  // opciones generales de la grafica.
  var misoptions = {
    responsive: true,
    maintainAspectRatio: true,
    plugins: {
      legend: {
        display: false, // Ajusta según necesidad
      },
      tooltip: {
        enabled: true,
        mode: "index",
        intersect: false,
        backgroundColor: "#FFF", // Color de fondo del tooltip
        titleColor: "#000", // Color del título del tooltip
        bodyColor: "#000", // Color del cuerpo del tooltip
        borderColor: "rgba(0,0,0,0.1)", // Color del borde del tooltip
        borderWidth: 1, // Ancho del borde del tooltip
        bodyFont: {
          // Fuente del cuerpo del tooltip
          size: 14,
        },
        callbacks: {
          label: function (context) {
            var label = context.dataset.label || "";
            if (label) {
              label += ": ";
            }
            if (context.parsed.y !== null) {
              label += formatearApesoGrafica(context.parsed.y);
            }
            return label;
          },
        },
      },
    },
    scales: {
      y: {
        display: false, // Oculta eje Y, ajusta según necesidad
        grid: {
          display: false, // Oculta líneas de cuadrícula del eje Y
        },
      },
      x: {
        grid: {
          display: false, // Oculta líneas de cuadrícula del eje X
        },
        ticks: {
          color: darkMode ? "#fafafa" : "#292B2F", // Ajusta color de texto del eje X según el modo oscuro

          font: {
            size: 10, // Reduce el tamaño del texto si es necesario
          },
        },
      },
    },
    title: {
      display: true,
      text: "Facturación por Rubro",
      font: {
        size: 16,
        weight: "bold",
      },
    },
  };

  // data utilizada para pintar la grafica de rubros.
  var midata = {
    labels: rubros,
    datasets: [
      {
        label: "Facturación Mes En Curso ",
        data: sumatorias,
        backgroundColor: "#B4C400", // Ajusta el color de fondo según necesidad
        barPercentage: 1,
        barThickness: 40, // Ajusta el grosor de las barras según necesidad
      },
    ],
  };
  var midatamobile = {
    labels: rubros,
    datasets: [
      {
        label: "Beneficios",
        data: sumatorias,
        backgroundColor: "#B4C400",
      },
    ],
  };

  // los datasets son para modificar funciones especifica
  // por ejemplo los Thickness (barra)
  midata.datasets.forEach(function (dataset) {
    dataset.barPercentage = 1;
    dataset.barThickness = 40;
  });

  midatamobile.datasets.forEach(function (dataset) {
    dataset.barPercentage = 0.2;
    dataset.barThickness = 10;
  });

  return (
    <section>
      <article className="container my-4 d-lg-block d-none">
        <article
          className={
            darkMode
              ? "bg-grafica-dark px-5 pb-3 position-relative"
              : "bg-grafica px-5 pb-3 position-relative"
          }
        >
          <h2
            className=" fs-18-a-16 py-4 position-absolute start-50 translate-middle-x"
            style={{ top: "3%" }}
          >
            Facturación por rubro <br />
          </h2>
          <Bar
            className="padding-top-grafica "
            data={midata}
            options={misoptions}
          />
        </article>
      </article>
      {/* COMPONENTE FACTURACION RUBRO CELULAR  */}
      <article className=" my-4 d-block d-lg-none">
        <FacturacionRubroCelular datos={datos} />
      </article>
    </section>
  );
};

export default FacturacionRubro;
