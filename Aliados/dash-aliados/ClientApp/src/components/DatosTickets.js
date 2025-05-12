// import hooks 
import { useContext } from "react";

// import context 
import { DarkModeContext } from "../context/DarkModeContext";

// import formatear a peso funcion de la carpeta helpers 
import { formatearAPeso } from "../helpers/formatearAPeso";

const DatosTickets = ({ datosCuponesContext }) => {
  // contexto para la modalidad claro/oscuro 
  const { darkMode } = useContext(DarkModeContext);

  // extraigo de la variable datos Cupones Context los valores a utilizar 
  const { totalOperaciones, totalBrutoHoy, contracargo, retenciones } = datosCuponesContext;

  // utilizo la funcion helpers formatear a peso 
  // paso por parametro el dato totalbrutohoy para guardarlo en una variable ya formateado 
  const totalBrutoHoyFormateado = formatearAPeso(totalBrutoHoy);
  return (
    <section className="container">
      <div className="row">
        <article className="col-12 col-md-6 col-lg-3  py-2">
          <h6 className="text-center lato-bold  fs-17">
            {" "}
            Cantidad de Operaciones
          </h6>
          <button
            className={
              darkMode
                ? " bg-data-dark border-0 quitar-cursor-pointer"
                : "container-light bg-data  border-0 quitar-cursor-pointer"
            }
          >
            <div className=" d-flex justify-content-center border-0 lato-bold-a-lato-500  fs-22">
              {totalOperaciones}
            </div>
          </button>
        </article>

        <article className="col-12 col-md-6 col-lg-3 py-2">
          <h6 className="text-center lato-bold  fs-17"> Acumulado del Mes</h6>
          <button
            className={
              darkMode
                ? " bg-data-dark border-0 quitar-cursor-pointer"
                : "container-light bg-data  border-0 quitar-cursor-pointer"
            }
          >
            <div className=" d-flex justify-content-center border-0 lato-bold-a-lato-500  fs-22">
              $ {totalBrutoHoyFormateado}
            </div>
          </button>
        </article>

        <article className="col-12 col-md-6 col-lg-3 py-2">
          <h6 className="text-center lato-bold  fs-17">
            {" "}
            Contracargos del Mes
          </h6>
          <button
            className={
              darkMode
                ? " bg-data-dark border-0 quitar-cursor-pointer"
                : "container-light bg-data  border-0 quitar-cursor-pointer"
            }
          >
            <div className=" d-flex justify-content-center border-0 lato-bold-a-lato-500  fs-22">
              $ {contracargo}
            </div>
          </button>
        </article>
        <article className="col-12 col-md-6 col-lg-3 py-2">
          <h6 className="text-center lato-bold  fs-17">
            {" "}
            Retenciones más Impuestos
          </h6>
          <button
            className={
              darkMode
                ? " bg-data-dark border-0 quitar-cursor-pointer"
                : "container-light bg-data  border-0 quitar-cursor-pointer"
            }
          >
            <div className=" d-flex justify-content-center border-0 lato-bold-a-lato-500  fs-22">
              $ {retenciones}
            </div>
          </button>
        </article>
      </div>
    </section>
  );
};

export default DatosTickets;
