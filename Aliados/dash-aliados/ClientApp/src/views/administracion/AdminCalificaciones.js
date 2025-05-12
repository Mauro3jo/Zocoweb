// import hooks
import React, { useContext, useEffect, useState } from "react";

// import context
import { DarkModeContext } from "../../context/DarkModeContext";

// import librerias
import { useNavigate } from "react-router-dom";
import Swal from "sweetalert2";

// assets
import logo from "../../assets/img/logo.png";
import logoClaro from "../../assets/img/logo-modo-oscuro.png";

// import componentes
import BienvenidoAdmin from "../../components/administracion/BienvenidoAdmin";
import TituloPagina from "../../components/TituloPagina";
import Footer from "../../components/Footer";
import CuadroDeCalificaciones from "../../components/administracion/CuadroDeCalificaciones";

const AdminCalificaciones = () => {
  // api url para traer el token
  const apiUrlToken = process.env.REACT_APP_API_TOKEN;

  // darkMode context para la funcionalidad para el claro/oscuro
  const { darkMode } = useContext(DarkModeContext);

  // estado para el spinner de carga
  const [cargando, setCargando] = useState(false);

  // hook useNavigate para hacer la navegacion
  const navegacion = useNavigate();

  // funcion para recargar la pagina
  function recargarPagina() {
    window.location.reload();
  }

  //consulta para verificar el token y traer los datos
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

          if (data !== 8) {
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

    // funcion para redireccionar con el hook useNavigate()
    const redireccionar = () => {
      navegacion("/");
      recargarPagina();
    };

    // consulta para manejar la respusta no autorizada
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

    // consulta para manejar el acceso denegado
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

  // estado para guardar la lista de calificaciones
  const [calificaciones, setCalificaciones] = useState([]);

  // consulta para traer la lista de calificaciones
  useEffect(() => {
    // Función para consultar la API
    const fetchCalificaciones = async () => {
      try {
        const respuesta = await fetch("/api/califico/listacalificacion");
        if (!respuesta.ok) {
          throw new Error("La petición a la API falló");
        }
        const datos = await respuesta.json();
        setCalificaciones(datos); // Actualizar el estado con los datos de la API
      } catch (error) {
        console.error("Error al consultar la API:", error);
      }
    };

    // Llamar a la función fetchCalificaciones dentro de useEffect
    fetchCalificaciones();
  }, []);

  return (
    <div className="d-flex flex-column min-vh-100" translate="no">
      <div className="pt-5">
        <BienvenidoAdmin />
      </div>
      <div>
        <TituloPagina title="Calificaciones" />
      </div>
      <div>
        <CuadroDeCalificaciones calificaciones={calificaciones} />
      </div>
      <div className="py-4 mt-auto">
        <Footer />
      </div>
    </div>
  );
};

export default AdminCalificaciones;
