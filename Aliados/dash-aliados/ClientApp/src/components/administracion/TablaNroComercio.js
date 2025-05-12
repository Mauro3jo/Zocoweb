import React, { useContext, useState, useEffect } from "react";
import ItemTablaNroComercio from "./ItemTablaNroComercio"; // Asegúrate de tener un componente adecuado para renderizar cada fila
import { Button, Form } from "react-bootstrap";
import { DarkModeContext } from "../../context/DarkModeContext";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faCirclePlus } from "@fortawesome/free-solid-svg-icons";
import ModalSolicitudNuevoComercio from "./ModalSolicitudNuevoComercio"; // Asegúrate de tener un modal para agregar nuevos comercios

const TablaNroComercio = () => {
    const { darkMode } = useContext(DarkModeContext);
    const [modalShowCompleta, setModalShowCompleta] = useState(false);
    const [comercios, setComercios] = useState([]);
    useEffect(() => {
        const fetchComercios = async () => {
            try {
                const response = await fetch("/api/comercio/listanrocomercio");
                const data = await response.json();
                setComercios(data);
            } catch (error) {
                console.error("Error fetching data:", error);
            }
        };

        fetchComercios();
    }, []);

    // Obtener los últimos 10 comercios
    const ultimos10Comercios = comercios;//.slice(-10).reverse(); // Toma los últimos 10 y revierte el orden

    return (
        <div
            className={
                darkMode
                    ? "container bg-tabla-usuarios-liquidaciones-dark"
                    : "container bg-tabla-usuarios-liquidaciones"
            }
        >
            <section className="container mt-3 mb-3">
                <div className="d-flex flex-wrap justify-content-between">
                    <div className="margin-centrado-responsive">
                        <div className="my-3 d-flex">
                            <h6 className="my-3 me-3 fs-18-a-16">Filtrar: </h6>
                            <div className="campo-busqueda">
                                <Form.Group
                                    className="d-flex justify-content-center"
                                    controlId="formBasicEmail"
                                >
                                    <Form.Control
                                        className={
                                            darkMode
                                                ? "form-control text-white label-buscador-dark lato-regular fs-18 border-0"
                                                : "form-control label-buscador lato-regular fs-18 border-0"
                                        }
                                        maxLength={11}
                                        type="text"
                                        pattern="[0-9]*"
                                        inputMode="numeric"
                                        required
                                        placeholder="Nro Comercio"
                                    />
                                </Form.Group>
                            </div>
                        </div>
                    </div>
                    <div className="d-flex centrado-responsive pt-3">
                        <article className="d-flex justify-content-end">
                            <Button
                                className={
                                    darkMode
                                        ? "centrado border-0 btn btn-modal-nuevo-usuario-editar centrado border-0 mx-2"
                                        : "centrado  border-0 btn btn-modal-nuevo-usuario-editar centrado border-0 mx-2"
                                }
                                onClick={() => setModalShowCompleta(true)}
                            >
                                <FontAwesomeIcon icon={faCirclePlus} />{" "}
                                <span className="lato-bold fs-18 ms-2"> Nuevo</span>
                            </Button>
                        </article>
                        <ModalSolicitudNuevoComercio
                            show={modalShowCompleta}
                            onHide={() => setModalShowCompleta(false)}
                        />
                    </div>
                </div>
            </section>
            <article>
                <div
                    className={
                        darkMode
                            ? "container table-responsive py-3 px-5"
                            : "container table-responsive py-3 px-5"
                    }
                >
                    <table className="table table-borderless responsive striped hover">
                        <thead className="border-0">
                            <tr className="text-center tabla-thead">
                                <th
                                    className={
                                        darkMode
                                            ? "bg-white text-dark border-tabla-izquierda border-0 lato-regular fs-12 py-3"
                                            : "bg-dark text-white border-tabla-izquierda border-0 lato-regular fs-12 py-3"
                                    }
                                    scope="col"
                                >
                                    ID
                                </th>
                                <th
                                    className={
                                        darkMode
                                            ? "bg-white text-dark border-0 lato-regular fs-12 py-3"
                                            : "bg-dark text-white border-0 lato-regular fs-12 py-3"
                                    }
                                    scope="col"
                                >
                                    Nro Comercio
                                </th>
                                <th
                                    className={
                                        darkMode
                                            ? "bg-white text-dark border-0 lato-regular fs-12 py-3"
                                            : "bg-dark text-white border-0 lato-regular fs-12 py-3"
                                    }
                                    scope="col"
                                >
                                    Rubro
                                </th>
                                <th
                                    className={
                                        darkMode
                                            ? "bg-white text-dark border-0 lato-regular fs-12 py-3"
                                            : "bg-dark text-white fs-12 lato-regular py-3"
                                    }
                                    scope="col"
                                >
                                    Categoría
                                </th>
                                {/* <th
                                    className={
                                        darkMode
                                            ? "bg-white text-dark border-0 lato-regular fs-12 py-3"
                                            : "bg-dark text-white fs-12 lato-regular py-3"
                                    }
                                    scope="col"
                                >
                                    Cuotas
                                </th> */}
                                <th
                                    className={
                                        darkMode
                                            ? "bg-white text-dark border-0 lato-regular fs-12 py-3"
                                            : "bg-dark text-white fs-12 lato-regular py-3"
                                    }
                                    scope="col"
                                >
                                    Legajos
                                </th>
                            </tr>
                        </thead>
                        <tbody className="text-center">
                            {ultimos10Comercios.length > 0 ? (
                                ultimos10Comercios.map((dato, id) => (
                                    <ItemTablaNroComercio key={id} dato={dato} darkMode={darkMode} />
                                ))
                            ) : (
                                <tr>
                                    <td colSpan="6" className="lato-bold fs-12-a-10">
                                        No se encontraron resultados para esta búsqueda.
                                    </td>
                                </tr>
                            )}
                        </tbody>
                    </table>
                </div>
            </article>
        </div>
    );
};

export default TablaNroComercio;
