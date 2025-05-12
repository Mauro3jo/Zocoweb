import React, { useContext, useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import logo from "../../assets/img/logo.png";

import { DarkModeContext } from '../../context/DarkModeContext';
import { FacturacionContext } from '../../context/FacturacionContext'; // Importar contexto
import TituloPagina from '../../components/TituloPagina';
import BienvenidaFlor from '../../components/PanelFlorencia/BienvenidaFlor';
import Select from 'react-select';
import { Col, Form, Row } from 'react-bootstrap';
import ComponenteTablaMensual from '../../components/PanelFlorencia/ComponenteTablaMensual';
import Footer from '../../components/Footer';
import Swal from 'sweetalert2';
import {
    faCircleArrowDown,
    faCircleArrowUp,
} from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
const ReporteMensual = () => {
    const apiUrlToken = process.env.REACT_APP_API_TOKEN;
    const navegacion = useNavigate();
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
    const { darkMode } = useContext(DarkModeContext);
    const {
        datosFacturacionMensual,
        datosPanel,
        provincias,
        provinciaSeleccionada,
        setProvinciaSeleccionada,
        fetchDatosFacturacionMensual,datosExcelCRMsemanal
    } = useContext(FacturacionContext); // Usar el contexto

    // Ejecutar fetch cada vez que cambia la provincia
    useEffect(() => {
        if (provinciaSeleccionada && fetchDatosFacturacionMensual) {
            fetchDatosFacturacionMensual(); // Llamar a la función de fetch cuando cambie la provincia
        }
    }, [provinciaSeleccionada, fetchDatosFacturacionMensual]);


    return (
        <>
            <div className='pt-5'>
                <BienvenidaFlor datosPanel={datosPanel} />
            </div>

            <div className="pt-5">
                <div className="d-flex justify-content-center mb-4">
                    <Row className="my-3 align-items-center">
                    <Col>
                            <Form.Label className="fs-18 lato-bold mb-0">Altas del mes:</Form.Label>
                        </Col>
                        <Col xs="auto">
                            <div className="lato-bold d-flex align-items-center">
                                <FontAwesomeIcon className="me-2 fs-18 color-verde" icon={faCircleArrowUp} />
                                <span className="fs-18">{datosExcelCRMsemanal?.totalAltas ?? 'Sin datos'}</span>
                            </div>
                        </Col>
                        <Col xs="auto">
                            <Form.Label className="fs-18 lato-bold mb-0" style={{ color: "#292B2F" }}>
                                Filtrar por Provincia
                            </Form.Label>
                        </Col>
                        <Col xs="auto">
                            <Select
                                className="select__control_custom-inicio select__control_custom lato-bold fs-12"
                                classNamePrefix="select"
                                options={provincias} // Usar las provincias del contexto
                                onChange={(opcion) => setProvinciaSeleccionada(opcion ? opcion.value : null)}
                                placeholder="Seleccione..."
                                value={provincias.find(option => option.value === provinciaSeleccionada)} // Precargar provincia seleccionada
                                isClearable
                            />
                        </Col>
                        
                <Col xs="auto">
                            <Form.Label className="fs-18 lato-bold mb-0">Bajas del mes:</Form.Label>
                        </Col>
                        <Col xs="auto">
                            <div className="lato-bold d-flex align-items-center">
                                <FontAwesomeIcon className="me-2 fs-18 color-rojo" icon={faCircleArrowDown} />
                                <span className="fs-18">{datosExcelCRMsemanal?.totalBajas ?? 'Sin datos'}</span>
                            </div>
                        </Col>
                    </Row>
                </div>
            </div>
            <div>
                <TituloPagina title='Reporte Mensual de Facturación' />
            </div>
            <div>
                {datosFacturacionMensual ? (
                    <ComponenteTablaMensual datos={datosFacturacionMensual} />
                ) : (
                    <div>No hay datos de facturación mensual disponibles.</div>
                )}
            </div>
            <div>
                <Footer />
            </div>
        </>
    );
};

export default ReporteMensual;
