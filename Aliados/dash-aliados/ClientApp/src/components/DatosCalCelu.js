import { faArrowRightArrowLeft } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { useContext, useState } from "react";
import { Controller, useForm } from "react-hook-form";
import { DarkModeContext } from "../context/DarkModeContext";
import { Form } from "react-bootstrap";
import Select from "react-select";

const optionsTarjeta = [
  { value: "Tarjeta 1", label: "Tarjeta 1" },
  { value: "Tarjeta 2", label: "Tarjeta 2" },
  { value: "Tarjeta 3", label: "Tarjeta 3" },
  { value: "Tarjeta 4", label: "Tarjeta 4" },
];

const DatosCalCelu = () => {
  const [datosCapturadosCalculadora, setDatosCapturadosCalculadora] = useState(
    {}
  );
  const { control, handleSubmit, register } = useForm();

  const onSubmit = (datos) => {
    setDatosCapturadosCalculadora(datos);
  };

  const { darkMode } = useContext(DarkModeContext);
  const [neto, setNeto] = useState("");
  const [bruto, setBruto] = useState(Math.trunc(neto * 1.1));
  const [esMontoA, setEsMontoA] = useState(true);
  const intercambiarValores = () => {
    setEsMontoA(!esMontoA);
  };

  const handleNetoChange = (e) => {
    const newNeto = e.target.value;
    setNeto(newNeto);
    const newBruto = Math.trunc(newNeto * 1.1);
    setBruto(newBruto);
  };

  const [isSearchable, setIsSearchable] = useState(true);
  const [selectedTarjeta, setSelectedTarjeta] = useState(null);

  return (
    <div>
      <article>
        <div className=" mt-4">
          <form className="container" onSubmit={handleSubmit(onSubmit)}>
            {esMontoA ? (
              <section>
                <div className="d-flex justify-content-center">
                  <article className="">
                    <div className="">
                      <h6 className="text-center lato-bold fs-17"> Neto</h6>
                      <div className=" d-flex justify-content-center border-0">
                        <input
                          id="miid"
                          className={
                            darkMode
                              ? "form-control ingresar-neto-dark px-5 border-0 text-white "
                              : "form-control ingresar-neto px-5 border-0"
                          }
                          type="number"
                          placeholder="Ingresa el monto"
                          aria-label="Search"
                          {...register("netoBuscar", {})}
                          value={neto}
                          onChange={handleNetoChange}
                        />
                      </div>
                    </div>
                  </article>
                </div>
                <article className="d-flex justify-content-center my-2">
                  <div className="">
                    <button
                      onClick={intercambiarValores}
                      className={
                        darkMode
                          ? "border-0 btn-transparent"
                          : "border-0 btn-transparent"
                      }
                    >
                      <FontAwesomeIcon
                        className="color-verde fs-5"
                        icon={faArrowRightArrowLeft}
                      />
                    </button>
                    <div className="my-3">
                      <h5 className="lato-bold  fs-4">=</h5>
                    </div>
                  </div>
                </article>
                <article className="">
                  <h6 className="text-center lato-bold fs-17"> Bruto</h6>
                  <div className="d-flex justify-content-center">
                    <button
                      className={
                        darkMode
                          ? " ingresar-neto-dark border-0 quitar-cursor-pointer"
                          : "ingresar-neto border-0 quitar-cursor-pointer"
                      }
                    >
                      <div className=" d-flex justify-content-center border-0">
                        <input
                          id="miid"
                          className={
                            darkMode
                              ? "form-control ingresar-neto-dark px-5 border-0 text-white "
                              : "form-control ingresar-neto px-5 border-0"
                          }
                          type="number"
                          placeholder="Ingresa el monto"
                          disabled
                          aria-label="Search"
                          {...register("brutoBuscar", {})}
                          value={bruto}
                          onChange={handleNetoChange}
                        />
                      </div>
                    </button>
                  </div>
                </article>
              </section>
            ) : (
              <section>
                <div className="d-flex justify-content-center">
                  <article className="">
                    <h6 className="text-center lato-bold fs-17"> Bruto </h6>
                    <div className="d-flex justify-content-center">
                      <button
                        className={
                          darkMode
                            ? " ingresar-neto-dark border-0 quitar-cursor-pointer"
                            : "ingresar-neto border-0 quitar-cursor-pointer"
                        }
                      >
                        <div className=" d-flex justify-content-center border-0">
                          <input
                            id="miid"
                            className={
                              darkMode
                                ? "form-control ingresar-neto-dark px-5 border-0 text-white "
                                : "form-control ingresar-neto px-5 border-0"
                            }
                            type="number"
                            placeholder="Ingresa el monto"
                            disabled
                            aria-label="Search"
                            {...register("brutoBuscar", {})}
                            value={bruto}
                            onChange={handleNetoChange}
                          />
                        </div>
                      </button>
                    </div>
                  </article>
                </div>
                <article className="d-flex justify-content-center my-2">
                  <div className="">
                    <button
                      onClick={intercambiarValores}
                      className={
                        darkMode
                          ? "border-0 btn-transparent"
                          : "border-0 btn-transparent"
                      }
                    >
                      <FontAwesomeIcon
                        className="color-verde fs-5"
                        icon={faArrowRightArrowLeft}
                      />
                    </button>
                    <div className="my-3">
                      <h5 className="lato-bold  fs-4">=</h5>
                    </div>
                  </div>
                </article>
                <div className="d-flex justify-content-center">
                  <article className="">
                    <div className="">
                      <h6 className="text-center lato-bold fs-17"> Neto</h6>
                      <div className=" d-flex justify-content-center border-0">
                        <input
                          id="miid"
                          className={
                            darkMode
                              ? "form-control ingresar-neto-dark px-5 border-0 text-white "
                              : "form-control ingresar-neto px-5 border-0"
                          }
                          type="number"
                          placeholder="Ingresa el monto"
                          aria-label="Search"
                          {...register("netoBuscar", {})}
                          value={neto}
                          onChange={handleNetoChange}
                        />
                      </div>
                    </div>
                  </article>
                </div>
              </section>
            )}
            <article className="d-flex justify-content-center ">
              <div className="py-2 text-center">
                <div className="d-flex pt-5">
                  <div className="form-check me-5">
                    <input
                      className="form-check-input"
                      type="radio"
                      name="flexRadioDefault1"
                      id="flexRadioDefault1"
                      value="Debito"
                      defaultChecked
                      {...register("radio")}
                    />
                    <label
                      className="form-check-label lato-bold fs-16"
                      htmlFor="flexRadioDefault1"
                    >
                      Débito
                    </label>
                  </div>
                  <div className="form-check">
                    <input
                      className="form-check-input"
                      type="radio"
                      name="flexRadioDefault1"
                      id="flexRadioDefault2"
                      value="Credito"
                      {...register("radio")}
                    />
                    <label
                      className="form-check-label lato-bold fs-16"
                      htmlFor="flexRadioDefault2"
                    >
                      Crédito
                    </label>
                  </div>
                </div>
              </div>
            </article>
            <article className="my-3 ">
              <div className="text-center">
                <label
                  htmlFor="exampleFormControlInput1"
                  className="lato-bold fs-16"
                >
                  Tarjeta
                </label>
              </div>
              <div className="d-flex justify-content-center">
                <Select
                  value={selectedTarjeta}
                  defaultInputValue={"Todos"}
                  className="w-75 lato-bold"
                  classNamePrefix="select"
                  isSearchable={isSearchable}
                  name="tarjeta"
                  options={optionsTarjeta}
                  onChange={(selectedOption) =>
                    setSelectedTarjeta(selectedOption)
                  }
                  styles={{
                    control: (base) => ({
                      ...base,
                      textAlign: "center",
                    }),
                  }}
                />
              </div>
            </article>
            <div className="pt-2">
              <div className="d-flex justify-content-center">
                <button className="btn-calculadora border-0" type="submit">
                  <div className=" d-flex justify-content-center border-0">
                    <span className="text-white lato-bold fs-16">
                      {" "}
                      Calcular
                    </span>
                  </div>
                </button>
              </div>
            </div>
          </form>
        </div>
      </article>
    </div>
  );
};

export default DatosCalCelu;
