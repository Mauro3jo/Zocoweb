import { faXmark } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import React, { useContext, useRef, useState } from "react";
import { Button, Col, Modal, Row, Form } from "react-bootstrap";
import { DarkModeContext } from "../../context/DarkModeContext";
import formatDate from "../../helpers/formatDate";
import { useForm } from "react-hook-form";

const ModalDetalleTablaBaja = ({ show, onHide, item }) => {
  const {
    numeroTerminal,
    fechaApertura,
    idGestor,
    nombreComercio,
    observacion,
    registraOperacionesPendientes,
    registraOperacionesConTarjetaNaranja,
    adjuntaCierreLote,
    id,
  } = item;
  const fechaNacimientoFormateada = formatDate(fechaApertura);

  const [validated, setValidated] = useState(false);
  const { control } = useForm();

  // Estado para almacenar datos del formulario
  const [formData, setFormData] = useState({
    TerminalN: "",
  });
  // mapear las opciones de los comercio
  const optionsComercio = [
    { value: "Comercio 1", label: "Comercio 1" },
    { value: "Comercio 2", label: "Comercio 2" },
    { value: "Comercio 3", label: "Comercio 3" },
    { value: "Comercio 4", label: "Comercio 4" },
    { value: "Comercio 5", label: "Comercio 5" },
    { value: "Comercio 6", label: "Comercio 6" },
  ];

  // Función para actualizar los datos del formulario

  const handleDownload = async () => {
    const token = sessionStorage.getItem("token");
    if (!token) {
      alert("Token no encontrado");
      return;
    }

    try {
      const response = await fetch("/api/formulario/descargarformulariobaja", {
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
          bajaFirmada: data.bajaFirmada,
          cuponInicializacionTerminal: data.cuponInicializacionTerminal,
          cierreLote: data.cierreLote,
          fotoTerminal: data.fotoTerminal,
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
            <Form.Group as={Col} md="8" sm="12">
              <Form.Label className="fs-14">N° de terminal</Form.Label>
              <Form.Control
                disabled
                defaultValue={numeroTerminal ? numeroTerminal : "-------------"}
                className="input-formulario-disabled fs-14 lato-bold"
              />
            </Form.Group>
            <Form.Group as={Col} md="4" sm="12">
              <Form.Label className="fs-14">Fecha de Apertura</Form.Label>
              <Form.Control
                disabled
                defaultValue={
                  fechaNacimientoFormateada
                    ? fechaNacimientoFormateada
                    : "-------------"
                }
                className="input-formulario-disabled fs-14 lato-bold"
              />
            </Form.Group>
          </Row>
          <Row className="mb-1">
          
            <Form.Group as={Col} md="12" controlId="validationCustom01">
              <Form.Label className="fs-14">Nombre del establecimiento</Form.Label>
              <Form.Control
                disabled
                defaultValue={nombreComercio ? nombreComercio : "-------------"}
                className="input-formulario-disabled fs-14 lato-bold"
              />
            </Form.Group>
          </Row>
          <Row className="mb-1">
            <Form.Group as={Col} md="12" sm="12">
              <Form.Label className="fs-14">Observación</Form.Label>
              <Form.Control
                disabled
                defaultValue={observacion ? observacion : "-------------"}
                className="input-formulario-disabled fs-14 lato-bold"
              />
            </Form.Group>
          </Row>
          <Row className="mb-1">
            <Form.Group as={Col} md="12" sm="12">
              <Form.Label className="fs-14">
                Registra Operaciones Pendientes
              </Form.Label>
              <Form.Control
                disabled
                defaultValue={
                  registraOperacionesPendientes
                    ? "Si, registra operaciones pendientes."
                    : "No registra operaciones pendientes."
                }
                className="input-formulario-disabled fs-14 lato-bold"
              />
            </Form.Group>
          </Row>
          <Row className="mb-1">
            <Form.Group as={Col} md="12" sm="12">
              <Form.Label className="fs-14">
                Registra operaciones con tarjeta Naranja
              </Form.Label>
              <Form.Control
                disabled
                defaultValue={
                  registraOperacionesConTarjetaNaranja
                    ? "Si, registra operaciones con tarjeta Naranja."
                    : "No registra operaciones con tarjeta Naranja."
                }
                className="input-formulario-disabled fs-14 lato-bold"
              />
            </Form.Group>
          </Row>
          <Row className="mb-1">
            <Form.Group as={Col} md="12" sm="12">
              <Form.Label className="fs-14">Adjunta cierre de Lote</Form.Label>
              <Form.Control
                disabled
                defaultValue={
                  adjuntaCierreLote
                    ? "Si, adjunta cierre de Lote."
                    : "No adjunta cierre de Lote."
                }
                className="input-formulario-disabled fs-14 lato-bold"
              />
            </Form.Group>
          </Row>
          <div>
            <h6 className="mt-3 fs-14"> Datos Comercio - descargas archivos</h6>
          </div>
          <article className="pt-2">
            <button
              className="btn-altas lato-bold centrado border-0 fs-14"
              onClick={handleDownload}
            >
              Descargar
            </button>
          </article>
        </div>
      </Modal.Body>
    </Modal>
  );
};

export default ModalDetalleTablaBaja;
