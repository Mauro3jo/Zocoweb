// hooks, context y librerias.
import React, { useContext, useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import Swal from "sweetalert2";
import { DarkModeContext } from "../../context/DarkModeContext";

// assets
import logo from "../../assets/img/logo.png";

// Components que hago el import desde la carpeta asesoresComp
import BienvenidoPanelAsesores from "../../components/asesoresComp/BienvenidoPanelAsesores";
import BienvenidoPanelAsesoresCelular from "../../components/asesoresComp/BienvenidoPanelAsesoresCelular";
import TituloPagina from "../../components/TituloPagina";
import DatosInicioAsesores from "../../components/asesoresComp/DatosInicioAsesores";
import FacturacionRubro from "../../components/asesoresComp/FacturacionRubro";
import ComportamientoVentasAsesores from "../../components/asesoresComp/ComportamientoVentasAsesores";
import FacturacionPagoActivasBajas from "../../components/asesoresComp/FacturacionPagoActivasBajas";
import Footer from "../../components/Footer";
import ScrollTo from "../../components/asesoresComp/ScrollTo";

const InicioAsesores = () => {
  // context para que se aplique el modo oscuro.
  const { darkMode } = useContext(DarkModeContext);

  // state inicial donde se cargan todos los datos de la consulta a la api
  const [datosInicio, setDatosInicio] = useState(null);

  // hook para efectuar la navegacion en la consulta a la api
  const navegacion = useNavigate();

  // API CONSULTA
  const apiUrlToken = process.env.REACT_APP_API_TOKEN;
  const apiUrlDatos = process.env.REACT_APP_API_INICIO_ASESORES;

  // CONSULTA A LA API
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
       <ScrollTo />
      <div className="py-4 d-md-block d-none">
        <BienvenidoPanelAsesores  />
      </div>
      <div className="py-4 d-block d-md-none">
        <BienvenidoPanelAsesoresCelular  />
      </div>
      <div>
        <TituloPagina title="Inicio" />
      </div>
      <div>
        <DatosInicioAsesores datos={datosInicio} />
      </div>
      <FacturacionRubro datos={datosInicio} />
      <ComportamientoVentasAsesores datos={datosInicio} />
      <FacturacionPagoActivasBajas datos={datosInicio} />
      <div className="py-4 mt-auto">
        <Footer />
      </div>
    </div>
  );
};

export default InicioAsesores;
