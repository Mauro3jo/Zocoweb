import React, { useContext, useEffect, useState } from "react";
import TituloPagina from "../../components/TituloPagina";
import Footer from "../../components/Footer";
import { Button, Spinner } from "react-bootstrap";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faFileExcel, faTable, faSheetPlastic } from "@fortawesome/free-solid-svg-icons";
import { DarkModeContext } from "../../context/DarkModeContext";
import TablaInformeABM from "../../components/administracion/TablaInformeABM";
import CRM from "../../components/administracion/CRM";
import { useNavigate } from "react-router-dom";
import Swal from "sweetalert2";
import logo from "../../assets/img/logo.png";
import BienvenidoAbm from "../../components/abm/BienvenidoAbm";

const AbmCRM = () => {
    const apiUrlToken = process.env.REACT_APP_API_TOKEN;

    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [datos, setDatos] = useState([]);
    const [view, setView] = useState("alta");
    const [showABM, setShowABM] = useState(false);
    const [numRol,setNumRol]=useState(0)


  // hook de navegacion
  const navegacion = useNavigate();

  // funcion para recargarPagina
  function recargarPagina() {
    window.location.reload();
  }
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
              setNumRol(data)
    
              if (data !== 12) {
                manejarAccesoDenegado();
              }
            } else {
              if (response.status === 401) {
                manejarRespuestaNoAutorizada();
              } else {
              }
            }
          } catch (error) {}
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
                <BienvenidoAbm />
            </div>
            <div>
                <TituloPagina title="Customer Relationship Management" />
            </div>
            <div className="container">
                <section className="container">
                    <div className="d-flex flex-column flex-md-row justify-content-center align-items-center">
                        <Button
                            className={
                                darkMode
                                    ? "d-flex btn-check-modal-dark centrado border-0 fs-14 my-2 mx-2 lato-bold"
                                    : "d-flex btn-check-modal centrado border-0 fs-14 my-2 mx-2 lato-bold"
                            }
                            onClick={() => {
                                setView("alta");
                                setShowABM(false); // Asegurarse de ocultar el informe ABM
                            }}
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
                            onClick={() => {
                                setView("baja");
                                setShowABM(false); // Asegurarse de ocultar el informe ABM
                            }}
                        >
                            <FontAwesomeIcon className="me-2" icon={faTable} />
                            Mostrar Tabla Baja
                        </Button>
                        {/* <Button
                            className={
                                darkMode
                                    ? "d-flex btn-check-modal-dark centrado border-0 fs-14 my-2 mx-2 lato-bold"
                                    : "d-flex btn-check-modal centrado border-0 fs-14 my-2 mx-2 lato-bold"
                            }
                            onClick={() => {
                                setShowABM(!showABM); // Cambia el estado para mostrar/ocultar TablaInformeABM
                                setView(""); // Vacía la vista para asegurarse de que ni alta ni baja se muestren
                            }}
                        >
                            <FontAwesomeIcon className="me-2" icon={faSheetPlastic} />
                            {showABM ? "Ocultar informe ABM" : "Mostrar informe ABM"}
                        </Button> */}
                        {/* <Button
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
                        </Button> */}

                        {/* <Button
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
                        </Button> */}

                        {/* <Button
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
                        </Button> */}
                    </div>
                </section>
            </div>

            <section className="container">
                {view === "alta" && (
                    <section className="container">
                        <TituloPagina title="Altas" />
                        <CRM datos={datos} view={view} rol={numRol} />
                    </section>
                )}
                {view === "baja" && (
                    <section className="container">
                        <TituloPagina title="Bajas" />
                        <CRM datos={datosBajas} view={view} rol={numRol}/>
                    </section>
                )}
                {/* {showABM && (
                    <section className="container">
                        <TituloPagina title="Informe ABM" />
                        <TablaInformeABM /> {/* Mostrar el componente TablaInformeABM */}
                    {/*</section>*/}
                {/*)}*/}
            </section> 
            <div className="py-4 mt-auto">
                <Footer />
            </div>
        </div>
        
    );
};

export default AbmCRM;
