import { faXmark } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import React, { useContext, useRef, useState } from "react";
import { Col, Modal, Row, Form } from "react-bootstrap";
import { DarkModeContext } from "../../context/DarkModeContext";
import { useForm } from "react-hook-form";

const ModalDetalleTablaModificacion = ({ show, onHide, item }) => {
  const {
    nombreGestor,
    nombreComercio,
    bajaServicioTecnico,
    numeroTerminalBaja,
    observacion,
    registraOperacionesPendientes,
    registraOperacionesConTarjetaNaranja,
    adjuntaCierreLote,
    numeroTerminalAltaL,
    nombreFantasia,
    numeroComercio,
    domicilio,
    provincia,
    ciudad,
    codigoPostal,
    banco,
    tipoCuenta,
    cbucvu,
    alias,
    cuitbancario,
    email,
   // Condicion fiscal
   afipMonotributista,
   afipResponsableInscripto,
   afipExentoIva,
   afipExentoGanancia,
   rentasConvenioMultilateral,
   rentasExento,
      rentasIncripto,
   id
  } = item;
  // const fechaNacimientoFormateada = formatDate(fechaApertura);

  const [validated, setValidated] = useState(false);

  // Estado para almacenar datos del formulario
  const [formData, setFormData] = useState({});
  // mapear las opciones de los comercio
  const optionsComercio = [
    { value: "Comercio 1", label: "Comercio 1" },
    { value: "Comercio 2", label: "Comercio 2" },
    { value: "Comercio 3", label: "Comercio 3" },
    { value: "Comercio 4", label: "Comercio 4" },
    { value: "Comercio 5", label: "Comercio 5" },
    { value: "Comercio 6", label: "Comercio 6" },
  ];

    const handleDownload = async () => {
        const token = sessionStorage.getItem("token"); // Obtener el token del sessionStorage
        if (!token) {
            alert("Token no encontrado");
            return;
        }

        try {
            const response = await fetch("/api/formulario/descargarformulariomodificar", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify({
                    id: id, // Enviar el ID del formulario
                    token: token, // Enviar el token
                }),
            });

            if (response.ok) {
                const data = await response.json();
                const files = {
                    "altaFirmada": data.altaFirmada,
                    "cuponInicializacionTerminal1": data.cuponInicializacionTerminal1,
                    "constanciaCbucvu": data.constanciaCbucvu,
                    "contanciaCbuCvu": data.contanciaCbuCvu,
                    "dni": data.dni,
                    "cuponInicializacionTerminal2": data.cuponInicializacionTerminal2,
                    "constanciaRentas": data.constanciaRentas
                };

                Object.entries(files).forEach(([name, base64]) => {
                    if (base64) {
                        const link = document.createElement("a");
                        link.href = `data:application/octet-stream;base64,${base64}`;
                        link.download = `${name}.jpg`;
                        link.click();
                    }
                });
            } else {
                console.error("Error al descargar el formulario");
            }
        } catch (error) {
            console.error("Error al realizar la solicitud:", error);
        }
    };


  const { darkMode } = useContext(DarkModeContext);
  return (
    <Modal
      show={show}
      onHide={onHide}
      centered
      size="xl"
      fullscreen={true}
      style={{
        backgroundColor: "#E5E8EE ",
        opacity: "1",
      }}
    >
      <Modal.Body className={darkMode ? " modal-fondo " : "modal-fondo "}>
        <section className="d-flex justify-content-between my-4 container">
          <div className="ocultar-div"></div>
          <div className="d-flex justify-content-center">
            <h6 className="fs-18 lato-bold">Detalles</h6>
          </div>
          <div>
            <button className="border-0 btn-filtro-cruz" onClick={onHide}>
              <FontAwesomeIcon className="fs-18 " icon={faXmark} />
            </button>
          </div>
        </section>
        <div className="container">
            <Row className="mb-1">
              <Form.Group as={Col} md="12" sm="12">
                <Form.Label className="fs-14">Nombre del establecimiento</Form.Label>
                <Form.Control
                  disabled
                  defaultValue={
                    nombreComercio ? nombreComercio : "-------------"
                  }
                  className="input-formulario-disabled fs-14 lato-bold"
                />
              </Form.Group>
            </Row>
            <Row className="mb-1">
              <Form.Group as={Col} md="6" sm="12">
                <Form.Label className="fs-14">Baja Servicio Técnico</Form.Label>
                <Form.Control
                  disabled
                  defaultValue={
                    bajaServicioTecnico === true
                      ? "Solicita baja servicio técnico"
                      : "No solicita baja servicio técnico"
                  }
                  className="input-formulario-disabled fs-14 lato-bold"
                />
              </Form.Group>
            </Row>
            <Row className="mb-1">
              <Form.Group as={Col} md="6" sm="12">
                <Form.Label className="fs-14">
                  N° de terminal a dar de baja
                </Form.Label>
                <Form.Control
                  disabled
                  defaultValue={
                    numeroTerminalBaja ? numeroTerminalBaja : "-------------"
                  }
                  className="input-formulario-disabled fs-14 lato-bold"
                />
              </Form.Group>
            </Row>
            <Row className="mb-1">
              <Form.Group as={Col} md="12" sm="12">
                <Form.Label className="fs-14">Motivo de falla</Form.Label>
                <Form.Control
                  disabled
                  defaultValue={observacion ? observacion : "-------------"}
                  className="input-formulario-disabled fs-14 lato-bold"
                />
              </Form.Group>
            </Row>
            <Row className="mb-1">
              <Form.Group as={Col} md="6" sm="12">
                <Form.Label className="fs-14">
                  Registra operaciones pendientes
                </Form.Label>
                <Form.Control
                  disabled
                  defaultValue={
                    registraOperacionesPendientes
                      ? "Si registra operaciones pendientes "
                      : "No registra operaciones pendientes "
                  }
                  className="input-formulario-disabled fs-14 lato-bold"
                />
              </Form.Group>
            </Row>
            <Row className="mb-1">
              <Form.Group as={Col} md="6" sm="12">
                <Form.Label className="fs-14">
                  Registra operaciones con Tarjeta Naranja
                </Form.Label>
                <Form.Control
                  disabled
                  defaultValue={
                    registraOperacionesConTarjetaNaranja
                      ? "Si registra operaciones con tarjeta Naranja. "
                      : "No registra operaciones con tarjeta Naranja. "
                  }
                  className="input-formulario-disabled fs-14 lato-bold"
                />
              </Form.Group>
            </Row>
            <Row className="mb-1">
              <Form.Group as={Col} md="6" sm="12">
                <Form.Label className="fs-14">
                  Adjunta cierre de Lote
                </Form.Label>
                <Form.Control
                  disabled
                  defaultValue={
                    adjuntaCierreLote
                      ? "Si adjunta cierre de lote. "
                      : "No adjunta cierre de lote. "
                  }
                  className="input-formulario-disabled fs-14 lato-bold"
                />
              </Form.Group>
            </Row>
            <Row className="mb-1">
              <Form.Group as={Col} md="6" sm="12">
                <Form.Label className="fs-14">N° terminal (alta)</Form.Label>
                <Form.Control
                  disabled
                  defaultValue={
                    numeroTerminalAltaL ? numeroTerminalAltaL : "-------------"
                  }
                  className="input-formulario-disabled fs-14 lato-bold"
                />
              </Form.Group>
              <Form.Group as={Col} md="6" sm="12">
                <Form.Label className="fs-14">Tipo de modificación</Form.Label>
                <Form.Control
                  disabled
                  defaultValue={
                    nombreComercio ? nombreComercio : "-------------"
                  }
                  className="input-formulario-disabled fs-14 lato-bold"
                />
              </Form.Group>
            </Row>
            <Row className="mb-1">
              <Form.Group as={Col} md="6" sm="12">
                <Form.Label className="fs-14">Nombre de fantasía</Form.Label>
                <Form.Control
                  disabled
                  defaultValue={
                    nombreFantasia ? nombreFantasia : "-------------"
                  }
                  className="input-formulario-disabled fs-14 lato-bold"
                />
              </Form.Group>
              <Form.Group as={Col} md="6" sm="12">
                <Form.Label className="fs-14">Número de comercio</Form.Label>
                <Form.Control
                  disabled
                  defaultValue={
                    numeroComercio ? numeroComercio : "-------------"
                  }
                  className="input-formulario-disabled fs-14 lato-bold"
                />
              </Form.Group>
            </Row>
            <Row className="mb-1">
              <Form.Group as={Col} md="12" sm="12">
                <Form.Label className="fs-14">Domicilio</Form.Label>
                <Form.Control
                  disabled
                  defaultValue={domicilio ? domicilio : "-------------"}
                  className="input-formulario-disabled fs-14 lato-bold"
                />
              </Form.Group>
            </Row>
            <Form.Group as={Col} sm="12">
              <Form.Label className="fs-14">Provincia</Form.Label>
              <Form.Control
                disabled
                defaultValue={provincia ? provincia : "-------------"}
                className="input-formulario-disabled fs-14 lato-bold"
              />
            </Form.Group>
            <Form.Group as={Col} sm="12">
              <Form.Label className="fs-14">Ciudad</Form.Label>
              <Form.Control
                disabled
                defaultValue={ciudad ? ciudad : "-------------"}
                className="input-formulario-disabled fs-14 lato-bold"
              />
            </Form.Group>
            <Form.Group as={Col} sm="12">
              <Form.Label className="fs-14">Código postal</Form.Label>
              <Form.Control
                disabled
                defaultValue={codigoPostal ? codigoPostal : "-------------"}
                className="input-formulario-disabled fs-14 lato-bold"
              />
            </Form.Group>
            <div>
              <h6 className="mt-2"> Datos bancario</h6>
            </div>
            <Row className="mb-1">
              <Form.Group as={Col} md="12" sm="12">
                <Form.Label className="fs-14">Banco</Form.Label>
                <Form.Control
                  disabled
                  defaultValue={banco ? banco : "-------------"}
                  className="input-formulario-disabled fs-14 lato-bold"
                />
              </Form.Group>
            </Row>
            <Row className="mb-1">
              <Form.Group as={Col} md="12" sm="12">
                <Form.Label className="fs-14">Tipo de cuenta</Form.Label>
                <Form.Control
                  disabled
                  defaultValue={tipoCuenta ? tipoCuenta : "-------------"}
                  className="input-formulario-disabled fs-14 lato-bold"
                />
              </Form.Group>
            </Row>
            <Row className="mb-1">
              <Form.Group as={Col} md="6" sm="12">
                <Form.Label className="fs-14">CBU/CVU</Form.Label>
                <Form.Control
                  disabled
                  defaultValue={cbucvu ? cbucvu : "-------------"}
                  className="input-formulario-disabled fs-14 lato-bold"
                />
              </Form.Group>
              <Form.Group as={Col} md="6" sm="12">
                <Form.Label className="fs-14">Alias</Form.Label>
                <Form.Control
                  disabled
                  defaultValue={alias ? alias : "-------------"}
                  className="input-formulario-disabled fs-14 lato-bold"
                />
              </Form.Group>
            </Row>
            <Row className="mb-1">
              <Form.Group as={Col} md="6" sm="12">
                <Form.Label className="fs-14">CUIT</Form.Label>
                <Form.Control
                  disabled
                  defaultValue={ cuitbancario ?  cuitbancario : "-------------"}
                  className="input-formulario-disabled fs-14 lato-bold"
                />
              </Form.Group>
              <Form.Group as={Col} md="6" sm="12">
                <Form.Label className="fs-14">E-mail</Form.Label>
                <Form.Control
                  disabled
                  defaultValue={email ? email : "-------------"}
                  className="input-formulario-disabled fs-14 lato-bold"
                />
              </Form.Group>
            </Row>
            <Row className="mb-3">
              <h6 className="mt-2"> Condición fiscal</h6>
              <div className="row">
                <section className="col-lg-6 col-12">
                  <h6 className="mt-2 fs-16">AFIP</h6>
                  <article className="d-flex">
                    <div className=" me-4">
                      <label className=" lato-bold fs-14">Monotributista</label>
                      <input
                        className="input-formulario-disabled lato-bold fs-14"
                        disabled
                        defaultValue={
                          afipMonotributista
                            ? afipMonotributista === true
                              ? " Si"
                              : " No"
                            : "-------------"
                        }
                      />
                    </div>
                    <div className="">
                      <label className=" lato-bold fs-14">
                        Resp. Inscripto
                      </label>
                      <input
                        className="input-formulario-disabled lato-bold fs-14"
                        disabled
                        defaultValue={
                          afipResponsableInscripto
                            ? afipResponsableInscripto === true
                              ? " Si"
                              : " No"
                            : "-------------"
                        }
                      />
                    </div>
                  </article>
                  <article className="d-flex">
                    <div className=" me-4">
                      <label
                        className=" lato-bold fs-14"
                        htmlFor="AfipExentoGanancia"
                      >
                        Exento Ganancia
                      </label>
                      <input
                        className="input-formulario-disabled lato-bold fs-14"
                        disabled
                        defaultValue={
                          afipExentoGanancia
                            ? afipExentoGanancia === true
                              ? " Si"
                              : " No"
                            : "-------------"
                        }
                      />
                    </div>
                    <div className="">
                      <label className=" lato-bold fs-14">Exento IVA</label>
                      <input
                        className="input-formulario-disabled lato-bold fs-14"
                        disabled
                        defaultValue={
                          afipExentoIva
                            ? afipExentoIva === true
                              ? " Si"
                              : " No"
                            : "-------------"
                        }
                      />
                    </div>
                  </article>
                </section>
                <section className="col-lg-6 col-12 ">
                  <h6 className="mt-2 fs-16">RENTAS</h6>
                  <article className="d-flex">
                    <div className=" me-4">
                      <label
                        className="form-check-label lato-bold fs-14"
                        htmlFor="RentasIncripto"
                      >
                        Inscripto
                      </label>
                      <input
                        className="input-formulario-disabled lato-bold fs-14"
                        disabled
                        defaultValue={
                          rentasIncripto
                            ? rentasIncripto === true
                              ? " Si"
                              : " No"
                            : "-------------"
                        }
                      />
                    </div>
                    <div className="">
                      <label
                        className="form-check-label lato-bold fs-14"
                        htmlFor="RentasConvenioMultilateral"
                      >
                        Convenio Multilateral
                      </label>
                      <input
                        className="input-formulario-disabled lato-bold fs-14"
                        disabled
                        defaultValue={
                          rentasConvenioMultilateral
                            ? rentasConvenioMultilateral === true
                              ? " Si"
                              : " No"
                            : "-------------"
                        }
                      />
                    </div>
                  </article>
                  <div className="">
                    <label
                      className="form-check-label lato-bold fs-14"
                      htmlFor="RentasExento"
                    >
                      Exento
                    </label>
                    <input
                      className="input-formulario-disabled lato-bold fs-14"
                      disabled
                      defaultValue={
                        rentasExento
                          ? rentasExento === true
                            ? " Si"
                            : " No"
                          : "-------------"
                      }
                    />
                  </div>
                </section>
              </div>
            </Row>
            <div>
              <h6 className="mt-3 fs-14">
                {" "}
                Datos Comercio - descargas archivos
              </h6>
            </div>
            <article className="pt-2">
                      <button className="btn-altas lato-bold centrado border-0 fs-14" onClick={handleDownload}>
                          Descargar
                      </button>
            </article>
        
        </div>
      </Modal.Body>
    </Modal>
  );
};

export default ModalDetalleTablaModificacion;
