// import hooks
import React, { useContext } from "react";

// import context
import { DarkModeContext } from "../../context/DarkModeContext";

// import librerias
import Button from "react-bootstrap/Button";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faCommentDots } from "@fortawesome/free-solid-svg-icons";

// import component
import ModalObservacionesAAsesor from "./ModalObservacionesAAsesor";

const ItemsAsesorCheckLocal = ({
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
        <td className="fs-12-a-10 lato-regular pt-4 "> {fechaHora}</td>
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
        {calificacion === null || undefined || "" ? <>
        <h6 className="mt-3 fs-12-a-10"> No se efectuaron observaciones</h6>
        </> : <>
        <div className="centrado my-2">
            <Button
              className={
                darkMode
                  ? "d-flex btn-observaciones-dark  centrado border-0"
                  : "d-flex btn-observaciones centrado  border-0"
              }
              onClick={() => setModalShowCompleta2(true)}
            >
              <article className="d-flex fs-14">
                <div className="me-2">
                  <FontAwesomeIcon icon={faCommentDots} />
                </div>
                <div>Detalle</div>
              </article>
            </Button>
          
            <ModalObservacionesAAsesor
                  show={modalShowCompleta2}
                  onHide={() => setModalShowCompleta2(false)}
                  idAsesor={id}
                  calificacion={calificacion}
                  observacionAdmin={observacionAdmin}
                />
            
          </div>
        </>}
        
        </td>
      </tr>
    </>
  );
};

export default ItemsAsesorCheckLocal;
