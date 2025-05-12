import React, { useContext, useState } from "react";
import { Modal, Spinner } from "react-bootstrap";
import { Controller, useForm } from "react-hook-form";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faXmark } from "@fortawesome/free-solid-svg-icons";
import Select from "react-select";
import { DarkModeContext } from "../../context/DarkModeContext";
import Swal from "sweetalert2";
import logo from "../../assets/img/logo.png";

const ModalSolicitudNuevoLegajo = (props) => {
    const { show, onHide } = props;
    const { darkMode } = useContext(DarkModeContext);
    const { control, handleSubmit, formState: { errors }, reset } = useForm();
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [filtroBuscador, setFiltroBuscador] = useState("");
    const [razonSocial, setRazonSocial] = useState("");
    const [usuarioId, setUsuarioId] = useState(null); // Para almacenar el Id del usuario encontrado

    // Manejar la búsqueda de usuario por CUIT
    const buscarUsuarioPorCuit = async () => {
        const token = sessionStorage.getItem("token");

        if (!token) {
            showAlert("Error", "Token no disponible", "error");
            return;
        }

        try {
            const response = await fetch("/api/usuarios/buscarusuario", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify({
                    Token: token,
                    Usuario: filtroBuscador,
                }),
            });

            if (response.ok) {
                const usuario = await response.json();
                setRazonSocial(usuario.nombre || "");
                setUsuarioId(usuario.id); // Asigna el Id del usuario encontrado
            } else {
                setRazonSocial("");
                setUsuarioId(null);
                showAlert("Error", "Usuario no encontrado o token inválido", "error");
            }
        } catch (error) {
            console.error("Error al buscar el usuario:", error);
            setRazonSocial("");
            setUsuarioId(null);
            showAlert("Error", "Hubo un problema al buscar el usuario", "error");
        }
    };

    // Manejador del envío del formulario
    const customOnSubmit = async (data) => {
        setIsSubmitting(true);

        const token = sessionStorage.getItem("token");
        if (!token) {
            showAlert("Error", "Token no disponible", "error");
            setIsSubmitting(false);
            return;
        }

        const formData = {
            token,
            NroLegajo: data.NroLegajo,
            Terminal: data.Terminal,
            NombreDeFantasia: data.NombreDeFantasia,
            Provincia: data.Provincia,
            FechaDeCarga: data.FechaDeCarga, // Asegúrate de tener el formato correcto
            Asesor: data.Asesor,
            Iduser: usuarioId, // Asigna el Id del usuario encontrado
            usuario: razonSocial, // Aquí puedes enviar el nombre o cualquier otra información si es necesario
            cuit: filtroBuscador
        };

        try {
            const response = await fetch("/api/legajo/crearlegajo", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify(formData),
            });

            if (response.ok) {
                showAlert("Éxito", "El legajo ha sido creado correctamente", "success");
            }
            else if (response.status === 409) {
                const errorData = await response.json();
                showAlert("Error", errorData.message || "El número de legajo ya existe", "error");
            } else {
                showAlert("Error", "Hubo un problema al crear el legajo", "error");
            }
        } catch (error) {
            console.error("Error al enviar el formulario:", error);
            showAlert("Error", "Hubo un problema al enviar los datos", "error");
        }

        setIsSubmitting(false);
        reset();
        onHide();
    };

    function showAlert(title, text, icon) {
        Swal.fire({
            title: title,
            text: text,
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
            willClose: () => {
                window.location.reload();
            },
        });
    }
    const provincias = [
        { id: 1, nombre: "BUENOS AIRES" },
        { id: 2, nombre: "CATAMARCA" },
        { id: 3, nombre: "CHACO" },
        { id: 4, nombre: "CHUBUT" },
        { id: 5, nombre: "CÓRDOBA" },
        { id: 6, nombre: "CORRIENTES" },
        { id: 7, nombre: "ENTRE RÍOS" },
        { id: 8, nombre: "FORMOSA" },
        { id: 9, nombre: "JUJUY" },
        { id: 10, nombre: "LA PAMPA" },
        { id: 11, nombre: "LA RIOJA" },
        { id: 12, nombre: "MENDOZA" },
        { id: 13, nombre: "MISIONES" },
        { id: 14, nombre: "NEUQUÉN" },
        { id: 15, nombre: "RÍO NEGRO" },
        { id: 16, nombre: "SALTA" },
        { id: 17, nombre: "SAN JUAN" },
        { id: 18, nombre: "SAN LUIS" },
        { id: 19, nombre: "SANTA CRUZ" },
        { id: 20, nombre: "SANTA FE" },
        { id: 21, nombre: "SANTIAGO DEL ESTERO" },
        { id: 22, nombre: "TIERRA DEL FUEGO" },
        { id: 23, nombre: "TUCUMÁN" }
    ];


    const opcionesProvincias = provincias.map((provincia) => ({
        value: provincia.nombre,
        label: provincia.nombre,
    }));

    return (
        <Modal
            {...props}
            show={show}
            onHide={onHide}
            centered
            size="lg"
            aria-labelledby="contained-modal-title-vcenter"
        >
            <Modal.Body className={darkMode ? "modal-content text-black" : "modal-content text-black"}>
                <section className="d-flex justify-content-between my-4">
                    <div className="ocultar-div"></div>
                    <div className="d-flex justify-content-center">
                        <h6 className="fs-18 lato-bold">Legajo</h6>
                    </div>
                    <div>
                        <button className="border-0 btn-filtro-cruz" onClick={onHide}>
                            <FontAwesomeIcon className="fs-18 " icon={faXmark} />
                        </button>
                    </div>
                </section>

                <div className="">
                    <form onSubmit={handleSubmit(customOnSubmit)}>
                        <div className="form-group col-12">
                            <label className="fs-14 mb-2 ms-1">CUIT</label>
                            <Controller
                                name="Cuit"
                                control={control}
                                render={({ field }) => (
                                    <div className="d-flex">
                                        <input
                                            {...field}
                                            type="text"
                                            className="form-control input-cargar-nueva-busqueda me-2"
                                            maxLength="11"
                                            placeholder="Ingrese CUIT"
                                            value={filtroBuscador}
                                            onChange={(e) => setFiltroBuscador(e.target.value)}
                                        />
                                        <button
                                            type="button"
                                            className="btn btn-primary"
                                            onClick={buscarUsuarioPorCuit}
                                        >
                                            Buscar
                                        </button>
                                    </div>
                                )}
                            />
                        </div>

                        <div className="form-group col-12">
                            <label className="fs-14 mb-2 ms-1">Razón Social</label>
                            <Controller
                                name="RazonSocial"
                                control={control}
                                render={({ field }) => (
                                    <input
                                        {...field}
                                        type="text"
                                        className="form-control input-cargar-nueva-busqueda"
                                        placeholder="Razón Social"
                                        value={razonSocial}
                                        readOnly
                                    />
                                )}
                            />
                        </div>

                        <div className="form-group col-12">
                            <label className="fs-14 mb-2 ms-1">N° de Terminal</label>
                            <Controller
                                name="Terminal"
                                control={control}
                                rules={{
                                    maxLength: 10,
                                    pattern: /^[0-9]*$/,
                                }}
                                render={({ field }) => (
                                    <input
                                        {...field}
                                        type="text"
                                        maxLength="8"
                                        className="form-control input-cargar-nueva-busqueda"
                                        placeholder="2222222222"
                                    />
                                )}
                            />
                            {errors.Terminal && (
                                <span className="fs-12 text-danger ms-1">
                                    Este campo es requerido
                                </span>
                            )}
                        </div>
                        <div className="form-group col-12">
                            <label className="fs-14 mb-2 ms-1">N° de Legajo</label>
                            <Controller
                                name="NroLegajo"
                                control={control}
                                rules={{
                                    maxLength: 10,
                                    pattern: /^[0-9]*$/,
                                }}
                                render={({ field }) => (
                                    <input
                                        {...field}
                                        type="number"
                                        maxLength="10"
                                        className="form-control input-cargar-nueva-busqueda"
                                        placeholder="2222222"
                                    />
                                )}
                            />
                            {errors.NroLegajo && (
                                <span className="fs-12 text-danger ms-1">
                                    Este campo es requerido
                                </span>
                            )}
                        </div>

                        <article className="row py-2">
                            <div className="form-group col-12">
                                <label className="fs-14 mb-2 ms-1">Nombre de fantasía</label>
                                <Controller
                                    name="NombreDeFantasia"
                                    control={control}
                                    rules={{ required: false }}
                                    render={({ field }) => (
                                        <input
                                            {...field}
                                            type="text"
                                            className="form-control input-cargar-nueva-busqueda"
                                            placeholder="Cordelia"
                                        />
                                    )}
                                />
                                {errors.NombreDeFantasia && (
                                    <span className="fs-12 text-danger ms-1">
                                        Este campo es requerido
                                    </span>
                                )}
                            </div>
                            <div className="form-group col-12">
                                <label className="fs-14 mb-2 ms-1">Provincia</label>
                                <Controller
                                    name="Provincia"
                                    control={control}
                                    rules={{ required: true }}
                                    render={({ field }) => (
                                        <Select
                                            {...field}
                                            options={opcionesProvincias}
                                            className="select-control-custom lato-bold border-0"
                                            classNamePrefix="select"
                                            placeholder="Provincias"
                                            onChange={(selectedOption) =>
                                                field.onChange(selectedOption.value)
                                            }
                                            value={opcionesProvincias.find(
                                                (option) => option.value === field.value
                                            )}
                                        />
                                    )}
                                />
                                {errors.Provincia && (
                                    <span className="fs-12 text-danger ms-1">
                                        Este campo es requerido
                                    </span>
                                )}
                            </div>
                        </article>

                        <article className="row py-2">
                            <div className="form-group col-12">
                                <label className="fs-14 mb-2 ms-1">Asesor-Gestor</label>
                                <Controller
                                    name="Asesor"
                                    control={control}
                                    rules={{ required: false }}
                                    render={({ field }) => (
                                        <input
                                            {...field}
                                            type="text"
                                            className="form-control input-cargar-nueva-busqueda"
                                            placeholder="Asesor - Gestor"
                                        />
                                    )}
                                />
                                {errors.Asesor && (
                                    <span className="fs-12 text-danger ms-1">
                                        Este campo es requerido
                                    </span>
                                )}
                            </div>
                        </article>
                        <div className="d-flex justify-content-between mt-5">
                            <button
                                className={
                                    darkMode
                                        ? "btn-cancel-modificaciones-nuevo-puesto border-0 lato-bold text-white"
                                        : "btn-cancel-modificaciones-nuevo-puesto border-0 lato-bold text-white"
                                }
                                onClick={onHide}
                            >
                                Cancelar
                            </button>
                            <button
                                className={
                                    darkMode
                                        ? "btn-guardar-modificaciones-nuevo-puesto border-0 lato-bold text-white"
                                        : "btn-guardar-modificaciones-nuevo-puesto border-0 lato-bold text-white"
                                }
                                disabled={isSubmitting}
                                type="submit"
                            >
                                {isSubmitting ? (
                                    <Spinner animation="border" size="sm" />
                                ) : (
                                    "Guardar"
                                )}
                            </button>
                        </div>
                    </form>
                </div>
            </Modal.Body>
        </Modal>
    );
};

export default ModalSolicitudNuevoLegajo;
