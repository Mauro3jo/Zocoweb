import React, { useState, useEffect } from "react";
import { Button, Modal, Form } from "react-bootstrap";

const ModalAgregarEducacion = ({ show, handleClose, guardarEducacion, educacionEditando }) => {
    const [educacion, setEducacion] = useState({
        InstitucionEducativa: "",
        Titulo: "",
        DisciplinaAcademica: "",
        FechaInicio: "",
        FechaFin: "",
        Descripcion: "",
        Aptitudes: [],
    });

    const [nuevaAptitud, setNuevaAptitud] = useState("");

    const [erroresEducacion, setErroresEducacion] = useState({});

    useEffect(() => {
        if (educacionEditando) {
            setEducacion(educacionEditando);
        } else {
            setEducacion({
                InstitucionEducativa: "",
                Titulo: "",
                DisciplinaAcademica: "",
                FechaInicio: "",
                FechaFin: "",
                Descripcion: "",
                Aptitudes: [],
            });
        }
    }, [educacionEditando]);

    const handleEducacionChange = (e) => {
        setEducacion({ ...educacion, [e.target.name]: e.target.value });
    };

    const agregarAptitud = () => {
        if (!nuevaAptitud.trim()) return;
        setEducacion({ ...educacion, Aptitudes: [...educacion.Aptitudes, { Aptitud: nuevaAptitud }] });
        setNuevaAptitud("");
    };

    const eliminarAptitud = (index) => {
        setEducacion({
            ...educacion,
            Aptitudes: educacion.Aptitudes.filter((_, i) => i !== index),
        });
    };

    const handleGuardar = () => {
        const nuevosErrores = {};

        if (!educacion.InstitucionEducativa.trim()) nuevosErrores.InstitucionEducativa = "Este campo es obligatorio";
        if (!educacion.Titulo.trim()) nuevosErrores.Titulo = "Este campo es obligatorio";
        if (!educacion.DisciplinaAcademica.trim()) nuevosErrores.DisciplinaAcademica = "Este campo es obligatorio";
        if (!educacion.FechaInicio) nuevosErrores.FechaInicio = "Este campo es obligatorio";
        if (!educacion.FechaFin) nuevosErrores.FechaFin = "Este campo es obligatorio";
        if (!educacion.Descripcion.trim()) nuevosErrores.Descripcion = "Este campo es obligatorio";

        setErroresEducacion(nuevosErrores);

        if (Object.keys(nuevosErrores).length > 0) {
            return;
        }

        guardarEducacion(educacion);
        handleClose();
    };

    return (
        <Modal show={show} onHide={handleClose}>
            <Modal.Header closeButton>
                <Modal.Title>{educacionEditando ? "Editar Educación" : "Agregar Educación"}</Modal.Title>
            </Modal.Header>
            <Modal.Body>
                <Form>

                    {/* Institución Educativa */}
                    <Form.Group>
                        <div className="label-wrapper">
                            <Form.Label>Institución Educativa</Form.Label>
                            {erroresEducacion.InstitucionEducativa && <span className="error-msg-inline">{erroresEducacion.InstitucionEducativa}</span>}
                        </div>
                        <Form.Control
                            type="text"
                            name="InstitucionEducativa"
                            className={`formdatos ${erroresEducacion.InstitucionEducativa ? "input-error" : ""}`}
                            value={educacion.InstitucionEducativa}
                            onChange={handleEducacionChange}
                        />
                    </Form.Group>

                    {/* Título */}
                    <Form.Group>
                        <div className="label-wrapper">
                            <Form.Label>Título</Form.Label>
                            {erroresEducacion.Titulo && <span className="error-msg-inline">{erroresEducacion.Titulo}</span>}
                        </div>
                        <Form.Control
                            type="text"
                            name="Titulo"
                            className={`formdatos ${erroresEducacion.Titulo ? "input-error" : ""}`}
                            value={educacion.Titulo}
                            onChange={handleEducacionChange}
                        />
                    </Form.Group>

                    {/* Disciplina Académica */}
                    <Form.Group>
                        <div className="label-wrapper">
                            <Form.Label>Disciplina Académica</Form.Label>
                            {erroresEducacion.DisciplinaAcademica && <span className="error-msg-inline">{erroresEducacion.DisciplinaAcademica}</span>}
                        </div>
                        <Form.Control
                            type="text"
                            name="DisciplinaAcademica"
                            className={`formdatos ${erroresEducacion.DisciplinaAcademica ? "input-error" : ""}`}
                            value={educacion.DisciplinaAcademica}
                            onChange={handleEducacionChange}
                        />
                    </Form.Group>

                    {/* Fecha Inicio */}
                    <Form.Group>
                        <div className="label-wrapper">
                            <Form.Label>Fecha Inicio</Form.Label>
                            {erroresEducacion.FechaInicio && <span className="error-msg-inline">{erroresEducacion.FechaInicio}</span>}
                        </div>
                        <Form.Control
                            type="date"
                            name="FechaInicio"
                            className={`formdatos ${erroresEducacion.FechaInicio ? "input-error" : ""}`}
                            value={educacion.FechaInicio}
                            onChange={handleEducacionChange}
                        />
                    </Form.Group>

                    {/* Fecha Fin */}
                    <Form.Group>
                        <div className="label-wrapper">
                            <Form.Label>Fecha Fin</Form.Label>
                            {erroresEducacion.FechaFin && <span className="error-msg-inline">{erroresEducacion.FechaFin}</span>}
                        </div>
                        <Form.Control
                            type="date"
                            name="FechaFin"
                            className={`formdatos ${erroresEducacion.FechaFin ? "input-error" : ""}`}
                            value={educacion.FechaFin}
                            onChange={handleEducacionChange}
                        />
                    </Form.Group>

                    {/* Descripción */}
                    <Form.Group>
                        <div className="label-wrapper">
                            <Form.Label>Descripción</Form.Label>
                            {erroresEducacion.Descripcion && <span className="error-msg-inline">{erroresEducacion.Descripcion}</span>}
                        </div>
                        <Form.Control
                            as="textarea"
                            rows={3}
                            name="Descripcion"
                            className={`formdatos ${erroresEducacion.Descripcion ? "input-error" : ""}`}
                            value={educacion.Descripcion}
                            onChange={handleEducacionChange}
                        />
                    </Form.Group>

                    {/* Aptitudes */}
                    <h6>Aptitudes</h6>
                    <div className="d-flex gap-2">
                        <Form.Control
                            type="text"
                            placeholder="Nueva Aptitud"
                            className="formdatos"
                            value={nuevaAptitud}
                            onChange={(e) => setNuevaAptitud(e.target.value)}
                        />
                        <Button variant="success" onClick={agregarAptitud}>+</Button>
                    </div>

                    <ul className="mt-2">
                        {educacion.Aptitudes.map((apt, index) => (
                            <li key={index} className="d-flex justify-content-between">
                                {apt.Aptitud}
                                <Button variant="danger" size="sm" onClick={() => eliminarAptitud(index)}>X</Button>
                            </li>
                        ))}
                    </ul>

                </Form>
            </Modal.Body>
            <Modal.Footer>
                <Button variant="secondary" onClick={handleClose}>Cerrar</Button>
                <Button variant="primary" onClick={handleGuardar}>
                    {educacionEditando ? "Actualizar" : "Guardar"}
                </Button>
            </Modal.Footer>
        </Modal>
    );
};

export default ModalAgregarEducacion;
