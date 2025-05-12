import React, { useContext, useState, useEffect } from "react";
import ItemTablaLegajos from "./ItemTablaLegajos";
import { Button, Form } from "react-bootstrap";
import { DarkModeContext } from "../../context/DarkModeContext";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faCirclePlus } from "@fortawesome/free-solid-svg-icons";
import ModalSolicitudNuevoLegajo from "./ModalSolicitudNuevoLegajo";

const TablaLegajos = () => {
    const { darkMode } = useContext(DarkModeContext);
    const [modalShowCompleta, setModalShowCompleta] = useState(false);
    const [legajos, setLegajos] = useState([]);
    const [paginaActual, setPaginaActual] = useState(1);
    const [elementosPorPagina] = useState(10);
    const [filtro, setFiltro] = useState(''); // Estado para el filtro de búsqueda

    useEffect(() => {
        const fetchLegajos = async () => {
            try {
                const response = await fetch("/api/legajo/listacompleto"); // Reemplaza con tu endpoint real
                const data = await response.json();
                setLegajos(data.reverse());
            } catch (error) {
                console.error("Error fetching data:", error);
            }
        };

        fetchLegajos();
    }, []);

    // Filtrar legajos por Nro Legajo
    const legajosFiltrados = legajos.filter(legajo => {
        if (!filtro) {
            return true; // Si no hay filtro, mostrar todos los legajos
        }
        return legajo.nroLegajo && legajo.nroLegajo.toString().includes(filtro);
    });

    // Obtener los elementos actuales para mostrar en la tabla
    const indiceUltimoElemento = paginaActual * elementosPorPagina;
    const indicePrimerElemento = indiceUltimoElemento - elementosPorPagina;
    const elementosActuales = legajosFiltrados.slice(indicePrimerElemento, indiceUltimoElemento);

    // Calcular el número total de páginas
    const numeroTotalPaginas = Math.ceil(legajosFiltrados.length / elementosPorPagina);

    // Funciones para cambiar de página
    const paginaAnterior = () => {
        if (paginaActual > 1) {
            setPaginaActual(paginaActual - 1);
        }
    };

    const paginaSiguiente = () => {
        if (paginaActual < numeroTotalPaginas) {
            setPaginaActual(paginaActual + 1);
        }
    };

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
                                        maxLength={10}
                                        type="number"
                                        inputMode="numeric"
                                        required
                                        placeholder="Nro Legajo"
                                        value={filtro}
                                        onChange={(e) => setFiltro(e.target.value)}
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
                        <ModalSolicitudNuevoLegajo
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
                                    Nro Legajo
                                </th>
                                <th
                                    className={
                                        darkMode
                                            ? "bg-white text-dark border-0 lato-regular fs-12 py-3"
                                            : "bg-dark text-white border-0 lato-regular fs-12 py-3"
                                    }
                                    scope="col"
                                >
                                    Terminal
                                </th>
                                <th
                                    className={
                                        darkMode
                                            ? "bg-white text-dark border-0 lato-regular fs-12 py-3"
                                            : "bg-dark text-white fs-12 lato-regular py-3"
                                    }
                                    scope="col"
                                >
                                    CUIT
                                </th>
                                <th
                                    className={
                                        darkMode
                                            ? "bg-white text-dark border-0 lato-regular fs-12 py-3"
                                            : "bg-dark text-white fs-12 lato-regular py-3"
                                    }
                                    scope="col"
                                >
                                    Nombre de fantasía
                                </th>
                                <th
                                    className={
                                        darkMode
                                            ? "bg-white text-dark border-0 lato-regular fs-12 py-3"
                                            : "bg-dark text-white fs-12 lato-regular py-3"
                                    }
                                    scope="col"
                                >
                                    Razón social
                                </th>
                                <th
                                    className={
                                        darkMode
                                            ? "bg-white text-dark border-0 lato-regular fs-12 py-3"
                                            : "bg-dark text-white fs-12 lato-regular py-3"
                                    }
                                    scope="col"
                                >
                                    Provincia
                                </th>
                                <th
                                    className={
                                        darkMode
                                            ? "bg-white text-dark border-0 lato-regular fs-12 py-3"
                                            : "bg-dark text-white fs-12 lato-regular py-3"
                                    }
                                    scope="col"
                                >
                                    Fecha de carga
                                </th>
                                <th
                                    className={
                                        darkMode
                                            ? "bg-white text-dark border-0 border-tabla-derecha lato-regular fs-12 py-3"
                                            : "bg-dark text-white fs-12 lato-regular py-3 border-tabla-derecha"
                                    }
                                    scope="col"
                                >
                                    Asesor - Gestor
                                </th>
                            </tr>
                        </thead>
                        <tbody className="text-center">
                            {elementosActuales.length > 0 ? (
                                elementosActuales.map((dato, id) => (
                                    <ItemTablaLegajos key={id} dato={dato} darkMode={darkMode} />
                                ))
                            ) : (
                                <tr>
                                    <td colSpan="9" className="lato-bold fs-12-a-10">
                                        No se encontraron resultados para esta búsqueda.
                                    </td>
                                </tr>
                            )}
                        </tbody>
                    </table>
                    <div className="d-flex justify-content-between">
                        <button
                            onClick={paginaAnterior}
                            disabled={paginaActual === 1}
                            className="btn"
                            style={{
                                borderRadius: "23px",
                                width: "182px",
                                height: "44px",
                                background: "#B4C400",
                                color: "#FFFFFF",
                                marginTop: "10px",
                            }}
                        >
                            Anterior
                        </button>
                        <button
                            onClick={paginaSiguiente}
                            disabled={paginaActual === numeroTotalPaginas}
                            className="btn"
                            style={{
                                borderRadius: "23px",
                                width: "182px",
                                height: "44px",
                                background: "#B4C400",
                                color: "#FFFFFF",
                                marginTop: "10px",
                            }}
                        >
                            Siguiente
                        </button>
                    </div>
                </div>
            </article>
        </div>
    );
};

export default TablaLegajos;
