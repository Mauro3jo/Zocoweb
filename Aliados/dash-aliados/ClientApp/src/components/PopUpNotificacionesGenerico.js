import React, { useEffect } from "react";
import "./PopUpCalificar.css";
import Confetti from "react-confetti";
import iconopopup from "../assets/img/modalsimuladorgestor.png";
import iconopopupTablet from "../assets/img/modalsimuladorgestortablet.png";
import iconopopupCel from "../assets/img/modalsimuladorgestormobile.png";
import { Image } from "react-bootstrap";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faXmark } from "@fortawesome/free-solid-svg-icons";

const PopUpNotificacionesGenerico = ({ onClose }) => {
  useEffect(() => {
    // Deshabilitar scroll
    document.body.style.overflow = "hidden";
    return () => {
      // Habilitar scroll cuando el componente se desmonte
      document.body.style.overflow = "unset";
    };
  }, []);

  // Manejador para el clic fuera del contenido del modal
  const handleOutsideClick = (event) => {
    if (event.target === event.currentTarget) {
      onClose();
    }
  };

  return (
    <section>
      <div
        className="modalShadowNotificaciones centrado"
        onClick={handleOutsideClick}
      >
      {/* aqui si queres el confetti descomenta el de abajo */}
        {/* <Confetti width={window.innerWidth} height={window.innerHeight} /> */}
      {/* sino activa este otro  */}
        <div className="caja-popup-notificaciones ">
          <section className="d-flex justify-content-end mt-2">
            <div className="me-1">
              <button className="border-0 btn-filtro-cruz" onClick={onClose}>
                <FontAwesomeIcon className="fs-18 " icon={faXmark} />
              </button>
            </div>
          </section>
          <article className="d-none d-lg-block">
            <div className="text-center">
              <Image
                className="w-100"
                src={iconopopup}
                alt="icono icono"
                fluid
              />
            </div>
          </article>
          <article className="d-lg-none d-block">
            <div className="text-center">
              <div className="d-none d-md-block">
                <Image
                  className="w-100"
                  src={iconopopupTablet}
                  alt="icono icono"
                  fluid
                />
              </div>
              <div className="d-md-none d-block">
                <Image
                  className="w-100"
                  src={iconopopupCel}
                  alt="icono icono"
                  fluid
                />
              </div>
            </div>
          </article>
          <article className="px-4">
            <button
              className="btn-popUp lato-bold fs-18 my-2  "
              type="button"
              onClick={onClose}
            >
              Cerrar
            </button>
          </article>
        </div>
      </div>
    </section>
  );
};

export default PopUpNotificacionesGenerico;
