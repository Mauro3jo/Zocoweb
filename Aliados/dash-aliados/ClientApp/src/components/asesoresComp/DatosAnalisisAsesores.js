// import context, hook y librerias
import { useContext, useState } from "react";
import { DarkModeContext } from "../../context/DarkModeContext";

// import helper funcion de formateo
import formatCurrency from "../../helpers/formatCurrency";

const DatosAnalisisAsesores = ({ datos, filtro }) => {
  // context darkmode para la funcionalidad claro/oscuro
  const { darkMode } = useContext(DarkModeContext);

  // extraigo de Datos variable enviada por el back,
  // los datos para pintar la vista.
  const datosParaPintar = datos || [];
  const {
    facturacion,
    activacion,
    totalComision,
    totalComision2,
    descuento,
    totalPorCobrar,
    totalPorCobrar2,
    totalBruto,
  } = datosParaPintar;

  const facturacionFormateadaApeso = formatCurrency(totalBruto);
  const totalComisionFormateadaApeso = formatCurrency(totalComision);
  const totalComision2FormateadaApeso = formatCurrency(totalComision2);

  const totalPorCobrarFormateadaApeso = formatCurrency(totalPorCobrar);
  const totalPorCobrar2FormateadaApeso = formatCurrency(totalPorCobrar2);

  // comision teorica
  const [comisionTeoricaIsActive, setComisionTeoricaIsActive] = useState(false);
  const totalFacturacionTeoricaFormateadaApeso = formatCurrency(facturacion);
  const totalActivacionTeoricaFormateadaApeso = formatCurrency(activacion);

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
    <section className="container">
      <div className="d-none d-lg-block">
        <section>
          <div className="d-flex justify-content-around flex-wrap">
            <article className=" py-2 ">
              <h6 className="text-center lato-bold fs-18">Facturación</h6>
              <button
                className={
                  darkMode
                    ? " text-white bg-container-data-asesores-dark border-0 quitar-cursor-pointer"
                    : " text-black bg-container-data-asesores border-0 quitar-cursor-pointer"
                }
              >
                <div className="d-flex justify-content-center border-0 lato-regular  fs-18 ">
                  {facturacionFormateadaApeso}
                </div>
              </button>
            </article>
            <article className="py-2 ">
              <h6 className="text-center lato-bold fs-18"> Comisión</h6>
              <button
                className={
                  darkMode
                    ? " color-verde bg-container-data-asesores-dark border-0 quitar-cursor-pointer"
                    : " text-black bg-container-data-asesores border-0 quitar-cursor-pointer"
                }
              >
                <div className="color-verde d-flex justify-content-center border-0 lato-regular  fs-18 ">
                  {filtro === "activacion" ? (
                    <> {totalComisionFormateadaApeso}</>
                  ) : (
                    <>{totalComision2FormateadaApeso}</>
                  )}
                </div>
              </button>
            </article>
            <article className="py-2 ">
              <h6 className="text-center lato-bold fs-18"> Descuento</h6>
              <button
                className={
                  darkMode
                    ? " color-rojo bg-container-data-asesores-dark border-0 quitar-cursor-pointer"
                    : " text-black bg-container-data-asesores border-0 quitar-cursor-pointer"
                }
              >
                <div className="color-rojo d-flex justify-content-center border-0 lato-regular  fs-18 ">
                  {"-" + totalDescuento}
                </div>
              </button>
            </article>
            <article className="py-2">
              <h6 className="text-center lato-bold fs-18">Total por cobrar</h6>
              <button
                className={
                  darkMode
                    ? " bg-container-data-asesores-dark border-0 quitar-cursor-pointer text-white"
                    : " bg-container-data-asesores border-0 quitar-cursor-pointer  text-black"
                }
              >
                <div className=" d-flex justify-content-center border-0 lato-regular  fs-18 ">
                  {filtro === "activacion" ? (
                    <> {totalPorCobrarFormateadaApeso}</>
                  ) : (
                    <>{totalPorCobrar2FormateadaApeso}</>
                  )}
                </div>
              </button>
            </article>
            <article className="py-2 ">
              <h6 className="text-center lato-bold fs-18">Comisión teórica</h6>
              <button
                className={
                  darkMode
                    ? " bg-container-data-asesores-dark border-0 quitar-cursor-pointer text-white"
                    : " bg-container-data-asesores border-0 quitar-cursor-pointer  text-black"
                }
              >
                <div className=" d-flex justify-content-center border-0 lato-regular  fs-18 ">
                  {filtro === "activacion" ? (
                    <> {totalActivacionTeoricaFormateadaApeso} </>
                  ) : (
                    <> {totalFacturacionTeoricaFormateadaApeso}</>
                  )}
                </div>
              </button>
            </article>
          </div>
        </section>
      </div>

      {/* Version Mobile  */}
      <div className="d-lg-none d-block">
        <section>
          <div className="row text-center">
            <article className="col-12 py-2">
              <h6 className="text-center lato-bold fs-18">Facturación </h6>
              <button
                className={
                  darkMode
                    ? "text-white bg-container-data-asesores-dark border-0 quitar-cursor-pointer"
                    : "text-black bg-container-data-asesores border-0 quitar-cursor-pointer"
                }
              >
                <div className=" d-flex justify-content-center border-0 lato-regular  fs-24">
                  {facturacionFormateadaApeso}
                </div>
              </button>
            </article>
          </div>
          <div>
            <div className="row">
              <article className=" col-12 col-md-6 py-2">
                <h6 className="text-center lato-bold fs-16"> Comisión</h6>
                <button
                  className={
                    darkMode
                      ? "color-verde bg-container-data-asesores-dark border-0 quitar-cursor-pointer"
                      : " bg-container-data-asesores border-0 quitar-cursor-pointer"
                  }
                >
                  <div className="color-verde d-flex justify-content-center border-0 lato-regular  fs-24">
                    {filtro === "activacion" ? (
                      <> {totalComisionFormateadaApeso}</>
                    ) : (
                      <>{totalComision2FormateadaApeso}</>
                    )}
                  </div>
                </button>
              </article>
              <article className="col-12 col-md-6 py-2">
                <h6 className="text-center lato-bold fs-16"> Descuento</h6>
                <button
                  className={
                    darkMode
                      ? "color-rojo bg-container-data-asesores-dark border-0 quitar-cursor-pointer"
                      : " bg-container-data-asesores border-0 quitar-cursor-pointer"
                  }
                >
                  <div className="color-rojo d-flex justify-content-center border-0 lato-regular  fs-24">
                    {"-" + totalDescuento}
                  </div>
                </button>
              </article>

              <article className="col-md-6 py-2">
                <h6 className="text-center lato-bold fs-16">
                  Total por cobrar
                </h6>
                <button
                  className={
                    darkMode
                      ? "text-white  bg-container-data-asesores-dark border-0 quitar-cursor-pointer"
                      : " bg-container-data-asesores border-0 quitar-cursor-pointer text-black"
                  }
                >
                  <div className="d-flex justify-content-center border-0 lato-regular  fs-24">
                    {filtro === "activacion" ? (
                      <> {totalPorCobrarFormateadaApeso}</>
                    ) : (
                      <>{totalPorCobrar2FormateadaApeso}</>
                    )}
                  </div>
                </button>
              </article>
              <article className=" col-md-6 py-2">
                <h6 className="text-center lato-bold fs-16">
                  Comisión teórica{" "}
                </h6>
                <button
                  className={
                    darkMode
                      ? "text-white  bg-container-data-asesores-dark border-0 quitar-cursor-pointer"
                      : " bg-container-data-asesores border-0 quitar-cursor-pointer text-black"
                  }
                >
                  <div className=" d-flex justify-content-center border-0 lato-regular fs-24">
                    {filtro === "activacion" ? (
                      <> {totalActivacionTeoricaFormateadaApeso} </>
                    ) : (
                      <> {totalFacturacionTeoricaFormateadaApeso}</>
                    )}
                  </div>
                </button>
              </article>
            </div>
          </div>
        </section>
      </div>
    </section>
  );
};

export default DatosAnalisisAsesores;
