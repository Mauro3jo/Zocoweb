// import hooks
import React, { useContext, useEffect, useState } from "react";

// import context
import { DarkModeContext } from "../../context/DarkModeContext";

// import librerias
import { useNavigate } from "react-router-dom";
import { Button } from "react-bootstrap";
import Swal from "sweetalert2";
import { faRotate } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";

// assets logo de carpeta img
import logo from "../../assets/img/logo.png";

// import components
import BienvenidoPanelGestor from "../../components/gestorComp/BienvenidoPanelGestor";
import Footer from "../../components/Footer";
import BienvenidoPanelGestorCelular from "../../components/gestorComp/BienvenidoPanelGestorCelular";
import ContenidoCheckGestor from "../../components/gestorComp/ContenidoCheckGestor";
import TituloPagina from "../../components/TituloPagina";
import MapComponent2Gestor from "../../components/gestorComp/MapComponent2Gestor";
import TablaGestorCheckLocal from "../../components/gestorComp/TablaGestorCheckLocal";
import PopUpNotificacionesGenerico from "../../components/PopUpNotificacionesGenerico";

const GestorCheck = () => {
  // context para el modo oscuro
  const { darkMode } = useContext(DarkModeContext);

  // hook para la navegacion
  const navegacion = useNavigate();
 
  // url de la api
  const apiUrlToken = process.env.REACT_APP_API_TOKEN;

  useEffect(() => {
    const verificarToken = async () => {
      const token = sessionStorage.getItem("token");

      if (!token) {
        manejarRespuestaNoAutorizada();
        return;
      }

      try {
        const response = await fetch(apiUrlToken, {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ Token: token }),
        });

        if (response.ok) {
          const data = await response.json();

          if (data !== 6) {
            manejarAccesoDenegado();
          }
        } else {
          if (response.status === 401) {
            manejarRespuestaNoAutorizada();
          } else {
            throw new Error("Respuesta no satisfactoria del servidor");
          }
        }
      } catch (error) {
        console.error("Error al validar el token", error);
      }
    };

    const redireccionar = () => {
      navegacion("/");
      recargarPagina();
    };

    const manejarRespuestaNoAutorizada = () => {
      sessionStorage.removeItem("token"); // Eliminar el token

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
      }).then(redireccionar);
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
      }).then(redireccionar);
    };

    verificarToken();
  }, []);

  // estado para la consulta inicial
  const [datosInicio, setDatosInicio] = useState(null);

  // estado para el check
  const { esCheck, setEsCheck } = useState();

  // api url
  const apiUrlDatos = "/api/datosinicioasesores/inicioasesores";
  const aoiUrlCheck = "/api/geo/cofirmarcheck";

  // estado para controlar el check y visualizar la siguiente pestaña
  const [estadoCheck, setEstadoCheck] = useState();

  // consulta para verificar y obtener los datos
  useEffect(() => {
    const verificarToken = async () => {
      const token = sessionStorage.getItem("token");

      if (!token) {
        manejarRespuestaNoAutorizada();
        return;
      }

      try {
        const response = await fetch(apiUrlToken, {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ Token: token }),
        });

        if (response.ok) {
          const data = await response.json();

          if (data !== 6) {
            manejarAccesoDenegado();
          }
        } else {
          if (response.status === 401) {
            manejarRespuestaNoAutorizada();
          } else {
            throw new Error("Respuesta no satisfactoria del servidor");
          }
        }
      } catch (error) {
        console.error("Error al validar el token", error);
      }
    };

    const redireccionar = () => {
      navegacion("/");
      recargarPagina();
    };

    const manejarRespuestaNoAutorizada = () => {
      sessionStorage.removeItem("token"); // Eliminar el token

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
      }).then(redireccionar);
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
      }).then(redireccionar);
    };

    verificarToken();
  }, []);

  // funcion para filtrar la vista de administracion
  const obtenerFechaActualFormateada = () => {
    const fechaActual = new Date();
    const anio = fechaActual.getFullYear();
    const mes = `0${fechaActual.getMonth() + 1}`.slice(-2);
    const dia = `0${fechaActual.getDate()}`.slice(-2);
    const fechaFormateada = `${anio}-${mes}-${dia}`;
    return fechaFormateada;
  };

  // Estado para almacenar la fecha seleccionada en el input de tipo fecha
  // con la funcion para obtener la fecha actual formateada
  const [fechaSeleccionada, setFechaSeleccionada] = useState(
    obtenerFechaActualFormateada()
  );
 
  // Función para manejar el cambio en el input de fecha
  const handleFechaChange = (event) => {
    setFechaSeleccionada(event.target.value);
  };

  // estado de la checkList para mostrar en la tabla
  const [checkList, setCheckList] = useState([]);
  // consulta para  obtener el check de los archivos subidos
  useEffect(() => {
    const fetchCheck = async () => {
      // Aquí tu código existente para obtener los datos...
      try {
        const token = sessionStorage.getItem("token");
        const response = await fetch("/api/geo/checklistaimagenasesor", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ Token: token, Fecha: fechaSeleccionada }),
        });
        const data = await response.json();
        setCheckList(data);
      } catch (error) {
      }
    };

    fetchCheck();
  }, [fechaSeleccionada]); // Dependencia en fechaSeleccionada para refetch

  // consulta para traer el estado isCheckedActive
  // para poder utilizarlo para mostrar el empezar o terminar jornada
  // y no se vaya la vista por mas que actualicen la pagina.
  const isCheckedActive = async () => {
    const token = sessionStorage.getItem("token");
    const respuestaCheck = await fetch(aoiUrlCheck, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ Token: token }),
    });

    if (respuestaCheck.ok) {
      const esCheckValido = await respuestaCheck.json();
      setEstadoCheck(esCheckValido);
    } else {
      throw new Error("Error al realizar el check");
    }
  };

  const recargarPagina = () => {
    window.location.reload();
  };

  const fechasEspecificas = ["2024-05-14", "2024-05-15"];

  const [showModalNotificaciones, setShowModalNotificaciones] = useState(() => {
    const hoy = new Date().toISOString().slice(0, 10); // Formato 'YYYY-MM-DD'
    const fechaUltimoPopup = localStorage.getItem("fechaUltimoPopup");

    if (fechasEspecificas.includes(hoy) && fechaUltimoPopup !== hoy) {
      return true; // Mostrar si hoy está en las fechas especificadas y no se mostró hoy
    }
    return false; // No mostrar si hoy no está en las fechas o ya se mostró
  });
  const handleClose = () => {
    const hoy = new Date().toISOString().slice(0, 10);
    localStorage.setItem("fechaUltimoPopup", hoy); // Guardar hoy como la última fecha de visualización
    setShowModalNotificaciones(false);
  };

  return (
    <div translate="no" className="d-flex flex-column min-vh-100">
      <div className="py-4 d-md-block d-none">
        <BienvenidoPanelGestor />
      </div>
      <div className="py-4 d-block d-md-none">
        <BienvenidoPanelGestorCelular />
      </div>
      <div className="pt-2">
        <TituloPagina title="Check Gestor" />
      </div>
      <div>
        <ContenidoCheckGestor
          isCheckedActive={isCheckedActive}
          estadoCheck={estadoCheck}
        />
      </div>
      <div className="pt-2">
        <TituloPagina title="Mapa del check" />
      </div>
      <div className="">
        <MapComponent2Gestor />
      </div>
      {showModalNotificaciones && (
        <PopUpNotificacionesGenerico translate="no" onClose={handleClose} />
      )}
      <section className="d-flex flex-wrap justify-content-between container">
        <article className="container py-4">
          {/* Boton para aplicar la funcion de actualizar la tabla  */}
          <Button
            className={
              darkMode
                ? "d-flex btn-check-modal-dark  centrado border-0 fs-14"
                : "d-flex btn-check-modal centrado  border-0 fs-14"
            }
            onClick={recargarPagina}
          >
            <FontAwesomeIcon className="me-3" icon={faRotate} /> Actualizar
            tabla{" "}
          </Button>
        </article>
        {/* Input para el filtrado  por fecha  */}
        <div className="container  py-4">
          <label className="me-2" htmlFor="fecha">
            Filtro por fecha:{" "}
          </label>
          <input
            className="lato-regular border-0 filtro-fecha-administracion container"
            type="date"
            id="fecha"
            value={fechaSeleccionada}
            onChange={handleFechaChange}
            style={{ color: "#000000" }}
          />
        </div>
      </section>
      <div>
        <TablaGestorCheckLocal checkList={checkList} />
      </div>
      <div className="py-4 mt-auto">
        <Footer />
      </div>
    </div>
  );
};

export default GestorCheck;
