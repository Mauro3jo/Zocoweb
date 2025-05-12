// import hoja de estilo (css)
import "./SidebarReact.css";

// import hooks
import React, { useContext, useState, useEffect } from "react";

// import context
import { DarkModeContext } from "../context/DarkModeContext";

// import librerias<FontAwesomeIcon icon={faTableCellsRowUnlock} /> <FontAwesomeIcon icon={faTableCells} />
import {
  faRectangleList,
    faNewspaper,
    faTableCells,
    faClipboardCheck,
  faBell,
  faCalculator,
  faCertificate,
  faChartSimple,
  faCheck,
  faCheckToSlot,
  faCircle,
  faCommentDots,
  faFileArrowDown,
  faFileInvoiceDollar,
  faGear,
  faGraduationCap,
  faHouse,
  faList,
  faListCheck,
  faMagnifyingGlass,
  faMagnifyingGlassChart,
  faMoon,
  faReceipt,
  faRightFromBracket,
  faStar,
  faSun,
  faUser,
} from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { NavLink } from "react-router-dom";
import { faWhatsapp } from "@fortawesome/free-brands-svg-icons";
import Swal from "sweetalert2";
import { Button, OverlayTrigger, Popover } from "react-bootstrap";
import { Badge } from "react-bootstrap";

// import assets
import qrCodigo from "../assets/img/qrcodigo.png";
import logo from "../assets/img/logo.png";
import logoClaro from "../assets/img/logo-modo-oscuro.png";

// import componentes
import ModalConfiguraciones from "./ModalConfiguraciones";
import NotificacionIndicador from "./NotificacionIndicador";

const SidebarReact = () => {
  // estado para controlar la visibilidad del contenido del icono del campana
  const [visible1, setVisible1] = useState(false);

  // estado para controlar la visibilidad del contenido del icono del tuerca
  // para el cambio de contraseña
  const [visible2, setVisible2] = useState(false);

  // api url
  const apiUrlNotificaciones = process.env.REACT_APP_API_NOTIFICACIONES;
  const apiUrlLogout = process.env.REACT_APP_API_LOGOUT;

  // estado para guardar las notificaciones que consulto desde el back
  const [notificaciones, setNotificaciones] = useState([]);

  // estado para guardar las notificaciones que consulto desde el back
  const [notificacionesAliados, setNotificacionesAliados] = useState([]);
  const [notificacionesAsesores, setNotificacionesAsesores] = useState([]);

  // consulta para guardar las notificaciones
  // y filtro para los aliados y asesores
    useEffect(() => {
        const fetchNoticias = async () => {
            try {
                const response = await fetch(apiUrlNotificaciones);

                // Verificar que la respuesta sea "ok"
                if (!response.ok) {
                }

                const data = await response.json();

                // Verificar que data no esté vacío
                if (!data || data.length === 0) {
                    return;
                }

                // Filtrar notificaciones por tipo de usuario
                const noticiasAliados = data.filter(
                    (notificacion) => notificacion.tipoUsuario.trim() === "Aliado"
                );
                const noticiasAsesores = data.filter(
                    (notificacion) => notificacion.tipoUsuario.trim() === "Asesor"
                );

                // Actualizar estados con notificaciones filtradas
                setNotificacionesAliados(noticiasAliados);
                setNotificacionesAsesores(noticiasAsesores);
            } catch (error) {
            }
        };

        fetchNoticias();
    }, [apiUrlNotificaciones]); 

  const cerrarSesion = () => {
    const token = sessionStorage.getItem("token");
    if (!token) {
      console.error("No hay token en el almacenamiento de la sesión");
      return;
    }
  
    // Eliminar el token del sessionStorage
    sessionStorage.removeItem("token");
  
    // Redireccionar al usuario, por ejemplo a la página de inicio de sesión
    window.location.href = "/";
  };

  // boton para abrir y ocultar el modal de notificaciones
  const verModalNotificacion = () => {
    setVisible1(!visible1);
    setVisible2(false);
  };

  // boton para abrir y ocultar el modal de cerrar sesion
  const verModalCerrarSesion = () => {
    setVisible2(!visible2);
    setVisible1(false);
  };

  // estados para el css de los botones del sidebar
  const [activeInicio, setActiveInicio] = useState(false);
  const [activeContabilidad, setActiveContabilidad] = useState(false);
  const [activeAnalisis, setActiveAnalisis] = useState(false);
  const [activeTicket, setActiveTicket] = useState(false);
  const [activeCalculadora, setActiveCalculadora] = useState(false);
  const [activeCalificar, setActiveCalificar] = useState(false);

  // funcion para activar el btn de inicio
  const ocultarModalesInicio = () => {
    setActiveInicio(true);
    setActiveContabilidad(false);
    setActiveAnalisis(false);
    setActiveTicket(false);
    setActiveCalculadora(false);
    setActiveCalificar(false);
  };

  // funcion para activar el btn de contabilidad
  const ocultarModalesContabilidad = () => {
    setVisible2(false);
    setVisible1(false);
    setActiveInicio(false);
    setActiveContabilidad(true);
    setActiveAnalisis(false);
    setActiveTicket(false);
    setActiveCalculadora(false);
    setActiveCalificar(false);
  };

  // funcion para activar el btn de analisis
  const ocultarModalesAnalisis = () => {
    setVisible2(false);
    setVisible1(false);
    setActiveInicio(false);
    setActiveContabilidad(false);
    setActiveAnalisis(true);
    setActiveTicket(false);
    setActiveCalculadora(false);
    setActiveCalificar(false);
  };

  // funcion para activar el btn de cupones
  const ocultarModalesTickets = () => {
    setVisible2(false);
    setVisible1(false);
    setActiveInicio(false);
    setActiveContabilidad(false);
    setActiveAnalisis(false);
    setActiveTicket(true);
    setActiveCalculadora(false);
    setActiveCalificar(false);
  };

  // funcion para el btn en calculadora
  const ocultarModalesCalculadora = () => {
    setVisible2(false);
    setVisible1(false);
    setActiveInicio(false);
    setActiveContabilidad(false);
    setActiveAnalisis(false);
    setActiveTicket(false);
    setActiveCalculadora(true);
    setActiveCalificar(false);
  };

  // funcion para activar el boton de calificar
  const ocultarModalesCalificar = () => {
    setVisible2(false);
    setVisible1(false);
    setActiveInicio(false);
    setActiveContabilidad(false);
    setActiveAnalisis(false);
    setActiveTicket(false);
    setActiveCalculadora(false);
    setActiveCalificar(true);
  };

  // funcion para ocultar los modales
  const ocultarModales = () => {
    setVisible2(false);
    setVisible1(false);
    setActiveInicio(false);
    setActiveContabilidad(false);
    setActiveAnalisis(false);
    setActiveTicket(false);
    setActiveCalculadora(false);
    setActiveCalificar(false);
  };

  // darkMode context funcionalidad para el modo claro/oscuro
  const { darkMode } = useContext(DarkModeContext);

  //switch claro/oscuro
  const { toggleDarkMode } = useContext(DarkModeContext);

  // funcion para el claro/oscuro
  const handleClick = () => {
    toggleDarkMode();
  };

  // funcionalidad para el css de los btn del sidebar
  // activado con condiciones.
  // activeInicio y darkMode si esta activado y en modo oscuro.
  // activeInicio si esta activado.
  // darkMode si esta activado solo el darkMode (claro/oscuro).
    // en el else esta el css base del boton.
    // cada dia mas putita explotada
  /// mas bien trolita
  const activado = () => {
    if (activeInicio && darkMode) {
      return " d-flex btn-grid-active-dark centrado";
    } else if (activeInicio) {
      return " d-flex btn-grid-active centrado";
    } else if (darkMode) {
      return "d-flex btn-grid-dark centrado";
    } else {
      return " d-flex btn-grid centrado";
    }
  };

  const activadoContabilidad = () => {
    if (activeContabilidad && darkMode) {
      return " d-flex btn-grid-active-dark centrado";
    } else if (activeContabilidad) {
      return " d-flex btn-grid-active centrado";
    } else if (darkMode) {
      return "d-flex btn-grid-dark centrado";
    } else {
      return " d-flex btn-grid centrado";
    }
  };

  const activadoAnalisis = () => {
    if (activeAnalisis && darkMode) {
      return " d-flex btn-grid-active-dark centrado";
    } else if (activeAnalisis) {
      return " d-flex btn-grid-active centrado";
    } else if (darkMode) {
      return "d-flex btn-grid-dark centrado";
    } else {
      return " d-flex btn-grid centrado";
    }
  };

  const activadoTickets = () => {
    if (activeTicket && darkMode) {
      return " d-flex btn-grid-active-dark centrado";
    } else if (activeTicket) {
      return " d-flex btn-grid-active centrado";
    } else if (darkMode) {
      return "d-flex btn-grid-dark centrado";
    } else {
      return " d-flex btn-grid centrado";
    }
  };

  const activadoCalculadora = () => {
    if (activeCalculadora && darkMode) {
      return " d-flex btn-grid-active-dark centrado";
    } else if (activeCalculadora) {
      return " d-flex btn-grid-active centrado";
    } else if (darkMode) {
      return "d-flex btn-grid-dark centrado";
    } else {
      return " d-flex btn-grid centrado";
    }
  };

  const activadoCalificar = () => {
    if (activeCalificar && darkMode) {
      return " d-flex btn-grid-active-dark centrado";
    } else if (activeCalificar) {
      return " d-flex btn-grid-active centrado";
    } else if (darkMode) {
      return "d-flex btn-grid-dark centrado";
    } else {
      return " d-flex btn-grid centrado";
    }
  };
  

  const activadoIconoCampana = () => {
    if (visible1 && darkMode) {
      return " iconos-modales cursor-point text-white mx-3";
    } else if (visible1) {
      return " iconos-modales cursor-point text-dark mx-3";
    } else if (darkMode) {
      return "iconos-modales cursor-point  mx-3 color-verde";
    } else {
      return "iconos-modales cursor-point  mx-3 color-verde";
    }
  };

  const activadoIconoUser = () => {
    if (visible2 && darkMode) {
      return " iconos-modales cursor-point text-white mx-3";
    } else if (visible2) {
      return " iconos-modales cursor-point text-dark mx-3";
    } else if (darkMode) {
      return "iconos-modales cursor-point  mx-3 color-verde";
    } else {
      return "iconos-modales cursor-point  mx-3 color-verde";
    }
  };

  const getActiveClass = (isActive, darkMode) => {
    if (isActive) {
      return darkMode
        ? "btn-grid-active-dark centrado"
        : "btn-grid-active centrado";
    } else {
      return darkMode ? "btn-grid-dark centrado" : "btn-grid centrado";
    }
  };

  const [modalShowCompleta, setModalShowCompleta] = React.useState(false);
  const [hayNotificacionesNoVistas, setHayNotificacionesNoVistas] =
    useState(true);
  const [usuarioRol, setUsuarioRol] = useState();
  const apiUrlToken = process.env.REACT_APP_API_TOKEN;

  useEffect(() => {
    const verificarToken = async () => {
      const token = sessionStorage.getItem("token");

      try {
        const response = await fetch(apiUrlToken, {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ Token: token }),
        });

        if (!response.ok) {
          throw new Error("Error en la respuesta del servidor");
        }

        const datosRecibido = await response.json();
        setUsuarioRol(datosRecibido);
        // Aquí puedes hacer algo con el rol
        // Por ejemplo, guardarlo en el estado o realizar alguna lógica basada en el rol
      } catch (error) {
        console.error("Error al validar el token", error);
      }
    };

    verificarToken();
  }, [usuarioRol]);

  useEffect(() => {
    if (darkMode) {
      document.body.classList.add("dark-mode");
    } else {
      document.body.classList.remove("dark-mode");
    }
  }, [darkMode]);

  const confirmarCerrarSesion = () => {
    Swal.fire({
      title: "¿Estás seguro?",
      imageUrl: logo,
      imageWidth: 100,
      imageHeight: 30,
      imageAlt: "Logo",
      showCancelButton: true,

      confirmButtonText: "Sí",
      cancelButtonText: "No",
      customClass: {
        container: darkMode
          ? "swal2-container--dark"
          : "swal2-container--light",
        confirmButton: "my-swal-button",
        cancelButtonColor: "my-swal-button2",
      },
    }).then((result) => {
      if (result.isConfirmed) {
        cerrarSesion();
      }
    });
  };

  const menusPorRol = {
     // Aliados menu
    0: (
      <>
        <div className="centrado my-2">
          <NavLink
            end
            to="/aliados/inicio"
            className=" border-0"
            onClick={ocultarModalesInicio}
          >
            <div style={{ width: "160px" }}>
              <div className={activado()}>
                <div className="icono">
                  <FontAwesomeIcon icon={faHouse} />
                </div>
                <div className="texto">
                  <span className="lato-bold fs-14"> Inicio</span>
                </div>
              </div>
            </div>
          </NavLink>
        </div>
        <div className="centrado my-2">
          <NavLink
            end
            to="/aliados/contabilidad"
            className=" border-0"
            onClick={ocultarModalesContabilidad}
          >
            <div style={{ width: "160px" }}>
              <div className={activadoContabilidad()}>
                <div className="icono">
                  <FontAwesomeIcon icon={faFileInvoiceDollar} />
                </div>
                <div className="texto custom-badge-container">
                  <span className="lato-bold fs-14"> Contabilidad</span>
                  <Badge className="custom-badge" bg="danger">
                    Nuevo
                  </Badge>
                </div>
              </div>
            </div>
          </NavLink>
        </div>

        <div className="centrado my-2">
          <NavLink
            end
            to="/aliados/analisis"
            className=" border-0"
            onClick={ocultarModalesAnalisis}
          >
            <div style={{ width: "160px" }}>
              <div className={activadoAnalisis()}>
                <div className="icono">
                  <FontAwesomeIcon icon={faMagnifyingGlassChart} />
                </div>
                <div className="texto custom-badge-container">
                  <span className="lato-bold fs-14">Analisis</span>
                </div>
              </div>
            </div>
          </NavLink>
        </div>

        <div className="centrado my-2">
          <NavLink
            end
            to="/aliados/cupones"
            className=" border-0"
            onClick={ocultarModalesTickets}
          >
            <div style={{ width: "160px" }}>
              <div className={activadoTickets()}>
                <div className="icono">
                  <FontAwesomeIcon icon={faReceipt} />
                </div>
                <div className="texto">
                  <span className="lato-bold fs-14">Cupones</span>
                </div>
              </div>
            </div>
          </NavLink>
        </div>

        <div className="centrado my-2">
          <NavLink
            end
            to="/aliados/calificar"
            className=" border-0"
            onClick={ocultarModalesCalificar}
          >
            <div style={{ width: "160px" }}>
              <div className={activadoCalificar()}>
                <div className="icono">
                  <FontAwesomeIcon icon={faStar} />
                </div>
                <div className="texto">
                  <span className="lato-bold fs-14">Calificar</span>
                </div>
              </div>
            </div>
          </NavLink>
        </div>

        <div className="centrado my-2">
          <NavLink
            end
            to="/aliados/consultas"
            className=" border-0"
            onClick={ocultarModalesCalificar}
          >
            <div style={{ width: "160px" }}>
              <div className={activadoCalificar()}>
                <div className="icono">
                  <FontAwesomeIcon icon={faCheckToSlot} />
                </div>
                <div className="texto">
                  <span className="lato-bold fs-14">Consultas</span>
                </div>
              </div>
            </div>
          </NavLink>
        </div>
        <div className="centrado my-2">
          <NavLink
            end
            to="/aliados/calculadora"
            className=" border-0"
            onClick={ocultarModalesCalificar}
          >
            <div style={{ width: "160px" }}>
              <div className={activadoAnalisis()}>
                <div className="icono">
                  <FontAwesomeIcon icon={faMagnifyingGlassChart} />
                </div>
                <div className="texto custom-badge-container">
                  <span className="lato-bold fs-14">Simulador</span>
                  <Badge className="custom-badge" bg="danger">
                    Nuevo
                  </Badge>
                </div>
              </div>
            </div>
          </NavLink>
        </div>
        <div
          className={
            visible1 === true || visible2 === true
              ? " text-center"
              : " text-center"
          }
        >
          <div className="centrado my-2" onClick={ocultarModales}></div>
          <div className="centrado my-2" onClick={ocultarModales}>
            <a
              href="https://wa.link/w4quzx"
              target="_blank"
              rel="noreferrer"
              className=" border-0 "
              style={{ width: "160px" }}
            >
              <div
                className={
                  darkMode ? " d-flex btn-grid-dark " : " d-flex btn-grid "
                }
              >
                <div className="icono">
                  <FontAwesomeIcon icon={faWhatsapp} />
                </div>
                <div className="texto">
                  <span className="lato-bold fs-14">Postventa</span>
                </div>
              </div>
            </a>
          </div>

          <img
            className="img-fluid img-qr pb-1"
            src={darkMode ? qrCodigo : qrCodigo}
            alt="codigo qr"
          />
          <div
            className={
              visible1 === true || visible2 === true
                ? "   text-center"
                : " text-center"
            }
          >
            <div className="centrado my-2">
              <button
                onClick={confirmarCerrarSesion}
                style={{ width: "160px" }}
                className={
                  darkMode
                    ? "d-flex  border-0 btn-grid-menu-dark centrado"
                    : "d-flex  border-0 btn-grid-menu centrado"
                }
              >
                <div className="icono">
                  <FontAwesomeIcon icon={faRightFromBracket} />
                </div>
                <div className="texto">
                  <span className="lato-bold fs-14">Salir</span>
                </div>
              </button>
            </div>
          </div>
        </div>
      </>
    ),
      // Asesores menu
    //
    1: (
      <>
        <div className="centrado my-2">
          <NavLink
            end
            to="/asesores/check"
            className=" border-0 text-decoration-none"
            onClick={ocultarModalesContabilidad}
          >
            <div style={{ width: "160px" }}>
              <div className={activadoCalificar()}>
                <div className="icono">
                  <FontAwesomeIcon icon={faCheck} />
                </div>
                <div className="texto">
                  <span className="lato-bold fs-14">Check</span>
                </div>
              </div>
            </div>
          </NavLink>
        </div>
        <div className="centrado my-2">
          <NavLink
            end
            to="/asesores/simulador"
            className=" border-0 text-decoration-none"
            onClick={ocultarModalesContabilidad}
          >
            <div style={{ width: "160px" }}>
              <div className={activadoCalificar()}>
                <div className="icono">
                  <FontAwesomeIcon icon={faChartSimple} />
                </div>
                <div className="texto">
                  <span className="lato-bold fs-14">Comparador</span>
                </div>
              </div>
            </div>
          </NavLink>
        </div>
        <div className="centrado my-2">
          <NavLink
            end
            to="/asesores/chat"
            className=" border-0 text-decoration-none"
            onClick={ocultarModalesContabilidad}
          >
            <div style={{ width: "160px" }}>
              <div className={activadoCalificar()}>
                <div className="icono">
                  <FontAwesomeIcon icon={faCommentDots} />
                </div>
                <div className="texto">
                  <span className="lato-bold fs-14">Chat</span>
                </div>
              </div>
            </div>
          </NavLink>
        </div>
        <div className="centrado my-2">
          <NavLink
            end
            to="/asesores/descargas"
            className=" border-0 text-decoration-none"
            onClick={ocultarModalesContabilidad}
          >
            <div style={{ width: "160px" }}>
              <div className={activadoCalificar()}>
                <div className="icono">
                  <FontAwesomeIcon icon={faFileArrowDown} />
                </div>
                <div className="texto">
                  <span className="lato-bold fs-14">Descargas</span>
                </div>
              </div>
            </div>
          </NavLink>
        </div>
        <div className="centrado my-2">
          <NavLink
            end
            to="/asesores/academy"
            className=" border-0 text-decoration-none"
            onClick={ocultarModalesContabilidad}
          >
            <div style={{ width: "160px" }}>
              <div className={activadoCalificar()}>
                <div className="icono">
                  <FontAwesomeIcon icon={faGraduationCap} />
                </div>
                <div className="texto">
                  <span className="lato-bold fs-14">Academy</span>
                </div>
              </div>
            </div>
          </NavLink>
        </div>

        <div className="centrado my-2">
          <NavLink
            end
            to="/asesores/criterios"
            className=" border-0 text-decoration-none"
            onClick={ocultarModalesContabilidad}
          >
            <div style={{ width: "160px" }}>
              <div className={activadoCalificar()}>
                <div className="icono">
                  <FontAwesomeIcon icon={faCertificate} />
                </div>
                <div className="texto">
                  <span className="lato-bold fs-14">Criterios</span>
                </div>
              </div>
            </div>
          </NavLink>
        </div>
        <div className="centrado my-2">
          <NavLink
            end
            to="/asesores/calculadora"
            className=" border-0 text-decoration-none"
            onClick={ocultarModalesContabilidad}
          >
            <div style={{ width: "160px" }}>
              <div className={activadoCalificar()}>
                <div className="icono">
                  <FontAwesomeIcon icon={faCalculator} />
                </div>
                <div className="texto custom-badge-container">
                  <span className="lato-bold fs-14">Simulador</span>
                  <Badge className="custom-badge" bg="danger">
                    Nuevo
                  </Badge>
                </div>
              </div>
            </div>
          </NavLink>
        </div>
        <div className="centrado my-2">
          <button
            onClick={confirmarCerrarSesion}
            style={{ width: "160px" }}
            className={
              darkMode
                ? "d-flex  border-0 btn-grid-menu-dark centrado"
                : "d-flex  border-0 btn-grid-menu centrado"
            }
          >
            <div className="icono">
              <FontAwesomeIcon icon={faRightFromBracket} />
            </div>
            <div className="texto">
              <span className="lato-bold fs-14">Salir</span>
            </div>
          </button>
        </div>
      </>
    ),
    // Liquidaciones menu
    2: (
      <>
        <div className="centrado my-2">
          <NavLink
            end
            to="/liquidaciones"
            className=" border-0 text-decoration-none"
            onClick={ocultarModalesContabilidad}
          >
            <div style={{ width: "160px" }}>
              <div className={activadoCalificar()}>
                <div className="icono">
                  <FontAwesomeIcon icon={faMagnifyingGlassChart} />
                </div>
                <div className="texto">
                  <span className="lato-bold fs-14">Blanqueo</span>
                </div>
              </div>
            </div>
          </NavLink>
        </div>
        <div className="centrado my-2">
          <NavLink
            end
            to="/liquidaciones/Buscador/Cupones"
            className=" border-0 text-decoration-none"
            onClick={ocultarModalesContabilidad}
          >
            <div style={{ width: "160px" }}>
              <div className={activadoCalificar()}>
                <div className="icono">
                  <FontAwesomeIcon icon={faMagnifyingGlassChart} />
                </div>
                <div className="texto">
                  <span className="lato-bold fs-14">Cupones</span>
                </div>
              </div>
            </div>
          </NavLink>
        </div>
        <div className="centrado my-2">
          <NavLink
            end
            to="/liquidaciones/ordenes/pago"
            className=" border-0 text-decoration-none"
            onClick={ocultarModalesContabilidad}
          >
            <div style={{ width: "160px" }}>
              <div className={activadoCalificar()}>
                <div className="icono">
                  <FontAwesomeIcon icon={faMagnifyingGlassChart} />
                </div>
                <div className="texto">
                  <span className="lato-bold fs-14">Orden de pago</span>
                </div>
              </div>
            </div>
          </NavLink>
        </div>

        <div className="centrado my-2">
          <NavLink
            end
            to="/liquidaciones/peticiones"
            className=" border-0 text-decoration-none"
            onClick={ocultarModalesContabilidad}
          >
            <div style={{ width: "160px" }}>
              <div className={activadoCalificar()}>
                <div className="icono">
                  <FontAwesomeIcon icon={faListCheck} />
                </div>
                <div className="texto">
                  <span className="lato-bold fs-14">Peticiones</span>
                </div>
              </div>
            </div>
          </NavLink>
        </div>
        <div className="centrado my-2">
          <NavLink
            end
            to="/liquidaciones/facturante"
            className=" border-0 text-decoration-none"
            onClick={ocultarModalesContabilidad}
          >
            <div style={{ width: "160px" }}>
              <div className={activadoCalificar()}>
                <div className="icono">
                  <FontAwesomeIcon icon={faMagnifyingGlassChart} />
                </div>
                <div className="texto">
                  <span className="lato-bold fs-14">Factura</span>
                </div>
              </div>
            </div>
          </NavLink>
        </div>
        <div className="centrado my-2">
          <NavLink
            end
            to="/liquidaciones/afip"
            className=" border-0 text-decoration-none"
            onClick={ocultarModalesContabilidad}
          >
            <div style={{ width: "160px" }}>
              <div className={activadoCalificar()}>
                <div className="icono">
                  <FontAwesomeIcon icon={faMagnifyingGlassChart} />
                </div>
                <div className="texto">
                  <span className="lato-bold fs-14">IVA-Ganancia</span>
                </div>
              </div>
            </div>
          </NavLink>
        </div>
        <div className="centrado my-2">
          <NavLink
            end
            to="/liquidaciones/iibb"
            className=" border-0 text-decoration-none"
            onClick={ocultarModalesContabilidad}
          >
            <div style={{ width: "160px" }}>
              <div className={activadoCalificar()}>
                <div className="icono">
                  <FontAwesomeIcon icon={faMagnifyingGlassChart} />
                </div>
                <div className="texto">
                  <span className="lato-bold fs-14">IIBB</span>
                </div>
              </div>
            </div>
          </NavLink>
        </div>
        <div className="centrado my-2">
          <button
            onClick={confirmarCerrarSesion}
            style={{ width: "160px" }}
            className={
              darkMode
                ? "d-flex  border-0 btn-grid-menu-dark centrado"
                : "d-flex  border-0 btn-grid-menu centrado"
            }
          >
            <div className="icono">
              <FontAwesomeIcon icon={faRightFromBracket} />
            </div>
            <div className="texto">
              <span className="lato-bold fs-14">Salir</span>
            </div>
          </button>
        </div>
      </>
      ), // menu administrador/auditor  /Calidad/Historial
      3: (
          <>
              <div className="centrado my-2">
                  <NavLink
                      end
                      to="/Calidad/Admin"
                      className=" border-0 text-decoration-none"
                      onClick={ocultarModalesContabilidad}
                  >
                      <div style={{ width: "160px" }}>
                          <div className={activadoCalificar()}>
                              <div className="icono">
                                  <FontAwesomeIcon icon={faCertificate} />
                              </div>
                              <div className="texto">
                                  <span className="lato-bold fs-14">Check</span>
                              </div>
                          </div>
                      </div>
                  </NavLink>
              </div>

           
              <div className="centrado my-2">
                  <NavLink
                      end
                      to="/Calidad/AdminPeticiones"
                      className=" border-0"
                      onClick={ocultarModalesContabilidad}
                  >
                      <div style={{ width: "160px" }}>
                          <div className={activadoContabilidad()}>
                              <div className="icono">
                                  <FontAwesomeIcon icon={faListCheck} />
                              </div>
                              <div className="texto">
                                  <span className="lato-bold fs-14"> Peticiones</span>
                              </div>
                          </div>
                      </div>
                  </NavLink>
              </div>
              <div className="centrado my-2">
                  <NavLink
                      end
                      to="/Calidad/PanelInterno"
                      className=" border-0"
                      onClick={ocultarModalesContabilidad}
                  >
                      <div style={{ width: "160px" }}>
                          <div className={activadoContabilidad()}>
                              <div className="icono">
                                  <FontAwesomeIcon icon={faNewspaper} />
                              </div>
                              <div className="texto">
                                  <span className="lato-bold fs-14"> Panel  Gestores</span>
                              </div>
                          </div>
                      </div>
                  </NavLink>
              </div>
              <div className="centrado my-2">
                  <NavLink
                      end
                      to="/Calidad/PanelControlInterno"
                      className=" border-0"
                      onClick={ocultarModalesContabilidad}
                  >
                      <div style={{ width: "160px" }}>
                          <div className={activadoContabilidad()}>
                              <div className="icono">
                                  <FontAwesomeIcon icon={faNewspaper} />
                              </div>
                              <div className="texto">
                                  <span className="lato-bold fs-14"> Panel  Interno</span>
                              </div>
                          </div>
                      </div>
                  </NavLink>
              </div>
              <div className="centrado my-2">
                  <NavLink
                      end
                      to="/Calidad/Historial"
                      className=" border-0"
                      onClick={ocultarModalesContabilidad}
                  >
                      <div style={{ width: "160px" }}>
                          <div className={activadoContabilidad()}>
                              <div className="icono">
                                  <FontAwesomeIcon icon={faTableCells} />
                              </div>
                              <div className="texto">
                                  <span className="lato-bold fs-14"> Historial CRM</span>
                              </div>
                          </div>
                      </div>
                  </NavLink>
              </div>
              {/* <div className="centrado my-2">
                  <NavLink
                      end
                      to="/Calidad/Admin"
                      className=" border-0 text-decoration-none"
                      onClick={ocultarModalesContabilidad}
                  >
                      <div style={{ width: "160px" }}>
                          <div className={activadoCalificar()}>
                              <div className="icono">
                                  <FontAwesomeIcon icon={faCertificate} />
                              </div>
                              <div className="texto">
                                  <span className="lato-bold fs-14">Check</span>
                              </div>
                          </div>
                      </div>
                  </NavLink>
              </div> */}
              <div className="centrado my-2">
                <NavLink
                    end
                    to="/Calidad/AdminCRM"
                    className=" border-0"
                    onClick={ocultarModalesContabilidad}
                >
                    <div style={{ width: "160px" }}>
                        <div className={activadoContabilidad()}>
                            <div className="icono">
                                <FontAwesomeIcon icon={faTableCells} />
                            </div>
                            <div className="texto">
                                <span className="lato-bold fs-14"> CRM</span>
                            </div>
                        </div>
                    </div>
                </NavLink>
            </div>
              <div className="centrado my-2">
                  <NavLink
                      end
                      to="/Calidad/AdminLegajos"
                      className=" border-0"
                      onClick={ocultarModalesContabilidad}
                  >
                      <div style={{ width: "160px" }}>
                          <div className={activadoContabilidad()}>
                              <div className="icono">
                                  <FontAwesomeIcon icon={faNewspaper} />
                              </div>
                              <div className="texto">
                                  <span className="lato-bold fs-14"> Legajos</span>
                              </div>
                          </div>
                      </div>
                  </NavLink>
              </div>
              <div className="centrado my-2">
                  <NavLink
                      end
                      to="/Calidad/AdminNroComercio"
                      className=" border-0"
                      onClick={ocultarModalesContabilidad}
                  >
                      <div style={{ width: "160px" }}>
                          <div className={activadoContabilidad()}>
                              <div className="icono">
                                  <FontAwesomeIcon icon={faRectangleList} />
                              </div>
                              <div className="texto">
                                  <span className="lato-bold fs-14"> Numero Comercio</span>
                              </div>
                          </div>
                      </div>
                  </NavLink>
              </div>
              <div className="centrado my-2">
                  <NavLink
                      end
                      to="/Calidad/Auditorias"
                      className=" border-0"
                      onClick={ocultarModalesContabilidad}
                  >
                      <div style={{ width: "160px" }}>
                          <div className={activadoContabilidad()}>
                              <div className="icono">
                                  <FontAwesomeIcon icon={faRectangleList} />
                              </div>
                              <div className="texto">
                                  <span className="lato-bold fs-14"> Panel Auditorias</span>
                              </div>
                          </div>
                      </div>
                  </NavLink>
              </div>
              <div className="centrado my-2">
                  <button
                      onClick={confirmarCerrarSesion}
                      style={{ width: "160px" }}
                      className={
                          darkMode
                              ? "d-flex  border-0 btn-grid-menu-dark centrado"
                              : "d-flex  border-0 btn-grid-menu centrado"
                      }
                  >
                      <div className="icono">
                          <FontAwesomeIcon icon={faRightFromBracket} />
                      </div>
                      <div className="texto">
                          <span className="lato-bold fs-14">Salir</span>
                      </div>
                  </button>
              </div>
          </>
      ),
      // reclutador menu
    // toda una pagina para la trola esta y se va la muy conchuda
    4: (
      <>
        <div className="centrado my-2">
          <NavLink
            end
            to="/reclutamiento/busqueda"
            className=" border-0 text-decoration-none"
            onClick={ocultarModalesContabilidad}
          >
            <div style={{ width: "160px" }}>
              <div className={activadoCalificar()}>
                <div className="icono">
                  <FontAwesomeIcon icon={faMagnifyingGlass} />
                </div>
                <div className="texto">
                  <span className="lato-bold fs-14">Busqueda</span>
                </div>
              </div>
            </div>
          </NavLink>
        </div>
        <div className="centrado my-2">
          <NavLink
            end
            to="/reclutamiento/contratados"
            className=" border-0 text-decoration-none"
            onClick={ocultarModalesContabilidad}
          >
            <div style={{ width: "160px" }}>
              <div className={activadoCalificar()}>
                <div className="icono">
                  <FontAwesomeIcon icon={faCheckToSlot} />
                </div>
                <div className="texto">
                  <span className="lato-bold fs-14">Contratados</span>
                </div>
              </div>
            </div>
          </NavLink>
        </div>
        <div className="centrado my-2">
          <NavLink
            end
            to="/reclutamiento/puestos"
            className=" border-0 text-decoration-none"
            onClick={ocultarModalesContabilidad}
          >
            <div style={{ width: "160px" }}>
              <div className={activadoCalificar()}>
                <div className="icono">
                  <FontAwesomeIcon icon={faList} />
                </div>
                <div className="texto">
                  <span className="lato-bold fs-14">Puestos</span>
                </div>
              </div>
            </div>
          </NavLink>
        </div>
        <div className="centrado my-2">
          <button
            onClick={confirmarCerrarSesion}
            style={{ width: "160px" }}
            className={
              darkMode
                ? "d-flex  border-0 btn-grid-menu-dark centrado"
                : "d-flex  border-0 btn-grid-menu centrado"
            }
          >
            <div className="icono">
              <FontAwesomeIcon icon={faRightFromBracket} />
            </div>
            <div className="texto">
              <span className="lato-bold fs-14">Salir</span>
            </div>
          </button>
        </div>
      </>
      ),  // Menu Pelao
      // Menu para el Pelao
      5: (
          <>
          <div className="centrado my-2">
                  <NavLink
                      end
                      to="/Admin"
                      className=" border-0 text-decoration-none"
                      onClick={ocultarModalesContabilidad}
                  >
                      <div style={{ width: "160px" }}>
                          <div className={activadoCalificar()}>
                              <div className="icono">
                                  <FontAwesomeIcon icon={faMagnifyingGlass} />
                              </div>
                              <div className="texto">
                                  <span className="lato-bold fs-14">Inicio</span>
                              </div>
                          </div>
                      </div>
                  </NavLink>
              </div>

              <div className="centrado my-2">
                  <NavLink
                      end
                      to="/Admin/ReporteMensual"
                      className=" border-0 text-decoration-none"
                      onClick={ocultarModalesContabilidad}
                  >
                      <div style={{ width: "160px" }}>
                          <div className={activadoCalificar()}>
                              <div className="icono">
                                  <FontAwesomeIcon icon={faMagnifyingGlass} />
                              </div>
                              <div className="texto">
                                  <span className="lato-bold fs-14">Reporte Mensual</span>
                              </div>
                          </div>
                      </div>
                  </NavLink>
              </div>
              <div className="centrado my-2">
                  <NavLink
                      end
                      to="/Admin/Fidelizacion"
                      className=" border-0 text-decoration-none"
                      onClick={ocultarModalesContabilidad}
                  >
                      <div style={{ width: "160px" }}>
                          <div className={activadoCalificar()}>
                              <div className="icono">
                                  <FontAwesomeIcon icon={faMagnifyingGlass} />
                              </div>
                              <div className="texto">
                                  <span className="lato-bold fs-14">Fidelizacion</span>
                              </div>
                          </div>
                      </div>
                  </NavLink>
              </div>
              <div className="centrado my-2">
                  <NavLink
                      end
                      to="/Admin/datosestadisticos"
                      className=" border-0 text-decoration-none"
                      onClick={ocultarModalesContabilidad}
                  >
                      <div style={{ width: "160px" }}>
                          <div className={activadoCalificar()}>
                              <div className="icono">
                              <FontAwesomeIcon icon={faChartSimple} /> 
                              </div>
                              <div className="texto">
                                  <span className="lato-bold fs-14">Estadisticas</span>
                              </div>
                          </div>
                      </div>
                  </NavLink>
              </div>
              <div className="centrado my-2">
                  <NavLink
                      end
                      to="/admin/reportesemanal"
                      className=" border-0 text-decoration-none"
                      onClick={ocultarModalesContabilidad}
                  >
                      <div style={{ width: "160px" }}>
                          <div className={activadoCalificar()}>
                              <div className="icono">
                                  <FontAwesomeIcon icon={faTableCells} />
                              </div>
                              <div className="texto">
                                  <span className="lato-bold fs-14">Altas y Bajas</span>
                              </div>
                          </div>
                      </div>
                  </NavLink>
              </div>
              <div className="centrado my-2">
                  <button
                      onClick={confirmarCerrarSesion}
                      style={{ width: "160px" }}
                      className={
                          darkMode
                              ? "d-flex  border-0 btn-grid-menu-dark centrado"
                              : "d-flex  border-0 btn-grid-menu centrado"
                      }
                  >
                      <div className="icono">
                          <FontAwesomeIcon icon={faRightFromBracket} />
                      </div>
                      <div className="texto">
                          <span className="lato-bold fs-14">Salir</span>
                      </div>
                  </button>
              </div>
            
          </>
      ),
    // gestor menu
    6: (
      <>
        <div className="centrado my-2">
          <NavLink
            end
            to="/gestor/check"
            className=" border-0 text-decoration-none"
            onClick={ocultarModalesContabilidad}
          >
            <div style={{ width: "160px" }}>
              <div className={activadoCalificar()}>
                <div className="icono">
                  <FontAwesomeIcon icon={faMagnifyingGlass} />
                </div>
                <div className="texto">
                  <span className="lato-bold fs-14">Check</span>
                </div>
              </div>
            </div>
          </NavLink>
        </div>
        <div className="centrado my-2">
          <NavLink
            end
            to="/gestor/academy"
            className=" border-0 text-decoration-none"
            onClick={ocultarModalesContabilidad}
          >
            <div style={{ width: "160px" }}>
              <div className={activadoCalificar()}>
                <div className="icono">
                  <FontAwesomeIcon icon={faGraduationCap} />
                </div>
                <div className="texto">
                  <span className="lato-bold fs-14">Academy</span>
                </div>
              </div>
            </div>
          </NavLink>
        </div>
        <div className="centrado my-2">
          <NavLink
            end
            to="/gestor/peticiones"
            className=" border-0 text-decoration-none"
            onClick={ocultarModalesContabilidad}
          >
            <div style={{ width: "160px" }}>
              <div className={activadoCalificar()}>
                <div className="icono">
                  <FontAwesomeIcon icon={faListCheck} />
                </div>
                <div className="texto">
                  <span className="lato-bold fs-14">Peticiones</span>
                </div>
              </div>
            </div>
          </NavLink>
        </div>
        {/* <div className="centrado my-2">
          <NavLink
            end
            to="/gestor/formularios"
            className=" border-0 text-decoration-none"
            onClick={ocultarModalesContabilidad}
          >
            <div style={{ width: "160px" }}>
              <div className={activadoCalificar()}>
                <div className="icono">
                  <FontAwesomeIcon icon={faListCheck} />
                </div>
                <div className="texto">
                  <span className="lato-bold fs-14">Formularios</span>
                </div>
              </div>
            </div>
          </NavLink>
        </div> */}
        <div className="centrado my-2">
          <NavLink
            end
            to="/gestor/simulador"
            className=" border-0 text-decoration-none"
            onClick={ocultarModalesContabilidad}
          >
            <div style={{ width: "160px" }}>
              <div className={activadoCalificar()}>
                <div className="icono">
                  <FontAwesomeIcon icon={faChartSimple} />
                </div>
                <div className="texto">
                  <span className="lato-bold fs-14">Comparador</span>
                </div>
              </div>
            </div>
          </NavLink>
        </div>
        <div className="centrado my-2">
          <NavLink
            end
            to="/gestor/calculadora"
            className=" border-0 text-decoration-none"
            onClick={ocultarModalesContabilidad}
          >
            <div style={{ width: "160px" }}>
              <div className={activadoCalificar()}>
                <div className="icono">
                  <FontAwesomeIcon icon={faCalculator} />
                </div>
                <div className="texto custom-badge-container">
                  <span className="lato-bold fs-14">Simulador</span>
                  <Badge className="custom-badge" bg="danger">
                    Nuevo
                  </Badge>
                </div>
              </div>
            </div>
          </NavLink>
        </div>
        <div className="centrado my-2">
          <NavLink
            end
            to="/gestor/descargas"
            className=" border-0 text-decoration-none"
            onClick={ocultarModalesContabilidad}
          >
            <div style={{ width: "160px" }}>
              <div className={activadoCalificar()}>
                <div className="icono">
                  <FontAwesomeIcon icon={faFileArrowDown} />
                </div>
                <div className="texto">
                  <span className="lato-bold fs-14">Descargas</span>
                </div>
              </div>
            </div>
          </NavLink>
        </div>
        <div className="centrado my-2">
          <button
            onClick={confirmarCerrarSesion}
            style={{ width: "160px" }}
            className={
              darkMode
                ? "d-flex  border-0 btn-grid-menu-dark centrado"
                : "d-flex  border-0 btn-grid-menu centrado"
            }
          >
            <div className="icono">
              <FontAwesomeIcon icon={faRightFromBracket} />
            </div>
            <div className="texto">
              <span className="lato-bold fs-14">Salir</span>
            </div>
          </button>
        </div>
      </>
      ), 7: (
          <>
              <div className="centrado my-2">
                  <NavLink
                      end
                    to="/ZocoConect/Inicio"
                      className=" border-0 text-decoration-none"
                      onClick={ocultarModalesContabilidad}
                  >
                      <div style={{ width: "160px" }}>
                          <div className={activadoCalificar()}>
                              <div className="icono">
                                  <FontAwesomeIcon icon={faMagnifyingGlass} />
                              </div>
                              <div className="texto">
                                  <span className="lato-bold fs-14">Inicio</span>
                              </div>
                          </div>
                      </div>
                  </NavLink>
            </div>  <div className="centrado my-2">
                <NavLink
                    end
                    to="/ZocoConect/RegistroAliado"
                    className=" border-0 text-decoration-none"
                    onClick={ocultarModalesContabilidad}
                >
                    <div style={{ width: "160px" }}>
                        <div className={activadoCalificar()}>
                            <div className="icono">
                                <FontAwesomeIcon icon={faMagnifyingGlass} />
                            </div>
                            <div className="texto">
                                <span className="lato-bold fs-14">Registrarse Zoco Conect</span>
                            </div>
                        </div>
                    </div>
                </NavLink>
            </div>  <div className="centrado my-2">
                <NavLink
                    end
                    to="/ZocoConect/Registro"
                    className=" border-0 text-decoration-none"
                    onClick={ocultarModalesContabilidad}
                >
                    <div style={{ width: "160px" }}>
                        <div className={activadoCalificar()}>
                            <div className="icono">
                                <FontAwesomeIcon icon={faMagnifyingGlass} />
                            </div>
                            <div className="texto">
                                <span className="lato-bold fs-14">Registrar Aliado Zoco Conect</span>
                            </div>
                        </div>
                    </div>
                </NavLink>
            </div>  <div className="centrado my-2">
                <NavLink
                    end
                    to="/ZocoConect/AgregarReferidos"
                    className=" border-0 text-decoration-none"
                    onClick={ocultarModalesContabilidad}
                >
                    <div style={{ width: "160px" }}>
                        <div className={activadoCalificar()}>
                            <div className="icono">
                                <FontAwesomeIcon icon={faMagnifyingGlass} />
                            </div>
                            <div className="texto">
                                <span className="lato-bold fs-14">Agregar Referido</span>
                            </div>
                        </div>
                    </div>
                </NavLink>
            </div>
            <div className="centrado my-2">
                <NavLink
                    end
                    to="/ZocoConect/ListaUsuariosZocoConect"
                    className=" border-0 text-decoration-none"
                    onClick={ocultarModalesContabilidad}
                >
                    <div style={{ width: "160px" }}>
                        <div className={activadoCalificar()}>
                            <div className="icono">
                                <FontAwesomeIcon icon={faMagnifyingGlass} />
                            </div>
                            <div className="texto">
                                <span className="lato-bold fs-14">Lista Usuarios</span>
                            </div>
                        </div>
                    </div>
                </NavLink>
            </div>
              <div className="centrado my-2">
                  <button
                      onClick={confirmarCerrarSesion}
                      style={{ width: "160px" }}
                      className={
                          darkMode
                              ? "d-flex  border-0 btn-grid-menu-dark centrado"
                              : "d-flex  border-0 btn-grid-menu centrado"
                      }
                  >
                      <div className="icono">
                          <FontAwesomeIcon icon={faRightFromBracket} />
                      </div>
                      <div className="texto">
                          <span className="lato-bold fs-14">Salir</span>
                      </div>
                  </button>
              </div>
          </>
      ),
    // menu administrador/auditor
    8: (
      <>
        <div className="centrado my-2">
          <NavLink
            end
            to="/administracion"
            className=" border-0 text-decoration-none"
            onClick={ocultarModalesContabilidad}
          >
            <div style={{ width: "160px" }}>
              <div className={activadoCalificar()}>
                <div className="icono">
                  <FontAwesomeIcon icon={faCertificate} />
                </div>
                <div className="texto">
                  <span className="lato-bold fs-14">Check</span>
                </div>
              </div>
            </div>
          </NavLink>
        </div>

            {/*<div className="centrado my-2">
          <NavLink
            end
            to="/administracion/chat"
            className=" border-0 text-decoration-none"
            onClick={ocultarModalesContabilidad}
          >
            <div style={{ width: "160px" }}>
              <div className={activadoCalificar()}>
                <div className="icono">
                  <FontAwesomeIcon icon={faCommentDots} />
                </div>
                <div className="texto">
                  <span className="lato-bold fs-14">Chat</span>
                </div>
              </div>
            </div>
          </NavLink>
        </div>
        <div className="centrado my-2">
          <NavLink
            end
            to="/administracion/notificaciones"
            className=" border-0 text-decoration-none"
            onClick={ocultarModalesContabilidad}
          >
            <div style={{ width: "160px" }}>
              <div className={activadoCalificar()}>
                <div className="icono">
                  <FontAwesomeIcon icon={faCertificate} />
                </div>
                <div className="texto">
                  <span className="lato-bold fs-14">Notificaciones</span>
                </div>
              </div>
            </div>
          </NavLink>
        </div>
        <div className="centrado my-2">
          <NavLink
            end
            to="/administracion/calificaciones"
            className=" border-0 text-decoration-none"
            onClick={ocultarModalesContabilidad}
          >
            <div style={{ width: "160px" }}>
              <div className={activadoCalificar()}>
                <div className="icono">
                  <FontAwesomeIcon icon={faStar} />
                </div>
                <div className="texto">
                  <span className="lato-bold fs-14">Calificaciones</span>
                </div>
              </div>
            </div>
          </NavLink>
        </div>*/}
        <div className="centrado my-2">
          <NavLink
            end
            to="/administracion/blanqueos"
            className=" border-0"
            onClick={ocultarModalesContabilidad}
          >
            <div style={{ width: "160px" }}>
              <div className={activadoContabilidad()}>
                <div className="icono">
                  <FontAwesomeIcon icon={faFileInvoiceDollar} />
                </div>
                <div className="texto">
                  <span className="lato-bold fs-14"> Blanqueos</span>
                </div>
              </div>
            </div>
          </NavLink>
        </div>
            {/*    <div className="centrado my-2">
          <NavLink
            end
            to="/administracion/blanqueos/empleados"
            className=" border-0"
            onClick={ocultarModalesContabilidad}
          >
            <div style={{ width: "160px" }}>
              <div className={activadoContabilidad()}>
                <div className="icono">
                  <FontAwesomeIcon icon={faFileInvoiceDollar} />
                </div>
                <div className="texto">
                  <span className="lato-bold fs-14"> Empleados</span>
                </div>
              </div>
            </div>
          </NavLink>
        </div>*/}
        <div className="centrado my-2">
          <NavLink
            end
            to="/administracion/peticiones"
            className=" border-0"
            onClick={ocultarModalesContabilidad}
          >
            <div style={{ width: "160px" }}>
              <div className={activadoContabilidad()}>
                <div className="icono">
                  <FontAwesomeIcon icon={faListCheck} />
                </div>
                <div className="texto">
                  <span className="lato-bold fs-14"> Peticiones</span>
                </div>
              </div>
            </div>
          </NavLink>
            </div>
            {/*   <div className="centrado my-2">
                   <NavLink
                    end
                    to="/administracion/formularios"
                    className=" border-0"
                    onClick={ocultarModalesContabilidad}
                >
                    <div style={{ width: "160px" }}>
                        <div className={activadoContabilidad()}>
                            <div className="icono">
                                <FontAwesomeIcon icon={faClipboardCheck} />
                            </div>
                            <div className="texto">
                                <span className="lato-bold fs-14"> Formularios</span>
                            </div>
                        </div>
                    </div>
                </NavLink>
            </div>*/}
            <div className="centrado my-2">
                <NavLink
                    end
                    to="/administracion/crm"
                    className=" border-0"
                    onClick={ocultarModalesContabilidad}
                >
                    <div style={{ width: "160px" }}>
                        <div className={activadoContabilidad()}>
                            <div className="icono">
                                <FontAwesomeIcon icon={faTableCells} />
                            </div>
                            <div className="texto">
                                <span className="lato-bold fs-14"> CRM</span>
                            </div>
                        </div>
                    </div>
                </NavLink>
            </div>
            <div className="centrado my-2">
                <NavLink
                    end
                    to="/administracion/legajos"
                    className=" border-0"
                    onClick={ocultarModalesContabilidad}
                >
                    <div style={{ width: "160px" }}>
                        <div className={activadoContabilidad()}>
                            <div className="icono">
                                <FontAwesomeIcon icon={faNewspaper} />
                            </div>
                            <div className="texto">
                                <span className="lato-bold fs-14"> Legajos</span>
                            </div>
                        </div>
                    </div>
                </NavLink>
            </div>
            <div className="centrado my-2">
                <NavLink
                    end
                    to="/admin/listaordenpago"
                    className=" border-0"
                    onClick={ocultarModalesContabilidad}
                >
                    <div style={{ width: "160px" }}>
                        <div className={activadoContabilidad()}>
                            <div className="icono">
                                <FontAwesomeIcon icon={faMagnifyingGlassChart} />
                            </div>
                            <div className="texto">
                                <span className="lato-bold fs-14"> Ordenes de Pago</span>
                            </div>
                        </div>
                    </div>
                </NavLink>
            </div>
            <div className="centrado my-2">
                <NavLink
                    end
                    to="/administracion/nrocomercio"
                    className=" border-0"
                    onClick={ocultarModalesContabilidad}
                >
                    <div style={{ width: "160px" }}>
                        <div className={activadoContabilidad()}>
                            <div className="icono">
                                <FontAwesomeIcon icon={faRectangleList} />
                            </div>
                            <div className="texto">
                                <span className="lato-bold fs-14"> Numero Comercio</span>
                            </div>
                        </div>
                    </div>
                </NavLink>
            </div>
        <div className="centrado my-2">
          <NavLink
            end
                    to="/administracion/AdminCupones"
            className=" border-0 text-decoration-none"
            onClick={ocultarModalesContabilidad}
          >
            <div style={{ width: "160px" }}>
              <div className={activadoCalificar()}>
                <div className="icono">
                  <FontAwesomeIcon icon={faMagnifyingGlassChart} />
                </div>
                <div className="texto">
                  <span className="lato-bold fs-14">Cupones</span>
                </div>
              </div>
            </div>
          </NavLink>
            </div>
            <div className="centrado my-2">
                <NavLink
                    end
                    to="/administracion/AdminPanelInterno"
                    className=" border-0 text-decoration-none"
                    onClick={ocultarModalesContabilidad}
                >
                    <div style={{ width: "160px" }}>
                        <div className={activadoCalificar()}>
                            <div className="icono">
                                <FontAwesomeIcon icon={faMagnifyingGlassChart} />
                            </div>
                            <div className="texto">
                                <span className="lato-bold fs-14">Panel Interno</span>
                            </div>
                        </div>
                    </div>
                </NavLink>
            </div>     <div className="centrado my-2">
                <NavLink
                    end
                    to="/administracion/AdminResumenAliado "
                    className=" border-0 text-decoration-none"
                    onClick={ocultarModalesContabilidad}
                >
                    <div style={{ width: "160px" }}>
                        <div className={activadoCalificar()}>
                            <div className="icono">
                                <FontAwesomeIcon icon={faMagnifyingGlassChart} />
                            </div>
                            <div className="texto">
                                <span className="lato-bold fs-14">Resumen Aliado</span>
                            </div>
                        </div>
                    </div>
                </NavLink>
            </div>  <div className="centrado my-2">
                <NavLink
                    end
                    to="/administracion/Fidelizacion"
                    className=" border-0 text-decoration-none"
                    onClick={ocultarModalesContabilidad}
                >
                    <div style={{ width: "160px" }}>
                        <div className={activadoCalificar()}>
                            <div className="icono">
                                <FontAwesomeIcon icon={faMagnifyingGlass} />
                            </div>
                            <div className="texto">
                                <span className="lato-bold fs-14">Fidelizacion</span>
                            </div>
                        </div>
                    </div>
                </NavLink>
            </div>
            <div className="centrado my-2">
                <NavLink
                    end
                    to="/administracion/AdminSimulador"
                    className=" border-0 text-decoration-none"
                    onClick={ocultarModalesContabilidad}
                >
                    <div style={{ width: "160px" }}>
                        <div className={activadoCalificar()}>
                            <div className="icono">
                                <FontAwesomeIcon icon={faChartSimple} />
                            </div>
                            <div className="texto">
                                <span className="lato-bold fs-14">Comparador</span>
                            </div>
                        </div>
                    </div>
                </NavLink>
            </div>
            <div className="centrado my-2">
                <NavLink
                    end
                    to="/administracion/AdminComparador"
                    className=" border-0 text-decoration-none"
                    onClick={ocultarModalesContabilidad}
                >
                    <div style={{ width: "160px" }}>
                        <div className={activadoCalificar()}>
                            <div className="icono">
                                <FontAwesomeIcon icon={faCalculator} />
                            </div>
                            <div className="texto custom-badge-container">
                                <span className="lato-bold fs-14">Simulador</span>
                                {/* <Badge className="custom-badge" bg="danger">
                                    Nuevo
                                </Badge> */}
                            </div>
                        </div>
                    </div>
                </NavLink>
            </div>
            <div className="centrado my-2">
                <NavLink
                    end
                    to="/admin/simuladorliquidacion"
                    className=" border-0 text-decoration-none"
                    onClick={ocultarModalesContabilidad}
                >
                    <div style={{ width: "160px" }}>
                        <div className={activadoCalificar()}>
                            <div className="icono">
                                <FontAwesomeIcon icon={faCalculator} />
                            </div>
                            <div className="texto custom-badge-container">
                                <span className="lato-bold fs-14">Simulador de Ordenes</span>
                                 <Badge className="custom-badge" bg="danger">
                                    Nuevo
                                </Badge> 
                            </div>
                        </div>
                    </div>
                </NavLink>
            </div>
        <div className="centrado my-2">
          <button
            onClick={confirmarCerrarSesion}
            style={{ width: "160px" }}
            className={
              darkMode
                ? "d-flex  border-0 btn-grid-menu-dark centrado"
                : "d-flex  border-0 btn-grid-menu centrado"
            }
          >
            <div className="icono">
              <FontAwesomeIcon icon={faRightFromBracket} />
            </div>
            <div className="texto">
              <span className="lato-bold fs-14">Salir</span>
            </div>
          </button>
            </div>

      </>
    ),
      // Usuario Empleado   faRectangleList
    11: (
      <>
        <div className="centrado my-2">
          <NavLink
            end
            to="/cajero/inicio"
            className=" border-0"
            onClick={ocultarModalesInicio}
          >
            <div style={{ width: "160px" }}>
              <div className={activado()}>
                <div className="icono">
                  <FontAwesomeIcon icon={faHouse} />
                </div>
                <div className="texto">
                  <span className="lato-bold fs-14"> Inicio</span>
                </div>
              </div>
            </div>
          </NavLink>
        </div>

        <div className="centrado my-2">
          <NavLink
            end
            to="/cajero/consultas"
            className=" border-0"
            onClick={ocultarModalesInicio}
          >
            <div style={{ width: "160px" }}>
              <div className={activado()}>
                <div className="icono">
                <FontAwesomeIcon icon={faCheckToSlot} />
                </div>
                <div className="texto">
                  <span className="lato-bold fs-14"> Consultas</span>
                </div>
              </div>
            </div>
          </NavLink>
            </div>

        <div
          className={
            visible1 === true || visible2 === true
              ? " text-center"
              : " text-center"
          }
        >
          <div className="centrado my-2" onClick={ocultarModales}></div>
          <div className="centrado my-2" onClick={ocultarModales}>
            <a
              href="https://wa.link/w4quzx"
              target="_blank"
              rel="noreferrer"
              className=" border-0 "
              style={{ width: "160px" }}
            >
              <div
                className={
                  darkMode ? " d-flex btn-grid-dark " : " d-flex btn-grid "
                }
              >
                <div className="icono">
                  <FontAwesomeIcon icon={faWhatsapp} />
                </div>
                <div className="texto">
                  <span className="lato-bold fs-14">Postventa</span>
                </div>
              </div>
            </a>
          </div>

          <img
            className="img-fluid img-qr pb-1"
            src={darkMode ? qrCodigo : qrCodigo}
            alt="codigo qr"
          />
          <div
            className={
              visible1 === true || visible2 === true
                ? "   text-center"
                : " text-center"
            }
          >
            <div className="centrado my-2">
              <button
                onClick={confirmarCerrarSesion}
                style={{ width: "160px" }}
                className={
                  darkMode
                    ? "d-flex  border-0 btn-grid-menu-dark centrado"
                    : "d-flex  border-0 btn-grid-menu centrado"
                }
              >
                <div className="icono">
                  <FontAwesomeIcon icon={faRightFromBracket} />
                </div>
                <div className="texto">
                  <span className="lato-bold fs-14">Salir</span>
                </div>
              </button>
            </div>
          </div>
        </div>
      </>
    ),
    12:(
        <>
            <div className="centrado my-2">
                <NavLink
                    end
                    to="/abmtest/panelinterno"
                    className="border-0"
                    onClick={ocultarModalesInicio}
                >
                    <div style={{ width: "160px" }}>
                        <div className={activado()}>
                            <div className="icono">
                                <FontAwesomeIcon icon={faMagnifyingGlassChart} />
                            </div>
                            <div className="texto">
                                <span className="lato-bold fs-14"> Panel Interno</span>
                            </div>
                        </div>
                    </div>
                </NavLink>
            </div>

            <div className="centrado my-2">
                <NavLink
                    end
                    to="/abmtest/blanqueo"
                    className="border-0"
                    onClick={ocultarModalesInicio}
                >
                    <div style={{ width: "160px" }}>
                        <div className={activado()}>
                            <div className="icono">
                                <FontAwesomeIcon icon={faFileInvoiceDollar} />
                            </div>
                            <div className="texto">
                                <span className="lato-bold fs-14">Blanqueo</span>
                            </div>
                        </div>
                    </div>
                </NavLink>
            </div>
            <div className="centrado my-2">
                <NavLink
                    end
                    to="/abmtest/resumenaliado"
                    className=" border-0 text-decoration-none"
                    onClick={ocultarModalesContabilidad}
                >
                    <div style={{ width: "160px" }}>
                        <div className={activadoCalificar()}>
                            <div className="icono">
                                <FontAwesomeIcon icon={faMagnifyingGlassChart} />
                            </div>
                            <div className="texto">
                                <span className="lato-bold fs-14">Resumen Aliado</span>
                            </div>
                        </div>
                    </div>
                </NavLink>
            </div>  
            <div className="centrado my-2">
                <NavLink
                    end
                    to="/abmtest/comparador"
                    className="border-0"
                    onClick={ocultarModalesInicio}
                >
                    <div style={{ width: "160px" }}>
                        <div className={activado()}>
                            <div className="icono">
                                <FontAwesomeIcon icon={faChartSimple} />
                            </div>
                            <div className="texto">
                                <span className="lato-bold fs-14">Simulador</span>
                            </div>
                        </div>
                    </div>
                </NavLink>
            </div>

            <div className="centrado my-2">
                <NavLink
                    end
                    to="/abmtest/simulador"
                    className="border-0"
                    onClick={ocultarModalesInicio}
                >
                    <div style={{ width: "160px" }}>
                        <div className={activado()}>
                            <div className="icono">
                                <FontAwesomeIcon icon={faCalculator} />
                            </div>
                            <div className="texto">
                                <span className="lato-bold fs-14">Comparador</span>
                            </div>
                        </div>
                    </div>
                </NavLink>
            </div>
            <div className="centrado my-2">
                <NavLink
                    end
                    to="/abmtest/simuladorliquidaciones"
                    className="border-0"
                    onClick={ocultarModalesInicio}
                >
                    <div style={{ width: "160px" }}>
                        <div className={activado()}>
                            <div className="icono">
                                <FontAwesomeIcon icon={faCalculator} />
                            </div>
                            <div className="texto">
                                <span className="lato-bold fs-14">Simulador Liquidaciones</span>
                            </div>
                        </div>
                    </div>
                </NavLink>
            </div>
            <div className="centrado my-2">
                <NavLink
                    end
                    to="/abmtest/ordenpago"
                    className="border-0"
                    onClick={ocultarModalesInicio}
                >
                    <div style={{ width: "160px" }}>
                        <div className={activado()}>
                            <div className="icono">
                                <FontAwesomeIcon icon={faCalculator} />
                            </div>
                            <div className="texto">
                                <span className="lato-bold fs-14">Orden de Pago</span>
                            </div>
                        </div>
                    </div>
                </NavLink>
            </div>

            <div className="centrado my-2">
                <NavLink
                    end
                    to="/abmtest/cupones"
                    className="border-0"
                    onClick={ocultarModalesInicio}
                >
                    <div style={{ width: "160px" }}>
                        <div className={activado()}>
                            <div className="icono">
                                <FontAwesomeIcon icon={faMagnifyingGlassChart} />
                            </div>
                            <div className="texto">
                                <span className="lato-bold fs-14">Cupones</span>
                            </div>
                        </div>
                    </div>
                </NavLink>
            </div>
            <div className="centrado my-2">
                <NavLink
                    end
                    to="/abmtest/nrocomercio"
                    className="border-0"
                    onClick={ocultarModalesInicio}
                >
                    <div style={{ width: "160px" }}>
                        <div className={activado()}>
                            <div className="icono">
                                <FontAwesomeIcon icon={faMagnifyingGlassChart} />
                            </div>
                            <div className="texto">
                                <span className="lato-bold fs-14">N° de Comercio</span>
                            </div>
                        </div>
                    </div>
                </NavLink>
            </div>
            <div className="centrado my-2">
                <NavLink
                    end
                    to="/abmtest/legajos"
                    className="border-0"
                    onClick={ocultarModalesInicio}
                >
                    <div style={{ width: "160px" }}>
                        <div className={activado()}>
                            <div className="icono">
                                <FontAwesomeIcon icon={faMagnifyingGlassChart} />
                            </div>
                            <div className="texto">
                                <span className="lato-bold fs-14">Legajos</span>
                            </div>
                        </div>
                    </div>
                </NavLink>
            </div>
            {/* <div className="centrado my-2">
                <NavLink
                    end
                    to="/abmtest/crm"
                    className="border-0"
                    onClick={ocultarModalesInicio}
                >
                    <div style={{ width: "160px" }}>
                        <div className={activado()}>
                            <div className="icono">
                                <FontAwesomeIcon icon={faTableCells} />
                            </div>
                            <div className="texto">
                                <span className="lato-bold fs-14">CRM</span>
                            </div>
                        </div>
                    </div>
                </NavLink>
            </div> */}

            <div className="centrado my-2">
                <button
                    onClick={confirmarCerrarSesion}
                    style={{ width: "160px" }}
                    className={
                        darkMode
                            ? "d-flex  border-0 btn-grid-menu-dark centrado"
                            : "d-flex  border-0 btn-grid-menu centrado"
                    }
                >
                    <div className="icono">
                        <FontAwesomeIcon icon={faRightFromBracket} />
                    </div>
                    <div className="texto">
                        <span className="lato-bold fs-14">Salir</span>
                    </div>
                </button>
            </div>
        </>

    ),
    // se puede agregar otros roles siguiendo la estructura de arriba
    // dependiendo del tipo del usuario que nos envie el backend
      // el proximo tipo sera cada dia mas putito
    // cada dia mas viejo trolo el contador si sigue asi no llega a la jubilacion con el culo virgen
    // el siguiente front/back/fullstack, andate de aca, es una prision forever como para el contador
      // los designers son bien chupapijas
    //cada dia mas putita
  };

  const [menuActual, setMenuActual] = useState(<></>);
  useEffect(() => {
    // Actualizar el menú cuando cambia el rol
    setMenuActual(menusPorRol[usuarioRol] || <>{/* Menú por defecto */}</>);
  }, [usuarioRol]); // Dependencia: usuarioRol

  function PopoverBottom() {
    const popover = (
      <Popover
        className={
          darkMode
            ? "caja-campana-dark scroll-especifico-dark text-white"
            : "caja-campana scroll-especifico "
        }
        id="popover-positioned-bottom"
      >
        <Popover.Body>
          {usuarioRol === 0 ? (
            <>
              <div className="container px-4">
                <div className="d-flex flex-column justify-content-around">
                  {notificacionesAliados.map((notificacion, index) => (
                    <div key={index}>
                      <h6 className="fs-16 my-3">
                        <span className="me-2">
                          {darkMode ? (
                            <FontAwesomeIcon
                              className="fs-8  color-blanco-items"
                              icon={faCircle}
                            />
                          ) : (
                            <FontAwesomeIcon
                              className="fs-8  color-negro-items"
                              icon={faCircle}
                            />
                          )}
                        </span>
                        <span
                          className={darkMode ? "text-white" : "text-black"}
                        >
                          {notificacion.noticia1}
                        </span>
                      </h6>
                    </div>
                  ))}
                </div>
              </div>
            </>
          ) : (
            <>
              <div className="container px-4">
                <div className="d-flex flex-column justify-content-around">
                  {notificacionesAsesores.map((notificacion, index) => (
                    <div key={index}>
                      <h6 className="fs-16 my-3">
                        <span className="me-2">
                          {darkMode ? (
                            <FontAwesomeIcon
                              className="fs-8  color-blanco-items"
                              icon={faCircle}
                            />
                          ) : (
                            <FontAwesomeIcon
                              className="fs-8  color-negro-items"
                              icon={faCircle}
                            />
                          )}
                        </span>
                        <span
                          className={darkMode ? "text-white" : "text-black"}
                        >
                          {notificacion.noticia1}
                        </span>
                      </h6>
                    </div>
                  ))}
                </div>
              </div>
            </>
          )}
        </Popover.Body>
      </Popover>
    );

    return (
      <OverlayTrigger trigger="click" placement="bottom" overlay={popover}>
        <FontAwesomeIcon
          onClick={() => {
            verModalNotificacion();
            setVisible2(false);
            setHayNotificacionesNoVistas(false);
          }}
          className={activadoIconoCampana()}
          icon={faBell}
        />
      </OverlayTrigger>
    );
  }

  function PopoverBottom2() {
    const popover = (
      <Popover
        className={
          darkMode
            ? "caja-cerrar-sesion-dark centrado"
            : "caja-cerrar-sesion centrado"
        }
        id="popover-positioned-bottom"
      >
        <Popover.Body>
          <div className="container">
            <div className="py-4">
              <h6
                className={
                  darkMode
                    ? "fs-18 lato-bold text-white my-3 text-center"
                    : "fs-18 lato-bold my-3 text-center"
                }
              >
                Zoco SAS
              </h6>
              <div>
                <div className="centrado my-3">
                  <Button
                    className={
                      darkMode
                        ? "d-flex btn-nav-configuracion-dark  centrado border-0"
                        : "d-flex btn-nav-configuracion centrado  border-0"
                    }
                    onClick={() => setModalShowCompleta(true)}
                  >
                    <FontAwesomeIcon className="" icon={faGear} />
                    <span className="ms-2  lato-bold fs-10">
                      Cambiar contraseña
                    </span>
                  </Button>
                  <ModalConfiguraciones
                    show={modalShowCompleta}
                    onHide={() => setModalShowCompleta(false)}
                  />
                </div>
              </div>
            </div>
          </div>
        </Popover.Body>
      </Popover>
    );

    return (
      <OverlayTrigger trigger="click" placement="bottom" overlay={popover}>
        {darkMode ? (
          <FontAwesomeIcon className={activadoIconoUser()} icon={faUser} />
        ) : (
          <FontAwesomeIcon
            onClick={() => {
              setVisible2(false);
            }}
            className={activadoIconoUser()}
            icon={faUser}
          />
        )}
      </OverlayTrigger>
    );
  }

  return (
    <>
      <section className={darkMode ? " sidebar-dark" : `sidebar `}>
        <div className="py-5 text-center">
          <img
            className="my-4 img-fluid"
            src={darkMode ? logoClaro : logo}
            alt="logo"
            width="140"
            height="40"
          />
          <div className="d-flex justify-content-center mt-3">
            <div className="zoom">
              <FontAwesomeIcon
                onClick={handleClick}
                className="iconos-modales color-verde mx-3"
                icon={darkMode ? faSun : faMoon}
              />
            </div>

            <div className="zoom" style={{ position: "relative" }}>
              {hayNotificacionesNoVistas && (
                <NotificacionIndicador count={"!"} />
              )}
              {PopoverBottom()}
            </div>
            <div className="zoom">{PopoverBottom2()}</div>
          </div>
        </div>
        {menuActual}
      </section>
    </>
  );
};

export default SidebarReact;
