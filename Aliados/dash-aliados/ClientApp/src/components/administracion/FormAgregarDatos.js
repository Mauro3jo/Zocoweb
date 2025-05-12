import React, { useState } from "react";
import { Button, Col, Form, Row } from "react-bootstrap";
import Swal from "sweetalert2";

const FormAgregarDatos = ({ item }) => {
  const { id } = item;
  const [formDataAgregar, setFormDataAgregar] = useState({});

  const handleSubmit = async (event) => {
    event.preventDefault();
    const form = event.currentTarget;

    // Validación de campos vacíos
    const requiredFields = [
      "NroLocal",
      "Legajo",
      "CodActividad",
      "Rubro",
      "Actividad",
      "CodActividadRentas",
      "ActividadRentas"
    ];
    for (const field of requiredFields) {
      if (!formDataAgregar[field]) {
        Swal.fire("Error", `El campo ${field} es obligatorio`, "error");
        return;
      }
    }

    const token = sessionStorage.getItem("token");
    if (!token) {
      console.error("No se encontró token en sessionStorage.");
      return;
    }

    const formDataWithToken = { id, token, ...formDataAgregar };

    try {
      const response = await fetch("/api/altas/agregaralta", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(formDataWithToken),
      });

      if (response.status === 200) {
        Swal.fire("Éxito", "Los datos fueron agregados correctamente", "success");
      } else if (response.status === 400) {
        Swal.fire("Error", "No se encontró la terminal o la terminal no fue dada de baja", "error");
      } else if (response.status === 401) {
        Swal.fire("Error", "Token no válido o token expirado", "error");
      } else {
        Swal.fire("Error", "Hubo un error inesperado", "error");
      }

      if (response.status === 200) {
        window.location.reload();
      }

    } catch (error) {
      console.error("Hubo un error:", error);
      Swal.fire("Error", "Hubo un error en la conexión", "error");
    }
  };

  const handleChange = (e) => {
    e.preventDefault();
    const { name, value } = e.target;
    setFormDataAgregar((prevFormData) => ({
      ...prevFormData,
      [name]: value,
    }));
  };

  return (
    <div>
      <Form onSubmit={handleSubmit}>
        <Row className="mb-3">
          <Form.Group as={Col} md="12">
            <Form.Label className="fs-14">N° de Local</Form.Label>
            <Form.Control
              type="number"
              name="NroLocal"
              value={formDataAgregar.NroLocal}
              onChange={handleChange}
              className="input-formulario fs-14"
              placeholder="Ingresar el N° Local"
              required
            />
          </Form.Group>
        </Row>
        <Row className="mb-3">
          <Form.Group as={Col} md="12">
            <Form.Label className="fs-14">Legajo</Form.Label>
            <Form.Control
              type="number"
              name="Legajo"
              value={formDataAgregar.Legajo}
              onChange={handleChange}
              className="input-formulario fs-14"
              placeholder="Ingresar Legajo"
              required
            />
          </Form.Group>
        </Row>
        <Row className="mb-3">
          <Form.Group as={Col} md="12">
            <Form.Label className="fs-14">Código Actividad</Form.Label>
            <Form.Control
              type="number"
              name="CodActividad"
              value={formDataAgregar.CodActividad}
              onChange={handleChange}
              className="input-formulario fs-14"
              placeholder="Ingresar código Actividad"
              required
            />
          </Form.Group>
        </Row>
        <Row className="mb-3">
          <Form.Group as={Col} md="12">
            <Form.Label className="fs-14">Rubro</Form.Label>
            <Form.Control
              type="text"
              name="Rubro"
              value={formDataAgregar.Rubro}
              onChange={handleChange}
              className="input-formulario fs-14"
              placeholder="Ingresar Rubro"
              required
            />
          </Form.Group>
        </Row>
        <Row className="mb-3">
          <Form.Group as={Col} md="12">
            <Form.Label className="fs-14">Rubro Secundario</Form.Label>
            <Form.Control
              type="text"
              name="RubroSecundario"
              value={formDataAgregar.RubroSecundario}
              onChange={handleChange}
              className="input-formulario fs-14"
              placeholder="Ingresar Rubro Secundario"
            />
          </Form.Group>
        </Row>
        <Row className="mb-3">
          <Form.Group as={Col} md="12">
            <Form.Label className="fs-14">Actividad</Form.Label>
            <Form.Control
              type="text"
              name="Actividad"
              value={formDataAgregar.Actividad}
              onChange={handleChange}
              className="input-formulario fs-14"
              placeholder="Ingresar Actividad"
              required
            />
          </Form.Group>
        </Row>
        <Row className="mb-3">
          <Form.Group as={Col} md="12">
            <Form.Label className="fs-14">Actividad 2</Form.Label>
            <Form.Control
              type="text"
              name="Actividad2"
              value={formDataAgregar.Actividad2}
              onChange={handleChange}
              className="input-formulario fs-14"
              placeholder="Ingresar Actividad secundaria"
            />
          </Form.Group>
        </Row>
        <Row className="mb-3">
          <Form.Group as={Col} md="12">
            <Form.Label className="fs-14">Código Actividad Rentas</Form.Label>
            <Form.Control
              type="number"
              name="CodActividadRentas"
              value={formDataAgregar.CodActividadRentas}
              onChange={handleChange}
              className="input-formulario fs-14"
              placeholder="Ingresar código Actividad Rentas"
              required
            />
          </Form.Group>
        </Row>
        <Row className="mb-3">
          <Form.Group as={Col} md="12">
            <Form.Label className="fs-14">Actividad Rentas</Form.Label>
            <Form.Control
              type="text"
              name="ActividadRentas"
              value={formDataAgregar.ActividadRentas}
              onChange={handleChange}
              className="input-formulario fs-14"
              placeholder="Ingresar Actividad Rentas"
              required
            />
          </Form.Group>
        </Row>
        <div className="d-flex justify-content-center">
          <Button className="btn-guardar-formulario-alta my-5" type="submit">
            Enviar
          </Button>
        </div>
      </Form>
    </div>
  );
};

export default FormAgregarDatos;
