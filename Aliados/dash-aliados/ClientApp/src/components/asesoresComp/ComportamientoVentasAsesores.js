// IMPORT CSS DEL COMPONENTE
import "./ComportamientoVentasAsesores.css";

// IMPORT HOOKS, LIBRERIA Y CONTEXT
import React, { useContext } from "react";
import { DarkModeContext } from "../../context/DarkModeContext";
import { Bar } from "react-chartjs-2";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faCircleArrowDown,
  faCirclePause,
  faCircleUp,
} from "@fortawesome/free-solid-svg-icons";
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

const ComportamientoVentasAsesores = ({ datos }) => {
  const { darkMode } = useContext(DarkModeContext);

  // Función para calcular el porcentaje de cambio
  const calcularPorcentajeCambio = (actual, pasado) => {
    if (pasado === 0) {
      return actual > 0 ? Infinity : 0;
    }
    return ((actual - pasado) / pasado) * 100;
  };

  // Datos extraídos
  const VentaMesActual = datos?.ventaMesActual || 0;
  const VentasMesPasado = datos?.ventasmespasado || 0;
  const TotalPorCobrar = datos?.totalPorCobrar || 0;
  const comisionMesPasado = datos?.comisionMesPasado || 0;

  // Porcentajes de cambio
  const porcentajeCambioVentas = calcularPorcentajeCambio(
    VentaMesActual,
    VentasMesPasado
  );
  const porcentajeCambioComisiones = calcularPorcentajeCambio(
    TotalPorCobrar,
    comisionMesPasado
  );

  // Opciones para los gráficos
  var misoptions = {
    responsive: true,
    plugins: {
      legend: {
        display: false,
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
          color: darkMode ? "#fafafa" : "#292B2F",
        },
      },
    },
  };

  // Datos para el gráfico de Ventas
  var datosVentas = {
    labels: ["Mes Pasado", "Mes Actual"],
    datasets: [
      {
        label: "Ventas $",
        data: [VentasMesPasado, VentaMesActual],
        backgroundColor: ["#4D5360", "#B4C400"],
        barPercentage: 0.4,
        barThickness: 40,
      },
    ],
  };

  // Datos para el gráfico de Comisiones
  var datosComisiones = {
    labels: ["Mes Pasado", "Mes Actual"],
    datasets: [
      {
        label: "Comisiones $",
        data: [comisionMesPasado, TotalPorCobrar],
        backgroundColor: ["#4D5360", "#B4C400"],
        barPercentage: 0.4,
        barThickness: 40,
      },
    ],
  };

  // Función para mostrar el icono de cambio
  const mostrarIcono = (porcentajeCambio) => {
    if (porcentajeCambio > 0) {
      return (
        <FontAwesomeIcon className="color-verde me-2 fs-25" icon={faCircleUp} />
      );
    } else if (porcentajeCambio === 0) {
      return (
        <FontAwesomeIcon
          className="color-negro me-2 fs-25 fa-rotate-90"
          icon={faCirclePause}
        />
      );
    } else {
      return (
        <FontAwesomeIcon
          className="color-rojo me-2 fs-25"
          icon={faCircleArrowDown}
        />
      );
    }
  };

  return (
    <section className="">
      <article className="container">
        <div className="row">
          {/* Gráfico de Comparación de Ventas */}
          <div className="col-md-6 my-4">
            <div
              className={
                darkMode
                  ? "bg-comparacion-ventas-dark"
                  : "bg-comparacion-ventas"
              }
            >
              <h5 className="text-center py-4 lato-bold fs-14">Ventas</h5>
              <Bar data={datosVentas} options={misoptions} />

              <article className="d-flex justify-content-center">
                <div
                  className={
                    darkMode
                      ? " btn-comparativa-dark py-2 d-flex justify-content-center "
                      : "btn-comparativa py-2 d-flex justify-content-center "
                  }
                >
                  {mostrarIcono(porcentajeCambioVentas)}
                  <span className="lato-bold fs-18">
                    {porcentajeCambioVentas.toFixed(2)} %
                  </span>
                </div>
              </article>
            </div>
          </div>

          {/* Gráfico de Comparación de Comisiones */}
          <div className="col-md-6 my-4">
            <div
              className={
                darkMode
                  ? "bg-comparacion-ventas-dark"
                  : "bg-comparacion-ventas"
              }
            >
              <h5 className="text-center py-4 lato-bold fs-14">Comisión</h5>
              <Bar data={datosComisiones} options={misoptions} />
              <article className="d-flex justify-content-center">
                <div
                  className={
                    darkMode
                      ? " btn-comparativa-dark py-2 d-flex justify-content-center "
                      : "btn-comparativa py-2 d-flex justify-content-center "
                  }
                >
                  {mostrarIcono(porcentajeCambioComisiones)}
                  <span className="lato-bold fs-18">
                    {porcentajeCambioComisiones.toFixed(2)} %
                  </span>
                </div>
              </article>
            </div>
          </div>
        </div>
      </article>
    </section>
  );
};

export default ComportamientoVentasAsesores;
