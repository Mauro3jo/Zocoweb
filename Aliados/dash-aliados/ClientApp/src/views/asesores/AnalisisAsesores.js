// Import hooks, librerias y dependencias
import React, { useContext, useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import Select from "react-select";
import Swal from "sweetalert2";
import logo from "../../assets/img/logo.png";
import { DarkModeContext } from "../../context/DarkModeContext";

// funciones helper para formateo del peso
import formatCurrency from "../../helpers/formatCurrency";

// import components
import BienvenidoPanelAsesores from "../../components/asesoresComp/BienvenidoPanelAsesores";
import BienvenidoPanelAsesoresCelular from "../../components/asesoresComp/BienvenidoPanelAsesoresCelular";
import TituloPagina from "../../components/TituloPagina";
import DatosAnalisisAsesores from "../../components/asesoresComp/DatosAnalisisAsesores";
import DescuentosAsesoresCelularAnalisis from "../../components/asesoresComp/DescuentosAsesoresCelularAnalisis";
import DescuentosAsesoresAnalisis from "../../components/asesoresComp/DescuentosAsesoresAnalisis";
import ComisionesAsesoresAnalisis from "../../components/asesoresComp/ComisionesAsesoresAnalisis";
import TotalAsesoresAnalisis from "../../components/asesoresComp/TotalAsesoresAnalisis";
import TablaFacturacionTerminales from "../../components/asesoresComp/TablaFacturacionTerminales";
import ComisionesAsesoresCelAnalisis from "../../components/asesoresComp/ComisionesAsesoresCelularAnalisis";
import ScrollTo from "../../components/asesoresComp/ScrollTo";
import Footer from "../../components/Footer";

const AnalisisAsesores = () => {
  // darkmode funcionalidad para cambiar el claro/oscuro
  const { darkMode } = useContext(DarkModeContext);

  // estado inicial donde se guardan los datos que solicitamos en la API
  const [datosInicio, setDatosInicio] = useState(null);

  // hook para la navegacion
  const navegacion = useNavigate();

  // url api
  const apiUrlToken = process.env.REACT_APP_API_TOKEN;
  const apiUrlDatos = process.env.REACT_APP_API_ANALISIS_ASESORES;

  // CONSULTA PARA VERIFICAR Y TRAER DATOS Y TOKEN
  useEffect(() => {
    const verificarTokenYObtenerDatos = async () => {
      const token = sessionStorage.getItem("token");

      if (!token) {
        manejarRespuestaNoAutorizada();
        return;
      }

      try {
        // Primero, verificar el token
        const respuestaToken = await fetch(apiUrlToken, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ Token: token }),
        });

        if (!respuestaToken.ok) {
          if (respuestaToken.status === 401) {
            manejarRespuestaNoAutorizada();
          } else {
            throw new Error("Error verificando el token");
          }
          return; // Salir si la verificación del token falló
        }

        const dataToken = await respuestaToken.json();
        if (dataToken !== 1) {
          manejarAccesoDenegado();
          return; // Salir si el token no es válido
        }

        // Luego, obtener los datos después de la verificación exitosa del token
        const respuestaDatos = await fetch(apiUrlDatos, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ Token: token }),
        });

        if (respuestaDatos.ok) {
          const data = await respuestaDatos.json();
          setDatosInicio(data);
        } else {
          if (respuestaDatos.status === 401) {
            manejarRespuestaNoAutorizada();
          } else {
            throw new Error("Error obteniendo los datos");
          }
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
  }, []);

  // DATOS PARA PINTAR INICIO
  const datosParaPintar = datosInicio || [];
  const { totalPorCobrar } = datosParaPintar;
  const totalPorCobrarFormateadaApeso = formatCurrency(totalPorCobrar);

  // ESTADO POR FILTRO DE ACTIVACION
  const [filtro, setFiltro] = useState("activacion");

  // Opciones para el Select
  const options = [
    { value: "activacion", label: "Activación" },
    { value: "facturacion", label: "Facturación" },
  ];

  return (
    <div className="d-flex flex-column min-vh-100" translate="no">
      <ScrollTo />
      <div className="py-4 d-md-block d-none">
        <BienvenidoPanelAsesores datos={datosInicio} />
      </div>
      <div className="py-4 d-block d-md-none">
        <BienvenidoPanelAsesoresCelular datos={datosInicio} />
      </div>
      <div>
        <TituloPagina title="Análisis" />
      </div>
      {/* FILTRADO POR ACTIVACION/FACTURACION */}
      <div className="container">
        <div className="d-none d-lg-block">
          <section className="pb-4 d-flex justify-content-end">
            <div>
              <label className="lato-bold fs-16" htmlFor="tipoPago">
                Objetivo:
              </label>
              <Select
                className=" 
            select__control_custom-inicio
             lato-bold"
                classNamePrefix="select"
                value={options.find((option) => option.value === filtro)}
                onChange={(selectedOption) => setFiltro(selectedOption.value)}
                options={options}
              />
            </div>
          </section>
        </div>
        {/* FILTRADO POR ACTIVACION/FACTURACION CELULAR */}
        <div className="d-lg-none d-block">
          <section className="pb-4 d-flex justify-content-end">
            <div>
              <label className="lato-bold fs-16" htmlFor="tipoPago">
                Objetivo:
              </label>
              <Select
                className=" 
            select__control_custom-inicio
             lato-bold"
                classNamePrefix="select"
                value={options.find((option) => option.value === filtro)}
                onChange={(selectedOption) => setFiltro(selectedOption.value)}
                options={options}
              />
            </div>
          </section>
        </div>
      </div>
      <div className="pb-2">
        <DatosAnalisisAsesores filtro={filtro} datos={datosInicio} />
      </div>
      <section className="container d-none d-md-block">
        <div className="row">
          <div className="col-12 col-lg-6">
            <ComisionesAsesoresAnalisis
              filtro={filtro}
              setFiltro={setFiltro}
              datos={datosInicio}
            />
          </div>
          <div className="col-12 col-lg-6">
            <DescuentosAsesoresAnalisis
              filtro={filtro}
              setFiltro={setFiltro}
              datos={datosInicio}
            />
          </div>
        </div>
      </section>
      <section className="container d-md-none d-block ">
        <div className="row">
          <div className="col-12 col-lg-6">
            <ComisionesAsesoresCelAnalisis
              filtro={filtro}
              datos={datosInicio}
            />
          </div>
          <div className="col-12 col-lg-6">
            <DescuentosAsesoresCelularAnalisis datos={datosInicio} />
          </div>
        </div>
      </section>
      <div>
        <TotalAsesoresAnalisis
          totalPorCobrarFormateadaApeso={totalPorCobrarFormateadaApeso}
        />
      </div>
      <TablaFacturacionTerminales datos={datosInicio} />
      <div className="py-4 mt-auto">
        <Footer />
      </div>
    </div>
  );
};

export default AnalisisAsesores;
