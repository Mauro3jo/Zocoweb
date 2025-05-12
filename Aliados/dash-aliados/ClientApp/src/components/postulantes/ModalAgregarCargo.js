import React, { useState, useEffect } from "react";
import { Button, Modal, Form } from "react-bootstrap";

const ModalAgregarCargo = ({ show, handleClose, guardarCargo, cargoEditando }) => {
    const [cargo, setCargo] = useState({
        TipoEmpleo: "",
        Empresa: "",
        FechaInicio: "",
        FechaFin: "",
        Ubicacion: "",
        Descripcion: "",
        Referencias: [],
    });

    const [nuevaReferencia, setNuevaReferencia] = useState({
        Nombre: "",
        Cargo: "",
        Telefono: "",
        Mail: "",
    });

    const [erroresCargo, setErroresCargo] = useState({}); // 👉 Estado de errores

    useEffect(() => {
        if (cargoEditando) {
            setCargo(cargoEditando);
        } else {
            setCargo({
                TipoEmpleo: "",
                Empresa: "",
                FechaInicio: "",
                FechaFin: "",
                Ubicacion: "",
                Descripcion: "",
                Referencias: [],
            });
        }
    }, [cargoEditando]);

    const handleInputChange = (e) => {
        setCargo({ ...cargo, [e.target.name]: e.target.value });
    };

    const handleReferenciaChange = (e) => {
        setNuevaReferencia({ ...nuevaReferencia, [e.target.name]: e.target.value });
    };

    const agregarReferencia = () => {
        if (!nuevaReferencia.Nombre.trim() || !nuevaReferencia.Cargo.trim()) {
            alert("El Nombre y el Cargo de la referencia son obligatorios.");
            return;
        }

        setCargo({
            ...cargo,
            Referencias: [...cargo.Referencias, nuevaReferencia],
        });

        setNuevaReferencia({
            Nombre: "",
            Cargo: "",
            Telefono: "",
            Mail: "",
        });
    };

    const eliminarReferencia = (index) => {
        setCargo({
            ...cargo,
            Referencias: cargo.Referencias.filter((_, i) => i !== index),
        });
    };

    const handleGuardar = () => {
        const nuevosErrores = {};

        if (!cargo.TipoEmpleo.trim()) nuevosErrores.TipoEmpleo = "Este campo es obligatorio";
        if (!cargo.Empresa.trim()) nuevosErrores.Empresa = "Este campo es obligatorio";
        if (!cargo.FechaInicio) nuevosErrores.FechaInicio = "Este campo es obligatorio";
        if (!cargo.FechaFin) nuevosErrores.FechaFin = "Este campo es obligatorio";
        if (!cargo.Ubicacion.trim()) nuevosErrores.Ubicacion = "Este campo es obligatorio";
        if (!cargo.Descripcion.trim()) nuevosErrores.Descripcion = "Este campo es obligatorio";
        if (cargo.Referencias.length === 0) nuevosErrores.Referencias = "Debe agregar al menos una referencia";

        setErroresCargo(nuevosErrores);

        if (Object.keys(nuevosErrores).length > 0) {
            return; // No guardar si hay errores
        }

        guardarCargo(cargo);
        handleClose();
    };

    return (
        <Modal show={show} onHide={handleClose}>
            <Modal.Header closeButton>
                <Modal.Title>{cargoEditando ? "Editar Cargo" : "Agregar Cargo"}</Modal.Title>
            </Modal.Header>
            <Modal.Body>
                <Form>

                    {/* Tipo de Empleo */}
                    <Form.Group>
                        <div className="label-wrapper">
                            <Form.Label>Tipo de Empleo</Form.Label>
                            {erroresCargo.TipoEmpleo && <span className="error-msg-inline">{erroresCargo.TipoEmpleo}</span>}
                        </div>
                        <Form.Control
                            type="text"
                            name="TipoEmpleo"
                            className={`formdatos ${erroresCargo.TipoEmpleo ? "input-error" : ""}`}
                            value={cargo.TipoEmpleo}
                            onChange={handleInputChange}
                        />
                    </Form.Group>

                    {/* Empresa */}
                    <Form.Group>
                        <div className="label-wrapper">
                            <Form.Label>Empresa</Form.Label>
                            {erroresCargo.Empresa && <span className="error-msg-inline">{erroresCargo.Empresa}</span>}
                        </div>
                        <Form.Control
                            type="text"
                            name="Empresa"
                            className={`formdatos ${erroresCargo.Empresa ? "input-error" : ""}`}
                            value={cargo.Empresa}
                            onChange={handleInputChange}
                        />
                    </Form.Group>

                    {/* Fecha Inicio */}
                    <Form.Group>
                        <div className="label-wrapper">
                            <Form.Label>Fecha Inicio</Form.Label>
                            {erroresCargo.FechaInicio && <span className="error-msg-inline">{erroresCargo.FechaInicio}</span>}
                        </div>
                        <Form.Control
                            type="date"
                            name="FechaInicio"
                            className={`formdatos ${erroresCargo.FechaInicio ? "input-error" : ""}`}
                            value={cargo.FechaInicio}
                            onChange={handleInputChange}
                        />
                    </Form.Group>

                    {/* Fecha Fin */}
                    <Form.Group>
                        <div className="label-wrapper">
                            <Form.Label>Fecha Fin</Form.Label>
                            {erroresCargo.FechaFin && <span className="error-msg-inline">{erroresCargo.FechaFin}</span>}
                        </div>
                        <Form.Control
                            type="date"
                            name="FechaFin"
                            className={`formdatos ${erroresCargo.FechaFin ? "input-error" : ""}`}
                            value={cargo.FechaFin}
                            onChange={handleInputChange}
                        />
                    </Form.Group>

                    {/* Ubicacion */}
                    <Form.Group>
                        <div className="label-wrapper">
                            <Form.Label>Ubicación</Form.Label>
                            {erroresCargo.Ubicacion && <span className="error-msg-inline">{erroresCargo.Ubicacion}</span>}
                        </div>
                        <Form.Control
                            type="text"
                            name="Ubicacion"
                            className={`formdatos ${erroresCargo.Ubicacion ? "input-error" : ""}`}
                            value={cargo.Ubicacion}
                            onChange={handleInputChange}
                        />
                    </Form.Group>

                    {/* Descripcion */}
                    <Form.Group>
                        <div className="label-wrapper">
                            <Form.Label>Descripción</Form.Label>
                            {erroresCargo.Descripcion && <span className="error-msg-inline">{erroresCargo.Descripcion}</span>}
                        </div>
                        <Form.Control
                            as="textarea"
                            rows={3}
                            name="Descripcion"
                            className={`formdatos ${erroresCargo.Descripcion ? "input-error" : ""}`}
                            value={cargo.Descripcion}
                            onChange={handleInputChange}
                        />
                    </Form.Group>

                    <hr />

                    <h6>Referencias</h6>
                    {erroresCargo.Referencias && <span className="error-msg-inline">{erroresCargo.Referencias}</span>}

                    <Form.Group>
                        <div className="label-wrapper">
                            <Form.Label>Nombre</Form.Label>
                        </div>
                        <Form.Control
                            type="text"
                            placeholder="Nombre"
                            name="Nombre"
                            value={nuevaReferencia.Nombre}
                            onChange={handleReferenciaChange}
                            className="formdatos"
                        />
                    </Form.Group>

                    <Form.Group>
                        <div className="label-wrapper">
                            <Form.Label>Cargo</Form.Label>
                        </div>
                        <Form.Control
                            type="text"
                            placeholder="Cargo"
                            name="Cargo"
                            value={nuevaReferencia.Cargo}
                            onChange={handleReferenciaChange}
                            className="formdatos"
                        />
                    </Form.Group>

                    <Form.Group>
                        <div className="label-wrapper">
                            <Form.Label>Teléfono</Form.Label>
                        </div>
                        <Form.Control
                            type="text"
                            placeholder="Teléfono"
                            name="Telefono"
                            value={nuevaReferencia.Telefono}
                            onChange={handleReferenciaChange}
                            className="formdatos"
                        />
                    </Form.Group>

                    <Form.Group>
                        <div className="label-wrapper">
                            <Form.Label>Mail</Form.Label>
                        </div>
                        <Form.Control
                            type="email"
                            placeholder="Mail"
                            name="Mail"
                            value={nuevaReferencia.Mail}
                            onChange={handleReferenciaChange}
                            className="formdatos"
                        />
                    </Form.Group>

                    <Button variant="success" onClick={agregarReferencia} className="my-2">Agregar Referencia</Button>

                    {/* Mostrar referencias agregadas */}
                    <ul className="mt-3">
                        {cargo.Referencias.map((ref, index) => (
                            <li key={index} className="d-flex justify-content-between align-items-center border p-2 rounded">
                                {ref.Nombre} - {ref.Cargo}
                                <Button variant="danger" size="sm" onClick={() => eliminarReferencia(index)}>X</Button>
                            </li>
                        ))}
                    </ul>


                </Form>
            </Modal.Body>
            <Modal.Footer>
                <Button variant="secondary" onClick={handleClose}>Cerrar</Button>
                <Button variant="primary" onClick={handleGuardar}>
                    {cargoEditando ? "Actualizar" : "Guardar"}
                </Button>
            </Modal.Footer>
        </Modal>
    );
};

export default ModalAgregarCargo;
