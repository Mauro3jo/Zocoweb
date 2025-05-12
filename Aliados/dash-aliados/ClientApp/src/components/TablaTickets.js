// import hoja de estilos css
import "./TablaTickets.css";

// import hooks
import { useContext, useEffect, useState } from "react";

// import context
import { DarkModeContext } from "../context/DarkModeContext";

// import librerias
import jsPDF from "jspdf";
import "jspdf-autotable";
import { Hourglass } from "react-loader-spinner";

// import componentes
import ItemsTablaTicket from "./ItemsTablaTicket";

// import assets
import pdf from "../assets/img/pdf.png";
import xls from "../assets/img/xls.png";

const TablaTickets = ({ listaMes, datos }) => {
  // estado para controlar la descarga excel
  const [descargando, setDescargando] = useState(false);

  // estado para controlar la descarga pdf
  const [descargando2, setDescargando2] = useState(false);

  // context para manejar la modalidad claro/oscuro
  const { darkMode } = useContext(DarkModeContext);

  // guardo en una variable la lista del mes,
  // la inicializo para que arranque con un valor por defecto
  const listaDelMes = listaMes || [];

  // estado para manejar la busqueda por fecha
  const [busqueda, setBusqueda] = useState("");

  // estado para guardar la lista de los resultados filtrados
    const [resultadosFiltrados, setResultadosFiltrados] = useState([]);
  // api url para la consulta del pdf
  const apiUrlPdf = process.env.REACT_APP_API_PDF;

  // api url para la consulta de excel
  const apiUrlExcel = process.env.REACT_APP_API_EXCEL;
    const [descargandoAnual, setDescargandoAnual] = useState(false);

  // funcion para controlar los caracteres ingresado por el usuario.
  const handleSearchChange = (e) => {
    setBusqueda(e.target.value);
  };
    const apiUrlExcelAnual = "/api/excel/anual";

  // funcion para buscar la fecha y al resultado lo guarda en el estado resultadoFiltrados
  const buscarFecha = () => {
    const busquedaLower = busqueda.toLowerCase();
    const resultados = listaDelMes.filter((item) =>
      item.fecha.toLowerCase().includes(busquedaLower)
    );
    setResultadosFiltrados(resultados);
  };

  // Función para manejar la descarga de Excel
  const manejarClicDescarga = async () => {
    // Desactivar el botón al iniciar la descarga
    setDescargando(true);
    const token = sessionStorage.getItem("token");

    // trae los datos actuales
    const fechaActual = new Date();
    const año = datos?.anio || fechaActual.getFullYear();
    const mes = datos?.mes || fechaActual.getMonth() + 1;
    let comercio = datos?.comercio || "Todos";

    try {
      const respuesta = await fetch(apiUrlExcel, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          token: token,
          Year: año,
          Month: mes,
          comercio: comercio,
        }),
      });

      if (!respuesta.ok) {
        throw new Error("La respuesta de la red no fue correcta");
      }

      const blob = await respuesta.blob();
      const urlDescarga = window.URL.createObjectURL(blob);
      // Función para limpiar el nombre del comercio
      const limpiarNombreComercio = (nombre) => {
        return nombre.replace(/[^a-zA-Z0-9]/g, "_");
      };

      comercio = limpiarNombreComercio(comercio);
      // Crear el enlace con el nombre de archivo deseado
      const enlace = document.createElement("a");
      enlace.href = urlDescarga;
      // Incluye el nombre del comercio en el nombre del archivo
      enlace.setAttribute(
        "download",
        `reporte_Zoco_${comercio}_${año}-${mes}.xlsx`
      );
      document.body.appendChild(enlace);
      enlace.click();
      enlace.parentNode.removeChild(enlace);
      setDescargando(false);
    } catch (error) {
      console.error("Hubo un error:", error);
      setDescargando(false);
    }
  };

  // funcion para manejar la descarga pdf
    const manejarClicDescargaPdf = async () => {
        setDescargando2(true);

        const token = sessionStorage.getItem("token");

        const fechaActual = new Date();
        const año = datos?.anio || fechaActual.getFullYear();
        const mes = datos?.mes || fechaActual.getMonth() + 1;
        const comercio = datos?.comercio || "Todos";

        try {
            const respuesta = await fetch(apiUrlPdf, {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify({
                    token: token,
                    Year: año,
                    Month: mes,
                    comercio: comercio,
                }),
            });

            if (!respuesta.ok) {
                throw new Error("La respuesta de la red no fue correcta");
            }
            const respuestaJson = await respuesta.json();

            const { datos: datosFiltrados, sumas, cuit } = respuestaJson;
           
            const doc = new jsPDF();

            const titulo = "Detalle de Operaciones " + mes + "/" + año + " CUIT/CUIL N°" + cuit;

            // Obtener el ancho de la página
            const anchoPagina = doc.internal.pageSize.getWidth();

            // Obtener el ancho del título
            const anchoTitulo =
                (doc.getStringUnitWidth(titulo) * doc.internal.getFontSize()) /
                doc.internal.scaleFactor;

            // Calcular la posición x centrada
            const posXCentrada = (anchoPagina - anchoTitulo) / 2;

            // Agregar el título centrado en la primera página
            doc.text(titulo, posXCentrada, 10);

            // Crear la tabla de sumas
            const tablaSumas = [
                ["Bruto", sumas.bruto],
                ["Costo Fin.", sumas.costoFinancieroEn],
                ["Costo Ant", sumas.costoPorAnticipo],
                ["Arancel", sumas.arancel],
                ["IVA Arancel", sumas.ivaArancel],
                ["Cost. transc.", sumas.impDebitoCredito],
                ["Reten. IIBB", sumas.retencionIIBB],
                ["Ret. Ganancia", sumas.retencionGanancia],
                ["Ret. IVA", sumas.retencionIVA],
                ["Total OP", sumas.totalOP],
            ].map((item) => [item[0], `$${item[1]}`]);

            doc.autoTable({
                body: tablaSumas,
                styles: {
                    fillColor: [255, 255, 255], // Fondo blanco para todas las filas
                },
                alternateRowStyles: {
                    fillColor: [255, 255, 255], // Asegura que no haya alternancia en las filas
                },
            });

            // Definición de la cabecera de la tabla principal
            const head = [
                [
                    "TERMINAL",
                    "N OP",
                    "Fecha OP",
                    "Fecha Pago",
                    "N Cupón",
                    "N Tarjeta",
                    "Tarjeta",
                    "Cuotas",
                    "Bruto",
                    "Costo Fin.",
                    "Costo Ant",
                    "Arancel",
                    "IVA Arancel",
                    "Cost. transc.",
                    "Reten. IIBB",
                    "Ret. Ganancia",
                    "Ret. IVA",
                    "Total OP",
                ],
            ];

            // Configuración de la tabla principal
            doc.autoTable({
                head: head,
                body: datosFiltrados.map((item) => [
                    item.terminal,
                    item.nroOperacion,
                    item.fechaOperacion,
                    item.fechaPago,
                    item.nroCupon,
                    item.nroTarjeta,
                    item.tarjeta,
                    item.cuotas,
                    item.bruto,
                    item.costoFinancieroEn,
                    item.costoPorAnticipo,
                    item.arancel,
                    item.ivaArancel,
                    item.impDebitoCredito,
                    item.retencionIIBB,
                    item.retencionGanancia,
                    item.retencionIVA,
                    item.totalOP,
                ]),
                styles: {
                    fontSize: 6,
                    cellPadding: 1,
                    overflow: "visible",
                    valign: "middle",
                    halign: "center",
                    fillColor: [255, 255, 255], // Fondo blanco para todas las filas
                },
                columnStyles: {
                    0: { cellWidth: "auto" },
                },
                headStyles: {
                    fillColor: [255, 255, 255],
                    textColor: [0, 0, 0],
                    fontStyle: "bold",
                },
                alternateRowStyles: {
                    fillColor: [255, 255, 255], // Asegura que no haya alternancia en las filas
                },
                didDrawPage: (data) => {
                    // Agregar fondo en cada nueva página si es necesario
                    /* if (data.pageCount > 1) {
                      agregarFondo();
                    }*/
                },
            });

            // Guardar el documento PDF
            doc.save(`reporte_Zoco_${año}-${mes}.pdf`);

            setDescargando2(false);
        } catch (error) {
            console.error("Hubo un error:", error);
            setDescargando2(false);
        }
    };
    const manejarClicDescargaAnual = async () => {
        setDescargandoAnual(true);
        const token = sessionStorage.getItem("token");

        const fechaActual = new Date();
        const año = datos?.anio || fechaActual.getFullYear();
        let comercio = datos?.comercio || "Todos";

        try {
            const respuesta = await fetch(apiUrlExcelAnual, {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify({
                    token: token,
                    Year: año,
                    comercio: comercio,
                }),
            });

            if (!respuesta.ok) throw new Error("Error al generar Excel anual");

            const blob = await respuesta.blob();
            const urlDescarga = window.URL.createObjectURL(blob);

            const limpiarNombreComercio = (nombre) => nombre.replace(/[^a-zA-Z0-9]/g, "_");
            comercio = limpiarNombreComercio(comercio);

            const enlace = document.createElement("a");
            enlace.href = urlDescarga;
            enlace.setAttribute("download", `reporte_anual_Zoco_${comercio}_${año}.xlsx`);
            document.body.appendChild(enlace);
            enlace.click();
            enlace.parentNode.removeChild(enlace);
        } catch (error) {
            console.error("Error en descarga anual:", error);
        }

        setDescargandoAnual(false);
    };



  // use effect para llamar a la funcion buscar fecha
  // y en el array de dependencia utiliza datos y busqueda
  // para actualizarlos por pantalla.
  useEffect(() => {
    buscarFecha();
  }, [datos, busqueda]);

    return (
        <section>
            <section className="container mt-3 mb-3 ">
                <div className="d-flex flex-wrap justify-content-between ">
                    <div className="margin-centrado-responsive">
                        <div className="my-3 d-flex">
                            <h6 className="my-3 me-3 fs-18-a-16">Buscar por fecha: </h6>
                            <div className="campo-busqueda">
                                <input
                                    type="number"
                                    value={busqueda}
                                    onChange={handleSearchChange}
                                    className={
                                        darkMode
                                            ? " form-control text-white label-buscador-dark lato-regular fs-18 border-0"
                                            : "form-control label-buscador lato-regular fs-18 border-0"
                                    }
                                    placeholder="01-01-2024"
                                />
                            </div>
                        </div>
                    </div>
                    <div className="d-flex centrado-responsive">
                        {/* Botón PDF */}
                        <div className="">
                            <button
                                className={
                                    descargando2
                                        ? "btn-pdf-descargar-disabled centrado border-0 mx-2"
                                        : "btn-pdf-descargar centrado border-0 mx-2"
                                }
                                disabled={descargando2}
                                onClick={manejarClicDescargaPdf}
                            >
                                <div className="my-3">
                                    <div className="text-center">
                                        {descargando2 ? (
                                            <Hourglass
                                                visible={true}
                                                height="40"
                                                width="40"
                                                ariaLabel="hourglass-loading"
                                                colors={["#b4c400 ", "#000000 "]}
                                            />
                                        ) : (
                                            <img className="img-fluid icono-pdf-xls mb-1" src={pdf} alt="PDF" />
                                        )}
                                    </div>
                                    <div className="d-flex justify-content-center align-items-center">
                                        <h6 className="text-white lato-bold fs-12">
                                            {descargando2 ? "Cargando..." : "Descargar PDF"}
                                        </h6>
                                    </div>
                                </div>
                            </button>
                        </div>

                        {/* Botón Excel mensual */}
                        <div className="">
                            <button
                                className={
                                    descargando
                                        ? "btn-pdf-descargar-disabled centrado border-0 mx-2"
                                        : "btn-pdf-descargar centrado border-0 mx-2"
                                }
                                disabled={descargando}
                                onClick={manejarClicDescarga}
                            >
                                <div className="my-3">
                                    <div className="text-center">
                                        {descargando ? (
                                            <Hourglass
                                                visible={true}
                                                height="40"
                                                width="40"
                                                ariaLabel="hourglass-loading"
                                                colors={["#b4c400 ", "#000000 "]}
                                            />
                                        ) : (
                                            <img className="img-fluid icono-pdf-xls mb-1" src={xls} alt="Excel" />
                                        )}
                                    </div>
                                    <div className="d-flex justify-content-center align-items-center">
                                        <h6 className="text-white lato-bold fs-12">
                                            {descargando ? "Cargando..." : "Descargar Excel"}
                                        </h6>
                                    </div>
                                </div>
                            </button>
                        </div>

                        {/* Botón Excel anual */}
                        <div className="">
                            <button
                                className={
                                    descargandoAnual
                                        ? "btn-pdf-descargar-disabled centrado border-0 mx-2"
                                        : "btn-pdf-descargar centrado border-0 mx-2"
                                }
                                disabled={descargandoAnual}
                                onClick={manejarClicDescargaAnual}
                            >
                                <div className="my-3">
                                    <div className="text-center">
                                        {descargandoAnual ? (
                                            <Hourglass
                                                visible={true}
                                                height="40"
                                                width="40"
                                                ariaLabel="hourglass-loading"
                                                colors={["#b4c400 ", "#000000 "]}
                                            />
                                        ) : (
                                            <img className="img-fluid icono-pdf-xls mb-1" src={xls} alt="Excel Anual" />
                                        )}
                                    </div>
                                    <div className="d-flex justify-content-center align-items-center">
                                        <h6 className="text-white lato-bold fs-12">
                                            {descargandoAnual ? "Cargando..." : "Excel Anual"}
                                        </h6>
                                    </div>
                                </div>
                            </button>
                        </div>
                    </div>
                </div>
            </section>

            <div
                className={
                    darkMode
                        ? " container table-responsive py-5 bg-tabla-calculadora-dark my-5"
                        : "container table-responsive py-5 bg-tabla-calculadora my-5"
                }
            >
                <table className="table table-borderless responsive striped hover">
                    <thead className="border-0 ">
                        <tr className="text-center tabla-thead">
                            <th
                                className={
                                    darkMode
                                        ? " bg-white text-dark border-tabla-izquierda border-0 lato-regular fs-12 py-3 priority-1 "
                                        : "bg-dark text-white border-tabla-izquierda border-0 lato-regular fs-12 py-3  priority-1"
                                }
                                scope="col "
                            >
                                Fecha <br /> de pago
                            </th>
                            <th
                                className={
                                    darkMode
                                        ? " bg-white text-dark border-0 lato-regular fs-12 py-3  priority-2"
                                        : "bg-dark text-white fs-12 lato-regular py-3   priority-2"
                                }
                                scope="col"
                            >
                                Bruto
                            </th>
                            <th
                                className={
                                    darkMode
                                        ? " bg-white text-dark border-0 lato-regular fs-12 py-3 priority-3"
                                        : "bg-dark text-white fs-12 lato-regular py-3  priority-3"
                                }
                                scope="col"
                            >
                                Costo <br /> Fin.
                            </th>
                            <th
                                className={
                                    darkMode
                                        ? " bg-white text-dark border-0 lato-regular fs-12 py-3  priority-4"
                                        : "bg-dark text-white fs-12 lato-regular py-3  priority-4"
                                }
                                scope="col"
                            >
                                Arancel
                            </th>
                            <th
                                className={
                                    darkMode
                                        ? " bg-white text-dark border-0 lato-regular fs-12 py-3 priority-5"
                                        : "bg-dark text-white fs-12 lato-regular py-3  priority-5"
                                }
                                scope="col"
                            >
                                IVA <br /> Arancel
                            </th>
                            <th
                                className={
                                    darkMode
                                        ? " bg-white text-dark border-0 lato-regular fs-12 py-3 priority-6"
                                        : "bg-dark text-white fs-12 lato-regular py-3 priority-6"
                                }
                                scope="col"
                            >
                                Cost. transc.
                            </th>
                            <th
                                className={
                                    darkMode
                                        ? " bg-white text-dark border-0 lato-regular fs-12 py-3 priority-7"
                                        : "bg-dark text-white fs-12 lato-regular py-3 priority-7"
                                }
                                scope="col"
                            >
                                Reten. <br /> IIBB
                            </th>
                            <th
                                className={
                                    darkMode
                                        ? " bg-white text-dark border-0 lato-regular fs-12 py-3 priority-8"
                                        : "bg-dark text-white fs-12 lato-regular py-3  priority-8"
                                }
                                scope="col"
                            >
                                Ret. <br /> Ganancía
                            </th>
                            <th
                                className={
                                    darkMode
                                        ? " bg-white text-dark border-0 lato-regular fs-12 py-3 priority-9"
                                        : "bg-dark text-white fs-12 lato-regular py-3 priority-9"
                                }
                                scope="col"
                            >
                                Ret. <br /> IVA
                            </th>
                            <th className="bg-verde text-white lato-regular py-3 " scope="col">
                                TOTAL
                            </th>
                            <th
                                className={
                                    darkMode
                                        ? " bg-white text-dark border-0 lato-regular fs-12 py-3 priority-1 border-tabla-derecha "
                                        : "bg-dark text-white fs-12 lato-regular py-3 priority-1 border-tabla-derecha "
                                }
                                scope="col"
                            >
                                Orden de Pago
                            </th>
                        </tr>
                    </thead>
                    <tbody className="text-center">
                        {resultadosFiltrados.length > 0 ? (
                            resultadosFiltrados.map((dato, id) => (
                                <ItemsTablaTicket {...dato} key={id} />
                            ))
                        ) : (
                            <tr>
                                <td colSpan={11} className="lato-bold fs-12-a-10">
                                    No se encontraron resultados para esta fecha.
                                </td>
                            </tr>
                        )}
                    </tbody>
                </table>
            </div>
        </section>
    );

};

export default TablaTickets;
