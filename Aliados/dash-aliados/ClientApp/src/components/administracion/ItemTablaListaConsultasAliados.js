import React, { useContext, useState } from "react";
import { Button, Modal } from "react-bootstrap";
import { DarkModeContext } from "../../context/DarkModeContext";
import ModalEnviarComanda from "./ModalEnviarComanda";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faEdit } from "@fortawesome/free-solid-svg-icons";

const ItemTablaListaConsultasAliados = ({
  consulta,
  manejarVerClick,
  id,
  datosDetalles,
}) => {
  // Crear un estado local para manejar el estado de la consulta
  const [estadoConsulta, setEstadoConsulta] = useState(consulta.estado);

  // estado para manejar el despliegue del modal
  const [showConfirmationModal, setShowConfirmationModal] = useState(false);

  //Funciones para cerrar o abrir el modal
  const handleShowConfirmation = () => setShowConfirmationModal(true);
  const handleCloseConfirmation = () => setShowConfirmationModal(false);

  // Función para cambiar el estado de la consulta
  const toggleEstado = () => {
    const nuevoEstado =
      estadoConsulta === "pendiente" ? "completado" : "pendiente";
    setEstadoConsulta(nuevoEstado);
    const token = sessionStorage.getItem("token");
    const data = {
      id: consulta.id, 
      Estado: nuevoEstado,
      token: token,
      FechaCierre: new Date().toLocaleString("es-AR", {
        timeZone: "America/Argentina/Buenos_Aires",
      }), 
    };

    fetch("/api/comanda/EditarComanda", {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(data),
    })
      .then((response) => {
        if (!response.ok) {
          throw new Error("Network response was not ok");
        }
      })
      .then((data) => {
        console.log("Estado actualizado con éxito:", data);
      })
      .catch((error) => {
        console.error("Error al actualizar el estado:", error);
      });
  };

  // Determinar el color del boton dependiendo del state estadoConsulta
  const buttonVariant =
    estadoConsulta === "pendiente" ? "btn-pendiente" : "btn-completado";

  // context para el modo claro/oscuro
  const { darkMode } = useContext(DarkModeContext);

  // estado para controlar la apertura y cierre del modal
  const [modalShowCompleta, setModalShowCompleta] = React.useState(false);

  // funcion para abrir el modal y capturar los datos
  const openModalID = () => (
    setModalShowCompleta(true), manejarVerClick(consulta.id)
  );

  return (
    <tr className="text-center" key={id}>
      <td
        className={
          darkMode
            ? "fs-10 lato-regular py-4 prority-4 text-white "
            : "fs-10 lato-regular py-4 prority-4 "
        }
      >
        {consulta.id === null || consulta.id === "" ? "N/A" : consulta.id}
      </td>
      <td
        className={
          darkMode
            ? "fs-10 lato-regular py-4 prority-4 text-white"
            : "fs-10 lato-regular py-4 prority-4"
        }
      >
        {consulta.fechaApertura}
      </td>
      <td
        className={
          darkMode
            ? "fs-10 lato-regular py-4 priority-4 text-white"
            : "fs-10 lato-regular py-4 prority-4"
        }
      >
        {consulta.motivo}
      </td>
      <td
        className={
          darkMode
            ? "fs-10 lato-regular py-4  priority-4 text-white"
            : "fs-10 lato-regular py-4 prority-4"
        }
      >
        {consulta.nombreGestor}
      </td>
      <td
        className={
          darkMode
            ? "fs-10 lato-regular py-4 priority-5 text-white"
            : "fs-10 lato-regular py-4 prority-5"
        }
      >
        {consulta.nombredelComercio === null ||
        consulta.nombredelComercio === ""
          ? "N/A"
          : consulta.nombredelComercio}
      </td>
      {/* boton cambio de estado*/}
      <td className="fs-10 lato-regular  priority-3 pt-3">
        <button onClick={handleShowConfirmation} className={buttonVariant}>
          {estadoConsulta}
        </button>
        <Modal show={showConfirmationModal} onHide={handleCloseConfirmation}>
          <Modal.Header closeButton>
            <Modal.Title>Confirmar Cambio de Estado</Modal.Title>
          </Modal.Header>
          <Modal.Body>
            ¿Estás seguro de que quieres cambiar el estado de esta consulta?
          </Modal.Body>
          <Modal.Footer>
            <Button variant="secondary" onClick={handleCloseConfirmation}>
              No
            </Button>
            <Button
              variant="primary"
              onClick={() => {
                toggleEstado();
                handleCloseConfirmation();
              }}
            >
              Sí
            </Button>
          </Modal.Footer>
        </Modal>
      </td>
      <td
        className={
          darkMode
            ? "fs-10 lato-regular py-4  priority-1 text-white"
            : "fs-10 lato-regular py-4 prority-1"
        }
      >
        {consulta.fechaCierre === null || consulta.fechaCierre === "" ? (
          <> No hay fecha de cierre ingresada</>
        ) : (
         consulta.fechaCierre
        )}
      </td>
      <td className="fs-10 lato-regular py-3  priority-2">
        {/* Botón Ver que al hacer clic ejecuta manejarVerClick con el id de la fila */}
        <button
          onClick={() => manejarVerClick(consulta.id)}
          className="btn-ver-id-grafica"
        >
          Ver
        </button>
      </td>
      <td className="fs-10 lato-regular pt-3 priority-2">
        <Button
          className={
            darkMode
              ? "centrado border-0 btn btn-sm btn-editar-comanda"
              : "centrado  border-0 btn btn-sm btn-editar-comanda"
          }
          onClick={() => openModalID()}
          // aqui va la funcion para mandar el id
        >
          <FontAwesomeIcon icon={faEdit} />
        </Button>
        <ModalEnviarComanda
          idParaId={consulta.id}
          show={modalShowCompleta}
          onHide={() => setModalShowCompleta(false)}
          datosDetalles={datosDetalles}
        />
      </td>
    </tr>
  );
};

export default ItemTablaListaConsultasAliados;
