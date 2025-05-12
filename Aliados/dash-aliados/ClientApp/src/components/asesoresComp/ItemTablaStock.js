
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { DarkModeContext } from "../../context/DarkModeContext";
import { useContext } from "react";

const ItemsTablaStock = ({ terminal, mesActual, mesAnterior, icono,color }) => {
  const { darkMode } = useContext(DarkModeContext);
  return (
    <tr
      className={
        darkMode
          ? " tabla-borde-bottom  text-white"
          : "tabla-borde-bottom  text-dark"
      }
    >
      <td className="fs-13 lato-regular py-2 "> {terminal}</td>
      <td className="fs-13 lato-regular py-2 "> $ {mesAnterior}</td>
      <td className="fs-13 lato-regular py-2 ">
        $ 
        <span className="margin-end ">{mesActual}</span>
        <FontAwesomeIcon className={color} size="2xl" icon={icono} />
      </td>
    </tr>
  );
};

export default ItemsTablaStock;
