import React, { useContext } from "react";
import { DarkModeContext } from "../../context/DarkModeContext";
import { Button } from "react-bootstrap";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faEdit } from "@fortawesome/free-solid-svg-icons";
import ModalReclutamientoEditar from "./ModalReclutamientoEditar";
import ModalEditarContratados from "./ModalContratadosEditar";
import formatearFecha from "../../helpers/formatearFecha";

const ItemsTablaReclutamientoContratados = ({ dato, manejarVerClick,onContratadoCreadoOEditado }) => {
    const { nombre, busquedaId, puesto, fechaDeContratacion, observacion, id, busquedaNombre } =
    dato || [];
  const { darkMode } = useContext(DarkModeContext);

  // estado para controlar la apertura y cierre del modal
  const [modalShowCompleta, setModalShowCompleta] = React.useState(false);


  return (
    <>
      <tr
        className={
          darkMode
            ? " tabla-borde-bottom  text-white"
            : "tabla-borde-bottom  text-dark"
        }
      >
        <td className="fs-12-a-10 lato-regular pt-4 ">{id} </td>
        <td className="fs-12-a-10 lato-regular pt-4 "> {nombre} </td>
        <td className="fs-12-a-10 lato-regular pt-4 ">{busquedaNombre}</td>
        <td className="fs-12-a-10 lato-regular  pt-4 ">{puesto}</td>
        <td className="fs-12-a-10 lato-regular pt-4 ">
          {fechaDeContratacion}
        </td>
        <td className="fs-12-a-10 lato-regular pt-3 ">
          {/* Botón Ver que al hacer clic ejecuta manejarVerClick con el id de la fila */}
          <button
            onClick={() => manejarVerClick(id)}
            className="btn-ver-id-grafica"
          >
            Ver
          </button>
        </td>

        <td className="fs-12-a-10 lato-regular pt-3">
          <div className="centrado ">
            <Button
              className={
                darkMode
                  ? "btn-ver-id-contratados centrado border-0"
                  : "btn-ver-id-contratados centrado  border-0"
              }
              onClick={() => setModalShowCompleta(true)}
            >
              <FontAwesomeIcon size="sm" icon={faEdit} />
            </Button>
            <ModalEditarContratados
              dato={dato}
              show={modalShowCompleta}
              onContratadoCreadoOEditado={onContratadoCreadoOEditado}
              onHide={() => setModalShowCompleta(false)}
            />
          </div>
        </td>
      </tr>
    </>
  );
};

export default ItemsTablaReclutamientoContratados;
