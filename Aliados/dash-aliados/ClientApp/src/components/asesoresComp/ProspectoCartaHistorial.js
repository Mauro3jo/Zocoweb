import React, { useState } from "react";
import "./ProspectoCarta.css";
import { Button, Form, Row } from "react-bootstrap";
import Modal from "react-bootstrap/Modal";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faCalendarDays,
  faCircleInfo,
  faClock,
  faMessage,
  faPen,
  faXmark,
} from "@fortawesome/free-solid-svg-icons";

function MyDetalleProspecto(props) {
  const { show, onHide } = props;
  const [validated, setValidated] = useState(false);
  return (
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
            <h6 className="fs-18 lato-bold  ">
              {" "}
              Detalle de prospecto - historial alta
            </h6>
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
                  <span className="lato-bold fs-18">San Miguel de Tucumán</span>
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
            <div className="border-izquierda me-2"> </div>
            <article>
              <div className="d-flex">
                <div className="me-5">
                  <FontAwesomeIcon
                    className=" mx-1"
                    icon={faCalendarDays}
                    size="lg"
                    style={{ color: "#B3B5BF" }}
                  />{" "}
                  Fecha: 10/12/2023
                </div>
                <div>
                  <FontAwesomeIcon
                    className=" mx-1"
                    icon={faClock}
                    size="lg"
                    style={{ color: "#B3B5BF" }}
                  />{" "}
                  Hora: 14:14 hs
                </div>
              </div>
              <div>
                <h6 className="fs-16 mt-4">
                  Prospecto tener la primera reunión el Miércoles.
                </h6>
              </div>
            </article>
          </section>
          <h6 className="fs-16 pt-2">Reuniones</h6>
          <section className="d-flex">
            <div className="border-izquierda-verde me-2"> </div>
            <article>
              <h6 className="fs-16 pt-2">Reunión 1</h6>
              <div className="d-flex">
                <div className="me-5">
                  <FontAwesomeIcon
                    className=" mx-1"
                    icon={faCalendarDays}
                    size="lg"
                    style={{ color: "#b4c400" }}
                  />{" "}
                  Fecha: 10/12/2023
                </div>
                <div>
                  <FontAwesomeIcon
                    className=" mx-1"
                    icon={faClock}
                    size="lg"
                    style={{ color: "#b4c400" }}
                  />{" "}
                  Hora: 14:14 hs
                </div>
              </div>
              <div>
                <h6 className="fs-16 mt-4">
                  Prospecto tener la primera reunión el Miércoles.
                </h6>
              </div>
            </article>
          </section>
          <section className="d-flex">
            <div className="border-izquierda-verde px-1 me-1"> </div>
            <div className="d-flex mt-2">
              <div className="me-2" style={{ marginTop: "60px" }}>
                <FontAwesomeIcon size="lg" icon={faCircleInfo} />
              </div>
              <div className="fs-16">
                <div>
                  <h6 className="ms-2 text-black-50 fs-14">30-11-2023</h6>
                </div>
                <div className="py-4 bg-caja-comentario-detalles-prospecto">
                  <h6 className="mx-3">
                    Por favor, tené en cuenta que este comercio aún no cuenta
                    con el mínimo de facturación requerida para cobrar comisión.
                  </h6>
                </div>
              </div>
            </div>
          </section>
          <section className="d-flex mt-5">
            <div className="border-izquierda-verde me-2"> </div>
            <article>
              <h6 className="fs-16 pt-2">Reunión 2</h6>
              <div className="d-flex">
                <div className="me-5">
                  <FontAwesomeIcon
                    className=" mx-1"
                    icon={faCalendarDays}
                    size="lg"
                    style={{ color: "#b4c400" }}
                  />{" "}
                  Fecha: 10/12/2023
                </div>
                <div>
                  <FontAwesomeIcon
                    className=" mx-1"
                    icon={faClock}
                    size="lg"
                    style={{ color: "#b4c400" }}
                  />{" "}
                  Hora: 14:14 hs
                </div>
              </div>
              <div>
                <h6 className="fs-16 mt-4">
                  Prospecto tener la primera reunión el Miércoles.
                </h6>
              </div>
            </article>
          </section>
          <section className="d-flex">
            <div className="border-izquierda-verde px-1 me-1"> </div>
            <div className="d-flex">
              <div className="me-2" style={{ marginTop: "52px" }}>
                <FontAwesomeIcon size="lg" icon={faCircleInfo} />
              </div>
              <div className="fs-16">
                <div>
                  <h6 className="ms-2 text-black-50 fs-14">30-11-2023</h6>
                </div>
                <div className="py-4 bg-caja-comentario-detalles-prospecto">
                  <h6 className="mx-3">
                    Me he comunicado con el comercio y acordamos una reunión por
                    Meet.
                  </h6>
                </div>
              </div>
            </div>
          </section>
          <section className="d-flex ">
            <div className="border-izquierda-verde px-1 me-1"> </div>
            <div className="d-flex mt-4">
              <div className="me-2" style={{ marginTop: "60px" }}>
                <FontAwesomeIcon size="lg" icon={faCircleInfo} />
              </div>
              <div className="fs-16">
                <div>
                  <h6 className="ms-2 text-black-50 fs-14">30-11-2023</h6>
                </div>
                <div className="py-4 bg-caja-comentario-detalles-prospecto">
                  <h6 className="mx-3">
                    Por favor, tené en cuenta que este comercio aún no cuenta
                    con el mínimo de facturación requerida para cobrar comisión.
                  </h6>
                </div>
              </div>
            </div>
          </section>

          <div>
            <div className="d-flex justify-content-end py-3">
              <Button className="mx-2 btn-salir lato-bold" onClick={onHide}>
                Salir
              </Button>
            </div>
          </div>
        </section>
      </Modal.Body>
    </Modal>
  );
}

// PROSPECTO CIERRE
function MyDetalleProspectoCierre(props) {
  const { show, onHide } = props;
  console.log(
    "🚀 ~ file: ProspectoCartaHistorial.js:307 ~ MyDetalleProspectoCierre ~ show:",
    show
  );
  const [validated, setValidated] = useState(false);
  console.log(
    "🚀 ~ file: ProspectoCartaHistorial.js:308 ~ MyDetalleProspectoCierre ~ setValidated:",
    setValidated
  );

  // funcion para capturar el comentario en no cierra
  const [comentarioNoCierra, setComentarioNoCierra] = useState("");
  console.log(
    "🚀 ~ file: ProspectoCartaHistorial.js:321 ~ MyDetalleProspectoCierre ~ comentarioNoCierra:",
    comentarioNoCierra
  );

  const handleComentarioNoCierra = (event) => {
    const { value } = event.target;
    setComentarioNoCierra(value);
  };

  const handleSubmitNoCierra = (event) => {
    // Aquí podrías enviar el comentario a través de una solicitud de red o realizar alguna lógica con él
  };

  // funcion para dar vuelta el edit
  const [isEdit, setIsEdit] = useState(false);
  const handleSubmit = (event) => {
    event.preventDefault();
    console.log("Comentario enviado:", comentario);
    setComentario("");
  };

  const handlePrimerContactoChange = (event) => {
    const { name, value } = event.target;
    setFormData({
      ...formData,
      primerContacto: {
        ...formData.primerContacto,
        [name]: value,
      },
    });
  };

  const [comentario, setComentario] = useState("");
  const [formData, setFormData] = useState({
    primerContacto: {
      fecha: "",
      hora: "",
      comentario: "",
      motivo: "",
    },
  });
  console.log(
    "🚀 ~ file: MiDetalleProspectoPrimerContacto.js:77 ~ MiDetalleProspectosPrimerContacto ~ formData:",
    formData
  );

  return (
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
            <h6 className="fs-18 lato-bold  ">
              {" "}
              Detalle de prospecto - historial no cierra
            </h6>
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
                  <span className="lato-bold fs-18">San Miguel de Tucumán</span>
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
            <div className="border-izquierda me-2"> </div>
            <article>
              <div className="d-flex">
                <div className="me-5">
                  <FontAwesomeIcon
                    className=" mx-1"
                    icon={faCalendarDays}
                    size="lg"
                    style={{ color: "#B3B5BF" }}
                  />{" "}
                  Fecha: 10/12/2023
                </div>
                <div>
                  <FontAwesomeIcon
                    className=" mx-1"
                    icon={faClock}
                    size="lg"
                    style={{ color: "#B3B5BF" }}
                  />{" "}
                  Hora: 14:14 hs
                </div>
              </div>
              <div>
                <h6 className="fs-16 mt-4">
                  Conseguí el número del administrador del local, el local
                  cuenta con 3 sucursales.
                </h6>
              </div>
              <div>
                <h6 className="fs-16 mt-4">
                  Origen de contacto: <br />
                  <span>Recomendación</span>
                </h6>
              </div>
            </article>
          </section>
          <h6 className="fs-16 pt-2">Altas</h6>
          <section className="d-flex">
            <div className="border-izquierda-verde me-2"> </div>
            <article>
              <h6 className="fs-16 pt-2">Reunión 1</h6>
              <div className="d-flex">
                <div className="me-5">
                  <FontAwesomeIcon
                    className=" mx-1"
                    icon={faCalendarDays}
                    size="lg"
                    style={{ color: "#b4c400" }}
                  />{" "}
                  Fecha: 10/12/2023
                </div>
                <div>
                  <FontAwesomeIcon
                    className=" mx-1"
                    icon={faClock}
                    size="lg"
                    style={{ color: "#b4c400" }}
                  />{" "}
                  Hora: 14:14 hs
                </div>
              </div>
              <div>
                <h6 className="fs-16 mt-4">
                  Conseguí el número del administrador del local, el local
                  cuenta con 3 sucursales.
                </h6>
              </div>
              <div>
                <h6 className="fs-16 mt-4">
                  Origen de contacto: <br />
                  <span>Recomendación</span>
                </h6>
              </div>
            </article>
          </section>
          <section className="d-flex">
            <div className="border-izquierda-verde px-1 me-1"> </div>
            <div className="d-flex">
              <div className="me-2" style={{ marginTop: "60px" }}>
                <FontAwesomeIcon size="lg" icon={faCircleInfo} />
              </div>
              <div className="fs-16">
                <div>
                  <h6 className="">30-11-2023</h6>
                </div>
                <div className="py-4 bg-caja-comentario-detalles-prospecto">
                  <h6 className="mx-3">
                    Por favor, tené en cuenta que este comercio aún no cuenta
                    con el mínimo de facturación requerida para cobrar comisión.
                  </h6>
                </div>
              </div>
            </div>
          </section>
          <section className="d-flex mt-5">
            <div className="border-izquierda-verde me-2"> </div>
            <article>
              <h6 className="fs-16 pt-2">Reunión 2</h6>
              <div className="d-flex">
                <div className="me-5">
                  <FontAwesomeIcon
                    className=" mx-1"
                    icon={faCalendarDays}
                    size="lg"
                    style={{ color: "#b4c400" }}
                  />{" "}
                  Fecha: 10/12/2023
                </div>
                <div>
                  <FontAwesomeIcon
                    className=" mx-1"
                    icon={faClock}
                    size="lg"
                    style={{ color: "#b4c400" }}
                  />{" "}
                  Hora: 14:14 hs
                </div>
              </div>
              <div>
                <h6 className="fs-16 mt-4">
                  Conseguí el número del administrador del local, el local
                  cuenta con 3 sucursales.
                </h6>
              </div>
              <div>
                <h6 className="fs-16 mt-4">
                  Origen de contacto: <br />
                  <span>Recomendación</span>
                </h6>
              </div>
            </article>
          </section>
          <section className="d-flex">
            <div className="border-izquierda-verde px-1 me-1"> </div>
            <div className="d-flex">
              <div className="me-2" style={{ marginTop: "52px" }}>
                <FontAwesomeIcon size="lg" icon={faCircleInfo} />
              </div>
              <div className="fs-16">
                <div>
                  <h6 className="ms-2 text-black-50 fs-14">30-11-2023</h6>
                </div>
                <div className="py-4 bg-caja-comentario-detalles-prospecto">
                  <h6 className="mx-3">
                    Me he comunicado con el comercio y acordamos una reunión por
                    Meet.
                  </h6>
                </div>
              </div>
            </div>
          </section>
          <section className="d-flex ">
            <div className="border-izquierda-verde px-1 me-1"> </div>
            <div className="d-flex mt-4">
              <div className="me-2" style={{ marginTop: "60px" }}>
                <FontAwesomeIcon size="lg" icon={faCircleInfo} />
              </div>
              <div className="fs-16">
                <div>
                  <h6 className="ms-2 text-black-50 fs-14">30-11-2023</h6>
                </div>
                <div className="py-4 bg-caja-comentario-detalles-prospecto">
                  <h6 className="mx-3">
                    Por favor, tené en cuenta que este comercio aún no cuenta
                    con el mínimo de facturación requerida para cobrar comisión.
                  </h6>
                </div>
              </div>
            </div>
          </section>
          <h6 className="fs-16 pt-2 mt-5">No cierra</h6>
          <section className="d-flex ">
            <div className="border-izquierda-rojo me-2"> </div>
            <section>
              {isEdit ? (
                <div>
                  <Form
                    noValidate
                    validated={validated}
                    onSubmit={handleSubmit}
                    className="container-formularios-prospecto-primer-contacto"
                  >
                    <article className="content-between-escritorio">
                      <div className="me-5">
                        <Form.Group
                          className=" d-flex"
                          controlId="formBasicEmail"
                        >
                          <FontAwesomeIcon
                            className="my-2 mx-1"
                            icon={faCalendarDays}
                            size="lg"
                            style={{ color: "#E24444" }}
                          />
                          <Form.Label className="my-2 mx-1"> Fecha:</Form.Label>
                          <Form.Control
                            className="input-fecha-hora-estado width-153"
                            type="date"
                            name="fecha"
                            onChange={handlePrimerContactoChange}
                          />
                        </Form.Group>
                      </div>
                      <div>
                        <Form.Group
                          className=" d-flex"
                          controlId="formBasicEmail"
                        >
                          <FontAwesomeIcon
                            className="my-2 mx-1"
                            icon={faClock}
                            size="lg"
                            style={{ color: "#E24444" }}
                          />
                          <Form.Label className="my-2 mx-1"> Hora:</Form.Label>
                          <Form.Control
                            className="input-fecha-hora-estado width-153"
                            type="time"
                            name="hora"
                            onChange={handlePrimerContactoChange}
                          />
                        </Form.Group>
                      </div>
                      <div>
                        <Button
                          onClick={() => setIsEdit(!isEdit)}
                          className=" border-0 btn-editar-prospecto-prospecto"
                          type="submit"
                        >
                          <FontAwesomeIcon
                            className="me-2 text-black-50"
                            icon={faPen}
                          />
                          Guardar
                        </Button>
                      </div>
                    </article>
                    <div>
                      <div>
                        <Form.Group className="my-3" controlId="formBasicEmail">
                          <Form.Control
                            className="input-comentario-prospecto"
                            as="textarea"
                            name="comentario"
                            onChange={handlePrimerContactoChange}
                          />
                        </Form.Group>
                      </div>
                    </div>
                    <div>
                      <Row>
                        <div className="d-flex">
                          <Form.Label className="lato-regular fs-14 ">
                            Motivo:
                          </Form.Label>
                        </div>
                        <div className="">
                          <Form.Group className="mb-3 ">
                            <Form.Check
                              type="radio"
                              name="motivo"
                              label="Ya trabaja con terminal Posnet/Clover."
                              id="motivo"
                              value="Ya trabaja con terminal Posnet/Clover."
                              onChange={handlePrimerContactoChange}
                            />
                          </Form.Group>
                          <Form.Group className="mb-3 ">
                            <Form.Check
                              type="radio"
                              name="motivo"
                              label="No cuenta documentación en regla."
                              id="motivo"
                              value="No cuenta documentación en regla."
                              onChange={handlePrimerContactoChange}
                            />
                          </Form.Group>
                          <Form.Group className="mb-3 ">
                            <Form.Check
                              type="radio"
                              name="motivo"
                              label="No llega al mínimo de facturación requerida."
                              id="motivo"
                              value="No llega al mínimo de facturación requerida."
                              onChange={handlePrimerContactoChange}
                            />
                          </Form.Group>
                          <Form.Group className="mb-3 ">
                            <Form.Check
                              type="radio"
                              name="motivo"
                              label="Decidieron no continuar."
                              id="motivo"
                              value="Decidieron no continuar."
                              onChange={handlePrimerContactoChange}
                            />
                          </Form.Group>
                          <Form.Group className="mb-3 ">
                            <Form.Check
                              type="radio"
                              name="motivo"
                              label="Otro (especificar arriba)."
                              id="motivo"
                              value="Otro (especificar arriba)."
                              onChange={handlePrimerContactoChange}
                            />
                          </Form.Group>
                        </div>
                      </Row>
                    </div>
                  </Form>
                </div>
              ) : (
                <div>
                  <div className="d-flex justify-content-between">
                    <article className="d-flex">
                      <div className="me-5">
                        <FontAwesomeIcon
                          className=" mx-1"
                          icon={faCalendarDays}
                          size="lg"
                          style={{ color: "#E24444" }}
                        />{" "}
                        Fecha: 10/12/2023
                      </div>
                      <div>
                        <FontAwesomeIcon
                          className=" mx-1"
                          icon={faClock}
                          size="lg"
                          style={{ color: "#E24444" }}
                        />{" "}
                        Hora: 14:14 hs
                      </div>
                    </article>
                    <article>
                      <Button
                        aria-controls="example-collapse-text"
                        className=" border-0 btn-editar-no-cierra-detalle color-rojo"
                        onClick={() => setIsEdit(!isEdit)}
                      >
                        <FontAwesomeIcon
                          className=" mx-1"
                          icon={faPen}
                          style={{ color: "#E24444" }}
                        />
                        Editar
                      </Button>
                    </article>
                  </div>
                  <div>
                    <h6 className="fs-16 mt-4">
                      Conseguí el número del administrador del local, el local
                      cuenta con 3 sucursales.
                    </h6>
                  </div>
                  <div>
                    <h6 className="fs-16 mt-4">
                      Motivo: <br />
                      <span className="text-black-50">
                        Ya trabaja con terminal Posnet/Clover.
                      </span>
                    </h6>
                  </div>
                </div>
              )}
              <Form
                noValidate
                validated={validated}
                onSubmit={handleSubmitNoCierra}
              >
                <div>
                  <Form.Group className="my-3" controlId="formBasicEmail">
                    <Form.Label>Comentario</Form.Label>
                    <Form.Control
                      className="input-comentario-prospecto 
                      width-800"
                      as="textarea"
                      name="comentarioNoCierra"
                      onChange={handleComentarioNoCierra}
                    />
                  </Form.Group>
                </div>
                <div className="d-flex justify-content-end">
                  <Button
                    className="mx-2 btn-publicar-comentario-no-cierra lato-bold"
                    type="submit"
                  >
                    Publicar
                  </Button>
                </div>
              </Form>
            </section>
          </section>
          <div>
            <div className="d-flex justify-content-end py-3">
              <Button className="mx-2 btn-salir lato-bold" onClick={onHide}>
                Salir
              </Button>
            </div>
          </div>
        </section>
      </Modal.Body>
    </Modal>
  );
}

const ProspectoCartaHistorial = () => {
  const [isHovered, setIsHovered] = useState(false);

  const handleMouseEnter = () => {
    setIsHovered(true);
  };

  const handleMouseLeave = () => {
    setIsHovered(false);
  };

  const [modalShow, setModalShow] = React.useState(false);
  const [modalShow2, setModalShow2] = React.useState(false);

  return (
    <section className="container">
      <div className="row">
        <div className="col-6">
          <article className="carta-prospecto-historial">
            <div className="text-center py-4">
              <h6 className="lato-bold fs-18"> Altas</h6>
            </div>

            <div className="mt-2">
              <article
                className="d-flex justify-content-between container"
                onMouseEnter={handleMouseEnter}
                onMouseLeave={handleMouseLeave}
                onClick={() => setModalShow(true)}
              >
                <div className="d-flex">
                  <div>
                    <div
                      className={
                        isHovered
                          ? "border-izquierda-datos-verde active me-3"
                          : "border-izquierda-datos-verde desactive me-3"
                      }
                    ></div>
                  </div>
                  <div>
                    <div>
                      <h6 className="fs-18 lato-bold">
                        Ana Manzana <br />
                        <span className="fs-14 text-black-50">
                          Dio de alta: 13/12/2023
                        </span>
                      </h6>
                      <h6 className="fs-14 lato-bold">
                        Conseguí el número del administrador del local, el local
                        cuenta con 3 sucursales.
                      </h6>
                    </div>
                  </div>
                </div>
                <div>
                  <div className="icon-container">
                    <FontAwesomeIcon
                      icon={faMessage}
                      style={{ color: "#b4c400" }}
                    />
                    <span className="notification-badge">3</span>
                  </div>
                </div>
              </article>
              {/* boton #2 */}
              <article
                className="d-flex justify-content-between container my-3"
                onMouseEnter={handleMouseEnter}
                onMouseLeave={handleMouseLeave}
                onClick={() => setModalShow(true)}
              >
                <div className="d-flex">
                  <div>
                    <div
                      className={
                        isHovered
                          ? "border-izquierda-datos-verde active me-3"
                          : "border-izquierda-datos-verde desactive me-3"
                      }
                    ></div>
                  </div>
                  <div>
                    <div>
                      <h6 className="fs-18 lato-bold">
                        La Bandeña <br />
                        <span className="fs-14 text-black-50">
                          Dio de alta: 14/12/2023
                        </span>
                      </h6>
                      <h6 className="fs-14 lato-bold">
                        Cuando salga al campo voy a ir a concordar una reunión.
                      </h6>
                    </div>
                  </div>
                </div>
                <div>
                  <div className="icon-container">
                    <FontAwesomeIcon
                      icon={faMessage}
                      style={{ color: "#b4c400" }}
                    />
                    <span className="notification-badge">5</span>
                  </div>
                </div>
              </article>

              {/* boton #3 */}
              <article
                className="d-flex justify-content-between container my-3"
                onMouseEnter={handleMouseEnter}
                onMouseLeave={handleMouseLeave}
                onClick={() => setModalShow(true)}
              >
                <div className="d-flex">
                  <div>
                    <div
                      className={
                        isHovered
                          ? "border-izquierda-datos-verde active me-3"
                          : "border-izquierda-datos-verde desactive me-3"
                      }
                    ></div>
                  </div>
                  <div>
                    <div>
                      <h6 className="fs-18 lato-bold">
                        Ana Manzana <br />
                        <span className="fs-14 text-black-50">
                          Dio de alta: 13/12/2023
                        </span>
                      </h6>
                      <h6 className="fs-14 lato-bold">
                        Prospecto tener la primera reunión el Miércoles.
                      </h6>
                    </div>
                  </div>
                </div>
                <div>
                  <div className="icon-container">
                    <FontAwesomeIcon
                      icon={faMessage}
                      style={{ color: "#b4c400" }}
                    />
                    <span className="notification-badge">4</span>
                  </div>
                </div>
              </article>
              {/* boton #4 */}
              <article
                className="d-flex justify-content-between container my-3"
                onMouseEnter={handleMouseEnter}
                onMouseLeave={handleMouseLeave}
                onClick={() => setModalShow(true)}
              >
                <div className="d-flex">
                  <div>
                    <div
                      className={
                        isHovered
                          ? "border-izquierda-datos-verde active me-3"
                          : "border-izquierda-datos-verde desactive me-3"
                      }
                    ></div>
                  </div>
                  <div>
                    <div>
                      <h6 className="fs-18 lato-bold">
                        La Bandeña <br />
                        <span className="fs-14 text-black-50">
                          Dio de alta: 14/12/2023
                        </span>
                      </h6>
                      <h6 className="fs-14 lato-bold">
                        Cuando salga al campo voy a ir a concordar una reunión.
                      </h6>
                    </div>
                  </div>
                </div>
                <div>
                  <div className="icon-container">
                    <FontAwesomeIcon
                      icon={faMessage}
                      style={{ color: "#b4c400" }}
                    />
                    <span className="notification-badge">3</span>
                  </div>
                </div>
              </article>

              <MyDetalleProspecto
                show={modalShow}
                onHide={() => setModalShow(false)}
              />
            </div>
          </article>
        </div>
        <div className="col-6">
          <section className="carta-prospecto-historial">
            <div className="text-center py-4">
              <h6 className="color-rojo lato-bold fs-18"> No cierra</h6>
            </div>

            <article
              className="d-flex justify-content-between container"
              onMouseEnter={handleMouseEnter}
              onMouseLeave={handleMouseLeave}
              onClick={() => setModalShow2(true)}
            >
              <div className="d-flex">
                <div>
                  <div
                    className={
                      isHovered
                        ? "border-izquierda-datos-rojo active me-3"
                        : "border-izquierda-datos-rojo desactive me-3"
                    }
                  ></div>
                </div>
                <div>
                  <div>
                    <h6 className="fs-18 lato-bold">
                      Comercio 1<br />
                      <span className="fs-14 color-rojo">
                        Razón: Comercio no siguió
                      </span>
                    </h6>
                    <h6 className="fs-14 lato-bold">
                      Conseguí el número del administrador del local
                    </h6>
                  </div>
                </div>
              </div>
              <div>
                <div className="icon-container">
                  <FontAwesomeIcon
                    icon={faMessage}
                    style={{ color: "#E24444" }}
                  />
                  <span className="notification-badge">0</span>
                </div>
              </div>
            </article>

            {/* boton #2 */}
            <article
              className="d-flex justify-content-between container my-3"
              onMouseEnter={handleMouseEnter}
              onMouseLeave={handleMouseLeave}
              onClick={() => setModalShow2(true)}
            >
              <div className="d-flex">
                <div>
                  <div
                    className={
                      isHovered
                        ? "border-izquierda-datos-rojo active me-3"
                        : "border-izquierda-datos-rojo desactive me-3"
                    }
                  ></div>
                </div>
                <div>
                  <div>
                    <h6 className="fs-18 lato-bold">
                      Comercio 2<br />
                      <span className="fs-14 color-rojo">
                        Razón: Ya tiene Posnet/Clover
                      </span>
                    </h6>
                  </div>
                </div>
              </div>
              <div>
                <div className="icon-container">
                  <FontAwesomeIcon
                    icon={faMessage}
                    style={{ color: "#E24444" }}
                  />
                  <span className="notification-badge">10</span>
                </div>
              </div>
            </article>
            {/* boton #3 */}
            <article
              className="d-flex justify-content-between container my-3"
              onMouseEnter={handleMouseEnter}
              onMouseLeave={handleMouseLeave}
              onClick={() => setModalShow2(true)}
            >
              <div className="d-flex">
                <div>
                  <div
                    className={
                      isHovered
                        ? "border-izquierda-datos-rojo active me-3"
                        : "border-izquierda-datos-rojo desactive me-3"
                    }
                  ></div>
                </div>
                <div>
                  <div>
                    <h6 className="fs-18 lato-bold">
                      Comercio 3<br />
                      <span className="fs-14 color-rojo">Razón: Otro</span>
                    </h6>
                    <h6 className="fs-14 lato-bold">
                      Comercio decidió no contratar el servicio.
                    </h6>
                  </div>
                </div>
              </div>
              <div>
                <div className="icon-container">
                  <FontAwesomeIcon
                    icon={faMessage}
                    style={{ color: "#E24444" }}
                  />
                  <span className="notification-badge">4</span>
                </div>
              </div>
            </article>

            {/* boton #4 */}
            <article
              className="d-flex justify-content-between container my-3"
              onMouseEnter={handleMouseEnter}
              onMouseLeave={handleMouseLeave}
              onClick={() => setModalShow2(true)}
            >
              <div className="d-flex">
                <div>
                  <div
                    className={
                      isHovered
                        ? "border-izquierda-datos-rojo active me-3"
                        : "border-izquierda-datos-rojo desactive me-3"
                    }
                  ></div>
                </div>
                <div>
                  <div>
                    <h6 className="fs-18 lato-bold">
                      Comercio 1<br />
                      <span className="fs-14 color-rojo">
                        Razón: Ya tiene Posnet/Clover
                      </span>
                    </h6>
                  </div>
                </div>
              </div>
              <div>
                <div className="icon-container">
                  <FontAwesomeIcon
                    icon={faMessage}
                    style={{ color: "#E24444" }}
                  />
                  <span className="notification-badge">0</span>
                </div>
              </div>
            </article>
            {/* boton #5 */}
            <article
              className="d-flex justify-content-between container my-3"
              onMouseEnter={handleMouseEnter}
              onMouseLeave={handleMouseLeave}
              onClick={() => setModalShow2(true)}
            >
              <div className="d-flex">
                <div>
                  <div
                    className={
                      isHovered
                        ? "border-izquierda-datos-rojo active me-3"
                        : "border-izquierda-datos-rojo desactive me-3"
                    }
                  ></div>
                </div>
                <div>
                  <div>
                    <h6 className="fs-18 lato-bold">
                      Comercio 3<br />
                      <span className="fs-14 color-rojo">
                        Razón: Comercio no siguió
                      </span>
                    </h6>
                    <h6 className="fs-14 lato-bold">
                      Comercio decidió no contratar el servicio.
                    </h6>
                  </div>
                </div>
              </div>
              <div>
                <div className="icon-container">
                  <FontAwesomeIcon
                    icon={faMessage}
                    style={{ color: "#E24444" }}
                  />
                  <span className="notification-badge">3</span>
                </div>
              </div>
            </article>

            <MyDetalleProspectoCierre
              show={modalShow2}
              onHide={() => setModalShow2(false)}
            />
          </section>
        </div>
      </div>
    </section>
  );
};

export default ProspectoCartaHistorial;
