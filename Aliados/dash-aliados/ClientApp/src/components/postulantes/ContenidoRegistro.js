import React, { useContext, useState } from "react";
import "./ContenidoRegistro.css";
import { DarkModeContext } from "../../context/DarkModeContext";
import { Form, Button, Spinner } from "react-bootstrap";
import Swal from "sweetalert2";
import ModalAgregarCargo from "./ModalAgregarCargo";
import ModalAgregarEducacion from "./ModalAgregarEducacion";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {faBriefcase,faEdit }from "@fortawesome/free-solid-svg-icons";
import { ReactComponent as Office } from "../../assets/svg/Iconos para interfaz de postulaciones-10.svg";
import { ReactComponent as Job } from "../../assets/svg/Iconos para interfaz de postulaciones-09.svg";

const ContenidoRegistro = () => {
    const { darkMode } = useContext(DarkModeContext);
    const [errores, setErrores] = useState({});

    // Estado para almacenar el postulante
    const [postulante, setPostulante] = useState({
        Nombre: "",
        Correo: "",
        Telefono: "",
        FechaCreacion: new Date().toISOString(),
        Cv: null,
        Direccion: "",
        Contraseña: "",
        Dni: "",
        Estado: "activo",
        TipoUsuario: 9,
        Provincia: "",
        Localidad: "",
        CargosAnteriores: [],
        Educaciones: [],
        Aptitudes: [],
        Linkedin: "", // también deberías inicializar esto si lo estás usando en el formulario
        Genero: "", // ✅ esto es lo que te falta
        RepeatPassword: "", // ✅ opcional: inicializalo también si vas a usarlo en value
    });


    const [nuevaAptitud, setNuevaAptitud] = useState(""); // ✅ Estado para una aptitud nueva


    const [isLoading, setIsLoading] = useState(false);
    const [buttonText, setButtonText] = useState("Registrar");
    const [seccion, setSeccion] = useState("personal");

    // Modales de Cargo
    const [showModalCargo, setShowModalCargo] = useState(false);
    const [cargoEditando, setCargoEditando] = useState(null);

    // Modales de Educación
    const [showModalEducacion, setShowModalEducacion] = useState(false);
    const [educacionEditando, setEducacionEditando] = useState(null);

    // Manejo de cambios en los campos
    const handleInputChange = (e) => {
        const { name, value } = e.target;

        // Solo permitir números en DNI y Telefono
        if (name === "Dni" || name === "Telefono") {
            const regex = /^[0-9\b]+$/; // solo números
            if (value === '' || regex.test(value)) {
                setPostulante((prevState) => ({
                    ...prevState,
                    [name]: value,
                }));
            }
        } else {
            setPostulante((prevState) => ({
                ...prevState,
                [name]: value,
            }));
        }
    };



    // Manejar selección del archivo (CV) y convertirlo a Base64
    const handleFileChange = (e) => {
        const file = e.target.files[0];
        if (file) {
            const reader = new FileReader();
            reader.readAsDataURL(file);
            reader.onloadend = () => {
                setPostulante({ ...postulante, Cv: reader.result.split(",")[1] });
            };
        }
    };

    // Agregar o Editar un Cargo
    const guardarCargo = (nuevoCargo) => {
        setPostulante({
            ...postulante,
            CargosAnteriores: cargoEditando
                ? postulante.CargosAnteriores.map((cargo) =>
                    cargo === cargoEditando ? nuevoCargo : cargo
                )
                : [...postulante.CargosAnteriores, nuevoCargo],
        });
        setShowModalCargo(false);
        setCargoEditando(null);
    };

    // Agregar o Editar una Educación
    const guardarEducacion = (nuevaEducacion) => {
        setPostulante({
            ...postulante,
            Educaciones: educacionEditando
                ? postulante.Educaciones.map((edu) =>
                    edu === educacionEditando ? nuevaEducacion : edu
                )
                : [...postulante.Educaciones, nuevaEducacion],
        });

        setShowModalEducacion(false);
        setEducacionEditando(null);
    };

    // Manejo del envío del formulario
    const handleSubmit = async (e) => {
        e.preventDefault();
        const nuevosErrores = {};

        // Campos obligatorios
        if (!postulante.Nombre) nuevosErrores.Nombre = "Este campo es obligatorio";
        if (!postulante.Contraseña) nuevosErrores.Contraseña = "Este campo es obligatorio";
        if (!postulante.RepeatPassword) nuevosErrores.RepeatPassword = "Este campo es obligatorio";
        if (postulante.Contraseña && postulante.RepeatPassword && postulante.Contraseña !== postulante.RepeatPassword) {
            nuevosErrores.RepeatPassword = "Las contraseñas no coinciden";
        }
        if (!postulante.Correo) {
            nuevosErrores.Correo = "Este campo es obligatorio";
        } else if (!/\S+@\S+\.\S+/.test(postulante.Correo)) {
            nuevosErrores.Correo = "Debe ser un correo electrónico válido";
        }
        if (!postulante.Dni) nuevosErrores.Dni = "Este campo es obligatorio";
        if (!postulante.Provincia) nuevosErrores.Provincia = "Este campo es obligatorio";
        if (!postulante.Localidad) nuevosErrores.Localidad = "Este campo es obligatorio";
        if (!postulante.Direccion) nuevosErrores.Direccion = "Este campo es obligatorio";
        if (!postulante.Telefono) {
            nuevosErrores.Telefono = "Este campo es obligatorio";
        }
        if (postulante.CargosAnteriores.length === 0) {
            nuevosErrores.CargosAnteriores = "Es obligatorio cargar al menos una experiencia";
        }

        if (postulante.Educaciones.length === 0) {
            nuevosErrores.Educaciones = "Es obligatorio cargar al menos una educación";
        }

        if (!postulante.Linkedin) {
            nuevosErrores.Linkedin = "Este campo es obligatorio";
        }
        if (!postulante.Genero) {
            nuevosErrores.Genero = "Este campo es obligatorio";
        }
        if (
            postulante.Contraseña &&
            postulante.RepeatPassword &&
            postulante.Contraseña !== postulante.RepeatPassword
        ) {
            const mensaje = "Las contraseñas no coinciden";
            nuevosErrores.Contraseña = mensaje;
            nuevosErrores.RepeatPassword = mensaje;
        }
        setErrores(nuevosErrores);

        if (Object.keys(nuevosErrores).length > 0) {
            return; // ⛔ No enviar si hay errores
        }

        setIsLoading(true);

        try {
            const response = await fetch("api/postulantes/crearpostulante", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify(postulante),
            });

            const result = await response.json();

            if (response.ok) {
                Swal.fire("Éxito", "Registro completado", "success");
            } else {
                Swal.fire("Error", result.message || "Error al registrar", "error");
            }
        } catch (error) {
            Swal.fire("Error", "No se pudo conectar con el servidor", "error");
        } finally {
            setIsLoading(false);
        }
    };

    const formatFechaMesAnio = (fechaStr) => {
        if (!fechaStr) return "";
        const fecha = new Date(fechaStr);
        return new Intl.DateTimeFormat("es-AR", {
          month: "long",
          year: "numeric",
        }).format(fecha);
    }; const validarEmail = () => {
        if (postulante.Correo && !/\S+@\S+\.\S+/.test(postulante.Correo)) {
            setErrores((prev) => ({
                ...prev,
                Correo: "Por favor ingrese un correo electrónico válido",
            }));
        } else {
            setErrores((prev) => {
                const nuevosErrores = { ...prev };
                delete nuevosErrores.Correo;
                return nuevosErrores;
            });
        }
    };

    return (
        <div className="container">
            <div className="pb-3 text-center" style={{ marginTop: "5em" }}>
                <h6 className="lato-bold fs-24">Perfil de candidato</h6>
            </div>

            <div className="bg-register s py-5">
                {/* Botones para cambiar entre secciones */}
                <div className="d-flex justify-content-center my-4">
                    <button
                        className={`btn-tab ${seccion === "personal" ? "active" : ""}`}
                        onClick={() => setSeccion("personal")}
                        type="button"
                    >
                        Información Personal
                    </button>
                    <button
                        className={`btn-tab ${seccion === "profesional" ? "active" : ""}`}
                        onClick={() => setSeccion("profesional")}
                        type="button"
                    >
                        Información Profesional
                    </button>
                </div>

                <Form onSubmit={handleSubmit}>
                    {/* Sección de Información Personal */}
                    {seccion === "personal" ? (
                        <>
                            <div className="row container">
                                <article className="d-flex justify-content-center my-3 col-6 flex-column">
                                    <div className="input-group">
                                        <div className="label-wrapper">
                                            <label htmlFor="nombre">Nombre Completo</label>
                                            {errores.Nombre && <span className="error-msg-inline">{errores.Nombre}</span>}
                                        </div>
                                        <input
                                            type="text"
                                            id="nombre"
                                            className={`formdatos ${errores.Nombre ? "input-error" : ""}`}
                                            name="Nombre"
                                            value={postulante.Nombre}
                                            onChange={handleInputChange}
                                        />
                                    </div>

                                    <div className="input-group">
                                        <div className="label-wrapper">
                                            <label htmlFor="password">Contraseña</label>
                                            {errores.Contraseña && <span className="error-msg-inline">{errores.Contraseña}</span>}
                                        </div>
                                        <input
                                            type="password"
                                            id="password"
                                            className={`formdatos ${errores.Contraseña ? "input-error" : ""}`}
                                            name="Contraseña"
                                            value={postulante.Contraseña}
                                            onChange={handleInputChange}
                                        />
                                    </div>

                                    <div className="input-group">
                                        <div className="label-wrapper">
                                            <label htmlFor="email">Email</label>
                                            {errores.Correo && <span className="error-msg-inline">{errores.Correo}</span>}
                                        </div>
                                        <input
                                            type="text"
                                            id="email"
                                            className={`formdatos ${errores.Correo ? "input-error" : ""}`}
                                            name="Correo"
                                            value={postulante.Correo}
                                            onChange={handleInputChange}
                                            onBlur={validarEmail}
                                        />


                                    </div>

                                    <div className="input-group">
                                        <div className="label-wrapper">
                                            <label htmlFor="genero">Género</label>
                                            {errores.Genero && <span className="error-msg-inline">{errores.Genero}</span>}
                                        </div>
                                        <select
                                            id="genero"
                                            className={`formdatos ${errores.Genero ? "input-error" : ""}`}
                                            value={postulante.Genero}
                                            onChange={(e) =>
                                                setPostulante((prev) => ({ ...prev, Genero: e.target.value }))
                                            }
                                        >

                                            <option value="">Seleccionar un género</option>
                                            <option value="Masculino">Masculino</option>
                                            <option value="Femenino">Femenino</option>
                                            <option value="Otro">Otro</option>
                                        </select>

                                    </div>
                                </article>

                                <article className="d-flex justify-content-center my-3 col-6 flex-column">
                                    <div className="input-group">
                                        <div className="label-wrapper">
                                            <label htmlFor="dni">DNI</label>
                                            {errores.Dni && <span className="error-msg-inline">{errores.Dni}</span>}
                                        </div>
                                        <input
                                            type="text"
                                            id="dni"
                                            className={`formdatos ${errores.Dni ? "input-error" : ""}`}
                                            name="Dni"
                                            value={postulante.Dni}
                                            onChange={handleInputChange}
                                            pattern="\d*"
                                            inputMode="numeric"
                                        />

                                    </div>

                                    <div className="input-group">
                                        <div className="label-wrapper">
                                            <label htmlFor="repeat-password">Repetir Contraseña</label>
                                            {errores.RepeatPassword && <span className="error-msg-inline">{errores.RepeatPassword}</span>}
                                        </div>
                                        <input
                                            type="password"
                                            id="repeat-password"
                                            className={`formdatos ${errores.RepeatPassword ? "input-error" : ""}`}
                                            name="RepeatPassword"
                                            value={postulante.RepeatPassword || ""}
                                            onChange={handleInputChange}
                                        />
                                    </div>

                                    <div className="input-group">
                                        <div className="label-wrapper">
                                            <label htmlFor="telefono">Teléfono</label>
                                            {errores.Telefono && <span className="error-msg-inline">{errores.Telefono}</span>}
                                        </div>
                                        <input
                                            type="text"
                                            id="telefono"
                                            className={`formdatos ${errores.Telefono ? "input-error" : ""}`}
                                            name="Telefono"
                                            value={postulante.Telefono}
                                            onChange={handleInputChange}
                                        />
                                    </div>

                                    <div className="input-group">
                                        <div className="label-wrapper">
                                            <label htmlFor="linkedin">LinkedIn</label>
                                            {errores.Linkedin && <span className="error-msg-inline">{errores.Linkedin}</span>}
                                        </div>
                                        <input
                                            type="text"
                                            id="linkedin"
                                            className={`formdatos ${errores.Linkedin ? "input-error" : ""}`}
                                            name="Linkedin"
                                            value={postulante.Linkedin || ""}
                                            onChange={handleInputChange}
                                        />
                                    </div>
                                </article>
                            </div>

                            <div className="row d-flex justify-content-center container">
                                <div className="separadorRegistro d-flex">
                                    <p className="fs-14 text-light">Ubicación</p>
                                </div>
                            </div>

                            <div className="row container">
                                <article className="d-flex justify-content-center my-3 col-6 flex-column">
                                    <div className="input-group">
                                        <div className="label-wrapper">
                                            <label htmlFor="provincia">Provincia</label>
                                            {errores.Provincia && <span className="error-msg-inline">{errores.Provincia}</span>}
                                        </div>
                                        <input
                                            type="text"
                                            id="provincia"
                                            className={`formdatos ${errores.Provincia ? "input-error" : ""}`}
                                            name="Provincia"
                                            value={postulante.Provincia}
                                            onChange={handleInputChange}
                                        />
                                    </div>
                                </article>

                                <article className="d-flex justify-content-center my-3 col-6 flex-column">
                                    <div className="input-group">
                                        <div className="label-wrapper">
                                            <label htmlFor="localidad">Localidad</label>
                                            {errores.Localidad && <span className="error-msg-inline">{errores.Localidad}</span>}
                                        </div>
                                        <input
                                            type="text"
                                            id="localidad"
                                            className={`formdatos ${errores.Localidad ? "input-error" : ""}`}
                                            name="Localidad"
                                            value={postulante.Localidad}
                                            onChange={handleInputChange}
                                        />
                                    </div>
                                </article>
                            </div>

                            <div className="row container">
                                <article className="d-flex justify-content-center my-3 col-6 flex-column">
                                    <div className="input-group">
                                        <div className="label-wrapper">
                                            <label htmlFor="direccion">Dirección</label>
                                            {errores.Direccion && <span className="error-msg-inline">{errores.Direccion}</span>}
                                        </div>
                                        <input
                                            type="text"
                                            id="direccion"
                                            className={`formdatos ${errores.Direccion ? "input-error" : ""}`}
                                            name="Direccion"
                                            value={postulante.Direccion}
                                            onChange={handleInputChange}
                                        />
                                    </div>
                                </article>
                            </div>
                        </>


                    ) 
 : (
                            <>
                                <div className="row container d-flex justify-content-center">
                                    {/* Sección de Cargos Anteriores */}
                                    <div className="col-md-6 d-flex flex-column justify-content-center align-items-center">
                                        <h5 className="mb-3 text-center">Cargos Anteriores</h5>

                                        {errores.CargosAnteriores && (
                                            <p className="text-danger fs-14 mb-2">{errores.CargosAnteriores}</p>
                                        )}

                                        <div className="mt-3">
                                            {postulante.CargosAnteriores.map((cargo, index) => (
                                                <div key={index} className="carta-trabajo border p-2 rounded">
                                                    <h6 className="fs-24 text-center">Experiencia Laboral</h6>
                                                    <article className="row">
                                                        <article className="col-6 d-flex justify-content-center align-items-center">
                                                            <div>
                                                                <Job className="icon-register" />
                                                            </div>
                                                        </article>
                                                        <article className="col-6 d-flex justify-content-center align-items-center">
                                                            <div>
                                                                <strong>{cargo.TipoEmpleo}</strong>
                                                            </div>
                                                        </article>
                                                    </article>
                                                    <article className="row">
                                                        <article className="col-6 d-flex flex-column justify-content-center align-items-center">
                                                            <div>
                                                                <p className="fs-16 lato-bold text-center">{cargo.Empresa}</p>
                                                                <p className="fs-14">
                                                                    {formatFechaMesAnio(cargo.FechaInicio)} -{" "}
                                                                    {cargo.FechaFin === "" ? "Actualmente" : formatFechaMesAnio(cargo.FechaFin)}
                                                                </p>
                                                            </div>
                                                        </article>
                                                        <article className="col-6 d-flex justify-content-center">
                                                            <div>
                                                                <Button
                                                                    size="sm"
                                                                    className="btn-publicar border-0 me-2"
                                                                    onClick={() => {
                                                                        setCargoEditando(cargo);
                                                                        setShowModalCargo(true);
                                                                    }}
                                                                    style={{
                                                                        padding: "0 6px",
                                                                        fontSize: "12px",
                                                                        borderRadius: "32px",
                                                                    }}
                                                                >
                                                                    <FontAwesomeIcon icon={faEdit} />
                                                                </Button>
                                                            </div>
                                                        </article>
                                                    </article>
                                                </div>
                                            ))}
                                            <Button
                                                className="btn-publicar buttonAgregar border-0"
                                                onClick={() => {
                                                    setShowModalCargo(true);
                                                    setCargoEditando(null);
                                                }}
                                                style={{ borderRadius: "32px", marginTop: "1em" }}
                                            >
                                                Añadir Experiencia +
                                            </Button>
                                        </div>
                                    </div>

                                    {/* Sección de Educación */}
                                    <div className="col-md-6 d-flex flex-column justify-content-center align-items-center">
                                        <h5 className="fs-24 text-center">Educación</h5>

                                        {errores.Educaciones && (
                                            <p className="text-danger fs-14 mb-2">{errores.Educaciones}</p>
                                        )}

                                        <div className="mt-3">
                                            {postulante.Educaciones.map((edu, index) => (
                                                <div key={index} className="carta-trabajo border p-2 rounded">
                                                    <h6 className="fs-24 text-center">Experiencia Laboral</h6>
                                                    <article className="row">
                                                        <article className="col-3 d-flex justify-content-center align-items-center">
                                                            <div>
                                                                <Office className="icon-register" />
                                                            </div>
                                                        </article>
                                                        <article className="col-3 d-flex justify-content-center align-items-center">
                                                            <div>
                                                                <strong>{edu.Titulo}</strong>
                                                            </div>
                                                        </article>
                                                        <article className="col-4 d-flex flex-column justify-content-center align-items-center">
                                                            <div>
                                                                <p className="fs-16">{edu.InstitucionEducativa}</p>
                                                                <p className="fs-14">{edu.FechaInicio} - {edu.FechaFin}</p>
                                                            </div>
                                                        </article>
                                                        <article className="col-2 d-flex justify-content-center align-items-center">
                                                            <div>
                                                                <Button
                                                                    size="sm"
                                                                    className="btn-publicar border-0 me-2"
                                                                    onClick={() => {
                                                                        setEducacionEditando(edu);
                                                                        setShowModalEducacion(true);
                                                                    }}
                                                                    style={{
                                                                        padding: "0 6px",
                                                                        fontSize: "12px",
                                                                        borderRadius: "32px",
                                                                    }}
                                                                >
                                                                    <FontAwesomeIcon icon={faEdit} />
                                                                </Button>
                                                            </div>
                                                        </article>
                                                    </article>
                                                </div>
                                            ))}
                                            <Button
                                                className="btn-publicar buttonAgregar border-0"
                                                onClick={() => {
                                                    setShowModalEducacion(true);
                                                    setEducacionEditando(null);
                                                }}
                                                style={{ borderRadius: "32px", marginTop: "1em" }}
                                            >
                                                Agregar Educación +
                                            </Button>
                                        </div>
                                    </div>
                                </div>

                                {/* Modal de Cargos */}
                                <ModalAgregarCargo
                                    show={showModalCargo}
                                    handleClose={() => setShowModalCargo(false)}
                                    guardarCargo={guardarCargo}
                                    cargoEditando={cargoEditando}
                                />

                                {/* Modal de Educación */}
                                <ModalAgregarEducacion
                                    show={showModalEducacion}
                                    handleClose={() => setShowModalEducacion(false)}
                                    guardarEducacion={guardarEducacion}
                                    educacionEditando={educacionEditando}
                                />

                                {/* Sección de Aptitudes */}
                                <div className="container mt-4">
                                    <h5 className="mb-3">Aptitudes</h5>
                                    <div className="d-flex gap-2">
                                        <input
                                            type="text"
                                            className="form-control"
                                            placeholder="Agregar nueva aptitud"
                                            value={nuevaAptitud}
                                            onChange={(e) => setNuevaAptitud(e.target.value)}
                                        />
                                        <Button
                                            variant="success"
                                            onClick={() => {
                                                if (nuevaAptitud.trim()) {
                                                    setPostulante({
                                                        ...postulante,
                                                        Aptitudes: [...postulante.Aptitudes, { Aptitud: nuevaAptitud }],
                                                    });
                                                    setNuevaAptitud("");
                                                }
                                            }}
                                        >
                                            +
                                        </Button>
                                    </div>
                                    <div className="mt-3">
                                        {postulante.Aptitudes.map((apt, index) => (
                                            <div key={index} className="border p-2 rounded d-flex justify-content-between">
                                                <span>{apt.Aptitud}</span>
                                                <Button
                                                    variant="danger"
                                                    size="sm"
                                                    onClick={() => {
                                                        setPostulante({
                                                            ...postulante,
                                                            Aptitudes: postulante.Aptitudes.filter((_, i) => i !== index),
                                                        });
                                                    }}
                                                >
                                                    X
                                                </Button>
                                            </div>
                                        ))}
                                    </div>
                                </div>
                            </>


                    )}

                    {/* Botón de envío */}
                    <div className="d-flex justify-content-center">
                        <Button
                            disabled={isLoading}
                            className={isLoading ? "my-4 btn-login-disabled lato-bold border-0" : "my-4 btn-login lato-bold border-0"}
                            type="submit"
                        >
                            {isLoading ? (
                                <>
                                    Loading...
                                    <Spinner as="span" animation="border" size="sm" role="status" aria-hidden="true" />
                                </>
                            ) : (
                                buttonText
                            )}
                        </Button>
                    </div>
                </Form>
            </div>
        </div>
    );
};

export default ContenidoRegistro;
