// import hoja de estilos css 
import "./TripleGraficoAnalisis.css";

// import hooks 
import { useContext } from "react";

// import context 
import { DarkModeContext } from "../context/DarkModeContext";

// import funciones helpers 
// permite convertir los valores decimales en porcentaje 
import convertirDecimalAPorcentaje from "../helpers/convertirPorcentajeADecimal";
// para formatear un valor a moneda peso
import { formatearAPeso } from "../helpers/formatearAPeso";

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

const TripleGraficoAnalisis = ({ datosBack }) => {
  // context modalidad para la funcionalidad claro/oscuro
  const { darkMode } = useContext(DarkModeContext);

  // funcion para el color de la barra 
  const tickColor = darkMode ? "#fff" : "#292B2F";

  // extraigo los datos que me interesan utilizar de la variable datos Back 
  const {
    debito,
    credito,
    totalConDescuentoCuotas0,
    totalConDescuentoCuotas1,
    creditoFacturacion,
    debitoFacturacion,
    porcentajeporcuotas,
    porcentajeticket,
    porcentajetipopago,
    cuotas,
  } = datosBack;

  // variable para guardar el numero porcentual 
  let numeroPorcentual = porcentajeporcuotas || 0;

  // variable para guardar el numero porcentual pero dejando unicamente dos numeros
  let porcentajeFinal = numeroPorcentual.toFixed(2);

  // variable para dejar el porcentaje enteros cuotas 
  let porcentajeEnteroCuotas = convertirDecimalAPorcentaje(porcentajeFinal);

  // variable para guardar el numero porcentajeticket 
  let numeroPorcentualTicket = porcentajeticket || 0;

  // pasa el dato de la variable numeroPorcentualTicket por la funcion toFixed()
  let porcentajeFinalTicket = numeroPorcentualTicket.toFixed(2);

  // variable para guardar el porcentaje enteror final ticket 
  let porcentajeEnteroFinalTicket = convertirDecimalAPorcentaje(
    porcentajeFinalTicket
  );

  // variable para guardar el porcentaje tipo pago 
  let numeroPorcentualTipoPago = porcentajetipopago || 0;

  // pasa el dato de la variable numeroPorcentualTipoPago. por la funcion toFixed()
  let porcentajeFinalTipoPago = numeroPorcentualTipoPago.toFixed(2);

  // variable para guardar el porcentaje entero tipo pago 
  let porcentajeEnteroTipoPago = convertirDecimalAPorcentaje(
    porcentajeFinalTipoPago
  );

  // FACTURACION POR CUOTA GRAFICA 
  // beneficio muestra los datos numerico de debitofacturacion y creditoFacturacion 
  var beneficios = [debitoFacturacion, creditoFacturacion];

  // labels array que muestra los titulos de las barras 
  var labels = ["Débito", "Crédito"];

  // options de personalizacion de las barras 
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
            // Formatea el valor a formato de peso para mostrar en el tooltip
            label += formatearAPeso(context.parsed.y);
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
          color: tickColor, 
          font: {
            size: 12,
          },
        },
      },
    },
  };

  // datos utilizados para visualizar la grafica 
  var midataFacturacion = {
    labels: labels,
    datasets: [
      {
        label: "Monto $",
        data: beneficios,
        backgroundColor: "#B4C400",
      },
    ],
  };

  midataFacturacion.datasets.forEach(function (dataset) {
    dataset.barPercentage = 0.4;
    dataset.barThickness = 30;
  });

  // TICKET PROMEDIO
  // valores utilizados en ticket promedio para mostrar los numericos en la barra 
  var ticketValues = [debito, credito];

  // datos utilizados en la barra de ticket promedio 
  var midataTickets = {
    labels: labels,
    datasets: [
      {
        label: "Monto $",
        data: ticketValues,
        backgroundColor: "#B4C400",
      },
    ],
  };

  midataTickets.datasets.forEach(function (dataset) {
    dataset.barPercentage = 0.4;
    dataset.barThickness = 30;
  });

  // variable extraer  y guardar las cuotas 
  const cuotasExtraidas = cuotas || [];

  // funcion para filtrar las cuotas 
  const cuotasFiltradas = cuotasExtraidas.filter((cuota) => cuota.cuota !== 0);

  // funcion para order las cuotas 
  const cuotasOrdenadasPorCuota = cuotasFiltradas.sort(
    (a, b) => a.cuota - b.cuota
  );

  // variable para guardar en beneficios las cuotas ordernadas por cuota 
  var beneficios = cuotasOrdenadasPorCuota.map(
    (cuota) => cuota.totalBruto || 0
  );
  var cuotasOrdenadas = cuotasOrdenadasPorCuota.map((cuota) => cuota.cuota);

  // variable para guardar los datos de ventas 
  var midataVentas = {
    labels: cuotasOrdenadas,
    datasets: [
      {
        label: "Monto $",
        data: beneficios,
        backgroundColor: "#B4C400",
      },
    ],
  };

  midataVentas.datasets.forEach(function (dataset) {
    dataset.barPercentage = 1;
    dataset.barThickness = 30;
  });

  // Configuración de opciones para midataVentas
  const opcionesVentas = {
    plugins: {
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
            label += context.parsed.y.toFixed(2); 
            return label;
          },
        },
      },
    },
    scales: {
      y: {
        beginAtZero: true,
        ticks: {
          color: tickColor, 
        },
      },
      x: {
        ticks: {
          color: tickColor,
        },
      },
    },
  };

  return (
    <section translate="no" className="container py-analisis-grafica">
      <div className="row">
        <article className="col-12 col-lg-4 my-2">
          <div
            style={{ paddingTop: "0px", height: "100%" }}
            className={
              darkMode ? " bg-grafica-dark px-5 pb-4" : "bg-grafica px-5 pb-4"
            }
          >
            <h2 className="fs-18-a-16 py-4 text-center">
              Ventas por tipo de pago
            </h2>
            <div className="d-flex justify-content-center ">
              <Bar
                className="mx-4 my-4"
                data={midataFacturacion}
                options={misoptions}
              />
            </div>
          </div>
        </article>
        <article className="col-12 col-lg-4 my-2">
          <div
            style={{ paddingTop: "0px", height: "100%" }}
            className={
              darkMode ? " bg-grafica-dark px-5 pb-4" : "bg-grafica px-5 pb-4"
            }
          >
            <h2 className="fs-18-a-16 py-4 text-center">Ticket promedio</h2>
            <div className="d-flex justify-content-center ">
              <Bar
                className="mx-4 my-4"
                data={midataTickets}
                options={misoptions}
              />
            </div>
          </div>
        </article>
        <article className="col-12 col-lg-4 my-2">
          <div
            style={{ paddingTop: "0px", height: "100%" }}
            className={
              darkMode ? " bg-grafica-dark px-5 pb-4" : "bg-grafica px-5 pb-4"
            }
          >
            <h2 className="fs-18-a-16 py-4 text-center">
              Facturación por tipo de cuota
            </h2>
            <div className="d-flex justify-content-center ">
              <Bar
                className="mx-4 my-4"
                data={midataVentas}
                options={misoptions}
              />
            </div>
          </div>
        </article>
      </div>
    </section>
  );
};

export default TripleGraficoAnalisis;
