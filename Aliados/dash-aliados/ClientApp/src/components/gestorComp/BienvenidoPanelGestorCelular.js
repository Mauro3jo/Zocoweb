// import hoja de estilos (css)
import "./BienvenidoPanelGestor.css";

// import hooks
import React, { useContext, useEffect, useState } from "react";

// import context
import { DarkModeContext } from "../../context/DarkModeContext";

// import libreria
import {
  faCheckCircle,
  faCircleMinus,
  faXmarkCircle,
} from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";

const BienvenidoPanelGestorCelular = () => {
  // darkMode context para la funcionalidad modo claro/oscuro
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
            <div className="ms-4 pt-3">
              <h6 className="lato-bold fs-16-a-14">
                Bienvenido/a <br />
                <span className="lato-bold color-verde  fs-27">Gestor/a</span>
              </h6>
            </div>
          </div>
        </div>
        <div className="d-flex justify-content-around pt-1">
          <article className="text-center  w-100 borde-caja-down ">
            <span className="lato-bold  fs-10"> Hrs trabajadas hoy</span>{" "}
            <br />
            <div className="lato-bold mt-2  ">
              <span className="fs-22"> {datosGestor.horas}hs</span>
            </div>
          </article>
          <div className="borde-caja-right-down"></div>
          <article className="text-center borde-caja-down  w-100">
            <div>
              <span className="lato-bold  fs-10">G. Pendientes</span> <br />
              <div className="lato-bold mt-2  color-verde  ">
                <FontAwesomeIcon
                  className="fs-22"
                  icon={icon}
                  style={{ color }}
                />
                <span
                  className="fs-22"
                  style={{ color }}
                >{` ${pendientes}`}</span>
              </div>
            </div>
          </article>
          <div className="borde-caja-right-down"></div>
          <article className="text-center borde-caja-down  w-100">
            <div>
              <span className="lato-bold  fs-10">G. Aprobadas</span> <br />
              <div className="lato-bold mt-2  color-verde  ">
                <FontAwesomeIcon
                  className="fs-22 color-verde"
                  icon={faCheckCircle}
                />
                <span className="fs-22 color-verde">{` ${completadas}`}</span>
              </div>
            </div>
          </article>
          <div className="borde-caja-right-down"></div>
          <article className="text-center borde-caja-down  w-100">
            <div>
              <span className="lato-bold fs-10">G. Desaprobadas</span>{" "}
              <br />
              <div className="lato-bold mt-2  color-verde  ">
                <FontAwesomeIcon
                  className="fs-22 color-rojo"
                  icon={faXmarkCircle}
                />
                <span className="fs-22 color-rojo">{` ${desaprobados}`}</span>
              </div>
            </div>
          </article>
        </div>
      </div>
    </div>
  );
};

export default BienvenidoPanelGestorCelular;
