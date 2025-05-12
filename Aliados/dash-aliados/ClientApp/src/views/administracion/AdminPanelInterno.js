import React, { useContext, useEffect, useState } from "react";
import { DarkModeContext } from "../../context/DarkModeContext";
import { useNavigate } from "react-router-dom";
import Swal from "sweetalert2";
// assets
import logo from "../../assets/img/logo.png";
import BienvenidoAdmin from "../../components/administracion/BienvenidoAdmin";
import TituloPagina from "../../components/TituloPagina";
import ContenidoCRMInterno from "../../components/administracion/ContenidoCRMInterno";
import Footer from "../../components/Footer";

const AdminPanelInterno = () => {
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

    // consulta para verficar token
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
            } catch (error) { }
            setCargando(false);
        };

        // funcion re direccionar
        const redireccionar = () => {
            navegacion("/");
            recargarPagina();
        };

        // funcion para manejar respuesta no autorizada
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

        // funcion para manejar acceso denegado
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
        <div className="d-flex flex-column min-vh-100" translate="no">
            <div className="pt-5">
                <BienvenidoAdmin />
            </div>
            <div>
                <TituloPagina title="CRM Gestores Internos" />
            </div>
            <div>
                <ContenidoCRMInterno />
            </div>
            <div translate="no" className="py-4 mt-auto">
                <Footer />
            </div>
        </div>
    );
};

export default AdminPanelInterno;
