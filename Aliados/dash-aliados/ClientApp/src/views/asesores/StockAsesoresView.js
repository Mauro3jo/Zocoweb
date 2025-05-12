// Import hooks, librerias y context
import React, { useContext, useEffect, useState } from "react";
import { DarkModeContext } from "../../context/DarkModeContext";
import { useNavigate } from "react-router-dom";
import Swal from "sweetalert2";

// assets img logo
import logo from "../../assets/img/logo.png";

// import component
import BienvenidoPanelAsesores from "../../components/asesoresComp/BienvenidoPanelAsesores";
import BienvenidoPanelAsesoresCelular from "../../components/asesoresComp/BienvenidoPanelAsesoresCelular";
import TituloPagina from "../../components/TituloPagina";
import GraficaTerminalEstado from "../../components/asesoresComp/GraficaTerminalEstado";
import TablaStockAsesores from "../../components/asesoresComp/TablaStockAsesores";
import Footer from "../../components/Footer";
import ScrollTo from "../../components/asesoresComp/ScrollTo";

const StockAsesoresView = () => {
  // estado inicial donde se guardan los datos
  // que se solicitan a la base de datos.
  const [datosInicio, setDatosInicio] = useState(null);

  // hook para la navegacion: se emplea en la consulta a la api.
  const navegacion = useNavigate();

  // darkmode contexto para ejecutar la funcionalidad de modo claro/oscuro
  const { darkMode } = useContext(DarkModeContext);

  // url api
  const apiUrlToken = process.env.REACT_APP_API_TOKEN;
  const apiUrlDatos = process.env.REACT_APP_API_BASE_STOCK_ASESORES;

  // Consulta
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
          return; // Salir si la verificaci�n del token fall�
        }

        const dataToken = await respuestaToken.json();
        if (dataToken !== 1) {
          manejarAccesoDenegado();
          return; // Salir si el token no es v�lido
        }

        // Luego, obtener los datos despu�s de la verificaci�n exitosa del token
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
        title: "Sesi�n expirada o token inv�lido.",
        text: "Inicie sesi�n nuevamente.",
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
        <TituloPagina title="Stock" />
      </div>
      <GraficaTerminalEstado datos={datosInicio} />
      <TablaStockAsesores datos={datosInicio} />
      <div className="py-4 mt-auto">
        <Footer />
      </div>
    </div>
  );
};

export default StockAsesoresView;
