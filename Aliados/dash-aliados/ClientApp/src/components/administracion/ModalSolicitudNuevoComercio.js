import React, { useContext, useEffect, useState } from "react";
import { Modal, Spinner } from "react-bootstrap";
import { Controller, useForm } from "react-hook-form";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faXmark } from "@fortawesome/free-solid-svg-icons";
import Select from "react-select";
import { DarkModeContext } from "../../context/DarkModeContext";
import Swal from "sweetalert2";
import logo from "../../assets/img/logo.png";

const ModalSolicitudNuevoComercio = (props) => {
    const { show, onHide } = props;
    const { darkMode } = useContext(DarkModeContext);
    const { control, handleSubmit, formState: { errors }, reset } = useForm();
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [filtroBuscador, setFiltroBuscador] = useState("");
    const [nroComercio1, setNroComercio1] = useState("")
    const [razonSocial, setRazonSocial] = useState("");
    const [usuarioId, setUsuarioId] = useState(null);
    const [categorias, setCategorias] = useState([]);
    const [legajos, setLegajos] = useState([]);

    useEffect(() => {
        // Obtener las categorías al montar el componente
        const fetchCategorias = async () => {
            const token = sessionStorage.getItem("token");

            if (!token) {
                showAlert("Error", "Token no disponible", "error");
                return;
            }

            try {
                const response = await fetch("/api/comercio/listarubros", {
                    headers: {
                        "Authorization": `Bearer ${token}`
                    }
                });

                if (response.ok) {
                    const data = await response.json();
                    setCategorias(data.map(cat => ({
                        value: cat,
                        label: cat
                    })));
                } else {
                    showAlert("Error", "No se pudieron obtener las categorías", "error");
                }
            } catch (error) {
                console.error("Error al obtener categorías:", error);
                showAlert("Error", "Hubo un problema al obtener las categorías", "error");
            }
        };

        fetchCategorias();
    }, []);

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

                // Buscar el legajo con el id del usuario encontrado
                const legajoResponse = await fetch("/api/legajo/obtenerlegajoporiduser", {
                    method: "POST",
                    headers: {
                        "Content-Type": "application/json",
                    },
                    body: JSON.stringify({
                        Token: token,
                        Iduser: usuario.id,
                    }),
                });

                if (legajoResponse.ok) {
                    const legajo = await legajoResponse.json();
                    setLegajos(legajo.map(l => ({
                        value: l.id,
                        label: `${l.nroLegajo} - ${l.terminal} - ${l.nombreDeFantasia}`,
                    })));
                } else {
                    showAlert("Error", "Legajo no encontrado o token inválido", "error");
                }
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

    const customOnSubmit = async (data) => {
        setIsSubmitting(true);

        const token = sessionStorage.getItem("token");
        if (!token) {
            showAlert("Error", "Token no disponible", "error");
            setIsSubmitting(false);
            return;
        }

        const formData = {
           Token: token,
            NroComercio1: nroComercio1,
            NomRubro: data.NomRubro,
            Categoria: data.Categoria,
            // Cuotas: data.Cuotas,
            Legajos: data.Legajos,
            IdUsuario: usuarioId,
            RazonSocial: razonSocial,
        };
        console.log(formData)
        try {
            const response = await fetch("/api/comercio/crearcomercio", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify(formData),
            });

            if (response.ok) {
                showAlert("Éxito", "El comercio ha sido creado correctamente", "success");
            } else {
                showAlert("Error", "Hubo un problema al crear el comercio", "error");
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
            timer: 50000,
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
                        <h6 className="fs-18 lato-bold">Nuevo Comercio</h6>
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
                                            placeholder="Ingrese CUIT"
                                            value={filtroBuscador}
                                            onChange={(e) => setFiltroBuscador(e.target.value)}
                                            maxLength={11} // Limitar a 11 caracteres
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
                            <label className="fs-14 mb-2 ms-1">Nro de Comercio</label> {/* Nuevo campo */}
                            <Controller
                                name="NroComercio1"
                                control={control}
                                render={({ field }) => (
                                    <input
                                        {...field}
                                        type="text"
                                        className="form-control input-cargar-nueva-busqueda"
                                        placeholder="Ingrese Nro de Comercio"
                                        value={nroComercio1}
                                        onChange={(e) => setNroComercio1(e.target.value)}
                                        maxLength={8}
                                    />
                                )}
                            />
                            {errors.NroComercio1 && (
                                <span className="fs-12 text-danger ms-1">
                                    Este campo es requerido
                                </span>
                            )}
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
                            <label className="fs-14 mb-2 ms-1">Rubro</label>
                            <Controller
                                name="NomRubro"
                                control={control}
                                render={({ field }) => (
                                    <input
                                        {...field}
                                        type="text"
                                        className="form-control input-cargar-nueva-busqueda"
                                        placeholder="Ingrese Rubro"
                                    />
                                )}
                            />
                            {errors.NomRubro && (
                                <span className="fs-12 text-danger ms-1">
                                    Este campo es requerido
                                </span>
                            )}
                        </div>

                        <div className="form-group col-12">
                            <label className="fs-14 mb-2 ms-1">Categoría</label>
                            <Controller
                                name="Categoria"
                                control={control}
                                render={({ field }) => (
                                    <Select
                                        {...field}
                                        options={categorias}
                                        className="select-control-custom lato-bold border-0"
                                        classNamePrefix="select"
                                        placeholder="Seleccione Categoría"
                                        onChange={(selectedOption) =>
                                            field.onChange(selectedOption.value)
                                        }
                                        value={categorias.find(
                                            (option) => option.value === field.value
                                        )}
                                    />
                                )}
                            />
                            {errors.Categoria && (
                                <span className="fs-12 text-danger ms-1">
                                    Este campo es requerido
                                </span>
                            )}
                        </div>

                        {/* <div className="form-group col-12">
                            <label className="fs-14 mb-2 ms-1">Cuotas</label>
                            <Controller
                                name="Cuotas"
                                control={control}
                                rules={{ required: true }}
                                render={({ field }) => (
                                    <input
                                        {...field}
                                        type="number"
                                        className="form-control input-cargar-nueva-busqueda"
                                        placeholder="Ingrese número de cuotas"
                                    />
                                )}
                            />
                            {errors.Cuotas && (
                                <span className="fs-12 text-danger ms-1">
                                    Este campo es requerido
                                </span>
                            )}
                        </div> */}

                        <div className="form-group col-12">
                            <label className="fs-14 mb-2 ms-1">Legajos</label>
                            <Controller
                                name="Legajos"
                                control={control}
                                rules={{ required: true }}
                                render={({ field }) => (
                                    <Select
                                        {...field}
                                        options={legajos}
                                        className="select-control-custom lato-bold border-0"
                                        classNamePrefix="select"
                                        placeholder="Seleccione Legajo"
                                        onChange={(selectedOption) =>
                                            field.onChange(selectedOption.value)
                                        }
                                        value={legajos.find(
                                            (option) => option.value === field.value
                                        )}
                                    />
                                )}
                            />
                            {errors.Legajos && (
                                <span className="fs-12 text-danger ms-1">
                                    Este campo es requerido
                                </span>
                            )}
                        </div>

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

export default ModalSolicitudNuevoComercio;
