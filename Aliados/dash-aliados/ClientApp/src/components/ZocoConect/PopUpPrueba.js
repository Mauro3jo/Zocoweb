import React, { useContext, useEffect, useRef } from "react";
import "./CustomPopUp.css";
import Confetti from "react-confetti";
import {Col, Row, Table} from "react-bootstrap";
import { ReactComponent as ZocoAyuda } from "../../assets/svg/Zoco Ayuda.svg";
import { ReactComponent as ZocoCheck } from "../../assets/svg/Zoco check.svg";
import { ReactComponent as ZocoAuditoria } from "../../assets/svg/Zoco auditorias.svg";
import { ReactComponent as ZocoMEET } from "../../assets/svg/Zoco meet.svg";
import { ReactComponent as ZocoSeguros } from "../../assets/svg/Zoco seguros.svg";
import {ReactComponent as ZocoServicioTecnico} from "../../assets/svg/Servicio tecnico.svg";
import {ReactComponent as ZocoEnvioRollos} from "../../assets/svg/Envio de rollos.svg";
import { Image } from "react-bootstrap";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faXmark,faHandshake, faCircleCheck, faVideo, faClipboard, faZ} from "@fortawesome/free-solid-svg-icons";
import { DarkModeContext } from "../../context/DarkModeContext";
import { Fireworks } from "fireworks-js";



const PopUpPrueba = ({onClose, data}) => {
  const {darkMode}=useContext(DarkModeContext)
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
      return () => fireworks.stop();
    }
  }, []);

  const handleOutsideClick = (event) => {
    if (event.target === event.currentTarget) {
      onClose();
    }
  };

  const getZocoIcon = (motivo) => {
    switch (motivo) {
      case "ZOCO AUDITORIA":
        return <ZocoAuditoria className="ZocoIcono" />;
      case "ZOCO AYUDA":
        return <ZocoAyuda className="ZocoIcono" />;
      case "ZOCO CHECK":
        return <ZocoCheck className="ZocoIcono" />;
      case "ZOCO MEET":
        return <ZocoMEET className="ZocoIcono" />;
      case "ZOCO SEGUROS":
        return <ZocoSeguros className="ZocoIcono" />;
      case "SERVICIO TECNICO":
        return <ZocoServicioTecnico className="ZocoIcono"/>;
      case "ENVIO ROLLOS":
        return <ZocoEnvioRollos className="ZocoIcono"/>;
      default:
        return <FontAwesomeIcon icon={faZ} color="#b4c400"/>
    }
  };

  return (
    <section>
      {/* Contenedor de fuegos artificiales */}
    
{/* Confetti */}

          <div
            className="zocoModalShadow"
            onClick={handleOutsideClick}
          >
              <div
          // ref={containerRef}
          style={{
            width: "100%",
            height: "100%",
            position: "fixed",
            zIndex: -1,
          }}
        />
        {/* <Confetti width={window.innerWidth} height={window.innerHeight} recycle={false} numberOfPieces={200} /> */}



            <div className="zocoPopupContainer" >
          
              <section className="d-flex justify-content-end mt-2">
                <div className="me-1">
                  <button className="zocoCloseButton" onClick={onClose}>
                    <FontAwesomeIcon icon={faXmark} />
                  </button>
                </div>
              </section>
              <div className="ZocoTextcenter">
                <h6>RESUMEN DE GESTIONES</h6>
                
                <div className="zocoContainer">
                <span>
                  En <strong>Zoco</strong>, nuestro compromiso es hacer que cada servicio sea una experiencia memorable
                  <br/>
                  <br />
                  Mira todo lo que hicimos por vos en{" "}
                  <strong>{data[0].mes}</strong>:
                </span>
                </div>
                
                
                <div >
                  {Array.isArray(data) && data.length > 0 ? (
                    data.map((item, index) => (
                      <Row className="zocoRow zocoRowAlignCenter" key={index}>
                        <Col>
                          <div>{getZocoIcon(item.motivo)}</div>
                        </Col>
                        <Col className="zocoMotivo">
                          <h6 className="zocoTextCenter zocoFontMedium">
                            {item.motivo}
                          </h6>
                        </Col>
                        <Col style={{ color: "#b4c400" }}>
                          <h6 className="zocoTextCenter zocoFontXL">
                            {item.conteo}
                          </h6>
                        </Col>
                      </Row>
                    ))
                  ) : (
                    <p className="zocoFontMedium">No hay datos disponibles</p>
                  )}
                </div>
                <br/>
                <button className="zocoActionButton" onClick={onClose}>
                  Cerrar
                </button>
              </div>
            </div>
          </div>
        </section>
      );
    };
    
    export default PopUpPrueba;