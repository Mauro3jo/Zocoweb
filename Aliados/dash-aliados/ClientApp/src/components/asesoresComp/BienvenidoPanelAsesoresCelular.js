// import hoja de estilos (css)
import "./BienvenidoPanelAsesores.css";

// import hooks
import React, { useContext } from "react";

// import context
import { DarkModeContext } from "../../context/DarkModeContext";

// import libreria
import {
  faCheckCircle,
  faCircleArrowDown,
  faCircleArrowUp,
  faMagnifyingGlassChart,
  faRoute,
  faToggleOn,
} from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";

const BienvenidoPanelAsesoresCelular = () => {
  // darkMode context para la funcionalidad modo claro/oscuro
  const { darkMode } = useContext(DarkModeContext);

  return (
    <div className="container">
      <div
        className={
          darkMode
            ? "contenedor-panel-control-asesores-dark"
            : "contenedor-panel-control-asesores"
        }
      >
        <div className="d-flex justify-content-between py-2">
          <div>
            <div className="ms-4 py-3">
              <h6 className="lato-bold fs-16-a-14">
                Bienvenido/a <br />
                <span className="lato-bold color-verde fs-18">
                  Asesor
                </span>
              </h6>
            </div>
          </div>
          <div>
            <div className="mx-2 py-3">
              <h6 className="lato-regular text-center fs-16-a-14 ">
                Stock de terminales
              </h6>
              <h6 className="lato-bold fs-24-a-18 text-center color-verde pb-0">
                0
              </h6>
            </div>
          </div>
        </div>
        <div className="d-flex justify-content-around pt-1">
          <article className="text-center  w-100 borde-caja-down ">
            <span className="lato-bold  fs-14"> Altas</span> <br />
            <div className="lato-bold mt-2  ">
              <FontAwesomeIcon
                className="me-4 fs-22 color-verde"
                icon={faCircleArrowUp}
              />
              <span className="fs-22"> 0</span>
            </div>
          </article>
          <div className="borde-caja-right-down"></div>
          <article className="text-center borde-caja-down  w-100">
            <div className="color-verde ">
              <span className="lato-bold  fs-14"> Activas</span> <br />
              <div className="lato-bold mt-2  color-verde  ">
                <FontAwesomeIcon className="me-4 fs-22" icon={faToggleOn} />
                <span className="fs-22"> 0</span>
              </div>
            </div>
          </article>
          <div className="borde-caja-right-down"></div>
          <article className="text-center w-100 borde-caja-down">
            <div className="color-naranja">
              <span className="lato-regular fs-14"> Bajo analisis</span> <br />
              <div className="lato-bold  mt-2  ">
                <FontAwesomeIcon
                  className="me-4 fs-22 "
                  icon={faMagnifyingGlassChart}
                />
                <span className="fs-22"> 0</span>
              </div>
            </div>
          </article>
        </div>
        <div className="d-flex justify-content-around pb-4">
          <article className="text-center w-100 pt-3">
            <div className="color-rojo">
              <span className="lato-regular fs-14"> Reubicar</span> <br />
              <div className="lato-bold mt-2  ">
                <FontAwesomeIcon className="me-4 fs-22" icon={faRoute} />
                <span className="fs-22"> 0</span>
              </div>
            </div>
          </article>
          <div className="borde-caja-right-down"></div>
          <article className="text-center w-100  pt-3">
            <div className="color-verde ">
              <span className="lato-regular fs-14"> Disponible</span> <br />
              <div className="lato-bold  mt-2 ">
                <FontAwesomeIcon className="me-4 fs-22" icon={faCheckCircle} />
                <span className="fs-22"> 0</span>
              </div>
            </div>
          </article>
          <div className="borde-caja-right-down"></div>
          <article className="text-center w-100  pt-3">
            <div className="">
              <span className="lato-regular fs-14 "> Bajas </span> <br />
              <div className="lato-bold  mt-2  ">
                <FontAwesomeIcon
                  className="me-4 fs-22 color-rojo"
                  icon={faCircleArrowDown}
                />
                <span className="fs-22"> 0</span>
              </div>
            </div>
          </article>
        </div>
      </div>
    </div>
  );
};

export default BienvenidoPanelAsesoresCelular;
