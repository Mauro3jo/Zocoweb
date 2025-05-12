import { useContext } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import MiModalCargarVisita from "./MiModalCargarVisita";
import { useState } from "react";
import { Button } from "react-bootstrap";
import { DarkModeContext } from "../../context/DarkModeContext";

const ItemsTablaVisitas = ({
  nombreComercio,
  decisionTomada,
  estado,
  terminal,
  icono,
}) => {
  const { darkMode } = useContext(DarkModeContext);
  const [modalShow, setModalShow] = useState(false);

  return (
    <tr
      className={
        darkMode
          ? " tabla-borde-bottom  text-white"
          : "tabla-borde-bottom  text-dark"
      }
    >
      <td className="fs-13 lato-regular py-4"> {nombreComercio}</td>
      <td className="fs-13 lato-regular py-4"> {terminal}</td>
      <td className="fs-13 lato-regular py-4"> {decisionTomada}</td>
      <td className="fs-13 lato-regular  d-flex margin-left-btn-publicar">
        {estado === "Cargar visita" ? (
          <div>
            <Button
              className="btn-cargar-visita centrado border-0"
              onClick={() => setModalShow(true)}
            >
              <div>
                <FontAwesomeIcon
                  className=" my-1 px-1 color-rojo"
                  style={{ fontSize: "25px" }}
                  icon={icono}
                />
              </div>
              <div className="fs-12">{estado}</div>
            </Button>

            <MiModalCargarVisita
              show={modalShow}
              onHide={() => setModalShow(false)}
            />
          </div>
        ) : (
          <div className="">
            <Button className="d-flex centrado cursor-flecha color-verde  btn-completo-visita  border-0 ">
              <FontAwesomeIcon
                className=" my-1 px-1 color-verde"
                style={{ fontSize: "25px" }}
                icon={icono}
              />
               <div className="fs-12">{estado}</div>
            </Button>
          </div>
        )}
      </td>
    </tr>
  );
};

export default ItemsTablaVisitas;
