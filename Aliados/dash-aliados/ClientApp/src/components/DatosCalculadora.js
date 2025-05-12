import { faArrowRightArrowLeft } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { useContext, useState } from "react";
import { Controller, useForm } from "react-hook-form";
import { DarkModeContext } from "../context/DarkModeContext";
// import Select from "react-select";
import { Form } from "react-bootstrap";

const DatosCalculadora = () => {
  const [datosCapturadosCalculadora, setDatosCapturadosCalculadora] = useState(
    {}
  );
  const { control, handleSubmit, register } = useForm();

  const onSubmit = (datos) => {
    setDatosCapturadosCalculadora(datos);
  };

  const { darkMode } = useContext(DarkModeContext);
  const [neto, setNeto] = useState(1000);
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

  return (
    <section>
      <article className=" d-none d-xl-block">
        <form
          className="d-flex justify-content-between flex-wrap container"
          onSubmit={handleSubmit(onSubmit)}
        >
          {esMontoA ? (
            <div className="d-flex">
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

              <div className="mx-3">
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

              <article className="">
                <h6 className="text-center lato-bold fs-17"> Bruto</h6>
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
                      aria-label="Search"
                      {...register("brutoBuscar", {})}
                      value={bruto}
                      onChange={handleNetoChange}
                    />
                  </div>
                </button>
              </article>
            </div>
          ) : (
            <div className="d-flex">
              <article className="">
                <h6 className="text-center lato-bold fs-17"> Bruto</h6>
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
                      aria-label="Search"
                      {...register("brutoBuscar", {})}
                      value={bruto}
                      onChange={handleNetoChange}
                    />
                  </div>
                </button>
              </article>
              <div className="mx-3">
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

              <article className="">
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
                    disabled
                    placeholder="Ingresa el monto"
                    aria-label="Search"
                    {...register("netoBuscar", {})}
                    value={neto}
                    onChange={handleNetoChange}
                  />
                </div>
              </article>
            </div>
          )}
          <div className="d-flex pt-5 ">
            <div className="form-check me-4 ">
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
                for="flexRadioDefault1"
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
                for="flexRadioDefault2"
              >
                Crédito
              </label>
            </div>
          </div>
          <article className="my-3">
            <label
              htmlFor="exampleFormControlInput1"
              className="lato-bold fs-16 ms-3 "
            >
              Tarjetas
            </label>
            <div
              className="d-flex justify-content-center "
              style={{ width: "200px" }}
            >
              <Controller
                name="mySelect"
                control={control}
                render={({ field }) => (
                  <Form.Select {...field} aria-label="Default select example">
                    <option value="Tarjeta 1">Tarjeta 1</option>
                    <option value="Tarjeta 2">Tarjeta 2</option>
                    <option value="Tarjeta 3">Tarjeta 3</option>
                  </Form.Select>
                )}
              />
            </div>
          </article>
          <div className="pt-4">
            <button
              className="btn-calculadora text-white border-0"
              type="submit"
            >
              <div className="d-flex justify-content-center border-0">
                <span className="text-white lato-bold fs-18"> Calcular</span>
              </div>
            </button>
          </div>
        </form>
      </article>

      {/*  tablet */}
      <article className="d-xl-none d-block">
        <div className="d-none d-md-block  mt-4">
          <form onSubmit={handleSubmit(onSubmit)}>
            {esMontoA ? (
              <div>
                <article className="container d-flex flex-wrap justify-content-center">
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

                  <article className="">
                    <h6 className="text-center lato-bolsd fs-17"> Bruto</h6>
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
                          aria-label="Search"
                          {...register("brutoBuscar", {})}
                          value={bruto}
                          onChange={handleNetoChange}
                        />
                      </div>
                    </button>
                  </article>
                </article>
              </div>
            ) : (
              <div>
                <article className="container d-flex flex-wrap justify-content-center">
                  <article className="">
                    <h6 className="text-center lato-bolsd fs-17"> Bruto</h6>
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
                          aria-label="Search"
                          {...register("brutoBuscar", {})}
                          value={bruto}
                          onChange={handleNetoChange}
                        />
                      </div>
                    </button>
                  </article>
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

                  <article className="">
                    <h6 className="text-center lato-bold fs-17">Neto</h6>
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
                          aria-label="Search"
                          {...register("netoBuscar", {})}
                          value={neto}
                          onChange={handleNetoChange}
                        />
                      </div>
                    </button>
                  </article>
                </article>
              </div>
            )}

            <article className="container d-flex flex-wrap justify-content-center">
              <div className="py-2">
                <div className="d-flex my-4 pt-2 ">
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
              <div className="mx-1 my-2 ocultar-div">
                <div className="mx-1 my-2">
                  <button
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
              </div>
              <article className="my-2">
                <label
                  htmlFor="exampleFormControlInput1"
                  className="lato-bold fs-16 ms-3 "
                >
                  Tarjetas
                </label>
                <div
                  className="d-flex justify-content-center "
                  style={{ width: "200px" }}
                >
                  <Controller
                    name="mySelect"
                    control={control}
                    render={({ field }) => (
                      <Form.Select
                        {...field}
                        aria-label="Default select example"
                      >
                        <option value="Tarjeta 1">Tarjeta 1</option>
                        <option value="Tarjeta 2">Tarjeta 2</option>
                        <option value="Tarjeta 3">Tarjeta 3</option>
                      </Form.Select>
                    )}
                  />
                </div>
              </article>
            </article>
            <div className="">
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

        {/* celular */}
        <div className="d-md-none d-block mt-5">
          <form onSubmit={handleSubmit(onSubmit)}>
            {esMontoA ? (
              <div>
                <article className="container">
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
                        />{" "}
                      </button>
                      <div className="d-flex justify-content-center">
                        <h5 className="lato-bold fs-5">=</h5>
                      </div>
                    </div>
                  </article>
                  <article>
                    <h6 className="text-center lato-bolsd fs-17"> Bruto</h6>
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
                            aria-label="Search"
                            {...register("brutoBuscar", {})}
                            value={bruto}
                            onChange={handleNetoChange}
                          />
                        </div>
                      </button>
                    </div>
                  </article>
                </article>
              </div>
            ) : (
              <div>
                <article>
                  <h6 className="text-center lato-bolsd fs-17"> Bruto</h6>
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
                          aria-label="Search"
                          {...register("brutoBuscar", {})}
                          value={bruto}
                          onChange={handleNetoChange}
                        />
                      </div>
                    </button>
                  </div>
                </article>
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
                      />{" "}
                    </button>
                    <div className="d-flex justify-content-center">
                      <h5 className="lato-bold fs-5">=</h5>
                    </div>
                  </div>
                </article>
                <article className="container">
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
            <div className="text-center mt-2">
              <label
                htmlFor="exampleFormControlInput1"
                className="lato-bold fs-16 ms-3 "
              >
                Tarjetas
              </label>
              <article className="my-3 d-flex justify-content-center">
                <div className=" " style={{ width: "200px" }}>
                  <Controller
                    name="mySelect"
                    control={control}
                    render={({ field }) => (
                      <Form.Select
                        {...field}
                        aria-label="Default select example"
                      >
                        <option value="Tarjeta 1">Tarjeta 1</option>
                        <option value="Tarjeta 2">Tarjeta 2</option>
                        <option value="Tarjeta 3">Tarjeta 3</option>
                      </Form.Select>
                    )}
                  />
                </div>
              </article>
            </div>
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
    </section>
  );
};

export default DatosCalculadora;
