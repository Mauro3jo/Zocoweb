import React, { useEffect, useRef } from "react";
import "./PopUpCalificar.css";
import Confetti from "react-confetti";
//import iconopopup from "../assets/img/NotificacionesModales/Modal Carnaval 2025 (Pc).png";
//import iconopopupTablet from "../assets/img/NotificacionesModales/Modal Carnaval 2025 (Tablet).png";
//import iconopopupCel from "../assets/img/NotificacionesModales/Modal Carnaval 2025 (Celular).png";
//import iconopopup from "../assets/img/NotificacionesModales/Modales_(Demoras_en _mañana se acredita_)_Tamaño_Pc.png";
//import iconopopupTablet from "../assets/img/NotificacionesModales/Modales_(Demoras_en _mañana se acredita_)_Tamaño_Celular.png";
//import iconopopupCel from "../assets/img/NotificacionesModales/Modales_(Demoras_en _mañana se acredita_)_Tamaño_Celular.png";
//import iconopopup from "../assets/img/NotificacionesModales/Pago diferido - Día de la memoria (tamaño Pc).png";
//import iconopopupTablet from "../assets/img/NotificacionesModales/Pago diferido - Día de la memoria (tamaño tablet).png";
//import iconopopupCel from "../assets/img/NotificacionesModales/Pago diferido - Día de la memoria (tamaño celular).png";
import iconopopup from "../assets/img/NotificacionesModales/Jueves y Viernes Santo (PC).png";
import iconopopupTablet from "../assets/img/NotificacionesModales/Jueves y Viernes Santo (Tablet).png";
import iconopopupCel from "../assets/img/NotificacionesModales/Jueves y Viernes Santo (Celular).png";

import { Image } from "react-bootstrap";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faXmark } from "@fortawesome/free-solid-svg-icons";
import { Fireworks } from "fireworks-js";

const PopUpNotificaciones = ({ onClose }) => {

 const containerRef = useRef(null);
     const modalRef = useRef(null); 
   useEffect(() => {
     // Deshabilitar scroll
     document.body.style.overflow = "hidden";
 
     if (containerRef.current) {
       const options = {
         speed: 3,
         acceleration: 1.05,
         friction: 0.97,
         gravity: 1.5,
         particles: 50,
         trace: 3,
         explosion: 5,
         boundaries: {
           top: 0,
           bottom: containerRef.current.clientHeight,
           left: 0,
           right: containerRef.current.clientWidth,
         },
         sound: {
           enable: false,
         },
       };
       const fireworks = new Fireworks(containerRef.current, options);
       fireworks.start();
       return () => {
        // Habilitar scroll cuando el componente se desmonte
        document.body.style.overflow = 'unset';
      };
     }
   }, []);

  // Manejador para el clic fuera del contenido del modal
  const handleOutsideClick = (event) => {
    if (event.target === event.currentTarget) {
      onClose();
    }
  };
  return (
    <section>
      <div  className="modalShadowNotificaciones centrado" onClick={handleOutsideClick}>
      {/* <div
          ref={containerRef}
          style={{
            width: "100%",
            height: "100%",
            position: "fixed",
            zIndex: -1,
          }}
        /> */}
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
                src={iconopopup}
                alt="icono icono"
                fluid
              /> 
             {/* <h6 className="text-center lato-bold fs-17"> Estimado Aliado</h6> */}
                {/*<span className="text-center lato-bold fs-14">*/}
                          {/*Le informamos que, debido al feriado del próximo lunes 18/11 , los plazos y pagos se diferirán automáticamente al siguiente día hábil.                </span>*/}
                          {/* <span className="text-center lato-bold fs-14">
                          Te informamos que estamos trabajando en una reducción de tasa del anticipo para ofrecerte mayores beneficios. Este cambio requiere una actualización en nuestros sistemas, por lo que las operaciones se acreditarán temporalmente en los plazos normales.
                          <br/>
Gracias por tu comprensión y confianza.
                          </span> */}
                          
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
                {/* <h6 className="text-center lato-bold fs-17"> Estimado Aliado</h6> */}
                {/*<span className="text-center lato-bold fs-14">*/}
                {/*Le informamos que, debido al feriado del próximo lunes 18/11 , los plazos y pagos se diferirán automáticamente al siguiente día hábil. */}
                              {/*</span>*/}
                              {/* <span className="text-center lato-bold fs-14">
                              Te informamos que estamos trabajando en una reducción de tasa del anticipo para ofrecerte mayores beneficios. Este cambio requiere una actualización en nuestros sistemas, por lo que las operaciones se acreditarán temporalmente en los plazos normales.
                              <br/>

Gracias por tu comprensión y confianza.
                              </span> */}
              </div>
              <div className="d-md-none d-block">
                 <Image
                  className="w-100"
                  src={iconopopupCel}
                  alt="icono icono"
                  fluid
                /> 
               {/* <h6 className="text-center lato-bold fs-14"> Estimado Aliado</h6> */}
              {/*  <span className="text-center lato-bold fs-12">*/}
              {/*  Le informamos que, debido al feriado del próximo lunes 18/11 , los plazos y pagos se diferirán automáticamente al siguiente día hábil.                </span>*/}
                            
                              {/* <span className="text-center lato-bold fs-12">
                              Te informamos que estamos trabajando en una reducción de tasa del anticipo para ofrecerte mayores beneficios. Este cambio requiere una actualización en nuestros sistemas, por lo que las operaciones se acreditarán temporalmente en los plazos normales.
                              <br/>
Gracias por tu comprensión y confianza.
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

export default PopUpNotificaciones;
