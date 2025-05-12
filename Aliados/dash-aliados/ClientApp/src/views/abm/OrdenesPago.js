import React, { useContext, useEffect, useState } from "react";
import { DarkModeContext } from "../../context/DarkModeContext";
import { useNavigate } from "react-router-dom";
import Swal from "sweetalert2";

// assets de la carpeta img
import logo from "../../assets/img/logo.png";
import TituloPagina from "../../components/TituloPagina";
import Footer from "../../components/Footer";
import BienvenidoAdmin from "../../components/administracion/BienvenidoAdmin";
import ListaOrdenDePago from "../../components/administracion/ListaOrdenDePago";
import BienvenidoAbm from "../../components/abm/BienvenidoAbm";

const AbmListaOrdenPago = () => {
    const { darkMode } = useContext(DarkModeContext);
    const apiUrlToken = process.env.REACT_APP_API_TOKEN;
    const navegacion = useNavigate();


    useEffect(() => {
        verificarToken();
    }, []);

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
        }).then(() => navegacion("/"));
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
        }).then(() => navegacion("/"));
    };

    return (
        <div translate="no" className="d-flex flex-column min-vh-100">

            <div className="py-4 d-md-block d-none">
                <BienvenidoAbm />
            </div>
            <div>
                <TituloPagina title="Lista Orden de Pago" />
            </div>
            <div className="py-4 mt-auto">
                <ListaOrdenDePago />

            </div>

            <div className="py-4 mt-auto">
                <Footer />
            </div>
        </div>
    );
};

export default AbmListaOrdenPago;
