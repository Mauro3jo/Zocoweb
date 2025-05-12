import React, { useContext, useEffect, useState } from "react";
import { DarkModeContext } from "../../context/DarkModeContext";
import Button from "react-bootstrap/Button";
import ModalImagenTabla from "../asesoresComp/ModalImagenTabla";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faCommentDots,
  faImage,
  faMapLocationDot,
} from "@fortawesome/free-solid-svg-icons";
import ModalObservaciones from "../asesoresComp/ModalObservaciones";
import ModalImagenTabla2 from "../asesoresComp/ModalImagenTabla2";

const ItemsTablaCheckInOut = ({
  id,
  nombre,
  fechaHora,
  local,
  tipo,
  latitud,
  longitud,
  audioBase64,
  imagenBase64,
  observacion,
  calificacion,
  observacionAdmin,
    imagenTerminal,
    cantidadRollos,
}) => {
  const { darkMode } = useContext(DarkModeContext);
  const url = `https://www.google.com/maps?q=${latitud},${longitud}`;
  const base64ToUrl = (base64, mimeType) => {
    return `data:${mimeType};base64,${base64}`;
  };
  const [descargando, setDescargando] = useState(false);
  const descargarAudio = async (id) => {
    setDescargando(true);
    try {
      const response = await fetch("/api/geo/DescargarAudio", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ Id: id }),
      });

      if (!response.ok) {
        throw new Error("Error en la respuesta de la API");
      }

      const audioBase64 = await response.text();
      const link = document.createElement("a");
      link.href = `data:audio/mp3;base64,${audioBase64}`;
      link.download = `audio-${id}.mp3`;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
    } catch (error) {
      console.error("Error al descargar el audio:", error);
    }
    setDescargando(false);
  };

  // Clases CSS para el botón
  const descargandoBtn = descargando
    ? "btn-slide-descargar:disabled"
    : "btn-slide-descargar";

  const getButtonClass = () => {
    // Clase base que se aplicará independientemente del estado
    let baseClass = "d-flex centrado border-0 ";
    baseClass += darkMode ? "btn-observaciones-dark " : "btn-observaciones ";

    // Se agrega la clase específica según la calificación
    if (calificacion === true) {
      return `${baseClass}btn-observaciones-aprobado`;
    } else if (calificacion === false) {
      return `${baseClass}btn-observaciones-desaprobado`;
    } else {
      // 'Falta Calificar' u otro estado
      return `${baseClass}btn-observaciones-falta`;
    }
  };

  // modal imagen
  const [modalShowCompleta, setModalShowCompleta] = React.useState(false);
  const [modalShowCompleta2, setModalShowCompleta2] = React.useState(false);
  const [modalShowCompleta3, setModalShowCompleta3] = React.useState(false);
  const [estadoAprobado, setEstadoAprobado] = useState(null);
  const [idAsesor, setIdAsesor] = useState();

  const handleEstadoChange = (e) => {
    // Convertir el valor del input a booleano: "true" para aprobado, "false" para desaprobado
    const esAprobado = e.target.value === "true";
    setEstadoAprobado(esAprobado);
  };

  useEffect(() => {}, [calificacion]);

  return (
    <>
      <tr
        className={
          darkMode
            ? " tabla-borde-bottom  text-white"
            : "tabla-borde-bottom  text-dark"
        }
      >
        <td className="fs-12-a-10 lato-regular pt-4 "> {id}</td>
        <td className="fs-12-a-10 lato-regular pt-4 "> {nombre}</td>
        <td className="fs-12-a-10 lato-regular pt-4 "> {local}</td>
        <td className="fs-12-a-10 lato-regular pt-4 "> {fechaHora}</td>
        <td
          className={
            darkMode
              ? "fs-12-a-10 lato-regular  pt-4 text-white"
              : "fs-12-a-10 lato-regular text-black pt-4 "
          }
        >
          {" "}
          {tipo ? tipo : "El Gestor/Asesor no cargo el tipo"}{" "}
        </td>
        <td className="pt-3">
          <div className="d-flex justify-content-center">
            <Button
              className={
                darkMode
                  ? "d-flex btn-ver-foto-dark  centrado border-0"
                  : "d-flex btn-ver-foto  centrado  border-0"
              }
              onClick={() => setModalShowCompleta(true)}
            >
              <FontAwesomeIcon className="" icon={faImage} />
              <span className="ms-2  lato-bold fs-12">Ver</span>
            </Button>
            <ModalImagenTabla
              imagenBase64={imagenBase64}
              show={modalShowCompleta}
              onHide={() => setModalShowCompleta(false)}
            />
          </div>
        </td>
        <td className="pt-3">
          {imagenTerminal ? (
            <div className="d-flex justify-content-center">
              <Button
                className={
                  darkMode
                    ? "d-flex btn-ver-foto-dark  centrado border-0"
                    : "d-flex btn-ver-foto  centrado  border-0"
                }
                onClick={() => setModalShowCompleta3(true)}
              >
                <FontAwesomeIcon className="" icon={faImage} />
                <span className="ms-2  lato-bold fs-12">Ver</span>
              </Button>
              <ModalImagenTabla2
                imagenTerminal={imagenTerminal}
                show={modalShowCompleta3}
                onHide={() => setModalShowCompleta3(false)}
              />
            </div>
          ) : (
            <div className="d-flex justify-content-center">
              <h6
                className={
                  darkMode
                    ? "fs-12-a-10 lato-regular  pt-4 text-white"
                    : "fs-12-a-10 lato-regular text-black pt-4 "
                }
              >
                {" "}
                No hay foto de terminal
              </h6>
            </div>
          )}
        </td>
        <td className="fs-14 lato-regular pt-3">
          <div className="d-flex justify-content-center">
            <button
              type="button"
              className={descargandoBtn}
              onClick={() => descargarAudio(id)}
              disabled={descargando}
            >
              {descargando ? "Descargando..." : "Descargar Audio"}
            </button>
          </div>
        </td>

        <td className="fs-14 lato-regular pt-3">
          <div className="d-flex justify-content-center">
            <a
              className="text-decoration-none btn-ver-map  centrado"
              href={url}
              target="_blank"
              rel="noopener noreferrer"
            >
              <article className="d-flex">
                <div className="me-2">
                  <FontAwesomeIcon icon={faMapLocationDot} />
                </div>
                <div>Ver</div>
              </article>
            </a>
          </div>
        </td>
        <td className="fs-14 lato-regular">
          <div className="centrado my-2">
            <Button
              className={getButtonClass()}
              onClick={() => setModalShowCompleta2(true)}
            >
              <article className="d-flex fs-14">
                <div className="me-2">
                  <FontAwesomeIcon icon={faCommentDots} />
                </div>
                <div>Detalle</div>
              </article>
            </Button>
            <ModalObservaciones
              calificacion={calificacion}
              observacionAdmin={observacionAdmin}
                          observacion={observacion}
                          motivo={tipo}
                          cantidadRollos={cantidadRollos}
              show={modalShowCompleta2}
              onHide={() => setModalShowCompleta2(false)}
              idAsesor={id}
            />
          </div>
        </td>
      </tr>
    </>
  );
};

export default ItemsTablaCheckInOut;
