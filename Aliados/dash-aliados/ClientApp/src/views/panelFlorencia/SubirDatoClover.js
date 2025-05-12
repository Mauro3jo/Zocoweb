import React, { useContext, useEffect, useState } from "react";
import BienvenidaFlor from '../../components/PanelFlorencia/BienvenidaFlor';
import Footer from '../../components/Footer';
import Swal from 'sweetalert2';
import { FacturacionContext } from '../../context/FacturacionContext'; // Importar contexto

import { useNavigate } from 'react-router-dom';
import logo from "../../assets/img/logo.png";
import { DarkModeContext } from '../../context/DarkModeContext';
import ContenidoClover from "../../components/PanelFlorencia/ContenidoClover";

const SubirDatoClover = () => {
    const {datosPanel } = useContext(FacturacionContext);
    const apiUrlToken = process.env.REACT_APP_API_TOKEN;
    const navegacion = useNavigate();
    const { darkMode } = useContext(DarkModeContext);

    const [cargando, setCargando] = useState(false);

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

                    if (data !== 5) {
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

    function recargarPagina() {
        window.location.reload();
    }

   

    return (
        <div>
            <div className="pt-5">
                <BienvenidaFlor datosPanel={datosPanel}/>

            </div>
            <div className="pt-5">
                <ContenidoClover/>

            </div>
            <div className="pt-5">
                <Footer/>

            </div>
            
            
        </div>
    );
};

export default SubirDatoClover;
