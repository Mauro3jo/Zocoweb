// import hooks, contexts y librerias
import React, { useContext, useEffect } from "react";
import { DarkModeContext } from "../../context/DarkModeContext";
import { useNavigate } from "react-router-dom";
import Swal from "sweetalert2";

// assets logo de carpeta img
import logo from "../../assets/img/logo.png";

// components
import BienvenidoAdmin from "../../components/administracion/BienvenidoAdmin";
import TituloPagina from "../../components/TituloPagina";
import Footer from "../../components/Footer";
import TablaBuscarCupones from "../../components/TablaBuscarCupones";

const AbmCupones = () => {
    // context para el modo oscuro
    const { darkMode } = useContext(DarkModeContext);

    // hook para la navegacion
    const navegacion = useNavigate();

    // funcion para recargar la pagina
    function recargarPagina() {
        window.location.reload();
    }

    // url de la api
    const apiUrlToken = process.env.REACT_APP_API_TOKEN;

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

        verificarToken();
    }, []);

    return (
        <div className="d-flex flex-column min-vh-100" translate="no">
            <div className="py-5">
                <BienvenidoAdmin title="Y Roque" />
            </div>
            <div className="pt-2">
                <TituloPagina title="Buscador de cupones" />
            </div>
            <section className="container">
                <TablaBuscarCupones />
            </section>
            <div className=" mt-auto py-4">
                <Footer />
            </div>
        </div>
    );
};

export default AbmCupones;
