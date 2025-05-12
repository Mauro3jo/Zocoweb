// import hoja de estilo (css)
import "./BienvenidoPanel.css";

// import hooks
import React, { useContext, useEffect, useState } from "react";

// import context
import { DarkModeContext } from "../context/DarkModeContext";
import { DatosInicioContext } from "../context/DatosInicioContext";

// import librerias
import Swal from "sweetalert2";
import Select from "react-select";

const BienvenidoPanel = () => {
  // context para el modo claro oscuro
  const { darkMode } = useContext(DarkModeContext);

  // context para traer los datos
  const { actualizarDatos } = useContext(DatosInicioContext);

  // estado para manejar el disabled o enabled del controlador.
  const [isSearchable, setIsSearchable] = useState(true);

  // estado para manejar los datos del selector por anio
  const [selectedAnio, setSelectedAnio] = useState({
    value: new Date().getFullYear(),
    label: new Date().getFullYear().toString(),
  });
  // estado para manejar los datos del selector por mes
  const [selectedMes, setSelectedMes] = useState(null);
  // estado para manejar los datos del selector por comercio
  const [selectedComercio, setSelectedComercio] = useState(null);
  // estado para manejar los datos del selector por semana
  const [selectedSemana, setSelectedSemana] = useState(null);

  // estado para manejar el boton de enviado del filtrado
  const [isButtonPressed, setIsButtonPressed] = useState(false);

  // estado para settear las fecha de inicio y fin del filtrado
  const [fechaInicio, setFechaInicio] = useState(null);
  const [fechaFin, setFechaFin] = useState(null);

  // estado para cargar las opciones de los selectores
  const [optionsComercio, setOptionsComercio] = useState([]);
  const [optionsAnios, setOptionsAnios] = useState([]);
  const [optionsMes, setOptionsMes] = useState([]);
  const [optionsSemanas, setOptionsSemanas] = useState([]);

  // estado para manejar el activado escalonado del filtro
  const [isActiveAnio, setIsActiveAnio] = useState(true);
  const [isActiveMes, setIsActiveMes] = useState(false);
  const [isActiveSemanas, setIsActiveSemanas] = useState(false);
  const [isActiveComercio, setIsActiveComercio] = useState(false);

  // funcion para ir activando las opciones de filtro por anio
  const activadoAnio = () => {
    setIsActiveAnio(true);
    setIsActiveMes(true);
    setIsActiveSemanas(false);
    setIsActiveComercio(false);
  };

  // funcion para ir activando las opciones de filtro por mes
  const activadoMes = () => {
    setIsActiveAnio(true);
    setIsActiveMes(true);
    setIsActiveSemanas(true);
    setIsActiveComercio(false);
  };

  // funcion para ir activando las opciones de filtro por semanas
  const activadoSemanas = () => {
    setIsActiveAnio(true);
    setIsActiveMes(true);
    setIsActiveSemanas(true);
    setIsActiveComercio(true);
  };

  // funcion para capturar los datos del selectores
  const [datosSelect, setDatosSelect] = useState({
    anio: "",
    mes: "",
    semana: "",
    comercio: "",
  });

  // funcion para enviar los datos del selector al contexto y actualizar los datos
  const enviarDatosAlContexto = (datos) => {
    actualizarDatos(datos);
  };

  // funcion para procesar datos
  const procesarDatos = (data) => {
    const optionsComercio = [
      ...data.comercios.map((comercio) => ({
        value: comercio.toLowerCase().replace(/\s+/g, ""),
        label: comercio,
      })),
    ];

    const fechaInicio = new Date(data.fechaInicio);
    const fechaFin = new Date(data.fechaFin);

    const optionsAnios = [];
    for (
      let año = fechaInicio.getFullYear();
      año <= fechaFin.getFullYear();
      año++
    ) {
      optionsAnios.push({ value: año.toString(), label: año.toString() });
    }
    const optionsSemanas = [{ value: 8, label: "Todo el Mes" }];
    const optionsMeses = [];
    let fechaActual = fechaInicio;
    while (fechaActual <= fechaFin) {
      const mes = fechaActual.toLocaleString("es", { month: "long" });
      optionsMeses.push({ value: mes.toLowerCase(), label: mes });
      fechaActual = new Date(
        fechaActual.getFullYear(),
        fechaActual.getMonth() + 1,
        1
      );
      if (selectedAnio === null) {
        const ultimoAnio = optionsAnios[optionsAnios.length - 1];
        const ultimoMes = optionsMeses[optionsMeses.length - 1];

        setSelectedAnio(ultimoAnio);
        setSelectedMes(ultimoMes);
        setSelectedSemana(optionsSemanas[0]);
      }

      // Establecer 'Todos' como valor predeterminado para comercio
      setSelectedComercio(optionsComercio[0]);
    }

    setOptionsComercio(optionsComercio);
    setOptionsAnios(optionsAnios);
    setOptionsMes(optionsMeses);
    setOptionsSemanas(optionsSemanas);
    setFechaInicio(fechaInicio);
    setFechaFin(fechaFin);
  };

  // url de la api
  const apiUrlBienvenidoPanel = process.env.REACT_APP_API_BIENVENIDO_PANEL;

  // consulta para la api
  useEffect(() => {
    const token = sessionStorage.getItem("token");
    const requestData = {
      token: token,
    };

    if (token) {
      fetch(apiUrlBienvenidoPanel, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(requestData),
      })
        .then((response) => {
          if (!response.ok) {
            throw new Error("Error en la solicitud");
          }
          return response.json();
        })
        .then((data) => {
          //   console.log("Datos recibidos de la API:", data);
          procesarDatos(data);
        })
        .catch((error) => {
          //     console.error("Error en la solicitud:", error);
        });
    }
  }, []);

  // funcion para actualizar el mes y anio
  const actualizarMesesPorAnio = (anioSeleccionado) => {
    if (!fechaInicio || !fechaFin) return;

    // Ajusta el mes de inicio y fin dependiendo del año seleccionado
    const mesInicio =
      anioSeleccionado === fechaInicio.getFullYear()
        ? fechaInicio.getMonth()
        : 0;
    const mesFin =
      anioSeleccionado === fechaFin.getFullYear() ? fechaFin.getMonth() : 11;

    const optionsMeses = [];
    for (let mes = mesInicio; mes <= mesFin; mes++) {
      let fechaActual = new Date(anioSeleccionado, mes, 1);
      const nombreMes = fechaActual.toLocaleString("es", { month: "long" });
      optionsMeses.push({ value: mes + 1, label: nombreMes }); // Usar mes + 1 como valor
    }

    setOptionsMes(optionsMeses);

    // Establecer setSelectedMes en el último mes del rango
    setSelectedMes(optionsMeses[optionsMeses.length - 1]);
  };

  // funcion para actualizar semanas x mes
  const actualizarSemanasPorMes = (anioSeleccionado, mesSeleccionado) => {
    const primerDiaMes = new Date(anioSeleccionado, mesSeleccionado - 1, 1);
    const ultimoDiaMes = new Date(anioSeleccionado, mesSeleccionado, 0);

    // Ajustar al lunes de la misma semana solo si el primer día no es domingo
    let diaActual = new Date(primerDiaMes);
    if (primerDiaMes.getDay() !== 0) {
      diaActual.setDate(diaActual.getDate() - ((diaActual.getDay() + 6) % 7));
    }

    let semanas = [];
    let semana = [];
    let numeroSemanaDelMes = 0;

    // Iterar a través de los días
    while (diaActual <= ultimoDiaMes || semana.length > 0) {
      if (diaActual.getDay() === 1) {
        if (semana.length > 0) {
          semanas.push({ numeroSemanaDelMes, dias: [...semana] });
          semana = [];
        }
        numeroSemanaDelMes++;
      }

      // Añadir el día a la semana actual si está dentro del mes
      if (diaActual.getMonth() === mesSeleccionado - 1) {
        semana.push(new Date(diaActual));
      }

      diaActual.setDate(diaActual.getDate() + 1);

      // Añadir la última semana si hemos llegado al final del mes
      if (diaActual > ultimoDiaMes && semana.length > 0) {
        semanas.push({ numeroSemanaDelMes, dias: [...semana] });
        semana = [];
      }
    }

    // Agregar el texto del mes completo al principio
    const mesCompleto = { label: `Todo el Mes`, value: 8 };

    // Filtrar las semanas que caen dentro del rango de fechaInicio y fechaFin
    const semanasFiltradas = semanas.filter((semana) => {
      const inicioSemana = semana.dias[0];
      const finSemana = semana.dias[semana.dias.length - 1];
      return (
        (!fechaInicio || finSemana >= fechaInicio) &&
        (!fechaFin || inicioSemana <= fechaFin)
      );
    });

    // Formatear las semanas para el uso en el front-end
    const semanasFormateadas = semanasFiltradas.map((semana) => {
      const label = `Semana ${semana.numeroSemanaDelMes}`;
      const value = semana.numeroSemanaDelMes;

      return { label, value };
    });

    // Agregar el objeto del mes completo al principio de la matriz
    semanasFormateadas.unshift(mesCompleto);

    setOptionsSemanas(semanasFormateadas);
  };

  // funcion para mandar la semana
  const mandarSemana = (selectedSemana) => {
    const valorSemanaSeleccionada = selectedSemana;
    setDatosSelect({
      ...datosSelect,
      semana: valorSemanaSeleccionada,
    });
  };

  const mandarComercio = (selectedComercio) => {
    const valorComercioSeleccionado = selectedComercio;
    setDatosSelect({
      ...datosSelect,
      comercio: valorComercioSeleccionado,
    });
  };

  // consulta para enviar los datos del filtro
  useEffect(() => {
    // Actualizar datosSelect solo cuando el botón ha sido presionado
    if (isButtonPressed) {
      const nuevosDatosSelect = {
        anio: selectedAnio ? selectedAnio.value : "",
        mes: selectedMes ? selectedMes.value : "",
        semana: selectedSemana ? selectedSemana.value : "", // Usar un valor por defecto aquí
        comercio: selectedComercio ? selectedComercio.value : "",
      };

      setDatosSelect(nuevosDatosSelect);
      enviarDatosAlContexto(nuevosDatosSelect);
      setIsButtonPressed(false); // Resetear el estado después de enviar los datos
    }
  }, [
    isButtonPressed,
    selectedAnio,
    selectedMes,
    selectedSemana,
    selectedComercio,
  ]);

    const handleEnviarDatos = () => {
        if (!selectedAnio || !selectedMes || !selectedSemana || !selectedComercio) {
            Swal.fire({
                title: "Error",
                text: "Por favor, selecciona todos los campos.",
                icon: "error",
                confirmButtonText: "Ok",
            });
            return;
        }

        // Guardar filtros en sessionStorage para persistencia
        const filtrosSeleccionados = {
            anio: selectedAnio,
            mes: selectedMes,
            semana: selectedSemana,
            comercio: selectedComercio,
        };
        sessionStorage.setItem("filtrosSeleccionados", JSON.stringify(filtrosSeleccionados));

        setIsButtonPressed(true);
        setIsLoading(true);

        setTimeout(() => {
            setIsLoading(false);
        }, 3000);
    };

  // estado para manejar el spinner de cargado
  const [isLoading, setIsLoading] = useState(false);
    // useEffect para seleccionar automáticamente el último año disponible
    // useEffect para seleccionar automáticamente el último año, mes, "Todo el Mes" y "Todos" en comercio
  
    useEffect(() => {
        window.addEventListener("beforeunload", () => {
            sessionStorage.removeItem("filtrosSeleccionados");
        });

        return () => {
            window.removeEventListener("beforeunload", () => {
                sessionStorage.removeItem("filtrosSeleccionados");
            });
        };
    }, []); useEffect(() => {
        const filtrosGuardados = sessionStorage.getItem("filtrosSeleccionados");

        if (optionsAnios.length > 0) {
            if (filtrosGuardados) {
                const filtros = JSON.parse(filtrosGuardados);
                setSelectedAnio(filtros.anio);
                setTimeout(() => actualizarMesesPorAnio(Number(filtros.anio.value)), 100); // 🔹 Sincronización correcta
            } else {
                const ultimoAnio = optionsAnios[optionsAnios.length - 1];
                setSelectedAnio(ultimoAnio);
                setTimeout(() => actualizarMesesPorAnio(Number(ultimoAnio.value)), 100);
            }
            activadoAnio();
        }
    }, [optionsAnios]);

    useEffect(() => {
        const filtrosGuardados = sessionStorage.getItem("filtrosSeleccionados");

        if (optionsMes.length > 0) {
            if (filtrosGuardados) {
                const filtros = JSON.parse(filtrosGuardados);
                setSelectedMes(filtros.mes);
                setTimeout(() => actualizarSemanasPorMes(selectedAnio?.value, filtros.mes.value), 100);
            } else {
                const ultimoMes = optionsMes[optionsMes.length - 1];
                setSelectedMes(ultimoMes);
                setTimeout(() => actualizarSemanasPorMes(selectedAnio?.value, ultimoMes.value), 100);
            }
            activadoMes();
        }
    }, [optionsMes, selectedAnio]);

    useEffect(() => {
        const filtrosGuardados = sessionStorage.getItem("filtrosSeleccionados");

        if (optionsSemanas.length > 0) {
            if (filtrosGuardados) {
                const filtros = JSON.parse(filtrosGuardados);
                setSelectedSemana(filtros.semana);
                setTimeout(() => mandarSemana(filtros.semana.value), 100);
            } else {
                const todoElMes = optionsSemanas.find((semana) => semana.value === 8);
                if (todoElMes) {
                    setSelectedSemana(todoElMes);
                    setTimeout(() => mandarSemana(todoElMes.value), 100);
                }
            }
            activadoSemanas();
        }
    }, [optionsSemanas, selectedMes]);

    useEffect(() => {
        const filtrosGuardados = sessionStorage.getItem("filtrosSeleccionados");

        if (optionsComercio.length > 0) {
            if (filtrosGuardados) {
                const filtros = JSON.parse(filtrosGuardados);
                setSelectedComercio(filtros.comercio);
                setTimeout(() => mandarComercio(filtros.comercio.value), 100);
            } else {
                setSelectedComercio(optionsComercio[0]);
                setTimeout(() => mandarComercio(optionsComercio[0]?.value), 100);
            }
        }
    }, [optionsComercio, selectedSemana]);





  return (
    <section
      className={
        darkMode
          ? " contenedor-panel-control-dark py-4   container"
          : "py-4  contenedor-panel-control container"
      }
    >
      <div className="">
        <div className="row">
          <div className="col-md-2  my-3 ">
            <h6 className="text-center heavy-900 fs-16 ms-2">
              {" "}
              Bienvenido/a al <br />{" "}
              <span className="text-center heavy-900 color-verde fs-25-a-16 line-h-26">
                {" "}
                Panel de Control
              </span>{" "}
            </h6>
          </div>

          <div className="col-md-10 ">
            <div>
              <article className="borde-caja-panel"></article>
              <form className="d-flex justify-content-around">
                <article>
                  <label
                    htmlFor="exampleFormControlInput1"
                    className="lato-bold fs-16 ms-3 "
                  >
                    Año
                  </label>
                  <Select
                    value={selectedAnio}
                    className=" select__control2 select__control_custom lato-bold"
                    classNamePrefix="select"
                    isSearchable={isSearchable}
                    name="anio"
                    options={optionsAnios}
                    onChange={(selectedOption) => {
                      // Convertir el valor seleccionado a un número antes de establecer el estado
                      setSelectedAnio({
                        ...selectedOption,
                        value: Number(selectedOption.value),
                      });
                      actualizarMesesPorAnio(Number(selectedOption.value));
                      activadoAnio();
                    }}
                    styles={{
                      control: (base) => ({
                        ...base,
                        textAlign: "center",
                      }),
                    }}
                  />
                </article>
                <article>
                  <label
                    htmlFor="exampleFormControlInput1"
                    className="lato-bold fs-16 ms-3"
                  >
                    Mes
                  </label>
                  <Select
                    isDisabled={isActiveMes === false ? true : false}
                    value={selectedMes}
                    className=" lato-bold select__control_custom"
                    classNamePrefix="select"
                    isSearchable={isSearchable}
                    name="mes"
                    options={optionsMes}
                    onChange={(selectedOption) => {
                      setSelectedMes(selectedOption);
                      actualizarSemanasPorMes(
                        selectedAnio.value,
                        selectedOption.value
                      );
                      activadoMes();
                    }}
                    styles={{
                      control: (base) => ({
                        ...base,
                        textAlign: "center",
                      }),
                    }}
                  />
                </article>
                <article>
                  <label
                    htmlFor="exampleFormControlInput1"
                    className="lato-bold fs-16 ms-3"
                  >
                    Semanas
                  </label>
                  <Select
                    isDisabled={isActiveSemanas === false ? true : false}
                    value={selectedSemana}
                    className="select__control_custom lato-bold"
                    classNamePrefix="select"
                    isSearchable={isSearchable}
                    name="semanas"
                    options={optionsSemanas}
                    onChange={(selectedOption) => {
                      setSelectedSemana(selectedOption);
                      mandarSemana(selectedOption.value);
                      activadoSemanas();
                    }}
                    styles={{
                      control: (base) => ({
                        ...base,
                        textAlign: "center",
                      }),
                    }}
                  />
                </article>
                <article>
                  <label
                    htmlFor="exampleFormControlInput1"
                    className="lato-bold fs-16 ms-3"
                  >
                    Comercio
                  </label>
                  <Select
                    isDisabled={isActiveComercio === false ? true : false}
                    value={selectedComercio}
                    className="select__control_custom lato-bold"
                    classNamePrefix="select"
                    isSearchable={isSearchable}
                    name="comercio"
                    options={optionsComercio}
                    onChange={(selectedOption) => {
                      setSelectedComercio(selectedOption);
                      mandarComercio(selectedOption.value);
                    }}
                    styles={{
                      control: (base) => ({
                        ...base,
                        textAlign: "center",
                      }),
                    }}
                  />
                </article>

                <div className="mt-4 me-1">
                  <button
                    className="cursor-point ov-btn-slide-left border-0 lato-bold fs-16 text-white"
                    type="button"
                    onClick={handleEnviarDatos}
                    disabled={isLoading}
                  >
                    {isLoading ? "Cargando..." : "Aplicar"}
                  </button>
                </div>
              </form>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default BienvenidoPanel;
