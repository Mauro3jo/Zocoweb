// import hooks
import React, { useContext, useEffect, useState } from "react";

// import context
import { DatosInicioContext } from "../../context/DatosInicioContext";
import { DarkModeContext } from "../../context/DarkModeContext";

// import componentes
import BienvenidoPanel from "../../components/BienvenidoPanel";
import DatosTickets from "../../components/DatosTickets";
import TablaTickets from "../../components/TablaTickets";
import ScrollToTopButton from "../../components/ScrollToTopButton";
import TituloPagina from "../../components/TituloPagina";
import Footer from "../../components/Footer";

// import librerias
import { useNavigate } from "react-router-dom";
import Swal from "sweetalert2";
import { ThreeDots } from "react-loader-spinner";

// import assets
import logo from "../../assets/img/logo.png";
import logoClaro from "../../assets/img/logo-modo-oscuro.png";

const Tickets = () => {
  // extraigo del contexto datos y datos cupones context
  const { datosCuponesContext, codigoRespuesta, datos } =
    useContext(DatosInicioContext);

  // De datos cupones context extraigo la lista mes
    const { listaMes } = datosCuponesContext;
  // hooks para efectuar la navegacion
  const navegacion = useNavigate();

  // funcion para recargar la pagina
  function recargarPagina() {
    window.location.reload();
  }

  // url de la api
  const apiUrlToken = process.env.REACT_APP_API_TOKEN;

  // context para la modalidad del claro/oscuro
  const { darkMode } = useContext(DarkModeContext);

  // estado para controlar el spinner de carga
  const [cargando, setCargando] = useState(false);

  // consulta a la api para verificar el token
  useEffect(() => {
    const verificarToken = async () => {
      const token = sessionStorage.getItem("token");
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

    // funcion para manejar la respuesta autorizada
    // muestra un mensaje por pantalla
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

    // funcion para manejar el acceso denegado
    // muestra por pantalla un mensaje
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
  }, [listaMes]);

  // condicional para mostrar el spinner de carga
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
        <TituloPagina title="Cupones" />
      </div>
      <div className="my-3">
        <DatosTickets datosCuponesContext={datosCuponesContext} />
      </div>
      <TablaTickets listaMes={listaMes} datos={datos} />
      <div className="py-4">
        <Footer />
      </div>
    </div>
  );
};

export default Tickets;
