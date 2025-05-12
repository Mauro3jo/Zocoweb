import React, { useState } from "react";
import "./ProspectoCarta.css";
import { Button, Form } from "react-bootstrap";
import Modal from "react-bootstrap/Modal";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faCalendarDays,
  faCircleInfo,
  faClock,
  faXmark,
} from "@fortawesome/free-solid-svg-icons";


const MiDetalleNoCierraProspectoHistorial = (props) => {
    const { show, onHide } = props;
    const [validated, setValidated] = useState(false);
    const [comentarioReunion, setComentarioReunion] = useState("");
  
    const handleComentarioReunionChange = (event) => {
      setComentarioReunion(event.target.value);
    };
  
    const handleSubmitReunion = (event) => {
      event.preventDefault();
      console.log("Comentario enviado:", comentarioReunion);
      setComentarioReunion("");
    };
  
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
                Detalle de prospecto
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
                    <span className="text-black-50">Ya trabaja con terminal Posnet/Clover.</span>
                  </h6>
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
            <div>
              <div className="d-flex justify-content-between py-3">
                <Button
                  onClick={onHide}
                  className="mx-2 btn-cancelar-editar-prospecto  lato-bold"
                >
                  No cierra
                </Button>
                <Button
                  className="mx-2 btn-guardar-editar-prospecto lato-bold"
                  type="submit"
                >
                  Salir
                </Button>
              </div>
            </div>
          </section>
        </Modal.Body>
      </Modal>
      )
};

export default MiDetalleNoCierraProspectoHistorial;