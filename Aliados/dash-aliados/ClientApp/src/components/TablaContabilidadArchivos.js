import "./TablaVencimientoContabilidad.css";
import React, { useContext, useEffect, useState } from "react";
import { DarkModeContext } from "../context/DarkModeContext";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faDownload } from "@fortawesome/free-solid-svg-icons";
import Swal from "sweetalert2";

// datos del mapeo de los meses
const datos = [
  {
    id: 1,
    mes: "Enero",
  },
  {
    id: 2,
    mes: "Febrero",
  },
  {
    id: 3,
    mes: "Marzo",
  },
  {
    id: 4,
    mes: "Abril",
  },
  {
    id: 5,
    mes: "Mayo",
  },
  {
    id: 6,
    mes: "Junio",
  },
  {
    id: 7,
    mes: "Julio",
  },
  {
    id: 8,
    mes: "Agosto",
  },
  {
    id: 9,
    mes: "Septiembre",
  },
  {
    id: 10,
    mes: "Octubre",
  },
  {
    id: 11,
    mes: "Noviembre",
  },
  {
    id: 12,
    mes: "Diciembre",
  },
];

const TablaContabilidadArchivos = () => {
  const { darkMode } = useContext(DarkModeContext);
  const [datosContabilidadArchivo, setDatosContabilidadArchivo] = useState([]);
  const [loading, setLoading] = useState(false);
  useEffect(() => {
    const fetchData = async () => {
      const token = sessionStorage.getItem("token");
      if (!token) {
        console.error("No hay token disponible");
        Swal.fire("Error", "No hay token disponible", "error");
        return;
      }
      setLoading(true);
      try {
        const response = await fetch("/api/listaafip/listaafip", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ token }),
        });

        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`);
        }

        const data = await response.json();

        setDatosContabilidadArchivo(data);
      } catch (error) {
        console.error("Error fetching data: ", error);
        Swal.fire("Error", "No se pudo cargar la información", "error");
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

    const handleDownloadAfip = async (mes, tipo) => {
        const token = sessionStorage.getItem("token");
        const url = "/api/AFIP/descargarafiafip";

        if (!token) {
            Swal.fire("Error", "No hay token disponible", "error");
            return;
        }

        const requestBody = {
            token: token,
            fecha: mes
        };

        try {
            const response = await fetch(url, {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify(requestBody)
            });

            if (!response.ok) {
                throw new Error("Error en la respuesta de la API");
            }

            const documentos = await response.json();

            documentos.forEach((doc, index) => {
                if (doc.documentoPdfBase64) {
                    const pdfBlob = b64toBlob(doc.documentoPdfBase64, "application/pdf");
                    const pdfUrl = URL.createObjectURL(pdfBlob);
                    const link = document.createElement("a");
                    link.href = pdfUrl;

                    // Formatear la fecha para mostrar solo día, mes y año
                    const fecha = new Date(doc.fechaSubida);
                    const fechaFormateada = fecha.toLocaleDateString('es-ES'); // Formato de fecha en español (dd/mm/yyyy)

                    link.download = `${doc.nombreDocumento}_${doc.cuit}_${fechaFormateada}.pdf`;
                    document.body.appendChild(link);
                    link.click();

                    setTimeout(() => {
                        document.body.removeChild(link);
                        URL.revokeObjectURL(pdfUrl);
                    }, 100 * (index + 1));
                } else {
                    console.log("documentoPdfBase64 no encontrado o undefined para uno de los documentos.");
                }
            });


            console.log("PDFs descargados exitosamente.");
        } catch (error) {
            console.error("Error al descargar los PDFs:", error);
        }
    };

    function b64toBlob(b64Data, contentType = "", sliceSize = 512) {
        const byteCharacters = atob(b64Data);
        const byteArrays = [];

        for (let offset = 0; offset < byteCharacters.length; offset += sliceSize) {
            const slice = byteCharacters.slice(offset, offset + sliceSize);

            const byteNumbers = new Array(slice.length);
            for (let i = 0; i < slice.length; i++) {
                byteNumbers[i] = slice.charCodeAt(i);
            }

            const byteArray = new Uint8Array(byteNumbers);
            byteArrays.push(byteArray);
        }

        const blob = new Blob(byteArrays, { type: contentType });
        return blob;
    }




    const handleDownloadIIBB = async (mes, tipo) => {
        const token = sessionStorage.getItem("token");
        const url = "/api/IIBB/descargarpdfiibb";

        if (!token) {
            Swal.fire("Error", "No hay token disponible", "error");
            return;
        }

        const requestBody = {
            token: token,
            fecha: mes
        };

        try {
            const response = await fetch(url, {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify(requestBody)
            });

            if (!response.ok) {
                throw new Error("Error en la respuesta de la API");
            }

            const documentos = await response.json();

            documentos.forEach((doc, index) => {
                if (doc.documentoPdfBase64) {
                    const pdfBlob = b64toBlob(doc.documentoPdfBase64, "application/pdf");
                    const pdfUrl = URL.createObjectURL(pdfBlob);
                    const link = document.createElement("a");
                    link.href = pdfUrl;

                    // Formatear la fecha para mostrar solo día, mes y año
                    const fecha = new Date(doc.fechaSubida);
                    const fechaFormateada = fecha.toLocaleDateString('es-ES'); // Formato de fecha en español (dd/mm/yyyy)

                    link.download = `${doc.nombreDocumento}_${doc.cuit}_${fechaFormateada}.pdf`;
                    document.body.appendChild(link);
                    link.click();

                    setTimeout(() => {
                        document.body.removeChild(link);
                        URL.revokeObjectURL(pdfUrl);
                    }, 100 * (index + 1));
                } else {
                    console.log("documentoPdfBase64 no encontrado o undefined para uno de los documentos.");
                }
            });


            console.log("PDFs descargados exitosamente.");
        } catch (error) {
            console.error("Error al descargar los PDFs:", error);
        }
    };


    const handleDownloadFacturante = async (mes, tipo) => {
      const token = sessionStorage.getItem("token");
        const url = "/api/Facturante/descargarpdffacturante";

      if (!token) {
          Swal.fire("Error", "No hay token disponible", "error");
          return;
      }

      const requestBody = {
          token: token,
          fecha: mes
      };

      try {
          const response = await fetch(url, {
              method: "POST",
              headers: {
                  "Content-Type": "application/json",
              },
              body: JSON.stringify(requestBody)
          });

          if (!response.ok) {
              throw new Error("Error en la respuesta de la API");
          }

          const documentos = await response.json();

          documentos.forEach((doc, index) => {
              if (doc.documentoPdfBase64) {
                  const pdfBlob = b64toBlob(doc.documentoPdfBase64, "application/pdf");
                  const pdfUrl = URL.createObjectURL(pdfBlob);
                  const link = document.createElement("a");
                  link.href = pdfUrl;

                  // Formatear la fecha para mostrar solo día, mes y año
                  const fecha = new Date(doc.fechaSubida);
                  const fechaFormateada = fecha.toLocaleDateString('es-ES'); // Formato de fecha en español (dd/mm/yyyy)

                  link.download = `${doc.nombreDocumento}_${doc.cuit}_${fechaFormateada}.pdf`;
                  document.body.appendChild(link);
                  link.click();

                  setTimeout(() => {
                      document.body.removeChild(link);
                      URL.revokeObjectURL(pdfUrl);
                  }, 100 * (index + 1));
              } else {
                  console.log("documentoPdfBase64 no encontrado o undefined para uno de los documentos.");
              }
          });

          console.log("PDFs descargados exitosamente.");
      } catch (error) {
          console.error("Error al descargar los PDFs:", error);
      }
  };

  const tableContainerStyle = {
    maxHeight: "500px",
    overflowY: "auto",
  };

  const stickyHeaderStyle = {
    position: "sticky",
    top: 0,
    zIndex: 1020,
    backgroundColor: darkMode ? "#343a40" : "#fff",
  };

  return (
    <section className="container">
      <div className="">
        <div className="d-none d-lg-block">
          <div
            className={`header-container ${
              darkMode ? "bg-secondary text-white py-3" : "bg-dark  py-3 "
            }`}
            style={{ borderRadius: "30px 30px 0px 0px" }}
          >
            <article className="d-flex justify-content-center">
              <div
                className={
                  darkMode
                    ? "text-white lato-bold mx-5"
                    : "text-white lato-bold mx-5"
                }
              >
                Comprobantes de factura - Retención 
              </div>
            </article>
          </div>
        </div>

        <div className="d-lg-none d-block">
          <div
            style={{ borderRadius: "30px 30px 0px 0px" }}
            className={`header-container ${
              darkMode ? "dark-mode" : "bg-dark py-3"
            }`}
          >
            <article className="text-center">
              <div className="text-white lato-bold mx-5 fs-14">
              Comprobantes de factura - Retención 
              </div>
            </article>
          </div>
        </div>
        <div
          className={`table-container ${darkMode ? "dark-mode" : ""}`}
          style={tableContainerStyle}
        >
                  <table className="table table-borderless responsive striped hover">
                      <thead className="border-0">
                          <tr className="text-center tabla-thead fs-12">
                              {["MES", "Factura", "(IVA-Ganancia)", "IIBB"].map((header, index) => (
                                  <th
                                      key={index}
                                      style={{
                                          ...stickyHeaderStyle,
                                          backgroundColor: "#b4c400",
                                      }}
                                      scope="col"
                                  >
                                      {header}
                                  </th>
                              ))}
                          </tr>
                      </thead>

                      <tbody className="text-center bg-white">
                          {datosContabilidadArchivo.fechasDisponibles &&
                              datosContabilidadArchivo.fechasDisponibles.length > 0 ? (
                              Object.values(
                                  datosContabilidadArchivo.fechasDisponibles.reduce((acc, dato) => {
                                      if (!acc[dato.mes]) {
                                          acc[dato.mes] = { ...dato };
                                      } else {
                                          // Si el mes ya existe, actualizamos los valores a true si alguno es true
                                          acc[dato.mes].tieneAfip = acc[dato.mes].tieneAfip || dato.tieneAfip;
                                          acc[dato.mes].tieneFacturante = acc[dato.mes].tieneFacturante || dato.tieneFacturante;
                                          acc[dato.mes].tieneIibb = acc[dato.mes].tieneIibb || dato.tieneIibb;
                                      }
                                      return acc;
                                  }, {})
                              ).map((dato, idx) => (
                                  <tr
                                      key={idx}
                                      className={darkMode ? "tabla-borde-bottom" : "tabla-borde-bottom"}
                                  >
                                      {/* Mostrar el nombre del mes */}
                                      <td className="lato-regular text-dark py-3 fs-12">{dato.mes}</td>

                                      {/* Facturante */}
                                      <td className="fs-12 lato-regular py-3">
                                          {dato.tieneFacturante ? (
                                              <button
                                                  className="btn-descargar-archivos-contabilidad py-2 border-0"
                                                  onClick={() => handleDownloadFacturante(dato.mes, "Facturante")}
                                              >
                                                  Descargar
                                              </button>
                                          ) : (
                                              <h6 className="fs-12">No hay archivo para descargar</h6>
                                          )}
                                      </td>

                                      {/* AFIP (IVA-Ganancia) */}
                                      <td className="fs-12 lato-regular py-3">
                                          {dato.tieneAfip ? (
                                              <button
                                                  className="btn-descargar-archivos-contabilidad py-2 border-0"
                                                  onClick={() => handleDownloadAfip(dato.mes, "IVA-Ganancia")}
                                              >
                                                  Descargar
                                              </button>
                                          ) : (
                                              <h6 className="fs-12">No hay archivo para descargar</h6>
                                          )}
                                      </td>

                                      {/* IIBB */}
                                      <td className="fs-12 lato-regular py-3">
                                          {dato.tieneIibb ? (
                                              <button
                                                  className="btn-descargar-archivos-contabilidad py-2 border-0"
                                                  onClick={() => handleDownloadIIBB(dato.mes, "IIBB")}
                                              >
                                                  Descargar
                                              </button>
                                          ) : (
                                              <h6 className="fs-12">No hay archivo para descargar</h6>
                                          )}
                                      </td>
                                  </tr>
                              ))
                          ) : (
                              <tr>
                                  <td colSpan="4" className="fs-12 lato-regular py-3">
                                      No hay datos disponibles
                                  </td>
                              </tr>
                          )}
                      </tbody>
                  </table>

        </div>
      </div>
    </section>
  );
};

export default TablaContabilidadArchivos;
