import React, { useContext, useEffect, useState } from "react";
import BienvenidoPanelAsesores from "../../components/asesoresComp/BienvenidoPanelAsesores";
import BienvenidoPanelAsesoresCelular from "../../components/asesoresComp/BienvenidoPanelAsesoresCelular";
import Swal from "sweetalert2";
import logo from "../../assets/img/logo.png";
import { DarkModeContext } from "../../context/DarkModeContext";
import { useNavigate } from "react-router-dom";
import TituloPagina from "../../components/TituloPagina";
import TablaVisitas from "../../components/asesoresComp/TablaVisitas";
import Footer from "../../components/Footer";

const VisitasAsesores = () => {
  const [datosInicio, setDatosInicio] = useState(null);
  //          "/api/datosinicioasesores/inicioasesores",

  const navegacion = useNavigate();
  const { darkMode } = useContext(DarkModeContext);
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
    <div className="d-flex flex-column min-vh-100" translate="no">
      <div className="py-4 d-md-block d-none">
        <BienvenidoPanelAsesores datos={datosInicio} />
      </div>
      <div className="py-4 d-block d-md-none">
        <BienvenidoPanelAsesoresCelular datos={datosInicio} />
      </div>
      <div>
        <TituloPagina title="Visitas" />
      </div>
      <div>
        <TablaVisitas />
      </div>
      <div className="py-4 mt-auto">
        <Footer />
      </div>
    </div>
  );
};

export default VisitasAsesores;
