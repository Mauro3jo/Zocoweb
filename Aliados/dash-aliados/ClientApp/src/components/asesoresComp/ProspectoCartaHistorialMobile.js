import React, { useContext, useState } from "react";

import MiDetalleAltaProspectoHistorial from "./MiDetalleAltaProspectoHistorial";
import "./ProspectoCarta.css";

import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faCaretLeft,
  faMessage,
} from "@fortawesome/free-solid-svg-icons";
import MiDetalleNoCierraProspectoHistorial from "./MiDetalleNoCierraProspectoHistorial";
import { NavLink } from "react-router-dom";
import { DarkModeContext } from "../../context/DarkModeContext";

const ProspectoCartaHistorialMobile = () => {
  const [isHovered, setIsHovered] = useState(false);

  const handleMouseEnter = () => {
    setIsHovered(true);
  };

  const handleMouseLeave = () => {
    setIsHovered(false);
  };

  const [modalShow, setModalShow] = React.useState(false);
  const [modalShow2, setModalShow2] = React.useState(false);
  const { darkMode } = useContext(DarkModeContext);
  const [mostrarCartaAlta, setMostrarCartaAlta] = useState(true);
  const [mostrarCartaNoCierra, setMostrarCartaNoCierra] = useState(false);

  const mostrarCardPrimerContacto = () => {
    setMostrarCartaAlta(true);
    setMostrarCartaNoCierra(false);
    activadoBtnAltas();
  };

  const mostrarCardReuniones = () => {
    setMostrarCartaAlta(false);
    setMostrarCartaNoCierra(true);
    activadoBtnNoCierra();
  };

  const [activeAltasMobile, setActiveAltasMobile] = useState(false);
  const [activeNoCierra, setActiveNoCierra] = useState(false);

  const activadoBtnAltas = () => {
    setActiveAltasMobile(true);
    setActiveNoCierra(false);
  };

  const activadoAltas = () => {
    if (activeAltasMobile && darkMode) {
      return " d-flex btn-reunion-mobile-active-prospecto-historial centrado";
    } else if (activeAltasMobile) {
      return " btn-reunion-mobile-active-prospecto-historial lato-bold fs-16 centrado";
    } else if (darkMode) {
      return "d-flex btn-reunion-mobile-prospecto-historial  centrado";
    } else {
      return "btn-reunion-mobile-prospecto-historial border-0 lato-bold fs-16 centrado";
    }
  };

  const activadoBtnNoCierra = () => {
    setActiveAltasMobile(false);
    setActiveNoCierra(true);
  };

  const activadoNoCierra = () => {
    if (activeNoCierra && darkMode) {
      return " d-flex btn-no-cierra-mobile-active-prospecto-historial centrado";
    } else if (activeNoCierra) {
      return " btn-no-cierra-mobile-active-prospecto-historial lato-bold fs-16 centrado";
    } else if (darkMode) {
      return "d-flex btn-no-cierra-mobile-prospecto-historial centrado";
    } else {
      return " btn-no-cierra-mobile-prospecto-historial border-0 lato-bold fs-16 centrado";
    }
  };

  return (
    <section className="container">
      <div className="mt-4 d-flex">
        <div>
          <NavLink
            end
            to="/asesores/prospecto"
            className=" border-0 text-decoration-none d-flex color-negro"
          >
            <FontAwesomeIcon
              className="mt-1"
              icon={faCaretLeft}
              style={{ color: "#b4c400", fontSize: "62px" }}
            />
          </NavLink>
        </div>
        <div className="my-4">
          <h6 className="fs-18" style={{ color: "#b4c400" }}>
            Volver
          </h6>
        </div>
      </div>
      <div className="d-flex justify-content-center">
        <h6 className="lato-bold fs-18 pb-2">Historial de prospectos</h6>
      </div>
      <div className="d-flex justify-content-between">
        <div>
          <button
            className={activadoAltas()}
            type="button"
            onClick={mostrarCardPrimerContacto}
          >
            Altas
          </button>
        </div>
        <div>
          <button
            className={activadoNoCierra()}
            type="button"
            onClick={mostrarCardReuniones}
          >
            Reunion
          </button>
        </div>
      </div>
      <section>
        {mostrarCartaAlta && (
          <div>
            <article className="carta-prospecto-historial">
              <div className="text-center py-4">
                <h6 className="lato-bold fs-18"> Altas</h6>
              </div>

              <div className="mt-2">
                <article
                  className="d-flex justify-content-between container"
                  onMouseEnter={handleMouseEnter}
                  onMouseLeave={handleMouseLeave}
                  onClick={() => setModalShow(true)}
                >
                  <div className="d-flex">
                    <div>
                      <div
                        className={
                          isHovered
                            ? "border-izquierda-datos-verde active me-3"
                            : "border-izquierda-datos-verde desactive me-3"
                        }
                      ></div>
                    </div>
                    <div>
                      <div>
                        <h6 className="fs-18 lato-bold">
                          Ana Manzana <br />
                          <span className="fs-14 text-black-50">
                            Dio de alta: 13/12/2023
                          </span>
                        </h6>
                        <h6 className="fs-14 lato-bold">
                          Conseguí el número del administrador del local, el
                          local cuenta con 3 sucursales.
                        </h6>
                      </div>
                    </div>
                  </div>
                  <div>
                    <div className="icon-container">
                      <FontAwesomeIcon
                        icon={faMessage}
                        style={{ color: "#b4c400" }}
                      />
                      <span className="notification-badge">3</span>
                    </div>
                  </div>
                </article>
                {/* boton #2 */}
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
                            ? "border-izquierda-datos-verde active me-3"
                            : "border-izquierda-datos-verde desactive me-3"
                        }
                      ></div>
                    </div>
                    <div>
                      <div>
                        <h6 className="fs-18 lato-bold">
                          La Bandeña <br />
                          <span className="fs-14 text-black-50">
                            Dio de alta: 14/12/2023
                          </span>
                        </h6>
                        <h6 className="fs-14 lato-bold">
                          Cuando salga al campo voy a ir a concordar una
                          reunión.
                        </h6>
                      </div>
                    </div>
                  </div>
                  <div>
                    <div className="icon-container">
                      <FontAwesomeIcon
                        icon={faMessage}
                        style={{ color: "#b4c400" }}
                      />
                      <span className="notification-badge">5</span>
                    </div>
                  </div>
                </article>

                {/* boton #3 */}
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
                            ? "border-izquierda-datos-verde active me-3"
                            : "border-izquierda-datos-verde desactive me-3"
                        }
                      ></div>
                    </div>
                    <div>
                      <div>
                        <h6 className="fs-18 lato-bold">
                          Ana Manzana <br />
                          <span className="fs-14 text-black-50">
                            Dio de alta: 13/12/2023
                          </span>
                        </h6>
                        <h6 className="fs-14 lato-bold">
                          Prospecto tener la primera reunión el Miércoles.
                        </h6>
                      </div>
                    </div>
                  </div>
                  <div>
                    <div className="icon-container">
                      <FontAwesomeIcon
                        icon={faMessage}
                        style={{ color: "#b4c400" }}
                      />
                      <span className="notification-badge">4</span>
                    </div>
                  </div>
                </article>
                {/* boton #4 */}
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
                            ? "border-izquierda-datos-verde active me-3"
                            : "border-izquierda-datos-verde desactive me-3"
                        }
                      ></div>
                    </div>
                    <div>
                      <div>
                        <h6 className="fs-18 lato-bold">
                          La Bandeña <br />
                          <span className="fs-14 text-black-50">
                            Dio de alta: 14/12/2023
                          </span>
                        </h6>
                        <h6 className="fs-14 lato-bold">
                          Cuando salga al campo voy a ir a concordar una
                          reunión.
                        </h6>
                      </div>
                    </div>
                  </div>
                  <div>
                    <div className="icon-container">
                      <FontAwesomeIcon
                        icon={faMessage}
                        style={{ color: "#b4c400" }}
                      />
                      <span className="notification-badge">3</span>
                    </div>
                  </div>
                </article>

                <MiDetalleAltaProspectoHistorial
                  show={modalShow}
                  onHide={() => setModalShow(false)}
                />
              </div>
            </article>
          </div>
        )}
      </section>
      <section>
        {mostrarCartaNoCierra && (
          <div>
            <section className="carta-prospecto-historial">
              <div className="text-center py-4">
                <h6 className="color-rojo lato-bold fs-18"> No cierra</h6>
              </div>

              <article
                className="d-flex justify-content-between container"
                onMouseEnter={handleMouseEnter}
                onMouseLeave={handleMouseLeave}
                onClick={() => setModalShow2(true)}
              >
                <div className="d-flex">
                  <div>
                    <div
                      className={
                        isHovered
                          ? "border-izquierda-datos-rojo active me-3"
                          : "border-izquierda-datos-rojo desactive me-3"
                      }
                    ></div>
                  </div>
                  <div>
                    <div>
                      <h6 className="fs-18 lato-bold">
                        Comercio 1<br />
                        <span className="fs-14 color-rojo">
                          Razón: Comercio no siguió
                        </span>
                      </h6>
                      <h6 className="fs-14 lato-bold">
                        Conseguí el número del administrador del local
                      </h6>
                    </div>
                  </div>
                </div>
                <div>
                  <div className="icon-container">
                    <FontAwesomeIcon
                      icon={faMessage}
                      style={{ color: "#E24444" }}
                    />
                    <span className="notification-badge">0</span>
                  </div>
                </div>
              </article>

              {/* boton #2 */}
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
                          ? "border-izquierda-datos-rojo active me-3"
                          : "border-izquierda-datos-rojo desactive me-3"
                      }
                    ></div>
                  </div>
                  <div>
                    <div>
                      <h6 className="fs-18 lato-bold">
                        Comercio 2<br />
                        <span className="fs-14 color-rojo">
                          Razón: Ya tiene Posnet/Clover
                        </span>
                      </h6>
                    </div>
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
              </article>
              {/* boton #3 */}
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
                          ? "border-izquierda-datos-rojo active me-3"
                          : "border-izquierda-datos-rojo desactive me-3"
                      }
                    ></div>
                  </div>
                  <div>
                    <div>
                      <h6 className="fs-18 lato-bold">
                        Comercio 3<br />
                        <span className="fs-14 color-rojo">Razón: Otro</span>
                      </h6>
                      <h6 className="fs-14 lato-bold">
                        Comercio decidió no contratar el servicio.
                      </h6>
                    </div>
                  </div>
                </div>
                <div>
                  <div className="icon-container">
                    <FontAwesomeIcon
                      icon={faMessage}
                      style={{ color: "#E24444" }}
                    />
                    <span className="notification-badge">4</span>
                  </div>
                </div>
              </article>

              {/* boton #4 */}
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
                          ? "border-izquierda-datos-rojo active me-3"
                          : "border-izquierda-datos-rojo desactive me-3"
                      }
                    ></div>
                  </div>
                  <div>
                    <div>
                      <h6 className="fs-18 lato-bold">
                        Comercio 1<br />
                        <span className="fs-14 color-rojo">
                          Razón: Ya tiene Posnet/Clover
                        </span>
                      </h6>
                    </div>
                  </div>
                </div>
                <div>
                  <div className="icon-container">
                    <FontAwesomeIcon
                      icon={faMessage}
                      style={{ color: "#E24444" }}
                    />
                    <span className="notification-badge">0</span>
                  </div>
                </div>
              </article>
              {/* boton #5 */}
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
                          ? "border-izquierda-datos-rojo active me-3"
                          : "border-izquierda-datos-rojo desactive me-3"
                      }
                    ></div>
                  </div>
                  <div>
                    <div>
                      <h6 className="fs-18 lato-bold">
                        Comercio 3<br />
                        <span className="fs-14 color-rojo">
                          Razón: Comercio no siguió
                        </span>
                      </h6>
                      <h6 className="fs-14 lato-bold">
                        Comercio decidió no contratar el servicio.
                      </h6>
                    </div>
                  </div>
                </div>
                <div>
                  <div className="icon-container">
                    <FontAwesomeIcon
                      icon={faMessage}
                      style={{ color: "#E24444" }}
                    />
                    <span className="notification-badge">3</span>
                  </div>
                </div>
              </article>

              <MiDetalleNoCierraProspectoHistorial
                show={modalShow2}
                onHide={() => setModalShow2(false)}
              />
            </section>
          </div>
        )}
      </section>
    </section>
  );
};

export default ProspectoCartaHistorialMobile;
