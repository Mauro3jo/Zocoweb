// Import hooks, librerias y context
import React, { useContext, useState } from "react";
import Select from "react-select";
import { DarkModeContext } from "../../context/DarkModeContext";
import {
  faCaretUp,
  faCaretDown,
  faMinus,
} from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";

const TablaStockAsesores = ({ datos = [] }) => {
  // darkmode para la funcionalidad claro/oscuro
  const { darkMode } = useContext(DarkModeContext);

  // estado para el filtro de busqueda
  const [filtroBusqueda, setFiltroBusqueda] = useState("");

  // estado para el filtro de decisiones
  const [filtroDecision, setFiltroDecision] = useState(null);

  // extraigo desde los datos recibidos de la base los comercios.
  const comercios = datos ? datos.agrupadoPorComercio : [];

  // funcion para formatear los datos en peso
  const formatCurrency = (value) => {
    return new Intl.NumberFormat("es-AR", {
      style: "currency",
      currency: "ARS",
    }).format(value);
  };

  // funciona que compara los datos de facturacion mes pasado y actual
  // y en base a ello asigna un icono.
  const getComparadorIcon = (facturaciónMesPasado, facturaciónMesEnCurso) => {
    if (facturaciónMesEnCurso > facturaciónMesPasado) {
      return <FontAwesomeIcon icon={faCaretUp} className="color-verde" />;
    } else if (facturaciónMesEnCurso < facturaciónMesPasado) {
      return <FontAwesomeIcon icon={faCaretDown} className="color-rojo" />;
    } else {
      return <FontAwesomeIcon icon={faMinus} className="color-negro" />;
    }
  };
  // Estilo en línea para el contenedor de la tabla
  const tableContainerStyle = {
    maxHeight: "500px", 
    overflowY: "auto",
  };

  // Estilos en línea para los encabezados de la tabla para hacerlos fijos
  const stickyHeaderStyle = {
    position: "sticky",
    top: 0,
    zIndex: 1020,
    backgroundColor: darkMode ? "#343a40" : "#fff", 
  };

  // Preparar las opciones para el filtro de decisión tomada
  const decisiones = Array.from(
    new Set(
      comercios.flatMap((comercio) =>
        comercio.terminales.map((terminal) => terminal.decisionTomada)
      )
    )
  )
    .filter((decision) => decision) // Filtrar posibles valores vacíos o undefined
    .map((decision) => ({ value: decision, label: decision }));

  const handleDecisionChange = (selectedOption) => {
    setFiltroDecision(selectedOption);
  };

  const [filtroActivacion, setFiltroActivacion] = useState(null);
  // Preparar las opciones para el filtro de activación
  const activaciones = Array.from(
    new Set(
      comercios.flatMap((comercio) =>
        comercio.terminales.map((terminal) => terminal.activacion)
      )
    )
  )
    .filter((activacion) => activacion) // Filtrar posibles valores vacíos o undefined
    .map((activacion) => ({ value: activacion, label: activacion }));

  const handleActivacionChange = (selectedOption) => {
    setFiltroActivacion(selectedOption);
  };

  return (
    <div className="container">
      <section className="container d-none d-lg-block">
        <section className="d-flex ">
          <article>
            <div className="filtro-terminal mb-3">
              <div className="my-3 d-flex ">
                <h6 className="my-3 me-3 fs-18-a-16 ">Filtrar: </h6>
                <div className="campo-busqueda ">
                  <input
                    type="text"
                    className={
                      darkMode
                        ? " form-control text-white label-buscador-dark lato-regular fs-18 border-0 my-2"
                        : "form-control label-buscador lato-regular fs-18 border-0 my-2"
                    }
                    placeholder="Comercio o terminal"
                    value={filtroBusqueda}
                    onChange={(e) => setFiltroBusqueda(e.target.value)}
                  />
                </div>
              </div>
            </div>
          </article>
          <article>
            <div className=" mx-2">
              <h6 className="ms-3 fs-14 ">Decisión Tomada </h6>
              <Select
                className="select__control_custom-comparativo"
                classNamePrefix="select"
                placeholder="Todas"
                value={filtroDecision}
                onChange={handleDecisionChange}
                options={decisiones}
                isClearable
              />
            </div>
          </article>
          <article>
            <div className="mx-2">
              <h6 className="ms-3 fs-14">Activación</h6>
              <Select
                className="select__control_custom-comparativo"
                classNamePrefix="select"
                placeholder="Todas"
                value={filtroActivacion}
                onChange={handleActivacionChange}
                options={activaciones}
                isClearable
              />
            </div>
          </article>
        </section>
      </section>
      <section className="container d-lg-none d-block">
        <article>
          <div className="filtro-terminal mb-3">
            <div className="my-3 d-flex ">
              <h6 className="my-3 me-3 fs-18-a-16 ">Filtrar: </h6>
              <div className="campo-busqueda ">
                <input
                  type="text"
                  className={
                    darkMode
                      ? " form-control text-white label-buscador-dark lato-regular fs-18 border-0"
                      : "form-control label-buscador lato-regular fs-18 border-0"
                  }
                  placeholder="Comercio o terminal"
                  value={filtroBusqueda}
                  onChange={(e) => setFiltroBusqueda(e.target.value)}
                />
              </div>
            </div>
          </div>
        </article>
        <article>
          <div className="my-2">
            <h6 className="ms-1 fs-14 ">Decisión Tomada </h6>
            <Select
              className=""
              classNamePrefix="select"
              placeholder="Todas"
              value={filtroDecision}
              onChange={handleDecisionChange}
              options={decisiones}
              isClearable
            />
          </div>
        </article>
        <article>
          <div className="my-4">
            <h6 className="ms-1 fs-14">Activación</h6>
            <Select
              className=""
              classNamePrefix="select"
              placeholder="Todas"
              value={filtroActivacion}
              onChange={handleActivacionChange}
              options={activaciones}
              isClearable
            />
          </div>
        </article>
      </section>
      <div
        className={`table-container  ${darkMode ? "" : ""}`}
        style={tableContainerStyle}
      >
        <table className="table table-borderless responsive striped hover">
          <thead className="border-0">
            <tr className="text-center tabla-thead">
              <th
                className={
                  darkMode
                    ? "bg-secondary text-white border-tabla-izquierda border-0 lato-regular fs-12 py-3"
                    : "bg-dark text-white border-tabla-izquierda border-0 lato-regular fs-12 py-3"
                }
                scope="col"
              >
                Comercio
              </th>
              <th
                className={
                  darkMode
                    ? "bg-secondary text-white border-0 lato-regular fs-12 py-3"
                    : "bg-dark text-white fs-12 lato-regular py-3"
                }
                scope="col"
              >
                Terminal
              </th>
              <th
                className={
                  darkMode
                    ? "bg-secondary text-white border-0 lato-regular fs-12 py-3"
                    : "bg-dark text-white fs-12 lato-regular py-3"
                }
                scope="col"
              >
                Activación
              </th>
              <th
                className={
                  darkMode
                    ? "bg-secondary text-white border-0 lato-regular fs-12 py-3"
                    : "bg-dark text-white fs-12 lato-regular py-3"
                }
                scope="col"
              >
                Tipo de Alta
              </th>
              <th
                className={
                  darkMode
                    ? "bg-secondary text-white border-0 lato-regular fs-12 py-3"
                    : "bg-dark text-white fs-12 lato-regular py-3"
                }
                scope="col"
              >
                Decisión Tomada
              </th>
              <th
                className={
                  darkMode
                    ? "bg-secondary text-white border-0 lato-regular fs-12 py-3"
                    : "bg-dark text-white fs-12 lato-regular py-3"
                }
                scope="col"
              >
                Facturación mes pasado
              </th>
              <th
                className={
                  darkMode
                    ? "bg-secondary text-white border-0 lato-regular fs-12 py-3 border-tabla-derecha"
                    : "bg-dark text-white fs-12 lato-regular py-3 border-tabla-derecha"
                }
                scope="col"
              >
                Facturación mes en curso
              </th>
            </tr>
          </thead>
          <tbody className="text-center bg-white">
            {comercios
              .filter(
                (comercio) =>
                  (filtroBusqueda === "" ||
                    comercio.comercio
                      .toLowerCase()
                      .includes(filtroBusqueda.toLowerCase()) ||
                    comercio.terminales.some((terminal) =>
                      terminal.terminal.toString().includes(filtroBusqueda)
                    )) &&
                  (filtroDecision === null ||
                    comercio.terminales.some(
                      (terminal) =>
                        terminal.decisionTomada === filtroDecision.value
                    )) &&
                  (filtroActivacion === null ||
                    comercio.terminales.some(
                      (terminal) =>
                        terminal.activacion === filtroActivacion.value
                    ))
              )
              .map((comercio, indexComercio) => (
                <React.Fragment key={indexComercio}>
                  {comercio.terminales
                    .filter(
                      (terminal) =>
                        (filtroBusqueda === "" ||
                          terminal.terminal
                            .toString()
                            .includes(filtroBusqueda) ||
                          comercio.comercio
                            .toLowerCase()
                            .includes(filtroBusqueda.toLowerCase())) &&
                        (filtroDecision === null ||
                          terminal.decisionTomada === filtroDecision.value) &&
                        (filtroActivacion === null ||
                          terminal.activacion === filtroActivacion.value)
                    )
                    .map((terminal, indexTerminal) => (
                      <tr key={indexTerminal}>
                        <td
                          className={
                            darkMode
                              ? " fs-12-a-10 lato-regular text-dark py-2"
                              : " fs-12-a-10 lato-regular text-dark py-2"
                          }
                        >
                          {comercio.comercio}
                        </td>
                        <td
                          className={
                            darkMode
                              ? " fs-12-a-10 lato-regular text-dark py-2"
                              : " fs-12-a-10 lato-regular text-dark py-2"
                          }
                        >
                          {terminal.terminal}
                        </td>
                        <td
                          className={
                            darkMode
                              ? " fs-12-a-10 lato-regular text-dark py-2"
                              : " fs-12-a-10 lato-regular text-dark py-2"
                          }
                        >
                          {terminal.activacion === "" ? (
                            <> ---- </>
                          ) : (
                            <> {terminal.activacion} </>
                          )}
                        </td>
                        <td
                          className={
                            darkMode
                              ? " fs-12-a-10 lato-regular text-dark py-2"
                              : " fs-12-a-10 lato-regular text-dark py-2"
                          }
                        >
                          {terminal.tipoDeAlta === "" ? (
                            <> ---- </>
                          ) : (
                            <> {terminal.tipoDeAlta} </>
                          )}
                        </td>
                        <td
                          className={
                            darkMode
                              ? " fs-12-a-10 lato-regular text-dark py-2"
                              : " fs-12-a-10 lato-regular text-dark py-2"
                          }
                        >
                          {terminal.decisionTomada === "" ? (
                            <> ---- </>
                          ) : (
                            <> {terminal.decisionTomada} </>
                          )}
                        </td>
                        <td
                          className={
                            darkMode
                              ? " fs-12-a-10 lato-regular text-dark py-2"
                              : " fs-12-a-10 lato-regular text-dark py-2"
                          }
                        >
                          {formatCurrency(terminal.facturaciónMesPasado)}
                        </td>
                        <td
                          className={
                            darkMode
                              ? " fs-12-a-10 lato-regular text-dark py-2"
                              : " fs-12-a-10 lato-regular text-dark py-2"
                          }
                        >
                          <span className="me-1">
                            {formatCurrency(terminal.facturaciónMesEnCurso)}
                          </span>
                          {getComparadorIcon(
                            terminal.facturaciónMesPasado,
                            terminal.facturaciónMesEnCurso
                          )}
                        </td>
                      </tr>
                    ))}
                </React.Fragment>
              ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default TablaStockAsesores;
