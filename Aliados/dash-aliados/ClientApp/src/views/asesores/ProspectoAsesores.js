import React, { useContext, useEffect } from "react";
import { useState } from "react";
import Button from "react-bootstrap/Button";
import { faCirclePlus, faClockRotateLeft, faMessage } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
// Import Swiper React components
import { Swiper, SwiperSlide } from "swiper/react";

// Import Swiper styles
import "swiper/css";
import "swiper/css/pagination";
import MiDetalleProspectoPC from "../../components/asesoresComp/MiDetalleProspectoPc";
import MiDetalleProspectoR from "../../components/asesoresComp/MiDetalleProspectoR";
import MiDetalleProspectoNoCierra from "../../components/asesoresComp/MiDetalleProspectoNoCierra";
import BienvenidoPanelAsesores from "../../components/asesoresComp/BienvenidoPanelAsesores";
import BienvenidoPanelAsesoresCelular from "../../components/asesoresComp/BienvenidoPanelAsesoresCelular";

import Swal from "sweetalert2";
import logo from "../../assets/img/logo.png";

import { NavLink, useNavigate } from "react-router-dom";
import TituloPagina from "../../components/TituloPagina";
import Footer from "../../components/Footer";
import MiModalNuevoProspecto from "../../components/asesoresComp/MiModalNuevoProspecto";
import { DarkModeContext } from "../../context/DarkModeContext";
import ProspectoCarta from "../../components/asesoresComp/ProspectoCarta";
import MiModalProspectoEditar from "../../components/asesoresComp/MiModalProspectoEditar";

const ProspectoAsesores = () => {
  const { darkMode } = useContext(DarkModeContext);
  const [modalShow, setModalShow] = useState(false);

  const [rol, setRol] = useState(1);

  const [isHovered, setIsHovered] = useState(false);
  const handleMouseEnter = () => {
    setIsHovered(true);
  };
  const handleMouseLeave = () => {
    setIsHovered(false);
  };

  const [modalShow2, setModalShow2] = useState(false);
  const [modalShow3, setModalShow3] = useState(false);

  const [texto, setTexto] = useState(
    "Por favor, tené en cuenta que este comercio no c...."
  );
  const limiteCaracteres = 40;

  useEffect(() => {
    // Verifica si el texto es más largo que el límite
    if (texto.length > limiteCaracteres) {
      // Recorta el texto y establece el estado
      setTexto(texto.substring(0, limiteCaracteres) + "...");
    }
  }, [texto]);

  const [mostrarPrimerContacto, setMostrarPrimerContacto] = useState(true);
  const [mostrarReunion, setMostrarReunion] = useState(false);
  const [mostrarNoCierra, setMostrarNoCierra] = useState(false);

  const mostrarCardPrimerContacto = () => {
    setMostrarPrimerContacto(true);
    setMostrarReunion(false);
    setMostrarNoCierra(false);
    activadoBtnPrimerContacto();
  };

  const mostrarCardReuniones = () => {
    setMostrarPrimerContacto(false);
    setMostrarReunion(true);
    setMostrarNoCierra(false);
    activadoBtnReunion();
  };

  const mostrarCardNoCierra = () => {
    setMostrarPrimerContacto(false);
    setMostrarReunion(false);
    setMostrarNoCierra(true);
    activadoBtnNoCierra();
  };

  const [activePrimerContacto, setActivePrimerContacto] = useState(false);
  const [activeReunion, setActiveReunion] = useState(false);
  const [activeNoCierra, setActiveNoCierra] = useState(false);

  const activadoBtnPrimerContacto = () => {
    setActivePrimerContacto(true);
    setActiveReunion(false);
    setActiveNoCierra(false);
  };

  const activadoContacto = () => {
    if (activePrimerContacto && darkMode) {
      return " d-flex btn-primer-contacto-mobile-active centrado";
    } else if (activePrimerContacto) {
      return " btn-primer-contacto-mobile-active lato-bold fs-16 centrado";
    } else if (darkMode) {
      return "d-flex btn-primer-contacto-mobilecentrado";
    } else {
      return "btn-primer-contacto-mobile border-0 lato-bold fs-16 centrado";
    }
  };

  const activadoBtnReunion = () => {
    setActivePrimerContacto(false);
    setActiveReunion(true);
    setActiveNoCierra(false);
  };

  const activadoReunion = () => {
    if (activeReunion && darkMode) {
      return " d-flex btn-reunion-mobile-dark centrado";
    } else if (activeReunion) {
      return " btn-reunion-mobile-active lato-bold fs-16 centrado";
    } else if (darkMode) {
      return "d-flex btn-reunion-mobile centrado";
    } else {
      return " btn-reunion-mobile border-0 lato-bold fs-16 centrado";
    }
  };

  const activadoBtnNoCierra = () => {
    setActivePrimerContacto(false);
    setActiveReunion(false);
    setActiveNoCierra(true);
  };

  const activadoNoCierra = () => {
    if (activeNoCierra && darkMode) {
      return " d-flex btn-no-cierra-mobile-active centrado";
    } else if (activeNoCierra) {
      return " btn-no-cierra-mobile-active lato-bold fs-16 centrado";
    } else if (darkMode) {
      return "d-flex btn-no-cierra-mobile centrado";
    } else {
      return " btn-no-cierra-mobile border-0 lato-bold fs-16 centrado";
    }
  };

  const [datosInicio, setDatosInicio] = useState(null);
  const navegacion = useNavigate();

  const apiUrlToken = process.env.REACT_APP_API_TOKEN;
  const apiUrlDatos = "/api/datosinicioasesores/inicioasesores"; // La URL del endpoint para obtener los datos después de verificar el token

  useEffect(() => {
    const verificarTokenYObtenerDatos = async () => {
      const token = sessionStorage.getItem("token");

      if (!token) {
        manejarRespuestaNoAutorizada();
        return;
      }

      try {
        // Primero, verificar el token
        const respuestaToken = await fetch(apiUrlToken, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ Token: token }),
        });

        if (!respuestaToken.ok) {
          if (respuestaToken.status === 401) {
            manejarRespuestaNoAutorizada();
          } else {
            throw new Error("Error verificando el token");
          }
          return; // Salir si la verificación del token falló
        }

        const dataToken = await respuestaToken.json();
        if (dataToken !== 1) {
          manejarAccesoDenegado();
          return; // Salir si el token no es válido
        }

        // Luego, obtener los datos después de la verificación exitosa del token
        const respuestaDatos = await fetch(apiUrlDatos, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ Token: token }),
        });

        if (respuestaDatos.ok) {
          const data = await respuestaDatos.json();
          setDatosInicio(data); // Asignar los datos obtenidos al estado
        } else {
          if (respuestaDatos.status === 401) {
            manejarRespuestaNoAutorizada();
          } else {
            throw new Error("Error obteniendo los datos");
          }
        }
      } catch (error) {
        console.error("Error en la cadena de solicitudes:", error);
      }
    };

    const manejarRespuestaNoAutorizada = () => {
      sessionStorage.removeItem("token");
      Swal.fire({
        title: "Sesión expirada o token inválido.",
        text: "Inicie sesión nuevamente.",
        imageUrl: logo,
        imageWidth: 100,
        imageHeight: 30,
        imageAlt: "Logo",
        confirmButtonText: "Ok",
        timer: 5000,
        allowOutsideClick: true,
        customClass: {
          container: darkMode
            ? "swal2-container--dark"
            : "swal2-container--light",
          confirmButton: "my-swal-button",
        },
      }).then(() => {
        navegacion("/");
        window.location.reload();
      });
    };

    const manejarAccesoDenegado = () => {
      Swal.fire({
        title: "Acceso denegado.",
        text: "No tiene permisos para acceder.",
        imageUrl: logo,
        imageWidth: 100,
        imageHeight: 30,
        imageAlt: "Logo",
        confirmButtonText: "Ok",
        timer: 5000,
        allowOutsideClick: true,
        customClass: {
          container: darkMode
            ? "swal2-container--dark"
            : "swal2-container--light",
          confirmButton: "my-swal-button",
        },
      }).then(() => {
        navegacion("/");
        window.location.reload();
      });
    };

    verificarTokenYObtenerDatos();
  }, []);

  return (
    <div className="d-flex flex-column min-vh-100">
      <div className="py-4 d-md-block d-none">
        <BienvenidoPanelAsesores datos={datosInicio} />
      </div>
      <div className="py-4 d-block d-md-none">
        <BienvenidoPanelAsesoresCelular datos={datosInicio} />
      </div>
      <div>
        <TituloPagina title="Prospecto" />
      </div>
      <section>
      <>
          <div className="d-none d-lg-block">
            <article className="d-flex justify-content-between container">
              <div className="mt-4">
                <div className="d-flex">
                  <Button
                    className="btn-nuevo-prospecto border-0 lato-bold fs-16"
                    onClick={() => setModalShow2(true)}
                  >
                    <FontAwesomeIcon className="me-2" icon={faCirclePlus} />{" "}
                    Nuevo prospecto
                  </Button>
                  <MiModalProspectoEditar
                    show={modalShow2}
                    onHide={() => setModalShow2(false)}
                  />
                  <div className="">
                    <NavLink
                      end
                      to="/asesores/prospecto/historial"
                      className=" border-0 text-decoration-none d-flex color-negro"
                    >
                      <FontAwesomeIcon
                        className="ms-4 mt-1"
                        icon={faClockRotateLeft}
                        style={{ color: "#B3B5BF", fontSize: "36px" }}
                      />
                    </NavLink>
                  </div>
                </div>
              </div>
           
            </article>
            <div>
              <ProspectoCarta />
            </div>
          </div>
        </>
      </section>
      <section className="d-block d-lg-none">
        <div className="container">
          <article className="d-flex justify-content-between">
            <NavLink
              end
              to="/asesores/prospecto/historial"
              className=" border-0 text-decoration-none d-flex color-negro"
            >
              <FontAwesomeIcon
                className=" mt-1"
                icon={faClockRotateLeft}
                style={{ color: "#B3B5BF", fontSize: "36px" }}
              />
            </NavLink>
            <Button
              className="btn-nuevo-prospecto border-0 lato-bold fs-16"
              onClick={() => setModalShow2(true)}
            >
              <FontAwesomeIcon className="me-2" icon={faCirclePlus} /> Nuevo
              prospecto
            </Button>
            <MiModalNuevoProspecto
              show={modalShow2}
              onHide={() => setModalShow2(false)}
            />
          </article>
          <section>
            <Swiper
              slidesPerView={2.5}
              spaceBetween={20}
              className="mySwiper my-4"
            >
              <SwiperSlide>
                <div>
                  <button
                    className={activadoContacto()}
                    type="button"
                    onClick={mostrarCardPrimerContacto}
                  >
                    1er Contacto
                  </button>
                </div>
              </SwiperSlide>
              <SwiperSlide>
                <div>
                  <button
                    className={activadoReunion()}
                    type="button"
                    onClick={mostrarCardReuniones}
                  >
                    Reunion
                  </button>
                </div>
              </SwiperSlide>
              <SwiperSlide>
                <div>
                  <button
                    className={activadoNoCierra()}
                    type="button"
                    onClick={mostrarCardNoCierra}
                  >
                    No cierra
                  </button>
                </div>
              </SwiperSlide>
            </Swiper>
          </section>
          {mostrarPrimerContacto && (
            <div>
              <section className="my-4">
                <article className="carta-prospecto ">
                  <div className="text-center py-4">
                    <h6 className="lato-bold fs-18"> 1er contacto</h6>
                  </div>
                  <div>
                    <article
                      className=" my-3"
                      onMouseEnter={handleMouseEnter}
                      onMouseLeave={handleMouseLeave}
                      onClick={() => setModalShow(true)}
                    >
                      <div className="d-flex justify-content-between px-3">
                        <article className="d-flex">
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
                                  Prospecto tener la primera reunión el
                                  Miércoles.
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
                        </article>
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
                  {/* Carta #2 */}
                  <div>
                    <article
                      className=" my-3"
                      onMouseEnter={handleMouseEnter}
                      onMouseLeave={handleMouseLeave}
                      onClick={() => setModalShow(true)}
                    >
                      <div className="d-flex justify-content-between px-3">
                        <article className="d-flex">
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
                                  Prospecto tener la primera reunión el
                                  Miércoles.
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
                        </article>
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
              </section>
            </div>
          )}
          {mostrarReunion && (
            <div>
              <section className="my-4">
                <article className="carta-prospecto ">
                  <div className="text-center py-4">
                    <h6 className="lato-bold fs-18"> Reunion</h6>
                  </div>
                  <div>
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
              </section>
            </div>
          )}
          {mostrarNoCierra && (
            <div>
              <section className="my-4">
                <article className="carta-prospecto ">
                  <div className="text-center py-4">
                    <h6 className="lato-bold fs-18"> No Cierra</h6>
                  </div>
                  <div>
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

                    <MiDetalleProspectoNoCierra
                      show={modalShow3}
                      onHide={() => setModalShow3(false)}
                    />
                  </div>
                </article>
              </section>
            </div>
          )}
        </div>
      </section>
      <div className="py-4 mt-auto">
        <Footer />
      </div>
    </div>
  );
};

export default ProspectoAsesores;
