// import css del component
import "./ComisionesAsesoresAnalisis.css";

// import hook, librerias y context
import React, { useContext } from "react";
import { DarkModeContext } from "../../context/DarkModeContext";

// import helpers funcion para formatea los valores de string/number a peso.
import formatCurrency from "../../helpers/formatCurrency";

const ComisionesAsesoresAnalisis = ({ datos, filtro }) => {
  // context darkmode para la funcionalidad de claro/oscuro
  const { darkMode } = useContext(DarkModeContext);

  // guardo los datos enviado por el back en la variable datosParaPintar
  const datosParaPintar = datos || [];
  const {
    nivelactivacion,
    nivel2,
    comisiondebito,
    comisiondebito2,
    comision1pago,
    comision1pago2,
    comisioncredito,
    comisioncredito2,
    comisionporactivacion,
    ajustepositivo,
    totalComision,
    totalComision2,
  } = datosParaPintar;

  // empleo la funcion de los helpers para formatear cada uno de los valores
  const comisionDebitoFormateadaApeso = formatCurrency(comisiondebito);

  const comisionDebito2FormateadaApeso = formatCurrency(comisiondebito2);

  const comision1pagoFormateadaApeso = formatCurrency(comision1pago);
  const comision1pago2FormateadaApeso = formatCurrency(comision1pago2);

  const comisioncreditoFormateadaApeso = formatCurrency(comisioncredito);
  const comisioncredito2FormateadaApeso = formatCurrency(comisioncredito2);

  const comisionporactivacionFormateadaApeso = formatCurrency(
    comisionporactivacion
  );
  const totalComisionFormateadaApeso = formatCurrency(totalComision);
  const totalComision2FormateadaApeso = formatCurrency(totalComision2);

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
            <h6 className="lato-bold fs-18 mb-4">Comisiones </h6>
          </div>
          <section className="container ">
            <div className="row ">
              <article className="col-6 col-md-6 col-lg-6 my-4 ">
                <h6 className="text-center lato-regular fs-16  color-verde">
                  Nivel
                </h6>
                <div className={darkMode ? " text-white" : " text-black "}>
                  <div className=" d-flex justify-content-center  lato-bold fs-18">
                    {filtro === "activacion" ? (
                      <> {nivelactivacion}</>
                    ) : (
                      <>{nivel2}</>
                    )}
                  </div>
                </div>
              </article>
              <article className="col-6 col-md-6 col-lg-6 my-4 ">
                <h6 className="text-center lato-regular fs-16 color-verde">
                  {" "}
                  Comisión débito
                </h6>
                <div className={darkMode ? " text-white" : " text-black "}>
                  <div className=" d-flex justify-content-center  lato-bold fs-18">
                    {filtro === "activacion" ? (
                      <> {comisionDebitoFormateadaApeso}</>
                    ) : (
                      <>{comisionDebito2FormateadaApeso}</>
                    )}
                  </div>
                </div>
              </article>
              <article className="col-6 col-md-6 col-lg-6 py-2">
                <h6 className="text-center lato-regular fs-16 color-verde">
                  Comisión 1 Pago
                </h6>
                <div className={darkMode ? " text-white" : " text-black "}>
                  <div className=" d-flex justify-content-center lato-bold fs-18">
                    {filtro === "activacion" ? (
                      <> {comision1pagoFormateadaApeso}</>
                    ) : (
                      <>{comision1pago2FormateadaApeso}</>
                    )}
                  </div>
                </div>
              </article>
              <div className="col-6 col-md-6 col-lg-6 my-3">
                <h6 className="text-center lato-regular fs-16 color-verde">
                  Comisión Crédito
                </h6>
                <div className={darkMode ? " text-white" : " text-black "}>
                  <div className=" d-flex justify-content-center lato-bold fs-18">
                    {filtro === "activacion" ? (
                      <> {comisioncreditoFormateadaApeso}</>
                    ) : (
                      <>{comisioncredito2FormateadaApeso}</>
                    )}
                  </div>
                </div>
              </div>
            </div>
          </section>
          <section className="container">
            <div className="row">
              <article className="col-6 col-md-6 col-lg-6 my-3">
                <h6 className="text-center lato-regular color-verde fs-16">
                  Comisión por activación
                </h6>
                <div className={darkMode ? " text-white" : " text-black "}>
                  <div className=" d-flex justify-content-center lato-bold fs-18">
                    {comisionporactivacionFormateadaApeso === 0 || ""
                      ? "0"
                      : comisionporactivacionFormateadaApeso}
                  </div>
                </div>
              </article>
              <article className="col-6 col-md-6 col-lg-6 my-3 ">
                <h6 className="text-center lato-regular fs-16 color-verde">
                  Ajustes positivos
                </h6>
                <div className={darkMode ? " text-white" : " text-black "}>
                  <div className=" d-flex justify-content-center  lato-bold fs-18">
                    $ {ajustepositivo}
                  </div>
                </div>
              </article>
            </div>
          </section>

          <div className=" my-5">
            <div className="col-12 col-md-12 col-lg-12  mt-4">
              <hr className="mx-5 mt-5" />
              <h6 className="text-center lato-regular fs-18 color-verde pt-3">
                Subtotal sin descuentos
              </h6>
              <div className={darkMode ? " text-white" : " text-black "}>
                <div className=" d-flex justify-content-center color-verde  lato-bold fs-20">
                  {filtro === "activacion" ? (
                    <> {totalComisionFormateadaApeso}</>
                  ) : (
                    <>{totalComision2FormateadaApeso}</>
                  )}
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>
    </>
  );
};

export default ComisionesAsesoresAnalisis;
