// import hooks
import React, { useContext } from "react";

// import context
import { DarkModeContext } from "../../context/DarkModeContext";

// import componentes
import ItemsTablaReclutamientoBusqueda from "./ItemsTablaReclutamientoBusqueda";

// import librerias
import { MagnifyingGlass } from "react-loader-spinner";

const TablaReclutamientoBuscador = ({
  listaBusqueda,
  manejarVerClick,
  actualizarListaBusquedas,
}) => {
  // darkmode context funcionalidad para el modo claro/oscuro
  const { darkMode } = useContext(DarkModeContext);

  // Estilos para el contenedor de los items de la tabla (tbody)
  const estilosContenedorItems = {
    display: "block",
    maxHeight: "400px", 
    overflowY: "auto",
    overflowX: "hidden",
  };

  // Estilos para simular el tbody dentro del div
  const estilosTbodySimulado = {
    display: "table",
    width: "100%", 
    tableLayout: "fixed", 
  };

  return (
    <div className="">
      <div className="">
        <div>
          <table className="table table-borderless responsive striped hover ">
            <thead className="border-0 ">
              <tr className="text-center tabla-thead">
                <th
                  className={
                    darkMode
                      ? " text-dark  border-0 lato-regular fs-12 py-3 bg-white border-tabla-izquierda"
                      : " text-white  border-0 lato-regular fs-12 py-3 bg-dark  border-tabla-izquierda"
                  }
                  scope="col"
                >
                  #
                </th>
                <th
                  className={
                    darkMode
                      ? " text-dark  border-0 lato-regular fs-12 py-3 bg-white"
                      : " text-white  border-0 lato-regular fs-12 py-3 bg-dark  "
                  }
                  scope="col"
                >
                  Fecha
                </th>
                <th
                  className={
                    darkMode
                      ? " text-dark  border-0 lato-regular fs-12 py-3 bg-white "
                      : " text-white  border-0 lato-regular fs-12 py-3 bg-dark "
                  }
                  scope="col "
                >
                  Nombre
                </th>
                <th
                  className={
                    darkMode
                      ? " text-dark  border-0 lato-regular fs-12 py-3 bg-white "
                      : " text-white  border-0 lato-regular fs-12 py-3 bg-dark "
                  }
                  scope="col "
                >
                  Puesto
                </th>
                <th
                  className={
                    darkMode
                      ? " text-dark  border-0 lato-regular fs-12 py-3 bg-white "
                      : " text-white  border-0 lato-regular fs-12 py-3 bg-dark "
                  }
                  scope="col "
                >
                  Provincia
                </th>
                <th
                  className={
                    darkMode
                      ? " text-dark  border-0 lato-regular fs-12 py-3 bg-white "
                      : " text-white  border-0 lato-regular fs-12 py-3 bg-dark "
                  }
                  scope="col "
                >
                  Cantidad
                </th>
                <th
                  className={
                    darkMode
                      ? " text-dark  border-0 lato-regular fs-12 py-3 bg-white "
                      : " text-white  border-0 lato-regular fs-12 py-3 bg-dark "
                  }
                  scope="col "
                >
                  Fecha de cierre
                </th>
                <th
                  className={
                    darkMode
                      ? " text-dark  border-0 lato-regular fs-12 py-3 bg-white "
                      : " text-white  border-0 lato-regular fs-12 py-3 bg-dark "
                  }
                  scope="col "
                >
                  Estado
                </th>
                <th
                  className={
                    darkMode
                      ? " text-dark  border-0 lato-regular fs-12 py-3 bg-white"
                      : " text-white  border-0 lato-regular fs-12 py-3 bg-dark "
                  }
                  scope="col "
                >
                  Detalle
                </th>
                <th
                  className={
                    darkMode
                      ? " text-dark  border-0 lato-regular fs-12 py-3 bg-white  border-tabla-derecha"
                      : " text-white  border-0 lato-regular fs-12 py-3 bg-dark  border-tabla-derecha"
                  }
                  scope="col "
                >
                  Editar
                </th>
              </tr>
            </thead>
          </table>
          <div style={estilosContenedorItems}>
            <table className="table table-borderless responsive striped hover">
              <tbody
                style={estilosTbodySimulado}
                className={
                  darkMode ? "text-center bg-dark" : "text-center bg-white"
                }
              >
                {listaBusqueda.map((dato) => (
                  <ItemsTablaReclutamientoBusqueda
                    actualizarListaBusquedas={actualizarListaBusquedas}
                    manejarVerClick={manejarVerClick}
                    dato={dato}
                    key={dato.id}
                  />
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
};

export default TablaReclutamientoBuscador;
