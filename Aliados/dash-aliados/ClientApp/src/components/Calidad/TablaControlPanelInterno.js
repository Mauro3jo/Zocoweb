import React, { useContext, useState } from "react";
import { Table } from "react-bootstrap";
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

const TablaControlPanelInterno = ({ data }) => {
  const [excludedUsers, setExcludedUsers] = useState([]);
  const { darkMode } = useContext(DarkModeContext);

  // Obtener todas las claves únicas de los diccionarios CanalAtencionConteo y EstadoConteo
  const allCanalKeys = [
    ...new Set(
      data.flatMap((item) =>
        Object.keys(item.datosMesUsuario.canalAtencionConteo)
      )
    ),
  ];
  const allEstadoKeys = [
    ...new Set(
      data.flatMap((item) => Object.keys(item.datosMesUsuario.estadoConteo))
    ),
  ];

  // Calcular los datos totales de canalAtencionConteo
  const totalCanalAtencionConteo = allCanalKeys.reduce((acc, key) => {
    acc[key] = data.reduce(
      (sum, item) => sum + (item.datosMesUsuario.canalAtencionConteo[key] || 0),
      0
    );
    return acc;
  }, {});

  // Calcular los datos excluyendo los usuarios seleccionados
  const filteredCanalAtencionConteo = allCanalKeys.reduce((acc, key) => {
    acc[key] = data.reduce((sum, item) => {
      if (!excludedUsers.includes(item.nombreUsuario)) {
        return sum + (item.datosMesUsuario.canalAtencionConteo[key] || 0);
      }
      return sum;
    }, 0);
    console.log(allCanalKeys);
    return acc;
  }, {});

  // Crear datos para el gráfico de barras
  const chartData = {
    labels: allCanalKeys,
    datasets: [
      {
        label: "Total por Canal de Atención",
        data: allCanalKeys.map((key) => filteredCanalAtencionConteo[key]),
        backgroundColor: [
          "#000000",
          "#707070",
          "#D0D7E2",
          "#97A213",
          "#B4C400",
          "#E24444",
          "#E89F2F",
          "#EFCA39",
          "#EEE9A3",

        ]
      },
    ],
  };

  const chartOptions = {
    responsive: true,
    plugins: {
      legend: {
        display: true,
      },
      tooltip: {
        enabled: true,
        mode: "index",
        intersect: false,
      },
    },
    scales: {
      y: {
        beginAtZero: true,
      },
    },
  };

  const toggleUser = (user) => {
    setExcludedUsers((prev) => {
      if (prev.includes(user)) {
        return prev.filter((u) => u !== user);
      } else {
        return [...prev, user];
      }
    });
  };

  return (
    <div
      className={
        darkMode
          ? "container table-responsive py-3 px-5"
          : "container table-responsive py-3 px-5"
      }
    >
      <section translate="no" className="container py-analisis-grafica">
        <article className="col-12 col-lg-12 my-12">
          <div
            style={{
              marginBottom: "20px",
              display: "flex",
              justifyContent: "space-between",
              alignItems: "center",
              flexWrap: "wrap",
              gap: "20px",
            }}
          >
            {data.map((item, index) => (
              <div
                key={index}
                style={{ display: "flex", alignItems: "center" }}
              >
                <button
                  onClick={() => toggleUser(item.nombreUsuario)}
                  style={{
                    width: "20px", // Tamaño del círculo
                    height: "20px",
                    backgroundColor: excludedUsers.includes(item.nombreUsuario)
                      ? "#000000" // gris cuando está seleccionado
                      : "#8BC34A", // verde cuando no está seleccionado
                    border: "none",
                    borderRadius: "50%", // Crea el círculo
                    cursor: "pointer",
                    marginRight: "10px", // Espacio entre el círculo y el nombre
                  }}
                />
                <span style={{ fontSize: "12px" }}>{item.nombreUsuario}</span>
              </div>
            ))}
          </div>
          <div style={{ height: "400px", marginBottom: "50px" }}>
            <Bar data={chartData} options={chartOptions} />
          </div>
        </article>
      </section>

      <article>
        <div
          className={
            darkMode
              ? "container table-responsive py-3 px-5"
              : "container table-responsive py-3 px-5"
          }
        >
          <Table table table-borderless responsive striped hover>
            <thead className="bg-dark py-2">
              <tr className="text-center tabla-thead">
                <th
                  className={
                    darkMode
                      ? "bg-white text-dark border-tabla-izquierda border-0 lato-regular fs-14 py-3"
                      : "bg-dark text-white border-tabla-izquierda border-0 lato-regular fs-14 py-3"
                  }
                  scope="col"
                >
                  Nombre Usuario
                </th>
                {allEstadoKeys.map((key, index) => (
                  <th
                    className={
                      darkMode
                        ? "bg-white text-dark border-0 lato-regular fs-14 py-3"
                        : "bg-dark text-white fs-14 lato-regular py-3"
                    }
                    scope="col"
                    key={`estado-${index}`}
                  >
                    {key.charAt(0).toUpperCase() + key.slice(1)}
                  </th>
                ))}
                <th
                  className={
                    darkMode
                      ? "bg-white text-dark border-0 border-tabla-derecha lato-regular fs-14 py-3"
                      : "bg-dark text-white fs-14 lato-regular py-3 border-tabla-derecha"
                  }
                  scope="col"
                >
                  Cantidad Total
                </th>{" "}
                {/* Mover Cantidad Total al final */}
              </tr>
            </thead>
            <tbody className="text-center">
              {data.map((item, index) => (
                <tr
                  className={
                    darkMode ? "bg-dark text-white" : "bg-white text-dark"
                  }
                  key={index}
                >
                  <td
                    className={
                      darkMode
                        ? "fs-14 lato-regular py-4 prority-4 text-white "
                        : "fs-14 lato-regular py-4 prority-4 "
                    }
                  >
                    {item.nombreUsuario}
                  </td>
                  {allEstadoKeys.map((key, idx) => (
                    <td
                      className={
                        darkMode
                          ? "fs-14 lato-regular py-4 prority-4 text-white "
                          : "fs-14 lato-regular py-4 prority-4 "
                      }
                      key={`estado-${index}-${idx}`}
                    >
                      {item.datosMesUsuario.estadoConteo[key] || 0}
                    </td>
                  ))}
                  <td
                    className={
                      darkMode
                        ? "fs-14 lato-regular py-4 prority-4 text-white "
                        : "fs-14 lato-regular py-4 prority-4 "
                    }
                  >
                    {item.datosMesUsuario.cantidadTotal}
                  </td>{" "}
                  {/* Mover Cantidad Total al final */}
                </tr>
              ))}
            </tbody>
          </Table>
        </div>
      </article>
    </div>
  );
};

export default TablaControlPanelInterno;
