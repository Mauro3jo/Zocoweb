import React, { useContext } from "react";
import { faXmark } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { Modal } from "react-bootstrap";
import { DarkModeContext } from "../../context/DarkModeContext";
import formatDate from "../../helpers/formatDate";
import FormAltasEditarNuevaPersonaFisica from "../gestorComp/FormAltaEditarNuevaPersonaFisica";
import FormAltaEditarJuridicaPersona from "../gestorComp/FormAltaEditarJuridicaPersona";
import FormBajasEditar from "../gestorComp/FormBajasEditar";
import FormModificacionesEditar from "../gestorComp/FormModificacionEditar";

const ModalEditarTablaModificacion = ({ show, onHide, item }) => {
  const { numeroTerminal, fechaNacimiento, id } = item;
  const fechaNacimientoFormateada = formatDate(fechaNacimiento);

  const { darkMode } = useContext(DarkModeContext);
  return (
    <Modal
      show={show}
      onHide={onHide}
      centered
      size="xl"
      fullscreen={true}
      style={{
        backgroundColor: "#E5E8EE ",
        opacity: "1",
      }}
    >
      <Modal.Body className={darkMode ? " modal-fondo " : "modal-fondo "}>
        <section className="d-flex justify-content-between my-4 container">
          <div className="ocultar-div"></div>
          <div className="d-flex justify-content-center">
            <h6 className="fs-18 lato-bold">Editar </h6>
          </div>
          <div>
            <button className="border-0 btn-filtro-cruz" onClick={onHide}>
              <FontAwesomeIcon className="fs-18 " icon={faXmark} />
            </button>
          </div>
        </section>
        <div className="container">
        <FormModificacionesEditar item={item} />
        </div>
      </Modal.Body>
    </Modal>
  );
};

export default ModalEditarTablaModificacion;
