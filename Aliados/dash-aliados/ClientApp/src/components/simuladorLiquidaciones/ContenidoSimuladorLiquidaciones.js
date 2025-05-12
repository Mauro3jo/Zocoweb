import React, { useContext, useState, useEffect, useRef } from "react";
import { Controller, useForm } from "react-hook-form";
import { DarkModeContext } from "../../context/DarkModeContext";
import Select from "react-select";
import { faCircleExclamation } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { useNavigate } from "react-router-dom";
import {Modal} from 'react-bootstrap'
import OrdenPago from "./OrdenPago";
import HeaderOrden from "./HeaderOrden";
import FooterOrden from "./FooterOrden";
import './Modal.css'
import html2pdf from "html2pdf.js";






const ContenidoSimuladorLiquidaciones = () => {
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
    const navigate= useNavigate()

    // Nuevo estado para Bancarizadas/No Bancarizadas
    const [tipoTarjetaBanco, setTipoTarjetaBanco] = useState(null);
    const [showBancoOptions, setShowBancoOptions] = useState(false);
    const [datosGuardados, setDatosGuardados] = useState([]); // Almacenar datos acumulados
    const [historialDatos, setHistorialDatos] = useState([]); // Historial de envíos
    const [showModal, setShowModal] = useState(false);
    const modalContentRef = useRef(null);
    const [loading, setLoading] = useState(false); // Estado para el spinner de carga
    const [showDetailsModal, setShowDetailsModal] = useState(false); // Modal para detalles
    const [currentPage, setCurrentPage] = useState(1);
    const itemsPerPage = 3;
    const indexOfLastItem = currentPage * itemsPerPage;
const indexOfFirstItem = indexOfLastItem - itemsPerPage;
const reversedDatosGuardados = [...datosGuardados].reverse(); // Invertir el orden
const currentItems = reversedDatosGuardados.slice(indexOfFirstItem, indexOfLastItem);

const totalPages = Math.ceil(datosGuardados.length / itemsPerPage);
const handleNextPage = () => {
    if (currentPage < totalPages) {
        setCurrentPage(currentPage + 1);
    }
};

const handlePreviousPage = () => {
    if (currentPage > 1) {
        setCurrentPage(currentPage - 1);
    }
};

    // Función combinada de enviar datos y vista previa
    const enviarDatosYMostrarModal = async () => {
        try {
            setLoading(true);
            const response = await fetch("/api/calculadora/calculadoraliquidaciones", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify(datosGuardados),
            });

            if (!response.ok) {
                throw new Error(`HTTP error! status: ${response.status}`);
            }

            const result = await response.json();
            setHistorialDatos((prevHistorial) => [...prevHistorial, ...result]);
            setDatosGuardados([]); // Limpiar datos guardados después del envío
        } catch (error) {
            console.error("Error al enviar los datos:", error);
        } finally {
            setLoading(false);
            setShowModal(true); // Mostrar el modal después de enviar los datos
        }
    };

    // Función para eliminar un dato específico
    const eliminarDato = (index) => {
        setDatosGuardados((prevDatos) => prevDatos.filter((_, i) => i !== index));
    };
    
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
            const cuotaDebito = { value: "0", label: "Cuota 0" };
            setOptionsCuotas([cuotaDebito]); // Solo una opción: Cuota 0
            setValue("cuota", cuotaDebito); // Forzar cuota a 0 en el formulario
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

    const onSubmit = (data) => {
        const token = sessionStorage.getItem("token") || "default-token";
        const cuotaFinal = data.radio === "Debito" ? "0" : data.cuota?.value || "0";
        const nuevoDato = {
            Token: token,
            Monto: data.netoBuscar.toString(),
            Cuota: cuotaFinal,
            TipoNetoBruto: "Bruto",
            TipoDebCred: data.radio,
            TipoTarjeta: data.tarjeta.value,
            Tarjeta: data.tarjeta.label,
            TipoTarjetaBanco: tipoTarjetaBanco,
        };

        // Guardar el nuevo dato en el estado
        setDatosGuardados((prevDatos) => [...prevDatos, nuevoDato]);
        // console.log("Dato guardado localmente:", nuevoDato);
        
    };
    const enviarDatosGuardados = async () => {
        try {
            const response = await fetch("/api/calculadora/calculadoraliquidaciones", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify(datosGuardados), // Enviar todos los datos acumulados
                
            });

            if (!response.ok) {
                throw new Error(`HTTP error! status: ${response.status}`);
            }

            const result = await response.json();
        console.log("Datos enviados correctamente:", result);

        // // Depurar: Verificar contenido de result y el estado previo
         console.log("Contenido de result:", result);
         console.log("Estado previo de historialDatos:", historialDatos);

        // Asegurarse de que el estado se actualiza correctamente
        setHistorialDatos((prevHistorial) => {
            const actualizado = [...prevHistorial, ...result]; // Combinar los datos previos con los nuevos
            console.log("Estado actualizado de historialDatos:", actualizado); // Verificar el nuevo estado
            return actualizado;
        });
            

            // Limpiar el estado después de enviar
            setDatosGuardados([]);
        } catch (error) {
            console.error("Error al enviar los datos:", error);
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
    } = formData || [];

    const handleVistaPrevia=()=>{
        const token = sessionStorage.getItem("token");
        console.log(historialDatos)

    if (!token) {
        
        console.error("Error: No se encontró el token.");
        // navigate("/login");
        return;
    }
    //setShowModal(true); // Mostrar el modal  
    navigate('/Admin/pdforden', { state: { historialDatos } })
    }
    const handleCloseModal = () => {
        setShowModal(false); // Cerrar el modal
    };
    const handleExportToPDF = () => {
        const element = modalContentRef.current; // Elemento que será transformado en PDF
        const options = {
            margin: 1,
            filename: "VistaPrevia.pdf",
            image: { type: "jpeg", quality: 0.98 },
            html2canvas: { scale: 2 }, // Aumenta la resolución del canvas
            jsPDF: { unit: "in", format: "a4", orientation: "portrait" }, // Tamaño A4
        };

        html2pdf().set(options).from(element).save();
    };
    const handleShowModal = ()=>{
        setShowModal(true)
    }

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
                                {/* <article>
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
                                </article> */}
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
                                {/* Botón para guardar los datos en el estado */}
                                <button
                                    className="btn-calculadora2 text-white border-0"
                                    type="submit"
                                >
                                    <div className="d-flex justify-content-center border-0">
                                        <span className="text-white lato-bold fs-18">Guardar Dato</span>
                                    </div>
                                </button>

                                {/* Botón para enviar todos los datos guardados */}
                                <button
                                    className="btn-calculadora2 text-white border-0 mx-2"
                                    type="button"
                                    onClick={enviarDatosYMostrarModal}
                                >
                                    <div className="d-flex justify-content-center border-0">
                                        <span className="text-white lato-bold fs-18">Vista Previa</span>
                                    </div>
                                </button>
                                {/* <button
                                className="btn-calculadora2 text-white border-0 mx-2"
                                type="button"
                                onClick={handleShowModal}
                            >
                                <div className="d-flex justify-content-center border-0">
                                <span className="text-white lato-bold fs-18">Vista Previa</span>
                                </div>
                                
                            </button> */}
                            </div>
                            <div className="pt-2 container">
                                <h6 className="fs-14 lato-regular">
                                    <FontAwesomeIcon icon={faCircleExclamation} /> Indicá si
                                    querés saber cuánto vas a cobrar por un producto o cuánto vas
                                    a recibir por una venta, seleccioná el tipo de pago, la
                                    tarjeta y la cantidad de cuotas, luego tocá en Guardar Dato.
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
                <h6 className="lato-bold fs-16">Resumen de Datos Guardados</h6>
            </div>
            <section className="pt-2 pb-2">
                <div className="text-center">
                    <h5 className="fs-18">
                        Has guardado{" "}
                        <span style={{color:"#b4c400"}} className="fs-18">
                            {datosGuardados.length}
                        </span>{" "}
                        {datosGuardados.length === 1 ? "dato" : "datos"}.
                    </h5>
                </div>
                <div className="text-center pt-4">
    
    <table className="table table-borderless responsive striped hover">
        <thead  className="bg-dark py-2">
            <tr className="text-center tabla-thead">
                
                <th  className={
                                                darkMode
                                                    ? "bg-white text-dark border-tabla-izquierda border-0 lato-regular fs-12 py-3"
                                                    : "bg-dark text-white border-tabla-izquierda border-0 lato-regular fs-12 py-3"
                                            }
                                            scope="col">Monto</th>
                <th  className={
                                                darkMode
                                                    ? "bg-white text-dark border-tabla border-0 lato-regular fs-12 py-3"
                                                    : "bg-dark text-white border-tabla border-0 lato-regular fs-12 py-3"
                                            }
                                            scope="col">Cuota</th>
                <th  className={
                                                darkMode
                                                    ? "bg-white text-dark border-tabla border-0 lato-regular fs-12 py-3"
                                                    : "bg-dark text-white border-tabla border-0 lato-regular fs-12 py-3"
                                            }
                                            scope="col">Tipo Tarjeta</th>
                <th  className={
                                                darkMode
                                                    ? "bg-white text-dark border-tabla-derecha border-0 lato-regular fs-12 py-3"
                                                    : "bg-dark text-white border-tabla-derecha border-0 lato-regular fs-12 py-3"
                                            }
                                            scope="col">Acciones</th>
            </tr>
        </thead>
        <tbody  className="text-center">
            {currentItems.map((dato, index) => (
                <tr className={
                    darkMode ? "bg-dark text-white" : "bg-white text-dark"
                } key={index}>
                    <td  className={
                                                        darkMode
                                                            ? "fs-12 lato-bold py-4 prority-4 text-white "
                                                            : "fs-12 lato-bold py-4 prority-4 "
                                                    }>{dato.Monto}</td>
                    <td  className={
                                                        darkMode
                                                            ? "fs-12 lato-bold py-4 prority-4 text-white "
                                                            : "fs-12 lato-bold py-4 prority-4 "
                                                    }>{dato.Cuota}</td>
                    <td  className={
                                                        darkMode
                                                            ? "fs-12 lato-bold py-4 prority-4 text-white "
                                                            : "fs-12 lato-bold py-4 prority-4 "
                                                    }>{dato.TipoTarjeta}</td>
                    <td   className={
                                                        darkMode
                                                            ? "fs-12 lato-bold py-4 prority-4 text-white "
                                                            : "fs-12 lato-bold py-4 prority-4 "
                                                    }>
                        <button
                            className="btn btn-danger btn-sm"
                            onClick={() => eliminarDato(indexOfFirstItem + index)}
                        >
                            Eliminar
                        </button>
                    </td>
                </tr>
            ))}
        </tbody>
    </table>
    {totalPages >1?( <div className="d-flex justify-content-around align-items-center mt-3">
        <button
            className="btn-publicar border-0 mx-1"
            style={{
                width: "180px",
                height: "44px",
                background: "#B4C400",
                color: "#FFFFFF",
                borderRadius: "32px",
              }}
            onClick={handlePreviousPage}
            disabled={currentPage === 1}
        >
            Anterior
        </button>
        
        <span>
            Página {currentPage} de {totalPages}
        </span>
        <button
           className="btn-publicar border-0 mx-1"
           style={{
               width: "180px",
               height: "44px",
               background: "#B4C400",
               color: "#FFFFFF",
               borderRadius: "32px",
             }}
            onClick={handleNextPage}
            disabled={currentPage === totalPages}
        >
            Siguiente
        </button>
    </div>

):(
    <p>{""}</p>
)}

    {/* Paginación */}
   
</div>
                
            </section>
        </section>
    </div>
                </article>
            </div>

            
                <Modal
                show={showModal} onHide={handleCloseModal} size="xl">
                        <Modal.Header closeButton>
                          <Modal.Title>
                            Vista Previa
                          </Modal.Title>
                        </Modal.Header>
                        <Modal.Body ref={modalContentRef} className="modal-body">
                  
                    {/* <HeaderOrden/> */}
                    {loading ? (
                        <div className="d-flex justify-content-center">
                            <div className="spinner-border text-primary" role="status">
                                <span className="visually-hidden">Loading...</span>
                            </div>
                        </div>
                    ) : (
                        <OrdenPago historialDatos={historialDatos} />
                    )}
                    {/* <FooterOrden historialDatos={historialDatos}/> */}
                </Modal.Body>
                <Modal.Footer>
                    <button className="btn btn-primary" onClick={handleVistaPrevia}>
                        Imprimir
                    </button>
                    <button className="btn btn-secondary" onClick={handleCloseModal}>
                        Cerrar
                    </button>
                </Modal.Footer>
            </Modal>
            {/* <Modal show={showDetailsModal} onHide={() => setShowDetailsModal(false)} size="lg">
                <Modal.Header closeButton>
                    <Modal.Title>Detalles de Datos Guardados</Modal.Title>
                </Modal.Header>
                <Modal.Body>
                    <table className="table">
                        <thead>
                            <tr>
                                <th>#</th>
                                <th>Monto</th>
                                <th>Cuota</th>
                                <th>Tipo Tarjeta</th>
                                <th>Acciones</th>
                            </tr>
                        </thead>
                        <tbody>
                            {datosGuardados.map((dato, index) => (
                                <tr key={index}>
                                    <td>{index + 1}</td>
                                    <td>{dato.Monto}</td>
                                    <td>{dato.Cuota}</td>
                                    <td>{dato.TipoTarjeta}</td>
                                    <td>
                                        <button
                                            className="btn btn-danger btn-sm"
                                            onClick={() => eliminarDato(index)}
                                        >
                                            Eliminar
                                        </button>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </Modal.Body>
                <Modal.Footer>
                    <button className="btn btn-secondary" onClick={() => setShowDetailsModal(false)}>
                        Cerrar
                    </button>
                </Modal.Footer>
            </Modal> */}
           
        </section>
    );
};

export default ContenidoSimuladorLiquidaciones;
