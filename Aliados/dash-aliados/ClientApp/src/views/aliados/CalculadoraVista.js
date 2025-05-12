import React, { useContext, useEffect, useState } from "react";
import CalculadoraNueva from "../../components/CalculadoraNueva";
import BienvenidoPanel from "../../components/BienvenidoPanel";
import { DatosInicioContext } from "../../context/DatosInicioContext";
import Footer from "../../components/Footer";
import CalculadoraNuevaCelular from "../../components/CalculadoraNuevaCelular";
import TituloPagina from "../../components/TituloPagina";
import CalculadoraPlazos from "../../components/CalculadoraPlazos";
import PaymentTable from "../../components/PaymentTable";
import CalculadoraPlazosCelular from "../../components/CalculadoraPlazosCelular";
import { DarkModeContext } from "../../context/DarkModeContext";

// import assets
import logo from "../../assets/img/logo.png";
import logoClaro from "../../assets/img/logo-modo-oscuro.png";
import { useNavigate } from "react-router-dom";
import Swal from "sweetalert2";
import { ThreeDots } from "react-loader-spinner";


const CalculadoraVista = () => {
  const { datosBackContext } = useContext(DatosInicioContext);
  const [showPlazoCalculator, setShowPlazoCalculator] = useState(true);
  const [showMontoCalculator, setShowMontoCalculator] = useState(false);

  const handlePlazoClick = () => {
    setShowPlazoCalculator(true);
    setShowMontoCalculator(false);
  };

  const handleMontoClick = () => {
    setShowMontoCalculator(true);
    setShowPlazoCalculator(false);
  };

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
    <div translate="no" className="d-flex flex-column min-vh-100">
      <div className="d-xl-block d-none mt-4 pt-4">
        <BienvenidoPanel translate="no" datos={datosBackContext} />
      </div>
      <div className="pt-2">
        <TituloPagina translate="no" title="Simulador" />
      </div>
      <article className="d-xl-block d-none">
        <section className="d-flex justify-content-center py-2 ">
          <div className="mx-3">
            <button
              d-none
              className={
                showPlazoCalculator
                  ? " btn-simulador-desactivado px-5"
                  : " btn-simulador-activado px-5"
              }
              onClick={handlePlazoClick}
            >
              Simulador de Plazos
            </button>
          </div>
          <div className="mx-3">
            <button
              className={
                showMontoCalculator
                  ? " btn-simulador-desactivado px-5"
                  : " btn-simulador-activado  px-5"
              }
              onClick={handleMontoClick}
            >
              Simulador de monto
            </button>
          </div>
        </section>
      </article>
      <article className="d-block d-xl-none">
        <section className="d-flex justify-content-center py-2 ">
          <div className="mx-3">
            <button
              className={
                showPlazoCalculator
                  ? " btn-simulador-desactivado  px-3"
                  : "btn-simulador-activado px-3"
              }
              onClick={handlePlazoClick}
            >
              Sim. Plazos
            </button>
          </div>
          <div className="mx-3">
            <button
              className={
                showMontoCalculator
                  ? "btn-simulador-desactivado   px-3"
                  : " btn-simulador-activado  px-3"
              }
              onClick={handleMontoClick}
            >
              Sim. Monto
            </button>
          </div>
        </section>
      </article>
      {showPlazoCalculator && (
        <>
          <div className="pt-2 d-xl-block d-none">
            <CalculadoraPlazos />
          </div>
          <div className="pt-2 d-block d-xl-none">
            <CalculadoraPlazosCelular />
          </div>
          <div className=" container">
            <PaymentTable />
          </div>
        </>
      )}
      {showMontoCalculator && (
        <>
          <div className="py-4 d-xl-block d-none">
            <CalculadoraNueva />
          </div>
          <div className="py-4 d-block d-xl-none">
            <CalculadoraNuevaCelular />
          </div>
        </>
      )}
      <div className="py-4 mt-auto">
        <Footer />
      </div>
    </div>
  );
};

export default CalculadoraVista;
