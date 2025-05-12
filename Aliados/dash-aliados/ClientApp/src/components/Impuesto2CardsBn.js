import React, { useContext, useEffect, useState } from "react";
import "./ImpuestosCards.css";
import { DarkModeContext } from "../context/DarkModeContext";

const Impuesto2CardsBn = ({ DatosTasa }) => {
  const { darkMode } = useContext(DarkModeContext);
  const [descripciones, setDescripciones] = useState([]);
  const [fechasVencimiento, setFechasVencimiento] = useState([]);
  const [tasas, setTasas] = useState([]);

  useEffect(() => {
    if (DatosTasa && DatosTasa.length > 0) {
      const descripcionesTemp = [];
      const fechasTemp = [];
      const tasasTemp = [];

      DatosTasa.forEach((dato) => {
        descripcionesTemp.push(dato.descripciontasa);
        tasasTemp.push(dato.tasa);

        // Formatear fecha
        const fecha = new Date(dato.fechavencimiento);
        const fechaFormateada =
          fecha.getDate().toString().padStart(2, "0") +
          "/" +
          (fecha.getMonth() + 1).toString().padStart(2, "0") +
          "/" +
          fecha.getFullYear().toString().substr(-2);
        fechasTemp.push(fechaFormateada);
      });

      setDescripciones(descripcionesTemp);
      setFechasVencimiento(fechasTemp);
      setTasas(tasasTemp);
    }
  }, [DatosTasa]);
  const descripcionPrimera =
    descripciones.length > 0 ? descripciones[0] : "Cargando...";
  const descripcionSegunda =
    descripciones.length > 0 ? descripciones[1] : "Cargando...";
  const tasaPrimera = tasas.length > 0 ? `${tasas[0]}%` : "Cargando...";
  const tasaSegunda = tasas.length > 0 ? `${tasas[1]}%` : "Cargando...";
  const fechaPrimera =
    fechasVencimiento.length > 0 ? fechasVencimiento[0] : "Cargando...";
  const fechaSegunda =
    fechasVencimiento.length > 0 ? fechasVencimiento[1] : "Cargando...";
  return (
    <div className="container">
      <div className="d-flex justify-content-between">
        <div
          className={
            darkMode ? "bg-card-impuestos-bn-dark " : "bg-card-impuestos-bn"
          }
        >
          <section>
            <article className=" padding-horizontal  d-flex flex-column justify-content-evenly container">
              <div className="text-center lato-bold fs-16-a-14">
                Costo por presentación fuera de término
              </div>
              <div className="d-flex justify-content-around flex-wrap mt-5">
                <div className="text-center ">
                  <h6 className="lato-bold fs-14">{descripcionPrimera}</h6>
                  <h4 className="lato-bold fs-20">{tasaPrimera}</h4>
                </div>
                <div className="text-center">
                  <h6 className="lato-bold fs-14">Fecha de Vencimiento</h6>
                  <h4 className="mt-2 lato-bold fs-20">{fechaPrimera}</h4>
                </div>
              </div>
            </article>
          </section>
        </div>
        <div
          className={
            darkMode ? "bg-card-impuestos-bn-dark " : "bg-card-impuestos-bn"
          }
        >
          <section>
            <article className=" padding-horizontal  d-flex flex-column justify-content-evenly container">
              <div className="text-center lato-bold fs-16-a-14">
                Costo por presentación fuera de término
              </div>
              <div className="d-flex justify-content-around flex-wrap mt-5">
                <div className="text-center ">
                  <h6 className="lato-bold fs-14">{descripcionSegunda}</h6>
                  <h4 className="lato-bold fs-20">{tasaSegunda}</h4>
                </div>
                <div className="text-center">
                  <h6 className="lato-bold fs-14">Fecha de Vencimiento</h6>
                  <h4 className="mt-2 lato-bold fs-20">{fechaSegunda}</h4>
                </div>
              </div>
            </article>
          </section>
        </div>
      </div>
    </div>
  );
};

export default Impuesto2CardsBn;
