import "./NuevoNavReact.css";
import React, { useContext, useEffect, useState } from "react";
import { Badge, Button, OverlayTrigger, Popover } from "react-bootstrap";
import Offcanvas from "react-bootstrap/Offcanvas";
import { DarkModeContext } from "../context/DarkModeContext";
import { FaBars } from "react-icons/fa";
import logo from "../assets/img/logo.png";
import logoClaro from "../assets/img/logo-modo-oscuro.png";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
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
  faFilter,
  faGear,
  faGraduationCap,
  faHouse,
  faList,
  faListCheck,
  faLocationDot,
  faMagnifyingGlassChart,
  faMoon,
  faNewspaper,
  faReceipt,
  faRectangleList,
  faRightFromBracket,
  faStar,
  faSun,
  faUser,
  faXmark,
} from "@fortawesome/free-solid-svg-icons";
import { Link, NavLink } from "react-router-dom";
import Select from "react-select";
import { faWhatsapp } from "@fortawesome/free-brands-svg-icons";
import ModalConfiguracionesCel from "./ModalConfiguracionesCel";
import { DatosInicioContext } from "../context/DatosInicioContext";
import Swal from "sweetalert2";
import NotificacionIndicador from "./NotificacionIndicador";

const NuevoNavReact = ({ name, ...props }) => {
  //states del sidebar
  const [show, setShow] = useState(false);
  const handleClose = () => setShow(false);

  const toggleShow = () => setShow((s) => !s);

  useEffect(() => {
    const handleResize = () => {
      if (window.innerWidth >= 768) {
        setShow(false);
      }
    };

    window.addEventListener("resize", handleResize);

    return () => {
      window.removeEventListener("resize", handleResize);
    };
  }, []);

  const { darkMode } = useContext(DarkModeContext);
  const [datoCapturados, setDatoCapturados] = useState({});
  const [isSearchable, setIsSearchable] = useState(true);
  const [selectedAnio, setSelectedAnio] = useState(null);
  const [selectedMes, setSelectedMes] = useState(null);
  const [selectedComercio, setSelectedComercio] = useState(null);
  const [selectedSemana, setSelectedSemana] = useState(null);
  const [visibleModal, setVisibleModal] = useState(false);
  const { actualizarDatos } = useContext(DatosInicioContext);
  const [fechaInicio, setFechaInicio] = useState(null);
  const [fechaFin, setFechaFin] = useState(null);
  const [optionsComercio, setOptionsComercio] = useState([]);
  const [optionsAnios, setOptionsAnios] = useState([]);
  const [optionsMes, setOptionsMes] = useState([]);
  const [optionsSemanas, setOptionsSemanas] = useState([]);

  const [datosSelect, setDatosSelect] = useState({
    anio: "",
    mes: "",
    semana: "",
    comercio: "",
  });

  const enviarDatosAlContexto = (datos) => {
    actualizarDatos(datos);
  };

  const procesarDatos = (data) => {
    const optionsComercio = [
      ...data.comercios.map((comercio) => ({
        value: comercio.toLowerCase().replace(/\s+/g, ""),
        label: comercio,
      })),
    ];

    const fechaInicio = new Date(data.fechaInicio);
    const fechaFin = new Date(data.fechaFin);

    const optionsAnios = [];
    for (
      let año = fechaInicio.getFullYear();
      año <= fechaFin.getFullYear();
      año++
    ) {
      optionsAnios.push({ value: año.toString(), label: año.toString() });
    }
    const optionsSemanas = [{ value: 8, label: "Todos" }];
    const optionsMeses = [];
    let fechaActual = fechaInicio;
    while (fechaActual <= fechaFin) {
      const mes = fechaActual.toLocaleString("es", { month: "long" });
      optionsMeses.push({ value: mes.toLowerCase(), label: mes });
      fechaActual = new Date(
        fechaActual.getFullYear(),
        fechaActual.getMonth() + 1,
        1
      );
      if (selectedAnio === null) {
        const ultimoAnio = optionsAnios[optionsAnios.length - 1];
        const ultimoMes = optionsMeses[optionsMeses.length - 1];

        setSelectedAnio(ultimoAnio);
        setSelectedMes(ultimoMes);
        setSelectedSemana(optionsSemanas[0]);
      }

      // Establecer 'Todos' como valor predeterminado para comercio
      setSelectedComercio(optionsComercio[0]);
    }

    setOptionsComercio(optionsComercio);
    setOptionsAnios(optionsAnios);
    setOptionsMes(optionsMeses);
    setOptionsSemanas(optionsSemanas);
    setFechaInicio(fechaInicio);
    setFechaFin(fechaFin);
  };

  const apiUrlBienvenidoPanel = process.env.REACT_APP_API_BIENVENIDO_PANEL;

  useEffect(() => {
    const token = sessionStorage.getItem("token");
    const requestData = {
      token: token,
    };

    if (token) {
      fetch(apiUrlBienvenidoPanel, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(requestData),
      })
        .then((response) => {
          if (!response.ok) {
          }
          return response.json();
        })
        .then((data) => {
          procesarDatos(data);
        })
        .catch((error) => {
        });
    }
  }, []);
  const actualizarMesesPorAnio = (anioSeleccionado) => {
    if (!fechaInicio || !fechaFin) return;

    // Ajusta el mes de inicio y fin dependiendo del año seleccionado
    const mesInicio =
      anioSeleccionado === fechaInicio.getFullYear()
        ? fechaInicio.getMonth()
        : 0;
    const mesFin =
      anioSeleccionado === fechaFin.getFullYear() ? fechaFin.getMonth() : 11;

    const optionsMeses = [];
    for (let mes = mesInicio; mes <= mesFin; mes++) {
      let fechaActual = new Date(anioSeleccionado, mes, 1);
      const nombreMes = fechaActual.toLocaleString("es", { month: "long" });
      optionsMeses.push({ value: mes + 1, label: nombreMes }); // Usar mes + 1 como valor
    }

    setOptionsMes(optionsMeses);

    // Establecer setSelectedMes en el último mes del rango
    setSelectedMes(optionsMeses[optionsMeses.length - 1]);
  };

  const actualizarSemanasPorMes = (anioSeleccionado, mesSeleccionado) => {
    const primerDiaMes = new Date(anioSeleccionado, mesSeleccionado - 1, 1);
    const ultimoDiaMes = new Date(anioSeleccionado, mesSeleccionado, 0);

    // Ajustar al lunes de la misma semana solo si el primer día no es domingo
    let diaActual = new Date(primerDiaMes);
    if (primerDiaMes.getDay() !== 0) {
      diaActual.setDate(diaActual.getDate() - ((diaActual.getDay() + 6) % 7));
    }

    let semanas = [];
    let semana = [];
    let numeroSemanaDelMes = 0;

    // Iterar a través de los días
    while (diaActual <= ultimoDiaMes || semana.length > 0) {
      if (diaActual.getDay() === 1) {
        if (semana.length > 0) {
          semanas.push({ numeroSemanaDelMes, dias: [...semana] });
          semana = [];
        }
        numeroSemanaDelMes++;
      }

      // Añadir el día a la semana actual si está dentro del mes
      if (diaActual.getMonth() === mesSeleccionado - 1) {
        semana.push(new Date(diaActual));
      }

      diaActual.setDate(diaActual.getDate() + 1);

      // Añadir la última semana si hemos llegado al final del mes
      if (diaActual > ultimoDiaMes && semana.length > 0) {
        semanas.push({ numeroSemanaDelMes, dias: [...semana] });
        semana = [];
      }
    }

    // Agregar el texto del mes completo al principio
    const mesCompleto = { label: `Todo el Mes`, value: 8 };

    // Filtrar las semanas que caen dentro del rango de fechaInicio y fechaFin
    const semanasFiltradas = semanas.filter((semana) => {
      const inicioSemana = semana.dias[0];
      const finSemana = semana.dias[semana.dias.length - 1];
      return (
        (!fechaInicio || finSemana >= fechaInicio) &&
        (!fechaFin || inicioSemana <= fechaFin)
      );
    });

    // Formatear las semanas para el uso en el front-end
    const semanasFormateadas = semanasFiltradas.map((semana) => {
      const label = `Semana ${semana.numeroSemanaDelMes}`;
      const value = semana.numeroSemanaDelMes;

      return { label, value };
    });

    // Agregar el objeto del mes completo al principio de la matriz
    semanasFormateadas.unshift(mesCompleto);

    setOptionsSemanas(semanasFormateadas);
  };

  const mandarSemana = (selectedSemana) => {
    const valorSemanaSeleccionada = selectedSemana;
    setDatosSelect({
      ...datosSelect,
      semana: valorSemanaSeleccionada,
    });
  };

  const mandarComercio = (selectedComercio) => {
    const valorComercioSeleccionado = selectedComercio;
    setDatosSelect({
      ...datosSelect,
      comercio: valorComercioSeleccionado,
    });
  };

  useEffect(() => {
    setDatosSelect({
      anio: selectedAnio ? selectedAnio.value : 0,
      mes: selectedMes ? selectedMes.value : "",
      semana: selectedSemana ? selectedSemana.value : 8, // Usar un valor por defecto aquí
      comercio: selectedComercio ? selectedComercio.value : "",
    });
  }, [selectedAnio, selectedMes, selectedSemana, selectedComercio]);

  const handleEnviarDatos = () => {
    if (!selectedAnio || !selectedMes || !selectedSemana || !selectedComercio) {
      Swal.fire({
        title: "Error",
        text: "Por favor, selecciona todos los campos.",
        icon: "error",
        confirmButtonText: "Ok",
      });
      return;
    }
    setIsLoading(true); // Iniciar el indicador de carga
    enviarDatosAlContexto(datosSelect);
    setTimeout(() => {
      setIsLoading(false); 
      setVisibleModal(false); 
      handleClose2();
    }, 2000); 
  };

  const [isLoading, setIsLoading] = useState(false);
  const verModalFilter = () => {
    setVisible2(false);
    setVisible1(false);
    setVisibleModal(!visibleModal);
  };

  const [visible1, setVisible1] = useState(false);
  const verModalNotificacion = () => {
    setVisible1(!visible1);
    setVisible2(false);
  };

  const [visible2, setVisible2] = useState(false);
  const verModalCerrarSesion = () => {
    setVisible2(!visible2);
    setVisible1(false);
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

  const { toggleDarkMode } = useContext(DarkModeContext);

  const aparecerScroll = () => {
    setShow(false);
  };

  //css de los btn navlink
  const [activeInicio, setActiveInicio] = useState(false);
  const [activeContabilidad, setActiveContabilidad] = useState(false);
  const [activeAnalisis, setActiveAnalisis] = useState(false);
  const [activeTicket, setActiveTicket] = useState(false);
  const [activeCalculadora, setActiveCalculadora] = useState(false);
  const [activeCalificar, setActiveCalificar] = useState(false);
  const [activeLogout, setActiveLogout] = useState(false);

  // const [activeTerminal, setActiveTerminal] = useState(false)
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

  const activadoSalir = () => {
    if (activeLogout && darkMode) {
      return " d-flex btn-grid-active-menu-dark centrado";
    } else if (activeLogout) {
      return " d-flex btn-grid-menu-active centrado";
    } else if (darkMode) {
      return "d-flex btn-grid-menu-dark centrado";
    } else {
      return " d-flex btn-grid-menu centrado";
    }
  };

  const handleClick = () => {
    toggleDarkMode();
    setVisible2(false);
    setVisible1(false);
  };

  const reloadPage = () => {
    window.location.reload = "/";
  };

  const [modalShowCompleta, setModalShowCompleta] = React.useState(false);
  const [mostrarOffcanvas, setMostrarOffcanvas] = useState(false);

  const cerrarOffcanvas = () => {
    setMostrarOffcanvas(false);
  };

  const otroEvento = () => {
    setVisible1(false);
    setVisible2(false);
  };

  const handleClose2 = () => {
    cerrarOffcanvas();
    otroEvento();
  };

  const apiUrlNotificaciones = process.env.REACT_APP_API_NOTIFICACIONES;
  const apiUrlLogout = process.env.REACT_APP_API_LOGOUT;
  const apiUrlToken = process.env.REACT_APP_API_TOKEN;

  const [notificacionesAliados, setNotificacionesAliados] = useState([]);
  const [notificacionesAsesores, setNotificacionesAsesores] = useState([]);

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

  const [hayNotificacionesNoVistas, setHayNotificacionesNoVistas] =
    useState(true);
  const [usuarioRol, setUsuarioRol] = useState();

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

  // funcion para borrar el token y cerrar sesion
  const cerrarSesion = async () => {
    const token = sessionStorage.getItem("token");
    if (!token) {
      console.error("No hay token en el almacenamiento de la sesión");
      return;
    }

    try {
      const response = await fetch(apiUrlLogout, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ Token: token }),
      });

      if (response.ok) {
        
        // Aquí puedes redireccionar al usuario o realizar otras acciones necesarias después de cerrar sesión
        sessionStorage.removeItem("token"); // Eliminar el token del sessionStorage
        // Redireccionar al usuario, por ejemplo a la página de inicio de sesión
        window.location.href = "/";
      } else {
        console.error("Error al cerrar sesión:", await response.text());
      }
    } catch (error) {
      console.error(
        "Error al realizar la solicitud de cierre de sesión:",
        error
      );
    }
  };

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
    // aliado menu
    0: (
      <>
        <div className="mt-4">
          <div className="centrado my-2">
            <NavLink
              end
              to="/aliados/inicio"
              className=" border-0 text-decoration-none"
              onClick={() => {
                handleClose2();
                aparecerScroll();
              }}
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
              className=" border-0 text-decoration-none"
              onClick={() => {
                handleClose2();
                aparecerScroll();
              }}
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
              className=" border-0 text-decoration-none"
              onClick={() => {
                handleClose2();
                aparecerScroll();
              }}
            >
              <div style={{ width: "160px" }}>
                <div className={activadoAnalisis()}>
                  <div className="icono">
                    <FontAwesomeIcon icon={faMagnifyingGlassChart} />
                  </div>
                  <div className="texto">
                    <span className="lato-bold fs-14">Análisis</span>
                  </div>
                </div>
              </div>
            </NavLink>
          </div>

          <div className="centrado my-2">
            <NavLink
              end
              to="/aliados/cupones"
              className=" border-0 text-decoration-none"
              onClick={() => {
                handleClose2();
                aparecerScroll();
              }}
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
              className=" border-0 text-decoration-none"
              onClick={() => {
                handleClose2();
                aparecerScroll();
              }}
            >
              <div style={{ width: "160px" }}>
                <div className={activadoCalculadora()}>
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
              className=" border-0 text-decoration-none"
              onClick={() => {
                handleClose2();
                aparecerScroll();
              }}
            >
              <div style={{ width: "160px" }}>
                <div className={activadoCalculadora()}>
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
              className=" border-0 text-decoration-none"
              onClick={() => {
                handleClose2();
                aparecerScroll();
              }}
            >
              <div style={{ width: "160px" }}>
                <div className={activadoCalculadora()}>
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
          <div
            className="centrado my-2"
            onClick={() => {
              handleClose2();
              aparecerScroll();
            }}
          >
            <a
              href="https://wa.link/w4quzx"
              target="_blank"
              rel="noreferrer"
              className=" border-0 text-decoration-none"
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
      </>
    ),
    // menu asesor
    1: (
      // asesor menu
      <>
        <div className="centrado my-2">
          <NavLink
            end
            to="/asesores/check"
            className=" border-0 text-decoration-none"
            onClick={() => {
              handleClose2();
              aparecerScroll();
            }}
          >
            <div style={{ width: "160px" }}>
              <div className={activadoCalculadora()}>
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
            onClick={() => {
              handleClose2();
              aparecerScroll();
            }}
          >
            <div style={{ width: "160px" }}>
              <div className={activadoCalculadora()}>
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
            onClick={() => {
              handleClose2();
              aparecerScroll();
            }}
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
        {/* <div className="centrado my-2">
          <NavLink
            end
            to="/asesores/chat"
            className=" border-0 text-decoration-none"
            onClick={() => {
              handleClose2();
              aparecerScroll();
            }}
          >
            <div style={{ width: "160px" }}>
              <div className={activadoCalificar()}>
                <div className="icono">
                  <FontAwesomeIcon icon={faCommentDots} />
                </div>
                <div className="texto">
                  <span className="lato-bold fs-16">Chat</span>
                </div>
              </div>
            </div>
          </NavLink>
        </div> */}
        <div className="centrado my-2">
          <NavLink
            end
            to="/asesores/descargas"
            className=" border-0 text-decoration-none"
            onClick={() => {
              handleClose2();
              aparecerScroll();
            }}
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
            onClick={() => {
              handleClose2();
              aparecerScroll();
            }}
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
            onClick={() => {
              handleClose2();
              aparecerScroll();
            }}
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
            onClick={() => {
              handleClose2();
              aparecerScroll();
            }}
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
    // menu para liquidaciones
    2: (
      <>
        <div className="centrado my-2">
          <NavLink
            end
            to="/liquidaciones"
            className=" border-0 text-decoration-none"
            onClick={() => {
              handleClose2();
              aparecerScroll();
            }}
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
            onClick={() => {
              handleClose2();
              aparecerScroll();
            }}
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
            onClick={() => {
              handleClose2();
              aparecerScroll();
            }}
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
            onClick={() => {
              handleClose2();
              aparecerScroll();
            }}
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
            onClick={() => {
              handleClose2();
              aparecerScroll();
            }}
          >
            <div style={{ width: "160px" }}>
              <div className={activadoCalificar()}>
                <div className="icono">
                  <FontAwesomeIcon icon={faListCheck} />
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
            onClick={() => {
              handleClose2();
              aparecerScroll();
            }}
          >
            <div style={{ width: "160px" }}>
              <div className={activadoCalificar()}>
                <div className="icono">
                  <FontAwesomeIcon icon={faListCheck} />
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
            onClick={() => {
              handleClose2();
              aparecerScroll();
            }}
          >
            <div style={{ width: "160px" }}>
              <div className={activadoCalificar()}>
                <div className="icono">
                  <FontAwesomeIcon icon={faListCheck} />
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
      ), 3: (
          <>
              <div className="centrado my-2">
                  <NavLink
                      end
                    to="/Calidad/Admin"
                      className=" border-0 text-decoration-none"
                      onClick={() => {
                          handleClose2();
                          aparecerScroll();
                      }}
                  >
                      <div style={{ width: "160px" }}>
                          <div className={activado()}>
                              <div className="icono">
                                  <FontAwesomeIcon icon={faHouse} />
                              </div>
                              <div className="texto">
                                  <span className="lato-bold fs-14"> Check</span>
                              </div>
                          </div>
                      </div>
                  </NavLink>
              </div>
         
              <div className="centrado my-2">
                  <NavLink
                      end
                    to="/Calidad/peticiones"
                      className=" border-0 text-decoration-none"
                      onClick={() => {
                          handleClose2();
                          aparecerScroll();
                      }}
                  >
                      <div style={{ width: "160px" }}>
                          <div className={activado()}>
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
                      className=" border-0 text-decoration-none"
                      onClick={() => {
                          handleClose2();
                          aparecerScroll();
                      }}
                  >
                      <div style={{ width: "160px" }}>
                          <div className={activado()}>
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
                      className=" border-0 text-decoration-none"
                      onClick={() => {
                          handleClose2();
                          aparecerScroll();
                      }}
                  >
                      <div style={{ width: "160px" }}>
                          <div className={activado()}>
                              <div className="icono">
                                  <FontAwesomeIcon icon={faNewspaper} />
                              </div>
                              <div className="texto">
                                  <span className="lato-bold fs-14">Panel  Interno</span>
                              </div>
                          </div>
                      </div>
                  </NavLink>
              </div>
              <div className="centrado my-2">
                  <NavLink
                      end
                    to="/Calidad/Historial"
                      className=" border-0 text-decoration-none"
                      onClick={() => {
                          handleClose2();
                          aparecerScroll();
                      }}
                  >
                      <div style={{ width: "160px" }}>
                          <div className={activado()}>
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
         
              <div className="centrado my-2">

                  <NavLink
                      end
                    to="/Calidad/crm"
                      className=" border-0 text-decoration-none"
                      onClick={() => {
                          handleClose2();
                          aparecerScroll();
                      }}
                  >
                      <div style={{ width: "160px" }}>
                          <div className={activado()}>
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
                      className=" border-0 text-decoration-none"
                      onClick={() => {
                          handleClose2();
                          aparecerScroll();
                      }}
                  >
                      <div style={{ width: "160px" }}>
                          <div className={activado()}>
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
                      className=" border-0 text-decoration-none"
                      onClick={() => {
                          handleClose2();
                          aparecerScroll();
                      }}
                  >
                      <div style={{ width: "160px" }}>
                          <div className={activado()}>
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
                      className=" border-0 text-decoration-none"
                      onClick={() => {
                          handleClose2();
                          aparecerScroll();
                      }}
                  >
                      <div style={{ width: "160px" }}>
                          <div className={activado()}>
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
    // menu para reclutador
    4: (
      <>
        <div className="centrado my-2">
          <NavLink
            end
            to="/reclutamiento/busqueda"
            className=" border-0 text-decoration-none"
            onClick={() => {
              handleClose2();
              aparecerScroll();
            }}
          >
            <div style={{ width: "160px" }}>
              <div className={activadoCalificar()}>
                <div className="icono">
                  <FontAwesomeIcon icon={faMagnifyingGlassChart} />
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
            onClick={() => {
              handleClose2();
              aparecerScroll();
            }}
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
            onClick={() => {
              handleClose2();
              aparecerScroll();
            }}
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
    ),
    5:(
      <>
      <div className="centrado my-2">
              <NavLink
                  end
                  to="/Admin"
                  className=" border-0 text-decoration-none"
                  onClick={() => {
                    handleClose2();
                    aparecerScroll();
                  }}
              >
                  <div style={{ width: "160px" }}>
                      <div className={activadoCalificar()}>
                          <div className="icono">
                              <FontAwesomeIcon icon={faMagnifyingGlassChart} />
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
                  to="/reporte/ReporteMensual"
                  className=" border-0 text-decoration-none"
                  onClick={() => {
                    handleClose2();
                    aparecerScroll();
                  }}
              >
                  <div style={{ width: "160px" }}>
                      <div className={activadoCalificar()}>
                          <div className="icono">
                              <FontAwesomeIcon icon={faMagnifyingGlassChart} />
                          </div>
                          <div className="texto">
                              <span className="lato-bold fs-14">Reporte Mensual</span>
                          </div>
                      </div>
                  </div>
              </NavLink>
          </div>
        
      </>
  ),
    // menu para gestor/a
    6: (
      <>
        <div className="centrado my-2">
          <NavLink
            end
            to="/gestor/check"
            className=" border-0 text-decoration-none"
            onClick={() => {
              handleClose2();
              aparecerScroll();
            }}
          >
            <div style={{ width: "160px" }}>
              <div className={activadoCalificar()}>
                <div className="icono">
                  <FontAwesomeIcon icon={faMagnifyingGlassChart} />
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
            onClick={() => {
              handleClose2();
              aparecerScroll();
            }}
          >
            <div style={{ width: "160px" }}>
              <div className={activadoCalificar()}>
                <div className="icono">
                  <FontAwesomeIcon icon={faMagnifyingGlassChart} />
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
            onClick={() => {
              handleClose2();
              aparecerScroll();
            }}
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
            onClick={() => {
              handleClose2();
              aparecerScroll();
            }}
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
            onClick={() => {
              handleClose2();
              aparecerScroll();
            }}
          >
            <div style={{ width: "160px" }}>
              <div className={activadoCalculadora()}>
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
            onClick={() => {
              handleClose2();
              aparecerScroll();
            }}
          >
            <div style={{ width: "160px" }}>
              <div className={activadoCalculadora()}>
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
            onClick={() => {
              handleClose2();
              aparecerScroll();
            }}
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
    ),
    // menu administrador/auditor
    8: (
      <>
        <div className="centrado my-2">
          <NavLink
            end
            to="/administracion"
            className=" border-0 text-decoration-none"
            onClick={() => {
              handleClose2();
              aparecerScroll();
            }}
          >
            <div style={{ width: "160px" }}>
              <div className={activado()}>
                <div className="icono">
                  <FontAwesomeIcon icon={faHouse} />
                </div>
                <div className="texto">
                  <span className="lato-bold fs-14"> Check</span>
                </div>
              </div>
            </div>
          </NavLink>
        </div>
            {/*    <div className="centrado my-2">
          <NavLink
            end
            to="/administracion/chat"
            className=" border-0 text-decoration-none"
            onClick={() => {
              handleClose2();
              aparecerScroll();
            }}
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
            onClick={() => {
              handleClose2();
              aparecerScroll();
            }}
          >
            <div style={{ width: "160px" }}>
              <div className={activado()}>
                <div className="icono">
                  <FontAwesomeIcon icon={faHouse} />
                </div>
                <div className="texto">
                  <span className="lato-bold fs-14"> Notificaciones</span>
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
            onClick={() => {
              handleClose2();
              aparecerScroll();
            }}
          >
            <div style={{ width: "160px" }}>
              <div className={activado()}>
                <div className="icono">
                  <FontAwesomeIcon icon={faStar} />
                </div>
                <div className="texto">
                  <span className="lato-bold fs-14"> Calificaciones</span>
                </div>
              </div>
            </div>
          </NavLink>
        </div>*/}
        <div className="centrado my-2">
          <NavLink
            end
            to="/administracion/blanqueos"
            className=" border-0 text-decoration-none"
            onClick={() => {
              handleClose2();
              aparecerScroll();
            }}
          >
            <div style={{ width: "160px" }}>
              <div className={activado()}>
                <div className="icono">
                  <FontAwesomeIcon icon={faCertificate} />
                </div>
                <div className="texto">
                  <span className="lato-bold fs-14"> Blanqueos</span>
                </div>
              </div>
            </div>
          </NavLink>
        </div>
            {/*<div className="centrado my-2">
                <NavLink
            end
            to="/administracion/blanqueos/empleados"
            className=" border-0 text-decoration-none"
            onClick={() => {
              handleClose2();
              aparecerScroll();
            }}
          >
            <div style={{ width: "160px" }}>
              <div className={activado()}>
                <div className="icono">
                  <FontAwesomeIcon icon={faCertificate} />
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
            className=" border-0 text-decoration-none"
            onClick={() => {
              handleClose2();
              aparecerScroll();
            }}
          >
            <div style={{ width: "160px" }}>
              <div className={activado()}>
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
            {/*     <div className="centrado my-2">

                <NavLink
                    end
                    to="/administracion/formularios"
                    className=" border-0 text-decoration-none"
                    onClick={() => {
                        handleClose2();
                        aparecerScroll();
                    }}
                >
                    <div style={{ width: "160px" }}>
                        <div className={activado()}>
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
                    className=" border-0 text-decoration-none"
                    onClick={() => {
                        handleClose2();
                        aparecerScroll();
                    }}
                >
                    <div style={{ width: "160px" }}>
                        <div className={activado()}>
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
                    className=" border-0 text-decoration-none"
                    onClick={() => {
                        handleClose2();
                        aparecerScroll();
                    }}
                >
                    <div style={{ width: "160px" }}>
                        <div className={activado()}>
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
            className=" border-0 text-decoration-none"
            onClick={() => {
              handleClose2();
              aparecerScroll();
            }}
          >
            <div style={{ width: "160px" }}>
              <div className={activadoCalificar()}>
                <div className="icono">
                  <FontAwesomeIcon icon={faMagnifyingGlassChart} />
                </div>
                <div className="texto">
                  <span className="lato-bold fs-14">Ordenes de pago</span>
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
                    onClick={() => {
                        handleClose2();
                        aparecerScroll();
                    }}
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
                    to="/administracion/AdminPanelInterno"
                    className=" border-0 text-decoration-none"
                    onClick={() => {
                        handleClose2();
                        aparecerScroll();
                    }}
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
            </div><div className="centrado my-2">
                <NavLink
                    end
                    to="/administracion/Fidelizacion"
                    className=" border-0 text-decoration-none"
                    onClick={() => {
                        handleClose2();
                        aparecerScroll();
                    }}
                >
                    <div style={{ width: "160px" }}>
                        <div className={activado()}>
                            <div className="icono">
                                <FontAwesomeIcon icon={faMagnifyingGlassChart} />
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
                    onClick={() => {
                        handleClose2();
                        aparecerScroll();
                    }}
                >
                    <div style={{ width: "160px" }}>
                        <div className={activado()}>
                            <div className="icono">
                            <FontAwesomeIcon icon={faChartSimple} />
                            </div>
                            <div className="texto">
                                <span className="lato-bold fs-14"> Comparador</span>
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
                    onClick={() => {
                        handleClose2();
                        aparecerScroll();
                    }}
                >
                    <div style={{ width: "160px" }}>
                        <div className={activado()}>
                            <div className="icono">
                            <FontAwesomeIcon icon={faCalculator} />
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
                    to="/administracion/simuladorliquidacion"
                    className=" border-0 text-decoration-none"
                    onClick={() => {
                        handleClose2();
                        aparecerScroll();
                    }}
                >
                    <div style={{ width: "160px" }}>
                        <div className={activado()}>
                            <div className="icono">
                            <FontAwesomeIcon icon={faCalculator} />
                            </div>
                            <div className="texto">
                                <span className="lato-bold fs-14">Simulador de ordenes</span>
                            </div>
                        </div>
                    </div>
                </NavLink>
        </div>
        {/* <div className="centrado my-2">

                <NavLink
                    end
                    to="/administracion/nrocomercio"
                    className=" border-0 text-decoration-none"
                    onClick={() => {
                        handleClose2();
                        aparecerScroll();
                    }}
                >
                    <div style={{ width: "160px" }}>
                        <div className={activado()}>
                            <div className="icono">
                            <FontAwesomeIcon icon={faRectangleList} />
                            </div>
                            <div className="texto">
                                <span className="lato-bold fs-14"> Numero Comercio</span>
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
    // menu empleado
    11: (
      <>
        <div className="centrado my-2">
          <NavLink
            end
            to="/cajero/inicio"
            className=" border-0 text-decoration-none"
            onClick={() => {
              handleClose2();
              aparecerScroll();
            }}
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
            className=" border-0 text-decoration-none"
            onClick={() => {
              handleClose2();
              aparecerScroll();
            }}
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
    12:(
      <>
      
        <div className="centrado my-2">
          <NavLink
            end
            to="/abmtest/panelinterno"
            className=" border-0 text-decoration-none"
            onClick={() => {
              handleClose2();
              aparecerScroll();
            }}
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
            className=" border-0 text-decoration-none"
            onClick={() => {
              handleClose2();
              aparecerScroll();
            }}
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
            onClick={() => {
              handleClose2();
              aparecerScroll();
            }}
          >
            <div style={{ width: "160px" }}>
              <div className={activado()}>
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
            className=" border-0 text-decoration-none"
            onClick={() => {
              handleClose2();
              aparecerScroll();
            }}
          >
            <div style={{ width: "160px" }}>
              <div className={activado()}>
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
            to="/abmtest/simulador"
            className=" border-0 text-decoration-none" 
            onClick={() => {
              handleClose2();
              aparecerScroll();
            }}
          >
            <div style={{ width: "160px" }}>
              <div className={activado()}>
                <div className="icono">
                                                <FontAwesomeIcon icon={faCalculator} />
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
            to="/abmtest/simuladorliquidaciones"
            className=" border-0 text-decoration-none"
            onClick={() => {
              handleClose2();
              aparecerScroll();
            }}
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
            className=" border-0 text-decoration-none"
            onClick={() => {
              handleClose2();
              aparecerScroll();
            }}
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
            className=" border-0 text-decoration-none"
            onClick={() => {
              handleClose2();
              aparecerScroll();
            }}
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
            className=" border-0 text-decoration-none"
            onClick={() => {
              handleClose2();
              aparecerScroll();
            }}
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
            className=" border-0 text-decoration-none"
            onClick={() => {
              handleClose2();
              aparecerScroll();
            }}
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
    )
    // ... otros roles - aqui siguiendo la logica de arriba
    // y dependiendo del tipo del rol que te mande el back
    // podes ir agregando un tipo de navbar
      // para el tipo de usuario.
      // conoci gente puta en esta vida pero ninguna tanto como el nuevo diseñador
    // y eso que el anterior era puto en serio
  };

  const [menuActual, setMenuActual] = useState(<></>);
  useEffect(() => {
    // Actualizar el menú cuando cambia el rol
    setMenuActual(menusPorRol[usuarioRol] || <>{/* Menú por defecto */}</>);
  }, [usuarioRol]); // Dependencia: usuarioRol

  //aqui te dejo el filtrado por rol 
  // para mostrarlo o no dependiendo del usuario 
  // por lo general solo lo usa el aliado.
  const mostrarFiltroPorRol = () => {
    switch (usuarioRol) {
      case 0:
        return (
          <>
            <div>
              <button
                className="btn-filtro border-0 text-white lato-bold fs-14"
                onClick={verModalFilter}
              >
                <FontAwesomeIcon className="me-1" icon={faFilter} />
                Filtros
              </button>
            </div>
          </>
        );
      case 1:
        return (
          <>
            <div>
              <Link to="/asesores/Check">
                <FontAwesomeIcon
                  className="mx-3 color-verde fs-36"
                  icon={faLocationDot}
                  size="xl"
                />
              </Link>
            </div>
          </>
        );
      case 2:
        return (
          <div className="ocultar-div">
            <div>
              <button
                className="btn-filtro border-0 text-white lato-bold fs-14"
                onClick={verModalFilter}
              >
                <FontAwesomeIcon className="me-1" icon={faFilter} />
                Filtros
              </button>
            </div>
          </div>
        );
      case 6:
        return (
          <div className="ocultar-div">
            <div>
              <button
                className="btn-filtro border-0 text-white lato-bold fs-14"
                onClick={verModalFilter}
              >
                <FontAwesomeIcon className="me-1" icon={faFilter} />
                Filtros
              </button>
            </div>
          </div>
        );
      case 8:
        return (
          <div className="ocultar-div">
            <div>
              <button
                className="btn-filtro border-0 text-white lato-bold fs-14"
                onClick={verModalFilter}
              >
                <FontAwesomeIcon className="me-1" icon={faFilter} />
                Filtros
              </button>
            </div>
          </div>
        );
      case 11:
        return (
          <div className="ocultar-div">
            <div>
              <button
                className="btn-filtro border-0 text-white lato-bold fs-14"
                onClick={verModalFilter}
              >
                <FontAwesomeIcon className="me-1" icon={faFilter} />
                Filtros
              </button>
            </div>
          </div>
        );
      default:
        return ""; 
    }
  };

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
            <div className="container px-4">
              <div className="d-flex flex-column justify-content-around">
                {notificacionesAliados.map((notificacion, index) => (
                  <div key={index}>
                    <h6 className="fs-16 my-3">
                      <span className="me-2">
                        {darkMode ? (
                          <FontAwesomeIcon
                            className="fs-8 color-blanco-items"
                            icon={faCircle}
                          />
                        ) : (
                          <FontAwesomeIcon
                            className="fs-8 color-negro-items"
                            icon={faCircle}
                          />
                        )}
                      </span>
                      <span className={darkMode ? "text-white" : "text-black"}>
                        {notificacion.noticia1}
                      </span>
                    </h6>
                  </div>
                ))}
              </div>
            </div>
          ) : (
            <div className="container px-4">
              <div className="d-flex flex-column justify-content-around">
                {notificacionesAsesores.map((notificacion, index) => (
                  <div key={index}>
                    <h6 className="fs-16 my-3">
                      <span className="me-2">
                        {darkMode ? (
                          <FontAwesomeIcon
                            className="fs-8 color-blanco-items"
                            icon={faCircle}
                          />
                        ) : (
                          <FontAwesomeIcon
                            className="fs-8 color-negro-items"
                            icon={faCircle}
                          />
                        )}
                      </span>
                      <span className={darkMode ? "text-white" : "text-black"}>
                        {notificacion.noticia1}
                      </span>
                    </h6>
                  </div>
                ))}
              </div>
            </div>
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
    const [visible2, setVisible2] = useState(false);
    const [modalShowCompleta, setModalShowCompleta] = useState(false);
    const [darkMode, setDarkMode] = useState(false); // Asegúrate de tener tu lógica para el modo oscuro

    const handleCambiarContrasena = () => {
      setModalShowCompleta(true);
      setVisible2(false);
    };

    const popover = (
      <Popover
        className={
          darkMode
            ? "caja-cerrar-sesion-dark centrado"
            : "caja-cerrar-sesion centrado"
        }
        style={{ width: "210px" }}
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
                    onClick={handleCambiarContrasena}
                  >
                    <FontAwesomeIcon className="" icon={faGear} />
                    <span className="ms-2  lato-bold fs-10">
                      Cambiar contraseña
                    </span>
                  </Button>
                  <ModalConfiguracionesCel
                    show={modalShowCompleta}
                    onHide={() => setModalShowCompleta(false)}
                    style={{ zIndex: 1050 }} // Asegúrate de que el modal tenga un z-index alto
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
        <FontAwesomeIcon
          onClick={() => setVisible2(!visible2)}
          className={activadoIconoUser()}
          icon={faUser}
        />
      </OverlayTrigger>
    );
  }

  return (
    <section className="container">
      <Offcanvas
        className={darkMode ? "bg-dark" : "bg-white"}
        show={mostrarOffcanvas}
        onHide={handleClose2}
        {...props}
      >
        <Offcanvas.Header closeButton>
          <Offcanvas.Title></Offcanvas.Title>
        </Offcanvas.Header>
        <Offcanvas.Body>
          <div className=" text-center">
            <img
              className="my-5 img-fluid logo-width"
              src={darkMode ? logoClaro : logo}
              alt="logo SOCO"
            />
            <div className="d-flex justify-content-center ">
              <div className="zoom">
                <FontAwesomeIcon
                  onClick={handleClick}
                  className="iconos-modales cursor-point color-verde mx-3"
                  icon={darkMode ? faSun : faMoon}
                />
              </div>

              <div className="zoom" style={{ position: "relative" }}>
                {hayNotificacionesNoVistas && (
                  <NotificacionIndicador count={"!"} />
                )}
                {PopoverBottom()}
              </div>
              <div className="zoom">
                <FontAwesomeIcon
                  onClick={() => setModalShowCompleta(true)}
                  className={activadoIconoUser()}
                  icon={faUser}
                />
                <ModalConfiguracionesCel
                  show={modalShowCompleta}
                  onHide={() => setModalShowCompleta(false)}
                />
              </div>
            </div>
          </div>
          {/* botones navlink */}
          {menuActual}
        </Offcanvas.Body>
      </Offcanvas>
      <section
        className={
          darkMode ? " mobile-nav-menu-dark py-4" : "mobile-nav-menu py-4"
        }
      >
        <div className="container d-flex justify-content-between centrado">
          <div className="">
            <Button
              variant="primary"
              onClick={() => setMostrarOffcanvas(true)}
              className={
                darkMode
                  ? "mobile-nav-btn-fabars-dark"
                  : "mobile-nav-btn-fabars"
              }
            >
              <FaBars size={25} />
            </Button>
          </div>
          <div className="">
            <div>
              <img
                className="logo img-fluid "
                src={darkMode ? logoClaro : logo}
                alt="logo"
              />
            </div>
          </div>
          <div>{mostrarFiltroPorRol()}</div>
        </div>
        {visibleModal && (
          <div className="modalShadowFilter">
            <div className="">
              <div className={darkMode ? "modalbox-dark" : "modalbox "}>
                <section className="d-flex justify-content-between ">
                  <div className="ocultar-div"></div>
                  <div className="d-flex justify-content-center">
                    <h6 className="text-center mt-4 pb-2 lato-bold fs-16 ">
                      Filtros
                    </h6>
                  </div>
                  <div>
                    <button
                      className="border-0 close btn-filtro-cruz"
                      onClick={verModalFilter}
                    >
                      <FontAwesomeIcon className="fs-18 " icon={faXmark} />
                    </button>
                  </div>
                </section>
                <div>
                  <form className=" ">
                    <article className="">
                      <div className="d-flex justify-content-start">
                        <label
                          htmlFor="exampleFormControlInput1"
                          className="lato-bold fs-16 ms-3 "
                        >
                          Año
                        </label>
                      </div>
                      <div>
                        <Select
                          value={selectedAnio}
                          className="lato-bold"
                          classNamePrefix="select"
                          isSearchable={isSearchable}
                          name="anio"
                          options={optionsAnios}
                          onChange={(selectedOption) => {
                            // Convertir el valor seleccionado a un número antes de establecer el estado
                            setSelectedAnio({
                              ...selectedOption,
                              value: Number(selectedOption.value),
                            });
                            actualizarMesesPorAnio(
                              Number(selectedOption.value)
                            );
                          }}
                          styles={{
                            control: (base) => ({
                              ...base,
                              textAlign: "center",
                            }),
                          }}
                        />
                      </div>
                    </article>
                    <article>
                      <div className="d-flex justify-content-start">
                        <label
                          htmlFor="exampleFormControlInput1"
                          className="lato-bold fs-16 ms-3"
                        >
                          Mes
                        </label>
                      </div>
                      <Select
                        value={selectedMes}
                        className="lato-bold"
                        classNamePrefix="select"
                        isSearchable={isSearchable}
                        name="mes"
                        options={optionsMes}
                        onChange={(selectedOption) => {
                          setSelectedMes(selectedOption);
                          actualizarSemanasPorMes(
                            selectedAnio.value,
                            selectedOption.value
                          );
                        }}
                        styles={{
                          control: (base) => ({
                            ...base,
                            textAlign: "center",
                          }),
                        }}
                      />
                    </article>
                    <article>
                      <div className="d-flex justify-content-start">
                        <label
                          htmlFor="exampleFormControlInput1"
                          className="lato-bold fs-16 ms-3"
                        >
                          Semanas
                        </label>
                      </div>
                      <Select
                        value={selectedSemana}
                        className="lato-bold"
                        classNamePrefix="select"
                        isSearchable={isSearchable}
                        name="semanas"
                        options={optionsSemanas}
                        onChange={(selectedOption) => {
                          setSelectedSemana(selectedOption);
                          mandarSemana(selectedOption.value);
                        }}
                        styles={{
                          control: (base) => ({
                            ...base,
                            textAlign: "center",
                          }),
                        }}
                      />
                    </article>
                    <article>
                      <div className="d-flex justify-content-start">
                        <label
                          htmlFor="exampleFormControlInput1"
                          className="lato-bold fs-16 ms-3"
                        >
                          Comercio
                        </label>
                      </div>
                      <Select
                        value={selectedComercio}
                        className=" lato-bold"
                        classNamePrefix="select"
                        isSearchable={isSearchable}
                        name="comercio"
                        options={optionsComercio}
                        onChange={(selectedOption) => {
                          setSelectedComercio(selectedOption);
                          mandarComercio(selectedOption.value);
                        }}
                        styles={{
                          control: (base) => ({
                            ...base,
                            textAlign: "center",
                          }),
                        }}
                      />
                    </article>

                    <div className="mt-4 me-1">
                      <button
                        className="cursor-point ov-btn-slide-left border-0 lato-bold fs-16 text-white"
                        type="button"
                        onClick={handleEnviarDatos}
                        disabled={isLoading}
                      >
                        {isLoading ? "Cargando..." : "Aplicar"}
                      </button>
                    </div>
                  </form>
                </div>
              </div>
            </div>
          </div>
        )}
      </section>
    </section>
  );
};

export default NuevoNavReact;
