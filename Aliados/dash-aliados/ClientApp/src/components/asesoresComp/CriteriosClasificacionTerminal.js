import {
  faCheckCircle,
  faCircleArrowDown,
  faCircleArrowUp,
  faCirclePause,
  faMagnifyingGlassChart,
  faRoute,
  faToggleOn,
  faTools,
} from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import React, { useContext } from "react";
import "./CriteriosClasificacionTerminal.css";
import { DarkModeContext } from "../../context/DarkModeContext";

const CriteriosClasificacionTerminal = () => {
    const { darkMode } = useContext(DarkModeContext);

  return (
    <section className="container">
      <div className={ darkMode ? "bg-criterios-asesores-dark" : "bg-criterios-asesores"}>
        <h1 className="mt-2 mb-4  text-center py-3 fs-18-a-16 lato-bold">
          Criterios de clasificación de Terminales 
        </h1>
      </div>
      <div className="row">
        <div className="col-12 col-md-6 col-lg-6 col-xl-3 my-3">
          <article className={darkMode ? "bg-caja-criterios-asesores-dark text-center py-3" : "bg-caja-criterios-asesores text-center py-3"}>
            <div>
              <FontAwesomeIcon
                className="pt-5 icono-caja-criterios-asesores  color-verde"
                icon={faCheckCircle}
              />
            </div>
            <div>
              <h6 className="fs-22-a-18 lato-bold color-verde mt-2">
                Disponible
              </h6>
            </div>
            <div>
              <h6 className="my-4 px-5 lato-regular fs-14">
                Terminal libre a disposición del asesor
              </h6>
            </div>
          </article>
        </div>
        <div className="col-12 col-md-6 col-lg-6 col-xl-3  my-3">
          <article className={darkMode ? "bg-caja-criterios-asesores-dark text-center py-3" : "bg-caja-criterios-asesores text-center py-3"}>
            <div>
              <FontAwesomeIcon
                className="pt-5 icono-caja-criterios-asesores color-verde  color-verde"
                icon={faCircleArrowUp}
              />
            </div>
            <div>
              <h6 className="fs-22-a-18 lato-bold color-verde mt-2">Altas</h6>
            </div>
            <div>
              <h6 className="my-4 px-5 lato-regular fs-14">
                Nuevo aliado ingresado y considerado en estado de alta. Debe
                facturar en un plazo{" "}
                <span className="lato-bold">máximo de 8 días</span> para cambiar
                a estado activa. Si no factura, su situación será revisada y se
                tomará una decisión sobre su permanencia como aliado.
              </h6>
            </div>
          </article>
        </div>
        <div className="col-12 col-md-6 col-lg-6 col-xl-3  my-3">
          <article className={darkMode ? "bg-caja-criterios-asesores-dark text-center py-3" : "bg-caja-criterios-asesores text-center py-3"}>
            <div>
              <FontAwesomeIcon
                className="pt-5 icono-caja-criterios-asesores  color-verde  "
                icon={faToggleOn}
              />
            </div>
            <div>
              <h6 className="fs-22-a-18 lato-bold color-verde mt-2">Activas</h6>
            </div>
            <div>
              <h6 className="my-4 px-5 lato-regular fs-14">
                Terminal con facturación mínima de{" "}
                <span className="lato-bold"> $20.000,00 o más</span>{" "}
                (proporcional a la fecha de carga).
              </h6>
            </div>
          </article>
        </div>
        <div className="col-12 col-md-6 col-lg-6 col-xl-3  my-3">
          <article className={darkMode ? "bg-caja-criterios-asesores-dark text-center py-3" : "bg-caja-criterios-asesores text-center py-3"}>
            <div>
              <FontAwesomeIcon
                className="pt-5 icono-caja-criterios-asesores  color-pause"
                icon={faCirclePause}
              />
            </div>
            <div>
              <h6 className="fs-22-a-18 lato-bold color-pause mt-2">Pausa</h6>
            </div>
            <div>
              <h6 className="my-4 px-5 lato-regular fs-14">
                <span className="lato-bold"> Deja de estar en vigencia. </span>{" "}
                <br />
                Pasa a libre disponibilidad.
              </h6>
            </div>
          </article>
        </div>
        <div className="col-12 col-md-6 col-lg-6 col-xl-3 my-3 ">
          <article className={darkMode ? "bg-caja-criterios-asesores-dark text-center py-3" : "bg-caja-criterios-asesores text-center py-3"}>
            <div>
              <FontAwesomeIcon
                className="pt-5 icono-caja-criterios-asesores color-naranja"
                icon={faMagnifyingGlassChart}
              />
            </div>
            <div>
              <h6 className="fs-22-a-18 lato-bold color-naranja mt-2">
                Bajo análisis
              </h6>
            </div>
            <div>
              <h6 className="my-4 px-5 lato-regular fs-14">
                Terminal menor a{" "}
                <span className="lato-bold"> $600.000,00 </span>o caída abrupta
                de facturación
              </h6>
            </div>
          </article>
        </div>
        <div className="col-12 col-md-6 col-lg-6 col-xl-3 pt-3 ">
          <article className={darkMode ? "bg-caja-criterios-asesores-dark text-center py-3" : "bg-caja-criterios-asesores text-center py-3"}>
            <div>
              <FontAwesomeIcon
                className="pt-5 icono-caja-criterios-asesores color-rojo"
                icon={faRoute}
              />
            </div>
            <div>
              <h6 className="fs-22-a-18 lato-bold color-rojo mt-2">Reubicar</h6>
            </div>
            <div>
              <h6 className="my-4 px-5 lato-regular fs-14">
                Revisar terminales con facturación mensual anterior{" "}
                <span className="lato-bold"> menor a $100.000 </span> y aquellas
                con facturación actual{" "}
                <span className="lato-bold"> igual o menor a $80.000.</span>{" "}
                Considerar terminales con facturación de $0.00. Tomar decisión
                sobre el manejo de estas terminales utilizando el proceso de
                gestión de ABM.
              </h6>
            </div>
          </article>
        </div>
        <div className="col-12 col-md-6 col-lg-6 col-xl-3  pt-3 ">
          <article className={darkMode ? "bg-caja-criterios-asesores-dark text-center py-3" : "bg-caja-criterios-asesores text-center py-3"}>
            <div>
              <FontAwesomeIcon
                className="pt-5 icono-caja-criterios-asesores color-naranja-oscuro"
                icon={faTools}
              />
            </div>
            <div>
              <h6 className="fs-22-a-18 lato-bold color-naranja-oscuro mt-2">
                Servicio técnico
              </h6>
            </div>
            <div>
              <h6 className="my-4 px-5 lato-regular fs-14">
                Terminales con falla comprobable (en estado activa o bajo
                análisis), con previa autorización del departamento de ABM.
              </h6>
            </div>
          </article>
        </div>
        <div className="col-12 col-md-6 col-lg-6 col-xl-3  pt-3 ">
          <article className={darkMode ? "bg-caja-criterios-asesores-dark text-center py-3" : "bg-caja-criterios-asesores text-center py-3"}>
            <div>
              <FontAwesomeIcon
                className="pt-5 icono-caja-criterios-asesores  color-rojo"
                icon={faCircleArrowDown}
              />
            </div>
            <div>
              <h6 className="fs-22-a-18 lato-bold color-rojo mt-2">Bajas</h6>
            </div>
            <div>
              <h6 className="my-4 px-5 lato-regular fs-14">
                Rescisión de contrato y devolución del terminal y sus accesorios
                por parte del comercio. La misma quedará Disponible para nuevas
                negociaciones.
              </h6>
            </div>
          </article>
        </div>
      </div>
    </section>
  );
};

export default CriteriosClasificacionTerminal;
