import React, { useEffect, useState, useRef } from "react";
import { Button, Table, Spinner, Form, Col, Row } from "react-bootstrap";
import Swal from "sweetalert2";
import { DarkModeContext } from "../../context/DarkModeContext";
import { useContext } from "react";
import Select from "react-select";
import jsPDF from "jspdf";
import html2canvas from "html2canvas";
import  ModalAhorroAliado  from "../../components/administracion/ModalAhorroAliado";
const ResumenAliado = () => {
    const [cuit, setCuit] = useState("");
    const [datos, setDatos] = useState([]);
    const [facturacionDatos, setFacturacionDatos] = useState([]);
    const [ahorroAliadoDatos, setAhorroAliadoDatos] = useState([]); // Nueva variable para almacenar ahorro aliado
    console.log("vista",ahorroAliadoDatos);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);
    const { darkMode } = useContext(DarkModeContext);
    const [terminales, setTerminales] = useState([]);
    const [selectedTerminal, setSelectedTerminal] = useState(null);

    const apiUrl = "/api/resumenaliado/gestionesaliados";
    const apiFacturacionUrl = "/api/resumenaliado/gestionesaliadosfacturacion";
    const apiAhorroAliadoUrl = "/api/resumenaliado/ahorroaliado"; // Nueva API agregada

    const gestionesRef = useRef(null);
    const datosComercialesRef = useRef(null);

    const [mostrarTotalMes, setMostrarTotalMes] = useState(0);
    const [mostrarMejorDia, setMostrarMejorDia] = useState("Sin datos");
    const [facturacionMejorDia, setFacturacionMejorDia] = useState(0);
    const [mostrarPeorDia, setMostrarPeorDia] = useState("Sin datos");
    const [facturacionPeorDia, setFacturacionPeorDia] = useState(0);

    const [totalBrutoDebitoMes, setTotalBrutoDebitoMes] = useState(0);
    const [totalBrutoCreditoMes, setTotalBrutoCreditoMes] = useState(0);
    const [totalBruto1PagoMes, setTotalBruto1PagoMes] = useState(0);
    const [totalOperacionesMes, setTotalOperacionesMes] = useState(0);
    const [showModal, setShowModal] = useState(false);

    useEffect(() => {
        if (facturacionDatos.length > 0) {
            const terminalesUnicas = facturacionDatos
                .filter((item) => item.nDeTerminal && item.nombreDeFantasia)
                .map((item) => ({
                    value: item.nDeTerminal,
                    label: `${item.nDeTerminal} - ${item.nombreDeFantasia}`,
                }));
            setTerminales(terminalesUnicas);
        }
    }, [facturacionDatos]);

    useEffect(() => {
        if (selectedTerminal) {
            const terminalFacturacion = facturacionDatos.find(
                (data) => String(data.nDeTerminal) === String(selectedTerminal.value)
            );
            if (terminalFacturacion) {
                setMostrarTotalMes(terminalFacturacion.totalBrutoTerminalMes);
                setMostrarMejorDia(terminalFacturacion.mejorDiaFacturacion);
                setFacturacionMejorDia(terminalFacturacion.facturacionMejorDia);
                setMostrarPeorDia(terminalFacturacion.peorDiaFacturacion);
                setFacturacionPeorDia(terminalFacturacion.facturacionPeorDia);

                setTotalBrutoDebitoMes(terminalFacturacion.totalBrutoDebitoMes || 0);
                setTotalBrutoCreditoMes(terminalFacturacion.totalBrutoCreditoMes || 0);
                setTotalBruto1PagoMes(terminalFacturacion.totalBruto1PagoMes || 0);
                setTotalOperacionesMes(terminalFacturacion.totalOperacionesMes || 0);
            }
        } else {
            const totalData = getTotalData();
            setMostrarTotalMes(totalData.totalBrutoCUITMes || 0);
            setMostrarMejorDia(totalData.mejorDiaFacturacionCUIT || "Sin datos");
            setFacturacionMejorDia(totalData.facturacionMejorDiaCUIT || 0);
            setMostrarPeorDia(totalData.peorDiaFacturacionCUIT || "Sin datos");
            setFacturacionPeorDia(totalData.facturacionPeorDiaCUIT || 0);

            setTotalBrutoDebitoMes(totalData.totalDebitoCUITMes || 0);
            setTotalBrutoCreditoMes(totalData.totalCreditoCUITMes || 0);
            setTotalBruto1PagoMes(totalData.total1PagoCUITMes || 0);
            setTotalOperacionesMes(totalData.totalOperacionesCUITMes || 0);
        }
    }, [selectedTerminal, facturacionDatos]);

    const handleFetchData = async () => {
        const token = sessionStorage.getItem("token");
        if (!token) {
            Swal.fire("Error", "No hay token disponible", "error");
            return;
        }

        setLoading(true);
        setSelectedTerminal(null);

        try {
            const response = await fetch(apiUrl, {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify({ Token: token, Cuit: cuit }),
            });

            if (!response.ok) {
                throw new Error(`Error: ${response.status}`);
            }

            const result = await response.json();
            setDatos(result);
            await fetchFacturacionData(token, cuit);
            await fetchAhorroAliadoData(token, cuit); // Se agrega la nueva API aquí
        } catch (err) {
            setError(err.message);
        } finally {
            setLoading(false);
        }
    };

    const fetchFacturacionData = async (token, cuit) => {
        try {
            const response = await fetch(apiFacturacionUrl, {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify({ Token: token, Cuit: cuit }),
            });

            if (!response.ok) {
                throw new Error(`Error: ${response.status}`);
            }

            const facturacionResult = await response.json();
            setFacturacionDatos(facturacionResult);
        } catch (err) {
            Swal.fire("Error", `Error al obtener la facturación: ${err.message}`, "error");
        }
    };

    const fetchAhorroAliadoData = async (token, cuit) => {
        try {
            const response = await fetch(apiAhorroAliadoUrl, {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify({ Token: token, Cuit: cuit }),
            });

            if (!response.ok) {
                throw new Error(`Error: ${response.status}`);
            }

            const ahorroAliadoResult = await response.json();
            setAhorroAliadoDatos(ahorroAliadoResult); // Solo guardamos la variable sin modificar facturacionDatos

        } catch (err) {
            Swal.fire("Error", `Error al obtener datos de ahorro aliado: ${err.message}`, "error");
        }
    };

    const getTotalData = () => {
        return (
            facturacionDatos.find(
                (data) =>
                    data.hasOwnProperty("facturacionMejorDiaCUIT") &&
                    data.hasOwnProperty("totalBrutoCUITMes")
            ) || {}
        );
    };

    const handleTerminalSelect = (selectedOption) => {
        setSelectedTerminal(selectedOption);
    };




    const downloadPDF = async () => {
        const pdf = new jsPDF("p", "mm", "a4");
        const pdfWidth = pdf.internal.pageSize.getWidth();
    
        // Captura los datos de "Mejor día del mes" y otros
       
       
        // Captura los datos de la tabla con scroll
        const tableContainer = gestionesRef.current;
        const tableRows = tableContainer.querySelectorAll("tr");
        let currentY = 10; // Margen inicial en la página del PDF
        const margin = 10;
    
        for (let i = 0; i < tableRows.length; i++) {
            const rowCanvas = await html2canvas(tableRows[i]);
            const rowImgData = rowCanvas.toDataURL("image/png");
            const rowHeight = (rowCanvas.height * pdfWidth) / rowCanvas.width;
    
            // Agrega fila por fila al PDF
            if (currentY + rowHeight > pdf.internal.pageSize.getHeight() - margin) {
                pdf.addPage(); // Añade una nueva página si no hay espacio
                currentY = margin; // Reinicia la posición Y
            }
    
            pdf.addImage(rowImgData, "PNG", margin, currentY, pdfWidth - 2 * margin, rowHeight);
            currentY += rowHeight + 5; // Incrementa la posición Y con margen entre filas
        }
        pdf.addPage()
        const gestionesCanvas = await html2canvas(datosComercialesRef.current);
        const gestionesImgData = gestionesCanvas.toDataURL("image/png");
        const pdfHeight = (gestionesCanvas.height * pdfWidth) / gestionesCanvas.width;
    
        pdf.addImage(gestionesImgData, "PNG", 0, 0, pdfWidth, pdfHeight);
    
    
        // Guarda el PDF
        pdf.save("ResumenAliado.pdf");
    };


  return (
    <div className="container">
                <Row ref={datosComercialesRef}>
                    <article className="col-12 col-md-6 col-lg-4 d-flex flex-column py-2">
                        <h6 className="text-center lato-bold fs-17">Mejor día del mes</h6>
                        <button
                            className={
                                darkMode
                                    ? "bg-data-dark border-0 quitar-cursor-pointer flex-grow-1"
                                    : "container-light bg-data border-0 quitar-cursor-pointer flex-grow-1"
                            }
                        >
                            <div className="d-flex justify-content-center border-0 lato-bold-a-lato-500 fs-22">
                                {mostrarMejorDia} ({facturacionMejorDia.toLocaleString("es-AR", { style: "currency", currency: "ARS" })})
                            </div>
                        </button>
                    </article>
                    <article className="col-12 col-md-6 col-lg-4 d-flex flex-column py-2">
                        <h6 className="text-center lato-bold fs-17">Peor día del mes</h6>
                        <button
                            className={
                                darkMode
                                    ? "bg-data-dark border-0 quitar-cursor-pointer flex-grow-1"
                                    : "container-light bg-data border-0 quitar-cursor-pointer flex-grow-1"
                            }
                        >
                            <div className="d-flex justify-content-center border-0 lato-bold-a-lato-500 fs-22">
                                {mostrarPeorDia} ({facturacionPeorDia.toLocaleString("es-AR", { style: "currency", currency: "ARS" })})
                            </div>
                        </button>
                    </article>
                    <article className="col-12 col-md-6 col-lg-4 d-flex flex-column py-2">
                        <h6 className="text-center lato-bold fs-17">Facturación total</h6>
                        <button
                            className={
                                darkMode
                                    ? "bg-data-dark border-0 quitar-cursor-pointer flex-grow-1"
                                    : "container-light bg-data border-0 quitar-cursor-pointer flex-grow-1"
                            }
                        >
                            <div className="d-flex justify-content-center border-0 lato-bold-a-lato-500 fs-22">
                                {mostrarTotalMes.toLocaleString("es-AR", { style: "currency", currency: "ARS" })}
                            </div>
                        </button>
                    </article>
                    <article className="col-12 col-md-6 col-lg-4 d-flex flex-column py-2">
                        <h6 className="text-center lato-bold fs-17">Total Débito</h6>
                        <button
                            className={
                                darkMode
                                    ? "bg-data-dark border-0 quitar-cursor-pointer flex-grow-1"
                                    : "container-light bg-data border-0 quitar-cursor-pointer flex-grow-1"
                            }
                        >
                            <div className="d-flex justify-content-center border-0 lato-bold-a-lato-500 fs-22">
                                {totalBrutoDebitoMes.toLocaleString("es-AR", { style: "currency", currency: "ARS" })}
                            </div>
                        </button>
                    </article>
                    <article className="col-12 col-md-6 col-lg-4 d-flex flex-column py-2">
                        <h6 className="text-center lato-bold fs-17">Total Crédito</h6>
                        <button
                            className={
                                darkMode
                                    ? "bg-data-dark border-0 quitar-cursor-pointer flex-grow-1"
                                    : "container-light bg-data border-0 quitar-cursor-pointer flex-grow-1"
                            }
                        >
                            <div className="d-flex justify-content-center border-0 lato-bold-a-lato-500 fs-22">
                                {totalBrutoCreditoMes.toLocaleString("es-AR", { style: "currency", currency: "ARS" })}
                            </div>
                        </button>
                    </article>
                    <article className="col-12 col-md-6 col-lg-4 d-flex flex-column py-2">
                        <h6 className="text-center lato-bold fs-17">Total 1 Pago</h6>
                        <button
                            className={
                                darkMode
                                    ? "bg-data-dark border-0 quitar-cursor-pointer flex-grow-1"
                                    : "container-light bg-data border-0 quitar-cursor-pointer flex-grow-1"
                            }
                        >
                            <div className="d-flex justify-content-center border-0 lato-bold-a-lato-500 fs-22">
                                {totalBruto1PagoMes.toLocaleString("es-AR", { style: "currency", currency: "ARS" })}
                            </div>
                        </button>
                    </article>
                    <article className="col-12 col-md-6 col-lg-4 d-flex flex-column py-2">
                        <h6 className="text-center lato-bold fs-17">Cantidad de Operaciones</h6>
                        <button
                            className={
                                darkMode
                                    ? "bg-data-dark border-0 quitar-cursor-pointer flex-grow-1"
                                    : "container-light bg-data border-0 quitar-cursor-pointer flex-grow-1"
                            }
                        >
                            <div className="d-flex justify-content-center border-0 lato-bold-a-lato-500 fs-22">
                                {totalOperacionesMes}
                            </div>
                        </button>
              </article>
              <article className="col-12 col-md-6 col-lg-4 d-flex flex-column align-items-center py-2">
                  <h6 className="text-center lato-bold fs-17">Modal Ahorro</h6>
                  <Button
                      onClick={() => setShowModal(true)}
                      className="btn-publicar border-0 mx-1"
                      style={{
                          width: "200px",
                          height: "44px",
                          background: "#B4C400",
                          color: "#FFFFFF",
                          borderRadius: "32px",
                      }}
                      disabled={loading}
                  >
                      {loading ? <Spinner animation="border" size="sm" /> : "Abrir Modal"}
                  </Button>

                  {/* Modal de Ahorro Aliado */}
                  <ModalAhorroAliado
                      show={showModal}
                      handleClose={() => setShowModal(false)}
                      datos={ahorroAliadoDatos}
                      size="xl" // Aumenta el tamaño del modal
                  />

              </article>




                </Row>

                <Form>
                    <Row className="align-items-center my-3">
                        <Col xs="auto">
                            <Form.Label className="fs-18 lato-bold mb-0" style={{ color: "#292B2F" }}>
                                Buscar
                            </Form.Label>
                        </Col>
                        <Col xs="auto">
                            <Form.Control
                                className="form-control input-ingresar-buscador-crm px-5 border-0"
                                placeholder="Buscar por CUIT"
                                aria-label="Buscar por CUIT"
                                value={cuit}
                                onChange={(e) => setCuit(e.target.value.replace(/\s/g, ""))}
                                onKeyDown={(e) => {
                                    if (e.key === " ") e.preventDefault();
                                }}
                                style={{ width: "100%" }}
                            />
                        </Col>
                        <Col xs="auto">
                            <Button
                                onClick={handleFetchData}
                                className="btn-publicar border-0 mx-1"
                                style={{
                                    width: "200px",
                                    height: "44px",
                                    background: "#B4C400",
                                    color: "#FFFFFF",
                                    borderRadius: "32px",
                                }}
                            >
                                {loading ? <Spinner animation="border" size="sm" /> : "Buscar"}
                            </Button>
                        </Col>
                    </Row>
                </Form>

                {!loading && terminales.length > 1 && (
                    <Row className="my-3">
                        <Col xs="auto">
                            <Select
                                value={selectedTerminal}
                                onChange={handleTerminalSelect}
                                options={terminales}
                                placeholder="Seleccione una terminal"
                                classNamePrefix="select"
                                isSearchable={true}
                                isClearable={true}
                            />
                        </Col>
                    </Row>
                )}

                <div ref={gestionesRef}>
                    {!loading && datos.length === 0 && cuit === "" && (
                        <Table table-borderless responsive striped hover>
                            <thead className="border-0 bg-dark py-2">
                                <tr className="text-center tabla-thead">
                                    <th className={darkMode ? "bg-white text-dark border-tabla-izquierda-derecha border-0 lato-regular fs-12 py-3" : "bg-dark text-white border-tabla-izquierda-derecha border-0 lato-regular fs-12 py-3"}>Información</th>
                                </tr>
                            </thead>
                            <tbody className="text-center">
                                <tr>
                                    <td className={
                            darkMode
                              ? "fs-14 lato-regular py-4 prority-4 text-white "
                              : "fs-14 lato-regular py-4 prority-4 "
                          }>No se ha buscado un CUIT del aliado todavía</td>
                                </tr>
                            </tbody>
                        </Table>
                    )}

                    {!loading && datos.length === 0 && cuit !== "" && (
                        <Table table-borderless responsive striped hover>
                            <thead className="border-0 bg-dark py-2">
                                <tr className="text-center tabla-thead">
                                    <th className={darkMode ? "bg-white text-dark border-tabla-izquierda-derecha border-0 lato-regular fs-12 py-3" : "bg-dark text-white border-tabla-izquierda-derecha border-0 lato-regular fs-12 py-3"}>
                                        Información
                                    </th>
                                </tr>
                            </thead>
                            <tbody className="text-center">
                                <tr>
                                    <td className={
                            darkMode
                              ? "fs-14 lato-regular py-4 prority-4 text-white "
                              : "fs-14 lato-regular py-4 prority-4 "
                          }>No se encontraron datos de ese aliado</td>
                                </tr>
                            </tbody>
                        </Table>
                    )}

                    {!loading && datos.length > 0 && (
                        <div>
                            <Table table-borderless responsive hover>
                                {/* Encabezado fijo fuera del área desplazable */}
                                <thead className="border-0 bg-dark py-2">
                                    <tr className="text-center tabla-thead">
                                        <th className={darkMode ? "bg-white text-dark border-tabla-izquierda border-0 lato-regular fs-12 py-3" : "bg-dark text-white border-tabla-izquierda border-0 lato-regular fs-12 py-3"} scope="col">ID</th>
                                        <th className={darkMode ? "bg-white text-dark border-tabla border-0 lato-regular fs-12 py-3" : "bg-dark text-white border-tabla border-0 lato-regular fs-12 py-3"} scope="col">Canal Atención</th>
                                        <th className={darkMode ? "bg-white text-dark border-tabla border-0 lato-regular fs-12 py-3" : "bg-dark text-white border-tabla border-0 lato-regular fs-12 py-3"} scope="col">Tipo</th>
                                        <th className={darkMode ? "bg-white text-dark border-tabla border-0 lato-regular fs-12 py-3" : "bg-dark text-white border-tabla border-0 lato-regular fs-12 py-3"} scope="col">Aliado</th>
                                        <th className={darkMode ? "bg-white text-dark border-tabla border-0 lato-regular fs-12 py-3" : "bg-dark text-white border-tabla border-0 lato-regular fs-12 py-3"} scope="col">Motivo</th>
                                        <th className={darkMode ? "bg-white text-dark border-tabla border-0 lato-regular fs-12 py-3" : "bg-dark text-white border-tabla border-0 lato-regular fs-12 py-3"} scope="col">Estado</th>
                                        <th className={darkMode ? "bg-white text-dark border-tabla border-0 lato-regular fs-12 py-3" : "bg-dark text-white border-tabla border-0 lato-regular fs-12 py-3"} scope="col">Fecha de Carga</th>
                                        <th className={darkMode ? "bg-white text-dark border-tabla-derecha border-0 lato-regular fs-12 py-3" : "bg-dark text-white border-tabla-derecha border-0 lato-regular fs-12 py-3"} scope="col">Nro Terminal</th>
                                    </tr>
                                </thead>
                            </Table>

                            {/* Contenedor desplazable para el cuerpo de la tabla */}
                            <div style={{ maxHeight: "500px", overflowY: "auto" }}>
                                <Table table-borderless responsive hover>
                                    <tbody className="text-center">
                                        {datos
                                            .filter((item) =>
                                                selectedTerminal
                                                    ? String(item.nroTerminal) === String(selectedTerminal.value)
                                                    : true
                                            )
                                            .map((item, index) => {
                                                const rowStyle = index % 2 === 0
                                                    ? { backgroundColor: darkMode ? "#343a40" : "#f8f9fa", color: darkMode ? "white" : "black" }
                                                    : { backgroundColor: darkMode ? "#495057" : "#e9ecef", color: darkMode ? "white" : "black" };

                                                return (
                                                    <React.Fragment key={index}>
                                                        <tr style={rowStyle}>
                                                            <td className={
                            darkMode
                              ? "fs-14 lato-regular py-4 prority-4 text-white "
                              : "fs-14 lato-regular py-4 prority-4 "
                          }>{item.id}</td>
                                                            <td className={
                            darkMode
                              ? "fs-14 lato-regular py-4 prority-4 text-white "
                              : "fs-14 lato-regular py-4 prority-4 "
                          }>{item.canalAtencion}</td>
                                                            <td className={
                            darkMode
                              ? "fs-14 lato-regular py-4 prority-4 text-white "
                              : "fs-14 lato-regular py-4 prority-4 "
                          }>{item.tipo}</td>
                                                            <td className={
                            darkMode
                              ? "fs-14 lato-regular py-4 prority-4 text-white "
                              : "fs-14 lato-regular py-4 prority-4 "
                          }>{item.aliado}</td>
                                                            <td className={
                            darkMode
                              ? "fs-14 lato-regular py-4 prority-4 text-white "
                              : "fs-14 lato-regular py-4 prority-4 "
                          }>{item.motivo}</td>
                                                            <td className={
                            darkMode
                              ? "fs-14 lato-regular py-4 prority-4 text-white "
                              : "fs-14 lato-regular py-4 prority-4 "
                          }>{item.estado}</td>
                                                            <td className={
                            darkMode
                              ? "fs-14 lato-regular py-4 prority-4 text-white "
                              : "fs-14 lato-regular py-4 prority-4 "
                          }>{new Date(item.fechaCarga).toLocaleDateString()}</td>
                                                            <td className={
                            darkMode
                              ? "fs-14 lato-regular py-4 prority-4 text-white "
                              : "fs-14 lato-regular py-4 prority-4 "
                          }>{item.nroTerminal}</td>
                                                        </tr>
                                                        <tr style={rowStyle}>
                                                            <td colSpan="8" className="text-start"  style={{
                                                        backgroundColor: "rgba(180, 196, 0, 0.5)", // Verde translúcido
                                                    
                                                        borderRadius: "4px",
                                                        color: darkMode ? "white" : "black",
                                                    }}>
                                                                <strong className= {darkMode
                              ? "fs-14 lato-regular py-4 prority-4 text-white "
                              : "fs-14 lato-regular py-4 prority-4 "
                          }
                          >Observación:</strong> {item.observaciones}
                                                            </td>
                                                        </tr>
                                                    </React.Fragment>
                                                );
                                            })}
                                    </tbody>
                                </Table>
                            </div>
                        </div>



                    )}
                </div>

                <Button
                    onClick={downloadPDF}
                    className="btn-publicar border-0 mx-1 my-3"
                    style={{
                        width: "200px",
                        height: "44px",
                        background: "#B4C400",
                        color: "#FFFFFF",
                        borderRadius: "32px",
                    }}
                >
                    Descargar PDF
                </Button>
            </div>
  )
}

export default ResumenAliado