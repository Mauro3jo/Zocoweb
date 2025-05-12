import React, { useContext, useEffect } from "react";
import "./ZocoConect/CustomPopUp.css"
import Confetti from "react-confetti";
import {Col, Row, Table} from "react-bootstrap";
import { ReactComponent as ZocoAyuda } from "../../assets/svg/Zoco Ayuda.svg";
import { ReactComponent as ZocoCheck } from "../../assets/svg/Zoco check.svg";
import { ReactComponent as ZocoAuditoria } from "../../assets/svg/Zoco auditorias.svg";
import { ReactComponent as ZocoMEET } from "../../assets/svg/Zoco meet.svg";
import { ReactComponent as ZocoSeguros } from "../../assets/svg/Zoco seguros.svg";
import { Image } from "react-bootstrap";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faXmark,faHandshake, faCircleCheck, faVideo, faClipboard, faZ} from "@fortawesome/free-solid-svg-icons";
import { DarkModeContext } from "../../context/DarkModeContext";

const PopUpPrueba = ({onClose, data}) => {
  const {darkMode}=useContext(DarkModeContext)
    useEffect(() => {
        // Deshabilitar scroll
        document.body.style.overflow = 'hidden';
        return () => {
          // Habilitar scroll cuando el componente se desmonte
          document.body.style.overflow = 'unset';
        };
      }, []);
    
      // Manejador para el clic fuera del contenido del modal
      const handleOutsideClick = (event) => {
        if (event.target === event.currentTarget) {
          onClose();
        }
      };

      const getZocoIcon = (motivo) => {
        switch (motivo) {
          case "ZOCO AUDITORIA":
            return <ZocoAuditoria style={{ width: 40, height: 40 }} />;
          case "ZOCO AYUDA":
            return <ZocoAyuda style={{ width: 40, height: 40 }} />;
          case "ZOCO CHEEK":
            return <ZocoCheck style={{ width: 40, height: 40 }} />;
          case "ZOCO MEET":
            return <ZocoMEET style={{ width: 40, height: 40 }} />;
          case "ZOCO SEGUROS":
            return <ZocoSeguros style={{ width: 40, height: 40 }} />;
          default:
            return motivo; // En caso de que no haya un ícono para el estado
        }
      };
      return (
        <section>
        <div
          className="modalShadowNotificaciones centrado"
          onClick={handleOutsideClick}
        >
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
              {/* <Image
                className="w-100"
                src={iconopopup}
                alt="icono icono"
                fluid
              /> */}
             <h6 className="text-center lato-bold fs-20" style={{color:"#b4c400"}}> RESUMEN DE GESTIONES</h6>
             <span className="text-center lato-regular fs-14" style={{marginTop:"10px"}}>
              En <strong className="lato-bold">ZOCO</strong>, trabajamos para hacer que cada mes sea mas simple y beneficioso para tu establecimiento.
              <br/>
              <br/>
              Mira todo lo que hicimos por vos en <strong className="lato-bold">{data[0].mes}</strong>:
             </span>
             <div style={{marginTop:"20px"}}>
              
                {Array.isArray(data)&& data.length>0?(
                  data.map((item, index)=>(
                    
                    <Row className="my-3 align-items-center">
                   
                    <Col className="lg-4 md-4 sm-4">
                    <h6 className="text-center lato-bold fs-24">
                      {getZocoIcon(item.motivo)}
                    </h6>
                    
                    </Col>
                    <Col className="lg-4 md-4 sm-4">
                    <h6 className="text-center lato-bold fs-12">{item.motivo}</h6>
                    
                    </Col>
                    <Col className="lg-4 md-4 sm-4" style={{color:"#b4c400"}}>
                    <h6 className="text-center lato-bold fs-20" >
                    {item.conteo}

                    </h6>
                    
                    </Col>
                    </Row>
                    
                  ))
                ):(
                  <p className="text-left lato-bold fs-14">No hay datos disponibles</p>
                )
                }
              
             </div>

             
                {/*<span className="text-center lato-bold fs-14">*/}
                          {/*Le informamos que, debido al feriado del próximo lunes 18/11 , los plazos y pagos se diferirán automáticamente al siguiente día hábil.                </span>*/}
                          {/* <ul className="list-unstyled">
                {Array.isArray(data) && data.length > 0 ? (
                  data.map((item, index) => (
                    <li key={index} className="text-left lato-bold fs-14">
                      <strong>Motivo:</strong> {item.motivo || "No especificado"} <br />
                      <strong>Conteo:</strong> {item.conteo || 0}
                    </li>
                  ))
                ) : (
                  <li className="text-left lato-bold fs-14">
                    No hay información disponible.
                  </li>
                )}
              </ul> */}
            </div>
          </article>
          <article className="d-lg-none d-block">
            <div className="text-center">
              <div className="d-none d-md-block">
                {/* <Image
                  className="w-100"
                  src={iconopopupTablet}
                  alt="icono icono"
                  fluid
                /> */}
                <h6 className="text-center lato-bold fs-20" style={{color:"#b4c400"}}> RESUMEN DE GESTIONES</h6>
             <span className="text-center lato-regular fs-14" style={{marginTop:"10px"}}>
              En <strong className="lato-bold">ZOCO</strong>, trabajamos para hacer que cada mes sea mas simple y beneficioso para tu establecimiento.
              <br/>
              <br/>
              Mira todo lo que hicimos por vos en <strong className="lato-bold">{data[0].mes}</strong>:
             </span>
             <div style={{marginTop:"20px"}}>
              
                {Array.isArray(data)&& data.length>0?(
                  data.map((item, index)=>(
                    
                    <Row className="my-3 align-items-center">
                   
                    <Col className="lg-4 md-3 sm-3">
                    <h6 className="text-center lato-bold fs-20">
                      {getZocoIcon(item.motivo)}
                    </h6>
                    
                    </Col>
                    <Col className="lg-4 md-6 sm-6">
                    <h6 className="text-center lato-bold fs-16">{item.motivo}</h6>
                    
                    </Col>
                    <Col className="lg-4 md-3 sm-3" style={{color:"#b4c400"}}>
                    <h6 className="text-center lato-bold fs-20" >
                    {item.conteo}

                    </h6>
                    
                    </Col>
                    </Row>
                    
                  ))
                ):(
                  <p className="text-left lato-bold fs-14">No hay datos disponibles</p>
                )
                }
              
             </div>
                {/*<span className="text-center lato-bold fs-14">*/}
                {/*Le informamos que, debido al feriado del próximo lunes 18/11 , los plazos y pagos se diferirán automáticamente al siguiente día hábil. */}
                              {/*</span>*/}
                              {/* <ul className="list-unstyled">
                {Array.isArray(data) && data.length > 0 ? (
                  data.map((item, index) => (
                    <li key={index} className="text-left lato-bold fs-14">
                      <strong>Motivo:</strong> {item.motivo || "No especificado"} <br />
                      <strong>Conteo:</strong> {item.conteo || 0}
                    </li>
                  ))
                ) : (
                  <li className="text-left lato-bold fs-14">
                    No hay información disponible.
                  </li>
                )}
              </ul> */}
              </div>
              <div className="d-md-none d-block">
                {/* <Image
                  className="w-100"
                  src={iconopopupCel}
                  alt="icono icono"
                  fluid
                /> */}
               <h6 className="text-center lato-bold fs-20" style={{color:"#b4c400"}}> RESUMEN DE GESTIONES</h6>
             <span className="text-center lato-regular fs-14" style={{marginTop:"10px"}}>
              En <strong className="lato-bold">ZOCO</strong>, trabajamos para hacer que cada mes sea mas simple y beneficioso para tu establecimiento.
              <br/>
              <br/>
              Mira todo lo que hicimos por vos en <strong className="lato-bold">{data[0].mes}</strong>:
             </span>
             <div style={{marginTop:"20px"}}>
              
                {Array.isArray(data)&& data.length>0?(
                  data.map((item, index)=>(
                    
                    <Row className="my-3 align-items-center">
                   
                    <Col className="lg-4 md-3 sm-2">
                    <h6 className="text-center lato-bold fs-20">
                      {getZocoIcon(item.motivo)}
                    </h6>
                    
                    </Col>
                    <Col className="lg-4 md-6 sm-8">
                    <h6 className="text-center lato-bold fs-14">{item.motivo}</h6>
                    
                    </Col>
                    <Col className="lg-4 md-3 sm-2" style={{color:"#b4c400"}}>
                    <h6 className="text-center lato-bold fs-20" >
                    {item.conteo}

                    </h6>
                    
                    </Col>
                    </Row>
                    
                  ))
                ):(
                  <p className="text-left lato-bold fs-14">No hay datos disponibles</p>
                )
                }
              
             </div>

               
              {/*  <span className="text-center lato-bold fs-12">*/}
              {/*  Le informamos que, debido al feriado del próximo lunes 18/11 , los plazos y pagos se diferirán automáticamente al siguiente día hábil.                </span>*/}
                            
              {/* <ul className="list-unstyled">
                {Array.isArray(data) && data.length > 0 ? (
                  data.map((item, index) => (
                    <li key={index} className="text-left lato-bold fs-14">
                      <strong>Motivo:</strong> {item.motivo || "No especificado"} <br />
                      <strong>Conteo:</strong> {item.conteo || 0}
                    </li>
                  ))
                ) : (
                  <li className="text-left lato-bold fs-14">
                    No hay información disponible.
                  </li>
                )}
              </ul>   */}
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
          {/* <div className="caja-popup-notificaciones ">
            <section className="d-flex justify-content-end mt-2">
              <div className="me-1">
                <button className="border-0 btn-filtro-cruz" onClick={onClose}>
                  <FontAwesomeIcon className="fs-18 " icon={faXmark} />
                </button>
              </div>
            </section>
            <article className="d-none d-lg-block">
              <h6 className="text-center lato-bold fs-17">
                Estimado Aliado
              </h6>
              <p className="text-center lato-bold fs-14">
                A continuación, se detalla la información recibida:
              </p>
              {/* Mapeo del array data */}
              {/* <ul className="list-unstyled">
                {Array.isArray(data) && data.length > 0 ? (
                  data.map((item, index) => (
                    <li key={index} className="text-left lato-bold fs-14">
                      <strong>Motivo:</strong> {item.motivo || "No especificado"} <br />
                      <strong>Conteo:</strong> {item.conteo || 0}
                    </li>
                  ))
                ) : (
                  <li className="text-left lato-bold fs-14">
                    No hay información disponible.
                  </li>
                )}
              </ul>
            </article>
            <article className="px-4">
              <button
                className="btn-popUp lato-bold fs-18 my-2"
                type="button"
                onClick={onClose}
              >
                Cerrar
              </button>
            </article>
          </div> */} 
        </div>
      </section>
  )
}

export default PopUpPrueba