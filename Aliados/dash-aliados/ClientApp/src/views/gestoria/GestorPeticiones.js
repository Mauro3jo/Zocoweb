// import context
import { DarkModeContext } from "../../context/DarkModeContext";

// import librerias
import { useNavigate } from "react-router-dom";
import Swal from "sweetalert2";


// assets logo de carpeta img
import logo from "../../assets/img/logo.png";
import BienvenidoPanelGestor from "../../components/gestorComp/BienvenidoPanelGestor";
import BienvenidoPanelGestorCelular from "../../components/gestorComp/BienvenidoPanelGestorCelular";
import TituloPagina from "../../components/TituloPagina";
import ContenidoPeticionesGestor from "../../components/gestorComp/ContenidoPeticionesGestor";
import { useContext, useEffect } from "react";
import Footer from "../../components/Footer";

const GestorPeticiones = () => {
 // context para el modo oscuro
 const { darkMode } = useContext(DarkModeContext);
   // url de la api
   const apiUrlToken = process.env.REACT_APP_API_TOKEN;

  // hook para la navegacion
  const navegacion = useNavigate();

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

        if (data !== 6 ) {
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

const recargarPagina = () => {
  window.location.reload();
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
        <TituloPagina title="Peticiones" />
      </div>
      <div className="container">
        <ContenidoPeticionesGestor />
      </div>
      <div className="py-4 mt-auto">
        <Footer />
      </div>
    </div>
  );
};

export default GestorPeticiones;
