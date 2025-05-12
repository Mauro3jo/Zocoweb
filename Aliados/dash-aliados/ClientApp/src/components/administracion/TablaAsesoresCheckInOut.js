// import hooks
import React, { useContext, useState, useEffect } from "react";

// import context
import { DarkModeContext } from "../../context/DarkModeContext";

// import componentes
import ItemsTablaCheckInOut from "./ItemsTablaCheckInOut";

// import librerias
import { MagnifyingGlass } from "react-loader-spinner";

const TablaAsesoresCheckInOut = ({ checkList, cargando }) => {
  // darkmode context funcionalidad para el modo claro/oscuro
  const { darkMode } = useContext(DarkModeContext);

  const [filtro, setFiltro] = useState("");
    const [listaFiltrada, setListaFiltrada] = useState([]);
  // Actualizar lista filtrada cuando cambia checkList o filtro
  useEffect(() => {
    if (filtro) {
      const filteredData = checkList.filter(
        (item) =>
          item.nombre &&
          item.nombre.toLowerCase().includes(filtro.toLowerCase())
      );
      setListaFiltrada(filteredData);
    } else {
      setListaFiltrada(checkList);
    }
  }, [filtro, checkList]);

  return (
    <div className="">
      <div
        className={
          darkMode
            ? " container table-responsive"
            : "container table-responsive   "
        }
      >
        <div className="">
          <div>
            <article className="container">
              <div className="filtro-terminal mb-3">
                <div className="my-3 d-flex ">
                  <h6 className="my-3 me-3 fs-18-a-16 ">Buscar: </h6>
                  <div className="campo-busqueda ">
                    <input
                      type="text"
                      className={
                        darkMode
                          ? " form-control text-white label-buscador-dark lato-regular fs-18 border-0"
                          : "form-control label-buscador lato-regular fs-18 border-0"
                      }
                      placeholder="Nombre asesor"
                      value={filtro}
                      onChange={(e) => setFiltro(e.target.value)}
                    />
                  </div>
                </div>
              </div>
            </article>

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
                    Nombre Asesor
                  </th>
                  <th
                    className={
                      darkMode
                        ? " text-dark  border-0 lato-regular fs-12 py-3 bg-white "
                        : " text-white  border-0 lato-regular fs-12 py-3 bg-dark "
                    }
                    scope="col "
                  >
                    Local
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
                    Tipo
                  </th>
                  <th
                    className={
                      darkMode
                        ? " text-dark  border-0 lato-regular fs-12 py-3 bg-white "
                        : " text-white  border-0 lato-regular fs-12 py-3 bg-dark "
                    }
                    scope="col "
                  >
                    Foto
                  </th>
                  <th
                    className={
                      darkMode
                        ? " text-dark  border-0 lato-regular fs-12 py-3 bg-white "
                        : " text-white  border-0 lato-regular fs-12 py-3 bg-dark "
                    }
                    scope="col "
                  >
                    Foto Terminal
                  </th>
                  <th
                    className={
                      darkMode
                        ? " text-dark  border-0 lato-regular fs-12 py-3 bg-white "
                        : " text-white  border-0 lato-regular fs-12 py-3 bg-dark "
                    }
                    scope="col "
                  >
                    Grabacion
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
                {cargando ? (
                  <tr className="text-center ">
                    <td colSpan="10" className="lato-bold fs-12-a-10">
                      <MagnifyingGlass
                        visible={true}
                        height="80"
                        width="80"
                        ariaLabel="magnifying-glass-loading"
                        wrapperStyle={{}}
                        wrapperClass="magnifying-glass-wrapper"
                        glassColor="#c0efff"
                        color="#b4c400"
                      />
                    </td>
                  </tr>
                ) : (
                  listaFiltrada.map((dato) => (
                    <ItemsTablaCheckInOut
                      {...dato}
                      key={dato.id}
                    ></ItemsTablaCheckInOut>
                  ))
                )}
              </tbody>
            </table>
            {listaFiltrada.length === 0 && (
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

export default TablaAsesoresCheckInOut;
