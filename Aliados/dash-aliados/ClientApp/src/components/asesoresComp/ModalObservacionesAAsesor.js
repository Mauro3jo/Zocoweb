// import hooks
import React, { useState, useContext } from "react";

// import context
import { DarkModeContext } from "../../context/DarkModeContext";

// librerias
import { Modal, Button } from "react-bootstrap";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faCheck, faXmark } from "@fortawesome/free-solid-svg-icons";

const ModalObservacionesAAsesor = ({
  show,
  onHide,
  idAsesor,
  calificacion,
  observacionAdmin,
}) => {
  // variable darkmode context para la funcionalidad claro oscuro
  const { darkMode } = useContext(DarkModeContext);

  return (
    <Modal
      show={show}
      onHide={onHide}
      centered
      aria-labelledby="modal-observaciones"
    >
      <Modal.Body className={darkMode ? "text-white bg-dark" : "text-dark"}>
        <section className="d-flex justify-content-between my-4">
          <div className="ocultar-div"></div>
          <div className="d-flex justify-content-center">
            <h6 className="fs-18 lato-bold">Observaciones</h6>
          </div>
          <div>
            <button className="border-0 btn-filtro-cruz" onClick={onHide}>
              <FontAwesomeIcon className="fs-18 " icon={faXmark} />
            </button>
          </div>
        </section>

        <section className="container">
          {calificacion === true ? (
            <div className="d-flex">
              <h6 className="fs-16 lato-bold my-4 color-verde">
                <FontAwesomeIcon className="color-verde me-2" icon={faCheck} />
                Aprobado
              </h6>
            </div>
          ) : (
            <div className="d-flex">
              <h6 className="fs-16 lato-bold my-4 color-rojo">
                <FontAwesomeIcon className="color-rojo" icon={faXmark} />{" "}
                Desaprobado
              </h6>
            </div>
          )}

          <h6 className="fs-14">
            {observacionAdmin === "" ? " " : observacionAdmin}
          </h6>
          <div className="py-5 d-flex justify-content-center">
            <Button
              onClick={onHide}
              className={
                darkMode
                  ? "d-flex justify-content-center btn-observaciones-dark  border-0 "
                  : "d-flex justify-content-center  btn-observaciones   border-0 "
              }
            >
              <article className=" d-flex fs-14 text-center">Aceptar</article>
            </Button>
          </div>
        </section>
      </Modal.Body>
    </Modal>
  );
};

export default ModalObservacionesAAsesor;
