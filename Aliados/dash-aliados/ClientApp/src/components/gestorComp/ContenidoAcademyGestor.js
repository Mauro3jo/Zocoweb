import React, { useContext } from "react";
import "./ContenidoAcademyGestor.css";
import { Accordion } from "react-bootstrap";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faBookBookmark, faBookmark } from "@fortawesome/free-solid-svg-icons";
import { DarkModeContext } from "../../context/DarkModeContext";
import CartasModulosGestor from "./CartasModulosGestor";
import CartasExtrasGestor from "./CartaExtrasGestor";

const ContenidoAcademyGestor = () => {
  const { darkMode } = useContext(DarkModeContext);
  return (
    <div className="container" >
      <Accordion defaultActiveKey="0">
        <Accordion.Item className={darkMode  ? "acordeon-academy-dark border-0 my-2" :"acordeon-academy border-0 my-2" } eventKey="0">
          <Accordion.Header>
            <FontAwesomeIcon
              className="color-verde me-2 "
              icon={faBookBookmark}
            />
            <span className="lato-bold">Modulos</span>
          </Accordion.Header>
          <Accordion.Body>
            <CartasModulosGestor />
          </Accordion.Body>
        </Accordion.Item>
        <Accordion.Item className={darkMode  ? "acordeon-academy-dark border-0 my-4" :"acordeon-academy border-0 my-4" } eventKey="1">
          <Accordion.Header><FontAwesomeIcon
              className="color-verde me-2 "
              icon={faBookmark}
            />
            <span className="lato-bold">Extras</span></Accordion.Header>
          <Accordion.Body>
            <CartasExtrasGestor />
          </Accordion.Body>
        </Accordion.Item>
      </Accordion>
    </div>
  );
};

export default ContenidoAcademyGestor;
