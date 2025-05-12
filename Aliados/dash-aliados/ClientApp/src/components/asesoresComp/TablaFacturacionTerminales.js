//Import hooks, context y librerias 
import React, { useContext, useState } from "react";
import { DarkModeContext } from "../../context/DarkModeContext";
import ItemsTablaFacturacionTerminales from "./ItemTablaFacturacionTerminacion";
import { Hourglass } from "react-loader-spinner";

// assets de la carpeta img
import xls from "../../assets/img/xls.png";

const TablaFacturacionTerminales = ({ datos = {} }) => {
  const { darkMode } = useContext(DarkModeContext);
  const analisis = datos && datos.analisi ? datos.analisi : [];
  const [descargando, setDescargando] = useState(false);

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

  // estado para filtro de busqueda
  const [filtroBusqueda, setFiltroBusqueda] = useState("");

  // funcion de filtrado
  const analisisFiltrados = analisis.filter(
    (dato) =>
      dato.nombreComercio
        .toLowerCase()
        .includes(filtroBusqueda.toLowerCase()) ||
      dato.terminal
        .toString()
        .toLowerCase()
        .includes(filtroBusqueda.toLowerCase())
  );

  // funcion para descargar el excel
  const handleDownloadExcel = async () => {
    setDescargando(true);
    try {
      const token = sessionStorage.getItem("token");

      const response = await fetch("/api/analisisasesores/excelasesores", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ token }),
      });

      if (!response.ok) throw new Error("Respuesta de red no fue ok.");

      const blob = await response.blob();
      const downloadUrl = window.URL.createObjectURL(blob);
      const link = document.createElement("a");
      link.href = downloadUrl;
      link.setAttribute(
        "download",
        `AnalisisAsesores_${new Date().toISOString()}.xlsx`
      );
      document.body.appendChild(link);
      link.click();
      link.remove();
      setDescargando(false);
    } catch (error) {
      console.error("Error al descargar el archivo:", error);
      setDescargando(false);
    }
  };

  if (analisisFiltrados.length === 0) {
    return (
      <div className="container">
        <div className="filtro-terminal mb-3 d-flex justify-content-between">
          <div className="my-3 d-flex">
            <h6 className="my-3 me-3 fs-18-a-16">Filtrar: </h6>
            <div className="campo-busqueda">
              <input
                type="text"
                className={
                  darkMode
                    ? "form-control text-white label-buscador-dark lato-regular fs-18 border-0"
                    : "form-control label-buscador lato-regular fs-18 border-0 "
                }
                placeholder="Comercio o terminal"
                value={filtroBusqueda}
                onChange={(e) => setFiltroBusqueda(e.target.value)}
              />
            </div>
          </div>
          <div>
            <button
              className={
                descargando
                  ? "btn-pdf-descargar-disabled centrado border-0 mx-2"
                  : "btn-pdf-descargar centrado border-0 mx-2"
              }
              disabled={descargando}
              onClick={handleDownloadExcel}
            >
              <div className="my-3">
                <div className="text-center">
                  {descargando ? (
                    <div>
                      <Hourglass
                        visible={true}
                        height="40"
                        width="40"
                        ariaLabel="hourglass-loading"
                        wrapperStyle={{}}
                        wrapperClass=""
                        colors={["#b4c400 ", "#000000 "]}
                      />
                    </div>
                  ) : (
                    <img
                      className="img-fluid icono-pdf-xls mb-1"
                      src={xls}
                      alt="Excel"
                    />
                  )}
                </div>
                <div className="d-flex justify-content-center align-items-center">
                  <h6 className="text-white lato-bold fs-14">
                    {descargando ? "Cargando..." : "Descargar"}
                  </h6>
                </div>
              </div>
            </button>
          </div>
        </div>
        <div className="text-center" role="alert">
          No hay datos para visualizar en la tabla.
        </div>
      </div>
    );
  }

  return (
    <div className="container">
      <div className="filtro-terminal mb-3 d-flex justify-content-between">
        <div className="my-3 d-flex">
          <h6 className="my-3 me-3 fs-18-a-16">Filtrar: </h6>
          <div className="campo-busqueda">
            <input
              type="text"
              className={
                darkMode
                  ? "form-control text-white label-buscador-dark lato-regular fs-18 border-0 mt-2"
                  : "form-control label-buscador lato-regular fs-18 border-0 mt-2"
              }
              placeholder="Comercio o terminal"
              value={filtroBusqueda}
              onChange={(e) => setFiltroBusqueda(e.target.value)}
            />
          </div>
        </div>
        <div>
          <button
            className={
              descargando
                ? "btn-pdf-descargar-disabled centrado border-0 mx-2"
                : "btn-pdf-descargar centrado border-0 mx-2"
            }
            disabled={descargando}
            onClick={handleDownloadExcel}
          >
            <div className="my-3">
              <div className="text-center">
                {descargando ? (
                  <div>
                    <Hourglass
                      visible={true}
                      height="40"
                      width="40"
                      ariaLabel="hourglass-loading"
                      wrapperStyle={{}}
                      wrapperClass=""
                      colors={["#b4c400 ", "#000000 "]}
                    />
                  </div>
                ) : (
                  <img
                    className="img-fluid icono-pdf-xls mb-1"
                    src={xls}
                    alt="Excel"
                  />
                )}
              </div>
              <div className="d-flex justify-content-center align-items-center">
                <h6 className="text-white lato-bold fs-14">
                  {descargando ? "Cargando..." : "Descargar"}
                </h6>
              </div>
            </div>
          </button>
        </div>
      </div>
      <div
        className={
          darkMode
            ? " container table-responsive  "
            : "container table-responsive  "
        }
      >
        <div className="">
          <div className="d-none d-lg-block">
            <div
              className={`header-container  ${
                darkMode ? "bg-secondary text-white py-3" : "bg-dark  py-3 "
              }`}
              style={{ borderRadius: "30px 30px 0px 0px" }}
            >
              <article className="d-flex justify-content-between  ">
                <div
                  className={
                    darkMode
                      ? "text-white lato-bold mx-5  "
                      : "text-white lato-bold mx-5  "
                  }
                >
                  Facturación de las Terminales
                </div>
                <div
                  className={
                    darkMode
                      ? "text-white  lato-bold mx-5  "
                      : "text-white lato-bold mx-5  "
                  }
                >
                  Terminales con descuento
                </div>
              </article>
            </div>
          </div>

          <div className="d-lg-none d-block">
            <div
              className={`header-container ${
                darkMode
                  ? "dark-mode"
                  : "bg-dark border-tabla-derecha-izquierda py-3 "
              }`}
            >
              <article className="text-center">
                <div className="text-white lato-bold mx-5 fs-10">
                  Facturación de las Terminales
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
                <tr className="text-center tabla-thead">
                  {[
                    "Asesor",
                    "Nombre Comercio",
                    "Terminal",
                    "Crédito",
                    "Débito",
                    "1 Pago",
                    "Total",
                    "Terminal",
                    "Falta visita",
                  ].map((header, index) => (
                    <th
                      key={index}
                      style={{
                        ...stickyHeaderStyle,
                        backgroundColor: index < 7 ? "#b4c400 " : "#e24444 ", // Ajustar colores según tu diseño
                      }}
                      scope="col"
                    >
                      {header}
                    </th>
                  ))}
                </tr>
              </thead>

              <tbody className="text-center bg-white">
                {analisisFiltrados.map((dato, id) => (
                  <ItemsTablaFacturacionTerminales {...dato} key={id} />
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
};

export default TablaFacturacionTerminales;
