// Import hoja de estilo (css)
import "./BienvenidoPanelReclutador.css";

// import hooks
import React, { useContext, useEffect, useState } from "react";

// import context
import { DarkModeContext } from "../../context/DarkModeContext";

import BienvenidoPanelReclutadorTablet from "./BienvenidoPanelReclutadorTablet";

//import librerias

const BienvenidoPanelReclutador = () => {
  // context para que se aplique el modo oscuro.
  const { darkMode } = useContext(DarkModeContext);

  // estado para guardar la lista de la carga de busqueda
  const [panelReclutamiento, setPanelReclutamiento] = useState([]);

  const {totalContratados, totalFinalistas,totalRechazados,totalSeleccionados,totalSolicitantes} = panelReclutamiento || {}


  // Método para obtener la lista actualizada de búsquedas
  const actualizarPanelReclutamiento = async () => {
    try {
      const response = await fetch( "/api/busqueda/panelrecultamiento");
      const data = await response.json();
      setPanelReclutamiento(data);
    } catch (error) {
      console.error("Error al cargar la lista de búsquedas:", error);
    }
  };

  useEffect(() => {
    actualizarPanelReclutamiento();
  }, []); 

  return (
    <div>
      {/* COMPONENTE BIENVENIDO PANEL  */}
      <section className=" d-lg-block d-none">
        <div
          className={
            darkMode
              ? "py-4  contenedor-panel-control-asesores-dark container d-none d-xl-block"
              : "py-4  contenedor-panel-control-asesores container d-none d-xl-block"
          }
        >
          <div className="d-flex justify-content-evenly py-3">
            <article>
              <div className="">
                <h6 className="text-center lato-bold fs-16 ms-2 ">
                  {" "}
                  Bienvenido/a
                  <br />
                  <span className="text-center lato-bold color-verde fs-25">
                    RRHH
                  </span>{" "}
                </h6>
              </div>
            </article>
            <article className="borde-caja-panel"></article>
            <article>
              <div className="text-center">
                <span className="lato-regular fs-16"> CVs recibidos</span>{" "}
                <br />
                <span className="fs-25 lato-bold text-center">{totalSolicitantes}</span>
              </div>
            </article>
            <article className="borde-caja-panel"></article>
            <article>
              <div className="color-naranja-oscuro">
                <span className="lato-bold fs-16"> Seleccionados</span> <br />
                <div className="lato-bold  text-center ">
                  <span className="fs-25"> {totalSeleccionados}</span>
                </div>
              </div>
            </article>
            <article className="borde-caja-panel"></article>
            <article>
              <div className="color-naranja  ">
                <span className="lato-bold fs-16"> Finalistas</span> <br />
                <div className="lato-bold  text-center ">
                  <span className="fs-25">{totalFinalistas}</span>
                </div>
              </div>
            </article>

            <article className="borde-caja-panel"></article>
            <article>
              <div className="color-verde">
                <span className="lato-bold  fs-16"> Contratados</span> <br />
                <div className="lato-bold  text-center ">
                  <span className="fs-25"> {totalContratados}</span>
                </div>
              </div>
            </article>

            <article className="borde-caja-panel"></article>
            <article>
              <div className="color-rojo">
                <span className="lato-bold fs-16"> Rechazados</span> <br />
                <div className="lato-bold  text-center ">
                  <span className="fs-25"> {totalRechazados}</span>
                </div>
              </div>
            </article>
          </div>
        </div>

        <div
          className={
            darkMode
              ? "my-4 bg-activas-bajas-celular-dark container d-xl-none d-block"
              : "my-4 bg-activas-bajas-celular container d-xl-none d-block"
          }
        >
          <div className="d-flex justify-content-between mx-3 py-2">
            <div>
              <div className="ms-4 py-3">
                <h6 className="lato-bold fs-16 ms-2 ">
                  Bienvenido/a <br />
                  <span className=" lato-bold color-verde fs-25">RRHH</span>
                </h6>
              </div>
            </div>
            <article>
              <div className="text-center">
                <span className="lato-regular fs-16"> CVs recibidos</span>{" "}
                <br />
                <span className="fs-25 lato-bold text-center">{totalSolicitantes}</span>
              </div>
            </article>
          </div>
          <div className="d-flex justify-content-between mx-5 pb-4">
            <article>
              <div className="color-naranja-oscuro">
                <span className="lato-bold fs-16"> Seleccionados</span> <br />
                <div className="lato-bold  text-center ">
                  <span className="fs-25"> {totalSeleccionados}</span>
                </div>
              </div>
            </article>
            <article className="borde-caja-panel"></article>
            <article>
              <div className="color-naranja  ">
                <span className="lato-bold fs-16"> Finalistas</span> <br />
                <div className="lato-bold  text-center ">
                  <span className="fs-25"> {totalFinalistas}</span>
                </div>
              </div>
            </article>
            <article className="borde-caja-panel"></article>
            <article>
              <div className="color-verde">
                <span className="lato-bold  fs-16"> Contratados</span> <br />
                <div className="lato-bold  text-center ">
                  <span className="fs-25">{totalContratados}</span>
                </div>
              </div>
            </article>
            <article className="borde-caja-panel"></article>
            <article>
              <div className="color-rojo">
                <span className="lato-bold fs-16"> Rechazados</span> <br />
                <div className="lato-bold  text-center ">
                  <span className="fs-25"> {totalRechazados}</span>
                </div>
              </div>
            </article>
          </div>
        </div>
      </section>
      {/* COMPONENTE BIENVENIDO PANEL PARA  TABLET Y ASESORES  */}
      <section className="d-lg-none d-block">
        <BienvenidoPanelReclutadorTablet panelReclutamiento={panelReclutamiento} />
      </section>
    </div>
  );
};

export default BienvenidoPanelReclutador;
