import React, { useState } from "react";
import "./ProspectoCarta.css";
import { Button, Form, Col, Row } from "react-bootstrap";
import Modal from "react-bootstrap/Modal";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faCalendarDays,
  faClock,
  faXmark,
} from "@fortawesome/free-solid-svg-icons";

const MiModalProspectoEditar = (props) => {
  const { show, onHide } = props;
  const [validated, setValidated] = useState(false);


  // const [comentario, setComentario] = useState("");

  // const handleComentarioChange = (event) => {
  //   setComentario(event.target.value);
  // };

  // const handleSubmit = (event) => {
  //   event.preventDefault();
  //   console.log("Comentario enviado:", comentario);
  //   setComentario("");
  // };

  const [comentarioReunion, setComentarioReunion] = useState("");

  const handleComentarioReunionChange = (event) => {
    setComentarioReunion(event.target.value);
  };

  const handleSubmitReunion = (event) => {
    event.preventDefault();
    console.log("Comentario enviado:", comentarioReunion);
    setComentarioReunion("");
  };

  const [datos, setDatos] = useState({});
  console.log(
    "🚀 ~ file: ProspectoCarta.js:1752 ~ MyModalProspectoEditar ~ datos:",
    datos
  );

  const handleTipoCuentaPersonaFisicaChange = (selectedTipoCuenta) => {
    setDatos((prevValues) => ({
      ...prevValues,
      tipoCuenta: selectedTipoCuenta,
    }));
  };

  return (
    <div>
      <Modal
        {...props}
        size="lg"
        aria-labelledby="contained-modal-title-vcenter"
        centered
      >
        <Modal.Body className="px-4">
          <section className="d-flex justify-content-between my-4">
            <div className="ocultar-div"></div>
            <div className="d-flex justify-content-center">
              <h6 className="fs-18 lato-bold">EDITAR - No cierra</h6>
            </div>
            <div>
              <button className="border-0 btn-filtro-cruz" onClick={onHide}>
                <FontAwesomeIcon className="fs-18 " icon={faXmark} />
              </button>
            </div>
          </section>
          <section>
            <div>
              <h6 className="lato-bold fs-18">Datos del comercio</h6>
              <div>
                <h6 className="fs-16">
                  Nombre de fantasía <br />
                  <span className="lato-bold fs-18">Ana Manzana</span>
                </h6>
              </div>

              <div className="row my-2">
                <div className="col-lg-4">
                  <h6 className="fs-16">
                    Domicilio
                    <br />
                    <span className="lato-bold fs-18">Lavalle 1049</span>
                  </h6>
                </div>
                <div className="col-lg-4">
                  <h6 className="fs-16">
                    Localidad
                    <br />
                    <span className="lato-bold fs-18">
                      San Miguel de Tucumán
                    </span>
                  </h6>
                </div>
                <div className="col-lg-4">
                  <h6 className="fs-16">
                    Código postal
                    <br />
                    <span className="lato-bold fs-18">4000</span>
                  </h6>
                </div>
              </div>
              <div className="row my-2">
                <div className="col-lg-4">
                  <h6 className="fs-16">
                    Rubro
                    <br />
                    <span className="lato-bold fs-18"> Alimenticio</span>
                  </h6>
                </div>
                <div className="col-lg-4">
                  <h6 className="fs-16">
                    Facturación estimada (por mes)
                    <br />
                    <span className="lato-bold fs-18">$10.000.000</span>
                  </h6>
                </div>
                <div className="col-lg-4">
                  <h6 className="fs-16">
                    Sucursales proyectadas
                    <br />
                    <span className="lato-bold fs-18">4</span>
                  </h6>
                </div>
              </div>
              <div>
                <h6 className="fs-16">
                  ¿Ya cuenta con Terminal de Posnet / Clover? <br />
                  <span className="lato-bold fs-18">Sí</span>
                </h6>
              </div>
            </div>
          </section>
          <section>
            <h6 className="fs-16 pt-2">1er contacto</h6>
            <section className="d-flex">
              <div className="border-izquierda-rojo me-2"> </div>
              <Form
                noValidate
                validated={validated}
                onSubmit={handleSubmitReunion}
              >
                <div className="d-flex">
                  <div className="me-5">
                    <FontAwesomeIcon
                      className=" mx-1"
                      icon={faCalendarDays}
                      size="lg"
                      style={{ color: "#e24444" }}
                    />{" "}
                    Fecha: 10/12/2023
                  </div>
                  <div>
                    <FontAwesomeIcon
                      className=" mx-1"
                      icon={faClock}
                      size="lg"
                      style={{ color: "#e24444" }}
                    />{" "}
                    Hora: 14:14 hs
                  </div>
                </div>
                <div>
                  <Form.Group className="my-3" controlId="formBasicEmail">
                    <Form.Label>Comentario</Form.Label>
                    <Form.Control
                      className="input-comentario-prospecto
                    width-800"
                      as="textarea"
                      name="comentarioReunion"
                      value={comentarioReunion}
                      onChange={handleComentarioReunionChange}
                    />
                  </Form.Group>
                </div>
                <div className="ms-2">
                  <h6>Motivo:</h6>
                  <Row className="mb-3">
                    <section>
                      <div>
                        <h6>Tipo de cuenta:</h6>
                      </div>
                      <div>
                        <Row>
                          <Form.Group as={Col} md="12" className="mb-3 fs-14">
                            <Form.Check
                              required
                              type="radio"
                              label="Ya trabaja con terminal Posnet/Clover."
                              id="cajaDeAhorros"
                              name="tipoCuenta"
                              onClick={() =>
                                handleTipoCuentaPersonaFisicaChange(
                                  "Ya trabaja con terminal Posnet/Clover."
                                )
                              }
                            />
                          </Form.Group>
                          <Form.Group as={Col} md="12" className="mb-3 fs-14">
                            <Form.Check
                              required
                              type="radio"
                              label="No cuenta documentación en regla."
                              id="cuentaCorriente"
                              name="tipoCuenta"
                              onClick={() =>
                                handleTipoCuentaPersonaFisicaChange(
                                  "No cuenta documentación en regla."
                                )
                              }
                            />
                          </Form.Group>
                          <Form.Group as={Col} md="12" className="mb-3 fs-14">
                            <Form.Check
                              required
                              type="radio"
                              label="No llega al mínimo de facturación requerida."
                              id="billeteraVirtual"
                              name="tipoCuenta"
                              onClick={() =>
                                handleTipoCuentaPersonaFisicaChange(
                                  "No llega al mínimo de facturación requerida."
                                )
                              }
                            />
                          </Form.Group>
                          <Form.Group as={Col} md="12" className="mb-3 fs-14">
                            <Form.Check
                              required
                              type="radio"
                              label="Decidieron no continuar."
                              id="billeteraVirtual"
                              name="tipoCuenta"
                              onClick={() =>
                                handleTipoCuentaPersonaFisicaChange(
                                  "Decidieron no continuar."
                                )
                              }
                            />
                          </Form.Group>
                          <Form.Group as={Col} md="12" className="mb-3 fs-14">
                            <Form.Check
                              required
                              type="radio"
                              label="Ya trabaja con terminal Posnet/Clover."
                              id="billeteraVirtual"
                              name="tipoCuenta"
                              onClick={() =>
                                handleTipoCuentaPersonaFisicaChange(
                                  "Ya trabaja con terminal Posnet/Clover."
                                )
                              }
                            />
                          </Form.Group>
                        </Row>
                      </div>
                    </section>
                  </Row>
                </div>
                <div className="d-flex justify-content-end py-3">
                  <div>
                    <Button
                      onClick={onHide}
                      className="mx-2 btn-cancelar-editar-prospecto lato-bold"
                    >
                      Cancelar
                    </Button>
                    <Button
                      className="mx-2 btn-guardar-editar-prospecto lato-bold"
                      type="submit"
                    >
                      Guardar
                    </Button>
                  </div>
                </div>
              </Form>
            </section>
          </section>
        </Modal.Body>
      </Modal>
    </div>
  );
};

export default MiModalProspectoEditar;
