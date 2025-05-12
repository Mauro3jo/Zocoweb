import React, { useEffect } from "react";
import "./PopUpCalificar.css";
import { Carousel, Modal, Image } from "react-bootstrap";
import iconopopup from "../assets/img/NotificacionesModales/horariosEscritorio.png";
import iconopopupTablet from "../assets/img/NotificacionesModales/horariosTablet.png";
import iconopopupCel from "../assets/img/NotificacionesModales/horariosMovil.png";
import iconopopup2 from "../assets/img/NotificacionesModales/cloverDesktop.png";
import iconopopupTablet2 from "../assets/img/NotificacionesModales/cloverTablet.png";
import iconopopupCel2 from "../assets/img/NotificacionesModales/cloverMovil.png";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faXmark } from "@fortawesome/free-solid-svg-icons";

const PopUpNotificacionesCarousel = ({ onClose }) => {
  useEffect(() => {
    document.body.style.overflow = "hidden";
    return () => {
      document.body.style.overflow = "unset";
    };
  }, []);

  const handleOutsideClick = (event) => {
    if (event.target === event.currentTarget) {
      onClose();
    }
  };

  return (
    <Modal show={true} onHide={onClose} centered size="xl">
      <Modal.Body>
        <section className="d-flex justify-content-between ">
          <div className="ocultar-div"></div>
          <div className="d-flex justify-content-center ocultar-div">
            <h6 className="fs-18 lato-bold">Nueva consulta</h6>
          </div>
          <div>
            <button className="border-0 btn-filtro-cruz" onClick={onClose}>
              <FontAwesomeIcon className="fs-18" icon={faXmark} />
            </button>
          </div>
        </section>
        <Carousel interval={5000} controls={true} data-bs-theme="dark">
          <Carousel.Item className="pb-4">
            <div className="text-center">
              <div className="d-none d-lg-block px-5">
                <Image
                  className="w-100"
                  src={iconopopup2}
                  alt="icono escritorio"
                  fluid
                />
              </div>
              <div className="d-none d-md-block d-lg-none">
                <Image
                  className="w-100"
                  src={iconopopupTablet2}
                  alt="icono tablet"
                  fluid
                />
              </div>
              <div className="d-block d-md-none">
                <Image
                  className="w-100"
                  src={iconopopupCel2}
                  alt="icono móvil"
                  fluid
                />
              </div>
            </div>
          </Carousel.Item>
          <Carousel.Item className="pb-4">
            <div className="text-center">
              <div className="d-none d-lg-block px-5">
                <Image
                  className="w-100"
                  src={iconopopup}
                  alt="icono escritorio"
                  fluid
                />
              </div>
              <div className="d-none d-md-block d-lg-none">
                <Image
                  className="w-100"
                  src={iconopopupTablet}
                  alt="icono tablet"
                  fluid
                />
              </div>
              <div className="d-block d-md-none">
                <Image
                  className="w-100"
                  src={iconopopupCel}
                  alt="icono móvil"
                  fluid
                />
              </div>
            </div>
          </Carousel.Item>
        </Carousel>
        <div className="text-center">
          <button
            className="btn-popUp lato-bold fs-18 my-2"
            type="button"
            onClick={onClose}
          >
            Cerrar
          </button>
        </div>
      </Modal.Body>
    </Modal>
  );
};

export default PopUpNotificacionesCarousel;
