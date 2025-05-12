import "./BienvenidaFlor.css";
import React, { useContext } from "react";
import { DarkModeContext } from "../../context/DarkModeContext";
import {
    faCheckCircle,
    faCircleArrowDown,
    faCircleArrowUp,
    faRoute,
    faToggleOn,
} from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";

const BienvenidaFlor = ({ datosPanel }) => {
    const { darkMode } = useContext(DarkModeContext);
    // Si no hay datos, establecer todos los valores a 0
    const panel = datosPanel || {
        totalTerminales: 0,
        totalTerminalesAlta: 0,
        totalFacturan: 0,
        totalTerminalesNuevas: 0,
        totalNoFacturan: 0,
        totalBajaFacturacion: 0,
        totalTerminalesBaja: 0,
        totalHoyCeroFacturacion: 0, // Nueva variable para cero facturaci�n hoy
        totalHoyFacturacion: 0,     // Nueva variable para terminales que facturaron hoy
        totalHoyNoFacturan: 0       // Nueva variable para terminales activas que no facturaron hoy
    };

    return (
        <section className="container">
            <section className="d-lg-block d-none">
                <div
                    className={
                        darkMode
                            ? "py-4 contenedor-panel-control-asesores-dark container d-none d-xl-block"
                            : "py-4 contenedor-panel-control-asesores container d-none d-xl-block"
                    }
                >
                    <div className="d-flex justify-content-evenly py-3">
                        <article>
                            <div className="">
                                <h6 className="text-center heavy-900 fs-16 ms-2">
                                    Bienvenido/a <br />
                                    <span className="text-center heavy-900 color-verde fs-20 line-h-26">
                                        Facturación
                                    </span>
                                </h6>
                            </div>
                        </article>
                        <article className="borde-caja-panel"></article>
                        <article>
                            <div className="text-center">
                                <span className="lato-regular fs-16">Stock de terminales</span>
                                <br />
                                <span className="fs-25 lato-bold color-verde">
                                    {panel.totalTerminales}
                                </span>
                            </div>
                        </article>
                        <article className="borde-caja-panel"></article>
                        <article>
                            <div>
                                <span className="lato-bold fs-16">Altas</span>
                                <br />
                                <div className="lato-bold">
                                    <FontAwesomeIcon
                                        className="me-4 fs-25 color-verde"
                                        icon={faCircleArrowUp}
                                    />
                                    <span className="fs-25">{panel.totalTerminalesAlta}</span>
                                </div>
                            </div>
                        </article>

                        {/* Nuevo apartado para las terminales que facturaron hoy */}
                        <article className="borde-caja-panel"></article>
                        <article>
                            <div className="color-verde">
                                <span className="lato-regular fs-16">Hoy facturaron</span>
                                <br />
                                <div className="lato-bold">
                                    <FontAwesomeIcon className="me-4 fs-25 color-verde" icon={faCheckCircle} />
                                    <span className="fs-25">{panel.totalHoyFacturacion}</span>
                                </div>
                            </div>
                        </article>

                        {/* Nuevo apartado para las terminales con facturaci�n cero hoy */}
                        <article className="borde-caja-panel"></article>
                        <article>
                            <div className="color-rojo">
                                <span className="lato-regular fs-16">Hoy no facturaron</span>
                                <br />
                                <div className="lato-bold">
                                    <FontAwesomeIcon className="me-4 fs-25" icon={faRoute} />
                                    <span className="fs-25">{panel.totalHoyCeroFacturacion}</span>
                                </div>
                            </div>
                        </article>

                        <article className="borde-caja-panel"></article>
                        <article>
                            <div className="color-verde">
                                <span className="lato-bold fs-16">Facturan</span>
                                <br />
                                <div className="lato-bold color-verde">
                                    <FontAwesomeIcon className="me-4 fs-25" icon={faToggleOn} />
                                    <span className="fs-25">{panel.totalFacturan}</span>
                                </div>
                            </div>
                        </article>

                        {/* Nuevo apartado para las terminales activas que no facturaron hoy */}
                        <article className="borde-caja-panel"></article>
                        <article>
                            <div className="color-rojo">
                                <span className="lato-regular fs-16">Hoy no facturan</span>
                                <br />
                                <div className="lato-bold">
                                    <FontAwesomeIcon className="me-4 fs-25" icon={faRoute} />
                                    <span className="fs-25">{panel.totalHoyNoFacturan}</span>
                                </div>
                            </div>
                        </article>

                        <article className="borde-caja-panel"></article>
                        <article>
                            <div className="color-verde">
                                <span className="lato-regular fs-16">Terminales Nuevas</span>
                                <br />
                                <div className="lato-bold">
                                    <FontAwesomeIcon
                                        className="me-4 fs-25 color-verde"
                                        icon={faCircleArrowUp}
                                    />
                                    <span className="fs-25">{panel.totalTerminalesNuevas}</span>
                                </div>
                            </div>
                        </article>
                        <article className="borde-caja-panel"></article>
                        <article>
                            <div className="color-rojo">
                                <span className="lato-regular fs-16">No facturan</span>
                                <br />
                                <div className="lato-bold">
                                    <FontAwesomeIcon className="me-4 fs-25" icon={faRoute} />
                                    <span className="fs-25">{panel.totalNoFacturan}</span>
                                </div>
                            </div>
                        </article>
                        <article className="borde-caja-panel"></article>
                        <article>
                            <div className="color-naranja">
                                <span className="lato-regular fs-16">Baja facturacion</span>
                                <br />
                                <div className="lato-bold">
                                    <FontAwesomeIcon
                                        className="me-4 fs-25"
                                        icon={faCheckCircle}
                                    />
                                    <span className="fs-25">{panel.totalBajaFacturacion}</span>
                                </div>
                            </div>
                        </article>
                        <article className="borde-caja-panel"></article>
                        <article>
                            <div>
                                <span className="lato-bold fs-16">Bajas</span>
                                <br />
                                <div className="lato-bold">
                                    <FontAwesomeIcon
                                        className="me-4 fs-25 color-rojo"
                                        icon={faCircleArrowDown}
                                    />
                                    <span className="fs-25">{panel.totalTerminalesBaja}</span>
                                </div>
                            </div>
                        </article>
                    </div>
                </div>
            </section>
        </section>
    );
};

export default BienvenidaFlor;
