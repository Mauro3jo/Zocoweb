// import hooks
import React, { useContext, useEffect, useState } from "react";

// import context
import { DarkModeContext } from "../../context/DarkModeContext";

// import librerias
import Swal from "sweetalert2";
import { useNavigate } from "react-router-dom";

// import componentes
import BienvenidoPanelReclutador from "../../components/reclutamientoComponentes/BienvenidoPanelReclutador";
import TituloPagina from "../../components/TituloPagina";
import Footer from "../../components/Footer";
import ContenidoReclutamientoBusqueda from "../../components/reclutamientoComponentes/ContenidoReclutamientoBusqueda";

// assets logo de carpeta img
import logo from "../../assets/img/logo.png";
import aqui from "../../assets/svg/recuerdoFrontend.jpg";

const ReclutamientoBusqueda = () => {
  // context para el modo oscuro
  const { darkMode } = useContext(DarkModeContext);

  // hook para la navegacion
  const navegacion = useNavigate();

  // funcion para recargar la pagina
  function recargarPagina() {
    window.location.reload();
  }

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

          if (data !== 4) {
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

  // estado local para controlar la visibilidad del div y el botón
  const [showButton, setShowButton] = useState(() => {
    const savedState = localStorage.getItem("showButton");
    return savedState !== null ? JSON.parse(savedState) : true;
  });

  // función para manejar el clic en el botón
  const handleButtonClick = () => {
    setShowButton(false);
    localStorage.setItem("showButton", JSON.stringify(false));
  };
  return (
    <div translate="no" className="d-flex flex-column min-vh-100">
      <div className="pt-5">
        <BienvenidoPanelReclutador />
      </div>
      <div>
        <TituloPagina title="Reclutamiento" />
      </div>
      {/* <div className="container">
        {showButton && (
          <div>
            <a
              className="btn btn-outline-success"
              href={aqui}
              download="recuerdoFrontend.jpg"
              onClick={handleButtonClick}
            >
              un recuerdo del anterior frontend
            </a>
          </div>
        )}
      </div> */}
      <div>
        <ContenidoReclutamientoBusqueda />
      </div>
      <div className="py-4 mt-auto">
        <Footer />
      </div>
    </div>
  );
};

export default ReclutamientoBusqueda;
