import "./TablaAlta.css";
import React, { useContext, useState } from "react";
import { useForm } from "react-hook-form";
import { DarkModeContext } from "../../context/DarkModeContext";
import FormAltasNuevo from "./FormAltasNuevo";
import FormAltasNuevoPersonaFisica from "./FormAltasNuevosPersonaFisica";
import { Col, Form, Row } from "react-bootstrap";

const TablaAltas = () => {
  const { darkMode } = useContext(DarkModeContext);
  const [datosBuscador, setDatosBuscador] = useState({});
  const { register, handleSubmit, reset } = useForm();
  const onSubmit = (datos) => {
    setDatosBuscador(datos);
    reset();
  };

  // Estados para el tipo de persona
  const [mostrarFormJuridico, setMostrarFormJuridico] = useState(false);
  const [tipoPersona, setTipoPersona] = useState("fisica");

  const handleTipoPersonaChange = (event) => {
    const { value } = event.target;
    setTipoPersona(value);
    setMostrarFormJuridico(value === "juridica");
  };

  return (
    <div className="container ">
      <section className="d-flex justify-content-center mt-4">
          <Form.Group   className="mb-3 me-4">
            <Form.Check
              type="radio"
              label="Persona Física"
              name="tipoPersona"
              id="fisica"
              value="fisica"
              checked={tipoPersona === "fisica"}
              onChange={handleTipoPersonaChange}
            />
          </Form.Group>
          <Form.Group  className="mb-3">
            <Form.Check
              type="radio"
              label="Persona Jurídica"
              name="tipoPersona"
              id="juridica"
              value="juridica"
              checked={tipoPersona === "juridica"}
              onChange={handleTipoPersonaChange}
            />
          </Form.Group>
       
      </section>
      {mostrarFormJuridico === false ? (
        <>
          <div
            className={
              darkMode ? "bg-tabla-calculadora-dark" : "bg-tabla-calculadora"
            }
          >
            <h1 className="text-center lato-bold fs-16 pt-3">
              Altas Persona fisica
            </h1>
            <FormAltasNuevoPersonaFisica />
          </div>
        </>
      ) : (
        <>
          <div
            className={
              darkMode ? "bg-tabla-calculadora-dark" : "bg-tabla-calculadora"
            }
          >
            <h1 className="text-center lato-bold fs-16 pt-3">
              Altas Persona juridica
            </h1>
            <FormAltasNuevo />
          </div>
        </>
      )}
    </div>
  );
};

export default TablaAltas;
