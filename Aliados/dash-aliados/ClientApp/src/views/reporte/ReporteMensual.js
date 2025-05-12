import React, { useContext, useEffect, useState } from 'react';
import { DarkModeContext } from '../../context/DarkModeContext';
import Footer from '../../components/Footer';
import { useNavigate } from 'react-router-dom';
import Swal from 'sweetalert2';
import logo from "../../assets/img/logo.png";
import BienvenidaFlor from "../../components/PanelFlorencia/BienvenidaFlor.js";
import TituloPagina from "../../components/TituloPagina";
import { Button, Spinner } from "react-bootstrap";
import { faFileExcel } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";


const ReporteMensual = () => {
    const { darkMode } = useContext(DarkModeContext);
    const apiUrlToken = process.env.REACT_APP_API_TOKEN;
    const navegacion = useNavigate();
    const [cargando, setCargando] = useState(false);
    const [fechaInicio, setFechaInicio] = useState("");
    const [fechaFin, setFechaFin] = useState("");

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
    const descargarExcelSemanal = async () => {
        const token = sessionStorage.getItem("token");
        if (!token) {
            console.error("No hay token disponible");
            return;
        }

        setCargando(true);
        try {
            const response = await fetch("/api/excel/excelcrmsemanal", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify({ Token: token }),
            });

            if (!response.ok) {
                throw new Error(`Respuesta de la red no fue ok: ${response.status}`);
            }

            const blob = await response.blob();
            const downloadUrl = window.URL.createObjectURL(blob);
            const a = document.createElement("a");
            a.href = downloadUrl;
            a.download = "excel_crm_semanal.xlsx";
            document.body.appendChild(a);
            a.click();
            document.body.removeChild(a);
        } catch (error) {
            console.error("Error descargando el archivo Excel", error);
        } finally {
            setCargando(false);
        }
    }; const descargarExcelPorFechas = async () => {
        if (!fechaInicio || !fechaFin) {
            Swal.fire("Error", "Debe seleccionar ambas fechas", "error");
            return;
        }

        const token = sessionStorage.getItem("token");
        if (!token) {
            Swal.fire("Error", "No hay token disponible", "error");
            return;
        }

        setCargando(true);

        try {
            const response = await fetch("/api/excel/excelreporte", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify({
                    FechaInicio: fechaInicio,
                    FechaFin: fechaFin,
                    Token: token,
                }),
            });

            if (!response.ok) {
                throw new Error(`Error en la descarga: ${response.status}`);
            }

            const blob = await response.blob();
            const downloadUrl = window.URL.createObjectURL(blob);
            const a = document.createElement("a");
            a.href = downloadUrl;
            a.download = "reporte.xlsx";
            document.body.appendChild(a);
            a.click();
            document.body.removeChild(a);
        } catch (error) {
            console.error("Error descargando el reporte", error);
            Swal.fire("Error", "No se pudo descargar el reporte", "error");
        } finally {
            setCargando(false);
        }
    };

    function recargarPagina() {
        window.location.reload();
    }

    const descargarExcelMensual = async () => {
        const token = sessionStorage.getItem("token");
        if (!token) {
            console.error("No hay token disponible");
            return;
        }

        setCargando(true);

        try {
            // Descargar CRM Mensual
            await descargarArchivo("/api/excel/excelfacturacion", "excel_crm_mensual.xlsx", token);

            // Descargar Facturación Diaria después de que la descarga anterior se complete
            //await descargarArchivo("/api/excel/excelfacturacionmensualdia", "facturacion_diaria.xlsx", token);

        } catch (error) {
            console.error("Error descargando el archivo Excel", error);
        } finally {
            setCargando(false);
        }
    };

    const descargarArchivo = async (url, nombreArchivo, token) => {
        try {
            const response = await fetch(url, {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify({ Token: token }),
            });

            if (!response.ok) {
                throw new Error(`Respuesta de la red no fue ok: ${response.status}`);
            }

            const blob = await response.blob();
            const downloadUrl = window.URL.createObjectURL(blob);
            const a = document.createElement("a");
            a.href = downloadUrl;
            a.download = nombreArchivo;
            document.body.appendChild(a);
            a.click();
            document.body.removeChild(a);
        } catch (error) {
            console.error(`Error descargando el archivo ${nombreArchivo}`, error);
            throw error;
        }
    };

    return (
        <div className="d-flex flex-column min-vh-100" translate="no">
            <div className="pt-5">
                <BienvenidaFlor />
            </div>
            <div>
                <TituloPagina title="Panel de administracion" />
            </div>
            <div>
                <Button
                    className={
                        darkMode
                            ? "d-flex btn-check-modal-dark centrado border-0 fs-14 my-2"
                            : "d-flex btn-check-modal centrado border-0 fs-14 my-2"
                    }
                    onClick={descargarExcelMensual}
                    disabled={cargando}
                >
                    {cargando ? (
                        <Spinner animation="border" role="status"></Spinner>
                    ) : (
                        <div>
                            <h6 className="fs-14 mt-2">
                                <FontAwesomeIcon className="me-4" icon={faFileExcel} />{" "}
                                Descargar Excel Mensual
                            </h6>
                        </div>
                    )}
                </Button>
                <Button
                    className={
                        darkMode
                            ? "d-flex btn-check-modal-dark centrado border-0 fs-14 my-2"
                            : "d-flex btn-check-modal centrado border-0 fs-14 my-2"
                    }
                    onClick={descargarExcelSemanal}
                    disabled={cargando}
                >
                    {cargando ? (
                        <Spinner animation="border" role="status"></Spinner>
                    ) : (
                        <div>
                            <h6 className="fs-14 mt-2">
                                <FontAwesomeIcon className="me-4" icon={faFileExcel} />{" "}
                                Descargar Excel Semanal
                            </h6>
                        </div>
                    )}
                </Button>

            </div>
            <div className="d-flex flex-column align-items-center mt-4">
                <h4 className="mb-3">Descargar Reporte por Fecha</h4>

                <div className="d-flex gap-3">
                    {/* Input de Fecha Inicio */}
                    <div>
                        <label>Fecha Inicio</label>
                        <input
                            type="date"
                            value={fechaInicio}
                            onChange={(e) => setFechaInicio(e.target.value)}
                            className="form-control"
                        />
                    </div>

                    {/* Input de Fecha Fin */}
                    <div>
                        <label>Fecha Fin</label>
                        <input
                            type="date"
                            value={fechaFin}
                            onChange={(e) => setFechaFin(e.target.value)}
                            className="form-control"
                        />
                    </div>
                </div>

                {/* Botón para descargar el reporte */}
                <Button
                    className={darkMode ? "btn-dark mt-3" : "btn-primary mt-3"}
                    onClick={descargarExcelPorFechas}
                    disabled={cargando}
                >
                    {cargando ? (
                        <Spinner animation="border" size="sm" />
                    ) : (
                        <>
                            <FontAwesomeIcon className="me-2" icon={faFileExcel} />
                            Descargar Reporte por Fechas
                        </>
                    )}
                </Button>
            </div>

            <div className="py-4 mt-auto">
                <Footer />
            </div>
        </div>
    );
};

export default ReporteMensual;
