// import hooks
import React, { useContext, useEffect, useState } from "react";

// import context
import { DarkModeContext } from "../../context/DarkModeContext";

// import librerias
import { useNavigate } from "react-router-dom";
import Swal from "sweetalert2";
import { Button, Spinner } from "react-bootstrap";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faFileExcel, faRotate } from "@fortawesome/free-solid-svg-icons";

// assets
import logo from "../../assets/img/logo.png";

// import componentes
import BienvenidoCalidad from "../../components/Calidad/BienvenidoCalidad";
import TituloPagina from "../../components/TituloPagina";
import TablaAsesoresCoordenadas from "../../components/administracion/TablaAsesoresCoordenadas";
import MapComponent from "../../components/asesoresComp/MapComponent";
import TablaAsesoresCheckInOut from "../../components/administracion/TablaAsesoresCheckInOut";
import Footer from "../../components/Footer";

const Admin = () => {

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

                    if (data !== 3) {
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

    // funcion para filtrar la vista de administracion

    // Función para convertir la fecha de dd/MM/yyyy a yyyy-MM-dd
    const obtenerFechaActualFormatoLocal = () => {
        const fechaHoy = new Date();
        const dia = ("0" + fechaHoy.getDate()).slice(-2);
        const mes = ("0" + (fechaHoy.getMonth() + 1)).slice(-2);
        const anio = fechaHoy.getFullYear();
        return `${dia}/${mes}/${anio}`;
    };

    // estado para fecha filtrada
    const [fechaFiltrada, setFechaFiltrada] = useState(
        obtenerFechaActualFormatoLocal
    );

    // Mantén tus funciones de conversión como están
    const convertirAFormatoISO = (fecha) => {
        const [dia, mes, año] = fecha.split("/");
        return `${año}-${mes}-${dia}`;
    };

    // funcion pra convertir una fecha en formato local
    const convertirAFormatoLocal = (fecha) => {
        const [año, mes, dia] = fecha.split("-");
        return `${dia}/${mes}/${año}`;
    };

    // Manejador del evento de cambio para el input
    const handleChange = (event) => {
        setFechaFiltrada(convertirAFormatoLocal(event.target.value));
    };

    // estado para guardar la checkList
    const [checkList, setCheckList] = useState([]);
    // consulta para traer la checkLista con la imagen
    useEffect(() => {
        const fetchCheck = async () => {
            const fechaHoy = new Date();
            const dia = ("0" + fechaHoy.getDate()).slice(-2);
            const mes = ("0" + (fechaHoy.getMonth() + 1)).slice(-2);
            const anio = fechaHoy.getFullYear();
            const fechaFormateada = dia + "/" + mes + "/" + anio;

            const datos = {
                Fecha: fechaFiltrada,
            };

            try {
                const response = await fetch("/api/geo/checklistaimagen", {
                    method: "POST",
                    headers: {
                        "Content-Type": "application/json",
                    },
                    body: JSON.stringify(datos),
                });

                // Verificar que la respuesta sea "ok"
                if (!response.ok) {
                    throw new Error("Error en la respuesta de la API");
                }

                const data = await response.json();

                // Verificar que data no esté vacío
                if (!data || data.length === 0) {
                    console.warn("No hay datos disponibles en la lista de checks");
                    return;
                }

                // Actualiza el estado con los nuevos datos
                setCheckList(data);
            } catch (error) {
            }
        };

        fetchCheck();
    }, [fechaFiltrada]); // Asegúrate de incluir todas las dependencias necesarias


    const descargarExcel = async () => {
        const token = sessionStorage.getItem("token");
        if (!token) {
            console.error("No hay token disponible");
            // Maneja el error adecuadamente
            return;
        }

        // Depuración: Imprime el token para asegurarse de que tiene el formato esperado
        setCargando(true); // Muestra el spinner
        try {
            const response = await fetch("/api/excel/exceladmin", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify({ Token: token, Fecha: fechaFiltrada }),
            });

            if (!response.ok) {
                throw new Error(`Respuesta de la red no fue ok: ${response.status}`);
            }

            const blob = await response.blob();
            const downloadUrl = window.URL.createObjectURL(blob);
            const a = document.createElement("a");
            a.href = downloadUrl;
            a.download = "excel_admin.xlsx";
            document.body.appendChild(a);
            a.click();
            document.body.removeChild(a);
        } catch (error) {
            console.error("Error descargando el archivo Excel", error);
        } finally {
            setCargando(false); // Oculta el spinner independientemente del resultado
        }
    };

    return (
        <div className="d-flex flex-column min-vh-100" translate="no">
            <div>
                <>
                    <div className="pt-5">
                        <BienvenidoCalidad />
                    </div>
                    <div>
                        <TituloPagina title="Panel de administracion" />
                    </div>

                    <div className="container">
                        <label className="me-2" htmlFor="fecha">
                            Filtro por fecha:{" "}
                        </label>
                        <input
                            className="lato-regular border-0 filtro-fecha-administracion container"
                            type="date"
                            id="fecha"
                            value={convertirAFormatoISO(fechaFiltrada)} // Asegúrate de que esto convierte correctamente
                            onChange={handleChange}
                        />
                    </div>
                    {/* map componente muestra las coordenadas del checkIn/out  */}
                    <div>
                        <MapComponent fechaFiltrada={fechaFiltrada} />
                    </div>
                    <article className="container py-4 d-flex justify-content-between flex-wrap">
                        <Button
                            className={
                                darkMode
                                    ? "d-flex btn-check-modal-dark  centrado border-0 fs-14 my-2"
                                    : "d-flex btn-check-modal centrado  border-0 fs-14 my-2"
                            }
                            onClick={recargarPagina}
                        >
                            <FontAwesomeIcon className="me-3" icon={faRotate} /> Actualizar
                            tabla{" "}
                        </Button>
                        <div>
                            <Button
                                className={
                                    darkMode
                                        ? "d-flex btn-check-modal-dark centrado border-0 fs-14 my-2"
                                        : "d-flex btn-check-modal centrado border-0 fs-14 my-2"
                                }
                                onClick={descargarExcel} // Este es el manejador del evento click para este botón
                                disabled={cargando}
                            >
                                {cargando ? (
                                    <Spinner animation="border" role="status"></Spinner>
                                ) : (
                                    <div>
                                        <h6 className="fs-14 mt-2">
                                            {" "}
                                            <FontAwesomeIcon
                                                className="me-4"
                                                icon={faFileExcel}
                                            />{" "}
                                            Descargar Excel
                                        </h6>
                                    </div>
                                )}
                            </Button>
                        </div>
                    </article>
                    {/* Tabla Asesores Coordenadasmuestra los datos del checkIn/Out en una tabla   */}

                    <div className="pt-2">
                        <TablaAsesoresCoordenadas fechaFiltrada={fechaFiltrada} />
                    </div>

                    <div className="pt-4">
                        <h6 className="fs-18 lato-bold pt-4 text-center">
                            {" "}
                            Tabla Check in por local de cada asesor{" "}
                        </h6>

                        {/* Tabla Asesores CheckInOut  que muestra los siguientes datos 
        Nombre/Asesor/Local/Fecha - Hora/Tipo/Foto/Grabacion/Mapa/Observaciones
        */}
                        <TablaAsesoresCheckInOut
                            key={fechaFiltrada}
                            fechaFiltrada={fechaFiltrada}
                            checkList={checkList}
                            cargando={cargando}
                        />
                    </div>
                    <div className="py-4 mt-auto">
                        <Footer />
                    </div>
                </>
            </div>
        </div>
    );
};

export default Admin;
