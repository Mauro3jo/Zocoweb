import React, { useContext, useEffect, useState } from "react";
import { DarkModeContext } from "../../context/DarkModeContext";
import { useNavigate } from "react-router-dom";
import Swal from "sweetalert2";
// assets
import logo from "../../assets/img/logo.png";
import BienvenidoCalidad from "../../components/Calidad/BienvenidoCalidad";
import TituloPagina from "../../components/TituloPagina";
import Footer from "../../components/Footer";
import ContenidoAdminCalidad from "../../components/Calidad/ContenidoAdminCalidad";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faCalendarDays } from "@fortawesome/free-solid-svg-icons";
const PanelInterno = () => {
    const apiUrlToken = process.env.REACT_APP_API_TOKEN;
    const apiUrlPanelInterno = "/api/calidad/panelinternogestores"; // Añade aquí la URL de tu API
    const [fecha, setFecha] = useState(new Date().toISOString().split("T")[0]);
    const { darkMode } = useContext(DarkModeContext);
    const [cargando, setCargando] = useState(false);
    const [datosPanel, setDatosPanel] = useState(null); // Estado para almacenar los datos de la API
    const [error, setError] = useState(null); // Estado para manejar errores
    const navegacion = useNavigate();
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

                    if (data !== 3) {
                        manejarAccesoDenegado();
                    } else {
                        // Llamada a la API para obtener datos del panel interno
                        obtenerDatosPanelInterno(token);
                    }
                } else {
                    if (response.status === 401) {
                        manejarRespuestaNoAutorizada();
                    } else {
                        // Otro manejo de errores
                    }
                }
            } catch (error) {
                setError("Error al verificar el token.");
            }
            setCargando(false);
        };

        const obtenerDatosPanelInterno = async (token) => {
            try {
                const response = await fetch(apiUrlPanelInterno, {
                    method: "POST",
                    headers: {
                        "Content-Type": "application/json",
                    },
                    body: JSON.stringify({ Token: token, Fecha:fecha }),
                });

                if (response.ok) {
                    const data = await response.json();
                    setDatosPanel(data);
                } else {
                    setError("Error al obtener los datos del panel interno.");
                }
            } catch (error) {
                setError("Error en la comunicación con la API del panel interno.");
            }
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
                title: "Acceso denegado.",
                text: "No tiene permiso para acceder a esta sección.",
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
    }, [apiUrlToken, darkMode, fecha, navegacion]);
    const handleFechaChange = (e) => {
        setFecha(e.target.value);
      };

    return (
        <div className="d-flex flex-column min-vh-100" translate="no">
            <div className="pt-5">
                <BienvenidoCalidad />
            </div>
            <div>
                <TituloPagina title="Panel Gestores" />
            </div>
            <div>
            <div className="form-group" style={{
    display: "flex",
    alignItems: "left",
    marginBottom: "10px",
  }}>
    
              <label htmlFor="fecha" className="lato-regular fs-16" style={{
      display: "flex", // Para alinear icono y texto
      alignItems: "center", // Centra verticalmente el texto y el icono
      height: "38px", // Asegura que la altura sea igual al input
    }}> <FontAwesomeIcon icon={faCalendarDays} style={{marginRight:"5px", color:"#89939F"}} /> Fecha:</label>
              <input
                type="date"
                id="fecha"
                className="form-control"
                value={fecha}
                onChange={handleFechaChange}
                style={{
                    width: "auto", // Ajusta el tamaño del input a lo necesario
                    marginLeft: "5px",
                    height: "38px", // Muy poco espacio entre el label y el input
                    background:"#DCDEE1"
                  }}
              />
            </div>
                {cargando ? (
                    <p>Cargando...</p>
                ) : error ? (
                    <p>{error}</p>
                ) : (
                            datosPanel && <ContenidoAdminCalidad data={datosPanel} />
                )}
            </div>
            <div translate="no" className="py-4 mt-auto">
                <Footer />
            </div>
        </div>
    );
};

export default PanelInterno;
