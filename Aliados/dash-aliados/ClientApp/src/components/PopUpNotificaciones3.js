import React, { useEffect, useRef } from "react";
import "./PopUpCalificar.css";
import Confetti from "react-confetti";
import iconopopup2 from "../assets/img/NotificacionesModales/Modal pagos diferidos - Tamaño PC.png";
import iconopopupTablet2 from "../assets/img/NotificacionesModales/Modal pagos diferidos - Tamaño Tablet.png";
import iconopopupCel2 from "../assets/img/NotificacionesModales/Modal pagos diferidos - Tamaño Celular.png";
import { Image } from "react-bootstrap";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faXmark } from "@fortawesome/free-solid-svg-icons";
import { Fireworks } from "fireworks-js";

const PopUpNotificaciones3 = ({ onClose }) => {
  const containerRef = useRef(null);
  const modalRef = useRef(null);
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
        {/* <Confetti width={window.innerWidth} height={window.innerHeight} /> */}
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
                src={iconopopup2}
                alt="icono icono"
                fluid
              /> 
              {/* <h6 className="text-center lato-bold fs-17"> Estimado Aliado</h6>

              <span className="text-center lato-bold fs-14">
                Te informamos que estamos procesando tus datos. Durante el día
                de hoy, verás actualizado el concepto de "mañana se acredita".
                <br />
                Agradecemos tu comprensión.
              </span> */}
            </div>
          </article>
          <article className="d-lg-none d-block">
            <div className="text-center">
              <div className="d-none d-md-block">
                <Image
                  className="w-100"
                  src={iconopopupTablet2}
                  alt="icono icono"
                  fluid
                /> 
               {/* <h6 className="text-center lato-bold fs-17"> Estimado Aliado</h6>  */}
                {/*<span className="text-center lato-bold fs-14">*/}
                {/*Le informamos que, debido al feriado del próximo lunes 18/11 , los plazos y pagos se diferirán automáticamente al siguiente día hábil. */}
                {/*</span>*/}
                {/* <span className="text-center lato-bold fs-14">
                  Te informamos que estamos procesando tus datos. Durante el día
                  de hoy, verás actualizado el concepto de "mañana se acredita".
                  <br />
                  Agradecemos tu comprensión.
                </span> */}
              </div>
              <div className="d-md-none d-block">
                 <Image
                  className="w-100"
                  src={iconopopupCel2}
                  alt="icono icono"
                  fluid
                /> 
                 {/* <h6 className="text-center lato-bold fs-14"> Estimado Aliado</h6>  */}
                {/*  <span className="text-center lato-bold fs-12">*/}
                {/*  Le informamos que, debido al feriado del próximo lunes 18/11 , los plazos y pagos se diferirán automáticamente al siguiente día hábil.                </span>*/}

                 {/* <span className="text-center lato-bold fs-12">
                             Te informamos que estamos procesando tus datos. Durante el día
                  de hoy, verás actualizado el concepto de "mañana se acredita".
                  <br />
                  Agradecemos tu comprensión.
                              </span>  */}
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

export default PopUpNotificaciones3;
