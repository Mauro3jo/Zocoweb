// IMPORT CSS DEL COMPONENT
import "./FacturacionPagoActivasBajas.css";

// IMPORT HOOKS, LIBRERIAS Y CONTEXT
import { DarkModeContext } from "../../context/DarkModeContext";
import { useContext } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faCircleArrowDown,
  faCircleArrowUp,
} from "@fortawesome/free-solid-svg-icons";

// IMPORT COMPONENT
import FacturacionTipo from "./FacturacionTipo";

const FacturacionPagoActivasBajas = ({ datos }) => {
  // DARKMODE CONTEXT PARA MODIFICAR Y ACTIVAR EL MODO CLARO/OSCURO.
  const { darkMode } = useContext(DarkModeContext);

  // DE LA VARIABLE "DATOS" EXTRAIGO LOS ELEMENTOS ACTIVAS Y BAJAS
  // PARA VISUALIZARLO EN EL COMPONENT.
  const Activas = datos?.activas || "0";
  const Bajas = datos?.baja || "0";

  return (
    <section className="">
      <article className="container">
        <div className="row">
          <div className="mt-4 col-md-6">
            <div
              className={
                darkMode ? "bg-activas-bajas-dark" : "bg-activas-bajas"
              }
            >
              <h5 className="text-center py-4 lato-bold fs-14 ">
                Activas vs Bajas
              </h5>
              <div className="">
                <div className="d-flex justify-content-evenly my-5 ">
                  <div className="">
                    <FontAwesomeIcon
                      className="me-4 fs-60-a-24  color-verde"
                      icon={faCircleArrowUp}
                    />
                    <span className="fs-60-a-24 lato-bold">{Activas}</span>
                  </div>
                  <div className="borde-caja-right"> </div>
                  <div>
                    <FontAwesomeIcon
                      className="me-4 fs-60-a-24 color-rojo"
                      icon={faCircleArrowDown}
                    />
                    <span className="fs-60-a-24 lato-bold">{Bajas}</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
          <div className="mt-4 col-md-6">
            <div className="d-flex justify-content-center ">
              <div
                className={
                  darkMode ? "bg-activas-bajas-dark" : "bg-activas-bajas"
                }
              >
                <h5 className="text-center py-4 lato-bold fs-14 ">
                  Facturación por tipo de pago
                </h5>
                <div className="">
                  <FacturacionTipo dato={datos} />
                </div>
              </div>
            </div>
          </div>
        </div>
      </article>
    </section>
  );
};

export default FacturacionPagoActivasBajas;
