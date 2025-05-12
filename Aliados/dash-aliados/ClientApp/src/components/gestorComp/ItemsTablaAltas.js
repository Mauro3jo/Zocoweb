import { useContext } from "react";
import { DarkModeContext } from "../../context/DarkModeContext";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faPen, faTrash } from "@fortawesome/free-solid-svg-icons";

const ItemsTablaAltas = ({ fecha, estado, asesor, terminal, provincia }) => {
  const { darkMode } = useContext(DarkModeContext);
  return (
    <tr
      className={
        darkMode
          ? " tabla-borde-bottom  text-white"
          : "tabla-borde-bottom  text-dark"
      }
    >
      <td className="fs-13 lato-regular py-4"> {fecha}</td>
      <td className="fs-13 lato-regular py-4"> {estado}</td>
      <td className="fs-13 lato-regular py-4"> {asesor}</td>
      <td className="fs-13 lato-regular py-4"> {terminal}</td>
      <td className="fs-13 lato-regular py-4">{provincia}</td>
      <td className="fs-13 lato-regular  d-flex margin-left-btn-publicar">
        <div className="margin-left-right-btn-publicar">
          <button className="btn-publicar border-0" type="submit">
            <span className="lato-bold fs-18">
              <FontAwesomeIcon className="text-dark" icon={faPen} />
            </span>
          </button>
        </div>
        <div>
          <button className="btn-publicar  border-0" type="submit">
            <span className="lato-bold fs-18">
              <FontAwesomeIcon className="text-dark" icon={faTrash} />
            </span>
          </button>
        </div>
      </td>
    </tr>
  );
};

export default ItemsTablaAltas;
