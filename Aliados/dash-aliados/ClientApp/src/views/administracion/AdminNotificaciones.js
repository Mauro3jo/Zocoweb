// import hooks
import React, { useContext, useEffect, useState } from "react";

// import context
import { DarkModeContext } from "../../context/DarkModeContext";

// import librerias
import Swal from "sweetalert2";
import { useNavigate } from "react-router-dom";

//import assets
import logo from "../../assets/img/logo.png";

// import componentes
import BienvenidoAdmin from "../../components/administracion/BienvenidoAdmin";
import TituloPagina from "../../components/TituloPagina";
import NotificacionesContenido from "../../components/administracion/NotificacionesContenido";
import Footer from "../../components/Footer";

const AdminNotificaciones = () => {
  // api url
  const apiUrlToken = process.env.REACT_APP_API_TOKEN;

  // darkMode context funcionalidad para hacer el modo claro/oscuro
  const { darkMode } = useContext(DarkModeContext);

  // estado cargando para el spinner de carga
  const [cargando, setCargando] = useState(false);

  // variable de navegacion para efectuar el hook useNavigate para enviar a una pagina especifica
  const navegacion = useNavigate();

  // funcion para recargar la pagina
  function recargarPagina() {
    window.location.reload();
  }

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

    // funcion para redireccionar
    const redireccionar = () => {
      navegacion("/");
      recargarPagina();
    };

    // funcion para manejar la respuesta no autorizada
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

  // api url
  const apiUrlNotificaciones = process.env.REACT_APP_API_NOTIFICACIONES;

  // estado para guardar el array con las notificaciones de los Aliados
  const [notificacionesAliados, setNotificacionesAliados] = useState([]);

  // estado para guardar el array con las notificaciones de los Asesores
  const [notificacionesAsesores, setNotificacionesAsesores] = useState([]);

  // consulta para traer las notificaciones de aliado/asesores
  // y guardarla en sus estados.
  useEffect(() => {
    const fetchNoticias = async () => {
      try {
        const response = await fetch(apiUrlNotificaciones);
        const data = await response.json();

        // Filtrar notificaciones por tipo de usuario
        const noticiasAliados = data.filter(
          (notificacion) => notificacion.tipoUsuario.trim() === "Aliado"
        );
        const noticiasAsesores = data.filter(
          (notificacion) => notificacion.tipoUsuario.trim() === "Asesor"
        );

        // Actualizar estados con notificaciones filtradas
        setNotificacionesAliados(noticiasAliados);
        setNotificacionesAsesores(noticiasAsesores);
      } catch (error) {
      }
    };

    fetchNoticias();
  }, [apiUrlNotificaciones]); 

  return (
    <div className="d-flex flex-column min-vh-100" translate="no">
      <div className="pt-5">
        <BienvenidoAdmin />
      </div>
      <div>
        <TituloPagina title="Notificaciones" />
      </div>
      <div>
        <NotificacionesContenido
          notificacionesAliados={notificacionesAliados}
          notificacionesAsesores={notificacionesAsesores}
        />
      </div>
      <div className="py-4 mt-auto">
        <Footer />
      </div>
    </div>
  );
};

export default AdminNotificaciones;
