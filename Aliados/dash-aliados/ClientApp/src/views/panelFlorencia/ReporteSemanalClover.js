import React, { useEffect, useState, useContext } from 'react';
import { DarkModeContext } from '../../context/DarkModeContext';
import TituloPagina from '../../components/TituloPagina';
import Footer from '../../components/Footer';
import Swal from 'sweetalert2';
import { useNavigate } from 'react-router-dom';
import logo from '../../assets/img/logo.png';
import ContenidoReporteSemanalClover from '../../components/PanelFlorencia/ContenidoReporteSemanalClover';

const ReporteSemanalClover = () => {
    const { darkMode } = useContext(DarkModeContext);
    const apiUrlToken = process.env.REACT_APP_API_TOKEN;
    const navegacion = useNavigate();
    const [cargando, setCargando] = useState(false);

    useEffect(() => {
        const verificarToken = async () => {
            const token = sessionStorage.getItem('token');

            if (!token) {
                manejarRespuestaNoAutorizada();
                return;
            }

            try {
                const response = await fetch(apiUrlToken, {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json',
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
                        throw new Error('Respuesta no satisfactoria del servidor');
                    }
                }
            } catch (error) {
                console.error('Error al validar el token', error);
            }
        };

        const redireccionar = () => {
            navegacion('/');
            recargarPagina();
        };

        const manejarRespuestaNoAutorizada = () => {
            sessionStorage.removeItem('token');

            Swal.fire({
                title: 'Sesión expirada o token inválido.',
                text: 'Inicie sesión nuevamente.',
                imageUrl: logo,
                imageWidth: 100,
                imageHeight: 30,
                imageAlt: 'Logo',
                confirmButtonText: 'Ok',
                timer: 5000,
                allowOutsideClick: true,
                customClass: {
                    container: darkMode
                        ? 'swal2-container--dark'
                        : 'swal2-container--light',
                    confirmButton: 'my-swal-button',
                },
            }).then(redireccionar);
        };

        const manejarAccesoDenegado = () => {
            Swal.fire({
                title: 'Acceso denegado.',
                text: 'No tiene permisos para acceder.',
                imageUrl: logo,
                imageWidth: 100,
                imageHeight: 30,
                imageAlt: 'Logo',
                confirmButtonText: 'Ok',
                timer: 5000,
                allowOutsideClick: true,
                customClass: {
                    container: darkMode
                        ? 'swal2-container--dark'
                        : 'swal2-container--light',
                    confirmButton: 'my-swal-button',
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
            <div className="pt-5">
                <TituloPagina title="Reporte Semanal Clover" />
            </div>
            <div className="mt-4">
               <ContenidoReporteSemanalClover/>
            </div>
            <div>
                <Footer />
            </div>
        </>
    );
};

export default ReporteSemanalClover;
