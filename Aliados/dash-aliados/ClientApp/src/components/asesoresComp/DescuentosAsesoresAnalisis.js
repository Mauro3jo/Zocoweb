// Import hooks, librerias y context
import React, { useContext } from "react";
import { DarkModeContext } from "../../context/DarkModeContext";

// import funcionalidad helpers para convertir valor en peso.
import formatCurrency from "../../helpers/formatCurrency";

const DescuentosAsesoresAnalisis = ({ datos }) => {
  // darkmode context para la funcionalidad claro/oscuro
  const { darkMode } = useContext(DarkModeContext);

  // extraigo desde la base los datos, en la variable datos para pintar
  const datosParaPintar = datos || [];
  const {
    descuentofiserv,
    descuentoPorVisita,
    descuentoPorVisitaGerencialYCoordinador,
    descuentoPendiente,
    descuentoporgestiones,
    descuentoGerencial,
    descuento,
  } = datosParaPintar;

  // empleo la funcion de formtear los valores
  const descuentofiservFormateadaApeso = formatCurrency(descuentofiserv);
  const descuentoPorVisitaFormateadaApeso = formatCurrency(descuentoPorVisita);
  const descuentoPorVisitaGerencialYCoordinadorFormateadaApeso = formatCurrency(
    descuentoPorVisitaGerencialYCoordinador
  );
  const descuentoPendienteFormateadaApeso = formatCurrency(descuentoPendiente);
  const descuentoporgestionesFormateadaApeso = formatCurrency(
    descuentoporgestiones
  );
  const descuentoGerencialFormateadaApeso = formatCurrency(descuentoGerencial);

  function convertirAPeso(str) {
    // Reemplazar coma por punto para convertir el string a formato numérico válido
    const numero = parseFloat(str.replace(",", "."));

    // Formatear el número como valor de moneda
    // Ajusta 'es-AR' y 'currency: 'ARS'' según el país y la moneda específica que necesitas
    const formateado = new Intl.NumberFormat("es-AR", {
      style: "currency",
      currency: "ARS",
      minimumFractionDigits: 2,
    }).format(numero);

    return formateado;
  }

  // Uso de la función
  const totalDescuento = convertirAPeso(descuento || "");

  return (
    <>
      <section className="">
        <div
          className={
            darkMode
              ? "bg-comisiones-dark-2 pt-5 pb-2 mt-2 mb-5"
              : "bg-comisiones-2  pt-5 pb-2 mt-2 mb-5"
          }
        >
          <div className="text-center">
            <h6 className="lato-bold fs-18 mb-4">Descuentos </h6>
          </div>
          <section className="container ">
            <div className="row ">
              <article className="col-6 col-md-6 col-lg-6  my-4">
                <h6 className="text-center color-rojo lato-regular fs-16">
                  Descuento Terminal
                </h6>
                <div className={darkMode ? " text-white" : " text-black "}>
                  <div className=" d-flex justify-content-center  lato-bold fs-18">
                    {"- " + descuentofiservFormateadaApeso}
                  </div>
                </div>
              </article>
              <article className="col-6 col-md-6 col-lg-6 my-4 ">
                <h6 className="text-center lato-regular fs-16 color-rojo">
                  {" "}
                  Descuento Visitas
                </h6>
                <div className={darkMode ? " text-white" : " text-black "}>
                  <div className=" d-flex justify-content-center  lato-bold fs-18">
                    {descuentoPorVisitaFormateadaApeso}
                  </div>
                </div>
              </article>
              <article className="col-6 col-md-6 col-lg-6 py-2">
                <h6 className="text-center lato-regular fs-16 color-rojo">
                  Descuento Visitas a Prov.
                </h6>
                <div className={darkMode ? " text-white" : " text-black "}>
                  <div className=" d-flex justify-content-center lato-bold fs-18">
                    {descuentoPorVisitaGerencialYCoordinadorFormateadaApeso}
                  </div>
                </div>
              </article>
              <div className="col-6 col-md-6 col-lg-6 my-3">
                <h6 className="text-center lato-regular fs-16 color-rojo">
                  Descuento pendiente
                </h6>
                <div className={darkMode ? " text-white" : " text-black "}>
                  <div className=" d-flex justify-content-center lato-bold fs-18">
                    {"- " + descuentoPendienteFormateadaApeso}
                  </div>
                </div>
              </div>
            </div>
          </section>
          <section className="container">
            <div className="row">
              <article className="col-6 col-md-6 col-lg-6 my-3">
                <h6 className="text-center lato-regular color-rojo fs-16">
                  Desc. por gestiones no realizadas
                </h6>
                <div className={darkMode ? " text-white" : " text-black "}>
                  <div className=" d-flex justify-content-center lato-bold fs-18">
                    {descuentoporgestionesFormateadaApeso}
                  </div>
                </div>
              </article>
              <article className="col-6 col-md-6 col-lg-6 my-3 ">
                <h6 className="text-center lato-regular fs-16 color-rojo">
                  Descuento Gerencia
                </h6>
                <div className={darkMode ? " text-white" : " text-black "}>
                  <div className=" d-flex justify-content-center  lato-bold fs-18">
                    {"- " + descuentoGerencialFormateadaApeso}
                  </div>
                </div>
              </article>
            </div>
          </section>

          <div className=" my-5">
            <div className="col-12 col-md-12 col-lg-12  mt-4">
              <hr className="mx-5 mt-5" />
              <h6 className="text-center lato-regular fs-18 color-rojo pt-3">
                Descuento total
              </h6>
              <div className={darkMode ? " text-white" : " text-black "}>
                <div className=" d-flex justify-content-center color-rojo  lato-bold fs-20">
                  {"-" + totalDescuento}
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>
    </>
  );
};

export default DescuentosAsesoresAnalisis;
