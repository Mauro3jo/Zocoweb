import { useContext } from "react";
import { DarkModeContext } from "../../context/DarkModeContext";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faPencil, faTrash } from "@fortawesome/free-solid-svg-icons";

const ItemsTablaModificaciones = ({ fecha, estado, asesor, terminal, provincia }) => {
  const { darkMode } = useContext(DarkModeContext);
  return (
    <tr
      className={
        darkMode
          ? " tabla-borde-bottom  text-white"
          : "tabla-borde-bottom  text-dark"
      }
    >
      <td className="fs-13 lato-regular py-3 "> {fecha}</td>
      <td className="fs-13 lato-regular py-3 "> {estado}</td>
      <td className="fs-13 lato-regular py-3 "> {asesor}</td>
      <td className="fs-13 lato-regular py-3 "> {terminal}</td>
      <td className="fs-13 lato-regular py-3 ">{provincia}</td>
      <td className="fs-13 lato-regular py-3 d-flex centrado ">
        <div>
          <button className="btn-publicar mx-1 border-0" type="submit">
            <span className="lato-bold fs-18  ">
              <FontAwesomeIcon className="text-dark"  icon={faPencil} />
            </span>
          </button>
        </div>
        <div>
          <button className="btn-publicar mx-1 border-0" type="submit">
            <span className="lato-bold fs-18  ">
              <FontAwesomeIcon className="text-dark"  icon={faTrash} />
            </span>
          </button>
          
        </div>
      </td>
    </tr>
  );
};

export default ItemsTablaModificaciones;
