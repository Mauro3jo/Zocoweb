import React from "react";
// iconos
import iconoNX from "../../assets/img/logonx.png";
import zoco from "../../assets/img/Zoco.png";
import { Image } from "react-bootstrap";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faCircleCheck,
  faCircleXmark,
} from "@fortawesome/free-solid-svg-icons";

const TablaNaranja = () => {
  const caracteristicas = [
    { nombre: "Costo mensual", payway: "Sí", zoco: "No" },
    { nombre: "Trámite tarjeta", payway: "Sí", zoco: "No" },
    { nombre: "Panel All-in-One 100% gratis", payway: "✖", zoco: "✓" },
    { nombre: "Comprobante de retención mensual", payway: "✖", zoco: "✓" },
    { nombre: "Terminales 100% bonificadas", payway: "✖", zoco: "✓" },
    { nombre: "Canal de atención directo", payway: "✖", zoco: "✓" },
    {
      nombre: "Plazo de resolución",
      payway: "5 días hábiles a 9 días hábiles",
      zoco: "24 horas hábiles",
    },
    { nombre: "Alta Cuota simple", payway: "30 días", zoco: "24 horas" },
    { nombre: "Alta Alimentar", payway: "30 días a 90 días", zoco: "24 horas" },
    { nombre: "Alta servicio", payway: "15 días", zoco: "En el acto" },
    {
      nombre: "Servicio Técnico",
      payway: "Plazo de 5 días",
      zoco: "Cambio directo",
    },
    { nombre: "Tiempo de acreditación", payway: "✖", zoco: "✓" },
    { nombre: "Dinero a cualquier cuenta o billetera", payway: "✖", zoco: "✓" },
    { nombre: "Seguridad ante un contracargo", payway: "✖", zoco: "✓" },
  ];

  return (
    <div className="caracteristicas-container bg-tabla-calculadora">
      <table className="caracteristicas-table">
        <thead className="rounded-top">
          <tr>
            <th colSpan="3" className="text-center text-white bg-dark py-2">
              Características
            </th>
          </tr>
          <tr className="border-bottom">
            <th className="ocultar-texto-div">Descripción</th>
            <th className="text-center">
              <Image style={{ width: "100px" }} src={iconoNX} fluid />
            </th>
            <th className="text-center">
              <Image style={{ width: "100px" }} src={zoco} fluid />
            </th>
          </tr>
        </thead>
        <tbody>
          {caracteristicas.map((item, index) => (
            <tr className="border-bottom" key={index}>
              <td className="py-3 lato-bold ps-5">{item.nombre}</td>
              <td className="text-center color-rojo py-3 lato-bold border-bottom">
                {item.payway === "✖" ? (
                  <FontAwesomeIcon icon={faCircleXmark} size="xl" />
                ) : (
                  item.payway
                )}
              </td>
              <td className="text-center color-verde py-3 lato-bold border-bottom">
                {item.zoco === "✓" ? (
                  <FontAwesomeIcon icon={faCircleCheck} size="xl" />
                ) : (
                  item.zoco
                )}
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default TablaNaranja;
