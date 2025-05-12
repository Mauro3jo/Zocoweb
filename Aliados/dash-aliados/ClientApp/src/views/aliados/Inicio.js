// Import hooks
import React, { useContext, useEffect, useState } from "react";

// import context
import { DatosInicioContext } from "../../context/DatosInicioContext";
import { InicioAhorroContext } from "../../context/InicioAhorroContext";

import { DarkModeContext } from "../../context/DarkModeContext";

// import libreria
import { useNavigate } from "react-router-dom";
import Swal from "sweetalert2";
import { ThreeDots } from "react-loader-spinner";

// import components
import BienvenidoPanel from "../../components/BienvenidoPanel";
import DatosInicio from "../../components/DatosInicio";
import GraficaData from "../../components/GraficaData";
import GraficaDataCelular from "../../components/GraficaDataCelular";
import GraficaDataCelularDark from "../../components/GraficaDataCelularDark";
import ComportamientoGrafica from "../../components/ComportamientoGrafica";
import ScrollToTopButton from "../../components/ScrollToTopButton";
import TituloPagina from "../../components/TituloPagina";
import TituloPaginaAhorro from "../../components/TituloPaginaAhorro";

import Footer from "../../components/Footer";
import PopUpCalificar from "../../components/PopUpCalificar";

// import assets
import logo from "../../assets/img/logo.png";
import logoClaro from "../../assets/img/logo-modo-oscuro.png";
import PopUpNotificaciones from "../../components/PopUpNotificaciones";
import PopUpNotificaciones2 from "../../components/PopUpNotificaciones2";
import PopUpNotificacionesCarousel from "../../components/PopUpNotificacionesCarousel";
import PopUpPrueba from "../../components/ZocoConect/PopUpPrueba";
import PopUpCarrousel from "../../components/PopUpCarrousel";
import PopUpNotificaciones3 from "../../components/PopUpNotificaciones3";
import PopUpFiestas from "../../components/PopUpFiestas";

import logonx from "../../assets/img/logonx.png";
import logopayway from "../../assets/img/logopayway.png"; 
import logoviumi from "../../assets/img/logoviumi.png";
import logomercadopago from "../../assets/img/MercadoPago.png";
import logozoco from "../../assets/img/Zoco.png";
const apiUrlZocoResumen = "/api/calidad/zocoresumen";
const apiUrlDemo = "/api/token/demo";

const Inicio = ({ califico, setCalifico }) => {
  // context para el modo claro/oscuro
  const { darkMode } = useContext(DarkModeContext);

  // de aqui saca los datos del context
  const { datosBackContext, codigoRespuesta, noHayDatos } =
        useContext(DatosInicioContext);

    const {
        ahorroMercadoPago,
        ahorroPayway,
        porcentajeAhorroMercadoPago,
        porcentajeAhorroPayway,
        ahorroNaranjaX,
        porcentajeAhorroNaranjaX,
        ahorroGetnet,
        porcentajeAhorroGetnet,
        ahorroViumi,
        porcentajeAhorroViumi,
        netoZoco,
        ahorroNave, // Nuevo
        porcentajeAhorroNave, // Nuevo
    } = useContext(InicioAhorroContext);

 
    const [isAuthorized, setIsAuthorized] = useState(false);

    // Llamada a la API para validar el token
    const validarTokenDemo = async () => {
        try {
            const token = sessionStorage.getItem("token");
            if (!token) {
                setIsAuthorized(false); // No token, no autorizado
                return;
            }

            const response = await fetch(apiUrlDemo, {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ Token: token }),
            });

            if (response.status === 200) {
                setIsAuthorized(true); // Token válido
            } else {
                setIsAuthorized(false); // Token inválido o error
            }
        } catch (error) {
            console.error("Error en la API:", error);
            setIsAuthorized(false); // Manejar errores
        }
    };

    // Llamar a la función validarTokenDemo al cargar el componente
    useEffect(() => {
        validarTokenDemo();
    }, []);
    // funcion para navegar con el hook useNavigate
  const navegacion = useNavigate();

  // estado para calificar
  const [estadoCalifico, setEstadoCalifico] = useState(null);
    // Estado para guardar los datos del PopUp y controlar su visibilidad
    const [dataPopUp, setDataPopUp] = useState(null);
    const [mostrarPopUpPrueba, setMostrarPopUpPrueba] = useState(false);
    const handleClose = () => {
      const hoy = new Date().toISOString().slice(0, 10);
      localStorage.setItem("fechaUltimoPopup", hoy); // Guardar hoy como la última fecha de visualización
      setShowModalNotificaciones(false);
      // localStorage.setItem("ultimaFechaPopUpPrueba", hoy)
      // setMostrarPopUpPrueba(false)

      //if (dataPopUp && dataPopUp.length > 0) {
        //setMostrarPopUpPrueba(true); // Si hay datos, mostrar el PopUp de prueba
        //localStorage.setItem("ultimaFechaPopUpPrueba", hoy);
      //} else {
        //setShowModalNotificaciones2(true); // Si no hay datos, mostrar el otro modal
      //}
      
      // setMostrarPopUpPrueba(false)
  
      // setShowModalNotificaciones2(!showModalNotificaciones2)
    };

    const handleClosePopUpPrueba=()=>{
      const hoy = new Date().toISOString().slice(0, 10);
      localStorage.setItem("ultimaFechaPopUpPrueba", hoy)
      setMostrarPopUpPrueba(false)
    }
    const handleClosePopUpNotificaciones3=()=>{
      setShowModalNotificaciones2(false)
    }
    // Función para consultar ZocoResumen
    const consultarZocoResumen = async (token) => {
      try {
        const response = await fetch(apiUrlZocoResumen, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ Token: token }),
        });
    
        if (!response.ok) {
          // Manejo de respuestas con estado de error
          const errorText = await response.text(); // Leer respuesta como texto
          console.error("Error en la API:", response.status, response.statusText, errorText);
          return;
        }
    
        const contentType = response.headers.get("content-type");
        if (contentType && contentType.includes("application/json")) {
          const data = await response.json();
         /* console.log("Respuesta de la API:", data);*/
    
          if (Array.isArray(data) && data.length > 0) {
            setDataPopUp(data); // Guardar datos para el PopUp
            const hoy = new Date().toISOString().slice(0, 10);
            const ultimaFecha = localStorage.getItem("ultimaFechaPopUpPrueba");
  

            if (ultimaFecha !== hoy) { //FUNCION ORIGINAL
            //if (ultimaFecha === hoy) {
               setMostrarPopUpPrueba(true); // Mostrar el popup solo si no se mostró hoy
              // console.log("El PopUpPrueba ya fue mostrado hoy.");
            } 
            else {
              console.log("El PopUpPrueba ya fue mostrado hoy.");
            }
          } else {
            console.warn("La API devolvió un arreglo vacío o datos no válidos.");
          }
          const text = await response.text();
          console.warn("Respuesta no JSON recibida:", text);
        }
      } catch (error) {
        console.error("Error al consultar ZocoResumen:", error);
      }
    };

    // Llamar a consultarZocoResumen dentro de useEffect
    useEffect(() => {
      const token = sessionStorage.getItem("token");
     /* console.log("Token:", token);*/
      if (token) {
          consultarZocoResumen(token);
      } else {
          console.warn("Token not found in sessionStorage.");
      }
  }, []);

  // si modificas las fechas aqui dispara el modal pop up notificaciones
  // IMPORTANTE: respeta ese formato
  const fechasEspecificas = [
   
      "2025-01-31",
      "2025-02-01",
      "2025-02-02",
      "2025-02-03",
      "2025-02-28",
      "2025-03-01",
      "2025-03-02",
      "2025-03-03",
      "2025-03-04",
      "2025-03-19",
      "2025-03-21",
      "2025-03-22",
      "2025-03-23",
      "2025-03-24",
      "2025-04-01",
      "2025-04-02",
      "2025-04-03",
      "2025-04-16",

      "2025-04-17",
      "2025-04-18",
  ];
   
  const [showModalNotificaciones, setShowModalNotificaciones] = useState(() => {
    const hoy = new Date().toISOString().slice(0, 10); // Formato 'YYYY-MM-DD'
    const fechaUltimoPopup = localStorage.getItem("fechaUltimoPopup");

    if (fechasEspecificas.includes(hoy) && fechaUltimoPopup !== hoy) {
      return true; // Mostrar si hoy está en las fechas especificadas y no se mostró hoy
    }
    return false; // No mostrar si hoy no está en las fechas o ya se mostró
  });
  const [showModalNotificaciones2, setShowModalNotificaciones2] = useState(false)

  
  // funcion para recargar la pagina al realizar la consulta
  // lo usamos para actualizar la pagina.
  function recargarPagina() {
    window.location.reload();
  }

  // url de las apis
  const apiUrlToken = process.env.REACT_APP_API_TOKEN;
  const apiUrlCalificoMes = process.env.REACT_APP_API_CALIFICO_MES;

  // estado para manejar el spinner de carga
  const [cargando, setCargando] = useState(false);

  // estado para el contador
  const [contadorModal, setContadorModal] = useState(0);

  // consulta a la base de datos para verificar el token y la autenticacion
  useEffect(() => {
    const verificarToken = async () => {
      const token = sessionStorage.getItem("token");
      setCargando(true);
      try {
        if (!token) {
          manejarRespuestaNoAutorizada();
          return;
        }

        const response = await fetch(apiUrlToken, {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ Token: token }),
        });

        if (!response.ok) {
          manejarRespuestaNoAutorizada();
          return;
        }

        const data = await response.json();

        if (data === 0) {
          obtenerCalifico(token);
        } else {
          manejarAccesoDenegado();
        }
        setCargando(false);
      } catch (error) {}
      modalEmergente();
    };

    // este es el modal emergente para calificar una vez al mes
    const modalEmergente = () => {
      if (noHayDatos === false) {
        // Después de cargar los datos, verifica si hay datos disponibles

        // Aquí asumimos que 'datosBackContext' es el estado que contiene los datos
        Swal.fire({
          text: "Actualmente no hay datos disponibles para mostrar en el panel.",
          imageUrl: logo,
          imageWidth: 100,
          imageHeight: 30,
          imageAlt: "Logo",
          confirmButtonText: "Ok",
          timer: 12000,
          allowOutsideClick: true,
          customClass: {
            container: darkMode
              ? "swal2-container--dark--popup"
              : "swal2-container--light--popup",
            confirmButton: "my-swal-button",
          },
        });
      }
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

    // funcion para obtener la calificacion
    const obtenerCalifico = async (token) => {
      try {
        const response = await fetch(apiUrlCalificoMes, {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ Token: token }),
        });

        if (response.ok) {
          const resultadoCalifico = await response.json();
          setEstadoCalifico(resultadoCalifico);
        } else {
        }
      } catch (error) {}
    };
    verificarToken();
    setContadorModal(contadorModal + 1);
  }, [noHayDatos]);

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
  const today = new Date();
  const isChristmas = today.getDate() === 1 && today.getMonth() === 0; 
  return (
    <div>
      <div className="d-xl-block d-none mt-4 pt-4 ">
        <BienvenidoPanel translate="no" datos={datosBackContext} />
      </div>
      <ScrollToTopButton translate="no" />
          <div>
              {isAuthorized ? (
                  // Mostrar este bloque si el token es válido (200)
                  <div className="pt-2">
                      <TituloPaginaAhorro
                          ahorroMercadoPago={ahorroMercadoPago}
                          porcentajeAhorroMercadoPago={porcentajeAhorroMercadoPago}
                          ahorroPayway={ahorroPayway}
                          porcentajeAhorroPayway={porcentajeAhorroPayway}
                          ahorroNaranjaX={ahorroNaranjaX}
                          porcentajeAhorroNaranjaX={porcentajeAhorroNaranjaX}
                          ahorroGetnet={ahorroGetnet}
                          porcentajeAhorroGetnet={porcentajeAhorroGetnet}
                          ahorroViumi={ahorroViumi}
                          porcentajeAhorroViumi={porcentajeAhorroViumi}
                          netoZoco={netoZoco}
                          ahorroNave={ahorroNave} // Nuevo
                          porcentajeAhorroNave={porcentajeAhorroNave} // Nuevo
                      />
                  </div>
              ) : (
                  // Mostrar este bloque si el token no es válido (404, 401, etc.)
                  <div className="pt-2">
                          {/*    <TituloPagina translate="no" title="Inicio" />*/}
                          <TituloPaginaAhorro
                              ahorroMercadoPago={ahorroMercadoPago}
                              porcentajeAhorroMercadoPago={porcentajeAhorroMercadoPago}
                              ahorroPayway={ahorroPayway}
                              porcentajeAhorroPayway={porcentajeAhorroPayway}
                              ahorroNaranjaX={ahorroNaranjaX}
                              porcentajeAhorroNaranjaX={porcentajeAhorroNaranjaX}
                              ahorroGetnet={ahorroGetnet}
                              porcentajeAhorroGetnet={porcentajeAhorroGetnet}
                              ahorroViumi={ahorroViumi}
                              porcentajeAhorroViumi={porcentajeAhorroViumi}
                              netoZoco={netoZoco}
                              ahorroNave={ahorroNave} // Nuevo
                              porcentajeAhorroNave={porcentajeAhorroNave} // Nuevo
                          />
                  </div>
              )}
          </div>

      <div className="my-3">
        <DatosInicio translate="no" datos={datosBackContext} />
      </div>
      {/* aqui se utiliza el estado califico  */}
      {/* la idea es que este popUp sale una vez al mes  */}
      {/* cuando el estado de calificar esta en false  */}
      <article>
        {estadoCalifico === false && (
          <>
            <PopUpCalificar
              translate="no"
              califico={califico}
              setCalifico={setCalifico}
            />
          </>
        )}
      </article>
      <div>
        {/* MODAL NOTIFICACION SIMPLE Y MODAL CON CAROUSEL */}
        {/* {isChristmas && showModalNotificaciones &&  */}
        {showModalNotificaciones &&
        (
        // <PopUpFiestas translate="no" onClose={handleClose} />
        <PopUpNotificaciones translate="no" onClose={handleClose} />
      )}
      {/* */}
      {/* Mostrar PopUpNotificaciones en cualquier otra fecha */}
      {/* {showModalNotificaciones &&  */}
      {/* {!isChristmas && showModalNotificaciones && (
        <PopUpNotificaciones translate="no" onClose={handleClose} />
      )} */}
          {/* MODAL NOTIFICACION CON ANIMACIONESL */}
        {/* {showModalNotificaciones && (
      <PopUpNotificaciones2 translate="no" onClose={handleClose} />
    )} */}
      </div>
       <div>
        {/* {showModalNotificaciones2 &&( */}
          {mostrarPopUpPrueba &&(
           <PopUpPrueba translate="no" onClose={handleClosePopUpPrueba} data={dataPopUp}/>
          /* <PopUpNotificaciones3 translate="no" onClose={handleClose}/> */
        )}
      </div> 
      <div>
      {showModalNotificaciones2 &&(
          <PopUpNotificaciones3 translate="no" onClose={handleClosePopUpNotificaciones3}/>
        )}
      </div>
      <div className="pb-4">
        <ComportamientoGrafica translate="no" datos={datosBackContext} />
      </div>
      <div className="d-none d-xl-block">
        <GraficaData translate="no" datos={datosBackContext} />
      </div>
      <div className="d-xl-none d-block">
        {darkMode ? (
          <GraficaDataCelularDark translate="no" datos={datosBackContext} />
        ) : (
          <GraficaDataCelular translate="no" datos={datosBackContext} />
        )}
      </div>
      <div className="py-4">
        <Footer translate="no" />
      </div>
    </div>
  );
};

export default Inicio;
