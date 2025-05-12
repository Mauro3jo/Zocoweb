// Import del css del component
import "./BienvenidoPanelGestor.css";

// import hook, context y librerias
import React, { useContext, useEffect, useState } from "react";
import { DarkModeContext } from "../../context/DarkModeContext";
import {
  faCheckCircle,
  faCircleCheck,
  faCircleMinus,
  faCircleXmark,
} from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import BienvenidoPanelGestorTablet from "./BienvenidoPanelGestorTablet";

// import del component
// import BienvenidoPanelAsesoresTablet from "./BienvenidoPanelAsesoresTablet";
const BienvenidoPanelGestor = () => {
  // context para que se aplique el modo oscuro.
  const { darkMode } = useContext(DarkModeContext);

  // estado para guardar horas y peticiones
  const [datosGestor, setDatosGestor] = useState({});
  // CONSULTA A LA API
  const verificarTokenYObtenerDatos = async () => {
    const token = sessionStorage.getItem("token");
    // Luego, obtener los datos después de la verificación exitosa del token
    const respuestaDatos = await fetch("/api/horas/horas", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ Token: token }),
    });

    if (respuestaDatos.ok) {
      const data = await respuestaDatos.json();
      setDatosGestor(data);
    }
  };

  useEffect(() => {
    verificarTokenYObtenerDatos();
  }, []);

  // logica para cambiar el icono por numero de pendiente
  const pendientes = parseInt(datosGestor?.peticiones || "0"); 
  const desaprobados = parseInt(datosGestor?.desaprobados || "0"); 
  const completadas = parseInt(datosGestor?.completadas || "0"); 
  // Determina el icono y el color basado en el número de pendientes
  const icon = pendientes > 0 ? faCircleMinus : faCheckCircle;
  const color = pendientes > 0 ? "rgb(232, 159, 47)" : "#b4c400 ";

  return (
    <section className="container">
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
                  <span className="text-center lato-bold color-verde fs-27">
                    Gestor/a
                  </span>{" "}
                </h6>
              </div>
            </article>
            <article className="borde-caja-panel"></article>
            <article>
              <div className="text-center">
                <span className="lato-bold fs-16"> Horas trabajadas hoy</span>{" "}
                <br />
                <span className="fs-25 lato-bold">{datosGestor.horas} hs</span>
              </div>
            </article>
            <article className="borde-caja-panel"></article>
            <article>
              <div>
                <span className="lato-bold  fs-16"> Gestiones pendientes</span>{" "}
                <br />
                <div className="lato-bold  text-center ">
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
                <span className="lato-bold  fs-16"> Gestiones Completadas</span>{" "}
                <br />
                <div className="lato-bold  text-center ">
                  <FontAwesomeIcon
                    className="fs-25 color-verde"
                    icon={faCircleCheck}
                  />
                  <span className="fs-27 color-verde">{` ${completadas}`}</span>
                </div>
              </div>
            </article>
            <article className="borde-caja-panel"></article>
            <article>
              <div>
                <span className="lato-bold  fs-16">Gestiones Desaprobadas</span>{" "}
                <br />
                <div className="lato-bold  text-center ">
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
        {/* ESTE ES EL PANEL BIENVENIDO PARA NOTEBOOK  */}
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
                  <span className=" lato-bold color-verde fs-27">Gestor/a</span>
                </h6>
              </div>
            </div>
          </div>
          <div className="d-flex justify-content-around mx-5 pb-4">
            <article>
              <div className="text-center ">
                <span className="lato-bold  fs-16"> Horas trabajadas hoy</span>{" "}
                <br />
                <div className="lato-bold   ">
                  <span className="fs-27"> {datosGestor.horas}hs</span>
                </div>
              </div>
            </article>
            <article className="borde-caja-panel"></article>
            <article>
              <div>
                <span className="lato-bold  fs-16"> Gestiones pendientes</span>{" "}
                <br />
                <div className="lato-bold text-center ">
                  <FontAwesomeIcon
                    className="fs-25"
                    icon={icon}
                    style={{ color }}
                  />
                  <span
                    className="fs-25"
                    style={{ color }}
                  >{` ${pendientes}`}</span>
                </div>
              </div>
            </article>
            <article className="borde-caja-panel"></article>
            <article>
              <div>
                <span className="lato-bold  fs-16"> Gestiones Aprobadas</span>{" "}
                <br />
                <div className="lato-bold text-center ">
                  <FontAwesomeIcon
                    className="fs-25 color-verde"
                    icon={faCircleCheck}
                  />
                  <span className="fs-27 color-verde">{` ${completadas}`}</span>
                </div>
              </div>
            </article>
            <article className="borde-caja-panel"></article>
            <article>
              <div>
                <span className="lato-bold  fs-16">
                  {" "}
                  Gestiones Desaprobadas
                </span>{" "}
                <br />
                <div className="lato-bold text-center ">
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

      {/* COMPONENTE BIENVENIDO PANEL PARA  TABLET Y ASESORES  */}
      <section className="d-lg-none d-block">
        <BienvenidoPanelGestorTablet
          datos={datosGestor}
          pendientes={pendientes}
          color={color}
          icon={icon}
          desaprobados={desaprobados}
          completadas={completadas}
        />
      </section>
    </section>
  );
};

export default BienvenidoPanelGestor;
