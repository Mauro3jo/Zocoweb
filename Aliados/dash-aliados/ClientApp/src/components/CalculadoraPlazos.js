import { faCircleExclamation } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import React, { useContext, useState } from "react";
import { useForm, Controller } from "react-hook-form";
import Select from "react-select";
import { DarkModeContext } from "../context/DarkModeContext";

const CalculadoraPlazos = () => {
  const { handleSubmit, control, register } = useForm();
  const [selectedTipo, setSelectedTipo] = useState("");
  const [plazoData, setPlazoData] = useState(null); // Estado para almacenar la respuesta del servidor

  const tipoOptions = [
    { value: "Debito", label: "Débito" },
    { value: "Alimentar", label: "Alimentar" },
    { value: "Credito1Pago", label: "Crédito 1 Pago" },
    { value: "Credito2Pago", label: "Crédito 2 o más Pagos" },
    { value: "CreditoCuotaSimple", label: "Crédito Cuota Simple" },
    { value: "Naranja", label: "Naranja" },
  ];

  const tarjetasPorTipo = {
    Debito: [
      { value: "Maestro/Electron Visa", label: "Bancarizada" },
      { value: "MC Debit/Visa Debit", label: "Billetera virtual" },
    ],
    Alimentar: [
      {
        value: "Banco Nación/Provinciales",
        label: "Banco Nación/Provinciales",
      },
    ],
    Credito1Pago: [
      { value: "Bancarizadas", label: "Bancarizadas" },
      { value: "No bancarizadas", label: "No bancarizadas" },
      { value: "Recargables", label: "Recargables" },
    ],
    Credito2Pago: [
      { value: "Bancarizadas", label: "Bancarizadas" },
      { value: "No bancarizadas", label: "No bancarizadas" },
    ],
    CreditoCuotaSimple: [{ value: "Bancarizadas", label: "Bancarizadas" }],
    Naranja: [{ value: "Naranja", label: "Naranja" }],
  };

  const onSubmit = async (data) => {
    const finalData = {
      fecha: data.fecha,
      tipo: data.tipo.value,
      tarjeta: data.tarjeta.value,
    };
    const response = await fetch("/api/calculadora/plazos", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(finalData),
    });
    if (response.ok) {
      const responseData = await response.json();
      setPlazoData(responseData);
    } else {
      console.error("Error al enviar datos:", response.statusText);
    }
  };

  // context darkMode para la funcionalidad claro/oscuro.
  const { darkMode } = useContext(DarkModeContext);

  return (
    <section className="container">
      <div className="row">
        <article className="col-lg-7">
          <form
            className={
              darkMode
                ? " carta-calculadora-dark py-5 px-5"
                : " carta-calculadora py-5 px-5"
            }
            onSubmit={handleSubmit(onSubmit)}
          >
            <section className="container">
              <label htmlFor="fecha" className="lato-bold fs-16 my-2">
                Fecha
              </label>
              <input
                id="fecha"
                className="input-ingresar-fecha-simulador form-control px-5 border-0"
                type="text"
                placeholder="DD/MM/YYYY"
                minLength="10"
                maxLength="10"
                {...register("fecha")}
                required
              />
            </section>
            <section className="d-flex justify-content-between flex-wrap container">
              <article className="my-3">
                <label htmlFor="tipo" className="lato-bold fs-16 ms-3">
                  Tipo
                </label>
                <Controller
                  name="tipo"
                  control={control}
                  render={({ field }) => (
                    <Select
                      {...field}
                      options={tipoOptions}
                      className="select__control_custom lato-bold"
                      classNamePrefix="select"
                      isSearchable={false}
                      required
                      onChange={(selectedOption) => {
                        field.onChange(selectedOption);
                        setSelectedTipo(selectedOption?.value);
                      }}
                    />
                  )}
                />
              </article>
              <article className="my-3">
                <label htmlFor="tarjeta" className="lato-bold fs-16 ms-3">
                  Tarjeta
                </label>
                <Controller
                  name="tarjeta"
                  control={control}
                  render={({ field }) => (
                    <Select
                      {...field}
                      options={tarjetasPorTipo[selectedTipo] || []}
                      className="select__control_custom lato-bold"
                      classNamePrefix="select"
                      isSearchable={false}
                      required
                      onChange={(selectedOption) =>
                        field.onChange(selectedOption)
                      }
                    />
                  )}
                />
              </article>
            </section>
            <div className="pt-4 d-flex justify-content-center container">
              <button
                className="btn-calculadora2 text-white border-0"
                type="submit"
              >
                Calcular
              </button>
            </div>
            <div className="pt-2 container">
              <h6 className="fs-14 lato-regular">
                <FontAwesomeIcon icon={faCircleExclamation} /> Primero ingresá
                la fecha en formato Día/Mes/Año, luego seleccioná el tipo de
                pago y la Tarjeta.
              </h6>
            </div>
          </form>
        </article>
        <article className="col-lg-5">
          <div
            className={
              darkMode
                ? "carta-calculadora-resultados-dark py-4"
                : "carta-calculadora-resultados py-4"
            }
          >
            {plazoData ? (
              <section className="pt-2 mx-4">
                {Object.entries(plazoData.resultado)
                  .filter(
                    ([key, value]) => key.startsWith("tieneDetalles") && value
                  )
                  .map(([key, _]) => {
                    const match = key.match(/(\d+Hs|\d+Dias|Naranja)/);
                    const timeFrame = match ? match[0] : null;
                    if (
                      !timeFrame ||
                      plazoData.resultado[`nuevaFecha${timeFrame}`] === null
                    )
                      return null;

                    return (
                      <div key={key}>
                        <h6 className=" fs-16 text-center">
                          Voy a recibir el pago el
                        </h6>
                        <h6 className="color-verde fs-24 text-center pb-4">
                          {plazoData.resultado[`nuevaFecha${timeFrame}`]}
                        </h6>
                        <div className="row">
                          <div className="col-6">
                            <h6 className="fs-16"> Tipo de tarjeta</h6>
                            <h6 className="fs-14 lato-bold">
                              {plazoData.resultado.tarjeta}
                            </h6>
                            <h6 className="fs-14">
                              {plazoData.resultado[`detalles${timeFrame}`]}
                            </h6>
                          </div>
                          <div className="col-6">
                            <h6 className="fs-16"> Plazo</h6>
                            <h6 className="color-verde fs-14">
                              {" "}
                              {plazoData.resultado[`detalle${timeFrame}`]}
                            </h6>
                          </div>
                        </div>
                      </div>
                    );
                  })}
                {plazoData && (
                  <div className="pt-5">
                    <h6 className="fs-14 lato-regular">
                      <FontAwesomeIcon
                        icon={faCircleExclamation}
                        className="color-rojo me-2"
                      />
                      En caso de feriado o día no hábil, el pago es diferido al
                      siguiente día hábil.
                    </h6>
                  </div>
                )}
              </section>
            ) : (
              <>
                <div className="centrado ">
                  <h6 className="fs-14">
                    {" "}
                    Ingrese los datos para visualizar el resultado
                  </h6>
                </div>
              </>
            )}
          </div>
        </article>
      </div>
    </section>
  );
};

export default CalculadoraPlazos;
