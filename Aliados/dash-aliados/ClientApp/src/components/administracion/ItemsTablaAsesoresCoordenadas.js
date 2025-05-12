import React, { useContext } from "react";
import { DarkModeContext } from "../../context/DarkModeContext";

const ItemsTablaAsesoresCoordenadas = ({
  nombre,
  usuario,
  latitud,
  longitud,
  fechaHora,
  tipo,
}) => {
  const { darkMode } = useContext(DarkModeContext);
  const url = `https://www.google.com/maps?q=${latitud},${longitud}`;
  return (
    <>
    
      <tr
        className={
          darkMode
            ? " tabla-borde-bottom  text-white"
            : "tabla-borde-bottom  text-dark"
        }
      >
        <td className="fs-12-a-10 lato-regular pt-4 "> {usuario}</td>
        <td className="fs-12-a-10 lato-regular pt-4 "> {nombre}</td>
        <td className="fs-12-a-10 lato-regular pt-4 "> {fechaHora}</td>
        <td
          className={
            tipo === "checkIn"
              ? "fs-12-a-10 lato-regular  pt-4 color-verde"
              : "fs-12-a-10 lato-regular color-rojo  pt-4 "
          }
        >
          {" "}
          {tipo}{" "}
        </td>
        <td className="fs-14 lato-regular pt-2">
          <div className="d-flex justify-content-center">
            <a
              className="text-decoration-none btn-ver-map centrado"
              href={url}
              target="_blank"
              rel="noopener noreferrer"
            >
              Ver Mapa
            </a>
          </div>
        </td>
      </tr>
    </>
  );
};

export default ItemsTablaAsesoresCoordenadas;
