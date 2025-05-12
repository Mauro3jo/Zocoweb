import { useContext, useState } from "react";
import { DarkModeContext } from "../../context/DarkModeContext";
import Select from "react-select";
import formaPesos from "../../helpers/formaPeso";

const DatosInicioAsesores = ({ datos }) => {
  const { darkMode } = useContext(DarkModeContext);
  const Descuento = datos?.descuento || "0";
  const descuentoFormateado = formaPesos(Descuento);
  const TotalComision = datos?.totalComision || "0";
  const TotalComisionFormateado = formaPesos(TotalComision);

  const TotalComision2 = datos?.totalComision2 || "0";
  const TotalComision2Formateado = formaPesos(TotalComision2);

  const TotalPorCobrar = datos?.totalPorCobrar || "0";
  const TotalPorCobrarFormateado = formaPesos(TotalPorCobrar);
  const totalPorCobrar2 = datos?.totalPorCobrar2 || "0";
  const totalPorCobrar2Formateado = formaPesos(totalPorCobrar2);

  const Activacion = datos?.activacion || "0";
  const ActivacionFormateado = formaPesos(Activacion);
  const Facturacion = datos?.facturacion || "0";
  const FacturacionFormateado = formaPesos(Facturacion);
  const [filtro, setFiltro] = useState("activacion"); // consultar

  // Opciones para el Select
  const options = [
    { value: "activacion", label: "Activación" },
    { value: "facturacion", label: "Facturación" },
  ];

  return (
    <section className="container">
      <section className="pb-4 d-flex justify-content-end">
        <div>
          <label className="lato-bold fs-16" htmlFor="tipoPago">
            Objetivo:
          </label>
          <Select
            className=" 
            select__control_custom-inicio lato-regular"
            classNamePrefix="select"
            value={options.find((option) => option.value === filtro)}
            onChange={(selectedOption) => setFiltro(selectedOption.value)}
            options={options}
          />
        </div>
      </section>
      <section>
        <div className="row">
          <article className="col-12 col-md-6 col-lg-3  py-2">
            <h6 className="text-center lato-bold fs-17 "> Comisión</h6>
            <button
              className={
                darkMode
                  ? " bg-data-dark border-0 quitar-cursor-pointer color-verde"
                  : "container-light bg-data  border-0 quitar-cursor-pointer color-verde"
              }
            >
              <div className=" d-flex justify-content-center lato-regular border-0 fs-22 color-verde">
                {filtro === "activacion" ? (
                  <> {TotalComisionFormateado}</>
                ) : (
                  <>{TotalComision2Formateado}</>
                )}
              </div>
            </button>
          </article>
          <article className="col-12 col-md-6 col-lg-3  py-2">
            <h6 className="text-center lato-bold  fs-17"> Descuento</h6>
            <button
              className={
                darkMode
                  ? " bg-data-dark border-0 quitar-cursor-pointer   color-rojo"
                  : "container-light bg-data  border-0 quitar-cursor-pointer r  color-rojo"
              }
            >
              <div className=" d-flex justify-content-center  border-0 lato-regular fs-22 color-rojo">
                {descuentoFormateado}
              </div>
            </button>
          </article>
          <article className="col-12 col-md-6 col-lg-3  py-2">
            <h6 className="text-center lato-bold fs-17"> Total por cobrar</h6>
            <button
              className={
                darkMode
                  ? " bg-data-dark border-0 quitar-cursor-pointer"
                  : "container-light bg-data  border-0 quitar-cursor-pointer"
              }
            >
              <div className=" d-flex justify-content-center border-0 lato-regular  fs-22">
                {filtro === "activacion" ? (
                  <> {TotalPorCobrarFormateado}</>
                ) : (
                  <>{totalPorCobrar2Formateado}</>
                )}
              </div>
            </button>
          </article>
          <article className="col-12 col-md-6 col-lg-3  py-2">
            <h6 className="text-center lato-bold fs-17 "> Comisión teórica</h6>
            <button
              className={
                darkMode
                  ? " bg-data-dark border-0 quitar-cursor-pointer"
                  : "container-light bg-data  border-0 quitar-cursor-pointer"
              }
            >
              <div className=" d-flex justify-content-center border-0 lato-regular  fs-22">
                {filtro === "activacion" ? (
                  <> {ActivacionFormateado}</>
                ) : (
                  <>{FacturacionFormateado}</>
                )}
              </div>
            </button>
          </article>
        </div>
      </section>
    </section>
  );
};

export default DatosInicioAsesores;
