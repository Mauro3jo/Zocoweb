import "./EvolucionMensual.css";
import { useContext, useState } from "react";
import { DarkModeContext } from "../context/DarkModeContext";
import { formatearAPeso } from "../helpers/formatearAPeso";
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
import { Form } from 'react-bootstrap';

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

const EvolucionMensual3Barras = ({ datosBack }) => {
  const { darkMode } = useContext(DarkModeContext);
  const [barraActiva, setBarraActiva] = useState(true);
  const [barraActivaInflacion, setBarraActivaInflacion] = useState(true);
  const [barraActivaOperaciones, setBarraActivaOperaciones] = useState(true);
  const { resumenUltimos7Meses } = datosBack;
  const datosResumenUltimosMeses = resumenUltimos7Meses || [];
  const totalBruto7Meses = datosResumenUltimosMeses.map(dato => dato.totalBruto).reverse();
  const totalOperaciones = datosResumenUltimosMeses.map(dato => dato.cantidadDatos).reverse();
  const ultimos7Meses = datosResumenUltimosMeses.map(dato => dato.mes).reverse();
  const totalBrutoMenosInflacion = datosResumenUltimosMeses.map(dato => dato.totalBrutoMenosInflacion).reverse();

  let meses = ultimos7Meses;

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
        boxWidth: 8,
        boxHeight: 8,
        callbacks: {
          label: function (context) {
            let label = context.dataset.label || "";
            if (label) {
              label += ": ";
            }
            if (context.parsed.y !== null) {
              if (
                label.includes("Por monto") ||
                label.includes("Ajuste por inflación")
              ) {
                label += formatearAPeso(context.parsed.y);
              } else {
                label += context.parsed.y;
              }
            }
            return label;
          },
        },
      },
    },
    scales: {
      y: {
        display: false,
        grid: {
          display: false,
        },
      },
      x: {
        grid: {
          display: false,
        },
        ticks: {
          color: "black", 
          font: {
            size: 14,
          },
        },
      },
    },
  };

  var midata = {
    labels: meses,
    datasets: [
      {
        label: "Por monto $ ",
        data: barraActiva ? totalBruto7Meses : [],
        backgroundColor: "#B4C400",
      },
      {
        label: "Ajuste por inflación $ ",
        data: barraActivaInflacion ? totalBrutoMenosInflacion : [],
        backgroundColor: "#292B2F",
      },
      {
        label: "Por cantidad de operaciones ",
        data: barraActivaOperaciones ? totalOperaciones : [],
        backgroundColor: "#B3B5BF",
      },
    ],
  };

  midata.datasets.forEach(function (dataset) {
    dataset.barPercentage = 1;
    dataset.barThickness = 40;
  });

  return (
    <div translate="no">
      <section className="container">
        <article className={darkMode ? " bg-grafica-dark px-5 pb-4 " : "bg-grafica  px-5 pb-3"}>
          <h2 className="fs-18 text-center pt-4">Evolución mensual<br/><span className="fs-12 text-center pt-4">bruto</span></h2>
          <div className="d-flex justify-content-center py-2">
            <Form className="d-flex">
              <Form.Check 
               type="switch"
                id="custom-switch-monto"
                label="Monto"
                checked={barraActiva}
                onChange={() => setBarraActiva(!barraActiva)}
                className="mx-2 lato-bold fs-12"
              />
              <Form.Check 
                type="switch"
                id="custom-switch-inflacion"
                label="Inflación"
                checked={barraActivaInflacion}
                onChange={() => setBarraActivaInflacion(!barraActivaInflacion)}
                className="mx-2 lato-bold fs-12"
              />
              <Form.Check 
                type="switch"
                id="custom-switch-operaciones"
                label="Operaciones"
                checked={barraActivaOperaciones}
                onChange={() => setBarraActivaOperaciones(!barraActivaOperaciones)}
                className="mx-2 lato-bold fs-12"
              />
            </Form>
          </div>
          <Bar className="padding-top-grafica-analisis d-block" data={midata} options={misoptions} />
        </article>
      </section>
    </div>
  );
};

export default EvolucionMensual3Barras;
