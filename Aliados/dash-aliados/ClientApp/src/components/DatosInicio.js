// import hooks
import { useContext } from "react";

// import context
import { DarkModeContext } from "../context/DarkModeContext";

const DatosInicio = ({ datos }) => {
  // context para el modo claro/oscuro
  const { darkMode } = useContext(DarkModeContext);

  // elementos extraido de los datos enviado desde el context
  const { totalBrutoMes, totalNetoMes, totalNetoMañana, totalNetoHoy } = datos;

  // funcion para formatear a peso un valor
  const formatearAPeso = (valor) => {
    const valorFormateado = new Intl.NumberFormat("es-AR", {
      style: "currency",
      currency: "ARS",
    }).format(valor);
    const partes = valorFormateado.split(",");
    partes[0] = partes[0]
      .replace(/\D/g, "")
      .replace(/\B(?=(\d{3})+(?!\d))/g, ".");
    return partes.join(",");
  };

  // funcion para formatear todos los valores a peso
  function formatearValores(...valores) {
    return valores.map((valor) => formatearAPeso(valor));
  }

  // los valores formateados de los datos
  const valoresFormateados = formatearValores(
    totalNetoHoy,
    totalNetoMañana,
    totalBrutoMes,
    totalNetoMes
  );

  return (
    <section className="container">
      <div className="row">
        <article className="col-12 col-md-6 col-lg-3  py-2">
          <h6 className="text-center lato-bold fs-17 "> Hoy se Acredita: </h6>
          <button
            className={
              darkMode
                ? " bg-data-dark border-0 quitar-cursor-pointer"
                : "container-light bg-data  border-0 quitar-cursor-pointer"
            }
          >
            <div className=" d-flex justify-content-center lato-bold-a-lato-500 border-0 fs-22">
              $ {valoresFormateados[0]}
            </div>
          </button>
        </article>
        <article className="col-12 col-md-6 col-lg-3  py-2">
          <h6 className="text-center lato-bold  fs-17"> Mañana se Acredita</h6>
          <button
            className={
              darkMode
                ? " bg-data-dark border-0 quitar-cursor-pointer"
                : "container-light bg-data  border-0 quitar-cursor-pointer"
            }
          >
            <div className=" d-flex justify-content-center  border-0 lato-bold-a-lato-500  fs-22">
              $ {valoresFormateados[1]}
            </div>
          </button>
        </article>
        <article className="col-12 col-md-6 col-lg-3  py-2">
          <h6 className="text-center lato-bold fs-17"> Total Bruto</h6>
          <button
            className={
              darkMode
                ? " bg-data-dark border-0 quitar-cursor-pointer"
                : "container-light bg-data  border-0 quitar-cursor-pointer"
            }
          >
            <div className=" d-flex justify-content-center border-0 lato-bold-a-lato-500  fs-22">
              $ {valoresFormateados[2]}
            </div>
          </button>
        </article>
        <article className="col-12 col-md-6 col-lg-3  py-2">
          <h6 className="text-center lato-bold fs-17 "> Total Neto</h6>
          <button
            className={
              darkMode
                ? " bg-data-dark border-0 quitar-cursor-pointer"
                : "container-light bg-data  border-0 quitar-cursor-pointer"
            }
          >
            <div className=" d-flex justify-content-center border-0 lato-bold-a-lato-500  fs-22">
              $ {valoresFormateados[3]}
            </div>
          </button>
        </article>
      </div>
    </section>
  );
};

export default DatosInicio;
