import React, { useState } from "react";
import "./ProspectoCarta.css";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faMessage } from "@fortawesome/free-solid-svg-icons";
import { useEffect } from "react";
import MiDetalleProspectoPC from "./MiDetalleProspectoPc";
import MiDetalleProspectoR from "./MiDetalleProspectoR";
import MiDetalleProspectoNC from "./MiDetalleProspectoNC.js";

const ProspectoCarta = () => {
  const [isHovered, setIsHovered] = useState(false);
  const handleMouseEnter = () => {
    setIsHovered(true);
  };
  const handleMouseLeave = () => {
    setIsHovered(false);
  };
  const [modalShow, setModalShow] = useState(false);
  const [modalShow2, setModalShow2] = useState(false);
  const [modalShow3, setModalShow3] = useState(false);

  const [texto, setTexto] = useState(
    "Por favor, tené en cuenta que este comercio no c...."
  );
  const limiteCaracteres = 40;

  useEffect(() => {
    if (texto.length > limiteCaracteres) {
      setTexto(texto.substring(0, limiteCaracteres) + "...");
    }
  }, [texto]);

  return (
    <section className="container my-4">
      <div className="row">
        <div className="col-12 col-md-12  col-lg-4">
          {" "}
          <article className="carta-prospecto ">
            <div className="text-center py-4">
              <h6 className="lato-bold fs-18"> 1er contacto</h6>
            </div>
            <div className="container">
              <article
                className="d-flex justify-content-between container my-3"
                onMouseEnter={handleMouseEnter}
                onMouseLeave={handleMouseLeave}
                onClick={() => setModalShow(true)}
              >
                <div className="d-flex">
                  <div>
                    <div
                      className={
                        isHovered
                          ? "border-izquierda-datos-gris active "
                          : "border-izquierda-datos-gris desactive "
                      }
                    ></div>
                  </div>
                  <div>
                    <div className="container">
                      <div className="d-flex justify-content-between ">
                        <div>
                          <h6 className="fs-18 lato-bold">
                            Ana Manzana <br />
                          </h6>
                        </div>
                      </div>
                      <div>
                        <h6 className="fs-14 text-black-50">
                          Contacto: 10/12/2023
                        </h6>
                        <h6 className="fs-14 lato-bold ">
                          Prospecto tener la primera reunión el Miércoles.
                        </h6>
                      </div>
                    </div>
                    <div className="container-hidden ms-2">
                      <h6 className="animated-text py-1">
                        {" "}
                        <FontAwesomeIcon
                          className="mx-2"
                          icon={faMessage}
                          style={{ color: "#b4c400" }}
                        />{" "}
                        {texto}
                      </h6>
                    </div>
                  </div>
                  <div>
                    <div className="icon-container">
                      <FontAwesomeIcon
                        icon={faMessage}
                        style={{ color: "#B3B5BF" }}
                      />
                      <span className="notification-badge">10</span>
                    </div>
                  </div>
                </div>
              </article>
              <article
                className="d-flex justify-content-between container my-3"
                onMouseEnter={handleMouseEnter}
                onMouseLeave={handleMouseLeave}
                onClick={() => setModalShow(true)}
              >
                <div className="d-flex">
                  <div>
                    <div
                      className={
                        isHovered
                          ? "border-izquierda-datos-gris active "
                          : "border-izquierda-datos-gris desactive "
                      }
                    ></div>
                  </div>
                  <div>
                    <div className="container">
                      <div className="d-flex justify-content-between ">
                        <div>
                          <h6 className="fs-18 lato-bold">
                            La Bandeña <br />
                          </h6>
                        </div>
                      </div>
                      <div>
                        <h6 className="fs-14 text-black-50">
                          Contacto: 10/12/2023
                        </h6>
                        <h6 className="fs-14 lato-bold ">
                          Prospecto tener la primera reunión el Miércoles.
                        </h6>
                      </div>
                    </div>
                    <div className="container-hidden ms-2">
                      <h6 className="animated-text py-1">
                        {" "}
                        <FontAwesomeIcon
                          className="mx-2"
                          icon={faMessage}
                          style={{ color: "#b4c400" }}
                        />{" "}
                        {texto}
                      </h6>
                    </div>
                  </div>
                  <div>
                    <div className="icon-container">
                      <FontAwesomeIcon
                        icon={faMessage}
                        style={{ color: "#B3B5BF" }}
                      />
                      <span className="notification-badge">10</span>
                    </div>
                  </div>
                </div>
              </article>
              <MiDetalleProspectoPC
                show={modalShow}
                onHide={() => setModalShow(false)}
              />
            </div>
          </article>
        </div>
        <div className="col-12 col-md-12  col-lg-4">
          <article className="carta-prospecto">
            <div className="text-center py-4">
              <h6 className="lato-bold fs-18">Reunion</h6>
            </div>
            <div className="container">
              <article
                className="d-flex justify-content-between container my-3"
                onMouseEnter={handleMouseEnter}
                onMouseLeave={handleMouseLeave}
                onClick={() => setModalShow2(true)}
              >
                <div className="d-flex">
                  <div>
                    <div
                      className={
                        isHovered
                          ? "border-izquierda-datos-verde active "
                          : "border-izquierda-datos-verde desactive "
                      }
                    ></div>
                  </div>
                  <div>
                    <div className="container">
                      <div className="d-flex justify-content-between ">
                        <div>
                          <h6 className="fs-18 lato-bold">
                            Ana Manzana <br />
                          </h6>
                        </div>
                      </div>
                      <div>
                        <h6 className="fs-14 color-verde">
                          Sig. reunión: 13/12/2023
                        </h6>
                        <h6 className="fs-14 lato-bold ">
                          Prospecto tener la primera reunión el Miércoles.
                        </h6>
                      </div>
                    </div>
                    <div className="container-hidden ms-2">
                      <h6 className="animated-text py-1">
                        {" "}
                        <FontAwesomeIcon
                          className="mx-2"
                          icon={faMessage}
                          style={{ color: "#b4c400" }}
                        />{" "}
                        {texto}
                      </h6>
                    </div>
                  </div>
                  <div>
                    <div className="icon-container">
                      <FontAwesomeIcon
                        icon={faMessage}
                        style={{ color: "#b4c400" }}
                      />
                      <span className="notification-badge">10</span>
                    </div>
                  </div>
                </div>
              </article>
              <MiDetalleProspectoR
                show={modalShow2}
                onHide={() => setModalShow2(false)}
              />
            </div>
          </article>
        </div>
        <div className="col-12 col-md-12 col-lg-4">
          <article className="carta-prospecto">
            <div className="text-center py-4">
              <h6 className="lato-bold fs-18">No cierra</h6>
            </div>
            <div className="container">
              <article
                className="d-flex justify-content-between container my-3"
                onMouseEnter={handleMouseEnter}
                onMouseLeave={handleMouseLeave}
                onClick={() => setModalShow3(true)}
              >
                <div className="d-flex">
                  <div>
                    <div
                      className={
                        isHovered
                          ? "border-izquierda-datos-rojo active "
                          : "border-izquierda-datos-rojo desactive "
                      }
                    ></div>
                  </div>
                  <div>
                    <div className="container">
                      <div className="d-flex justify-content-between ">
                        <div>
                          <h6 className="fs-18 lato-bold">Comercio 1</h6>
                        </div>
                      </div>
                      <div>
                        <h6 className="fs-14 color-rojo">
                          Razón: Comercio no siguió
                        </h6>
                        <h6 className="fs-14 lato-bold ">
                          Comercio decidió no contratar el servicio.
                        </h6>
                      </div>
                    </div>
                    <div className="container-hidden ms-2">
                      <h6 className="animated-text py-1">
                        {" "}
                        <FontAwesomeIcon
                          className="mx-2"
                          icon={faMessage}
                          style={{ color: "#E24444" }}
                        />{" "}
                        {texto}
                      </h6>
                    </div>
                  </div>
                  <div>
                    <div className="icon-container">
                      <FontAwesomeIcon
                        icon={faMessage}
                        style={{ color: "#E24444" }}
                      />
                      <span className="notification-badge">10</span>
                    </div>
                  </div>
                </div>
              </article>
              <article
                className="d-flex justify-content-between container my-3"
                onMouseEnter={handleMouseEnter}
                onMouseLeave={handleMouseLeave}
                onClick={() => setModalShow3(true)}
              >
                <div className="d-flex">
                  <div>
                    <div
                      className={
                        isHovered
                          ? "border-izquierda-datos-rojo active "
                          : "border-izquierda-datos-rojo desactive "
                      }
                    ></div>
                  </div>
                  <div>
                    <div className="container">
                      <div className="d-flex justify-content-between ">
                        <div>
                          <h6 className="fs-18 lato-bold">Comercio 2</h6>
                        </div>
                      </div>
                      <div>
                        <h6 className="fs-14 color-rojo">
                          Razón: Comercio no siguió
                        </h6>
                        <h6 className="fs-14 lato-bold ">
                          Comercio decidió no contratar el servicio.
                        </h6>
                      </div>
                    </div>

                    <div className="container-hidden ms-2">
                      <h6 className="animated-text py-1">
                        {" "}
                        <FontAwesomeIcon
                          className="mx-2"
                          icon={faMessage}
                          style={{ color: "#E24444" }}
                        />{" "}
                        {texto}
                      </h6>
                    </div>
                  </div>
                  <div>
                    <div className="icon-container">
                      <FontAwesomeIcon
                        icon={faMessage}
                        style={{ color: "#E24444" }}
                      />
                      <span className="notification-badge">10</span>
                    </div>
                  </div>
                </div>
              </article>

              <MiDetalleProspectoNC
                show={modalShow3}
                onHide={() => setModalShow3(false)}
              />
            </div>
          </article>
        </div>
      </div> 
    </section>
  );
};

export default ProspectoCarta;
