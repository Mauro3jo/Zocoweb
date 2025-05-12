import React, { useContext } from "react";
import "./TablaVisitas.css";
import ItemTablaVisitas from "./ItemTablaVisitas";

import { faCircleCheck, faCirclePlus } from "@fortawesome/free-solid-svg-icons";
import { DarkModeContext } from "../../context/DarkModeContext";

const datos = [
  {
    id: 1,
    nombreComercio: "La Bandeña",
    terminal: 3987631,
    decisionTomada: "Activas",
    icono: faCirclePlus,
    color: "color-verde",
    estado: "Cargar visita",
  },
  {
    id: 2,
    nombreComercio: "La Bandeña",
    terminal: 3987632,
    decisionTomada: "En proceso de actición",
    icono: faCirclePlus,
    color: "color-rojo",
    estado: "Cargar visita",
  },
  {
    id: 3,
    nombreComercio: "La Bandeña",
    terminal: 3987633,
    decisionTomada: "Servicio técnico",
    icono: faCircleCheck,
    color: "color-verde",
    estado: "Completo",
  },
  {
    id: 4,
    nombreComercio: "Patagonia",
    terminal: 3987634,
    decisionTomada: "Bajo análisis",
    icono: faCircleCheck,
    color: "color-verde",
    estado: "Completo",
  },
  {
    id: 5,
    nombreComercio: "Patagonia",
    terminal: 3987635,
    decisionTomada: "Extraviada",
    icono: faCirclePlus,
    color: "color-rojo",
    estado: "Cargar visita",
  },
  {
    id: 6,
    nombreComercio: "Patagonia",
    terminal: 3987636,
    decisionTomada: "Activas",
    icono: faCirclePlus,
    color: "color-rojo",
    estado: "Cargar visita",
  },
  {
    id: 7,
    nombreComercio: "La Bandeña",
    terminal: 3987637,
    decisionTomada: "Activas",
    icono: faCirclePlus,
    color: "color-verde",
    estado: "Cargar visita",
  },
  {
    id: 8,
    nombreComercio: "La Bandeña",
    terminal: 3987638,
    decisionTomada: "En proceso de actición",
    icono: faCirclePlus,
    color: "color-rojo",
    estado: "Cargar visita",
  },
  {
    id: 9,
    nombreComercio: "La Bandeña",
    terminal: 3987639,
    decisionTomada: "Servicio técnico",
    icono: faCircleCheck,
    color: "color-verde",
    estado: "Completo",
  },
  {
    id: 10,
    nombreComercio: "Patagonia",
    terminal: 3987640,
    decisionTomada: "Bajo análisis",
    icono: faCircleCheck,
    color: "color-verde",
    estado: "Completo",
  },
  {
    id:11,
    nombreComercio: "Patagonia",
    terminal: 3987641,
    decisionTomada: "Extraviada",
    icono: faCirclePlus,
    color: "color-rojo",
    estado: "Cargar visita",
  },
  {
    id: 12,
    nombreComercio: "Patagonia",
    terminal: 3987642,
    decisionTomada: "Activas",
    icono: faCirclePlus,
    color: "color-rojo",
    estado: "Cargar visita",
  },
];

const TablaVisitas = () => {
  const { darkMode } = useContext(DarkModeContext);

  return (
    <div className="container py-4">
      <section className="bg-tabla-calculadora table-responsive ">
        <table className="table table-borderless responsive striped hover">
          <thead className="border-0 ">
            <tr className="text-center tabla-thead">
              <th
                className={
                  darkMode
                    ? " bg-white text-dark border-tabla-izquierda border-0 lato-regular fs-12 py-3 "
                    : "bg-dark text-white border-tabla-izquierda border-0 lato-regular fs-12 py-3 "
                }
                scope="col "
              >
                Nombre del comercio
              </th>
              <th
                className={
                  darkMode
                    ? " bg-white text-dark border-0 lato-regular fs-12 py-3 "
                    : "bg-dark text-white fs-12 lato-regular py-3  "
                }
                scope="col"
              >
                N° de Terminal
              </th>
              <th
                className={
                  darkMode
                    ? " bg-white text-dark border-0 lato-regular fs-12 py-3 "
                    : "bg-dark text-white fs-12 lato-regular py-3  "
                }
                scope="col"
              >
                Decisión tomada
              </th>

              <th
                className={
                  darkMode
                    ? " bg-white text-dark border-0 lato-regular fs-12 py-3 border-tabla-derecha "
                    : "bg-dark text-white fs-12 lato-regular py-3 border-tabla-derecha "
                }
                scope="col"
              >
                <span className=" ocultar-texto-div">Acciones</span>
              </th>
            </tr>
          </thead>
          <tbody className="text-center">
            {datos.map((dato, id) => (
              <ItemTablaVisitas {...dato} key={id}></ItemTablaVisitas>
            ))}
          </tbody>
        </table>
      </section>
    </div>
  );
};

export default TablaVisitas;
