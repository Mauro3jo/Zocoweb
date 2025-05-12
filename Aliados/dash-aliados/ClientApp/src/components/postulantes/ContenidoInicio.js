import React, { useContext, useState, useEffect, useRef, useMemo } from 'react'
import { useNavigate } from 'react-router-dom';

import { DarkModeContext } from '../../context/DarkModeContext'
import { PostulacionesContext } from '../../context/PostulacionesContext'

import { faMagnifyingGlass } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import './ContenidoInicio.css';
import ZocoLogo from '../../assets/img/ZOCO logo.png'
import { ReactComponent as Office } from "../../assets/svg/Iconos para interfaz de postulaciones-10.svg";
import { ReactComponent as Job } from "../../assets/svg/Iconos para interfaz de postulaciones-09.svg";
import { ReactComponent as Time } from "../../assets/svg/Iconos para interfaz de postulaciones-11.svg";
import { ReactComponent as Location } from "../../assets/svg/Iconos para interfaz de postulaciones-12.svg";
import img1 from "../../assets/img/Beneficios y estabilidad.png"
import img2 from "../../assets/img/Buen equipo de trabajo.png"
import img3 from "../../assets/img/Crecimiento profesional.png"
import img4 from "../../assets/img/Impacto real.png"
import img5 from "../../assets/img/Ambiente dinámico.png"
import Swal from 'sweetalert2';
import withReactContent from 'sweetalert2-react-content';
const ContenidoInicio = () => {
    const { darkMode } = useContext(DarkModeContext);
    const { puestosDisponibles, postularse } = useContext(PostulacionesContext);
    const [modalShowCompleta, setModalShowCompleta] = React.useState(false);
    const [cartaActual, setCartaActual] = useState(null);
    const textoRef = useRef();
    const navigate = useNavigate();
    const [esMobile, setEsMobile] = useState(window.innerWidth < 820);
    const [mostrarModal, setMostrarModal] = useState(false);
    const MySwal = withReactContent(Swal);

    const puestosMemo = useMemo(() => puestosDisponibles, [puestosDisponibles]);

    useEffect(() => {
        const handleResize = () => setEsMobile(window.innerWidth < 820);
        window.addEventListener("resize", handleResize);
        return () => window.removeEventListener("resize", handleResize);
    }, []);

    useEffect(() => {
        if (document.fullscreenElement) {
            document.exitFullscreen();
        }
    }, []);

    const verCuestionarios = (idPuesto) => {
        if (!idPuesto) {
            alert("No se pudo obtener el ID del puesto.");
            return;
        }
        navigate("/postulante/cuestionarios", { state: { idPuesto } });
    };

    const copiarAlPortapapeles = (textoParaCopiar) => {
        if (navigator.clipboard) {
            navigator.clipboard.writeText(textoParaCopiar).then(
                () => alert("Texto copiado al portapapeles"),
                (err) => console.error("Error al copiar el texto: ", err)
            );
        } else {
            console.error("La función de copiado no es soportada en este navegador.");
        }
    };

    const descargarImagenBase64 = (base64, nombreArchivo = "descarga.png") => {
        const partes = base64.split(";base64,");
        const tipoMime = partes[0].split(":")[1];
        const binStr = atob(partes[1]);
        let length = binStr.length;
        const arr = new Uint8Array(length);

        while (length--) {
            arr[length] = binStr.charCodeAt(length);
        }

        const blob = new Blob([arr], { type: tipoMime });
        const enlace = document.createElement("a");
        enlace.href = window.URL.createObjectURL(blob);
        enlace.download = nombreArchivo;

        document.body.appendChild(enlace);
        enlace.click();
        document.body.removeChild(enlace);
        window.URL.revokeObjectURL(enlace.href);
    };

    const mostrarModalEditar = (dato) => {
        setCartaActual(dato);
        setModalShowCompleta(true);
    };

    const mostrarDetalles = (dato) => {
        setCartaActual(dato);
        if (esMobile) setMostrarModal(true);
    };
    const verificarSesionAntesDePostularse = async (idPuesto, cerrarModalMobile = null) => {
        const token = sessionStorage.getItem("token");

        if (!token) {
            if (cerrarModalMobile) cerrarModalMobile(); // Cierra el modal de detalles primero

            await new Promise((resolve) => setTimeout(resolve, 200));

            const resultado = await MySwal.fire({
                title: '<span style="font-size: 1.5rem; font-weight: 700">¡Necesitás una cuenta!</span>',
                html: `
                <p style="margin-top: 1em; font-size: 1rem;">
                    Para postularte a esta oferta, tenés que <strong>iniciar sesión</strong> o <strong>registrarte</strong>.
                </p>
                <p style="color: #EA6A6A; font-size: 0.9rem; margin-top: 0.5em;">
                    Si ya tenés cuenta, ingresá. Si no, creá una en segundos.
                </p>
            `,
                iconHtml: '<div style="background-color: #C7D301; color: white; border-radius: 50%; width: 80px; height: 80px; display: flex; align-items: center; justify-content: center; font-size: 32px;">!</div>',
                showCloseButton: true, // ✅ Muestra la X para cerrar
                showCancelButton: false, // ❌ Elimina botón cancelar
                showDenyButton: true,
                confirmButtonText: "Iniciar sesión",
                denyButtonText: "Registrarse",
                buttonsStyling: false,
                customClass: {
                    popup: 'custom-alert-popup',
                    confirmButton: 'custom-confirm-button',
                    denyButton: 'custom-cancel-button',
                    actions: 'alert-mobile-buttons alert-desktop-buttons'
                },
                backdrop: true
            });

            if (resultado.isConfirmed) {
                navigate("/login");
            } else if (resultado.isDenied) {
                navigate("/registropostulante");
            }

            return;
        }

        postularse(idPuesto);
    };




    return (
        <section className='container'>
            <section className='trabajaConNosotros' id='trabajaconnosotros'>
                <div className='tarjetas-trabajar-con-nosotros'>
                    <div className='row d-flex justify-content-center'>
                        <h2 className='text-center fs-24 lato-bold' style={{ marginBottom: "1em", marginTop: "2em" }}>
                            ¿Por qué trabajar con nosotros?
                        </h2>
                        {[img3, img5, img4, img2, img1].map((img, i) => (
                            <article className='carta-promocionarse' key={i}>
                                <img alt='razon' src={img} className='imgWork' loading="lazy" />
                            </article>
                        ))}
                    </div>
                </div>
            </section>

            <section id='ofertasdetrabajo'>
                <div className='row'>
                    <div className='d-flex justify-content-center contenedorbutton' style={{ marginBottom: "1em", marginTop: "3em" }}>
                        <button
                            className={darkMode ? " bg-data-puestos-dark border-0 quitar-cursor-pointer" : "bg-data-puestos border-0 quitar-cursor-pointer"}
                            style={{ display: "flex", justifyContent: "center", alignItems: "center", height: "55px" }}
                        >
                            Ofertas de trabajo
                        </button>
                    </div>

                    <article className='d-flex justify-content-center'>
                        <div className='input-container'>
                            <FontAwesomeIcon icon={faMagnifyingGlass} className="search-icon" />
                            <input type='search' className='buscarPuestos' placeholder="Buscar puestos..." />
                        </div>
                    </article>
                </div>

                <div className='row' style={{ marginBottom: "1em" }}>
                    <article className={esMobile ? 'col-12' : 'col-5'}>
                        <div className="contenedor-puestos">
                            {puestosMemo.map((dato, id) => (
                                <div key={id} onClick={() => mostrarDetalles(dato)} style={{ display: "flex", justifyContent: "center", cursor: 'pointer' }}>
                                    <article className={darkMode ? "cartas-posiciones-dark py-2 my-2" : "cartas-posiciones py-2 my-2"}>
                                        <h6 className="titulo-cartas fs-22">{dato.nombre}</h6>
                                        <p className="texto-cartas"><strong>Provincia:</strong> {dato.provincia}</p>
                                        <p className="texto-cartas"><strong>Localidad:</strong> {dato.localidad}</p>
                                    </article>
                                </div>
                            ))}
                        </div>
                    </article>

                    {!esMobile && (
                        <article className='col-7'>
                            <div className='contenedor-postulacion'>
                                <div className={darkMode ? "carta-postulaciones-resultados-dark p-4" : "carta-postulaciones-resultados p-4"}>
                                    {cartaActual ? (
                                        <div className='col-12 d-flex flex-column align-items-start'>
                                            <article className='contenido-card'>
                                                <div className='row'>
                                                    <div className='col-8 d-flex flex-column'>
                                                        <h4 className="pb-2">{cartaActual.nombre}</h4>
                                                        <h6><Location className='iconoLocacion' />{cartaActual.localidad}, {cartaActual.provincia}</h6>
                                                    </div>
                                                    <div className='col-xl-4 col-12'>
                                                        {cartaActual.haPostulado ? (
                                                            <button className="btn-publicar border-0 mx-1 text-center"
                                                                style={{ width: "200px", height: "44px", background: "#007BFF", color: "#FFFFFF", borderRadius: "32px" }}
                                                                onClick={() => verCuestionarios(cartaActual.id)}>
                                                                Ver Cuestionarios
                                                            </button>
                                                        ) : (
                                                                <button
                                                                    className="btn-publicar border-0 mx-1 text-center"
                                                                    style={{
                                                                        width: "144px",
                                                                        height: "44px",
                                                                        background: "#B4C400",
                                                                        color: "#FFFFFF",
                                                                        borderRadius: "32px",
                                                                        marginTop: "1em"
                                                                    }}
                                                                    onClick={() => verificarSesionAntesDePostularse(cartaActual.id)}
                                                                >
                                                                    Postularse
                                                                </button>

                                                        )}
                                                    </div>
                                                </div>
                                                <div className="separator"></div>
                                                <p className='fs-14' style={{ color: "#424960" }}><Job className='iconoPostulante' />{cartaActual.duracion}</p>
                                                <p className='fs-14' style={{ color: "#424960" }}><Time className='iconoPostulante' />{cartaActual.jornada}</p>
                                                <p className='fs-14' style={{ color: "#424960" }}><Office className='iconoPostulante' />{cartaActual.modalidad}</p>
                                                <div className='contenidoPost'>
                                                    <h6><strong>Requisitos:</strong></h6>
                                                    <p className='fs-16'>{cartaActual.requisitos}</p>
                                                </div>
                                                <div className='contenidoPost'>
                                                    <h6><strong>Principales Tareas:</strong></h6>
                                                    <p className='fs-16'>{cartaActual.principalesTareas}</p>
                                                </div>
                                                <div className='contenidoPost'>
                                                    <h6><strong>Ofrecemos:</strong></h6>
                                                    <p className='fs-16'>{cartaActual.ofrecemos}</p>
                                                </div>
                                            </article>
                                        </div>
                                    ) : (
                                        <div style={{ height: "100%", display: "flex", alignItems: "center" }}>
                                            <p className='text-muted'>Haz clic en una tarjeta para ver los detalles.</p>
                                        </div>
                                    )}
                                </div>
                            </div>
                        </article>
                    )}

                    {esMobile && mostrarModal && cartaActual && (
                        <div className="modal-overlay">
                            <div className={darkMode ? "carta-postulaciones-resultados-dark modal-card-mobile" : "carta-postulaciones-resultados modal-card-mobile"}>
                                <button className="cerrar-modal" onClick={() => setMostrarModal(false)}>✕</button>
                                <div className="contenido-modal p-4">
                                    <h4>{cartaActual.nombre}</h4>
                                    <div className='separatorMobile'></div>
                                    <p><Location className='iconoLocacion' /> {cartaActual.localidad}, {cartaActual.provincia}</p>
                                    <p><Job className='iconoPostulante' /> {cartaActual.duracion}</p>
                                    <p><Time className='iconoPostulante' /> {cartaActual.jornada}</p>
                                    <p><Office className='iconoPostulante' /> {cartaActual.modalidad}</p>
                                    <h6>Requisitos:</h6><p>{cartaActual.requisitos}</p>
                                    <h6>Principales Tareas:</h6><p>{cartaActual.principalesTareas}</p>
                                    <h6>Ofrecemos:</h6><p>{cartaActual.ofrecemos}</p>
                                    {cartaActual.haPostulado ? (
                                        <button className="btn-publicar border-0 mx-1 text-center"
                                            style={{ width: "144px", height: "44px", background: "#007BFF", color: "#FFFFFF", borderRadius: "32px", marginTop: "1em" }}
                                            onClick={() => verCuestionarios(cartaActual.id)}>
                                            Ver Cuestionarios
                                        </button>
                                    ) : (
                                            <button
                                                className="btn-publicar border-0 text-center w-100"
                                                style={{
                                                    height: "44px",
                                                    background: "#B4C400",
                                                    color: "#FFFFFF",
                                                    borderRadius: "32px",
                                                    marginTop: "1em"
                                                }}
                                                onClick={() => verificarSesionAntesDePostularse(cartaActual.id, () => setMostrarModal(false))}
                                            >
                                                Postularse
                                            </button>

                                    )}
                                </div>
                            </div>
                        </div>
                    )}
                </div>
            </section>
        </section>
    );
};

export default ContenidoInicio;