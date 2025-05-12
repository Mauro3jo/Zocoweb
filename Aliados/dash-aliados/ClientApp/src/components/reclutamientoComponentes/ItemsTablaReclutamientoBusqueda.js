import React, { useContext } from "react";
import { DarkModeContext } from "../../context/DarkModeContext";
import formatearFecha from "../../helpers/formatearFecha";
import { Button } from "react-bootstrap";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faEdit, faPlusCircle } from "@fortawesome/free-solid-svg-icons";
import ModalReclutamientoEditar from "./ModalReclutamientoEditar";

const ItemsTablaReclutamientoBusqueda = ({
  dato,
  manejarVerClick,
  actualizarListaBusquedas,
}) => {
  const {
    id,
    fechaPuesto,
    puesto,
    provincia,
    cantidad,
    fechaCierre,
    estado,
    nombre,
    
  } = dato || [];

  const { darkMode } = useContext(DarkModeContext);
  const fechaPuestoFormateada = formatearFecha(fechaPuesto);
  const fechaCierreFormateada = formatearFecha(fechaCierre);

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
        <td className="fs-12-a-10 lato-regular pt-4 ">
          {" "}
          {fechaPuestoFormateada}
        </td>
        <td className="fs-12-a-10 lato-regular pt-4 "> {nombre}</td>
        <td className="fs-12-a-10 lato-regular pt-4 ">{puesto}</td>
        <td className="fs-12-a-10 lato-regular  pt-4 ">{provincia}</td>
        <td className="fs-12-a-10 lato-regular pt-4 "> {cantidad} </td>
        <td className="fs-12-a-10 lato-regular pt-4 ">
          {fechaCierreFormateada}
        </td>
        <td className="fs-12-a-10 lato-regular pt-4 ">{estado}</td>
        <td className="fs-12-a-10 lato-regular pt-3 ">
          {/* Botón Ver que al hacer clic ejecuta manejarVerClick con el id de la fila */}
          <button
            onClick={() => manejarVerClick(id)}
            className="btn-ver-id-grafica"
          >
            Ver
          </button>
        </td>
        <td className="fs-12-a-10 lato-regular  pt-3">
          <div className="centrado ">
            <Button
              className={
                darkMode
                  ? "btn-ver-id-grafica centrado border-0"
                  : "btn-ver-id-grafica centrado  border-0"
              }
              onClick={() => setModalShowCompleta(true)}
            >
              <FontAwesomeIcon size="xl" icon={faEdit} />
            </Button>
            <ModalReclutamientoEditar
              dato={dato}
              show={modalShowCompleta}
              onHide={() => setModalShowCompleta(false)}
              onNuevaBusquedaAñadida={actualizarListaBusquedas} // Propagando el callback
            />
          </div>
        </td>
      </tr>
    </>
  );
};

export default ItemsTablaReclutamientoBusqueda;
