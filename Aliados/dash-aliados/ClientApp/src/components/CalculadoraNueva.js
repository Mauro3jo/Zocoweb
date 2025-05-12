import React, { useContext, useState, useEffect } from "react";
import { Controller, useForm } from "react-hook-form";
import { DarkModeContext } from "../context/DarkModeContext";
import Select from "react-select";
import { faCircleExclamation } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";

const CalculadoraNueva = () => {
    const { control, handleSubmit, setValue, register } = useForm();
    const { darkMode } = useContext(DarkModeContext);
    const [selectedTarjeta, setSelectedTarjeta] = useState(null);
    const [formData, setFormData] = useState(null);
    const [isActive, setIsActive] = useState("Neto");
    const [datosTarjeta, setDatosTarjeta] = useState([]);
    const [optionsTarjeta, setOptionsTarjeta] = useState([]);
    const [optionsCuotas, setOptionsCuotas] = useState([]);
    const [isActiveDebito, setIsActiveDebito] = useState(true);
    const [showAnticipoInfo, setShowAnticipoInfo] = useState(false);

    // Nuevo estado para Bancarizadas/No Bancarizadas
    const [tipoTarjetaBanco, setTipoTarjetaBanco] = useState(null);
    const [showBancoOptions, setShowBancoOptions] = useState(false);

    useEffect(() => {
        const fetchDatosTarjeta = async () => {
            try {
                const response = await fetch("/api/calculadora/datostarjeta");
                if (!response.ok) {
                    throw new Error(`HTTP error! status: ${response.status}`);
                }
                const data = await response.json();
                setDatosTarjeta(data);

                const tarjetasOptions = Object.keys(data).map((key) => ({
                    value: key.toLowerCase(),
                    label: key,
                }));

                setOptionsTarjeta(tarjetasOptions);
            } catch (error) {
                console.error("Error al obtener los datos de la tarjeta:", error);
            }
        };

        fetchDatosTarjeta();
    }, []);

    const handleTarjetaChange = (selectedOption) => {
        setSelectedTarjeta(selectedOption);
        const cuotasOptions = datosTarjeta[selectedOption.label].map((item) => {
            let label;
            if (selectedOption.label.toLowerCase() === "naranja" && item.cuota === 3) {
                label = "PlanZ";
            } else {
                label =
                    item.cuota === 13
                        ? "Cuota simple 3"
                        : item.cuota === 16
                            ? "Cuota simple 6"
                            : `Cuota ${item.cuota}`;
            }
            return {
                value: item.cuota.toString(),
                label: label,
            };
        });
        setOptionsCuotas(cuotasOptions);
        const defaultCuota = cuotasOptions.find((cuota) => cuota.value === "1");

        if (defaultCuota) {
            setValue("cuota", defaultCuota);
            setShowAnticipoInfo(selectedOption.label.toLowerCase() === "credito");
            setShowBancoOptions(selectedOption.label.toLowerCase() === "credito"); // Mostrar opciones bancarias por defecto si es "Crédito" y cuota es "1"
        } else {
            setShowAnticipoInfo(false);
            setShowBancoOptions(false);
        }
    };

    const handleTipoTarjetaChange = (e) => {
        const tipoTarjeta = e.target.value;
        setIsActiveDebito(tipoTarjeta === "Debito");
        setValue("radio", tipoTarjeta);

        if (tipoTarjeta === "Debito") {
            setOptionsCuotas([{ value: "0", label: "Cuota 0" }]);
            setValue("cuota", { value: "0", label: "Cuota 0" });
            setShowAnticipoInfo(false);
            setShowBancoOptions(false); // Ocultar opción de Banco si es débito
            setTipoTarjetaBanco(null); // Resetear el valor para evitar confusiones
        } else {
            updateCuotasOptionsForCredit();
        }
    };

    const updateCuotasOptionsForCredit = () => {
        if (selectedTarjeta) {
            const cuotas = datosTarjeta[selectedTarjeta.label] || [];
            const filteredCuotas = cuotas
                .filter((c) => c.cuota !== 0)
                .map((item) => {
                    let label;
                    if (selectedTarjeta.label.toLowerCase() === "naranja" && item.cuota === 3) {
                        label = "PlanZ";
                    } else if (selectedTarjeta.label.toLowerCase() === "naranja") {
                        label =
                            item.cuota === 13
                                ? "Cuota simple 3"
                                : item.cuota === 16
                                    ? "Cuota simple 6"
                                    : `Cuota ${item.cuota}`;
                    } else {
                        // Para otras tarjetas no Naranja
                        label = ` Super Simple ${item.cuota}`;
                    }

                    return {
                        value: item.cuota.toString(),
                        label: label,
                    };
                });

            setOptionsCuotas(filteredCuotas);
            if (filteredCuotas.length > 0) {
                const defaultCuota = filteredCuotas.find((cuota) => cuota.value === "1");
                if (defaultCuota) {
                    setValue("cuota", defaultCuota);
                    setShowAnticipoInfo(true);
                    setShowBancoOptions(true); // Mostrar opciones bancarias si es cuota 1
                } else {
                    setShowAnticipoInfo(false);
                    setShowBancoOptions(false);
                }
            }
        }
    };


    // Manejar el cambio de cuota para mostrar la opción Bancarizadas/No Bancarizadas solo en cuota 1
    const handleCuotaChange = (selectedOption) => {
        setValue("cuota", selectedOption);
        if (selectedOption.value === "1" && !isActiveDebito) {
            setShowAnticipoInfo(true);
            setShowBancoOptions(true); // Mostrar las opciones solo en cuota 1
        } else {
            setShowAnticipoInfo(false);
            setShowBancoOptions(false);
            setTipoTarjetaBanco(null); // Resetear el valor de Bancarizadas/No Bancarizadas
        }
    };

    const handleBancoTipoChange = (e) => {
        setTipoTarjetaBanco(e.target.value);
    };

    const onSubmit = async (data) => {
        const token = sessionStorage.getItem("token");
        const finalData = {
            Token: token,
            Monto: data.netoBuscar.toString(),
            Cuota: data.cuota.value,
            TipoNetoBruto: isActive === "Neto" ? "Neto" : "Bruto",
            TipoDebCred: data.radio,
            TipoTarjeta: data.tarjeta.value,
            Tarjeta: data.tarjeta.label,
            TipoTarjetaBanco: tipoTarjetaBanco, // Enviar el valor de Bancarizadas/No Bancarizadas solo si corresponde
        };
        try {
            const response = await fetch("/api/calculadora/calculadorausuarios", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify(finalData),
            });

            if (!response.ok) {
                throw new Error(`HTTP error! status: ${response.status}`);
            }

            const result = await response.json();
            setFormData(result);
        } catch (error) {
            console.error("Error al llamar a la API:", error);
        }
    };

    const toggleActive = (value) => {
        setIsActive(value);

        if (value === "Bruto") {
            setValue("cuota", { value: "0", label: "Cuota 0" });
            setShowBancoOptions(false); // Ocultar opciones bancarias si es "Bruto"
            setTipoTarjetaBanco(null); // Resetear el valor para evitar confusiones
        }
    };

    useEffect(() => {
        if (selectedTarjeta) {
            if (isActiveDebito) {
                setOptionsCuotas([{ value: "0", label: "Cuota 0" }]);
            } else {
                updateCuotasOptionsForCredit();
            }
        }
    }, [selectedTarjeta, isActiveDebito]);

    const {
        alicuotaFinal,
        bruto,
        comisionMasIva,
        costoTarjeta,
        debcredFinal,
        gananciaFinal,
        ivaFinal,
        neto,
        cuota,
        montofinal,
        montoinicial,
        costoAnticipo
    } = formData || [];

    return (
        <section className="container">
            <div className="row">
                <article className="col-7">
                    <article>
                        <form
                            className={
                                darkMode
                                    ? " carta-calculadora-dark py-5 px-5"
                                    : " carta-calculadora py-5 px-5"
                            }
                            onSubmit={handleSubmit(onSubmit)}
                        >
                            <section className="d-flex justify-content-between container py-4">
                                <article>
                                    <div className="form-check">
                                        <input
                                            className="form-check-input"
                                            type="radio"
                                            id="brutoCheckbox"
                                            onChange={() => toggleActive("Bruto")}
                                            checked={isActive === "Bruto"}
                                        />
                                        <label className="form-check-label" htmlFor="brutoCheckbox">
                                            Quiero Cobrar
                                        </label>
                                    </div>
                                    <div className="form-check">
                                        <input
                                            className="form-check-input"
                                            type="radio"
                                            id="netoCheckbox"
                                            onChange={() => toggleActive("Neto")}
                                            checked={isActive === "Neto"}
                                        />
                                        <label className="form-check-label" htmlFor="netoCheckbox">
                                            Quiero Recibir
                                        </label>
                                    </div>
                                </article>
                                <article>
                                    <div className=" d-flex justify-content-center border-0">
                                        <input
                                            id="miid"
                                            className={
                                                darkMode
                                                    ? "form-control input-ingresar-monto-simulador px-5 border-0 "
                                                    : "form-control input-ingresar-monto-simulador px-5 border-0"
                                            }
                                            type="number"
                                            pattern="[0-9]*"
                                            inputMode="numeric"
                                            placeholder="Ingresa el monto"
                                            aria-label="Search"
                                            {...register("netoBuscar", {
                                                valueAsNumber: true,
                                            })}
                                        />
                                    </div>
                                </article>
                            </section>
                            <section className="container d-flex justify-content-center pt-4">
                                <div className="d-flex">
                                    <div className="form-check me-4">
                                        <input
                                            className="form-check-input"
                                            type="radio"
                                            name="flexRadioDefault1"
                                            id="flexRadioDefault1"
                                            value="Debito"
                                            {...register("radio")}
                                            onChange={handleTipoTarjetaChange}
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
                                            onChange={handleTipoTarjetaChange}
                                        />
                                        <label
                                            className="form-check-label lato-bold fs-16"
                                            htmlFor="flexRadioDefault2"
                                        >
                                            Crédito
                                        </label>
                                    </div>
                                </div>
                            </section>

                            <section className="container d-flex justify-content-between py-2">
                                <article className="my-3">
                                    <label htmlFor="tarjeta" className="lato-bold fs-16 pb-2">
                                        {isActive === "Neto"
                                            ? "¿Con qué Tarjeta te pagan?"
                                            : "¿Con qué Tarjeta querés cobrar?"}
                                    </label>
                                    <div className="text-center">
                                        <Controller
                                            name="tarjeta"
                                            control={control}
                                            render={({ field }) => (
                                                <Select
                                                    {...field}
                                                    options={optionsTarjeta}
                                                    className="select__control_custom lato-bold fs-14"
                                                    classNamePrefix="select"
                                                    isSearchable={false}
                                                    onChange={(val) => {
                                                        field.onChange(val);
                                                        handleTarjetaChange(val);
                                                    }}
                                                />
                                            )}
                                        />
                                    </div>
                                </article>
                                <article className="my-3">
                                    <label htmlFor="cuota" className="lato-bold fs-16 pb-2">
                                        {isActive === "Neto"
                                            ? "¿En cuántas cuotas?"
                                            : "¿En cuántas cuotas?"}
                                    </label>
                                    <div className="text-center">
                                        <Controller
                                            name="cuota"
                                            control={control}
                                            render={({ field }) => (
                                                <Select
                                                    {...field}
                                                    isDisabled={isActiveDebito}
                                                    options={optionsCuotas}
                                                    className="select__control_custom lato-bold fs-14"
                                                    classNamePrefix="select"
                                                    isSearchable={false}
                                                    onChange={(val) => {
                                                        field.onChange(val);
                                                        handleCuotaChange(val);
                                                    }}
                                                />
                                            )}
                                        />
                                    </div>
                                </article>
                            </section>

                            {showBancoOptions && (
                                <section className="container d-flex justify-content-center pt-4">
                                    <div className="d-flex">
                                        <div className="form-check me-4">
                                            <input
                                                className="form-check-input"
                                                type="radio"
                                                name="tipoBanco"
                                                id="bancarizada"
                                                value="Bancarizadas"
                                                onChange={handleBancoTipoChange}
                                            />
                                            <label
                                                className="form-check-label lato-bold fs-16"
                                                htmlFor="bancarizada"
                                            >
                                                Bancarizadas
                                            </label>
                                        </div>
                                        <div className="form-check">
                                            <input
                                                className="form-check-input"
                                                type="radio"
                                                name="tipoBanco"
                                                id="noBancarizada"
                                                value="No Bancarizadas"
                                                onChange={handleBancoTipoChange}
                                            />
                                            <label
                                                className="form-check-label lato-bold fs-16"
                                                htmlFor="noBancarizada"
                                            >
                                                No Bancarizadas
                                            </label>
                                        </div>
                                    </div>
                                </section>
                            )}

                            <div className="py-2 d-flex justify-content-start container">
                                <button
                                    className="btn-calculadora2 text-white border-0"
                                    type="submit"
                                >
                                    <div className="d-flex justify-content-center border-0">
                                        <span className="text-white lato-bold fs-18">
                                            {" "}
                                            Calcular
                                        </span>
                                    </div>
                                </button>
                            </div>
                            <div className="pt-2 container">
                                <h6 className="fs-14 lato-regular">
                                    <FontAwesomeIcon icon={faCircleExclamation} /> Indicá si
                                    querés saber cuánto vas a cobrar por un producto o cuánto vas
                                    a recibir por una venta, seleccioná el tipo de pago, la
                                    tarjeta y la cantidad de cuotas, luego tocá en Calcular.
                                </h6>
                            </div>
                        </form>
                    </article>
                </article>
                <article className="col-5">
                    <div
                        className={
                            darkMode
                                ? "carta-calculadora-resultados-dark"
                                : "carta-calculadora-resultados"
                        }
                    >
                        <section className="pt-4">
                            <div className="d-flex justify-content-center">
                                <h6 className=" lato-bold fs-16 ">
                                    {isActiveDebito ? "Débito" : "Crédito"}
                                </h6>
                            </div>
                            <section className="pt-2 pb-2">
                                <div className="ms-5">
                                    <article className="row">
                                        <div className="col-7 ">
                                            <h6>
                                                {isActive === "Neto" ? "Si recibís " : "Si cobrás "}
                                            </h6>
                                        </div>
                                        <div className="col-5">
                                            <h6 className="fs-24">
                                                $ {montoinicial === undefined ? "0" : montoinicial}
                                            </h6>
                                        </div>
                                    </article>
                                </div>
                                <div className="row px-5">
                                    <div className="col-12">
                                        <hr className="linea-separadora" />
                                    </div>
                                </div>
                                <div className="pt-3">
                                    <div className="ms-5">
                                        <article className="row">
                                            <div className="col-7 ">
                                                <h6 className=" fs-14">Arancel + IVA</h6>
                                            </div>
                                            <div className="col-5">
                                                <h6 className="fs-14">
                                                    ${" "}
                                                    {comisionMasIva === undefined ? "0" : comisionMasIva}
                                                </h6>
                                            </div>
                                        </article>
                                        <div className="row pt-2 pe-5 ">
                                            <div className="col-12">
                                                <hr className="linea-separadora" />
                                            </div>
                                        </div>
                                        <article className="row pt-4">
                                            <div className="col-7">
                                                <h6 className="fs-14">Costo financiero + IVA</h6>
                                            </div>
                                            <div className="col-5">
                                                <h6 className="fs-14">
                                                    ${" "}
                                                    {cuota === "1"
                                                        ? "0"
                                                        : costoTarjeta === undefined
                                                            ? "0"
                                                            : costoTarjeta}
                                                </h6>
                                            </div>
                                        </article>
                                        
                                            <div className="row pt-2 pe-5 ">
                                                <div className="col-12">
                                                    <hr className="linea-separadora" />
                                                </div>
                                            </div>
                                        
                                        <article className="row pt-3">
                                            <div className="col-7">
                                                
                                                    <h6 className="fs-14">Costo por anticipo + IVA</h6>
                                                
                                            </div>
                                            <div className="col-5">
                                               
                                                    <h6 className="fs-14">
                                                        $ {costoAnticipo === undefined ? "0" : costoAnticipo}
                                                    </h6>
                                                
                                            </div>
                                        </article>
                                        <div className="row pt-2 pe-5 ">
                                            <div className="col-12">
                                                <hr className="linea-separadora" />
                                            </div>
                                        </div>
                                        <article className="row pt-3">
                                            <div className="col-7 ">
                                                <h6 className="fs-14">Ret. Prov. (IIBB)</h6>
                                            </div>
                                            <div className="col-5">
                                                <h6 className="fs-14">
                                                    $ {alicuotaFinal === undefined ? "0" : alicuotaFinal}
                                                </h6>
                                            </div>
                                        </article>
                                        {/* <div className="row pt-2 pe-5 ">
                                            <div className="col-12">
                                                <hr className="linea-separadora" />
                                            </div>
                                        </div>
                                        <article className="row pt-3">
                                            <div className="col-7 ">
                                                <h6 className="fs-14">Ret. Ganancias</h6>
                                            </div>
                                            <div className="col-5">
                                                <h6 className="fs-14">
                                                    $ {gananciaFinal === undefined ? "0" : gananciaFinal}
                                                </h6>
                                            </div>
                                        </article>
                                        <div className="row pt-2 pe-5 ">
                                            <div className="col-12">
                                                <hr className="linea-separadora" />
                                            </div>
                                        </div>
                                        <article className="row pt-3">
                                            <div className="col-7 ">
                                                <h6 className="fs-14">Ret. IVA</h6>
                                            </div>
                                            <div className="col-5">
                                                <h6 className="fs-14">
                                                    $ {ivaFinal === undefined ? "0" : ivaFinal}
                                                </h6>
                                            </div>
                                        </article> */}
                                        <div className="row pt-2 pe-5 ">
                                            <div className="col-12">
                                                <hr className="linea-separadora" />
                                            </div>
                                        </div>
                                        <article className="row pt-3">
                                            <div className="col-7 ">
                                                <h6 className="fs-14">Cost. Transc.</h6>
                                            </div>
                                            <div className="col-5">
                                                <h6 className="fs-14">
                                                    $ {debcredFinal === undefined ? "0" : debcredFinal}
                                                </h6>
                                            </div>
                                        </article>
                                        <div className="row pt-2 pe-5 ">
                                            <div className="col-12">
                                                <hr className="linea-separadora" />
                                            </div>
                                        </div>
                                        <article className="row pt-2">
                                            <div className="col-7 ">
                                                <h6 className="color-verde ">
                                                    {isActive === "Neto" ? "Cobrás" : "Recibís "}
                                                </h6>
                                            </div>
                                            <div className="col-5">
                                                <h6 className="color-verde fs-24">
                                                    $ {montofinal === undefined ? "0" : montofinal}
                                                </h6>
                                            </div>
                                        </article>
                                    </div>
                                </div>
                            </section>
                            {showAnticipoInfo && (
                                <div className="container">
                                    <div className="">
                                        <h6 className="fs-12 lato-regular">
                                            <FontAwesomeIcon
                                                icon={faCircleExclamation}
                                                className="color-rojo me-2"
                                            />
                                            El Costo por Anticipo puede variar, dependiendo del plazo
                                            de acreditación que corresponda al tipo de pago
                                            seleccionado.
                                        </h6>
                                    </div>
                                </div>
                            )}
                        </section>
                    </div>
                </article>
            </div>
        </section>
    );
};

export default CalculadoraNueva;
