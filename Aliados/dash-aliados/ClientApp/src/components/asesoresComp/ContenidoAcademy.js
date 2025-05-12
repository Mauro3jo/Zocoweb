import React, { useContext } from "react";
import "./ContenidoAcademy.css";
import { Accordion } from "react-bootstrap";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faBookBookmark, faBookmark } from "@fortawesome/free-solid-svg-icons";
import CartasModulos from "./CartasModulos";
import { DarkModeContext } from "../../context/DarkModeContext";
import CartasExtras from "./CartasExtras";

const ContenidoAcademy = () => {
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
            <CartasModulos />
          </Accordion.Body>
        </Accordion.Item>
        <Accordion.Item className={darkMode  ? "acordeon-academy-dark border-0 my-4" :"acordeon-academy border-0 my-4" } eventKey="1">
          <Accordion.Header><FontAwesomeIcon
              className="color-verde me-2 "
              icon={faBookmark}
            />
            <span className="lato-bold">Extras</span></Accordion.Header>
          <Accordion.Body>
            <CartasExtras />
          </Accordion.Body>
        </Accordion.Item>
      </Accordion>
    </div>
  );
};

export default ContenidoAcademy;
