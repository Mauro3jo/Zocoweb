import React from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faCheckCircle,
  faCircleQuestion,
  faClockRotateLeft,
  faMagnifyingGlassChart,
  faRotateLeft,
  faRoute,
  faScrewdriverWrench,
  faToggleOn,
} from "@fortawesome/free-solid-svg-icons";

// Mapeo de decisiones a iconos
const decisionesAIconos = {
  ACTIVA: faToggleOn,
  "SERVICIO.TECNICO": faScrewdriverWrench,
  "BAJO ANALISIS": faMagnifyingGlassChart,
  REUBICAR: faRoute,
  "EN PROCESO DE ACTIVACION": faCircleQuestion,
  DISPONIBLE: faCheckCircle,
  "ACREDITACION PENDIENTE": faClockRotateLeft,
  BACKUP: faRotateLeft,
  // Añade más mapeos según necesites
};

const IconosGraficaStock = ({ decisiones }) => {
  const obtenerIcono = (decision) => {
    return decisionesAIconos[decision] || faCircleQuestion; // Icono por defecto si no se encuentra
  };

  return (
    <div className="d-flex justify-content-around">
      {decisiones.map((decision) => (
        <article key={decision}>
          <div className="my-2">
            <FontAwesomeIcon
              className="iconos-font"
              icon={obtenerIcono(decision)}
              size="xl"
            />
          </div>
          <div className="text-center my-2">
            <h6 className="fs-10 text-decision">{decision}</h6>{" "}
       
          </div>
        </article>
      ))}
    </div>
  );
};

export default IconosGraficaStock;
