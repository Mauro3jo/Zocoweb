// import css
import "./CuadroComparativo.css";

// import hooks,librerias y context
import React, { useContext, useEffect, useState } from "react";
import { DarkModeContext } from "../../context/DarkModeContext";
import { Image } from "react-bootstrap";
import Select from "react-select";

// import helpers formatear a pesos
import formaPesos from "../../helpers/formaPeso";

// assets
import zoco from "../../assets/img/Zoco.png";
import zocoDM from "../../assets/img/zocoDM.png";

// iconos
import iconoPayway from "../../assets/img/logopayway.png";
import iconoMP from "../../assets/img/logomp.png";
import iconoGetnet from "../../assets/img/logogetnet.png";
import iconoNX from "../../assets/img/logonx.png";
import iconoViumi from "../../assets/img/logoviumi.png";

// imagenes cuadro celular
import cuadroCelPayway from "../../assets/img/cuadroCelPayway.png";
import cuadroCelMP from "../../assets/img/cuadroCelMP.png";
import cuadroCelNX from "../../assets/img/cuadroCelNX.png";
import cuadroCelGetnet from "../../assets/img/cuadroCelGetnet.png";
import cuadroCelViumi from "../../assets/img/cuadroCelViumi.png";
import TablaPayway from "./TablaPayway";
import TablaMP from "./TablaMP";
import TablaNaranja from "./TablaNaranja";
import TablaGetnet from "./TablaGetnet";
import TablaViumi from "./TablaViumi";

const CuadroComparativo = () => {
  // darkmode context para la funcionalidad claro/oscuro
  const { darkMode } = useContext(DarkModeContext);

  // estado iniciales para cuadro comparativo
  const [zocoReward, setZocoReward] = useState("1");
  const [monto, setMonto] = useState("");
  const [terminales, setTerminales] = useState("1");
  const [tipoPago, setTipoPago] = useState("credito");
  const [cuota, setCuota] = useState("1");
  const [competencia, setCompetencia] = useState("payway");
  const [isDisabled, setIsDisabled] = useState(true);
  const [datosInicio, setDatosInicio] = useState(null);
  const [resultadoCalculadora, setResultadoCalculadora] = useState(null);

  // funcion para tirar el porcentaje de los valores pasado por parametro
  const formatPercentage = (percentage) => {
    // Redondear el porcentaje a 2 decimales
    const roundedPercentage = parseFloat(percentage).toFixed(2);
    return roundedPercentage;
  };

  // elementos extraido del resultadoCalculadora
  let { costopaywey, poraniopaywey, poraniozoco, porcentaje, pormes } =
    resultadoCalculadora || [];

  // funcion pra formatear pesos
  const costopayweyFormateado = formaPesos(costopaywey);
  const poraniopayweyFormateado = formaPesos(poraniopaywey);
  const porcentajeRedondeado = formatPercentage(porcentaje);
  const pormeszocoFormateado = formaPesos(pormes);
  const poraniozocoFormateado = formaPesos(poraniozoco);

  useEffect(() => {
    // Habilitar o deshabilitar los campos basado en si se ha ingresado un monto
    setIsDisabled(!monto);

    // Si todos los campos necesarios están llenos, enviar el formulario automáticamente
    if (monto && terminales && tipoPago && competencia) {
      handleSubmit();
    }
  }, [zocoReward, monto, terminales, tipoPago, competencia]);

  const handleMontoChange = (e) => {
    let inputValue = e.target.value.toString();
    // Limitar a 10 caracteres si excede
    if (inputValue.length > 10) {
      inputValue = inputValue.slice(0, 10);
    }
    setMonto(inputValue);
  };

  const handleTerminalesChange = (e) => {
    let inputValue = e.target.value.toString();
    // Limitar a 3 caracteres si excede
    if (inputValue.length > 3) {
      inputValue = inputValue.slice(0, 3);
    }
    setTerminales(inputValue);
  };

  // Handler for form submission
  const handleSubmit = (e) => {
    console.log(zocoReward, monto, terminales, tipoPago, competencia);
  };

  useEffect(() => {
    const fetchData = async () => {
      const token = sessionStorage.getItem("token");

      if (!token) {
        console.error("No hay token disponible");
        return;
      }

      try {
        // Segunda llamada para la calculadora
        const responseCalculadora = await fetch(
          "/api/calculadora/calculadora",
          {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
            },
            body: JSON.stringify({
              Zoco: zocoReward.value || "1",
              Monto: monto || "0",
              Terminales: terminales || "0",
              TipoPago: tipoPago || "debito",
              Competencia: competencia || "payway",
              Cuota: cuota || "0",
              Token: token,
            }),
          }
        );

        if (responseCalculadora.ok) {
          const dataCalculadora = await responseCalculadora.json();
          setResultadoCalculadora(dataCalculadora);
        } else {
          if (responseCalculadora.status === 401) {
            console.error("Acceso no autorizado para calculadora");
          } else {
            throw new Error("Error en la solicitud de datos de calculadora");
          }
        }
      } catch (error) {
        console.error("Error al obtener los datos:", error);
      }
    };

    fetchData();
  }, [zocoReward, monto, tipoPago, cuota, competencia, terminales]);

  // Definir los estilos personalizados
  const customStyles = {
    control: (provided, state) => ({
      ...provided,
      border: "1px solid #ced4da", // Cambia el borde del control
      borderRadius: "0.25rem", // Cambia el radio de borde del control
      boxShadow: state.isFocused
        ? "0 0 0 0.2rem rgba(0, 123, 255, 0.25)"
        : null, // Agrega una sombra al enfocar el control
      "&:hover": {
        borderColor: "#80bdff", // Cambia el color del borde al pasar el mouse
      },
    }),
  };

  // MUESTRA LOS VALUE DE TIPO DE PAGO
  const tipoLabelSelectTipoPago = () => {
    if (tipoPago === "credito") {
      return "Crédito";
    } else {
      return "Débito";
    }
  };

  // MUESTRA LOS VALUE DE LOS SELECT COMPENTENCIA
  const tipoLabelSelectCompentencia = () => {
    switch (competencia) {
      case "payway":
        return "PayWay";
      case "mercadopago":
        return "MercadoPago";
      case "naranjax":
        return "Naranja X"; // Nueva opción añadida
      case "getnet":
        return "Getnet"; // Nueva opción añadida
      case "viumi":
        return "Viumi"; // Nueva opción añadida
      default:
        return ""; // Un valor por defecto si fuera necesario
    }
  };

  // CAMBIA LOS ICONOS DE LA COMPETENCIA
  const cambiarImagenesCompentencia = () => {
    switch (competencia) {
      case "payway":
        return darkMode ? (
          <Image className="w-50" src={iconoPayway} fluid />
        ) : (
          <Image className="w-50" src={iconoPayway} fluid />
        );
      case "mercadopago":
        return <Image className="w-50" src={iconoMP} fluid />;
      case "naranjax":
        return <Image className="w-50" src={iconoNX} fluid />; // Añade la imagen correspondiente para Naranja X
      case "getnet":
        return <Image className="w-50" src={iconoGetnet} fluid />; // Añade la imagen correspondiente para Getnet
      case "viumi":
        return <Image className="w-50" src={iconoViumi} fluid />; // Añade la imagen correspondiente para Getnet
      default:
        return null;
    }
  };

  // CAMBIA LA IMAGEN DE LA COMPARATIVA
  const cambiarImagenesComparativa = () => {
    switch (competencia) {
      case "payway":
        return (
          <>
            <TablaPayway />
          </>
        );
      case "mercadopago":
        return (
          <>
            <TablaMP />
          </>
        );
      case "naranjax":
        return (
          <>
            <TablaNaranja />
          </>
        );
      case "getnet":
        return (
          <>
            <TablaGetnet />
          </>
        );
      case "viumi":
        return (
          <>
            <TablaViumi />
          </>
        );
      default:
        return null;
    }
  };

  // CAMBIA LOS COSTOS Y AHORROS
  const costoTerminales = () => {
    switch (competencia) {
      case "payway":
        return (
          <>
            <h6 className="text-center pb-2">
              Costo de terminales de {tipoLabelSelectCompentencia()}
            </h6>
            <div
              className={
                darkMode
                  ? "py-4  contenedor-panel-control-asesores-modo-oscuro container d-none d-xl-block"
                  : "py-4  contenedor-panel-control-asesores-2 container d-none d-xl-block"
              }
            >
              <div className="d-flex justify-content-evenly ">
                <article>
                  <div className="mx-5 text-center">
                    <h6
                      className={
                        darkMode ? "fs-12  text-white" : "fs-12  text-black-50"
                      }
                    >
                      Por mes{" "}
                    </h6>
                    <h6 className="fs-14 lato-bold">{costopayweyFormateado}</h6>
                  </div>
                </article>
                <article className="borde-caja-panel-1"></article>
                <article>
                  <div className="mx-5 text-center">
                    <h6
                      className={
                        darkMode ? "fs-12  text-white" : "fs-12  text-black-50"
                      }
                    >
                      Por 12 meses{" "}
                    </h6>
                    <h6 className="fs-14 lato-bold">
                      {poraniopayweyFormateado}
                    </h6>
                  </div>
                </article>
              </div>
            </div>
          </>
        );
      case "mercadopago":
        return (
          <>
            <h6 className="text-center pb-2">
              Costo de terminales de {tipoLabelSelectCompentencia()}
            </h6>
            <div
              className={
                darkMode
                  ? "py-4  contenedor-panel-control-asesores-modo-oscuro container d-none d-xl-block"
                  : "py-4  contenedor-panel-control-asesores-2 container d-none d-xl-block"
              }
            >
              <div className="d-flex justify-content-evenly ">
                <article>
                  <div className="mx-5 text-center">
                    <h6
                      className={
                        darkMode ? "fs-12  text-white" : "fs-12  text-black-50"
                      }
                    >
                      {competencia === "mercadopago" ? " " : "Por mes"}
                    </h6>
                    <h6 className="fs-14 lato-bold">{costopayweyFormateado}</h6>
                  </div>
                </article>
              </div>
            </div>
          </>
        );
      case "naranjax":
        return (
          <>
            {/*
              Costo de terminales de {tipoLabelSelectCompentencia()}
           */}
          </>
        );
      case "getnet":
        return (
          <>
            {/* <h6 className="text-center pb-2">
              Costo de terminales de {tipoLabelSelectCompentencia()}
            </h6>
            */}
          </>
        );
      case "viumi":
        return (
          <>
            <h6 className="text-center pb-2">
              Costo de terminales de {tipoLabelSelectCompentencia()}
            </h6>
            <div
              className={
                darkMode
                  ? "py-4  contenedor-panel-control-asesores-modo-oscuro container d-none d-xl-block"
                  : "py-4  contenedor-panel-control-asesores-2 container d-none d-xl-block"
              }
            >
              <div className="d-flex justify-content-evenly ">
                <article>
                  <div className="mx-5 text-center">
                    <h6
                      className={
                        darkMode ? "fs-12  text-white" : "fs-12  text-black-50"
                      }
                    >
                      {competencia === "viumi" ? " " : "Por mes"}
                    </h6>
                    <h6 className="fs-14 lato-bold">{costopayweyFormateado}</h6>
                  </div>
                </article>
              </div>
            </div>
          </>
        );
      default:
        return ""; // Un valor por defecto si fuera necesario
    }
  };

  // MUESTRA LOS COSTO TERMINALES Y AHORROS EN CELULAR
  const costoTerminalCelular = () => {
    switch (competencia) {
      case "payway":
        return (
          <>
            <h6 className="text-center pb-2">
              Costo de terminales de {tipoLabelSelectCompentencia()}
            </h6>
            <div
              className={
                darkMode
                  ? "pill-1-dark d-flex align-items-center"
                  : "pill-1 d-flex align-items-center"
              }
            >
              <div className="text-center w-50">
                <h6
                  className={
                    darkMode ? "fs-12  text-white" : "fs-12  text-black-50"
                  }
                >
                  {competencia === "payway" ? "Por mes" : ""}
                </h6>
                <h6 className="fs-12 lato-bold">{costopayweyFormateado}</h6>
              </div>
              <article className="borde-caja-panel-2"></article>
              <div className=" text-center w-50">
                <h6
                  className={
                    darkMode ? "fs-12  text-white" : "fs-12  text-black-50"
                  }
                >
                  Por 12 meses{" "}
                </h6>
                <h6 className="fs-12 lato-bold">{poraniopayweyFormateado}</h6>
              </div>
            </div>
          </>
        );
      case "mercadopago":
        return (
          <>
            <h6 className="text-center pb-2">
              Costo de terminales de {tipoLabelSelectCompentencia()}
            </h6>
            <div
              className={
                darkMode
                  ? "pill-1-dark d-flex  align-items-center justify-content-center "
                  : "pill-1 d-flex  justify-content-center align-items-center"
              }
            >
              <div className="mx-5 text-center">
                <h6
                  className={
                    darkMode ? "fs-12  text-white" : "fs-12  text-black-50"
                  }
                >
                  {competencia === "mercadopago" ? "" : "por mes"}
                </h6>
                <h6 className="fs-12  lato-bold">{costopayweyFormateado}</h6>
              </div>
            </div>
          </>
        );
      case "naranjax":
        return (
          <>
            <h6 className="text-center pb-2 ocultar-div">
              Costo de terminales de {tipoLabelSelectCompentencia()}
            </h6>
          </>
        );
      case "getnet":
        return (
          <>
            <h6 className="text-center pb-2 ocultar-div">
              Costo de terminales de {tipoLabelSelectCompentencia()}
            </h6>
          </>
        );
      case "viumi":
        return (
          <>
            <h6 className="text-center pb-2">
              Costo de terminales de {tipoLabelSelectCompentencia()}
            </h6>
            <div
              className={
                darkMode
                  ? "pill-1-modo-oscuro d-flex  align-items-center justify-content-center "
                  : "pill-1 d-flex  justify-content-center align-items-center"
              }
            >
              <div className="mx-5 text-center">
                <h6
                  className={
                    darkMode ? "fs-12  text-white" : "fs-12  text-black-50"
                  }
                >
                  {competencia === "viumi" ? "" : "por mes"}
                </h6>
                <h6 className="fs-12  lato-bold">{costopayweyFormateado}</h6>
              </div>
            </div>
          </>
        );
      default:
        return ""; // Un valor por defecto si fuera necesario
    }
  };

  // funcion para cambiar la imagen comparativa en CELULAR
  const cambiarImagenesComparativaCelular = () => {
    switch (competencia) {
      case "payway":
        return <Image src={cuadroCelPayway} fluid />;
      case "mercadopago":
        return <Image src={cuadroCelMP} fluid />;
      case "naranjax":
        return <Image src={cuadroCelNX} fluid />; // Añade la imagen correspondiente para Naranja X
      case "getnet":
        return <Image src={cuadroCelGetnet} fluid />; // Añade la imagen correspondiente para Getnet
      case "viumi":
        return <Image src={cuadroCelViumi} fluid />;
      default:
        return null;
    }
  };

  return (
    <div className="container">
      <article className=" d-none d-xl-block">
        <section className="  mb-4">
          <form className="" onSubmit={handleSubmit}>
            <article className="d-flex justify-content-between">
              <div className="">
                <label className="lato-regular fs-14" htmlFor="monto">
                  Monto:
                </label>{" "}
                <input
                  className={
                    darkMode
                      ? "form-control text-white label-buscador-comparativa-dark lato-regular fs-18 border-0"
                      : "form-control label-buscador-comparativa lato-regular fs-18 border-0"
                  }
                  id="monto"
                  type="number" // Se mantiene como texto para evitar problemas de compatibilidad
                  pattern="[0-9]*" // Asegura que solo se puedan ingresar números
                  inputMode="numeric" // Muestra el teclado numérico en dispositivos móviles
                  value={monto}
                  onChange={handleMontoChange}
                />
              </div>
              <div>
                <label className="lato-regular fs-14" htmlFor="terminales">
                  Pos:
                </label>{" "}
                <br />
                <input
                  className={
                    darkMode
                      ? "form-control text-white label-buscador-comparativa-dark lato-regular fs-18 border-0"
                      : "form-control label-buscador-comparativa lato-regular fs-18 border-0"
                  }
                  id="terminales"
                  value={terminales}
                  type="number" // Se mantiene como texto para evitar problemas de compatibilidad
                  pattern="[0-9]*" // Asegura que solo se puedan ingresar números
                  inputMode="numeric" // Muestra el teclado numérico en dispositivos móviles
                  onChange={handleTerminalesChange}

                  // disabled={isDisabled}
                />
              </div>
              <div className=" ocultar-div">
                <label className="lato-regular fs-14" htmlFor="monto">
                  Monto:
                </label>{" "}
                <input
                  className={
                    darkMode
                      ? "form-control text-white label-buscador-comparativa-dark lato-regular fs-18 border-0"
                      : "form-control label-buscador-comparativa lato-regular fs-18 border-0"
                  }
                  id="monto"
                  type="number" // Se mantiene como texto para evitar problemas de compatibilidad
                  pattern="[0-9]*" // Asegura que solo se puedan ingresar números
                  inputMode="numeric" // Muestra el teclado numérico en dispositivos móviles
                />
              </div>
              <div className="ocultar-div">
                <label className="lato-regular fs-14" htmlFor="terminales">
                  Pos:
                </label>{" "}
                <br />
                <input
                  className={
                    darkMode
                      ? "form-control text-white label-buscador-comparativa-dark lato-regular fs-18 border-0"
                      : "form-control label-buscador-comparativa lato-regular fs-18 border-0"
                  }
                  id="terminales"
                  type="number" // Se mantiene como texto para evitar problemas de compatibilidad
                  pattern="[0-9]*" // Asegura que solo se puedan ingresar números
                  inputMode="numeric" // Muestra el teclado numérico en dispositivos móviles

                  // disabled={isDisabled}
                />
              </div>
            </article>
            <article className="d-flex justify-content-between py-2">
              <div>
                <label className="lato-regular fs-14" htmlFor="zocoReward">
                  Zoco Rewards: (En desarrollo - NO COMPARTIR)
                </label>
                <br />
                <Select
                  className="select__control_custom-inicio select__control_custom lato-bold fs-12"
                  classNamePrefix="select"
                  id="zocoReward"
                  isDisabled={false}
                  value={zocoReward}
                  onChange={(selectedOption) => setZocoReward(selectedOption)}
                  options={[
                    { value: 1, label: "Zoco Starter" },
                    { value: 2, label: "Zoco Advanced" },
                    { value: 3, label: "Zoco Elite" },
                  ]}
                />
              </div>

              <div>
                <label className="lato-regular fs-14" htmlFor="tipoPago">
                  Tipo de pago:
                </label>
                <br />

                <Select
                  className=" select__control_custom-inicio select__control_custom lato-bold fs-12"
                  classNamePrefix="select"
                  id="tipoPago"
                  value={{
                    value: tipoPago,
                    label: tipoLabelSelectTipoPago(),
                  }}
                  onChange={(selectedOption) =>
                    setTipoPago(selectedOption.value)
                  }
                  options={[
                    { value: "credito", label: "Crédito" },
                    { value: "debito", label: "Débito" },
                  ]}
                />
              </div>
              <div>
                <label className="lato-regular fs-14" htmlFor="tipoPago">
                  Cuota: (En desarrollo - NO COMPARTIR)
                </label>
                <br />
                <Select
                  className=" select__control_custom-inicio select__control_custom lato-bold fs-12"
                  classNamePrefix="select"
                  id="cuota"
                  isDisabled={false}
                  // isDisabled={tipoPago === "debito"}
                  onChange={(selectedOption) => setCuota(selectedOption.value)}
                  options={[
                    { value: "1", label: "1" },
                    { value: "3", label: "3" },
                    { value: "6", label: "6" },
                    { value: "9", label: "9" },
                    { value: "12", label: "12" },
                  ]}
                />
              </div>
              <div>
                <label className="lato-regular fs-14" htmlFor="competencia">
                  Compañia
                </label>
                <br />
                <Select
                  className="select__control_custom-inicio select__control_custom lato-regular fs-12"
                  classNamePrefix="select"
                  id="competencia"
                  value={{
                    value: competencia,
                    label: tipoLabelSelectCompentencia(),
                  }}
                  onChange={(selectedOption) =>
                    setCompetencia(selectedOption.value)
                  }
                  options={[
                    { value: "payway", label: "PayWay" },
                    { value: "mercadopago", label: "MercadoPago" },
                    { value: "naranjax", label: "Naranja X" }, // Nueva opción añadida
                    { value: "getnet", label: "Getnet" }, // Nueva opción añadida
                    { value: "viumi", label: "Viumi" }, // Nueva opción añadida
                  ]}
                />
              </div>
            </article>
          </form>
        </section>

        <section className="d-flex justify-content-between ">
          <div
            className={
              darkMode
                ? "bg-cuadro-comparador-escritorio-dark"
                : "bg-cuadro-comparador-escritorio "
            }
          >
            <table className="table table-borderless responsive striped hover">
              <thead className="border-0">
                <tr className="text-center tabla-thead">
                  <th
                    className={
                      darkMode
                        ? "bg-secondary text-white border-tabla-izquierda border-0 lato-regular fs-12 py-3"
                        : "bg-dark text-white border-tabla-izquierda border-0 lato-regular fs-12 py-3"
                    }
                    scope="col"
                  ></th>
                  <th
                    className={
                      darkMode
                        ? "bg-secondary text-white border-0 lato-regular fs-12 py-3"
                        : "bg-dark text-white fs-12 lato-regular py-3"
                    }
                    scope="col"
                  >
                    {tipoLabelSelectTipoPago()}
                  </th>
                  <th
                    className={
                      darkMode
                        ? "bg-secondary text-white border-tabla-derecha border-0 lato-regular fs-12 py-3"
                        : "bg-dark text-white border-tabla-derecha fs-12 lato-regular py-3"
                    }
                    scope="col"
                  ></th>
                </tr>
              </thead>
              <tbody className="text-center fila-divisoria">
                <tr>
                  <td className="fs-12-a-10 lato-regular text-dark py-2"></td>
                  <td className="fs-12-a-10 lato-regular text-dark py-2">
                    {cambiarImagenesCompentencia()}
                  </td>
                  <td className="fs-12-a-10 lato-regular text-dark py-2">
                    {darkMode ? (
                      <Image className="w-50" src={zocoDM} fluid />
                    ) : (
                      <Image className="w-50" src={zoco} fluid />
                    )}
                  </td>
                </tr>
                {resultadoCalculadora &&
                  resultadoCalculadora.payway.map((itemPayway, index) => {
                    const itemZoco = resultadoCalculadora.zoco[index];
                    return (
                      <tr key={index}>
                        <td
                          className={
                            darkMode
                              ? "fs-14 lato-regular text-white py-3"
                              : "fs-14 lato-regular text-dark py-3"
                          }
                        >
                          {itemPayway.nombre}
                        </td>
                        <td
                          className={
                            itemPayway.nombre === "PERCEPCIONES IVA" ||
                            itemPayway.nombre ===
                              "RETENCIONES INGRESOS BRUTOS" ||
                            itemPayway.nombre === "RETENCIONES IVA" ||
                            itemPayway.nombre === "RETENCIONES GANANCIAS"
                              ? "fs-12 lato-regular color-rojo py-3 "
                              : darkMode
                              ? "fs-12 lato-regular text-white py-3"
                              : "fs-12 lato-regular text-black  py-3"
                          }
                        >
                          {itemPayway.monto} <br />
                          <span
                            className={
                              itemPayway.nombre === "TOTAL DEDUCCIONES" ||
                              itemPayway.nombre ===
                                "RETENCIONES INGRESOS BRUTOS" ||
                              itemPayway.nombre === "RETENCIONES IVA" ||
                              itemPayway.nombre === "RETENCIONES GANANCIAS"
                                ? "fs-12 lato-regular color-rojo py-3 "
                                : darkMode
                                ? "fs-12 lato-regular text-white lato-regular py-3"
                                : "fs-12  text-black lato-regular py-3"
                            }
                          >
                            {itemPayway.nombre === "TOTAL DEDUCCIONES" &&
                              itemPayway.porcentaje}
                          </span>
                        </td>
                        <td
                          className={
                            itemPayway.nombre ===
                              "RETENCIONES INGRESOS BRUTOS" ||
                            itemPayway.nombre === "RETENCIONES IVA" ||
                            itemPayway.nombre === "RETENCIONES GANANCIAS"
                              ? "fs-12 lato-regular color-verde py-2 "
                              : darkMode
                              ? "fs-12 lato-regular text-white  py-3"
                              : "fs-12 lato-regular text-black  py-3"
                          }
                        >
                          {itemZoco.monto} <br />
                          <span
                            className={
                              itemZoco.nombre === "TOTAL DEDUCCIONES" ||
                              itemZoco.nombre ===
                                "RETENCIONES INGRESOS BRUTOS" ||
                              itemZoco.nombre === "RETENCIONES IVA" ||
                              itemZoco.nombre === "RETENCIONES GANANCIAS"
                                ? "fs-12 lato-regular color-verde py-2 "
                                : darkMode
                                ? "fs-12 lato-regular text-white py-3"
                                : "fs-12 lato-regular text-black  py-3"
                            }
                          >
                            {itemZoco.nombre === "TOTAL DEDUCCIONES" &&
                              itemZoco.porcentaje}
                          </span>
                        </td>
                      </tr>
                    );
                  })}
              </tbody>
            </table>{" "}
          </div>

          <div className="mx-auto mt-4">
            <section>{costoTerminales()}</section>
            <section className="my-4">
              <h6 className="text-center pb-2">Ahorro</h6>
              <div
                className={
                  darkMode
                    ? "py-4  contenedor-panel-control-asesores-modo-oscuro container "
                    : "py-4 contenedor-panel-control-asesores-2 container "
                }
              >
                <div className="d-flex ">
                  <article className="w-33">
                    <div className="text-center">
                      <h6
                        className={
                          darkMode
                            ? "fs-12  text-white"
                            : "fs-12  text-black-50"
                        }
                      >
                        Por ciento{" "}
                      </h6>
                      <h6 className="fs-14 lato-bold">
                        {porcentajeRedondeado}%
                      </h6>
                    </div>
                  </article>
                  <article className="borde-caja-panel-1"></article>
                  <article className="w-34">
                    <div className=" text-center">
                      <h6
                        className={
                          darkMode
                            ? "fs-12  text-white"
                            : "fs-12  text-black-50"
                        }
                      >
                        Por mes{" "}
                      </h6>
                      <h6 className="fs-14 lato-bold">
                        {pormeszocoFormateado}
                      </h6>
                    </div>
                  </article>
                  <article className="borde-caja-panel-1"></article>
                  <article className="w-33">
                    <div className="text-center">
                      <h6
                        className={
                          darkMode
                            ? "fs-12  text-white"
                            : "fs-12  text-black-50"
                        }
                      >
                        Por año{" "}
                      </h6>
                      <h6 className="fs-14 lato-bold">
                        {poraniozocoFormateado}
                      </h6>
                    </div>
                  </article>
                </div>
              </div>
            </section>
          </div>
        </section>
        {/* condicional para mostrar la imagen  */}
        <section className="d-flex justify-content-start py-5">
          {cambiarImagenesComparativa()}
        </section>
      </article>

      {/* Version mobile  */}
      <article className="d-xl-none d-block">
        <section className="mb-4">
          <form>
            <div className="my-2 d-flex">
              <label className="lato-regular fs-14 mt-2 " htmlFor="monto">
                Monto:
              </label>{" "}
              <label
                className="lato-regular fs-14 mt-2 me-5 ocultar-div"
                htmlFor="monto"
              >
                a
              </label>{" "}
              <input
                className={
                  darkMode
                    ? " form-control text-white label-buscador-comparativa-dark lato-regular fs-18 border-0"
                    : "form-control label-buscador-comparativa lato-regular fs-18 border-0"
                }
                id="monto"
                type="number" // Se mantiene como texto para evitar problemas de compatibilidad
                pattern="[0-9]*" // Asegura que solo se puedan ingresar números
                inputMode="numeric" // Muestra el teclado numérico en dispositivos móviles
                value={monto}
                onChange={handleMontoChange}
              />
            </div>
            <div className="my-2 d-flex">
              <label className="lato-regular fs-14 mt-2 " htmlFor="terminales">
                Pos:
              </label>{" "}
              <label
                className="lato-regular fs-14 mt-2 me-5 ocultar-div"
                htmlFor="terminales"
              >
                pos.
              </label>{" "}
              <input
                className={
                  darkMode
                    ? " form-control text-white label-buscador-comparativa-dark lato-regular fs-18 border-0"
                    : "form-control label-buscador-comparativa lato-regular fs-18 border-0"
                }
                id="terminales"
                type="number" // Se mantiene como texto para evitar problemas de compatibilidad
                pattern="[0-9]*" // Asegura que solo se puedan ingresar números
                inputMode="numeric" // Muestra el teclado numérico en dispositivos móviles
                value={terminales}
                onChange={handleTerminalesChange}

                // disabled={isDisabled}
              />
            </div>
            <div className="my-2">
              <label className="lato-regular fs-14 mt-2" htmlFor="cuotas">
                Zoco Rewards: (En desarrollo - NO COMPARTIR)
              </label>
              <Select
                className=" lato-regular"
                classNamePrefix="select"
                id="zocoReward"
                isDisabled={false}
                value={zocoReward}
                onChange={(selectedOption) => setZocoReward(selectedOption)}
                options={[
                  { value: 1, label: "Zoco Starter" },
                  { value: 2, label: "Zoco Advanced" },
                  { value: 3, label: "Zoco Elite" },
                ]}
              />
            </div>
            <div className="my-2">
              <label className="lato-regular fs-14 mt-2" htmlFor="tipoPago">
                Tipo de pago:
              </label>
              <Select
                className=" lato-regular"
                classNamePrefix="select"
                id="tipoPago"
                value={{
                  value: tipoPago,
                  label: tipoLabelSelectTipoPago(),
                }}
                onChange={(selectedOption) => setTipoPago(selectedOption.value)}
                options={[
                  { value: "credito", label: "Crédito" },
                  { value: "debito", label: "Débito" },
                ]}
              />
            </div>
            <div className="my-2">
              <label className="lato-regular fs-14 mt-2" htmlFor="cuotas">
                Cuotas: (En desarrollo - NO COMPARTIR)
              </label>
              <Select
                className=" lato-regular"
                classNamePrefix="select"
                id="cuota"
                isDisabled={false}
                // isDisabled={tipoPago === "debito"}

                onChange={(selectedOption) => setCuota(selectedOption.value)}
                options={[
                  { value: "1", label: "1" },
                  { value: "3", label: "3" },
                  { value: "6", label: "6" },
                  { value: "9", label: "9" },
                  { value: "12", label: "12" },
                ]}
              />
            </div>
            <div className="my-2">
              <label className="lato-regular fs-14 mt-2" htmlFor="competencia">
                Compañia:
              </label>
              <Select
                className=" lato-regular"
                classNamePrefix="select"
                id="competencia"
                value={{
                  value: competencia,
                  label: tipoLabelSelectCompentencia(),
                }}
                onChange={(selectedOption) =>
                  setCompetencia(selectedOption.value)
                }
                options={[
                  { value: "payway", label: "PayWay" },
                  { value: "mercadopago", label: "MercadoPago" },
                  { value: "naranjax", label: "Naranja X" }, // Nueva opción añadida
                  { value: "getnet", label: "Getnet" }, // Nueva opción añadida
                  { value: "viumi", label: "Viumi" }, // Nueva opción añadida
                ]}
              />
            </div>
          </form>
        </section>
        <section className="">
          <div
            className={
              darkMode
                ? "bg-cuadro-comparador-escritorio-dark"
                : "bg-cuadro-comparador-escritorio "
            }
          >
            <table className="container table table-borderless responsive striped hover">
              <thead className="border-0">
                <tr className="text-center tabla-thead">
                  <th
                    className={
                      darkMode
                        ? "bg-secondary text-white border-tabla-izquierda border-0 lato-regular fs-12 py-3"
                        : "bg-dark text-white border-tabla-izquierda border-0 lato-regular fs-12 py-3"
                    }
                    scope="col"
                  ></th>
                  <th
                    className={
                      darkMode
                        ? "bg-secondary text-white border-0 lato-regular fs-12 py-3"
                        : "bg-dark text-white fs-12 lato-regular py-3"
                    }
                    scope="col"
                  >
                    {tipoLabelSelectTipoPago()}
                  </th>
                  <th
                    className={
                      darkMode
                        ? "bg-secondary text-white border-tabla-derecha border-0 lato-regular fs-12 py-3"
                        : "bg-dark text-white border-tabla-derecha fs-12 lato-regular py-3"
                    }
                    scope="col"
                  ></th>
                </tr>
              </thead>
              <tbody
                className={
                  darkMode
                    ? "text-center fila-divisoria-dark"
                    : "text-center fila-divisoria"
                }
              >
                <tr>
                  <td className="fs-12 lato-regular text-dark py-2"></td>
                  <td className="fs-12 lato-regular text-dark py-2">
                    {cambiarImagenesCompentencia()}
                  </td>
                  <td className="fs-12-a-10 lato-regular text-dark py-2">
                    {darkMode ? (
                      <Image className="w-50" src={zocoDM} fluid />
                    ) : (
                      <Image className="w-50" src={zoco} fluid />
                    )}
                  </td>
                </tr>
                {resultadoCalculadora &&
                  resultadoCalculadora.payway.map((itemPayway, index) => {
                    // Asegúrate de que también hay un objeto correspondiente en resultadoCalculadora.zoco
                    const itemZoco = resultadoCalculadora.zoco[index];
                    return (
                      <tr key={index}>
                        <td
                          className={
                            darkMode
                              ? "fs-12-a-10 lato-regular text-white "
                              : "fs-12-a-10 lato-regular text-dark "
                          }
                        >
                          {itemPayway.nombre}
                        </td>
                        <td
                          className={
                            itemPayway.nombre === "PECEPCIONES IVA" ||
                            itemPayway.nombre ===
                              "RETENCIONES INGRESOS BRUTOS" ||
                            itemPayway.nombre === "RETENCIONES IVA" ||
                            itemPayway.nombre === "RETENCIONES GANANCIAS"
                              ? "fs-11 lato-regular color-rojo "
                              : darkMode
                              ? "fs-11 lato-regular text-white  "
                              : "fs-11 lato-regular text-black  "
                          }
                        >
                          {itemPayway.monto} <br />
                          <span
                            className={
                              itemPayway.nombre === "TOTAL DEDUCCIONES" ||
                              itemPayway.nombre ===
                                "RETENCIONES INGRESOS BRUTOS" ||
                              itemPayway.nombre === "RETENCIONES IVA" ||
                              itemPayway.nombre === "RETENCIONES GANANCIAS"
                                ? "fs-11 lato-regular color-rojo "
                                : darkMode
                                ? "fs-11 lato-regular text-white  "
                                : "fs-11 lato-regular text-black "
                            }
                          >
                            {itemPayway.nombre === "TOTAL DEDUCCIONES" &&
                              itemPayway.porcentaje}
                          </span>
                        </td>
                        <td
                          className={
                            itemPayway.nombre ===
                              "RETENCIONES INGRESOS BRUTOS" ||
                            itemPayway.nombre === "RETENCIONES IVA" ||
                            itemPayway.nombre === "RETENCIONES GANANCIAS"
                              ? "fs-11 lato-regular color-verde py-2 "
                              : darkMode
                              ? "fs-11 lato-regular text-white  "
                              : "fs-11 lato-regular text-black  "
                          }
                        >
                          {itemZoco.monto} <br />
                          <span
                            className={
                              itemPayway.nombre === "TOTAL DEDUCCIONES" ||
                              itemPayway.nombre ===
                                "RETENCIONES INGRESOS BRUTOS" ||
                              itemPayway.nombre === "RETENCIONES IVA" ||
                              itemPayway.nombre === "RETENCIONES GANANCIAS"
                                ? "fs-11 lato-regular color-verde"
                                : darkMode
                                ? "fs-11 lato-regular text-white  "
                                : "fs-11 lato-regular text-black  "
                            }
                          >
                            {itemZoco.nombre === "TOTAL DEDUCCIONES" &&
                              itemZoco.porcentaje}
                          </span>
                        </td>
                      </tr>
                    );
                  })}
              </tbody>
            </table>{" "}
          </div>
          <div>
            <div className="mt-4">{costoTerminalCelular()}</div>

            <div className="my-4">
              <h6 className="text-center pb-2">Ahorro</h6>
              <div
                className={
                  darkMode
                    ? "pill-1-dark d-flex justify-content-center align-items-center"
                    : "pill-1 d-flex justify-content-center align-items-center"
                }
              >
                <div className="text-center w-33">
                  <h6
                    className={
                      darkMode ? "fs-12  text-white" : "fs-12  text-black-50"
                    }
                  >
                    Por ciento{" "}
                  </h6>
                  <h6 className="fs-12 lato-bold">{porcentajeRedondeado}%</h6>
                </div>
                <article className="borde-caja-panel-2"></article>
                <div className="text-center w-34">
                  <h6
                    className={
                      darkMode ? "fs-12  text-white" : "fs-12  text-black-50"
                    }
                  >
                    Por Mes{" "}
                  </h6>
                  <h6 className="fs-12 lato-bold">{pormeszocoFormateado}</h6>
                </div>
                <article className="borde-caja-panel-2"></article>
                <div className=" text-center  w-34">
                  <h6
                    className={
                      darkMode ? "fs-12  text-white" : "fs-12 text-black-50"
                    }
                  >
                    Por Año{" "}
                  </h6>
                  <h6 className="fs-12 lato-bold">{poraniozocoFormateado}</h6>
                </div>
              </div>
            </div>
          </div>
        </section>
        {/* condicional para cambiar la imagen  */}
        <section className="d-flex justify-content-center">
          {cambiarImagenesComparativaCelular()}
        </section>
      </article>
    </div>
  );
};

export default CuadroComparativo;
