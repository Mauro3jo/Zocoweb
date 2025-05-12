import React, { useContext, useEffect, useState } from "react";
import { DarkModeContext } from "../../context/DarkModeContext";
import { Form } from "react-bootstrap";

const ContenidoCupones = () => {
  const { darkMode } = useContext(DarkModeContext);
  const [cargando, setCargando] = useState(false);
  const [datos, setDatos] = useState([]);
  const [paginaActual, setPaginaActual] = useState(1);
  const [terminoBusqueda, setTerminoBusqueda] = useState("");
  const [fechaFiltro, setFechaFiltro] = useState("");
  const [resultadosPorPagina, setResultadosPorPagina] = useState(20);
  const [filtroFecha, setFiltroFecha] = useState("");
  const [filtroBruto, setFiltroBruto] = useState("");
  const [filtroTarjeta, setFiltroTarjeta] = useState("");
  const [filtroNumeroTarjeta, setFiltroNumeroTarjeta] = useState("");
  const [filtroCuotas, setFiltroCuotas] = useState("");
  // funcion para la filtrar datos

  useEffect(() => {
    const fetchDatos = async () => {
      setCargando(true);

      try {
        // Obtener el token del sessionStorage
        const token = sessionStorage.getItem("token");
        if (!token) {
          console.error("No se encontr� el token en el sessionStorage");
          return;
        }

        // Hacer la solicitud a la API
        const response = await fetch("/api/clover/obtenerdatos", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ Token: token }), // Enviar el token en el cuerpo
        });

        if (!response.ok) {
          throw new Error(`Error en la solicitud: ${response.statusText}`);
        }

        const data = await response.json();
        setDatos(data);
      } catch (error) {
        console.error("Error al obtener los datos:", error);
      } finally {
        setCargando(false);
      }
    };

    fetchDatos();
  }, []);
  useEffect(() => {
    setPaginaActual(1);
  }, [filtroFecha, filtroBruto, filtroTarjeta, filtroNumeroTarjeta, filtroCuotas]);


  const filtrarDatos = () => {
    return datos.filter((dato) => {
      return (
        (dato.fechaDePago || "").includes(filtroFecha) &&
        (dato.importe || "").includes(filtroBruto) &&
        (dato.numeroDeLaTarjeta || "")
          .toLowerCase()
          .includes(filtroNumeroTarjeta.toLowerCase()) &&
        (dato.marcaDeLaTarjeta || "").toLowerCase().includes(filtroTarjeta) &&
        (dato.numeroCuotas || "").includes(filtroCuotas)
      );
    });
  };

  const datosFiltrados = filtrarDatos();
  const totalPaginas = Math.ceil(datosFiltrados.length / resultadosPorPagina);

  const datosPaginados = datosFiltrados.slice(
    (paginaActual - 1) * resultadosPorPagina,
    paginaActual * resultadosPorPagina
  );

  const manejarCambioPagina = (direccion) => {
    if (direccion === "anterior" && paginaActual > 1) {
      setPaginaActual(paginaActual - 1);
    } else if (direccion === "siguiente" && paginaActual < totalPaginas) {
      setPaginaActual(paginaActual + 1);
    }
  };

  return (
    <div
      className={
        darkMode
          ? "container bg-tabla-usuarios-liquidaciones-dark"
          : "container bg-tabla-usuarios-liquidaciones"
      }
    >
      <section className="container mt-3 mb-3 ">
        <div className="d-flex flex-wrap  justify-content-between pt-4 container">
          <Form.Group className="mb-3" controlId="filtroFecha">
            <Form.Label className="fs-14 lato-bold">
              Fecha de Operaciónes
            </Form.Label>
            <Form.Control
              className={
                darkMode
                  ? " form-control text-white label-buscador-cupones-dark lato-regular fs-18 border-0"
                  : "form-control label-buscador-cupones lato-regular fs-18 border-0"
              }
              type="text"
              placeholder="Num Dia"
              value={filtroFecha}
              onChange={(e) => setFiltroFecha(e.target.value)}
            />
          </Form.Group>
          <Form.Group className="mb-3" controlId="filtroBruto">
            <Form.Label className="fs-14 lato-bold">Bruto</Form.Label>
            <Form.Control
              type="text"
              className={
                darkMode
                  ? " form-control text-white label-buscador-cupones-dark lato-regular fs-18 border-0"
                  : "form-control label-buscador-cupones lato-regular fs-18 border-0"
              }
              placeholder="Bruto"
              value={filtroBruto}
              onChange={(e) => setFiltroBruto(e.target.value)}
            />
          </Form.Group>
          <Form.Group className="mb-3" controlId="filtroTarjeta">
            <Form.Label className="fs-14 lato-bold">
              Tarjeta (4 digitos)
            </Form.Label>
            <Form.Control
              className={
                darkMode
                  ? " form-control text-white label-buscador-cupones-dark lato-regular fs-18 border-0"
                  : "form-control label-buscador-cupones lato-regular fs-18 border-0"
              }
              type="text"
              placeholder="1234"
              value={filtroNumeroTarjeta}
              onChange={(e) => setFiltroNumeroTarjeta(e.target.value)}
            />
          </Form.Group>
          <Form.Group className="mb-3" controlId="filtroNumeroTarjeta">
            <Form.Label className="fs-14 lato-bold">Tarjeta</Form.Label>
            <Form.Control
              className={
                darkMode
                  ? " form-control text-white label-buscador-cupones-dark lato-regular fs-18 border-0"
                  : "form-control label-buscador-cupones lato-regular fs-18 border-0"
              }
              type="text"
              value={filtroTarjeta}
              onChange={(e) => setFiltroTarjeta(e.target.value)}
              placeholder="Tarjeta"
            />
          </Form.Group>
          <Form.Group className="mb-3" controlId="filtroCuotas">
            <Form.Label className="fs-14 lato-bold">Cuotas</Form.Label>
            <Form.Control
              className={
                darkMode
                  ? " form-control text-white label-buscador-cupones-dark lato-regular fs-18 border-0"
                  : "form-control label-buscador-cupones lato-regular fs-18 border-0"
              }
              type="text"
              placeholder="Cuotas"
              value={filtroCuotas}
              onChange={(e) => setFiltroCuotas(e.target.value)}
            />
          </Form.Group>
        </div>
      </section>
      <article>
        <div
          className={
            darkMode
              ? "table-responsive py-3 px-5"
              : "table-responsive py-3 px-5"
          }
        >
          <table className="table table-borderless responsive striped hover">
            <thead className="border-0">
              <tr className="text-center tabla-thead">
                <th
                  className={
                    darkMode
                      ? "bg-white text-dark border-tabla-izquierda border-0 lato-regular fs-12 py-3"
                      : "bg-dark text-white border-tabla-izquierda border-0 lato-regular fs-12 py-3"
                  }
                >
                  Fecha de Pago
                </th>
                <th
                  className={
                    darkMode
                      ? "bg-white text-dark border-0 lato-regular fs-12 py-3"
                      : "bg-dark text-white border-0 lato-regular fs-12 py-3"
                  }
                >
                  ID Terminal
                </th>
                <th
                  className={
                    darkMode
                      ? "bg-white text-dark border-0 lato-regular fs-12 py-3"
                      : "bg-dark text-white border-0 lato-regular fs-12 py-3"
                  }
                >
                  Importe
                </th>
                <th
                  className={
                    darkMode
                      ? "bg-white text-dark border-0 lato-regular fs-12 py-3"
                      : "bg-dark text-white border-0 lato-regular fs-12 py-3"
                  }
                >
                  Marca de Tarjeta
                </th>
                <th
                  className={
                    darkMode
                      ? "bg-white text-dark border-0 lato-regular fs-12 py-3"
                      : "bg-dark text-white border-0 lato-regular fs-12 py-3"
                  }
                >
                  Medio de Pago
                </th>
                <th
                  className={
                    darkMode
                      ? "bg-white text-dark border-0 lato-regular fs-12 py-3"
                      : "bg-dark text-white border-0 lato-regular fs-12 py-3"
                  }
                >
                  Nombre del Cliente
                </th>
                <th
                  className={
                    darkMode
                      ? "bg-white text-dark border-0 lato-regular fs-12 py-3"
                      : "bg-dark text-white border-0 lato-regular fs-12 py-3"
                  }
                >
                  Lote
                </th>
                <th
                  className={
                    darkMode
                      ? "bg-white text-dark border-0 lato-regular fs-12 py-3"
                      : "bg-dark text-white border-0 lato-regular fs-12 py-3"
                  }
                >
                  Recibo
                </th>
                <th
                  className={
                    darkMode
                      ? "bg-white text-dark border-0 lato-regular fs-12 py-3"
                      : "bg-dark text-white border-0 lato-regular fs-12 py-3"
                  }
                >
                  N° de Cuotas
                </th>
                <th
                  className={
                    darkMode
                      ? "bg-white text-dark border-0 lato-regular fs-12 py-3"
                      : "bg-dark text-white border-0 lato-regular fs-12 py-3"
                  }
                >
                  N° de Tarjeta
                </th>
                <th
                  className={
                    darkMode
                      ? "bg-white text-dark border-tabla-derecha border-0 lato-regular fs-12 py-3"
                      : "bg-dark text-white border-tabla-derecha border-0 lato-regular fs-12 py-3"
                  }
                >
                  Resultado
                </th>
              </tr>
            </thead>
            <tbody className="text-center">
              {cargando ? (
                <tr>
                  <td colSpan="11">Cargando...</td>
                </tr>
              ) : datosPaginados.length > 0 ? (
                datosPaginados.map((dato, index) => (
                  <tr
                    key={index}
                    className={
                      darkMode
                        ? "tabla-borde-bottom text-white"
                        : "tabla-borde-bottom text-dark"
                    }
                  >
                    <td className="fs-12-a-10 lato-regular pt-4">
                      {dato.fechaDePago}
                    </td>
                    <td className="fs-12-a-10 lato-regular pt-4">
                      {dato.idTerminal}
                    </td>
                    <td className="fs-12-a-10 lato-regular pt-4">
                      {parseFloat(dato.importe).toLocaleString("es-AR", {
                        style: "currency",
                        currency: "ARS",
                      })}
                    </td>
                    <td className="fs-12-a-10 lato-regular pt-4">
                      {dato.marcaDeLaTarjeta}
                    </td>
                    <td className="fs-12-a-10 lato-regular pt-4">
                      {dato.medioDePago}
                    </td>
                    <td className="fs-12-a-10 lato-regular pt-4">
                      {dato.nombreDelCliente}
                    </td>
                    <td className="fs-12-a-10 lato-regular pt-4">
                      {dato.nrLote}
                    </td>
                    <td className="fs-12-a-10 lato-regular pt-4">
                      {dato.nrRecibo}
                    </td>
                    <td className="fs-12-a-10 lato-regular pt-4">
                      {dato.numeroCuotas}
                    </td>
                    <td className="fs-12-a-10 lato-regular pt-4">
                      {dato.numeroDeLaTarjeta}
                    </td>
                    <td className="fs-12-a-10 lato-regular pt-4">
                      {dato.rersultado}
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan="11">No se encontraron datos</td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
        <div className="d-flex justify-content-between mt-3">
          <button
            className="btn"
            onClick={() => manejarCambioPagina("anterior")}
            disabled={paginaActual === 1}
            style={{
              borderRadius: "23px",
              width: "182px",
              height: "44px",
              background: "#B4C400",
              color: "#FFFFFF",
              marginTop: "10px",
            }}
          >
            Anterior
          </button>
          <span>
            Página {paginaActual} de {totalPaginas}
          </span>
          <button
            className="btn"
            onClick={() => manejarCambioPagina("siguiente")}
            disabled={paginaActual === totalPaginas}
            style={{
              borderRadius: "23px",
              width: "182px",
              height: "44px",
              background: "#B4C400",
              color: "#FFFFFF",
              marginTop: "10px",
            }}
          >
            Siguiente
          </button>
        </div>
      </article>
    </div>
  );
};

export default ContenidoCupones;
