// import hooks
import React, { useContext, useEffect, useState } from "react";

// import context
import { DatosInicioContext } from "../../context/DatosInicioContext";
import { DarkModeContext } from "../../context/DarkModeContext";

// import librerias
import Swal from "sweetalert2";
import { ThreeDots } from "react-loader-spinner";
import { useNavigate } from "react-router-dom";

// import componentes
import BienvenidoPanel from "../../components/BienvenidoPanel";
import DatosAnalisis from "../../components/DatosAnalisis";
import EvolucionMensual3Barras from "../../components/EvolucionMensual3Barras";
import TripleGraficoAnalisis from "../../components/TripleGraficoAnalisis";
import ScrollToTopButton from "../../components/ScrollToTopButton";
import TituloPagina from "../../components/TituloPagina";
import Footer from "../../components/Footer";

// import assets
import logo from "../../assets/img/logo.png";
import logoClaro from "../../assets/img/logo-modo-oscuro.png";

const Analisis = () => {
  // datos extraidos desde el context
  const { datosAnalisisContext, codigoRespuesta } =
    useContext(DatosInicioContext);

  // contexto para la modalidad claro/oscuro
  const { darkMode } = useContext(DarkModeContext);

  // hooks useNavigate para la navegacion
  const navegacion = useNavigate();

  // funcion para recargar la pagina
  function recargarPagina() {
    window.location.reload();
  }

  // url de la api token
  const apiUrlToken = process.env.REACT_APP_API_TOKEN;

  // estado para el spinner de carga
  const [cargando, setCargando] = useState(false);

  //  consulta para verificar token
  useEffect(() => {
    const verificarToken = async () => {
      const token = sessionStorage.getItem("token");

      if (!token) {
        manejarRespuestaNoAutorizada();
        return;
      }
      setCargando(true);
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
      setCargando(false);
    };

    // funcion para redireccionar al home
    const redireccionar = () => {
      navegacion("/");
      recargarPagina();
    };

    // funcion para manera el mensaje de respuesta no autorizada
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

    // funcion para manera el mensaje de acceso denegado
    const manejarAccesoDenegado = () => {
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

    verificarToken();
  }, []);

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
    <div translate="no">
      <div className="d-xl-block d-none mt-4 pt-4 ">
        <BienvenidoPanel />
      </div>
      <ScrollToTopButton />
      <div className="pt-2">
        <TituloPagina title="Análisis" />
      </div>
      <div className="my-3">
        <DatosAnalisis datosBack={datosAnalisisContext} />
      </div>
      <EvolucionMensual3Barras datosBack={datosAnalisisContext} />
      <TripleGraficoAnalisis datosBack={datosAnalisisContext} />
      <div className="py-4">
        <Footer />
      </div>
    </div>
  );
};

export default Analisis;
