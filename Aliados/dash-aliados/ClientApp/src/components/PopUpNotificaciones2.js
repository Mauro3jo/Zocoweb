import React, { useEffect, useRef } from "react";
import { Fireworks } from "fireworks-js";
import "./PopUpCalificar.css";
import SliderNotificaciones from "./SliderNotificaciones";
import SliderNotificacionesCelular from "./SliderNotificacionesCelular";

const PopUpNotificaciones2 = ({ onClose }) => {
  const containerRef = useRef(null);

  useEffect(() => {
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
      return () => fireworks.stop();
    }
  }, []);

  return (
    <section>
      <div className="modalShadowNotificacionesSinBlur centrado">
        <div
          ref={containerRef}
          style={{
            width: "100%",
            height: "100%",
            position: "fixed",
            zIndex: -1,
          }}
        />

        <div className="d-none d-lg-block">
          <article className="caja-popup-notificaciones ">
            <SliderNotificaciones onClose={onClose} />
          </article>
        </div>
        <div className="d-lg-none d-block">
          <article className="caja-popup-notificaciones ">
            <SliderNotificacionesCelular onClose={onClose} />
          </article>
        </div>
      </div>
    </section>
  );
};

export default PopUpNotificaciones2;
