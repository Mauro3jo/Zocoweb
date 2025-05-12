import React, {useContext,useEffect}from "react";
import { DarkModeContext } from "../context/DarkModeContext";

const DatosReportes = ({data}) => {
  const { darkMode } = useContext(DarkModeContext);
  useEffect(() => {
  }, [data]);

  const { totalBruto1Pago, totalBrutoDebito, totalBrutoCredito, totalCantidadOperaciones } = data || {}; // Evita error si data es null

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

  // Verificar si los datos existen antes de formatearlos
  const valoresFormateados = [totalBruto1Pago, totalBrutoDebito, totalBrutoCredito].map(
    (valor) => formatearAPeso(valor || 0)
  );

  if (!data) {
    return <p>Cargando datos...</p>; // Muestra un mensaje mientras los datos se cargan
  }
  return (
    <section className="container">
      <div className="row">
        <article className="col-12 col-md-6 col-lg-3  py-2">
          <h6 className="text-center lato-bold fs-17 "> Cantidad De Operaciones: </h6>
          <button
            className={
              darkMode
                ? " bg-data-dark border-0 quitar-cursor-pointer"
                : "container-light bg-data  border-0 quitar-cursor-pointer"
            }
          >
            <div className=" d-flex justify-content-center lato-bold-a-lato-500 border-0 fs-22">
               {totalCantidadOperaciones}
            </div>
          </button>
        </article>
        <article className="col-12 col-md-6 col-lg-3  py-2">
          <h6 className="text-center lato-bold  fs-17"> Debito</h6>
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
          <h6 className="text-center lato-bold fs-17"> Credito</h6>
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
          <h6 className="text-center lato-bold fs-17 "> 1 pago</h6>
          <button
            className={
              darkMode
                ? " bg-data-dark border-0 quitar-cursor-pointer"
                : "container-light bg-data  border-0 quitar-cursor-pointer"
            }
          >
            <div className=" d-flex justify-content-center border-0 lato-bold-a-lato-500  fs-22">
              $ {valoresFormateados[0]}
            </div>
          </button>
        </article>
      </div>
    </section>
  );
};

export default DatosReportes;
