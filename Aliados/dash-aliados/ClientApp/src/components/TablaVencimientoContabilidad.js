// import hoja de estilo css
import "./TablaVencimientoContabilidad.css";

// import hooks
import React, { useContext, useState, useEffect } from "react";

// import context
import { DarkModeContext } from "../context/DarkModeContext";

// datos del mapeo de los meses
const datos = [
  { id: 1, mes: "Enero", de0a1: "18/01", de2a3: "19/01", de4a5: "22/01", de6a7: "23/01", de8a9: "24/01" },
  { id: 2, mes: "Febrero", de0a1: "19/02", de2a3: "20/02", de4a5: "21/02", de6a7: "22/02", de8a9: "23/02" },
  { id: 3, mes: "Marzo", de0a1: "18/03", de2a3: "19/03", de4a5: "20/03", de6a7: "21/03", de8a9: "22/03" },
  { id: 4, mes: "Abril", de0a1: "18/04", de2a3: "19/04", de4a5: "22/04", de6a7: "23/04", de8a9: "24/04" },
  { id: 5, mes: "Mayo", de0a1: "20/05", de2a3: "21/05", de4a5: "22/05", de6a7: "23/05", de8a9: "24/05" },
  { id: 6, mes: "Junio", de0a1: "18/06", de2a3: "19/06", de4a5: "24/06", de6a7: "25/06", de8a9: "26/06" },
  { id: 7, mes: "Julio", de0a1: "18/07", de2a3: "19/07", de4a5: "22/07", de6a7: "23/07", de8a9: "24/07" },
  { id: 8, mes: "Agosto", de0a1: "19/08", de2a3: "20/08", de4a5: "21/08", de6a7: "22/08", de8a9: "23/08" },
  { id: 9, mes: "Septiembre", de0a1: "18/09", de2a3: "19/09", de4a5: "20/09", de6a7: "23/09", de8a9: "24/09" },
  { id: 10, mes: "Octubre", de0a1: "18/10", de2a3: "21/10", de4a5: "22/10", de6a7: "23/10", de8a9: "24/10" },
  { id: 11, mes: "Noviembre", de0a1: "19/11", de2a3: "20/11", de4a5: "21/11", de6a7: "22/11", de8a9: "25/11" },
  { id: 12, mes: "Diciembre", de0a1: "18/12", de2a3: "19/12", de4a5: "20/12", de6a7: "23/12", de8a9: "24/12" },
];

const TablaVencimientoContabilidad = () => {
  // darkmode context para la funcionalidad de
  const { darkMode } = useContext(DarkModeContext);

  // Obtener mes actual
  const [mesActual, setMesActual] = useState(new Date().getMonth() + 1);

  // Filtrar datos según el mes actual
  const datosFiltrados = datos.filter(dato => dato.id >= mesActual);

  // estilo en linea de la tabla para dejar el fixed
  const tableContainerStyle = {
    maxHeight: "500px",
    overflowY: "auto",
  };

  const stickyHeaderStyle = {
    position: "sticky",
    top: 0,
    zIndex: 1020,
    backgroundColor: darkMode ? "#343a40" : "#fff",
  };

  return (
    <section className="container">
      <div className="">
        <div className="d-none d-lg-block">
          <div
            className={`header-container  ${
              darkMode ? "bg-secondary text-white py-3" : "bg-dark  py-3 "
            }`}
            style={{ borderRadius: "30px 30px 0px 0px" }}
          >
            <article className="d-flex justify-content-center  ">
              <div
                className={
                  darkMode
                    ? "text-white lato-bold mx-5  "
                    : "text-white lato-bold mx-5  "
                }
              >
                Calendario de vencimientos 2024 - IVA DDJJ
              </div>
            </article>
          </div>
        </div>

        <div className="d-lg-none d-block">
          <div
            style={{ borderRadius: "30px 30px 0px 0px" }}
            className={`header-container ${
              darkMode ? "dark-mode" : "bg-dark py-3 "
            }`}
          >
            <article className="text-center">
              <div className="text-white lato-bold mx-5  fs-14">
                Calendario de vencimientos 2024 - IVA DDJJ
              </div>
            </article>
          </div>
        </div>
        <div
          className={`table-container ${darkMode ? "dark-mode" : ""}`}
          style={tableContainerStyle}
        >
          <table className="table table-borderless responsive striped hover">
            <thead className="border-0">
              <tr className="text-center tabla-thead fs-12">
                {["MES", "0 -1", "2 -3", "4-5", "6-7", "8-9"].map(
                  (header, index) => (
                    <th
                      key={index}
                      style={{
                        ...stickyHeaderStyle,
                        backgroundColor: index < 7 ? "#b4c400 " : "#e24444 ", 
                      }}
                      scope="col"
                    >
                      {header}
                    </th>
                  )
                )}
              </tr>
            </thead>

            <tbody className="text-center bg-white">
              {datosFiltrados.map((dato) => (
                <tr
                  key={dato.id}
                  className={
                    darkMode ? "tabla-borde-bottom" : "tabla-borde-bottom"
                  }
                >
                  <td
                    className="lato-regular text-dark py-3"
                    style={{ fontSize: "10px" }}
                  >
                    {dato.mes}
                  </td>
                  <td
                    className=" lato-regular py-3"
                    style={{ fontSize: "10px" }}
                  >
                    {dato.de0a1}
                  </td>
                  <td
                    className="lato-regular py-3"
                    style={{ fontSize: "10px" }}
                  >
                    {dato.de2a3}
                  </td>
                  <td
                    className=" lato-regular py-3"
                    style={{ fontSize: "10px" }}
                  >
                    {dato.de4a5}
                  </td>
                  <td
                    className=" lato-regular py-3"
                    style={{ fontSize: "10px" }}
                  >
                    {dato.de6a7}
                  </td>
                  <td
                    className=" lato-regular py-3"
                    style={{ fontSize: "10px" }}
                  >
                    {dato.de8a9}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </section>
  );
};

export default TablaVencimientoContabilidad;