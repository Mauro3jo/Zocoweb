import React, {useEffect, useState, useContext} from 'react'
import FooterLogin from "../../components/FooterLogin";
import ContenidoInicio from '../../components/postulantes/ContenidoInicio';
import { DarkModeContext } from "../../context/DarkModeContext";
import './PostulanteInicio.css'

// import librerias
import Swal from "sweetalert2";
import { useNavigate } from "react-router-dom";
import logo from "../../assets/img/logo.png";
import Footer from '../../components/Footer';
import Headlanding from '../../components/postulantes/HeadLanding';

const InicioPostulante = () => {
  const { darkMode } = useContext(DarkModeContext);

  // hook para la navegacion
  const navegacion = useNavigate();

  // funcion para recargar la pagina
  function recargarPagina() {
    window.location.reload();
  }

  // url de la api
  const apiUrlToken = process.env.REACT_APP_API_TOKEN;

  //useEffect(() => {
  //  const verificarToken = async () => {
  //    const token = sessionStorage.getItem("token");

  //    if (!token) {
  //      manejarRespuestaNoAutorizada();
  //      return;
  //    }

  //    try {
  //      const response = await fetch(apiUrlToken, {
  //        method: "POST",
  //        headers: {
  //          "Content-Type": "application/json",
  //        },
  //        body: JSON.stringify({ Token: token }),
  //      });

  //      if (response.ok) {
  //        const data = await response.json();

  //        if (data !== 9) {
  //          manejarAccesoDenegado();
  //        }
  //      } else {
  //        if (response.status === 401) {
  //          manejarRespuestaNoAutorizada();
  //        } else {
  //          throw new Error("Respuesta no satisfactoria del servidor");
  //        }
  //      }
  //    } catch (error) {
  //      console.error("Error al validar el token", error);
  //    }
  //  };

  //  const redireccionar = () => {
  //    navegacion("/");
  //    // recargarPagina();
  //  };

  //  const manejarRespuestaNoAutorizada = () => {
  //    sessionStorage.removeItem("token"); // Eliminar el token

  //    Swal.fire({
  //      title: "Sesión expirada o token inválido.",
  //      text: "Inicie sesión nuevamente.",
  //      imageUrl: logo,
  //      imageWidth: 100,
  //      imageHeight: 30,
  //      imageAlt: "Logo",
  //      confirmButtonText: "Ok",
  //      timer: 5000,
  //      allowOutsideClick: true,
  //      customClass: {
  //        container: darkMode
  //          ? "swal2-container--dark"
  //          : "swal2-container--light",
  //        confirmButton: "my-swal-button",
  //      },
  //    }).then(redireccionar);
  //  };

  //  const manejarAccesoDenegado = () => {
  //    Swal.fire({
  //      title: "Acceso denegado.",
  //      text: "No tiene permisos para acceder.",
  //      imageUrl: logo,
  //      imageWidth: 100,
  //      imageHeight: 30,
  //      imageAlt: "Logo",
  //      confirmButtonText: "Ok",
  //      timer: 5000,
  //      allowOutsideClick: true,
  //      customClass: {
  //        container: darkMode
  //          ? "swal2-container--dark"
  //          : "swal2-container--light",
  //        confirmButton: "my-swal-button",
  //      },
  //    }).then(redireccionar);
  //  };

  //  verificarToken();
  //}, []);


  return (
    <section  >
      <div className='header'>
        <Headlanding/>

      </div>
        
            <div className="main-content" translate="no">
            <ContenidoInicio/>
            </div>
            
        
        {/* <div className="d-flex justify-content-center" >
        <FooterLogin />
      </div> */}
      {/* <div className='footer'>
        <Footer/>
      </div> */}

    </section>
  )
}

export default InicioPostulante