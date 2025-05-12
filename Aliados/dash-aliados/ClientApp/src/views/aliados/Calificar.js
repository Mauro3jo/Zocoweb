// import hooks
import React, { useContext, useEffect } from "react";

// import context
import { DarkModeContext } from "../../context/DarkModeContext";
import { DatosInicioContext } from "../../context/DatosInicioContext";

// import componentes
import BienvenidoPanel from "../../components/BienvenidoPanel";
import Footer from "../../components/Footer";
import FormComentarioCalificar from "../../components/FormComentarioCalificar";
import ScrollToTopButton from "../../components/ScrollToTopButton";
import TituloPagina from "../../components/TituloPagina";

// import libreria
import { useNavigate } from "react-router-dom";
import Swal from "sweetalert2";

// import assets
import logo from "../../assets/img/logo.png";

const Calificar = () => {
  // context para extraer el dato codigo respuesta
  const { codigoRespuesta } = useContext(DatosInicioContext);

  // context para la modalidad claro/oscuro
  const { darkMode } = useContext(DarkModeContext);

  // funcion para navegar con el hook
  const navegacion = useNavigate();

  // funcion para recargar la pantalla
  function recargarPagina() {
    window.location.reload();
  }

  // api url para el token
  const apiUrlToken = process.env.REACT_APP_API_TOKEN;

  // use Effect para realizar la consulta para verificar token
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

          if (data !== 0) {
            manejarAccesoDenegado();
          }
        } else {
          if (response.status === 401) {
            manejarRespuestaNoAutorizada();
          } else {
          }
        }
      } catch (error) {}
    };

    // funcion pare redireccionar al home
    const redireccionar = () => {
      navegacion("/");
      recargarPagina();
    };

    // funcion para manejar la respuesta
    // muestra un mensaje por pantalla
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

    // funcion para manejar el acceso denegado
    // muestra un mensaje por pantalla
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

  return (
    <div translate="no">
      <div className="d-xl-block d-none mt-4 pt-4 ">
        <BienvenidoPanel />
      </div>
      <ScrollToTopButton />
      <div className="pt-2">
        <TituloPagina title="Calificar" />
      </div>
      <div className="my-4">
        <FormComentarioCalificar />
      </div>
      <div style={{ paddingBottom: "2rem", paddingTop: "1rem" }}>
        <Footer />
      </div>
    </div>
  );
};

export default Calificar;
