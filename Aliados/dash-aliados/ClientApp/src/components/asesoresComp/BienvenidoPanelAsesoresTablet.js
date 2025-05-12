// Import del css del component
import "./BienvenidoPanelAsesores.css";

// import hook, context y librerias
import React, { useContext } from "react";
import { DarkModeContext } from "../../context/DarkModeContext";
import {
  faCheckCircle,
  faCircleArrowDown,
  faCircleArrowUp,
  faMagnifyingGlassChart,
  faRoute,
  faToggleOn,
} from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";

const BienvenidoPanelAsesoresTablet = () => {
  const { darkMode } = useContext(DarkModeContext);

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
                <span className=" lato-bold color-verde fs-25">
                  Asesor
                </span>
              </h6>
            </div>
          </div>
          <div>
            <div className="mx-4 py-3">
              <h6 className="lato-regular fs-16 ">Stock de terminales</h6>
              <h6 className="lato-bold fs-26 text-center color-verde">
               0
              </h6>
            </div>
          </div>
        </div>
        <div className="d-flex justify-content-between mx-5">
          <article>
            <div className="text-center ">
              <span className="lato-bold  fs-16"> Altas</span> <br />
              <div className="lato-bold   ">
                <FontAwesomeIcon
                  className="me-4 fs-25 color-verde"
                  icon={faCircleArrowUp}
                />
                <span className="fs-25"> 0</span>
              </div>
            </div>
          </article>
          <article className="borde-caja-panel"></article>
          <article>
            <div className="color-verde">
              <span className="lato-bold  fs-16"> Activas</span> <br />
              <div className="lato-bold color-verde  ">
                <FontAwesomeIcon className="me-4 fs-25" icon={faToggleOn} />
                <span className="fs-25"> 0</span>
              </div>
            </div>
          </article>
          <article className="borde-caja-panel"></article>
          <article>
            <div className="color-naranja">
              <span className="lato-regular fs-16"> Bajo analisis</span> <br />
              <div className="lato-bold   ">
                <FontAwesomeIcon
                  className="me-4 fs-25 "
                  icon={faMagnifyingGlassChart}
                />
                <span className="fs-25"> 0</span>
              </div>
            </div>
          </article>
          <article className="borde-caja-panel"></article>
          <article>
            <div className="color-rojo">
              <span className="lato-regular fs-16"> Reubicar</span> <br />
              <div className="lato-bold  ">
                <FontAwesomeIcon className="me-4 fs-25" icon={faRoute} />
                <span className="fs-25"> 0</span>
              </div>
            </div>
          </article>
          <article className="borde-caja-panel"></article>
          <article>
            <div className="color-verde ">
              <span className="lato-regular fs-16"> Disponible</span> <br />
              <div className="lato-bold  ">
                <FontAwesomeIcon className="me-4 fs-25" icon={faCheckCircle} />
                <span className="fs-25"> 0</span>
              </div>
            </div>
          </article>
          <article className="borde-caja-panel"></article>
          <article>
            <div>
              <span className="lato-bold fs-16"> Bajas</span> <br />
              <div className="lato-bold   ">
                <FontAwesomeIcon
                  className="me-4 fs-25 color-rojo"
                  icon={faCircleArrowDown}
                />
                <span className="fs-25">0</span>
              </div>
            </div>
          </article>
        </div>
      </div>
    </section>
  );
};

export default BienvenidoPanelAsesoresTablet;
