import "./TablaAltaAdministrador.css";
import React, { useContext, useState } from "react";
import { useForm } from "react-hook-form";
import { DarkModeContext } from "../../context/DarkModeContext";
import FormModificacionesNuevo from "../gestorComp/FormModicacionesNuevo";


const TablaModificacionesAdministrador = () => {
  const { darkMode } = useContext(DarkModeContext);
  const [datosBuscador, setDatosBuscador] = useState({});
  const { register, handleSubmit, reset } = useForm();
  const onSubmit = (datos) => {
    setDatosBuscador(datos);
    reset();
  };

  return (
    <div className="container">
      <div
        className={
          darkMode ? "bg-tabla-calculadora-dark" : "bg-tabla-calculadora"
        }
      >
        <h1 className="text-center lato-bold fs-16 pt-3">Modificaciones</h1>
        <FormModificacionesNuevo />
      </div>
    </div>
  );
};

export default TablaModificacionesAdministrador;
