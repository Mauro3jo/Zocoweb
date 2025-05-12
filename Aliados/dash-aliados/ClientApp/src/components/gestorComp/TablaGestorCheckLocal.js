// import hooks
import React, { useContext } from "react";

// import context
import { DarkModeContext } from "../../context/DarkModeContext";

// import component
import ItemsGestorCheckLocal from "./ItemsGestorCheckLocal";


const TablaGestorCheckLocal = ({ checkList }) => {
  const { darkMode } = useContext(DarkModeContext);


  return (
    <div className="">
      <div
        className={
          darkMode
            ? "container table-responsive"
            : "container table-responsive   "
        }
      >
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
                    Establecimiento 
                  </th>

                  <th
                    className={
                      darkMode
                        ? " text-dark  border-0 lato-regular fs-12 py-3 bg-white "
                        : " text-white  border-0 lato-regular fs-12 py-3 bg-dark "
                    }
                    scope="col "
                  >
                    Fecha - Hora
                  </th>
                  <th
                    className={
                      darkMode
                        ? " text-dark  border-0 lato-regular fs-12 py-3 bg-white "
                        : " text-white  border-0 lato-regular fs-12 py-3 bg-dark "
                    }
                    scope="col "
                  >
                    Mapa
                  </th>
                  <th
                    className={
                      darkMode
                        ? " text-dark  border-0 lato-regular fs-12 py-3 bg-white border-tabla-derecha"
                        : " text-white  border-0 lato-regular fs-12 py-3 bg-dark border-tabla-derecha"
                    }
                    scope="col "
                  >
                    Observaciones
                  </th>
                </tr>
              </thead>
              <tbody
                className={
                  darkMode ? "text-center bg-dark" : "text-center bg-white"
                }
              >
                {checkList.map((dato) => (
                  <ItemsGestorCheckLocal
                    {...dato} 
                    key={dato.id} 
                  />
                ))}
              </tbody>
            </table>
            {checkList.length === 0 && (
              <div className="text-center">
                <p className={darkMode ? "text-white" : "text-dark"}>
                  No se encontraron registros.
                </p>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default TablaGestorCheckLocal;
