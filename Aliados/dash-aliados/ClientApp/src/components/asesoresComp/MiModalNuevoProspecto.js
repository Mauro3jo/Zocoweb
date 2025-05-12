import React from "react";
import { useState } from "react";
import Button from "react-bootstrap/Button";
import Modal from "react-bootstrap/Modal";
import {
  faCalendarDays,
  faClock,
  faXmark,
} from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { Form } from "react-bootstrap";
import { Col, Row } from "reactstrap";


const MiModalNuevoProspecto = (props) => {
  const { show, onHide } = props;
  const [validated, setValidated] = useState(false);
  const [reuniones, setReuniones] = useState([
    {
      fecha: "",
      hora: "",
      comentario: "",
    },
  ]);

  const agregarReunion = () => {
    if (reuniones.length < 5) {
      setReuniones([
        ...reuniones,
        {
          fecha: "",
          hora: "",
          comentario: "",
        },
      ]);
    } else {
      alert("¡No se pueden agregar más de 5 reuniones!");
    }
  };

  const [formData, setFormData] = useState({
    datosComercio: {
      nombreFantasia: "",
      domicilio: "",
      localidad: "",
      codigoPostal: "",
      rubro: "",
      facturacionEstimada: "",
      sucursalesProyectadas: "",
      cuentaConTerminalPosnetClover: "",
    },
    primerContacto: {
      fecha: "",
      hora: "",
      comentario: "",
      origenBusqueda: "",
    },
    reuniones: [
      {
        fecha: "",
        hora: "",
        comentario: "",
      },
    ],
  });

  const handleSubmit = (event) => {
    event.preventDefault();
    // aqui estan los datos capturados del formulario para enviarlos al back
    const { datosComercio, primerContacto, reuniones } = formData;
    console.log(datosComercio);
    console.log(primerContacto);
    console.log(reuniones);
  };

  const handleDatosComercioChange = (event) => {
    const { name, value } = event.target;
    setFormData({
      ...formData,
      datosComercio: {
        ...formData.datosComercio,
        [name]: value,
      },
    });
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

  const handleReunionInputChange = (event, index) => {
    const { name, value } = event.target;
    const updatedReuniones = [...formData.reuniones];
    updatedReuniones[index] = {
      ...updatedReuniones[index],
      [name]: value,
    };
    setFormData({
      ...formData,
      reuniones: updatedReuniones,
    });
  };

  const [isActive, setIsActive] = useState(false);
  return (
    <Modal
      {...props}
      size="lg"
      aria-labelledby="contained-modal-title-vcenter"
      centered
    >
      <Modal.Body>
        <section className="d-flex justify-content-between my-4">
          <div className="ocultar-div"></div>
          <div className="d-flex justify-content-center">
            <h6 className="fs-18 lato-bold  "> Editar prospecto</h6>
          </div>
          <div>
            <button className="border-0 btn-filtro-cruz" onClick={onHide}>
              <FontAwesomeIcon className="fs-18 " icon={faXmark} />
            </button>
          </div>
        </section>
        <section>
          <h6 className="px-5">Datos del comercio</h6>
          <Form
            className="px-5"
            noValidate
            validated={validated}
            onSubmit={handleSubmit}
          >
            <Row className="mb-3">
              <Form.Group as={Col} md="12">
                <Form.Label className="fs-14">Nombre de fantasía</Form.Label>
                <Form.Control
                  onChange={handleDatosComercioChange}
                  className="input-formulario lato-bold"
                  required
                  type="text"
                  name="nombreFantasia"
                />
              </Form.Group>
            </Row>
            <Row className="mb-3">
              <Form.Group as={Col} lg="6" md="12">
                <Form.Label className="fs-14">Domicilio</Form.Label>
                <Form.Control
                  onChange={handleDatosComercioChange}
                  className="input-formulario lato-bold"
                  required
                  type="text"
                  name="domicilio"
                />
              </Form.Group>
              <Form.Group as={Col} lg="4" md="12">
                <Form.Label className="fs-14">Localidad</Form.Label>
                <Form.Control
                  onChange={handleDatosComercioChange}
                  className="input-formulario lato-bold"
                  required
                  type="text"
                  name="localidad"
                />
              </Form.Group>
              <Form.Group as={Col} lg="2" md="12">
                <Form.Label className="fs-14">Código postal</Form.Label>
                <Form.Control
                  onChange={handleDatosComercioChange}
                  className="input-formulario lato-bold"
                  required
                  type="number"
                  name="codigoPostal"
                />
              </Form.Group>
            </Row>

            <Row className="mb-3 ">
              <Form.Group controlId="validationCustom01" as={Col} md="5">
                <Form.Label className="fs-14">Rubro</Form.Label>
                <Form.Select
                  className="input-formulario"
                  aria-label="Default select example"
                  name="rubro"
                  value={formData.datosComercio.rubro}
                  onChange={handleDatosComercioChange}
                >
                  <option value="Alimentación">Alimentación</option>
                  <option value="Farmacia">Farmacia</option>
                  <option value="Indumentaria">Indumentaria</option>
                  <option value="Construcción">Construcción</option>
                  <option value="Repuestos">Repuestos</option>
                  <option value="Óptica">Óptica</option>
                  <option value="Juguetería">Juguetería</option>
                  <option value="Perfumería">Perfumería</option>
                  <option value="Turismo">Turismo</option>
                  <option value="Mueblería">Mueblería</option>
                  <option value="Tecnología">Tecnología</option>
                  <option value="Veterinaria">Veterinaria</option>
                  <option value="Educación">Educación</option>
                </Form.Select>
              </Form.Group>
              <Form.Group controlId="validationCustom01" as={Col} md="4">
                <Form.Label className="fs-14">
                  Facturación estimada (por mes)
                </Form.Label>
                <Form.Control
                  onChange={handleDatosComercioChange}
                  className="input-formulario lato-bold"
                  required
                  type="number"
                  name="facturacionEstimada"
                />
              </Form.Group>
              <Form.Group controlId="validationCustom01" as={Col} md="3">
                <Form.Label className="fs-14">
                  Sucursales proyectadas
                </Form.Label>
                <Form.Control
                  onChange={handleDatosComercioChange}
                  className="input-formulario lato-bold"
                  required
                  type="number"
                  name="sucursalesProyectadas"
                />
              </Form.Group>
            </Row>
            <Row>
              <div className="d-flex flex-wrap" as={Col} md="6">
                <Form.Label className="lato-regular fs-14">
                  ¿Ya cuenta con Terminal de Posnet / Clover?
                </Form.Label>
                <Form.Group className="mb-3 mx-3">
                  <Form.Check
                    type="radio"
                    name="cuentaConTerminalPosnetClover"
                    label="Si"
                    id="¿Ya cuenta con Terminal de Posnet / Clover?"
                    value="Si"
                    onChange={handleDatosComercioChange}
                    onClick={() => setIsActive(true)}
                  />
                </Form.Group>
                <Form.Group className="mb-3 mx-3">
                  <Form.Check
                    type="radio"
                    name="cuentaConTerminalPosnetClover"
                    label="No"
                    id="¿Ya cuenta con Terminal de Posnet / Clover?"
                    value="No"
                    onChange={handleDatosComercioChange}
                    onClick={() => setIsActive(false)}
                  />
                </Form.Group>
              </div>
            </Row>
            {isActive && (
              <h6 className="color-rojo fs-16 lato-bold">
                ADVERTENCIA: Si el comercio ya cuenta con una terminal Posnet o
                Clover recomendamos no continuar con el prospecto. Ante
                cualquier duda por favor comunicarse con el departamento de ABM.
              </h6>
            )}
            {isActive === true ? (
              <div> verdadero</div>
            ) : (
              <div>
                <div className="mt-4">
                  <h6>1er contacto</h6>
                </div>
                <section className="d-flex">
                  <div className="border-izquierda me-2"></div>
                  <div className="container-formularios-prospecto-primer-contacto">
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
                            style={{ color: "#b4be00" }}
                          />
                          <Form.Label className="my-2 mx-1"> Fecha:</Form.Label>
                          <Form.Control
                            className="input-fecha-hora-estado width-153"
                            type="date"
                            name="fecha"
                            // onChange={(event) =>
                            //   handleReunionInputChange(event, index)
                            // }
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
                            style={{ color: "#b4be00" }}
                          />
                          <Form.Label className="my-2 mx-1"> Hora:</Form.Label>
                          <Form.Control
                            className="input-fecha-hora-estado width-153"
                            type="time"
                            name="hora"
                            // onChange={(event) =>
                            //   handleReunionInputChange(event, index)
                            // }
                          />
                        </Form.Group>
                      </div>
                      <div className="ocultar-div">
                        <div className="mx-4"> mt2</div>
                      </div>
                    </article>
                    <div>
                      <div>
                        <Form.Group className="my-3" controlId="formBasicEmail">
                          <Form.Control
                            className="input-comentario-prospecto"
                            as="textarea"
                            name="comentario"
                            // onChange={(event) =>
                            //   handleReunionInputChange(event, index)
                            // }
                          />
                        </Form.Group>
                      </div>
                      <div>
                        <Row>
                          <div className="d-flex">
                            <Form.Label className="lato-regular fs-14 ">
                              Origen de contacto:
                            </Form.Label>
                          </div>
                          <div className="d-flex justify-content-between flex-wrap ">
                            <Form.Group className="mb-3 ">
                              <Form.Check
                                type="radio"
                                name="origenBusqueda"
                                label="Búsqueda"
                                id="origenContacto"
                                value="por Busqueda"
                                onChange={handlePrimerContactoChange}
                              />
                            </Form.Group>
                            <Form.Group className="mb-3 ">
                              <Form.Check
                                type="radio"
                                name="origenBusqueda"
                                label="Recomendación"
                                id="origenContacto"
                                value="por Recomendacion"
                                onChange={handlePrimerContactoChange}
                              />
                            </Form.Group>
                            <Form.Group className="mb-3 ">
                              <Form.Check
                                type="radio"
                                name="origenBusqueda"
                                label="Otra (especificar arriba)"
                                id="origenContacto"
                                value="por Otra Especifica "
                                onChange={handlePrimerContactoChange}
                              />
                            </Form.Group>
                          </div>
                        </Row>
                      </div>
                    </div>
                  </div>
                </section>

                {/* hasta aqui */}
                <h6 className="mt-4">Reuniones</h6>
                {/* Iterar sobre las reuniones y mostrarlas */}
                {reuniones.map((reunion, index) => (
                  <article key={index} className="d-flex my-4">
                    <div className="border-izquierda-verde me-2"></div>

                    <div className="container-formularios-prospecto-primer-contacto">
                      <h6>Reunión {index + 1}</h6>
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
                              style={{ color: "#b4be00" }}
                            />
                            <Form.Label className="my-2 mx-1">
                              {" "}
                              Fecha:
                            </Form.Label>
                            <Form.Control
                              className="input-fecha-hora-estado width-153"
                              type="date"
                              name="fecha"
                              onChange={(event) =>
                                handleReunionInputChange(event, index)
                              }
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
                              style={{ color: "#b4be00" }}
                            />
                            <Form.Label className="my-2 mx-1">
                              {" "}
                              Hora:
                            </Form.Label>
                            <Form.Control
                              className="input-fecha-hora-estado width-153"
                              type="time"
                              name="hora"
                              onChange={(event) =>
                                handleReunionInputChange(event, index)
                              }
                            />
                          </Form.Group>
                        </div>
                        <div className="ocultar-div">
                          <div className="mx-4"> mt2</div>
                        </div>
                      </article>
                      <div>
                        <div>
                          <Form.Group
                            className="my-3"
                            controlId="formBasicEmail"
                          >
                            <Form.Control
                              className="input-comentario-prospecto"
                              as="textarea"
                              name="comentario"
                              onChange={(event) =>
                                handleReunionInputChange(event, index)
                              }
                            />
                          </Form.Group>
                        </div>
                      </div>
                    </div>
                  </article>
                ))}
                {reuniones.length < 5 && (
                  <button
                    className="btn-nueva-reunion  border-0 lato-bold fs-16"
                    onClick={agregarReunion}
                  >
                    + Agregar Reunión
                  </button>
                )}
              </div>
            )}

            <div className="d-flex justify-content-end">
              <Button
                onClick={onHide}
                className="mx-2 btn-cancelar-editar-prospecto  lato-bold"
              >
                Cancelar
              </Button>
              <Button
                className="mx-2 btn-guardar-editar-prospecto lato-bold"
                type="submit"
                onClick={onHide}
              >
                Guardar
              </Button>
            </div>
          </Form>
        </section>
      </Modal.Body>
    </Modal>
  );
};

export default MiModalNuevoProspecto;
