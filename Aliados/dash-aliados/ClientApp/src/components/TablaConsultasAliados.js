// import hoja de estilos css
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import "./TablaTickets.css";

import React, { useContext, useEffect, useState } from "react";
import {
  faCircleCheck,
  faCircleMinus,
} from "@fortawesome/free-solid-svg-icons";
import formatearFecha from "../helpers/formatearFecha";
import { DarkModeContext } from "../context/DarkModeContext";

const TablaConsultasAliados = ({ consultas, isLoading }) => {
  const [consultasOrdenadas, setConsultasOrdenadas] = useState();
  // context para el modo claro/oscuro
  const { darkMode } = useContext(DarkModeContext);
  return (
    <div>
      {isLoading ? (
        <div className="centrado">
          <h6 className="py-4">Esperando datos...</h6>
        </div>
      ) : (
        consultas.map((consulta, id) => (
          <div
            key={id}
            className={
              darkMode
                ? " my-4 bg-tarjeta-consulta-dark py-4"
                : " my-4 bg-tarjeta-consulta py-4"
            }
          >
            <div className="row">
              <div className="col-lg-8 col-12 ">
                <h6 className="fs-16 lato-regular py-3 px-5 mx-4">
                  <b>{consulta.motivo}</b>
                  <br />
                  {consulta.direccion}, {consulta.provincia} <br />
                  {consulta.observacionAliado}
                </h6>
              </div>
              <div className="col-lg-4 col-12 centrado-flex-around">
                {consulta.estado === "pendiente" ? (
                  <>
                    <h6 className="fs-18 lato-regular py-3  color-gris">
                      <FontAwesomeIcon
                        className="me-2"
                        icon={faCircleMinus}
                        style={{ color: "#E89F2F" }}
                      />
                      Pendiente
                    </h6>
                  </>
                ) : (
                  <h6 className="fs-18 lato-regular py-3  color-verde">
                    <FontAwesomeIcon
                      className="me-2"
                      icon={faCircleCheck}
                      style={{ color: "#b4c400 " }}
                    />
                    Completado
                  </h6>
                )}
                <h6
                  className="fs-12 lato-regular py-3  "
                  style={{ color: "#b3b5bf" }}
                >
                  {formatearFecha(consulta.fechaApertura)}
                </h6>
              </div>
            </div>
          </div>
        ))
      )}
    </div>
  );
};

export default TablaConsultasAliados;
