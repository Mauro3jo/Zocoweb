import React, { useContext } from "react";
import { Modal } from "react-bootstrap";

import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faXmark } from "@fortawesome/free-solid-svg-icons";
import { DarkModeContext } from "../../context/DarkModeContext";

const ModalImagenTabla = (props) => {
  const { show, onHide } = props;
  const { darkMode } = useContext(DarkModeContext);

  const base64ToUrl = (base64, mimeType) => {
    return `data:${mimeType};base64,${base64}`;
  };

  return (
    <div>
      <Modal
        {...props}
        show={show}
        onHide={onHide}
        centered
        size="lg"
        aria-labelledby="contained-modal-title-vcenter"
      >
        <Modal.Body
          className={
            darkMode
              ? " modal-content-dark text-white "
              : "modal-content text-black "
          }
        >
          <section className="d-flex justify-content-between my-4">
            <div className="ocultar-div"></div>
            <div className="d-flex justify-content-center">
              <h6 className="fs-18 lato-bold">Foto del comercio </h6>
            </div>
            <div>
              <button className="border-0 btn-filtro-cruz" onClick={onHide}>
                <FontAwesomeIcon className="fs-18 " icon={faXmark} />
              </button>
            </div>
          </section>
          {props.imagenBase64 && (
            <img
              src={base64ToUrl(props.imagenBase64, "image/png")}
              alt="Imagen"
              style={{ width: "100%" }}
            />
          )}
        </Modal.Body>
      </Modal>
    </div>
  );
};

export default ModalImagenTabla;
