import { useContext, useEffect, useState } from "react";

// import context
import { DarkModeContext } from "../../context/DarkModeContext";

// import librerias
import { useNavigate } from "react-router-dom";
import Swal from "sweetalert2";

// assets
import logo from "../../assets/img/logo.png";
import BienvenidoAdmin from "../../components/administracion/BienvenidoAdmin";
import TituloPagina from "../../components/TituloPagina";
import Footer from "../../components/Footer";
import ContenidoFormulariosAdministradores from "../../components/administracion/ContenidoFormulariosAdministradores";

const AdminFormularios = () => {
  // api url
  const apiUrlToken = process.env.REACT_APP_API_TOKEN;

  // darkMode context funcionalidad para modalidad claro/oscuro
  const { darkMode } = useContext(DarkModeContext);

  // estado para el spinner de carga
  const [cargando, setCargando] = useState(false);

  // hook de navegacion
  const navegacion = useNavigate();

  // funcion para recargarPagina
  function recargarPagina() {
    window.location.reload();
  }


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
          } else {
            
          }
        } else {
          if (response.status === 401) {
            manejarRespuestaNoAutorizada();
          }
        }
      } catch (error) {
        console.error(error);
      }
      setCargando(false);
    };

  
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

  return (
    <div translate="no" className="d-flex flex-column min-vh-100">
      <div className="pt-5">
        <BienvenidoAdmin />
      </div>
      <div>
        <TituloPagina title="Formularios" />
      </div>
      <div className="container">
        <ContenidoFormulariosAdministradores />
      </div>
      <div translate="no" className="py-4 mt-auto">
        <Footer />
      </div>
    </div>
  );
};

export default AdminFormularios;
