// Import hooks
import React, { useContext, useEffect, useState } from "react";

// import context
import { DatosInicioContext } from "../../context/DatosInicioContext";
import { DarkModeContext } from "../../context/DarkModeContext";

// import libreria
import { useNavigate } from "react-router-dom";
import Swal from "sweetalert2";
import { ThreeDots } from "react-loader-spinner";

// import components
import BienvenidoPanel from "../../components/BienvenidoPanel";
import ScrollToTopButton from "../../components/ScrollToTopButton";
import TituloPagina from "../../components/TituloPagina";
import Footer from "../../components/Footer";

// import assets
import logo from "../../assets/img/logo.png";
import logoClaro from "../../assets/img/logo-modo-oscuro.png";
import ContenidoConsultasAliados from "../../components/ContenidoConsultasAliados";

const Consultas = () => {
  // context para el modo claro/oscuro
  const { darkMode } = useContext(DarkModeContext);

  // de aqui saca los datos del context
  const { datosBackContext, codigoRespuesta, noHayDatos } =
    useContext(DatosInicioContext);

  // funcion para navegar con el hook useNavigate
  const navegacion = useNavigate();

  // estado para calificar
  const [estadoCalifico, setEstadoCalifico] = useState(null);
  const [showModalNotificaciones, setShowModalNotificaciones] = useState(true); // Estado para mostrar/ocultar el modal
  const handleClose = () => {
    setShowModalNotificaciones(false); // Función para cerrar el modal
  };

  // url de las apis
  const apiUrlToken = process.env.REACT_APP_API_TOKEN;
  const apiUrlCalificoMes = "/api/comanda/CrearComanada";

  // estado para manejar el spinner de carga
  const [cargando, setCargando] = useState(false);

  // estado para el contador
  const [contadorModal, setContadorModal] = useState(0);

  // consulta a la base de datos para verificar el token y la autenticacion
  useEffect(() => {
    const verificarToken = async () => {
      const token = sessionStorage.getItem("token");
      setCargando(true);
      try {
        if (!token) {
          manejarRespuestaNoAutorizada();
          return;
        }

        const response = await fetch(apiUrlToken, {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ Token: token }),
        });

        if (!response.ok) {
          manejarRespuestaNoAutorizada();
          return;
        }

        const data = await response.json();

        if (data === 0) {
          obtenerCalifico(token);
        } else {
          manejarAccesoDenegado();
        }
        setCargando(false);
      } catch (error) {}
      modalEmergente();
    };

    // este es el modal emergente para calificar una vez al mes
    const modalEmergente = () => {
      if (noHayDatos === false) {
        // Después de cargar los datos, verifica si hay datos disponibles

        // Aquí asumimos que 'datosBackContext' es el estado que contiene los datos
        Swal.fire({
          text: "Actualmente no hay datos disponibles para mostrar en el panel.",
          imageUrl: logo,
          imageWidth: 100,
          imageHeight: 30,
          imageAlt: "Logo",
          confirmButtonText: "Ok",
          timer: 12000,
          allowOutsideClick: true,
          customClass: {
            container: darkMode
              ? "swal2-container--dark--popup"
              : "swal2-container--light--popup",
            confirmButton: "my-swal-button",
          },
        });
      }
    };

    // funcion para redireccionar
    const redireccionar = () => {
      navegacion("/");
      recargarPagina();
    };

    // funcion para recargar la pagina
    function recargarPagina() {
      window.location.reload();
    }

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

    // funcion para obtener la calificacion
    const obtenerCalifico = async (token) => {
      try {
        const response = await fetch(apiUrlCalificoMes, {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ Token: token }),
        });

        if (response.ok) {
          const resultadoCalifico = await response.json();
          setEstadoCalifico(resultadoCalifico);
        } else {
        }
      } catch (error) {}
    };
    verificarToken();
    setContadorModal(contadorModal + 1);
  }, [noHayDatos]);

  if (cargando) {
    // Muestra el spinner mientras los datos se están cargando
    return (
      <div
        className="spinner-container"
        style={{
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
          height: "100vh",
        }}
      >
        <div className="">
          <div>
            <img
              className="img-fluid logo-width-spinner"
              src={darkMode ? logoClaro : logo}
              alt="logo SOCO"
            />
          </div>
          <div className="ms-3">
            <ThreeDots
              visible={true}
              height="60"
              width="60"
              color="#b4c400 "
              radius="9"
              ariaLabel="three-dots-loading"
              wrapperStyle={{}}
              wrapperClass=""
            />
          </div>
        </div>
      </div>
    );
  }

  return (
    <div translate="no" className="d-flex flex-column min-vh-100">
      <div className="d-xl-block d-none mt-4 pt-4 ">
        <BienvenidoPanel translate="no" datos={datosBackContext} />
      </div>
      <ScrollToTopButton translate="no" />
      <div className="pt-2">
        <TituloPagina translate="no" title="Consultas" />
      </div>
      <div translate="no" className="pt-2">
        <ContenidoConsultasAliados />
      </div>
      <div translate="no" className="py-4 mt-auto">
        <Footer />
      </div>
    </div>
  );
};

export default Consultas;
