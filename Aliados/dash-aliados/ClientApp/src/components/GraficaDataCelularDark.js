// import hooks
import React, { useContext, useEffect } from "react";

// import context
import { DarkModeContext } from "../context/DarkModeContext";

// import libreria
import Chart from "chart.js/auto";

// import assets
import amexPNG from "../assets/img/amex-blanco.png";
import argencardPNG from "../assets/img/argencard-blanco.png";
import cabalPNG from "../assets/img/cabal-blanco.png";
import dinersPNG from "../assets/img/diners-blanco.png";
import masterPNG from "../assets/img/mastercard-blanco.png";
import naranjaxPNG from "../assets/img/naranjax-blanco.png";
import visaPNG from "../assets/img/visa-blanco.png";

const GraficaDataCelularDark = ({ datos }) => {
  // context modalidad claro/oscuro
  const { darkMode } = useContext(DarkModeContext);

  // variable para guardar el descuentosPorTARJETA
  const descuentosPorTarjeta = datos.descuentosPorTarjeta || [];

  // Objeto de imágenes
  const imagenes = {
    Visa: visaPNG,
    MasterCard: masterPNG,
    Argencard: argencardPNG,
    Amex: amexPNG,
    Diners: dinersPNG,
    Cabal: cabalPNG,
    Naranjax: naranjaxPNG,
  };

  // Ordenar y mapear descuentosPorTarjeta para obtener nombre, beneficio e imagen
  const tarjetasConBeneficios = descuentosPorTarjeta
    .sort((a, b) => b.totalConDescuento - a.totalConDescuento)
    .map((tarjeta) => ({
      nombre: tarjeta.tarjeta,
      beneficio: tarjeta.totalConDescuento || 0,
      imagen: imagenes[tarjeta.tarjeta],
    }));

  useEffect(() => {
    const imageItems = {
      id: "imageItems",
      beforeDatasetsDraw(chart, args, pluginOptions) {
        const {
          ctx,
          options,
          data,
          scales: { y },
        } = chart;

        ctx.save();
        const imageSize = options.layout.padding.left;

        data.datasets[0].data.forEach((_, index) => {
          const logo = new Image();
          logo.src = tarjetasConBeneficios[index].imagen;
          const imageY = y.getPixelForValue(data.labels[index]) - imageSize / 2;
          ctx.drawImage(logo, 0, imageY, imageSize, imageSize);
        });

        ctx.restore();
      },
    };

    const config = {
      type: "bar",
      data: {
        labels: tarjetasConBeneficios.map((t) => t.nombre),
        datasets: [
          {
            label: "",
            data: tarjetasConBeneficios.map((t) => t.beneficio),
            backgroundColor: ["#b4c400"],
            borderColor: ["#b4c400"],
            borderWidth: 1,
          },
        ],
      },
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
        },
        plugins: {
          legend: {
            display: false,
          },
          tooltip: {
            enabled: true,
            bodyFont: {
              size: 12, // Aumenta el tamaño de la fuente del texto del tooltip
            },
            padding: 10, // Aumenta el padding alrededor del texto
            boxWidth: 6, // Ajusta el ancho de la caja del color de fondo
            boxHeight: 6, // Ajusta la altura de la caja del color de fondo
            // Otras configuraciones del tooltip
            callbacks: {
              // Configuraciones de los callbacks, si las necesitas
            },
          },
        },
      },
      plugins: [imageItems],
    };

    const ctx = document.getElementById("myChart");
    const existingChart = Chart.getChart(ctx);

    if (existingChart) {
      existingChart.destroy();
    }

    new Chart(ctx, config);
  }, [descuentosPorTarjeta, tarjetasConBeneficios]);

  return (
    <div translate="no" className="container">
      <div
        className={
          darkMode ? " bg-grafica-celular-dark px-4" : "bg-grafica-celular px-4"
        }
      >
        <canvas className="" id="myChart" height="400"></canvas>
      </div>
    </div>
  );
};

export default GraficaDataCelularDark;
