import React, { useContext, useState } from "react";
import ItemTablaPanelInterno from "./ItemTablaPanelInterno";
import { Table,Button, Form } from "react-bootstrap";
import { DarkModeContext } from "../../context/DarkModeContext";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faCirclePlus } from "@fortawesome/free-solid-svg-icons";
//import ModalSolicitudNuevoLegajo from "./ModalSolicitudNuevoLegajo";

const TablaPanelInterno = ({ data }) => { // Recibe 'data' como prop
    const { darkMode } = useContext(DarkModeContext);
    const [modalShowCompleta, setModalShowCompleta] = useState(false);

    return (
        <div className={darkMode ? "container bg-tabla-usuarios-liquidaciones-dark" : "container bg-tabla-usuarios-liquidaciones"}>
            <section className="container mt-3 mb-3">
                <div className="d-flex flex-wrap justify-content-between">
                    <div className="margin-centrado-responsive">
                        <div className="my-3 d-flex">
                            <h6 className="my-3 me-3 fs-18-a-16">Filtrar: </h6>
                            <div className="campo-busqueda">
                                <Form.Group className="d-flex justify-content-center" controlId="formBasicEmail">
                                    <Form.Control
                                        className={darkMode ? "form-control text-white label-buscador-dark lato-regular fs-18 border-0" : "form-control label-buscador lato-regular fs-18 border-0"}
                                        maxLength={11}
                                        type="text"
                                        pattern="[0-9]*"
                                        inputMode="numeric"
                                        required
                                        placeholder="CUIT"
                                    />
                                </Form.Group>
                            </div>
                        </div>
                    </div>
                    {/*<div className="d-flex centrado-responsive pt-3">*/}
                    {/*    <article className="d-flex justify-content-end">*/}
                    {/*        <Button*/}
                    {/*            className={darkMode ? "centrado border-0 btn btn-modal-nuevo-usuario-editar centrado border-0 mx-2" : "centrado  border-0 btn btn-modal-nuevo-usuario-editar centrado border-0 mx-2"}*/}
                    {/*            onClick={() => setModalShowCompleta(true)}*/}
                    {/*        >*/}
                    {/*            <FontAwesomeIcon icon={faCirclePlus} />{" "}*/}
                    {/*            <span className="lato-bold fs-18 ms-2"> Nuevo</span>*/}
                    {/*        </Button>*/}
                    {/*    </article>*/}
                    {/*    <ModalSolicitudNuevoLegajo show={modalShowCompleta} onHide={() => setModalShowCompleta(false)} />*/}
                    {/*</div>*/}
                </div>
            </section>
            <article>
                <div className={darkMode ? "container table-responsive py-3 px-5" : "container table-responsive py-3 px-5"}>
                    <Table table table-borderless responsive striped hover>
                        <thead className="border-0 bg-dark py-2">
                            <tr className="text-center tabla-thead">
                                <th className={darkMode ? "bg-white text-dark border-tabla-izquierda border-0 lato-regular fs-14 py-3" : "bg-dark text-white border-tabla-izquierda border-0 lato-regular fs-14 py-3"} scope="col">ID</th>
                                <th className={darkMode ? "bg-white text-dark border-0 lato-regular fs-14 py-3 " : "bg-dark text-white border-0 lato-regular fs-14 py-3"} scope="col">Usuario</th>
                                <th className={darkMode ? "bg-white text-dark border-0 lato-regular fs-14 py-3" : "bg-dark text-white fs-14 lato-regular py-3"} scope="col">Horas Trabajadas</th>
                                <th className={darkMode ? "bg-white text-dark border-0 lato-regular fs-14 py-3" : "bg-dark text-white fs-14 lato-regular py-3"} scope="col">Días Trabajados</th>
                                <th className={darkMode ? "bg-white text-dark border-0 lato-regular fs-14 py-3" : "bg-dark text-white fs-14 lato-regular py-3"} scope="col">Fuera de Horario</th>
                                <th className={darkMode ? "bg-white text-dark border-0 lato-regular fs-14 py-3" : "bg-dark text-white fs-14 lato-regular py-3"} scope="col">Total Registros</th>
                                <th className={darkMode ? "bg-white text-dark border-0 lato-regular fs-14 py-3" : "bg-dark text-white fs-14 lato-regular py-3"} scope="col">Desaprobados</th>
                                <th className={darkMode ? "bg-white text-dark border-0 lato-regular fs-14 py-3" : "bg-dark text-white fs-14 lato-regular py-3"} scope="col">Visitas</th>
                                <th className={darkMode ? "bg-white text-dark border-0 lato-regular fs-14 py-3" : "bg-dark text-white fs-14 lato-regular py-3"} scope="col">Prospectos</th>
                                <th className={darkMode ? "bg-white text-dark border-0 lato-regular fs-14 py-3" : "bg-dark text-white fs-14 lato-regular py-3"} scope="col">Pendientes</th>
                                <th className={darkMode ? "bg-white text-dark border-0 border-tabla-derecha lato-regular fs-14 py-3" : "bg-dark text-white fs-14 lato-regular py-3 border-tabla-derecha"} scope="col">Promedio</th>

                            </tr>
                        </thead>
                        <tbody className="text-center">
                            {data && data.length > 0 ? (
                                data.map((dato) => (
                                    <ItemTablaPanelInterno key={dato.usuarioId} dato={dato} darkMode={darkMode} />
                                ))
                            ) : (
                                <tr>
                                    <td colSpan="10" className="lato-bold fs-16-a-10">
                                        No se encontraron resultados para esta búsqueda.
                                    </td>
                                </tr>
                            )}
                        </tbody>

                    </Table>
                </div>
            </article>
        </div>
    );
};

export default TablaPanelInterno;
