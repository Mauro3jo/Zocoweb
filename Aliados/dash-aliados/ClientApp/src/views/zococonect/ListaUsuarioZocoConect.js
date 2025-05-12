import React, { useContext, useEffect, useState } from 'react';
import BienvenidaZocoConect from '../../components/ZocoConect/BienvenidoPanelZocoConect';
import Footer from '../../components/Footer';
import TablaFidelizacion from '../../components/PanelFlorencia/TablaFidelizacion';
import TablaUsuarioZocoConect from '../../components/ZocoConect/TablaUsuariosZocoConect'
import Swal from 'sweetalert2';
import { useNavigate } from 'react-router-dom';
import logo from "../../assets/img/logo.png";
import { DarkModeContext } from '../../context/DarkModeContext';

const ListaUsuarioZocoConect = () => {
    const apiUrlToken = process.env.REACT_APP_API_TOKEN;
    const apiUrlListaUsuarios = "/api/zococonect/listausuarioszococonect"; // URL de la API
    const navegacion = useNavigate();
    const [cargando, setCargando] = useState(false);
    const [usuarios, setUsuarios] = useState([]);
    const { darkMode } = useContext(DarkModeContext);
    //console.log(usuarios)
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
                    if (data === 7) {
                        obtenerListaUsuarios(token); // Llama a la función para obtener usuarios
                    } else {
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

    const obtenerListaUsuarios = async (token) => {
        setCargando(true);
        try {
            const response = await fetch(apiUrlListaUsuarios, {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify({ Token: token }),
            });

            if (response.ok) {
                const data = await response.json();
                setUsuarios(data); // Guarda los usuarios en el estado
            } else {
                Swal.fire({
                    title: "Error al cargar datos",
                    text: "No se pudo obtener la lista de usuarios.",
                    icon: "error",
                    confirmButtonText: "Ok",
                });
            }
        } catch (error) {
            console.error("Error al obtener la lista de usuarios", error);
        } finally {
            setCargando(false);
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

    function recargarPagina() {
        window.location.reload();
    }

    return (
        <div>
            <div className='pt-5'>
                <BienvenidaZocoConect />
            </div>

            <div className='pt-5'>
                {cargando ? (
                    <p className='text-center'>Cargando usuarios...</p>
                ) : (
                    usuarios.length > 0 ? (
                            <TablaUsuarioZocoConect datos={usuarios} />
                    ) : (
                        <p className='text-center'>No hay usuarios disponibles.</p>
                    )
                )}
            </div>

            <div className='pt-5'>
                <Footer />
            </div>
        </div>
    );
};

export default ListaUsuarioZocoConect;
