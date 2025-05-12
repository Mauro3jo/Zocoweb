// import hooks
import React, { useContext } from "react";

// import context
import { DarkModeContext } from "../../context/DarkModeContext";

// import componentes
import ItemsTablaReclutamientoContratados from "./ItemTablaReclutamientoContratados";

const TablaReclutamientoContratados = ({
  listaContratados,
  manejarVerClick,
  onContratadoCreadoOEditado
}) => {
  // darkmode context funcionalidad para el modo claro/oscuro
  const { darkMode } = useContext(DarkModeContext);
  
  // Estilos para el contenedor de la tabla que permite el scroll
  const scrollableTableStyle = {
    display: 'block',
    maxHeight: '500px',
    overflowY: 'scroll',
    overflowX: 'hidden',
  };

  return (
    <div className="">
      <div className="">
        <div style={scrollableTableStyle}>
        <table className="table table-borderless responsive striped hover" >
            <thead className="border-0" >
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
                  Búsqueda
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
                  Fecha de contratación
                </th>
                <th
                  className={
                    darkMode
                      ? " text-dark  border-0 lato-regular fs-12 py-3 bg-white "
                      : " text-white  border-0 lato-regular fs-12 py-3 bg-dark "
                  }
                  scope="col "
                >
                  Detalle
                </th>
                <th
                  className={
                    darkMode
                      ? " text-dark  border-0 lato-regular fs-12 py-3 bg-white border-tabla-derecha"
                      : " text-white  border-0 lato-regular fs-12 py-3 bg-dark border-tabla-derecha"
                  }
                  scope="col "
                >
                  Editar
                </th>
              </tr>
            </thead>
            <tbody
            
              className={
                darkMode ? "text-center bg-dark" : "text-center bg-white"
              }
              >
              {listaContratados.map((dato) => (
                <ItemsTablaReclutamientoContratados
                  manejarVerClick={manejarVerClick}
                  dato={dato}
                  key={dato.id}
                  onContratadoCreadoOEditado={onContratadoCreadoOEditado}
                />
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default TablaReclutamientoContratados;
