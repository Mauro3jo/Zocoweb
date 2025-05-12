// import hooks
import React, { useContext, useEffect, useState } from "react";

// import context
import { DarkModeContext } from "../../context/DarkModeContext";

// librerias
import Swal from "sweetalert2";
import { useNavigate } from "react-router-dom";

// assets
import logo from "../../assets/img/logo.png";
import CalculadoraNueva from "../../components/CalculadoraNueva";
import Footer from "../../components/Footer";
import CalculadoraNuevaCelular from "../../components/CalculadoraNuevaCelular";
import TituloPagina from "../../components/TituloPagina";
import CalculadoraPlazos from "../../components/CalculadoraPlazos";
import PaymentTable from "../../components/PaymentTable";
import CalculadoraPlazosCelular from "../../components/CalculadoraPlazosCelular";
import BienvenidoPanelGestor from "../../components/gestorComp/BienvenidoPanelGestor";
import BienvenidoPanelGestorCelular from "../../components/gestorComp/BienvenidoPanelGestorCelular";
import BienvenidoAdmin from "../../components/administracion/BienvenidoAdmin";

const AbmComparador = () => {
    // context para el modo oscuro
    const { darkMode } = useContext(DarkModeContext);

    // hook para la navegacion
    const navegacion = useNavigate();

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

    const recargarPagina = () => {
        window.location.reload();
    };

    // const { datosBackContext } = useContext(DatosInicioContext);
    const [showPlazoCalculator, setShowPlazoCalculator] = useState(true);
    const [showMontoCalculator, setShowMontoCalculator] = useState(false);

    const handlePlazoClick = () => {
        setShowPlazoCalculator(true);
        setShowMontoCalculator(false);
    };

    const handleMontoClick = () => {
        setShowMontoCalculator(true);
        setShowPlazoCalculator(false);
    };

    return (
        <div translate="no" className="d-flex flex-column min-vh-100">
            <div className="py-4 d-md-block d-none">
                <BienvenidoAdmin />
            </div>
            <div className="py-4 d-block d-md-none">
                <BienvenidoAdmin />
            </div>
            <div className="pt-2">
                <TituloPagina translate="no" title="Simulador" />
            </div>
            <article className="d-xl-block d-none">
                <section className="d-flex justify-content-center py-2 ">
                    <div className="mx-3">
                        <button
                            d-none
                            className={
                                showPlazoCalculator
                                    ? " btn-simulador-desactivado px-5"
                                    : " btn-simulador-activado px-5"
                            }
                            onClick={handlePlazoClick}
                        >
                            Simulador de Plazos
                        </button>
                    </div>
                    <div className="mx-3">
                        <button
                            className={
                                showMontoCalculator
                                    ? " btn-simulador-desactivado px-5"
                                    : " btn-simulador-activado  px-5"
                            }
                            onClick={handleMontoClick}
                        >
                            Simulador de monto
                        </button>
                    </div>
                </section>
            </article>
            <article className="d-block d-xl-none">
                <section className="d-flex justify-content-center py-2 ">
                    <div className="mx-3">
                        <button
                            className={
                                showPlazoCalculator
                                    ? " btn-simulador-desactivado  px-3"
                                    : "btn-simulador-activado px-3"
                            }
                            onClick={handlePlazoClick}
                        >
                            Sim. Plazos
                        </button>
                    </div>
                    <div className="mx-3">
                        <button
                            className={
                                showMontoCalculator
                                    ? "btn-simulador-desactivado   px-3"
                                    : " btn-simulador-activado  px-3"
                            }
                            onClick={handleMontoClick}
                        >
                            Sim. Monto
                        </button>
                    </div>
                </section>
            </article>
            {showPlazoCalculator && (
                <>
                    <div className="pt-2 d-xl-block d-none">
                        <CalculadoraPlazos />
                    </div>
                    <div className="pt-2 d-block d-xl-none">
                        <CalculadoraPlazosCelular />
                    </div>
                    <div className=" container">
                        <PaymentTable />
                    </div>
                </>
            )}
            {showMontoCalculator && (
                <>
                    <div className="py-4 d-xl-block d-none">
                        <CalculadoraNueva />
                    </div>
                    <div className="py-4 d-block d-xl-none">
                        <CalculadoraNuevaCelular />
                    </div>
                </>
            )}
            <div className="py-4 mt-auto">
                <Footer />
            </div>
        </div>
    );
};

export default AbmComparador;
