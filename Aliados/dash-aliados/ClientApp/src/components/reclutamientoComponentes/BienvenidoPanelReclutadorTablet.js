// Import hoja de estilo (css)
import "./BienvenidoPanelReclutador.css";

// import hook, context y librerias
import React, { useContext } from "react";
import { DarkModeContext } from "../../context/DarkModeContext";

const BienvenidoPanelReclutadorTablet = ({panelReclutamiento}) => {
  const { darkMode } = useContext(DarkModeContext);
  const {totalContratados, totalFinalistas,totalRechazados,totalSeleccionados,totalSolicitantes} = panelReclutamiento || {}

  return (
    <section>
      <div
        className={
          darkMode
            ? "contenedor-panel-control-asesores-dark"
            : "contenedor-panel-control-asesores"
        }
      >
        <div className="d-flex justify-content-between mx-3 py-2">
          <div>
            <div className="ms-4 py-3">
              <h6 className="lato-bold fs-16 ms-2 ">
                Bienvenido/a al <br />
                <span className=" lato-bold color-verde fs-25">RRHH</span>
              </h6>
            </div>
          </div>
          <article>
            <div className="text-center">
              <span className="lato-regular fs-16"> CVs recibidos</span> <br />
              <span className="fs-25 lato-bold text-center">{totalSolicitantes}</span>
            </div>
          </article>
        </div>
        <div className="d-flex justify-content-between mx-5">
          <article>
            <div className="color-naranja-oscuro">
              <span className="lato-bold fs-16"> Seleccionados</span> <br />
              <div className="lato-bold  text-center text-black">
                <span className="fs-25"> {totalSeleccionados}</span>
              </div>
            </div>
          </article>
          <article className="borde-caja-panel"></article>
          <article>
            <div className="color-naranja  ">
              <span className="lato-bold fs-16"> Finalistas</span> <br />
              <div className="lato-bold  text-center text-black">
                <span className="fs-25"> {totalFinalistas}</span>
              </div>
            </div>
          </article>
          <article className="borde-caja-panel"></article>
          <article>
            <div className="color-verde">
              <span className="lato-bold  fs-16"> Contratados</span> <br />
              <div className="lato-bold  text-center text-black">
                <span className="fs-25"> {totalContratados}</span>
              </div>
            </div>
          </article>
          <article className="borde-caja-panel"></article>
          <article>
            <div className="color-rojo">
              <span className="lato-bold fs-16"> Rechazados</span> <br />
              <div className="lato-bold  text-center text-black">
                <span className="fs-25"> {totalRechazados}</span>
              </div>
            </div>
          </article>
        </div>
      </div>
    </section>
  );
};

export default BienvenidoPanelReclutadorTablet;
