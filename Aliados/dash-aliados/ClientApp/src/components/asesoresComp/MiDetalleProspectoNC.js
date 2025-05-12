import React, { useState } from "react";
import { Button, Col, Form, Row } from "react-bootstrap";
import Modal from "react-bootstrap/Modal";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faCalendarDays,
  faClock,
  faXmark,
} from "@fortawesome/free-solid-svg-icons";

const MiDetalleProspectoNC = (props) => {
  const { show, onHide } = props;
  const [validated, setValidated] = useState(false);
  const [formData, setFormData] = useState({
    fecha: "19/12/2023",
    hora: "14:14 hs",
    comentario: "",
    motivo: "",
  });

  const handleInputChange = (event) => {
    const { name, value } = event.target;
    setFormData({
      ...formData,
      [name]: value,
    });
  };

  const handleSubmit = (event) => {
    event.preventDefault();
    console.log(formData);
    // Aquí podrías enviar los datos a través de una solicitud de red o realizar alguna lógica con ellos
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
              <h6 className="fs-18 lato-bold">Editar prospecto - No Cierra</h6>
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
              <div>
                <h6 className="color-rojo fs-14 lato-bold">
                  ADVERTENCIA: Si el comercio ya cuenta con una terminal Posnet
                  o Clover recomendamos no continuar con el prospecto.
                </h6>
              </div>
            </div>
          </section>
          <section>
            <h6 className="fs-16 pt-2">1er contacto</h6>
            <section className="d-flex">
              <div className="border-izquierda-rojo me-2"> </div>
              <Form noValidate validated={validated} onSubmit={handleSubmit}>
                <div className="content-between-escritorio">
                  <article className="d-flex flex-wrap mt-1">
                    <div className="me-2 my-2">
                      <FontAwesomeIcon
                        className=" mx-1"
                        icon={faCalendarDays}
                        size="lg"
                        style={{ color: "#E24444" }}
                      />
                      <span className="me-3">Fecha:</span>
                      <span className="bg-fecha-primer-contacto px-4 py-1 ">
                        19-12-2023
                      </span>
                    </div>
                    <div className="my-2">
                      <FontAwesomeIcon
                        className=" mx-1"
                        icon={faClock}
                        size="lg"
                        style={{ color: "#E24444" }}
                      />{" "}
                      <span className="me-3">Hora:</span>
                      <span className="bg-fecha-primer-contacto px-4 py-1 ">
                        {formData.hora}
                      </span>
                    </div>
                  </article>
                </div>
                <div>
                  <Form.Group className="my-3" controlId="formBasicEmail">
                    <Form.Label>Comentario</Form.Label>
                    <Form.Control
                      className="input-comentario-prospecto"
                      as="textarea"
                      name="comentario"
                      onChange={handleInputChange}
                    />
                  </Form.Group>
                </div>
                <section>
                  <h6 className="fs-16 my-2">Motivo: </h6>
                  <Row>
                    <Form.Group as={Col} md="12" className="mb-3 fs-14">
                      <Form.Check
                        required
                        type="radio"
                        label="Ya trabaja con terminal Posnet/Clover."
                        feedbackType="invalid"
                        value="Ya trabaja con terminal Posnet/Clover."
                        name="motivo"
                        id="nuevoAliado"
                        onChange={handleInputChange}
                      />
                    </Form.Group>
                    <Form.Group as={Col} md="12" className="mb-3 fs-14">
                      <Form.Check
                        required
                        type="radio"
                        label="No cuenta documentación en regla."
                        feedbackType="invalid"
                        name="motivo"
                        value="No cuenta documentación en regla."
                        id="agregaTerminal"
                        onChange={handleInputChange}
                      />
                    </Form.Group>
                    <Form.Group as={Col} md="12" className="mb-3 fs-14">
                      <Form.Check
                        required
                        type="radio"
                        label="No llega al mínimo de facturación requerida."
                        feedbackType="invalid"
                        name="motivo"
                        value="No llega al mínimo de facturación requerid"
                        onChange={handleInputChange}
                      />
                    </Form.Group>
                    <Form.Group as={Col} md="12" className="mb-3 fs-14">
                      <Form.Check
                        required
                        type="radio"
                        label="Decidieron no continuar."
                        feedbackType="invalid"
                        name="motivo"
                        value="Decidieron no continuar."
                        onChange={handleInputChange}
                      />
                    </Form.Group>
                    <Form.Group as={Col} md="12" className="mb-3 fs-14">
                      <Form.Check
                        required
                        type="radio"
                        label="Otro (especificar arriba)."
                        feedbackType="invalid"
                        name="motivo"
                        value="Otro (especificar arriba)."
                        onChange={handleInputChange}
                      />
                    </Form.Group>
                  </Row>
                </section>
              </Form>
            </section>
            <div>
              <div className="d-flex justify-content-end flex-wrap py-3">
                <div className="my-2">
                  <Button
                    className="mx-2
                btn-editar-prospecto lato-bold"
                    onClick={onHide}
                  >
                    Cancelar
                  </Button>
                </div>
                <div className="my-2">
                  <Button
                    className="mx-2 btn-guardar-editar-prospecto lato-bold"
                    type="submit"
                    onClick={onHide}
                  >
                    Guardar
                  </Button>
                </div>
              </div>
            </div>
          </section>
        </Modal.Body>
      </Modal>
    </div>
  );
};

export default MiDetalleProspectoNC;
