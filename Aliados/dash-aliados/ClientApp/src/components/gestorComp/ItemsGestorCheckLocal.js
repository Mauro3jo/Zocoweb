// import hooks
import React, { useContext } from "react";

// import context
import { DarkModeContext } from "../../context/DarkModeContext";

// import librerias
import Button from "react-bootstrap/Button";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faCommentDots } from "@fortawesome/free-solid-svg-icons";

// import component
import ModalObservacionesGestor from "./ModalObservacionesGestor";
import formatearFecha from "../../helpers/formatearFecha";
import extraerFechaHora from "../../helpers/extraerFechaHora";

const ItemsGestorCheckLocal = ({
  id,
  local,
  fechaHora,
  tipo,
  latitud,
  longitud,
  audioBase64,
  imagenBase64,
  calificacion,
  observacionAdmin,
}) => {
  const { darkMode } = useContext(DarkModeContext);
  const url = `https://www.google.com/maps?q=${latitud},${longitud}`;
  const base64ToUrl = (base64, mimeType) => {
    return `data:${mimeType};base64,${base64}`;
  };

  // modal imagen
  const [modalShowCompleta2, setModalShowCompleta2] = React.useState(false);

  const { fecha, hora } = extraerFechaHora(fechaHora);

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


  return (
    <>
      <tr
        className={
          darkMode
            ? " tabla-borde-bottom  text-white"
            : "tabla-borde-bottom  text-dark"
        }
      >
        <td className="fs-12-a-10 lato-regular pt-4 "> {local}</td>
        <td className="fs-12-a-10 lato-regular pt-4 ">
          {" "}
          {fecha} - Hora: {hora}
        </td>
        <td className="fs-14 lato-regular pt-3">
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
        <td className="fs-14 lato-regular">
          {calificacion === null || undefined || "" ? (
            <>
              <h6 className="mt-3 fs-12-a-10">
                {" "}
                No se efectuaron observaciones
              </h6>
            </>
          ) : (
            <>
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

                <ModalObservacionesGestor
                  show={modalShowCompleta2}
                  onHide={() => setModalShowCompleta2(false)}
                  idAsesor={id}
                  calificacion={calificacion}
                  observacionAdmin={observacionAdmin}
                />
              </div>
            </>
          )}
        </td>
      </tr>
    </>
  );
};

export default ItemsGestorCheckLocal;
