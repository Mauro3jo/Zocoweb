import React, { useContext, useState, useEffect, useRef } from "react";
import { DarkModeContext } from "../../context/DarkModeContext";
import Swal from "sweetalert2";
import { Col, Form, Modal, Row } from "react-bootstrap";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
    faArrowUpFromBracket,
    faCircleExclamation,
    faXmark,
} from "@fortawesome/free-solid-svg-icons";
import logo from "../../assets/img/logo.png";
import { Controller, useForm } from "react-hook-form";
import Select from "react-select";

const ModalCoordenadasGestor = (props) => {
    const { show, onHide } = props;
    const { darkMode } = useContext(DarkModeContext);
    const [isUploading, setIsUploading] = useState(false);
    const [isAudioRequired, setIsAudioRequired] = useState(true); // Estado para controlar si el audio es requerido
    const [isAudioLoading, setIsAudioLoading] = useState(false); // Estado para controlar la carga del audio

    const [formData, setFormData] = useState({
        selectedFile: null,
        selectedRecording: null,
        latitude: null,
        longitude: null,
        nombreLocal: "",
        tipoVisita: "",
        comentario: "",
        imagenTerminal: null,
        cantidadRollos: 0,
    });

    const [isFormValid, setIsFormValid] = useState(true);
    const recordingInputRef = useRef(null);

    const fetchCoordinates = () => {
        if (navigator.geolocation) {
            navigator.geolocation.getCurrentPosition(
                (position) => {
                    setFormData((prevFormData) => ({
                        ...prevFormData,
                        latitude: position.coords.latitude,
                        longitude: position.coords.longitude,
                    }));
                },
                (error) => {
                    console.error("Error fetching coordinates:", error);
                }
            );
        } else {
            console.error("Geolocation is not supported by this browser.");
        }
    };

    const sendLocationToServer = async () => {
        const token = sessionStorage.getItem("token");
        if (!token) {
            Swal.fire(
                "Oops...",
                "No tienes autorización para enviar la ubicación.",
                "error"
            );
            return;
        }
        setIsUploading(true);
        const formDataToSend = new FormData();

        // Añadimos las imágenes como base64
        formDataToSend.append("ImageBase64", formData.selectedFile || null); // Si no hay imagen, enviamos null
        formDataToSend.append("imagenTerminal", formData.imagenTerminal || null); // Si no hay imagen de terminal, enviamos null

        // Añadimos el audio, si es requerido y se ha subido un archivo
        formDataToSend.append(
            "AudioBase64",
            isAudioRequired ? formData.selectedRecording || null : null
        );

        // Agregamos las coordenadas y otros datos del formulario
        formDataToSend.append("Latitud", formData.latitude ? formData.latitude.toString() : null);
        formDataToSend.append("Longitud", formData.longitude ? formData.longitude.toString() : null);
        formDataToSend.append("Local", formData.nombreLocal || "");
        formDataToSend.append("Tipo", formData.tipoVisita || "");
        formDataToSend.append("Token", token);
        formDataToSend.append("Observacion", formData.comentario || "");
        formDataToSend.append("TiempoAudio", formData.audioDuration || null); // Duración del audio, si existe
        formDataToSend.append("CantidadRollos", formData.cantidadRollos || 0); // Cantidad de rollos, si existe

        try {
            const response = await fetch("/api/geo/checkimagenyaudio", {
                method: "POST",
                body: formDataToSend,
            });
            if (!response.ok)
                throw new Error(`HTTP error! Status: ${response.status}`);
            Swal.fire({
                title: "Éxito",
                text: "Datos enviados con éxito.",
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
            }).then(() => {
                onHide();
                window.location.reload();
            });
        } catch (error) {
            console.error("Error al enviar el formulario:", error);
            Swal.fire({
                title: "Error",
                text: "No se pudo enviar los archivos. Por favor verifica tus datos y vuelve a intentarlo.",
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
            }).then(() => onHide());
        } finally {
            setIsUploading(false);
        }
    };


    const formatDuration = (seconds) => {
        const date = new Date(null);
        date.setSeconds(seconds);
        const hours = date.getUTCHours().toString().padStart(2, "0");
        const minutes = date.getUTCMinutes().toString().padStart(2, "0");
        const secs = date.getUTCSeconds().toString().padStart(2, "0");
        return `${hours}:${minutes}:${secs}`;
    };

    const handleInputChange = async (event) => {
        const { name, files, value } = event.target;
        const maxFileSize = 52428800;
        const maxAudioSize = 31457280;

        if (files && files[0]) {
            let fileSizeLimit =
                name === "selectedRecording" ? maxAudioSize : maxFileSize;
            if (files[0].size > fileSizeLimit) {
                await Swal.fire({
                    title: "Archivo demasiado grande",
                    text: `El tamaño del archivo debe ser menor a ${fileSizeLimit / 1048576
                        } MB.`,
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
                });
                setIsFormValid(false);
                return;
            }
            setIsFormValid(true);

            if (name === "selectedFile" || name === "imagenTerminal") {
                convertImageToBase64(files[0], (base64Image) => {
                    setFormData((prevFormData) => ({
                        ...prevFormData,
                        [name]: base64Image,
                    }));
                });
            } else if (name === "selectedRecording") {
                setIsAudioLoading(true); // Comenzar la carga del audio
                const reader = new FileReader();
                reader.onload = (e) => {
                    const base64Audio = e.target.result.split(",")[1];
                    const audio = new Audio(e.target.result);
                    audio.onloadedmetadata = () => {
                        const duration = formatDuration(audio.duration);
                        setFormData((prevFormData) => ({
                            ...prevFormData,
                            selectedRecording: base64Audio,
                            audioDuration: duration, // Agregar duración del audio formateada al estado
                        }));
                        setIsAudioLoading(false); // Terminar la carga del audio
                    };
                };
                reader.readAsDataURL(files[0]);
            }
        } else {
            setFormData((prevFormData) => ({
                ...prevFormData,
                [name]: value,
            }));
        }
    };

    const handleSubmit = (event) => {
        event.preventDefault();
        if (!isFormValid) {
            Swal.fire({
                title: "Error",
                text: "No puedes enviar el formulario porque un archivo es demasiado grande. La grabación tiene que tener un tamaño 30 MB (aprox. 25-30 minutos)",
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
            });
            return;
        }
        sendLocationToServer();
    };

    useEffect(() => {
        if (show) fetchCoordinates();
    }, [show]);

    useEffect(() => {
        // Verificar el motivo seleccionado y ajustar si el audio es requerido
        if (formData.tipoVisita === "Local Cerrado") {
            setIsAudioRequired(false); // No requerido
        } else {
            setIsAudioRequired(true); // Requerido
        }
    }, [formData.tipoVisita]);

    const {
        control,
        reset,
        setValue,
        watch,
        register,
        formState: { errors },
    } = useForm({
        defaultValues: {
            pasoServicioTecnico: [
                { label: "Rollos", checked: false },
                {
                    label: "Cargador",
                    checked: false,
                },
                { label: "Bateria", checked: false },
                { label: "Teclado", checked: false },
                { label: "Inicializar/reiniciar", checked: false },
                { label: "Panel", checked: false },
                { label: "Referido", checked: false },
                { label: "Limpieza de la terminal", checked: false },
                {
                    label: "Actualizar días y horarios de atención (En observaciones)",
                    checked: false,
                },
                {
                    label: "Actualizar número de contacto (En observaciones)",
                    checked: false,
                },
                {
                    label: "Otros (En observaciones)",
                    checked: false,
                },
            ],
        },
    });

    // Función para convertir archivo a Base64
    function convertImageToBase64(file, callback) {
        const reader = new FileReader();
        reader.onload = function (e) {
            const img = new Image();
            img.onload = function () {
                // Definir el tamaño máximo deseado para la imagen
                const maxWidth = 800; // Por ejemplo, 800 píxeles de ancho
                const maxHeight = 600; // Por ejemplo, 600 píxeles de alto
                let width = img.width;
                let height = img.height;

                // Calcular el nuevo tamaño manteniendo la proporción
                if (width > height) {
                    if (width > maxWidth) {
                        height = height * (maxWidth / width);
                        width = maxWidth;
                    }
                } else {
                    if (height > maxHeight) {
                        width = width * (maxHeight / height);
                        height = maxHeight;
                    }
                }

                // Redimensionar la imagen con canvas
                const canvas = document.createElement("canvas");
                canvas.width = width;
                canvas.height = height;
                const ctx = canvas.getContext("2d");
                ctx.drawImage(img, 0, 0, width, height);

                // Convertir la imagen redimensionada a Base64 con una calidad menor para reducir el tamaño
                const base64 = canvas.toDataURL("image/png", 0.5); // Ajusta la calidad aquí entre 0 y 1
                callback(base64);
            };
            img.src = e.target.result;
        };
        reader.onerror = function (error) {
            console.log("Error: ", error);
        };
        reader.readAsDataURL(file);
    }

    const pasoServicioTecnico = watch("pasoServicioTecnico"); // Asegúrate de obtener los pasos desde el form

    const motivos = [
        { id: 1, nombre: "Agrega Terminal" },
        { id: 2, nombre: "Alta" },
        { id: 3, nombre: "Auditoría Cupones" },
        { id: 4, nombre: "Baja - Demoras en los impactos de pagos" },
        { id: 5, nombre: "Baja - Disconformidad con un Pago" },
        { id: 6, nombre: "Baja - Facturación" },
        { id: 7, nombre: "Baja - Mal funcionamiento terminal" },
        { id: 8, nombre: "Baja - Otro Proveedor" },
        { id: 9, nombre: "Baja - Sin Uso" },
        { id: 10, nombre: "Cambio de Boca de Pago" },
        { id: 11, nombre: "Capacitación - Medios de Pagos" },
        { id: 12, nombre: "Capacitación - Panel" },
        { id: 13, nombre: "Comercio en Mantenimiento" },
        { id: 14, nombre: "Consulta Sobre mi Liquidación" },
        { id: 15, nombre: "Contacto Telefónico" },
        { id: 16, nombre: "Entrega Terminal" },
        { id: 17, nombre: "Extracción Reporte Mensual" },
        { id: 18, nombre: "Fidelización" },
        { id: 19, nombre: "Local Cerrado" },
        { id: 20, nombre: "Modificación de Datos" },
        { id: 21, nombre: "Modificación de Tarjetas" },
        { id: 22, nombre: "Otra Consulta" },
        { id: 23, nombre: "Pega QR" },
        { id: 24, nombre: "Prospecto" },
        { id: 24, nombre: "Reposición rollo" },
        { id: 25, nombre: "Retiro Terminal" },
        { id: 26, nombre: "Servicio Técnico" },
        { id: 27, nombre: "Visita Mensual" },
    ];

    const opcionesMotivos = motivos.map((motivo) => ({
        value: motivo.nombre,
        label: motivo.nombre,
    }));

    const [terminales, setTerminales] = useState([]);
    const [error, setError] = useState(null);

    useEffect(() => {
        const fetchTerminales = async () => {
            const token = sessionStorage.getItem("token");

            try {
                const response = await fetch("/api/terminal/obtenerterminales", {
                    method: "POST",
                    headers: {
                        "Content-Type": "application/json",
                    },
                    body: JSON.stringify({
                        Token: token, // Reemplaza esto con el token real
                    }),
                });

                if (!response.ok) {
                    throw new Error("Error en la solicitud");
                }

                const data = await response.json();
                setTerminales(data);
            } catch (error) {
                setError(error.message);
            }
        };

        fetchTerminales();
    }, []);

    const opcionesTerminales = terminales.map((terminal) => ({
        value: terminal,
        label: terminal,
    }));

    return (
        <div translate="no">
            <Modal
                {...props}
                show={show}
                onHide={onHide}
                centered
                size="xl"
                fullscreen={true}
                style={{
                    backgroundColor: "#E5E8EE ",
                    opacity: "1",
                }}
                aria-labelledby="contained-modal-title-vcenter"
            >
                <Modal.Body className={darkMode ? " modal-fondo" : "modal-fondo "}>
                    <section className="modal-contenedor-fondo-1 px-4 d-flex justify-content-between py-2 my-2 ">
                        <div className="ocultar-div mt-1"></div>
                        <div className="d-flex justify-content-center mt-1">
                            <h6 className="fs-18 lato-bold">Subir archivos</h6>
                        </div>
                        <div>
                            <button
                                className="border-0 btn-filtro-cruz mt-1"
                                onClick={onHide}
                            >
                                <FontAwesomeIcon className="fs-18 " icon={faXmark} />
                            </button>
                        </div>
                    </section>

                    <div className=" d-flex justify-content-center">
                        <form className="" onSubmit={handleSubmit}>
                            <section className="modal-contenedor-fondo-1 px-4 py-4">
                                <article className="row py-2">
                                    <div className="form-group col-12">
                                        <label className="fs-14 mb-2 ms-1"> Establecimiento - N° Terminal:</label>
                                        <Controller
                                            name="nombreLocal"
                                            control={control}
                                            rules={{ required: true }}
                                            render={({ field }) => (
                                                <Select
                                                    {...field}
                                                    options={opcionesTerminales}
                                                    className="select-control-custom lato-bold border-0 fs-14"
                                                    classNamePrefix="select"
                                                    placeholder="Establecimiento - N° Terminal"
                                                    isSearchable={false}
                                                    required
                                                    onChange={(selectedOption) => {
                                                        field.onChange(selectedOption.value);
                                                        setFormData((prevFormData) => ({
                                                            ...prevFormData,
                                                            nombreLocal: selectedOption.value,
                                                        }));
                                                    }}
                                                    value={opcionesMotivos.find(
                                                        (option) => option.value === field.value
                                                    )}
                                                />
                                            )}
                                        />
                                        {errors.nombreLocal && (
                                            <span className="fs-12 text-danger ms-1">
                                                Este campo es requerido.
                                            </span>
                                        )}
                                    </div>
                                </article>
                                <article className="row py-2">
                                    <div className="form-group col-12">
                                        <label className="fs-14 mb-2 ms-1">Motivo</label>
                                        <Controller
                                            name="tipoVisita"
                                            control={control}
                                            rules={{ required: true }}
                                            render={({ field }) => (
                                                <Select
                                                    {...field}
                                                    options={opcionesMotivos}
                                                    className="select-control-custom lato-bold border-0 fs-14"
                                                    classNamePrefix="select"
                                                    placeholder="motivo"
                                                    isSearchable={false}
                                                    required
                                                    onChange={(selectedOption) => {
                                                        field.onChange(selectedOption.value);
                                                        setFormData((prevFormData) => ({
                                                            ...prevFormData,
                                                            tipoVisita: selectedOption.value,
                                                        }));
                                                    }}
                                                    value={opcionesMotivos.find(
                                                        (option) => option.value === field.value
                                                    )}
                                                />
                                            )}
                                        />
                                        {errors.tipoVisita && (
                                            <span className="fs-12 text-danger ms-1">
                                                Este campo es requerido
                                            </span>
                                        )}
                                    </div>
                                </article>

                                {formData.tipoVisita === "Prospecto" ? (
                                    <article className="py-2">
                                        <Form.Check
                                            type="checkbox"
                                            label="Días y horarios de atención (En observaciones)"
                                            name="Días y horarios de atención (En observaciones)"
                                        />
                                        <Form.Check
                                            type="checkbox"
                                            label="Especificar Rubro (En observaciones)"
                                            name="Especificar Rubro (En observaciones)"
                                        />
                                        <Form.Check
                                            type="checkbox"
                                            label="Otros (En observaciones)"
                                            name="Otros (En observaciones)"
                                        />
                                    </article>
                                ) : (
                                    <>
                                        <div className="form-group pt-2 pb-4">
                                            <label>
                                                <h6>Verificación de visita</h6>
                                            </label>
                                            {pasoServicioTecnico.map((paso, index) => (
                                                <Form.Check
                                                    key={index}
                                                    type="checkbox"
                                                    className="lato-regular fs-16"
                                                    label={paso.label}
                                                    {...register(`pasoServicioTecnico[${index}].checked`)}
                                                />
                                            ))}
                                        </div>
                                    </>
                                )}
                                <div className="mb-3">
                                    <label htmlFor="cantidadRollos" className="fs-16">
                                        Cantidad de Rollos:
                                    </label>
                                    <input
                                        name="cantidadRollos"
                                        type="number"
                                        className="form-control input-form-editar-comanda"
                                        id="cantidadRollos"
                                        onChange={handleInputChange}
                                        value={formData.cantidadRollos}
                                        required
                                    />
                                </div>

                                <div className="mb-3">
                                    <label htmlFor="comentarioInput" className="fs-16">
                                        Observaciones:
                                    </label>
                                    <textarea
                                        name="comentario"
                                        className="form-control bg-observaciones-gestor"
                                        id="comentarioInput"
                                        onChange={handleInputChange}
                                        rows="4"
                                        required
                                    ></textarea>
                                </div>
                                <div className="pt-2 container">
                                    <h6 className="fs-14 lato-regular">
                                        <FontAwesomeIcon
                                            className="color-rojo"
                                            icon={faCircleExclamation}
                                        />{" "}
                                        <span className="lato-bold">En observaciones: </span>
                                        Enviar los datos relativos a{" "}
                                        <span className="lato-bold">
                                            días y horarios de atención y número de contacto
                                        </span>{" "}
                                        del comercio.
                                    </h6>
                                </div>
                            </section>
                            <section className="modal-contenedor-fondo-1 px-4 py-4 my-2">
                                <div className="mb-3">
                                    <label htmlFor="imageInput" className="fs-16">
                                        Enviá una foto del comercio:
                                    </label>
                                    <input
                                        name="selectedFile"
                                        type="file"
                                        className="form-control input-form-editar-comanda fs-14"
                                        id="imageInput"
                                        onChange={handleInputChange}
                                        accept="image/*"
                                        required
                                    />
                                </div>
                                <div className="mb-3">
                                    <label htmlFor="imagenTerminal" className="fs-16">
                                        Enviá una foto de la Terminal:
                                    </label>
                                    <input
                                        name="imagenTerminal"
                                        type="file"
                                        className="form-control input-form-editar-comanda fs-14"
                                        id="imagenTerminal"
                                        onChange={handleInputChange}
                                        accept="image/*"
                                        required
                                    />
                                </div>
                                <div className="mb-3">
                                    <label htmlFor="recordingInput" className="fs-16">
                                        Enviá una grabación:
                                    </label>
                                    <input
                                        name="selectedRecording"
                                        type="file"
                                        className="form-control input-form-editar-comanda fs-14"
                                        id="recordingInput"
                                        onChange={handleInputChange}
                                        accept="audio/aac,audio/amr,audio/x-caf,audio/alac,audio/mp3,audio/wav,audio/mpeg,audio/mp4,audio/*"
                                        ref={recordingInputRef}
                                        required={isAudioRequired} // Requerido sólo si es necesario
                                    />
                                </div>
                            </section>
                            <article className="d-flex justify-content-center">
                                <button
                                    className="btn-empezar-dia border-0"
                                    disabled={isUploading || isAudioLoading} // Deshabilitar el botón si está cargando o subiendo
                                    type="submit"
                                >
                                    {isUploading ? (
                                        <>
                                            <span
                                                className="spinner-border spinner-border-sm"
                                                role="status"
                                                aria-hidden="true"
                                            ></span>
                                            {" Cargando..."}
                                        </>
                                    ) : (
                                        isAudioLoading ? (
                                            <>
                                                <span
                                                    className="spinner-border spinner-border-sm"
                                                    role="status"
                                                    aria-hidden="true"
                                                ></span>
                                                {" Cargando Audio..."}
                                            </>
                                        ) : (
                                            <>
                                                <FontAwesomeIcon
                                                    className="me-2"
                                                    icon={faArrowUpFromBracket}
                                                />
                                                <span className="lato-bold fs-16">Enviar</span>
                                            </>
                                        )
                                    )}
                                </button>
                            </article>
                        </form>
                    </div>
                </Modal.Body>
            </Modal>
        </div>
    );
};

export default ModalCoordenadasGestor;
