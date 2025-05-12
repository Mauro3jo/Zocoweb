// import hooks
import React, { useContext, useEffect, useState } from "react";

// import context
import { DarkModeContext } from "../context/DarkModeContext";

// import librerias
import { Button } from "react-bootstrap";

// import components
import ModalConsultasAliados from "./ModalConsultasAliados";
import TablaConsultasAliados from "./TablaConsultasAliados";
import FormularioConFirma from "./FormularioConFirma";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faCirclePlus } from "@fortawesome/free-solid-svg-icons";

const ContenidoConsultasAliados = () => {
  // context para el modo claro/oscuro
  const { darkMode } = useContext(DarkModeContext);

  // estado para controlar la apertura y cierre del modal
  const [modalShowCompleta, setModalShowCompleta] = React.useState(false);

  // Estado inicial para los datos de la tabla
  // priority-1, priority-2 y priority-11 son para mostrar en la version mobile.

  const [consultas, setConsultas] = useState([]);

  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchComandas = async () => {
      setIsLoading(true);
      setError(null);
      const token = sessionStorage.getItem("token");

      if (token) {
        try {
          const response = await fetch(
            "/api/comanda/ListarComandasPorUsuario",
            {
              method: "POST",
              headers: { "Content-Type": "application/json" },
              body: JSON.stringify({ token }),
            }
          );

          if (!response.ok) {
            throw new Error("La respuesta de la red no fue correcta");
          }

          const data = await response.json();
          // Ordena las consultas antes de actualizar el estado
          const ordenadas = data.sort(
            (a, b) => new Date(b.fechaApertura) - new Date(a.fechaApertura)
          );
          setConsultas(ordenadas);
        } catch (error) {
          setError(error.message);
          console.error("Hubo un error:", error);
        }
      } else {
        setError("No se encontró token en sessionStorage.");
      }
      setIsLoading(false);
    };

    fetchComandas();
  }, []); // Dependencias vacías para correr sólo al montar

  return (
    <div className="container">
      <div className="d-flex justify-content-end">
        <Button
          className={
            darkMode
              ? "centrado border-0 btn-nueva-consulta"
              : "centrado  border-0 btn-nueva-consulta"
          }
          onClick={() => setModalShowCompleta(true)}
        >
          <FontAwesomeIcon className=" me-2 fs-22 " icon={faCirclePlus} />
          <span className="fs-18 lato-bold"> Nueva</span>
        </Button>
        <ModalConsultasAliados
          show={modalShowCompleta}
          onHide={() => setModalShowCompleta(false)}
        />
      </div>
      <div className="py-2">
        <TablaConsultasAliados consultas={consultas} isLoading={isLoading} />
      </div>
    </div>
  );
};

export default ContenidoConsultasAliados;
