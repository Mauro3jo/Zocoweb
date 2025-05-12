// import hooks, librerias y context
import React, { useContext, useEffect, useState } from "react";
import { DarkModeContext } from "../../context/DarkModeContext";
import { useNavigate } from "react-router-dom";
import Swal from "sweetalert2";

// assets de la carpeta img
import logo from "../../assets/img/logo.png";

// import components
import BienvenidoPanelAsesores from "../../components/asesoresComp/BienvenidoPanelAsesores";
import BienvenidoPanelAsesoresCelular from "../../components/asesoresComp/BienvenidoPanelAsesoresCelular";
import TituloPagina from "../../components/TituloPagina";
import CuadroComparativo from "../../components/asesoresComp/CuadroComparativo";
import Footer from "../../components/Footer";
import ScrollTo from "../../components/asesoresComp/ScrollTo";

const CuadroComparativaAsesores = () => {
  // darkmode context para la funcionalidad de claro/oscuro
  const { darkMode } = useContext(DarkModeContext);

  // estado inicial para traer los datos inicio
  const [datosInicio, setDatosInicio] = useState(null);

  // estado de resultado calculadora para entrar en el input
  const [resultadoCalculadora, setResultadoCalculadora] = useState(null);

  // hook para la navegacion
  const navegacion = useNavigate();

  // url api
  const apiUrlToken = process.env.REACT_APP_API_TOKEN;
  const apiUrlDatos = process.env.REACT_APP_INICIO_ASESORES;

  // funcion para obtener el token y verificar los datos
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
    <div className="d-flex flex-column min-vh-100" translate="no">
      <ScrollTo />
      <div className="py-4 d-md-block d-none">
        <BienvenidoPanelAsesores datos={datosInicio} />
      </div>
      <div className="py-4 d-block d-md-none">
        <BienvenidoPanelAsesoresCelular datos={datosInicio} />
      </div>
      <div>
        <TituloPagina title="Simulador" />
      </div>
      <div className="mt-4">
        <CuadroComparativo />
      </div>
      <div className="py-4 mt-auto">
        <Footer />
      </div>
    </div>
  );
};

export default CuadroComparativaAsesores;
