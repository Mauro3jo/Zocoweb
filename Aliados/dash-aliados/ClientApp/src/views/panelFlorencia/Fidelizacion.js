import React, { useContext, useEffect, useState } from 'react';
import BienvenidaFlor from '../../components/PanelFlorencia/BienvenidaFlor';
import Footer from '../../components/Footer';
import TablaFidelizacion from '../../components/PanelFlorencia/TablaFidelizacion';
import ModalAgregarSeguimiento from '../../components/PanelFlorencia/ModalAgregarSeguimiento';
import { FacturacionContext } from '../../context/FacturacionContext';
import Swal from 'sweetalert2';
import { useNavigate } from 'react-router-dom';
import logo from "../../assets/img/logo.png";
import { DarkModeContext } from '../../context/DarkModeContext';
import { Button,  Col, Form, Row } from 'react-bootstrap';
import {
    faCircleArrowDown,
    faCircleArrowUp,
} from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";

const Fidelizacion = () => {
    const apiUrlToken = process.env.REACT_APP_API_TOKEN;
    const { datosPanel, datosFidelizacion, datosExcelCRMsemanal } = useContext(FacturacionContext);
    const navegacion = useNavigate();
    const [cargando, setCargando] = useState(false);
    const [showModal, setShowModal] = useState(false);
    const { darkMode } = useContext(DarkModeContext);

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

        verificarToken();
    }, []);

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

    function recargarPagina() {
        window.location.reload();
    }

    const abrirModal = () => setShowModal(true);
    const cerrarModal = () => setShowModal(false);

    const recargarDatos = async () => {
        window.location.reload();
    };

    return (
        <div>
            <div className='pt-5'>
                <BienvenidaFlor datosPanel={datosPanel} />
            </div>
            <div className='pt-5'>
                <div className="d-flex justify-content-center mb-4">
                    <Row className="align-items-center">
                         <Col>
                            <Form.Label className="fs-18 lato-bold mb-0">Altas del mes:</Form.Label>
                        </Col>
                        <Col xs="auto">
                            <div className="lato-bold d-flex align-items-center">
                                <FontAwesomeIcon className="me-2 fs-18 color-verde" icon={faCircleArrowUp} />
                                <span className="fs-18">{datosExcelCRMsemanal?.totalAltas ?? 'Sin datos'}</span>
                            </div>
                        </Col>
                <Button  className="btn-publicar border-0 mx-1" onClick={abrirModal} style={{
          width: "200px",
          height: "44px",
          background: "#B4C400",
          color: "#FFFFFF",
          borderRadius: "32px",
        }}>
                    Agregar Seguimiento
                </Button>

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

            <div className='pt-5'>
                {/* Botón para abrir el modal */}
               
                {/* Renderizar la tabla solo si `datosFidelizacion` tiene datos */}
                {datosFidelizacion && datosFidelizacion.length > 0 ? (
                    <TablaFidelizacion datos={datosFidelizacion} />
                ) : (
                    <p className='text-center'>Cargando datos de fidelización...</p>
                )}
            </div>

            {/* Modal para agregar seguimiento */}
            <ModalAgregarSeguimiento
                show={showModal}
                handleClose={cerrarModal}
                onAgregar={recargarDatos}
            />

            <div className='pt-5'>
                <Footer />
            </div>
        </div>
    );
};

export default Fidelizacion;
