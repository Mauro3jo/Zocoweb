import "./TablaAltaAdministrador.css";
import React, { useEffect, useState } from "react";
import TituloPagina from "../TituloPagina";
import TodasAltaTablaAdministrador from "./TodasAltaTablaAdministrador";
import TodasBajaTablaAdministrador from "./TodasBajasTablaAdministrador";
import TodasModificacionesTablaAdministrador from "./TodasModificacionesTablaAdministrador";

const TablaGeneralAdministrador = () => {
  // consulta para verficar token
  const [formulariosAlta, setFormulariosAlta] = useState([]);
  const [formulariosBaja, setFormulariosBaja] = useState([]);
  const [formulariosModificaciones, setFormulariosModificaciones] = useState(
    []
  );

  const fetchFormularios = async () => {
    try {
      const [responseAlta, responseModificaciones, responseBaja] =
        await Promise.all([
          fetch("/api/formulario/ListarTodosFormulariosAlta"),
          fetch("/api/formulario/ListarTodosFormulariosModificaciones"),
          fetch("/api/formulario/ListarTodosFormulariosBaja"),
        ]);

      if (responseAlta.ok) {
        const dataAlta = await responseAlta.json();
        setFormulariosAlta(dataAlta);
      }

      if (responseModificaciones.ok) {
        const dataModificaciones = await responseModificaciones.json();
        setFormulariosModificaciones(dataModificaciones);
      }

      if (responseBaja.ok) {
        const dataBaja = await responseBaja.json();
        setFormulariosBaja(dataBaja);
      }
    } catch (error) {
      console.error("Error fetching formularios:", error);
    }
  };

  useEffect(() => {
    fetchFormularios();
  }, []);

  return (
    <div className="container">
      <section className="py-4">
        <TituloPagina title="Formularios Altas" />
        <TodasAltaTablaAdministrador formulariosAlta={formulariosAlta} />
      </section>
      <section className="py-4">
        <TituloPagina title="Formularios Bajas" />
        <TodasBajaTablaAdministrador formulariosBaja={formulariosBaja} />
      </section>
      <section className="py-4">
        <TituloPagina title="Formularios Modificaciones" />
        <TodasModificacionesTablaAdministrador formulariosModificaciones={formulariosModificaciones} />
      </section>
    </div>
  );
};

export default TablaGeneralAdministrador;
