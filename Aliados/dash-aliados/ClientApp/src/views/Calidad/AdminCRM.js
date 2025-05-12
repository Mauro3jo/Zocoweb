import React, { useContext, useEffect, useState } from "react";
import BienvenidoCalidad from "../../components/Calidad/BienvenidoCalidad";
import TituloPagina from "../../components/TituloPagina";
import Footer from "../../components/Footer";
import { Button, Spinner } from "react-bootstrap";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faFileExcel, faTable } from "@fortawesome/free-solid-svg-icons";
import { DarkModeContext } from "../../context/DarkModeContext";
import CRM from "../../components/administracion/CRM";

const AdminCRM = () => {
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [datos, setDatos] = useState([]);
    const [view, setView] = useState("alta");

    useEffect(() => {
        const fetchData = async () => {
            try {
                const token = sessionStorage.getItem("token");
                const response = await fetch("/api/altas/CRM", {
                    method: "POST",
                    headers: {
                        "Content-Type": "application/json",
                    },
                    body: JSON.stringify({ token }),
                });

                if (!response.ok) {
                    throw new Error(`Error: ${response.status}`);
                }
                const result = await response.json();
                setDatos(result);
            } catch (err) {
                setError(err);
            } finally {
                setLoading(false);
            }
        };

        fetchData();
    }, []);

    const { darkMode } = useContext(DarkModeContext);
    const [cargando, setCargando] = useState(false);

    const descargarExcel = async () => {
        const token = sessionStorage.getItem("token");
        if (!token) {
            console.error("No hay token disponible");
            return;
        }

        setCargando(true);
        try {
            const response = await fetch("/api/excel/excelcrm", {
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
            a.download = "excel_crm.xlsx";
            document.body.appendChild(a);
            a.click();
            document.body.removeChild(a);
        } catch (error) {
            console.error("Error descargando el archivo Excel", error);
        } finally {
            setCargando(false);
        }
    };

    const [datosBajas, setDatosBajas] = useState([]);

    useEffect(() => {
        const fetchData = async () => {
            try {
                const token = sessionStorage.getItem("token");
                const response = await fetch("/api/bajas/CRM", {
                    method: "POST",
                    headers: {
                        "Content-Type": "application/json",
                    },
                    body: JSON.stringify({ token }),
                });

                if (!response.ok) {
                    throw new Error(`Error: ${response.status}`);
                }
                const result = await response.json();

                setDatosBajas(result);
            } catch (err) {
                setError(err);
            } finally {
                setLoading(false);
            }
        };

        fetchData();
    }, []);

    return (
        
        <div className="d-flex flex-column min-vh-100" translate="no">
            <div className="pt-5">
                <BienvenidoCalidad />
            </div>
            <div>
                <TituloPagina title="Customer Relationship Management" />
            </div>
            <div className="container">
                <section className="container">
                    <div className="d-flex justify-content-center">
                        <Button
                            className={
                                darkMode
                                    ? "d-flex btn-check-modal-dark centrado border-0 fs-14 my-2 mx-2 lato-bold"
                                    : "d-flex btn-check-modal centrado border-0 fs-14 my-2 mx-2 lato-bold"
                            }
                            onClick={() => setView("alta")}
                        >
                            <FontAwesomeIcon className="me-2" icon={faTable} />
                            Mostrar Tabla Alta
                        </Button>
                        <Button
                            className={
                                darkMode
                                    ? "d-flex btn-check-modal-dark centrado border-0 fs-14 my-2 mx-2 lato-bold"
                                    : "d-flex btn-check-modal centrado border-0 fs-14 my-2 mx-2 lato-bold"
                            }
                            onClick={() => setView("baja")}
                        >
                            <FontAwesomeIcon className="me-2" icon={faTable} />
                            Mostrar Tabla Baja
                        </Button>
                        <Button
                            className={
                                darkMode
                                    ? "d-flex btn-check-modal-dark centrado border-0 fs-14 my-2"
                                    : "d-flex btn-check-modal centrado border-0 fs-14 my-2"
                            }
                            onClick={descargarExcel}
                            disabled={cargando}
                        >
                            {cargando ? (
                                <Spinner animation="border" role="status"></Spinner>
                            ) : (
                                <div>
                                    <h6 className="fs-14 mt-2">
                                        <FontAwesomeIcon className="me-4" icon={faFileExcel} />{" "}
                                        Descargar Excel
                                    </h6>
                                </div>
                            )}
                        </Button>
                    </div>
                </section>
            </div>

            <section className="container">
                {view === "alta" && (
                    <section className="container">
                        <TituloPagina title="Altas" />
                        <CRM datos={datos} view={view} />
                    </section>
                )}
                {view === "baja" && (
                    <section className="container">
                        <TituloPagina title="Bajas" />
                        <CRM datos={datosBajas} view={view} />
                    </section>
                )}
            </section>
            <div className="py-4 mt-auto">
                <Footer />
            </div>
        </div>

    );
};

export default AdminCRM;
