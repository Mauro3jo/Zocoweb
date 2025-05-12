import React, {useEffect, useState, useContext} from 'react'
import { DarkModeContext } from '../../context/DarkModeContext';
import { FacturacionContext } from '../../context/FacturacionContext';
import TituloPagina from '../../components/TituloPagina';
import BienvenidaFlor from '../../components/PanelFlorencia/BienvenidaFlor';
import Select from 'react-select';
import { Col, Form, Row } from 'react-bootstrap';
import ContenidoInicio from '../../components/PanelFlorencia/ContenidoInicio';
import Footer from '../../components/Footer';
import Swal from 'sweetalert2';
import { useNavigate } from 'react-router-dom';
import logo from "../../assets/img/logo.png";
import ContenidoAltasBajas from '../../components/PanelFlorencia/ContenidoAltasBajas';
import {
    faCircleArrowDown,
    faCircleArrowUp,
} from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";


const ReporteSemanal = () => {
    const { darkMode } = useContext(DarkModeContext);
    const {datosPanel, datosExcelCRMsemanal}= useContext(FacturacionContext)
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
  return (
    <>
    <div className='pt-5'>
                <BienvenidaFlor datosPanel={datosPanel} />
    </div>
    <div>
                <TituloPagina title='Reporte Semanal de altas y bajas' />
            </div>
            <div >
            <div>
  {datosExcelCRMsemanal ? (
    <ContenidoAltasBajas altas={datosExcelCRMsemanal.altas} bajas={datosExcelCRMsemanal.bajas} />
  ) : (
    <div>No hay datos disponibles.</div>
  )}
</div>
               
            </div>
    <div>
                <Footer />
            </div>
    </>
  )
}

export default ReporteSemanal