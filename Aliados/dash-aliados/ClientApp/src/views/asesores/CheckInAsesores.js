// import hooks
import React, { useContext, useEffect, useState } from "react";

// import context
import { DarkModeContext } from "../../context/DarkModeContext";

//import librerias
import { Button } from "react-bootstrap";
import Swal from "sweetalert2";
import { faRotate } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { useNavigate } from "react-router-dom";

// assets
import logo from "../../assets/img/logo.png";

// import component
import BienvenidoPanelAsesores from "../../components/asesoresComp/BienvenidoPanelAsesores";
import BienvenidoPanelAsesoresCelular from "../../components/asesoresComp/BienvenidoPanelAsesoresCelular";
import TituloPagina from "../../components/TituloPagina";
import Footer from "../../components/Footer";
import ContenidoCheck from "../../components/asesoresComp/ContenidoCheck";
import ScrollTo from "../../components/asesoresComp/ScrollTo";
import MapComponent2 from "../../components/asesoresComp/MapComponent2";
import TablaAsesorCheckLocal from "../../components/asesoresComp/TablaAsesorCheckLocal";
import PopUpNotificacionesGenerico from "../../components/PopUpNotificacionesGenerico";
const CheckInAsesores = () => {
  // estado para la consulta inicial
  const [datosInicio, setDatosInicio] = useState(null);

  // hooks para la navegacion
  const navegacion = useNavigate();

  // darkMode Context funcionalidad para el modo claro/oscuro
  const { darkMode } = useContext(DarkModeContext);

  // estado para el check
  const { esCheck, setEsCheck } = useState();

  // api url
  const apiUrlToken = process.env.REACT_APP_API_TOKEN;
  const apiUrlDatos = "/api/datosinicioasesores/inicioasesores";
  const aoiUrlCheck = "/api/geo/cofirmarcheck";

  // estado para controlar el check y visualizar la siguiente pestaña
  const [estadoCheck, setEstadoCheck] = useState();

  // consulta para verificar y obtener los datos
  useEffect(() => {
    const verificarTokenYObtenerDatos = async () => {
      const token = sessionStorage.getItem("token");

      if (!token) {
        manejarRespuestaNoAutorizada();
        return;
      }

      try {
        const respuestaToken = await fetch(apiUrlToken, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ Token: token }),
        });

        if (!respuestaToken.ok) {
          if (respuestaToken.status === 401) {
            manejarRespuestaNoAutorizada();
          } else {
            manejarRespuestaNoAutorizada();

            throw new Error("Error verificando el token");
          }
          return;
        }

        const dataToken = await respuestaToken.json();
        if (dataToken !== 1) {
          manejarRespuestaNoAutorizada();

          return;
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
  }, [esCheck]);

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
    <div className="d-flex flex-column min-vh-100" translate="no">
      <ScrollTo />
      <div className="py-4 d-md-block d-none">
        <BienvenidoPanelAsesores datos={datosInicio} />
      </div>
      <div className="py-4 d-block d-md-none">
        <BienvenidoPanelAsesoresCelular datos={datosInicio} />
      </div>
      <div>
        <TituloPagina title="Visitas" />
      </div>
      {showModalNotificaciones && (
        <PopUpNotificacionesGenerico translate="no" onClose={handleClose} />
      )}
      <div>
        <ContenidoCheck
          isCheckedActive={isCheckedActive}
          estadoCheck={estadoCheck}
        />
      </div>
      <div className="py-2">
        <MapComponent2 />
      </div>
      <section className="d-flex flex-wrap justify-content-between container">
        <article className="container py-4">
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
        <TablaAsesorCheckLocal checkList={checkList} />
      </div>

      <div className="py-4 mt-auto">
        <Footer />
      </div>
    </div>
  );
};

export default CheckInAsesores;
