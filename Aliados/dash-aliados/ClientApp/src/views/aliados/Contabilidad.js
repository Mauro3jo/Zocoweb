// import hooks
import React, { useContext, useEffect, useState } from "react";

// import context
import { DatosInicioContext } from "../../context/DatosInicioContext";
import { DarkModeContext } from "../../context/DarkModeContext";

// import libreria
import { useNavigate } from "react-router-dom";
import Swal from "sweetalert2";
import { ThreeDots } from "react-loader-spinner";

// import components
import BienvenidoPanel from "../../components/BienvenidoPanel";
import Footer from "../../components/Footer";
import DatosContabilidad from "../../components/DatosContabilidad";
import ImpuestosCards from "../../components/ImpuestosCards";
import ScrollToTopButton from "../../components/ScrollToTopButton";
import TituloPagina from "../../components/TituloPagina";
import Impuesto2Cards from "../../components/Impuesto2Cards";
import TablaVencimientoContabilidad from "../../components/TablaVencimientoContabilidad";

// import assets
import logo from "../../assets/img/logo.png";
import logoClaro from "../../assets/img/logo-modo-oscuro.png";
import TablaContabilidadArchivos from "../../components/TablaContabilidadArchivos";

const Contabilidad = () => {
  // context para traer los datos de contabilidad
  const { datosContabilidadContext } = useContext(DatosInicioContext);

  // estado para guardar los datos de contabilidad
  const [contabilidad, setdatoscontabilidad] = useState([]);

  // context para la funcionalidad
  const { darkMode } = useContext(DarkModeContext);

  // hook useNavigate
  const navegacion = useNavigate();

  // funcion recargar la pagina
  function recargarPagina() {
    window.location.reload();
  }

  // api url
  const apiUrlToken = process.env.REACT_APP_API_TOKEN;
  const apiUrlTasa = process.env.REACT_APP_API_TASA;

  // estado para manejar el cargando
  const [cargando, setCargando] = useState(false);

  // consulta para verificar el token
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

          if (data === 0) {
         /*   obtenerTasaInteres();*/
          } else {
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

    // funcion para redireccionar
    const redireccionar = () => {
      navegacion("/");
      recargarPagina();
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
        <TituloPagina title="Contabilidad" />
      </div>
      <div className="my-3">
        <DatosContabilidad datosBack={datosContabilidadContext} />
      </div>
      <section className="d-lg-block d-none">
        <div className="py-5">
          <Impuesto2Cards datosBack={datosContabilidadContext} />
        </div>
      </section>
      <section className="d-block d-lg-none">
        <div className="py-5">
          <ImpuestosCards
            datosBack={datosContabilidadContext}
            DatosTasa={contabilidad}
          />
        </div>
      </section>
      <section className="container">
        <div className="row">
          <article className="col-lg-6 col-12">
            <div className="py-4">
              <TablaContabilidadArchivos />
            </div>
          </article>
          <article className="col-lg-6 col-12">
            <div className="py-4">
              <TablaVencimientoContabilidad />
            </div>
          </article>
        </div>
      </section>
      <div className="py-4">
        <Footer />
      </div>
    </div>
  );
};

export default Contabilidad;
