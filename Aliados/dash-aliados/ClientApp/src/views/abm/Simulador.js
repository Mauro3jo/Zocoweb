// import hooks, librerias y context
import React, { useContext, useEffect } from "react";
import { DarkModeContext } from "../../context/DarkModeContext";
import { useNavigate } from "react-router-dom";
import Swal from "sweetalert2";

// assets de la carpeta img
import logo from "../../assets/img/logo.png";
import TituloPagina from "../../components/TituloPagina";
import CuadroComparativo from "../../components/asesoresComp/CuadroComparativo";
import Footer from "../../components/Footer";
import BienvenidoAdmin from "../../components/administracion/BienvenidoAdmin";
import ScrollTo from "../../components/asesoresComp/ScrollTo";

const AbmSimulador = () => {
    // context para el modo oscuro
    const { darkMode } = useContext(DarkModeContext);
    // url de la api
    const apiUrlToken = process.env.REACT_APP_API_TOKEN;

    // hook para la navegacion
    const navegacion = useNavigate();

    // consulta para verificar y obtener los datos
    useEffect(() => {
        const verificarToken = async () => {
            const token = sessionStorage.getItem("token");

            if (!token) {
                manejarRespuestaNoAutorizada();
                return;
            }

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

                    if (data !== 12) {
                        manejarAccesoDenegado();
                    }
                } else {
                    if (response.status === 401) {
                        manejarRespuestaNoAutorizada();
                    } else {
                        throw new Error("Respuesta no satisfactoria del servidor");
                    }
                }
            } catch (error) {
                console.error("Error al validar el token", error);
            }
        };

        const redireccionar = () => {
            navegacion("/");
            recargarPagina();
        };

        const manejarRespuestaNoAutorizada = () => {
            sessionStorage.removeItem("token"); // Eliminar el token

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

    const recargarPagina = () => {
        window.location.reload();
    };


    return (
        <div translate="no" className="d-flex flex-column min-vh-100">
            <ScrollTo />
            <div className="py-4 d-md-block d-none">
                <BienvenidoAdmin />
            </div>
            <div>
                <TituloPagina title="Simulador" />
            </div>
            <div className="mt-4">
                <CuadroComparativo />
            </div>
            <div className="py-4 mt-auto">
                <Footer />
            </div>
        </div>
    );
};

export default AbmSimulador;
