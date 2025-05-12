import {
  faCircleCheck,
  faCircleMinus,
} from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import React, { useContext, useState } from "react";
import { Button } from "react-bootstrap";
import { DarkModeContext } from "../../context/DarkModeContext";
import ModalCompletarPeticion from "./ModalCompletarPeticion";
import formatDate from "../../helpers/formatDate";
import formatTime from "../../helpers/formatTime";

const CartasPeticionesGestor = ({ dato }) => {
  // darkMode context funcionalidad para el modo claro/oscuro
  const { darkMode } = useContext(DarkModeContext);

  // estado para controlar la apertura y cierre del modal
  const [modalShowCompleta, setModalShowCompleta] = React.useState(false);

  // estado para guardar los detalles
  const [datosDetalles, setDatosDetalles] = useState({});
  const [verDetalles, setVerDetalles] = useState(false);

  // Función para manejar el clic en el botón Ver
  const manejarVerClick = async (id) => {
    const token = sessionStorage.getItem("token");
    // Verificar si el ID es válido antes de hacer la solicitud
    if (id) {
      // Preparar el cuerpo de la solicitud
      const cuerpoSolicitud = JSON.stringify({
        Id: id,
        Token: token,
      });
      try {
        // Hacer la solicitud POST a la API
        const respuesta = await fetch("/api/comanda/listaconsulta", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: cuerpoSolicitud,
        });

        // Obtener y procesar la respuesta del servidor
        const resultado = await respuesta.json();

        // cargar los datos de la respuesta
        setDatosDetalles(resultado);

        // Actualizar el estado para mostrar la gráfica
        setVerDetalles(true);
        // actualizarListaBusquedas(); // Asegúrate de llamar a esta función aquí si el proceso afecta los datos que muestra la tabla
      } catch (error) {
        console.error("Error al hacer la solicitud:", error);
        setVerDetalles(false);
      }
    } else {
      setVerDetalles(false);
    }
  };

  const abriModalId = () => (
    setModalShowCompleta(!modalShowCompleta), manejarVerClick(dato.id)
  );

  return (
    <article
      className={
        darkMode
          ? "carta-peticiones-gestor-dark my-2"
          : "carta-peticiones-gestor my-2"
      }
    >
      <div className="mx-4 ">
        <div className="d-flex justify-content-between">
          <div>
            <h6 className=" pt-4 lato-bold fs-16" style={{ color: "#E24444" }}>
              {dato.estado === "pendiente" ? "¡Nuevo!" : ""}
            </h6>
          </div>
          <div>
            <h6 className=" pt-4 color-verde lato-bold fs-16">
              {dato.id === "" ? "" : <># {dato.id}</>}
            </h6>
          </div>
        </div>

        <h6 className={darkMode ? "fs-14 text-white" : "fs-14 text-black-50"}>
          Apertura:{" "}
          {dato.fechaApertura === null || dato.fechaApertura === "" ? (
            ""
          ) : (
            <>
              {formatDate(dato.fechaApertura)} -{" "}
              {formatTime(dato.fechaApertura)} hs
            </>
          )}
        </h6>
        <h6 className="lato-bold fs-16">
          {dato.motivo === null || dato.motivo === "" ? "" : dato.motivo}
        </h6>
        <h6 className="lato-regular fs-16">
          {dato.nombredelComercio === null || dato.nombredelComercio === ""
            ? "No hay nombre del comercio cargado en el sistema."
            : dato.nombredelComercio}{" "}
          <br /> <span className="me-1"> Dirección: </span>
          {dato.direccion === null || dato.direccion === ""
            ? "No hay direccion cargada en el sistema."
            : dato.direccion}{" "}
          <br /> <span className="me-1"> Provincia: </span>
          {dato.provincia === null || dato.provincia === ""
            ? "No hay direccion cargada en el sistema."
            : dato.provincia}{" "}
          <br /> <span className="me-1"> N° de Terminal:</span>
          {dato.numeroTerminal === null || dato.numeroTerminal === ""
            ? "No hay N° de Terminal cargado en el sistema."
            : dato.numeroTerminal}{" "}
        </h6>
        <h6>
          {dato.estado === "pendiente" ? (
            <>
              <span
                className="fs-18 lato-regular py-3"
                style={{ color: "#E89F2F" }}
              >
                <FontAwesomeIcon
                  className="me-2"
                  icon={faCircleMinus}
                  style={{ color: "#E89F2F" }}
                />
                Pendiente
              </span>
            </>
          ) : (
            <span className="fs-18 lato-regular py-3  color-verde">
              <FontAwesomeIcon
                className="me-2"
                icon={faCircleCheck}
                style={{ color: "#b4c400 " }}
              />
              Completado
            </span>
          )}
        </h6>
      </div>
      <article className="">
        <div className="my-4  mx-3 ">
          {dato.estado === "pendiente" ? (
            <>
              <div className="d-flex justify-content-center">
                <Button
                  className={
                    darkMode
                      ? "centrado border-0 btn btn-modal-nuevo-completado  centrado border-0 mx-2"
                      : "centrado  border-0 btn btn-modal-nuevo-completado  centrado border-0 mx-2"
                  }
                  onClick={() => abriModalId()}
                >
                  <span className="lato-bold fs-18 ms-2">
                    {" "}
                    Completar petición
                  </span>
                </Button>
              </div>
              <ModalCompletarPeticion
                show={modalShowCompleta}
                onHide={() => setModalShowCompleta(false)}
                datosDetalles={datosDetalles}
                idParaEnviar={dato.id}
              />
            </>
          ) : (
            <></>
          )}
        </div>
      </article>
    </article>
  );
};

export default CartasPeticionesGestor;
