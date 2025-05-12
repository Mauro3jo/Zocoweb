import { faXmark } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import React, { useContext, useRef, useState } from "react";
import { Button, Col, Form, Modal, Row } from "react-bootstrap";
import Select from "react-select";
import { Controller, useForm } from "react-hook-form";
import { DarkModeContext } from "../../context/DarkModeContext";
import ReactSignatureCanvas from "react-signature-canvas";

const FormBajasNuevo = () => {
  const { control } = useForm();

  // Estado para almacenar datos del formulario
  const [formData, setFormData] = useState({
    TerminalN: "",
  });

  // Función para actualizar los datos del formulario
  const handleChange = (event) => {
    const { name, type, checked, value, files } = event.target;

    if (type === "checkbox") {
      setFormData((prevFormData) => ({
        ...prevFormData,
        [name]: checked ? value : "",
      }));
    } else if (type === "radio") {
      setFormData((prevFormData) => ({
        ...prevFormData,
        [name]: value,
      }));
    } else if (type === "file") {
      if (files.length > 0) {
        const file = files[0];
        convertToBase64(file, (base64) => {
          setFormData((prevFormData) => ({
            ...prevFormData,
            [name]: base64,
          }));
        });
      }
    } else {
      setFormData((prevFormData) => ({
        ...prevFormData,
        [name]: value,
      }));
    }
  };

  // funcion para convertir la firma digital en base64
  const convertToBase64 = (file, callback) => {
    const reader = new FileReader();
    reader.readAsDataURL(file);
    reader.onload = () => callback(reader.result);
    reader.onerror = (error) => console.error("Error: ", error);
  };

  // Referencia para la firma digital
  const sigCanvas = useRef({});

  // Función para manejar el envío del formulario
  const handleSubmit = async (event) => {
    event.preventDefault();
    const form = event.currentTarget;

    // Capturar la firma en base64
    const firmaDigital = sigCanvas.current
      .getTrimmedCanvas()
      .toDataURL("image/png");

    // Actualizar el estado con la firma digital
    setFormData((prevFormData) => ({
      ...prevFormData,
    }));

    // Obtener el token del sessionStorage
    const token = sessionStorage.getItem("token");

    // Crear objeto con los datos del formulario y el token
    const formDataToSend = {
      ...formData,
      BajaFirmada: firmaDigital,
      token: token,
    };

    try {
      // Realizar la consulta a la API
      const response = await fetch("/api/formulario/formulariobajacrear", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(formDataToSend),
      });

      // Verificar si la consulta fue exitosa
      if (response.ok) {
        window.location.reload();
      } else {
        console.error("Error al enviar el formulario:", response.statusText);
      }
    } catch (error) {
      console.error("Error en la solicitud a la API:", error);
    }
  };

  return (
    <div className="container">
      <Form onSubmit={handleSubmit} autoComplete="off">
        <Row className="mb-1">
          <Form.Group as={Col} md="8">
            <Form.Label className="fs-14">N° de terminal</Form.Label>
            <Form.Control
              type="number"
              name="TerminalN"
              required
              placeholder="ingresar el N° Terminal"
              value={formData.TerminalN}
              onChange={handleChange}
              className="input-formulario fs-14"
            />
          </Form.Group>
        </Row>
        <Row className="mb-1">
          <section className="col-lg-6">
            <article>
              <label htmlFor="NombreComercio" className="fs-14 mb-2">
                Nombre del establecimiento
              </label>
              <Controller
                name="NombreComercio"
                control={control}
                render={({ field }) => (
                  <input
                    {...field}
                    type="text"
                    placeholder="Ingresar el nombre del establecimiento"
                    className="input-formulario fs-14"
                    value={formData.NombreComercio}
                    onChange={(e) => {
                      const val = e.target.value;
                      setFormData({
                        ...formData,
                        NombreComercio: val,
                      });
                      field.onChange(val);
                    }}
                  />
                )}
              />
            </article>
          </section>
        </Row>
        <Row>
          <Form.Label className="fs-14 mt-2">Observación</Form.Label>
          <Form.Control
            className="input-comentario-form-bajas container fs-14"
            as="textarea"
            name="Observacion"
            required
            value={formData.Observacion}
            onChange={handleChange}
            autoComplete="off"
            placeholder="Ingresar Observación"
          />
        </Row>
        <Row>
          <Form.Group
            className="d-flex mt-2"
            as={Col}
            md="12"
            controlId="validationCustom01"
          >
            <Form.Label className="fs-14">
              Registra operaciones pendientes:
            </Form.Label>
            <Form.Group className="mb-3 mx-3">
              <Form.Check
                className="fs-14"
                type="radio"
                name="RegistraOperacionesPendientes"
                label="Si"
                value="Si"
                checked={formData.RegistraOperacionesPendientes === "Si"}
                onChange={handleChange}
              />
            </Form.Group>
            <Form.Group className="mb-3 mx-3">
              <Form.Check
                className="fs-14"
                type="radio"
                name="RegistraOperacionesPendientes"
                label="No"
                value="No"
                checked={formData.RegistraOperacionesPendientes === "No"}
                onChange={handleChange}
              />
            </Form.Group>
          </Form.Group>
        </Row>
        <Row>
          <Form.Group
            className="d-flex mt-2"
            as={Col}
            md="12"
            controlId="validationCustom01"
          >
            <Form.Label className="fs-14">
              Registra operaciones con Tarjeta Naranja:
            </Form.Label>
            <Form.Group className="mb-3 mx-3">
              <Form.Check
                type="radio"
                name="RegistraOperacionesConTarjetaNaranja"
                className="fs-14"
                label="Si"
                value="Si"
                checked={formData.RegistraOperacionesConTarjetaNaranja === "Si"}
                onChange={handleChange}
              />
            </Form.Group>
            <Form.Group className="mb-3 mx-3">
              <Form.Check
                type="radio"
                name="RegistraOperacionesConTarjetaNaranja"
                className="fs-14"
                label="No"
                value="No"
                checked={formData.RegistraOperacionesConTarjetaNaranja === "No"}
                onChange={handleChange}
              />
            </Form.Group>
          </Form.Group>
        </Row>
        <Row>
          <Form.Group
            className="d-flex mt-2"
            as={Col}
            md="12"
            controlId="validationCustom03"
          >
            <Form.Label className="fs-14">Adjunta cierre de Lote:</Form.Label>
            <Form.Group className="mb-3 mx-3">
              <Form.Check
                className="fs-14"
                type="radio"
                name="AdjuntaCierreLote"
                label="Si"
                value="Si"
                checked={formData.AdjuntaCierreLote === "Si"}
                onChange={handleChange}
              />
            </Form.Group>
            <Form.Group className="mb-3 mx-3">
              <Form.Check
                className="fs-14"
                type="radio"
                name="AdjuntaCierreLote"
                label="No"
                value="No"
                checked={formData.AdjuntaCierreLote === "No"}
                onChange={handleChange}
              />
            </Form.Group>
          </Form.Group>
        </Row>
        {/* AGREGAR IMAGENES */}
        <Row className="">
          <div>
            <h6 className=""> Datos del comercio</h6>
          </div>

          <Form.Group as={Col} lg="4" md="12" controlId="validationCustom01">
            <Form.Label className="fs-14 mt-2">
              Cupón de inicialización de la terminal
            </Form.Label>
            <Form.Control
              type="file"
              className="input-form-editar-comanda fs-14"
              name="CuponInicializacionTerminal"
              onChange={handleChange}
              multiple
              required
            />
          </Form.Group>
          <Form.Group as={Col} lg="4" md="12" controlId="validationCustom01">
            <Form.Label className="fs-14 mt-2">Cierre de Lote</Form.Label>
            <Form.Control
              type="file"
              name="CierreLote"
              className="input-form-editar-comanda fs-14"
              onChange={handleChange}
              multiple
              required
            />
          </Form.Group>
          <Form.Group as={Col} lg="4" md="12" controlId="validationCustom01">
            <Form.Label className="fs-14 mt-2">Foto Terminal</Form.Label>
            <Form.Control
              type="file"
              name="FotoTerminal"
              className="input-form-editar-comanda fs-14"
              onChange={handleChange}
              multiple
              required
            />
          </Form.Group>
        </Row>
        <section className="mt-4">
          <h6 className="fs-12">DECLARACIÓN JURADA</h6>
          <h6 className="fs-12">
            El que subscribe, con poder suficiente para este acto, manifiesta en
            calidad de declaración jurada y asumiendo toda la responsabilidad
            civil, penal y administrativa por cualquier falsedad, omisión u
            ocultamiento que se verificare, que la información contenida en el
            presente formulario es veraz, exacta y subsiste al tiempo de
            efectuarse esta presentación.
          </h6>
        </section>
        {/* Firma digital */}
        <Row className="mb-3">
          <div>
            <h6 className="mt-4">Firma Digital</h6>
          </div>
          <article className="container">
            <Form.Group as={Col} md="12" controlId="firmaDigital">
              <ReactSignatureCanvas
                ref={sigCanvas}
                penColor="black"
                canvasProps={{
                  className: "sigCanvas",
                }}
              />
              <div className="d-flex justify-content-start">
                <Button
                  className="mt-3"
                  variant="secondary"
                  onClick={() => sigCanvas.current.clear()}
                >
                  Borrar Firma
                </Button>
              </div>
            </Form.Group>
          </article>
        </Row>
        <div className="d-flex justify-content-center">
          <Button className="btn-guardar-formulario-alta my-3" type="submit">
            Guardar
          </Button>
        </div>
      </Form>
    </div>
  );
};

export default FormBajasNuevo;
