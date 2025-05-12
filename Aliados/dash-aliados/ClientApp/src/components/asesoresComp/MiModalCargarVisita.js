import { faXmark } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import React, { useState } from "react";
import { Button, Col, Form, Modal, Row } from "react-bootstrap";

const MiModalCargarVisita = (props) => {
  const { show, onHide } = props;

  const [formData, setFormData] = useState({
    datosForm: {
      nombreTerminal: "7",
      nombreComercio: "Craft",
      visitaFecha: "20-12-2023",
      nombreApellidoTitularZoco: "",
      firmaOtroZoco: "",
      otroNombreActivado: "",
      motivoOtraFirma: "",
    },
    firmaCuponValues: {
      firmaDeCupon: "",
    },
    condicionFiscalValues: {
      condicionAFIP: "",
    },
    monotributistaRespIncriptoValues: {
      monotributistaRespIncripto: "",
    },
    condicionFiscalRentasValues: {
      condicionRentas: "",
    },
    archivosAdjuntos: [],

  });
  console.log(
    "🚀 ~ file: MiModalCargarVisita.js:13 ~ MiModalCargarVisita ~ formData:",
    formData
  );

  const [isActiveOtroNombre, setIsActiveOtroNombre] = useState(true);

  const handleSubmit = (event) => {
    event.preventDefault();
    const {
      datosForm,
      firmaCuponValues,
      condicionFiscalValues,
      monotributistaRespIncriptoValues,
      condicionFiscalRentasValues,
    } = formData;
    
    
  };

  const handleInputChange = (event) => {
    const { name, value } = event.target;
    setFormData({
      datosForm: {
        ...formData.datosForm,
        [name]: value,
      },
    });
  };

  const handleFirmaCuponChange = (selectedFirmaCupon) => {
    setFormData((prevData) => ({
      ...prevData,
      firmaCuponValues: {
        firmaDeCupon: selectedFirmaCupon,
      },
    }));
  };

  const titularComercio = () => {
    handleFirmaCuponChange("Titular del comercio");
    setIsActiveOtroNombre(true);
  };

  const autorizado = () => {
    handleFirmaCuponChange("Autorizado");
    setIsActiveOtroNombre(true);
  };

  const otroNombre = () => {
    handleFirmaCuponChange("Otro (nombre)");
    setIsActiveOtroNombre(!isActiveOtroNombre);
  };

  const handleCondicionFiscalChange = (selectedCondicionFiscal) => {
    setFormData((prevData) => ({
      ...prevData,
      condicionFiscalValues: {
        condicionAFIP: selectedCondicionFiscal,
      },
    }));
  };

  const [isActiveOptionCondicionFiscal, setIsActiveOptionCondicionFiscal] =
    useState(true);

  const condicionFiscalAfirmativa = () => {
    handleCondicionFiscalChange("Si, Modifica la condicion fiscal de AFIP");
    setIsActiveOptionCondicionFiscal(false);
    setIsActiveExentoGananciaIVA(true)
  };

  const condicionFiscalNegativa = () => {
    handleCondicionFiscalChange("No, Modifica la condicion fiscal de AFIP");
    setIsActiveOptionCondicionFiscal(true);
    setIsActiveExentoGananciaIVA(true)
  };

  const handleMonotributistaRespInscriptoChange = (
    selectedMonotributistaRespIncripto
  ) => {
    setFormData((prevData) => ({
      ...prevData,
      monotributistaRespIncriptoValues: {
        monotributistaRespIncripto: selectedMonotributistaRespIncripto,
      },
    }));
  };
  const monotributista = () => {
    handleMonotributistaRespInscriptoChange("Monotributista");
    setIsActiveExentoGananciaIVA(true)
  };

  const [isActiveExentoGananciaIVA, setIsActiveExentoGananciaIVA] = useState(true)


  const responsableInscripto = () => {
    handleMonotributistaRespInscriptoChange("Responsable Inscripto");
    setIsActiveExentoGananciaIVA(false)
  };

  const [
    isActiveOptionCondicionFiscalRentas,
    setIsActiveOptionCondicionFiscalRentas,
  ] = useState(true);

  const handleCondicionFiscalRentasChange = (selectedCondicionFiscalRentas) => {
    setFormData((prevData) => ({
      ...prevData,
      condicionFiscalRentasValues: {
        condicionRentas: selectedCondicionFiscalRentas,
      },
    }));
  };

  const condicionRentasAfirmativa = () => {
    handleCondicionFiscalRentasChange(
      "Si, Modifica la condicion fiscal de Rentas"
    );
    setIsActiveOptionCondicionFiscalRentas(false);
  };

  const condicionRentasNegativa = () => {
    handleCondicionFiscalRentasChange(
      "No, Modifica la condicion fiscal de Rentas"
    );
    setIsActiveOptionCondicionFiscalRentas(true);
  };


  // Manejar cambios en los archivos seleccionados en el state formData
  const handleFileChange = (event, tipoArchivo) => {
    if (event.target.files.length > 0) {
      const newFiles = Array.from(event.target.files);
      setFormData((prevData) => ({
        ...prevData,
        archivosAdjuntos: newFiles, 
      }));
    }
  };
  return (
    <div>
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
              <h6 className="fs-18 lato-bold">Formulario de Visitas</h6>
            </div>
            <div>
              <button className="border-0 btn-filtro-cruz" onClick={onHide}>
                <FontAwesomeIcon className="fs-18 " icon={faXmark} />
              </button>
            </div>
          </section>
          <section>
            <Form className="container" onSubmit={handleSubmit}>
              <Row className="mb-3">
                <Form.Group as={Col} lg="4" md="12">
                  <Form.Label className="fs-14">Número de terminal</Form.Label>
                  <Form.Control
                    disabled
                    className="input-formulario-disabled  lato-bold"
                    required
                    value={formData.datosForm.nombreTerminal}
                    type="number"
                    name="numeroTerminal"
                  />
                </Form.Group>
                <Form.Group as={Col} lg="5" md="12">
                  <Form.Label className="fs-14">Nombre del comercio</Form.Label>
                  <Form.Control
                    disabled
                    className="input-formulario-disabled  lato-bold"
                    required
                    type="text"
                    value={formData.datosForm.nombreComercio}
                    name="nombreComercio"
                  />
                </Form.Group>
                <Form.Group as={Col} lg="3" md="12">
                  <Form.Label className="fs-14">Fecha</Form.Label>
                  <Form.Control
                    disabled
                    className="input-formulario-disabled  lato-bold"
                    required
                    value={"15/12/2023"}
                    type="text"
                    name="fecha"
                  />
                </Form.Group>
              </Row>
              <Row>
                <Form.Group as={Col} lg="12" md="12">
                  <Form.Label className="fs-14">
                    Nombre y apellido del titular en Zoco o autorizado
                  </Form.Label>
                  <Form.Control
                    className="input-formulario lato-bold"
                    required
                    type="text"
                    name="nombreApellidoTitularZoco"
                    value={formData.datosForm.nombreApellidoTitularZoco}
                    onChange={handleInputChange}
                  />
                </Form.Group>
              </Row>
              <Row>
                <Form.Label className="fs-14 mt-2">
                  Firma en el cupón (aclarar quién firma el cupón marcando la
                  opción correcta)
                </Form.Label>
                <div className="d-flex flex-wrap">
                  <Form.Group as={Col} md="12" lg="4" className="mb-3 fs-14">
                    <Form.Check
                      required
                      type="radio"
                      label="Titular del comercio"
                      id="titularComercio"
                      name="firmaDeCupon"
                      onClick={titularComercio}
                    />
                  </Form.Group>
                  <Form.Group as={Col} md="12" lg="4"  className="mb-3 fs-14">
                    <Form.Check
                      required
                      type="radio"
                      label="Autorizado"
                      id="autorizado"
                      name="firmaDeCupon"
                      onClick={autorizado}
                    />
                  </Form.Group>

                  <Form.Group as={Col} md="12" lg="4"  className="mb-3 fs-14">
                    <Form.Check
                      required
                      type="radio"
                      label="Otro (nombre):"
                      id="otroNombre"
                      name="firmaDeCupon"
                      onClick={otroNombre}
                    />
                    <div>
                      <Form.Group as={Col} md="12">
                        <Form.Control
                          disabled={isActiveOtroNombre}
                          className={
                            isActiveOtroNombre
                              ? "input-formulario-disabled lato-bold "
                              : "input-formulario lato-bold"
                          }
                          required
                          type="text"
                          name="otroNombreActivado"
                          onChange={handleInputChange}
                        />
                      </Form.Group>
                    </div>
                  </Form.Group>
                </div>
              </Row>
              <Row>
                <Form.Group as={Col} lg="12" md="12">
                  <Form.Label className="fs-14">
                    En caso de que otro haya firmado el cupón aclarar el motivo
                    y carácter por el cual lo hace
                  </Form.Label>
                  <Form.Control
                    disabled={isActiveOtroNombre}
                    className={
                      isActiveOtroNombre
                        ? "input-formulario-disabled lato-bold "
                        : "input-formulario lato-bold"
                    }
                    required
                    type="text"
                    name="motivoOtraFirma"
                    onChange={handleInputChange}
                  />
                </Form.Group>
              </Row>
              <Row className="py-2">
                <article className="col-12 col-lg-6">
                  <div className="mt-2">
                    <h6 className=" lato-regular fs-16">
                      {" "}
                      Modificación en condición fiscal de AFIP
                    </h6>
                    <Row>
                      <Form.Group as={Col} md="6" className="mb-3">
                        <Form.Check
                          required
                          type="radio"
                          label="Si"
                          feedbackType="invalid"
                          id="monotributista"
                          name="condicionFiscal"
                          onClick={condicionFiscalAfirmativa}
                        />
                      </Form.Group>
                      <Form.Group as={Col} md="6" className="mb-3">
                        <Form.Check
                          required
                          type="radio"
                          label="No"
                          defaultChecked
                          name="condicionFiscal"
                          id="inscripto"
                          feedbackType="invalid"
                          onClick={condicionFiscalNegativa}
                        />
                      </Form.Group>
                    </Row>
                    <Row>
                      <Form.Group as={Col} md="6" className="mb-3">
                        <Form.Check
                          disabled={isActiveOptionCondicionFiscal}
                          required
                          type="radio"
                          label="Monotributista"
                          feedbackType="invalid"
                          id="monotributista"
                          name="monotributistaInscripto"
                          onClick={monotributista}
                        />
                      </Form.Group>
                      <Form.Group as={Col} md="6" className="mb-3">
                        <Form.Check
                          disabled={isActiveOptionCondicionFiscal}
                          required
                          type="radio"
                          label="Resp. inscripto"
                          name="monotributistaInscripto"
                          id="inscripto"
                          feedbackType="invalid"
                          onClick={responsableInscripto}
                        />
                      </Form.Group>
                    </Row>
                    <Row>
                      <Form.Group as={Col} md="6" className="mb-3">
                        <Form.Check 
                          disabled={isActiveExentoGananciaIVA}
                          required
                          label="Exento Ganancia"
                          feedbackType="invalid"
                          name="exentoGanancia"
                          value="Exento Ganancia"
                          onChange={handleInputChange}
                        />
                      </Form.Group>
                      <Form.Group as={Col} md="6" className="mb-3">
                        <Form.Check
                          disabled={isActiveExentoGananciaIVA}
                          required
                          label="Exento IVA"
                          feedbackType="invalid"
                          name="exentoIVA"
                          value="Exento IVA"
                          onChange={handleInputChange}
                        />
                      </Form.Group>
                    </Row>
                  </div>
                </article>
                {/* RENTAS */}
                <article className="col-12 col-lg-6">
                  <div className="mt-2">
                    <h6 className="lato-regular fs-16">
                      Modificación en condición fiscal de Rentas
                    </h6>
                    <Row>
                      <Form.Group as={Col} md="6" className="mb-3">
                        <Form.Check
                          required
                          type="radio"
                          label="Si"
                          feedbackType="invalid"
                          id="monotributista"
                          name="condicionRentas"
                          onClick={condicionRentasAfirmativa}
                        />
                      </Form.Group>
                      <Form.Group as={Col} md="6" className="mb-3">
                        <Form.Check
                          required
                          type="radio"
                          label="No"
                          name="condicionRentas"
                          id="inscripto"
                          feedbackType="invalid"
                          defaultChecked
                          onClick={condicionRentasNegativa}
                        />
                      </Form.Group>
                    </Row>

                    <Row>
                      <Form.Group as={Col} md="6" className="mb-3">
                        <Form.Check
                          disabled={isActiveOptionCondicionFiscalRentas}
                          required
                          label="Inscripto"
                          feedbackType="invalid"
                          name="inscripto"
                          value="Inscripto"
                          onChange={handleInputChange}
                        />
                      </Form.Group>
                      <Form.Group as={Col} md="6" className="mb-3">
                        <Form.Check
                          disabled={isActiveOptionCondicionFiscalRentas}
                          required
                          label="Conv. multilateral"
                          feedbackType="invalid"
                          name="convenioMultilateral"
                          value="Convenio multilateral"
                          onChange={handleInputChange}
                        />
                      </Form.Group>
                    </Row>
                    <Row>
                      <Form.Group as={Col} md="12" className="mb-3">
                        <Form.Check
                          disabled={isActiveOptionCondicionFiscalRentas}
                          required
                          label="Exento"
                          feedbackType="invalid"
                          name="exentoRespInscripto"
                          value="Exento"
                          onChange={handleInputChange}
                        />
                      </Form.Group>
                    </Row>
                  </div>
                </article>
              </Row>
              <section className="my-2">
                <h6 className="lato-regular fs-16">Verificación</h6>
                <Row>
                  <Form.Group as={Col} md="12" className="mb-1">
                    <Form.Check
                      required
                      label="Validación de cierre de lote"
                      feedbackType="invalid"
                      name="validacionCierreLote"
                      value="Validación de cierre de lote"
                      onChange={handleInputChange}
                    />
                  </Form.Group>
                  <Form.Group as={Col} md="12" className="mb-1">
                    <Form.Check
                      required
                      label="Funcionamiento de equipo Pos"
                      feedbackType="invalid"
                      name="funcionamientoEquipoPos"
                      value="Funcionamiento de equipo Pos"
                      onChange={handleInputChange}
                    />
                  </Form.Group>
                </Row>
                <Row>
                  <Form.Group as={Col} md="12" className="mb-1">
                    <Form.Check
                      required
                      label="Inicializa terminal"
                      feedbackType="invalid"
                      name="inicializaTerminal"
                      value="Inicializa terminal"
                      onChange={handleInputChange}
                    />
                  </Form.Group>
                </Row>
                <Row>
                  <Form.Group as={Col} md="12" className="mb-1">
                    <Form.Check
                      required
                      label="Presenta cargador en condiciones"
                      feedbackType="invalid"
                      name="presentaCargadorCondiciones"
                      value="Presenta cargador en condiciones"
                      onChange={handleInputChange}
                    />
                  </Form.Group>
                </Row>

                <Row className="my-2">
                  <Form.Label className="lato-regular fs-16-a-14">
                    Observaciones
                  </Form.Label>
                  <Form.Control
                    className="input-comentario-form-bajas"
                    as="textarea"
                    name="comentarioObservaciones"
                    onChange={handleInputChange}
                  />
                </Row>
              </section>
              <Row className="my-3">
                <div>
                  <h6> Agregar imagenes</h6>
                </div>
                <Form.Group as={Col} md="12" >
                <Form.Control
                  type="file"
                  multiple
                  onChange={(event) =>
                    handleFileChange(event, "imagenesAdjunto")
                  }
                />
                </Form.Group>
              </Row>
              <div className="d-flex justify-content-center ">
                <Button
                  className="btn-guardar-formulario-alta my-5"
                  type="submit"
                >
                  Guardar
                </Button>
              </div>
            </Form>
          </section>
        </Modal.Body>
      </Modal>
    </div>
  );
};

export default MiModalCargarVisita;
