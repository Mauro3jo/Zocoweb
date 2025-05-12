// import hooks
import React, { useContext, useEffect, useState } from "react";

// import context
import { DarkModeContext } from "../../context/DarkModeContext";

// librerias
import Swal from "sweetalert2";
import { useNavigate } from "react-router-dom";

// assets
import logo from "../../assets/img/logo.png";
import CalculadoraNueva from "../../components/CalculadoraNueva";
import { DatosInicioContext } from "../../context/DatosInicioContext";
import Footer from "../../components/Footer";
import CalculadoraNuevaCelular from "../../components/CalculadoraNuevaCelular";
import TituloPagina from "../../components/TituloPagina";
import CalculadoraPlazos from "../../components/CalculadoraPlazos";
import PaymentTable from "../../components/PaymentTable";
import CalculadoraPlazosCelular from "../../components/CalculadoraPlazosCelular";
import BienvenidoPanelAsesores from "../../components/asesoresComp/BienvenidoPanelAsesores";
import BienvenidoPanelAsesoresCelular from "../../components/asesoresComp/BienvenidoPanelAsesoresCelular";

const CalculadoraAsesores = () => {
  // estado para la consulta inicial
  const [datosInicio, setDatosInicio] = useState(null);

  // hooks para la navegacion
  const navegacion = useNavigate();

  // darkMode Context funcionalidad para el modo claro/oscuro
  const { darkMode } = useContext(DarkModeContext);

  // estado para el check
  const { esCheck, setEsCheck } = useState();

  // api url
  const apiUrlToken = process.env.REACT_APP_API_TOKEN;
  const apiUrlDatos = "/api/datosinicioasesores/inicioasesores";
  const aoiUrlCheck = "/api/geo/cofirmarcheck";

  // estado para controlar el check y visualizar la siguiente pestaña
  const [estadoCheck, setEstadoCheck] = useState();

  // consulta para verificar y obtener los datos
  useEffect(() => {
    const verificarTokenYObtenerDatos = async () => {
      const token = sessionStorage.getItem("token");

      if (!token) {
        manejarRespuestaNoAutorizada();
        return;
      }

      try {
        const respuestaToken = await fetch(apiUrlToken, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ Token: token }),
        });

        if (!respuestaToken.ok) {
          if (respuestaToken.status === 401) {
            manejarRespuestaNoAutorizada();
          } else {
            manejarRespuestaNoAutorizada();

            throw new Error("Error verificando el token");
          }
          return;
        }

        const dataToken = await respuestaToken.json();
        if (dataToken !== 1) {
          manejarRespuestaNoAutorizada();

          return;
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
  }, [esCheck]);

  // funcion para filtrar la vista de administracion
  const obtenerFechaActualFormateada = () => {
    const fechaActual = new Date();
    const anio = fechaActual.getFullYear();
    const mes = `0${fechaActual.getMonth() + 1}`.slice(-2);
    const dia = `0${fechaActual.getDate()}`.slice(-2);
    const fechaFormateada = `${anio}-${mes}-${dia}`;
    return fechaFormateada;
  };

  // Estado para almacenar la fecha seleccionada en el input de tipo fecha
  // con la funcion para obtener la fecha actual formateada
  const [fechaSeleccionada, setFechaSeleccionada] = useState(
    obtenerFechaActualFormateada()
  );

  // Función para manejar el cambio en el input de fecha
  const handleFechaChange = (event) => {
    setFechaSeleccionada(event.target.value);
  };

  // estado de la checkList para mostrar en la tabla
  const [checkList, setCheckList] = useState([]);
  // consulta para  obtener el check de los archivos subidos
  //useEffect(() => {
  //  const fetchCheck = async () => {
  //    // Aquí tu código existente para obtener los datos...
  //    try {
  //      const token = sessionStorage.getItem("token");
  //      const response = await fetch("/api/geo/checklistaimagenasesor", {
  //        method: "POST",
  //        headers: { "Content-Type": "application/json" },
  //        body: JSON.stringify({ Token: token, Fecha: fechaSeleccionada }),
  //      });
  //      const data = await response.json();
  //      setCheckList(data);
  //    } catch (error) {
  //    }
  //  };

  //  fetchCheck();
  //}, [fechaSeleccionada]); // Dependencia en fechaSeleccionada para refetch

  // consulta para traer el estado isCheckedActive
  // para poder utilizarlo para mostrar el empezar o terminar jornada
  // y no se vaya la vista por mas que actualicen la pagina.
  const isCheckedActive = async () => {
    const token = sessionStorage.getItem("token");
    const respuestaCheck = await fetch(aoiUrlCheck, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ Token: token }),
    });

    if (respuestaCheck.ok) {
      const esCheckValido = await respuestaCheck.json();
      setEstadoCheck(esCheckValido);
    } else {
      throw new Error("Error al realizar el check");
    }
  };

  const recargarPagina = () => {
    window.location.reload();
  };

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

  return (
    <div translate="no" className="d-flex flex-column min-vh-100">
      <div className="py-4 d-md-block d-none">
        <BienvenidoPanelAsesores />
      </div>
      <div className="py-4 d-block d-md-none">
        <BienvenidoPanelAsesoresCelular />
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

export default CalculadoraAsesores;
