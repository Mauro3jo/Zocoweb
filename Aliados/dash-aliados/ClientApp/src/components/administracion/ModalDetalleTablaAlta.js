import { faXmark } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import React, { useContext } from "react";
import { Button, Col, Modal, Row, Form } from "react-bootstrap";
import { DarkModeContext } from "../../context/DarkModeContext";
import formatDate from "../../helpers/formatDate";

const ModalDetalleTablaAlta = ({ show, onHide, item }) => {
  const {
    id,
    numeroTerminal,
    tipoPersona,
    // Datos del aliado
    calle,
    numeroCalle,
    localidadTitular,
    provincia,
    pais,
    codigoPostalTitular,
    nacionalidad,
    fechaNacimiento,
    celular,
    telFijo,
    correo,
    // Datos del comercio
    nombreFantasia,
    domicilio,
    localidadComercio,
    codigoPostalComercio,
    // Condicion fiscal
    afipMonotributista,
    afipResponsableInscripto,
    afipExentoIva,
    afipExentoGanancia,
    rentasConvenioMultilateral,
    rentasExento,
    rentasIncripto,
    // Datos bancarios
    banco,
    tipoCuenta,
    cbucvu,
    alias,
    cuitbancario,
    titularRazonSocial,
    // numero de comercio
    numeroComericoActual,
    numeroComercioSolicitado,
    // tipo de alta
    tipoAlta,
    nuevoPanel,
    // tipo de imagenes
    // tipo de persona juridica
    apellidoYnombre,
    cuittitular,
    actividadLaboralProfesional,
    apoderado,
    // datos que no se utilizan
    fechaApertura,
    idGestor,
    nombreGestor,
  } = item;

  const fechaNacimientoFormateada = formatDate(fechaNacimiento);

  const { darkMode } = useContext(DarkModeContext);

  const handleDownload = async () => {
    const token = sessionStorage.getItem("token"); // Obtener el token del sessionStorage
    if (!token) {
      alert("Token no encontrado");
      return;
    }

    try {
      const response = await fetch("/api/formulario/descargarformularioalta", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          id: id,
          token: token,
        }),
      });

      if (response.ok) {
        const data = await response.json();
        const files = {
          AltaFirmada: data.altaFirmada,
          CuponInicializacionTerminal: data.cuponInicializacionTerminal,
          ConstanciaAfip: data.constanciaAfip,
          ContanciaCbuCvu: data.contanciaCbuCvu,
          Dnifrente: data.dnifrente,
          CopiaContratoSocialOactoConstitutivo:
            data.copiaContratoSocialOactoConstitutivo,
          FichaAutorizacion: data.fichaAutorizacion,
          CierredeLote: data.cierredeLote,
          ConstanciaRentas: data.constanciaRentas,
          Dnidorso: data.dnidorso,
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
          <Row className="mb-3">
            <Form.Group as={Col} md="8" sm="12">
              <Form.Label className="fs-14">N° de terminal</Form.Label>
              <Form.Control
                disabled
                defaultValue={numeroTerminal ? numeroTerminal : "-------------"}
                className="input-formulario-disabled fs-14 lato-bold"
              />
            </Form.Group>
            <Form.Group as={Col} md="4" sm="12">
              <Form.Label className="fs-14">Tipo de Persona</Form.Label>
              <Form.Control
                defaultValue={tipoPersona ? tipoPersona : "-------------"}
                className="input-formulario-disabled fs-14 lato-bold"
                disabled
              />
            </Form.Group>
          </Row>
          {/* DATOS ALIADO */}
          {tipoPersona === "fisica" || tipoPersona === "Fisica" ? (
            <>
              <Row className="mb-1">
                <div className="mt-1">
                  <h6> Datos del aliado</h6>
                </div>
                <Form.Group as={Col} md="7" sm="12">
                  <Form.Label className="mt-2 fs-14">
                    Apellido y nombre
                  </Form.Label>
                  <Form.Control
                    className="input-formulario-disabled lato-bold fs-14"
                    disabled
                    defaultValue={
                      apellidoYnombre ? apellidoYnombre : "-------------"
                    }
                  />
                </Form.Group>
                <Form.Group as={Col} md="5" sm="12">
                  <Form.Label className="mt-2 fs-14">DNI/CUIT</Form.Label>
                  <Form.Control
                    className="input-formulario-disabled lato-bold fs-14"
                    disabled
                    defaultValue={cuittitular ? cuittitular : "-------------"}
                  />
                </Form.Group>
              </Row>
              <Row className="mb-1">
                <Form.Group as={Col} md="12" sm="12">
                  <Form.Label className="mt-2 fs-14">
                    Actividad laboral o profesional
                  </Form.Label>
                  <Form.Control
                    className="input-formulario-disabled lato-bold fs-14"
                    disabled
                    defaultValue={
                      actividadLaboralProfesional
                        ? actividadLaboralProfesional
                        : "-------------"
                    }
                  />
                </Form.Group>
              
                <Form.Group as={Col} md="6" sm="12">
                  <Form.Label className="mt-2 fs-14">Calle</Form.Label>
                  <Form.Control
                    className="input-formulario-disabled lato-bold fs-14"
                    disabled
                    defaultValue={calle ? calle : "-------------"}
                  />
                </Form.Group>
                <Form.Group as={Col} md="2" sm="12">
                  <Form.Label className="mt-2 fs-14">N°</Form.Label>
                  <Form.Control
                    className="input-formulario-disabled lato-bold fs-14"
                    disabled
                    defaultValue={numeroCalle ? numeroCalle : "-------------"}
                  />
                </Form.Group>
                <Form.Group as={Col} md="4" sm="12">
                  <Form.Label className="mt-2 fs-14">Localidad</Form.Label>
                  <Form.Control
                    className="input-formulario-disabled lato-bold fs-14"
                    disabled
                    defaultValue={
                      localidadTitular ? localidadTitular : "-------------"
                    }
                  />
                </Form.Group>
              </Row>
              <Row className="mb-1">
                <Form.Group as={Col} md="5" sm="12">
                  <Form.Label className="mt-2 fs-14">Provincia</Form.Label>
                  <Form.Control
                    className="input-formulario-disabled lato-bold fs-14"
                    disabled
                    defaultValue={provincia ? provincia : "-------------"}
                  />
                </Form.Group>
                <Form.Group as={Col} md="4" sm="12">
                  <Form.Label className="mt-2 fs-14">País</Form.Label>
                  <Form.Control
                    className="input-formulario-disabled lato-bold fs-14"
                    disabled
                    defaultValue={pais ? pais : "-------------"}
                  />
                </Form.Group>
                <Form.Group as={Col} md="3" sm="12">
                  <Form.Label className="mt-2 fs-14">Código postal</Form.Label>
                  <Form.Control
                    className="input-formulario-disabled lato-bold fs-14"
                    disabled
                    defaultValue={
                      codigoPostalTitular
                        ? codigoPostalTitular
                        : "-------------"
                    }
                  />
                </Form.Group>
              </Row>
              <Row className="mb-3">
                <Form.Group as={Col} md="8" sm="12">
                  <Form.Label className="mt-2 fs-14">Nacionalidad</Form.Label>
                  <Form.Control
                    className="input-formulario-disabled lato-bold fs-14"
                    disabled
                    defaultValue={nacionalidad ? nacionalidad : "-------------"}
                  />
                </Form.Group>
                <Form.Group as={Col} md="4" sm="12">
                  <Form.Label className="mt-2 fs-14">
                    Fecha de nacimiento
                  </Form.Label>
                  <Form.Control
                    className="input-formulario-disabled lato-bold fs-14"
                    disabled
                    defaultValue={
                      fechaNacimientoFormateada
                        ? fechaNacimientoFormateada
                        : "-------------"
                    }
                  />
                </Form.Group>
              </Row>
              <Row className="mb-1">
                <div>
                  <h6 className="color-label lato-bold ">
                    {" "}
                    Número de teléfono:
                  </h6>
                </div>
                <Form.Group as={Col} md="6" sm="12">
                  <Form.Label className="fs-14 mt-2s">Celular</Form.Label>
                  <Form.Control
                    className="input-formulario-disabled lato-bold fs-14"
                    disabled
                    defaultValue={celular ? celular : "-------------"}
                  />
                </Form.Group>
                <Form.Group as={Col} md="6" sm="12">
                  <Form.Label className="fs-14 mt-2">Tel. fijo</Form.Label>
                  <Form.Control
                    className="input-formulario-disabled lato-bold fs-14"
                    disabled
                    defaultValue={telFijo ? telFijo : "-------------"}
                  />
                </Form.Group>
              </Row>
              <Row className="mb-3">
                <Form.Group as={Col} md="12" sm="12">
                  <Form.Label className="fs-14">Correo electrónico</Form.Label>
                  <Form.Control
                    className="input-formulario-disabled lato-bold fs-14"
                    disabled
                    defaultValue={correo ? correo : "-------------"}
                  />
                </Form.Group>
              </Row>
            </>
          ) : (
            // tipo persona juridica datos aliados
            <>
              <Row className="mb-1">
                <div className="mt-1">
                  <h6> Datos del aliado</h6>
                </div>
                <Form.Group as={Col} md="7" sm="12">
                  <Form.Label className="mt-2 fs-14">
                  Denominación o razón social
                  </Form.Label>
                  <Form.Control
                    className="input-formulario-disabled lato-bold fs-14"
                    disabled
                    defaultValue={
                      apellidoYnombre ? apellidoYnombre : "-------------"
                    }
                  />
                </Form.Group>
                <Form.Group as={Col} md="5" sm="12">
                  <Form.Label className="mt-2 fs-14">-CUIT, CDI, o la clave de identificación que en el futuro sea creada por la AFIP</Form.Label>
                  <Form.Control
                    className="input-formulario-disabled lato-bold fs-14"
                    disabled
                    defaultValue={cuittitular ? cuittitular : "-------------"}
                  />
                </Form.Group>
              </Row>
              <Row className="mb-1">
                <Form.Group as={Col} md="12" sm="12">
                  <Form.Label className="mt-2 fs-14">
                    Actividad laboral o profesional
                  </Form.Label>
                  <Form.Control
                    className="input-formulario-disabled lato-bold fs-14"
                    disabled
                    defaultValue={
                      actividadLaboralProfesional
                        ? actividadLaboralProfesional
                        : "-------------"
                    }
                  />
                </Form.Group>
              </Row>
              <Row className="mb-1">
                <Form.Group as={Col} md="6" sm="12">
                  <Form.Label className="mt-2 fs-14">Domicilio de calle</Form.Label>
                  <Form.Control
                    className="input-formulario-disabled lato-bold fs-14"
                    disabled
                    defaultValue={calle ? calle : "-------------"}
                  />
                </Form.Group>
                <Form.Group as={Col} md="2" sm="12">
                  <Form.Label className="mt-2 fs-14">N°</Form.Label>
                  <Form.Control
                    className="input-formulario-disabled lato-bold fs-14"
                    disabled
                    defaultValue={numeroCalle ? numeroCalle : "-------------"}
                  />
                </Form.Group>
                <Form.Group as={Col} md="4" sm="12">
                  <Form.Label className="mt-2 fs-14">Localidad</Form.Label>
                  <Form.Control
                    className="input-formulario-disabled lato-bold fs-14"
                    disabled
                    defaultValue={
                      localidadTitular ? localidadTitular : "-------------"
                    }
                  />
                </Form.Group>
              </Row>
              <Row className="mb-1">
                <Form.Group as={Col} md="7" sm="12">
                  <Form.Label className="mt-2 fs-14">Provincia</Form.Label>
                  <Form.Control
                    className="input-formulario-disabled lato-bold fs-14"
                    disabled
                    defaultValue={provincia ? provincia : "-------------"}
                  />
                </Form.Group>
                <Form.Group as={Col} md="5" sm="12">
                  <Form.Label className="mt-2 fs-14">Código postal</Form.Label>
                  <Form.Control
                    className="input-formulario-disabled lato-bold fs-14"
                    disabled
                    defaultValue={
                      codigoPostalTitular
                        ? codigoPostalTitular
                        : "-------------"
                    }
                  />
                </Form.Group>
              </Row>
              <Row className="mb-3">
                <Form.Group as={Col} md="6" sm="12">
                  <Form.Label className="mt-2 fs-14">
                    Número de teléfono de la sede
                  </Form.Label>
                  <Form.Control
                    className="input-formulario-disabled lato-bold fs-14"
                    disabled
                    defaultValue={telFijo ? telFijo : "-------------"}
                  />
                </Form.Group>
                <Form.Group as={Col} md="6" sm="12">
                  <Form.Label className="mt-2 fs-14">
                    Correo electrónico{" "}
                  </Form.Label>
                  <Form.Control
                    className="input-formulario-disabled lato-bold fs-14"
                    disabled
                    defaultValue={correo ? correo : "-------------"}
                  />
                </Form.Group>
              </Row>
              <Row className="mb-3">
                <Form.Group as={Col} md="12" sm="12">
                  <Form.Label className="mt-2 fs-14">
                    Identificación del apoderado, adicional, representante y
                    autorizado:
                  </Form.Label>
                  <Form.Control
                    className="input-formulario-disabled lato-bold fs-14"
                    disabled
                    defaultValue={apoderado ? apoderado : "-------------"}
                  />
                </Form.Group>
              </Row>
            </>
          )}

          {/* DATOS DEL COMERCIO */}
          <Row className="mb-1">
            <div>
              <h6 className="mt-2 lato-bold "> Datos del comercio</h6>
            </div>
            <Form.Group as={Col} md="12" sm="12">
              <Form.Label className="fs-14 mt-2">Nombre de fantasía</Form.Label>
              <Form.Control
                className="input-formulario-disabled lato-bold fs-14"
                disabled
                defaultValue={nombreFantasia ? nombreFantasia : "-------------"}
              />
            </Form.Group>
          </Row>
          <Row className="mb-3">
            <Form.Group as={Col} md="6" sm="12">
              <Form.Label className="fs-14 mt-2">Domicilio</Form.Label>
              <Form.Control
                className="input-formulario-disabled lato-bold fs-14"
                disabled
                defaultValue={domicilio ? domicilio : "-------------"}
              />
            </Form.Group>
            <Form.Group as={Col} md="3" sm="12">
              <Form.Label className="pt-2 fs-14">Localidad</Form.Label>
              <Form.Control
                className="input-formulario-disabled lato-bold fs-14"
                disabled
                defaultValue={
                  localidadComercio ? localidadComercio : "-------------"
                }
              />
            </Form.Group>
            <Form.Group as={Col} md="3" sm="12">
              <Form.Label className="pt-2 fs-14">Cód. postal</Form.Label>
              <Form.Control
                className="input-formulario-disabled lato-bold fs-14"
                disabled
                defaultValue={
                  codigoPostalComercio ? codigoPostalComercio : "-------------"
                }
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
                    <label className=" lato-bold fs-14">Resp. Inscripto</label>
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
          {/* DATOS BANCARIOS  */}
          <Row>
            <div>
              <h6 className="mt-2"> Datos bancario</h6>
            </div>
            <section className="col-lg-6 col-12">
              <article>
                <label htmlFor="Banco" className="lato-bold fs-14 ms-1 pb-2 ">
                  Bancos
                </label>
                <input
                  className="input-formulario-disabled lato-bold fs-14"
                  disabled
                  defaultValue={banco ? banco : "-------------"}
                />
              </article>
            </section>
            <section className="col-lg-6 col-12">
              <section>
                <div>
                  <h6 className="mt-2 fs-14">Tipo de cuenta:</h6>
                </div>
                <article className="d-flex ">
                  <div className="me-4">
                    <input
                      className="input-formulario-disabled lato-bold fs-14"
                      disabled
                      defaultValue={tipoCuenta ? tipoCuenta : "-------------"}
                    />
                  </div>
                </article>
              </section>
            </section>
          </Row>
          <Row className="mb-3">
            <Form.Group as={Col} md="6" sm="12">
              <Form.Label className="fs-14 mt-2">CBU / CVU</Form.Label>
              <Form.Control
                className="input-formulario-disabled lato-bold fs-14"
                disabled
                defaultValue={cbucvu ? cbucvu : "-------------"}
              />
            </Form.Group>
            <Form.Group as={Col} md="6" sm="12">
              <Form.Label className="fs-14 mt-2">Alias</Form.Label>
              <Form.Control
                className="input-formulario-disabled lato-bold fs-14"
                disabled
                defaultValue={alias ? alias : "-------------"}
              />
            </Form.Group>
          </Row>
          <Row className="mb-3">
            <Form.Group as={Col} md="6" sm="12">
              <Form.Label className="fs-14 mt-2">CUIT</Form.Label>
              <Form.Control
                className="input-formulario-disabled lato-bold fs-14"
                disabled
                defaultValue={cuitbancario ? cuitbancario : "-------------"}
              />
            </Form.Group>
            <Form.Group as={Col} md="6" sm="12" controlId="validationCustom01">
              <Form.Label className="fs-14 mt-2">
                Titular o razón social
              </Form.Label>
              <Form.Control
                className="input-formulario-disabled lato-bold fs-14"
                disabled
                defaultValue={
                  titularRazonSocial ? titularRazonSocial : "-------------"
                }
              />
            </Form.Group>
          </Row>
          <Row className="mb-3">
            <Form.Group as={Col} md="6" sm="12">
              <article>
                <label className="lato-bold fs-14 ms-1">
                  Número de comercio actual de la terminal
                </label>
                <Form.Control
                  className="input-formulario-disabled lato-bold fs-14"
                  disabled
                  defaultValue={
                    numeroComericoActual
                      ? numeroComericoActual
                      : "-------------"
                  }
                />
              </article>
            </Form.Group>
            <Form.Group as={Col} md="6" sm="12">
              <article>
                <label className="lato-bold fs-14 ms-1">
                  Número de comercio solicitado
                </label>
                <Form.Control
                  className="input-formulario-disabled lato-bold fs-14"
                  disabled
                  defaultValue={
                    numeroComercioSolicitado
                      ? numeroComercioSolicitado
                      : "-------------"
                  }
                />
              </article>
            </Form.Group>
          </Row>
          <Row>
            <article className="col-lg-6 col-12">
              <div>
                <label className="fs-14 me-3">Tipo de Alta</label>
              </div>
              <div>
                <Form.Control
                  className="input-formulario-disabled lato-bold fs-14"
                  disabled
                  defaultValue={
                    tipoAlta
                      ? tipoAlta === "NuevoAliado"
                        ? "Se agrega Nuevo Aliado"
                        : "Se agrega termina nueva"
                      : "-------------"
                  }
                />
              </div>
            </article>
            <article className="col-lg-6 col-12">
              <div>
                <label className="fs-14 me-3">
                  Se requiere nuevo nombre en el panel de control.
                </label>
              </div>
              <div className=" me-3">
                <Form.Control
                  className="input-formulario-disabled lato-bold fs-14"
                  disabled
                  defaultValue={
                    nuevoPanel
                      ? nuevoPanel === true &&
                        "Se requiere nuevo nombre en el panel de control."
                      : "-------------"
                  }
                />
              </div>
            </article>
          </Row>
          <div>
            <h6 className="mt-3 fs-14"> Datos Comercio - descargas archivos</h6>
          </div>
          {tipoPersona === "fisica" ||
          tipoPersona === "Fisica" ||
          tipoPersona === "" ? (
            // PERSONA FISICA
            <>
              <article className="pt-2">
                <button
                  className="btn-altas lato-bold  centrado border-0 fs-14"
                  onClick={handleDownload}
                >
                  Descargar archivos p. fisica
                </button>
              </article>
            </>
          ) : (
            // PERSONA JURIDICA
            <>
              <article className="pt-2">
                <button
                  className="btn-altas lato-bold  centrado border-0 fs-14"
                  onClick={handleDownload}
                >
                  Descargar archivos p. juridica
                </button>
              </article>
            </>
          )}
        </div>
      </Modal.Body>
    </Modal>
  );
};

export default ModalDetalleTablaAlta;
