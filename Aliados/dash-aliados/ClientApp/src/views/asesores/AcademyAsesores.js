// import hooks
import React, { useContext, useEffect, useState } from "react";

// import context
import { DarkModeContext } from "../../context/DarkModeContext";

// librerias
import Swal from "sweetalert2";
import { useNavigate } from "react-router-dom";

// assets
import logo from "../../assets/img/logo.png";

// import components
import BienvenidoPanelAsesores from "../../components/asesoresComp/BienvenidoPanelAsesores";
import BienvenidoPanelAsesoresCelular from "../../components/asesoresComp/BienvenidoPanelAsesoresCelular";
import ContenidoAcademy from "../../components/asesoresComp/ContenidoAcademy";
import TituloPagina from "../../components/TituloPagina";
import Footer from "../../components/Footer";
import ScrollTo from "../../components/asesoresComp/ScrollTo";

const AcademyAsesores = () => {
  // estado para los datos iniciales
  const [datosInicio, setDatosInicio] = useState(null);

  // hook del useNavigate()
  const navegacion = useNavigate();

  // context darkMode para la funcionalidad claro/oscuro.
  const { darkMode } = useContext(DarkModeContext);

  // Api Url
  const apiUrlToken = process.env.REACT_APP_API_TOKEN;
  const apiUrlDatos = process.env.REACT_APP_API_INICIO_ASESORES;

  // consulta para verificar los datos token
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
    <div translate="no" className="d-flex flex-column min-vh-100">
      <ScrollTo />
      <div className="py-4 d-md-block d-none">
        <BienvenidoPanelAsesores datos={datosInicio} />
      </div>
      <div className="py-4 d-block d-md-none">
        <BienvenidoPanelAsesoresCelular datos={datosInicio} />
      </div>
      <div>
        <TituloPagina title="Academy" />
      </div>
      <div>
        <ContenidoAcademy />
      </div>
      <div className="py-4 mt-auto">
        <Footer />
      </div>
    </div>
  );
};

export default AcademyAsesores;
