import React, { useState } from "react";
import "./ProspectoCarta.css";
import { Button, Collapse, Form, Row } from "react-bootstrap";
import Modal from "react-bootstrap/Modal";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faCalendarDays,
  faCaretRight,
  faCircleInfo,
  faClock,
  faPen,
  faXmark,
} from "@fortawesome/free-solid-svg-icons";

const MiDetalleProspectoPC = (props) => {
  const [open, setOpen] = useState(false);
  const [isEdit, setIsEdit] = useState(false);
  const { show, onHide } = props;
  const [validated, setValidated] = useState(false);

  // formulario #1 primer contacto
  const [formData, setFormData] = useState({
    primerContacto: {
      fecha: "",
      hora: "",
      comentario: "",
      origenBusqueda: "",
      comentarioCollapse: "",
      comentarioCollapseDatosFijos: "",
    },
    reunion: {
      fechaReuniones: "",
      horaReuniones: "",
    },
  });

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

  // logica de las reuniones asesores
  const [comentario, setComentario] = useState("");
  const handleComentarioChange = (event) => {
    setComentario(event.target.value);
  };
  const [reuniones, setReuniones] = useState([
    {
      fecha: "",
      hora: "",
      comentario: "",
      origen: "",
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
          origen: "",
        },
      ]);
    } else {
      alert("¡No se pueden agregar más de 5 reuniones!");
    }
  };

  const [openComentario, setOpenComentario] = useState(
    Array(reuniones.length).fill(false)
  );

  const [isEditReunion, setIsEditReunion] = useState(
    Array(reuniones.length).fill(false)
  );
  const [reunionesData, setReunionesData] = useState([]);
  console.log("🚀 ~ file: MiDetalleProspectoPC.js:95 ~ MiDetalleProspectoPC ~ reunionesData:", reunionesData)

  const handleReunionInputChange = (event, index) => {
    const { name, value } = event.target;
    const updatedReunionesData = [...reunionesData];
    updatedReunionesData[index] = {
      ...updatedReunionesData[index],
      [name]: value,
    };
    setReunionesData(updatedReunionesData);
  };

  const handleReunionSubmit = (event, index) => {
    event.preventDefault();
    const dataDeEstaReunion = reunionesData[index];
    console.log(dataDeEstaReunion);
    // Aquí puedes hacer algo con los datos de esta reunión, como enviarlos a través de una solicitud de red o realizar alguna lógica con ellos
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
              <h6 className="fs-18 lato-bold  ">
                {" "}
                Detalle de prospecto - 1er Contacto
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
                  <span className="fs-18 lato-bold ">Ana Manzana</span>
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
          <section className="d-flex">
            {/* EDITAR FORMULARIO PRIMER CONTACTO */}
            {isEdit ? (
              <div className="d-flex">
                <div className="border-izquierda me-2"></div>
                <Form
                  noValidate
                  validated={validated}
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
                          style={{ color: "#b4be00" }}
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
                          style={{ color: "#b4be00" }}
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
                        aria-controls="example-collapse-text"
                        aria-expanded={open}
                        className=" border-0 btn-editar-prospecto-prospecto"
                      >
                        <FontAwesomeIcon
                          className="me-2 text-black-50"
                          icon={faPen}
                        />
                        Guardar
                      </Button>
                    </div>
                  </article>
                  <article>
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
                    <Row>
                      <div className="d-flex">
                        <Form.Label className="lato-regular fs-14 ">
                          Origen de contacto:
                        </Form.Label>
                      </div>
                      <div className="d-flex justify-content-between flex-wrap">
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
                  </article>
                  <article>
                    <Button
                      onClick={() => setOpen(!open)}
                      aria-controls="example-collapse-text"
                      aria-expanded={open}
                      className="btn-comentarios-prospecto-prospecto border-0"
                    >
                      Comentarios{" "}
                      <FontAwesomeIcon
                        className="mt-1"
                        icon={faCaretRight}
                        size="lg"
                        style={{ color: "#b3b5bf" }}
                      />
                    </Button>
                    <Collapse in={open}>
                      <div id="example-collapse-text">
                        <div>
                          <Form.Group
                            className="my-3"
                            controlId="formBasicEmail"
                          >
                            <Form.Control
                              className="input-comentario-prospecto"
                              as="textarea"
                              name="comentarioCollapse"
                              onChange={handlePrimerContactoChange}
                            />
                          </Form.Group>
                        </div>
                        <div className="d-flex justify-content-end">
                          <Button
                            className="mx-2 btn-publicar-comentario-detalle lato-bold"
                            type="submit"
                          >
                            Publicar
                          </Button>
                        </div>
                        <div className="container">
                          <section className="d-flex">
                            <div className="d-flex">
                              <div
                                className="me-2"
                                style={{ marginTop: "60px" }}
                              >
                                <FontAwesomeIcon
                                  size="lg"
                                  icon={faCircleInfo}
                                />
                              </div>
                              <div className="fs-16">
                                <div>
                                  <h6 className="">30-11-2023</h6>
                                </div>
                                <div className="py-4 bg-caja-comentario-detalles-prospecto">
                                  <h6 className="mx-3">
                                    Por favor, tené en cuenta que este comercio
                                    aún no cuenta con el mínimo de facturación
                                    requerida para cobrar comisión.
                                  </h6>
                                </div>
                              </div>
                            </div>
                          </section>
                        </div>
                        <div className="container my-2">
                          <section className="d-flex">
                            <div className="d-flex">
                              <div
                                className="me-2"
                                style={{ marginTop: "60px" }}
                              >
                                <FontAwesomeIcon
                                  size="lg"
                                  icon={faCircleInfo}
                                />
                              </div>
                              <div className="fs-16">
                                <div>
                                  <h6 className="">12-12-2023</h6>
                                </div>
                                <div className="py-4 bg-caja-comentario-detalles-prospecto">
                                  <h6 className="mx-3">
                                    Por favor, tené en cuenta que este comercio
                                    aún no cuenta con el mínimo de facturación
                                    requerida para cobrar comisión.
                                  </h6>
                                </div>
                              </div>
                            </div>
                          </section>
                        </div>
                      </div>
                    </Collapse>
                  </article>
                </Form>
              </div>
            ) : (
              <div className="d-flex ">
                <div className="border-izquierda me-2"></div>
                {/* DATOS FIJOS - PUBLICAR COMENTARIO */}
                <Form
                  noValidate
                  validated={validated}
                  className="container-formularios-prospecto-primer-contacto"
                >
                  <div className="content-between-escritorio">
                    <article className="d-flex flex-wrap mt-1">
                      <div className="me-2 my-2">
                        <FontAwesomeIcon
                          className=" mx-1"
                          icon={faCalendarDays}
                          size="lg"
                          style={{ color: "#B3B5BF" }}
                        />
                        <span className="lato-bold me-1">Fecha:</span>
                        12/12/2023
                      </div>
                      <div className="my-2">
                        <FontAwesomeIcon
                          className=" mx-1"
                          icon={faClock}
                          size="lg"
                          style={{ color: "#B3B5BF" }}
                        />{" "}
                        <span className="lato-bold me-1">Hora: </span>
                        14:14 hs
                      </div>
                    </article>
                    <article className="my-2">
                      <Button
                        onClick={() => setIsEdit(!isEdit)}
                        aria-controls="example-collapse-text"
                        aria-expanded={open}
                        className=" border-0 btn-editar-prospecto-prospecto"
                      >
                        <FontAwesomeIcon
                          className="me-2 text-black-50"
                          icon={faPen}
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
                      Origen de contacto: <br />
                      <span>Recomendación</span>
                    </h6>
                  </div>
                  <Button
                    onClick={() => setOpen(!open)}
                    aria-controls="example-collapse-text"
                    aria-expanded={open}
                    className="btn-comentarios-prospecto-prospecto border-0"
                  >
                    Comentarios{" "}
                    <FontAwesomeIcon
                      className="mt-1"
                      icon={faCaretRight}
                      size="lg"
                      style={{ color: "#b3b5bf" }}
                    />
                  </Button>
                  <Collapse in={open}>
                    <div id="example-collapse-text">
                      <div>
                        <Form.Group className="my-3" controlId="formBasicEmail">
                          <Form.Control
                            className="input-comentario-prospecto"
                            as="textarea"
                            name="comentarioCollapseDatosFijos"
                            onChange={handlePrimerContactoChange}
                          />
                        </Form.Group>
                      </div>
                      <div className="d-flex justify-content-end">
                        <Button
                          className="mx-2 btn-publicar-comentario-detalle lato-bold"
                          type="submit"
                        >
                          Publicar
                        </Button>
                      </div>
                      <div>
                        <section className="d-flex">
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
                                  Por favor, tené en cuenta que este comercio
                                  aún no cuenta con el mínimo de facturación
                                  requerida para cobrar comisión.
                                </h6>
                              </div>
                            </div>
                          </div>
                        </section>
                      </div>
                    </div>
                  </Collapse>
                </Form>
              </div>
            )}
          </section>
          {/* REUNIONES ASESORES */}
          <section className="py-2">
            <h6 className="fs-16 pt-2">Reunión </h6>
            {reuniones.map((reunion, index) => (
              <article key={index} className="d-flex">
                <article className="d-flex ">
                  <div>
                    <section className="d-flex mt-2">
                      {isEditReunion[index] ? (
                        <div className="d-flex ">
                          <div className="border-izquierda-verde me-2"></div>
                          <Form
                            noValidate
                            validated={validated}
                            onSubmit={(event) =>
                              handleReunionSubmit(event, index)
                            }
                            className="container-formularios-prospecto-primer-contacto"
                          >
                            <h6 className="fs-16 pt-2">Reunión {index + 1}</h6>
                            <div className="">
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
                                <div>
                                  <Button
                                    onClick={() => {
                                      const newIsEditReunion = [
                                        ...isEditReunion,
                                      ];
                                      newIsEditReunion[index] =
                                        !newIsEditReunion[index];
                                      setIsEditReunion(newIsEditReunion);
                                    }}
                                    className="border-0 btn-editar-prospecto-prospecto"
                                  >
                                    <FontAwesomeIcon
                                      className="me-2 text-black-50"
                                      icon={faPen}
                                    />
                                    Guardar
                                  </Button>
                                </div>
                              </article>
                            </div>
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
                            <div>
                              <Row>
                                <div className="d-flex">
                                  <Form.Label className="lato-regular fs-14 ">
                                    Origen de contacto:
                                  </Form.Label>
                                </div>
                                <div className="d-flex justify-content-between flex-wrap">
                                  <Form.Group className="mb-3 ">
                                    <Form.Check
                                      type="radio"
                                      name="origenBusqueda"
                                      label="Búsqueda"
                                      id="origenContacto"
                                      value="por Busqueda"
                                      onChange={(event) =>
                                        handleReunionInputChange(event, index)
                                      }
                                    />
                                  </Form.Group>
                                  <Form.Group className="mb-3 ">
                                    <Form.Check
                                      type="radio"
                                      name="origenBusqueda"
                                      label="Recomendación"
                                      id="origenContacto"
                                      value="por Recomendacion"
                                      onChange={(event) =>
                                        handleReunionInputChange(event, index)
                                      }
                                    />
                                  </Form.Group>
                                  <Form.Group className="mb-3 ">
                                    <Form.Check
                                      type="radio"
                                      name="origenBusqueda"
                                      label="Otra (especificar arriba)"
                                      id="origenContacto"
                                      value="por Otra Especifica "
                                      onChange={(event) =>
                                        handleReunionInputChange(event, index)
                                      }
                                    />
                                  </Form.Group>
                                </div>
                              </Row>
                            </div>
                            <Button
                              onClick={() => {
                                const newOpenComentario = [...openComentario];
                                newOpenComentario[index] =
                                  !newOpenComentario[index];
                                setOpenComentario(newOpenComentario);
                              }}
                              aria-controls={`example-collapse-text-${index}`}
                              aria-expanded={openComentario[index]}
                              className="btn-comentarios-prospecto-prospecto border-0"
                            >
                              Comentarios{" "}
                              <FontAwesomeIcon
                                className="mt-1"
                                icon={faCaretRight}
                                size="lg"
                                style={{ color: "#b4be00" }}
                              />
                            </Button>
                            <Collapse in={openComentario[index]}>
                              <div id={`example-collapse-text-${index}`}>
                                <div>
                                  <Form.Group
                                    className="my-3"
                                    controlId="formBasicEmail"
                                  >
                                    <Form.Control
                                      className="input-comentario-prospecto
                        width-700"
                                      as="textarea"
                                      name="comentarioCollapse"
                                      
                                      onChange={(event) =>
                                        handleReunionInputChange(event, index)
                                      }
                                    />
                                  </Form.Group>
                                </div>
                                <div className="d-flex justify-content-end">
                                  <Button
                                    className="mx-2 btn-publicar-comentario-detalle lato-bold"
                                    type="submit"
                                  >
                                    Publicar
                                  </Button>
                                </div>
                                <section className="d-flex">
                                  <div className="d-flex">
                                    <div
                                      className="me-2"
                                      style={{ marginTop: "60px" }}
                                    >
                                      <FontAwesomeIcon
                                        size="lg"
                                        icon={faCircleInfo}
                                      />
                                    </div>
                                    <div className="fs-16">
                                      <div>
                                        <h6 className="">11-12-2023</h6>
                                      </div>
                                      <div className="py-4 bg-caja-comentario-detalles-prospecto">
                                        <h6 className="mx-3">
                                          Por favor, tené en cuenta que este
                                          comercio aún no cuenta con el mínimo
                                          de facturación requerida para cobrar
                                          comisión.
                                        </h6>
                                      </div>
                                    </div>
                                  </div>
                                </section>
                              </div>
                            </Collapse>
                          </Form>
                        </div>
                      ) : (
                        <div className="d-flex ">
                          <div className="border-izquierda-verde me-2"></div>
                          <Form
                            noValidate
                            validated={validated}
                            onSubmit={(event) =>
                              handleReunionSubmit(event, index)
                            }
                            className="container-formularios-prospecto-primer-contacto"
                          >
                            <h6 className="fs-16 pt-2">Reunión {index + 1}</h6>
                            <div className="content-between-escritorio">
                              <article className="d-flex flex-wrap mt-1">
                                <div className="me-2 my-2">
                                  <FontAwesomeIcon
                                    className=" mx-1"
                                    icon={faCalendarDays}
                                    size="lg"
                                    style={{ color: "#b4be00" }}
                                  />
                                  <span className="lato-bold me-1">Fecha:</span>
                                  12/12/2023
                                </div>
                                <div className="my-2">
                                  <FontAwesomeIcon
                                    className=" mx-1"
                                    icon={faClock}
                                    size="lg"
                                    style={{ color: "#b4be00" }}
                                  />{" "}
                                  <span className="lato-bold me-1">Hora: </span>
                                  14:14 hs
                                </div>
                              </article>
                              <article className="my-2">
                                <Button
                                  onClick={() => {
                                    const newIsEditReunion = [...isEditReunion];
                                    newIsEditReunion[index] =
                                      !newIsEditReunion[index];
                                    setIsEditReunion(newIsEditReunion);
                                  }}
                                  className="border-0 btn-editar-prospecto-prospecto"
                                >
                                  <FontAwesomeIcon
                                    className="me-2 text-black-50"
                                    icon={faPen}
                                  />
                                  Editar
                                </Button>
                              </article>
                            </div>

                            <div>
                              <h6 className="fs-16 mt-4">
                                Conseguí el número del administrador del local,
                                el local cuenta con 3 sucursales.
                              </h6>
                            </div>
                            <div>
                              <h6 className="fs-16 mt-4">
                                Origen de contacto: <br />
                                <span>Recomendación</span>
                              </h6>
                            </div>
                            <Button
                              onClick={() => {
                                const newOpenComentario = [...openComentario];
                                newOpenComentario[index] =
                                  !newOpenComentario[index];
                                setOpenComentario(newOpenComentario);
                              }}
                              aria-controls={`example-collapse-text-${index}`}
                              aria-expanded={openComentario[index]}
                              className="btn-comentarios-prospecto-prospecto border-0"
                            >
                              Comentarios{" "}
                              <FontAwesomeIcon
                                className="mt-1"
                                icon={faCaretRight}
                                size="lg"
                                style={{ color: "#b4be00" }}
                              />
                            </Button>
                            <Collapse in={openComentario[index]}>
                              <div id={`example-collapse-text-${index}`}>
                                <div>
                                  <Form.Group
                                    className="my-3"
                                    controlId="formBasicEmail"
                                  >
                                    <Form.Control
                                      className="input-comentario-prospecto 
                  width-700"
                                      as="textarea"
                                      name="comentario"
                                      value={comentario}
                                      onChange={handleComentarioChange}
                                    />
                                  </Form.Group>
                                </div>
                                <div className="d-flex justify-content-end">
                                  <Button
                                    className="mx-2 btn-publicar-comentario-detalle lato-bold"
                                    type="submit"
                                  >
                                    Publicar
                                  </Button>
                                </div>
                                <section className="d-flex">
                                  <div className="d-flex">
                                    <div
                                      className="me-2"
                                      style={{ marginTop: "60px" }}
                                    >
                                      <FontAwesomeIcon
                                        size="lg"
                                        icon={faCircleInfo}
                                      />
                                    </div>
                                    <div className="fs-16">
                                      <div>
                                        <h6 className="">11-12-2023</h6>
                                      </div>
                                      <div className="py-4 bg-caja-comentario-detalles-prospecto">
                                        <h6 className="mx-3">
                                          Por favor, tené en cuenta que este
                                          comercio aún no cuenta con el mínimo
                                          de facturación requerida para cobrar
                                          comisión.
                                        </h6>
                                      </div>
                                    </div>
                                  </div>
                                </section>
                              </div>
                            </Collapse>
                          </Form>
                        </div>
                      )}
                    </section>
                  </div>
                </article>
              </article>
            ))}
          </section>
          {reuniones.length < 5 && (
            <button
              className="btn-nueva-reunion  border-0 lato-bold fs-16"
              onClick={agregarReunion}
            >
              + Agregar Reunión
            </button>
          )}
          <section>
            <div className="d-flex justify-content-between py-3">
              <div>
                <Button
                  onClick={onHide}
                  className="mx-2 btn-si-cierra  lato-bold my-2"
                >
                  Si cierra
                </Button>
                <Button
                  onClick={onHide}
                  className="mx-2 btn-no-cierra lato-bold my-2"
                >
                  No Cierra
                </Button>
              </div>
              <div>
                <Button
                  onClick={onHide}
                  className="mx-2 btn-guardar-editar-prospecto lato-bold my-2"
                  type="submit"
                >
                  Salir
                </Button>
              </div>
            </div>
          </section>
        </Modal.Body>
      </Modal>
    </div>
  );
};

export default MiDetalleProspectoPC;
