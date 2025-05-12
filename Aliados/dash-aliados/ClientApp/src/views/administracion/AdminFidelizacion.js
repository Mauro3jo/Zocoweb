import React, { useContext, useEffect, useState } from 'react';
import BienvenidoAdmin from "../../components/administracion/BienvenidoAdmin";
import Footer from '../../components/Footer';
import TablaFidelizacion from '../../components/PanelFlorencia/TablaFidelizacion';
import ModalAgregarSeguimiento from '../../components/PanelFlorencia/ModalAgregarSeguimiento';
import { FidelizacionContext } from '../../context/FidelizacionContext'; // Cambio aquí
import Swal from 'sweetalert2';
import { useNavigate } from 'react-router-dom';
import logo from "../../assets/img/logo.png";
import { DarkModeContext } from '../../context/DarkModeContext';
import { Button } from 'react-bootstrap';

const AdminFidelizacion = () => {
    const apiUrlToken = process.env.REACT_APP_API_TOKEN;
    const { datosFidelizacion, fetchDatosFidelizacion } = useContext(FidelizacionContext); // Cambio aquí
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
                    if (data !== 8) { 
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
        fetchDatosFidelizacion(); // Obtener los datos de fidelización
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
        fetchDatosFidelizacion(); // Recargar los datos al agregar un seguimiento
    };

    return (
        <div>
            <div className='pt-5'>
                <BienvenidoAdmin />
            </div>
            <div className='pt-5'>
                <div className="d-flex justify-content-center mb-4">
                    <Button className="btn-publicar border-0 mx-1" onClick={abrirModal} style={{
                        width: "200px",
                        height: "44px",
                        background: "#B4C400",
                        color: "#FFFFFF",
                        borderRadius: "32px",
                    }}>
                        Agregar Seguimiento
                    </Button>
                </div>
            </div>

            <div className='pt-5'>
                {datosFidelizacion && datosFidelizacion.length > 0 ? (
                    <TablaFidelizacion datos={datosFidelizacion} />
                ) : (
                    <p className='text-center'>Cargando datos de fidelización...</p>
                )}
            </div>

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

export default AdminFidelizacion;
