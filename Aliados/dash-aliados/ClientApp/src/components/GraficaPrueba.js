import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend,
} from "chart.js";
import { useContext } from "react";
import { Bar } from "react-chartjs-2";
import { DarkModeContext } from "../context/DarkModeContext";

ChartJS.register(
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend
);
const options = {
  indexAxis: "x",
  elements: {
    bar: {
      borderWidth: 2,
    },
  },
  responsive: true,
  plugins: {
    legend: {
      position: "top",
    },
    title: {
      display: true,
      text: "Chart.js Horizontal Bar Chart",
      font: 15,
    },
  },
  scales: {
    x: {
      display: true,
      grid: {
        display: false,
      },
    },
    y: {
      display: false,
      grid: {
        display: false,
      },
    },
  },
};

const labels = [
  "Abril",
  "Mayo",
  "Junio",
  "Julio",
  "Agosto",
  "Septiembre",
  "Octubre",
];

const GraficaPrueba = () => {
  const { darkMode } = useContext(DarkModeContext);
  const backgroundColor = darkMode ? "#fff" : "#292B2F";
  const data = {
    labels,
    datasets: [
      {
        label: "Por monto",
        data: [1, 2, 3, 4, 5, 6, 7],
        backgroundColor: ["#b4c400"],
        borderWidth: 1,
      },
      {
        label: "Por cantidad de operaciones",
        data: [7, 6, 5, 4, 3, 2, 1],
        backgroundColor: [backgroundColor],
        borderWidth: 1,
      },
      {
        label: "Ajuste por inflación",
        data: [8, 6, 4, 9, 8, 7, 7, 8, 9],
        backgroundColor: ["#B3B5BF"],
      },
    ],
  };
  return (
    <div
      style={{
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        height: "100vh",
      }}
    >
      <Bar options={options} data={data} />
    </div>
  );
};

export default GraficaPrueba;
