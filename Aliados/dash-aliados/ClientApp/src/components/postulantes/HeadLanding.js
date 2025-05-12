import React, { useEffect, useState, useCallback } from "react";
import { Link } from "react-router-dom";
import './HeadLanding.css';
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faCircleUser } from "@fortawesome/free-solid-svg-icons";

// import imágenes
import logoNav from "../../assets/img/logo.png";
import img from "../../assets/img/Imágen para Landing2 (Diseño completo positivo).png";
import img2 from "../../assets/img/Imágen para Landing (tamaño celular).png";

const Headlanding = React.memo(() => {
    const apiUrlToken = process.env.REACT_APP_API_TOKEN;
    const [esUsuario9, setEsUsuario9] = useState(false);

    const verificarTokenUsuario9 = useCallback(async () => {
        const token = sessionStorage.getItem("token");
        if (!token) return false;

        try {
            const response = await fetch(apiUrlToken, {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ Token: token }),
            });

            if (response.ok) {
                const data = await response.json();
                return data === 9;
            }
        } catch (error) {
            console.error("Error verificando el token:", error);
        }

        return false;
    }, [apiUrlToken]);

    useEffect(() => {
        const verificar = async () => {
            const resultado = await verificarTokenUsuario9();
            setEsUsuario9(resultado);
        };

        verificar();
    }, [verificarTokenUsuario9]);

    const scrollToSection = (id) => {
        const section = document.getElementById(id);
        if (section) section.scrollIntoView({ behavior: "smooth" });
    };

    const toggleNavbar = () => {
        const toggler = document.querySelector(".navbar-toggler");
        if (toggler && window.getComputedStyle(toggler).display !== "none") {
            toggler.click();
        }
    };

    return (
        <div data-bs-theme="dark">
            <article className="navbar navbar-expand-lg navbar-dark fixed-top bg-light">
                <div className="container-fluid">
                    <a className="navbar-brand" href="#">
                        <img
                            className="Zoco-Servicio-Pago"
                            src={logoNav}
                            alt="Zoco-Servicio de pagos"
                            loading="lazy"
                        />
                    </a>

                    <button
                        className="navbar-toggler"
                        type="button"
                        data-bs-toggle="collapse"
                        data-bs-target="#navbarCollapse"
                        aria-controls="navbarCollapse"
                        aria-expanded="false"
                        aria-label="Toggle navigation"
                    >
                        <span className="navbar-toggler-icon"></span>
                    </button>

                    <div className="collapse navbar-collapse" id="navbarCollapse">
                        <ul className="navbar-nav me-auto mb-2 mb-md-0">
                            <li className="navbar-item-landing2">
                                <a
                                    className="nav-link"
                                    href="#trabajaconnosotros"
                                    onClick={(e) => {
                                        e.preventDefault();
                                        scrollToSection("trabajaconnosotros");
                                        toggleNavbar();
                                    }}
                                >
                                    ¿Por qué trabajar con nosotros?
                                </a>
                            </li>
                            <li className="navbar-item-landing2">
                                <a
                                    className="nav-link"
                                    href="#ofertasdetrabajo"
                                    onClick={(e) => {
                                        e.preventDefault();
                                        scrollToSection("ofertasdetrabajo");
                                        toggleNavbar();
                                    }}
                                >
                                    Ofertas de trabajo
                                </a>
                            </li>
                        </ul>

                        <div className="navbar-btn">
                            {esUsuario9 ? (
                                <button className="btn main-btn" style={{ opacity: 1 }} disabled>
                                    <FontAwesomeIcon icon={faCircleUser} fontSize={20} />
                                </button>
                            ) : (
                                <Link className="btn main-btn" to="/login">
                                    Iniciar sesión
                                </Link>
                            )}
                        </div>
                    </div>
                </div>
            </article>

            <header data-bs-theme="dark">
                <div className="page-landing">
                    <div className="content-img-landing-2">
                        <img
                            className="img-desktop object-fit-contain"
                            src={img}
                            alt="Imagen desktop"
                            loading="lazy"
                        />
                        <img
                            className="img-mobile object-fit-contain"
                            src={img2}
                            alt="Imagen mobile"
                            loading="lazy"
                        />
                    </div>
                </div>
            </header>
        </div>
    );
});

export default Headlanding;
