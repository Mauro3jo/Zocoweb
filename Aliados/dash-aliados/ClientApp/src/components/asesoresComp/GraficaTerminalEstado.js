// import css
import "./GraficaTerminalEstado.css";

// import hooks, librerias y context
import { useContext, useEffect, useState } from "react";
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
import { DarkModeContext } from "../../context/DarkModeContext";

// import component
import IconosGraficaStock from "./IconosGraficaStock";

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

const GraficaTerminalEstado = ({ datos = { sumatoriaPorDecicion: [] } }) => {
  // darkmode para efectuar la funcionalidad del modo claro/oscuro
  const { darkMode } = useContext(DarkModeContext);

  // extraigo del datos las decisiones
  const decisiones =
    datos && datos.sumatoriaPorDecicion
      ? datos.sumatoriaPorDecicion.map((item) => item.decisionTomada)
      : [];
  const cantidades =
    datos && datos.sumatoriaPorDecicion
      ? datos.sumatoriaPorDecicion.map((item) => item.cantidad)
      : [];

  // estado para hacer responsive las barras
  const [barThickness, setBarThickness] = useState(9);

  // funcionalidad para ajustar las barras en responsive
  useEffect(() => {
    // Ajusta el valor de barThickness según el tamaño de pantalla
    const handleResize = () => {
      setBarThickness(window.innerWidth < 768 ? 8 : 9);
    };
    window.addEventListener("resize", handleResize);
    handleResize();
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  // options de la grafica
  var misoptions = {
    responsive: true,
    plugins: {
      legend: {
        display: false,
      },
      tooltip: {
        enabled: true,
        callbacks: {
          label: (context) =>
            `${decisiones[context.dataIndex]}: ${
              cantidades[context.dataIndex]
            }`,
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
        display: true, 
        grid: {
          display: false,
        },
        ticks: {
          display: false, 
        },
      },
    },
  };

  // datos de las graficas
  var midata = {
    labels: decisiones || [],
    datasets: [
      {
        data: cantidades || [],
        backgroundColor: darkMode ? "#B4C400" : "#B4C400",
      },
    ],
  };

  useEffect(() => {
    const updateBarThickness = () => {
      const width = window.innerWidth;
      if (width < 768) {
        // Celular
        setBarThickness(30);
      } else if (width >= 768 && width < 1024) {
        // Tablet
        setBarThickness(40);
      } else if (width >= 1024 && width < 1280) {
        // Notebook
        setBarThickness(40);
      } else {
        // Escritorio
        setBarThickness(80);
      }
    };

    window.addEventListener("resize", updateBarThickness);
    updateBarThickness(); // Llama inicialmente para establecer el valor basado en el tamaño actual de la ventana

    return () => window.removeEventListener("resize", updateBarThickness);
  }, []);

  midata.datasets.forEach(function (dataset) {
    dataset.barPercentage = 0.8;
    dataset.barThickness = barThickness; // Ahora es dinámica con la funcion de arriba para hacer responsive
  });

  return (
    <section className="container my-4">
      <article
        className={
          darkMode ? "bg-grafica-dark px-5 pb-3" : "bg-grafica px-5 pb-3"
        }
      >
        <section className="container my-4">
          <h2 className="fs-18 text-center pt-4">Terminal por estados</h2>
          <Bar data={midata} options={misoptions} />
          <IconosGraficaStock decisiones={decisiones} />
        </section>
      </article>
    </section>
  );
};

export default GraficaTerminalEstado;
