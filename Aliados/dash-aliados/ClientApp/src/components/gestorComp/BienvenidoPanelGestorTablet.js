// Import del css del component
import "./BienvenidoPanelGestor.css";

// import hook, context y librerias
import React, { useContext } from "react";
import { DarkModeContext } from "../../context/DarkModeContext";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faCheckCircle,
  faCircleXmark,
} from "@fortawesome/free-solid-svg-icons";

const BienvenidoPanelGestorTablet = ({ datos, pendientes, color, icon,completadas,desaprobados }) => {
  const { darkMode } = useContext(DarkModeContext);
  const { horas } = datos;

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
                Bienvenido/a <br />
                <span className=" lato-bold color-verde fs-27">Gestor/a</span>
              </h6>
            </div>
          </div>
        </div>
        <div className="d-flex justify-content-around mx-5 pb-4">
          <article>
            <div className="text-center ">
              <span className="lato-bold  fs-12"> Horas trabajadas hoy</span>{" "}
              <br />
              <div className="lato-bold   fs-27">{horas}hs</div>
            </div>
          </article>
          <article className="borde-caja-panel"></article>
          <article>
            <div>
              <span className="lato-bold  fs-12 "> Gestiones pendientes</span>{" "}
              <br />
              <div className="lato-bold  text-center">
                <FontAwesomeIcon
                  className="fs-25"
                  icon={icon}
                  style={{ color }}
                />
                <span
                  className="fs-27"
                  style={{ color }}
                >{` ${pendientes}`}</span>
              </div>
            </div>
          </article>
          <article className="borde-caja-panel"></article>
          <article>
            <div>
              <span className="lato-bold  fs-12"> Gestiones Aprobadas</span>{" "}
              <br />
              <div className="lato-bold  text-center">
                <FontAwesomeIcon
                  className="fs-25 color-verde"
                  icon={faCheckCircle}
                />
                <span className="fs-27 color-verde">{` ${completadas}`}</span>
              </div>
            </div>
          </article>
          <article className="borde-caja-panel"></article>
          <article>
            <div>
              <span className="lato-bold  fs-12"> Gestiones Desaprobadas</span>{" "}
              <br />
              <div className="lato-bold  text-center">
                <FontAwesomeIcon
                  className="fs-25 color-rojo"
                  icon={faCircleXmark}
                />
                <span className="fs-27 color-rojo">{` ${desaprobados}`}</span>
              </div>
            </div>
          </article>
        </div>
      </div>
    </section>
  );
};

export default BienvenidoPanelGestorTablet;
