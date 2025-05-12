// import hoja de estilos css
import "./TablaListaConsultaAliados.css";

import React, { useContext, useEffect, useState } from "react";
import { Button, Spinner, Table } from "react-bootstrap";
import ItemTablaListaConsultasAliados from "./ItemTablaListaConsultasAliados";
import { DarkModeContext } from "../../context/DarkModeContext";
import {
  faCircleCheck,
  faCircleMinus,
  faCirclePlus,
  faEdit,
  faFileExcel,
  faRotate,
} from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import ModalSolicitudNuevaPeticion from "./ModalSolicitudNuevaPeticion";

// Función auxiliar para formatear fecha y hora
const formatDate = (dateTimeStr) => {
  const date = new Date(dateTimeStr);
  return date.toLocaleDateString();
};

const formatTime = (dateTimeStr) => {
  const time = new Date(dateTimeStr);
  return time.toLocaleTimeString([], { timeStyle: "short" });
};

const TablaListaConsultaAliados = () => {
  // Estado inicial para los datos de la tabla
  // priority 1,2 y 11 son para mostrar en la version mobile.
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);

  // estado para guardar el filtro
  const [filtro, setFiltro] = useState("");

  const [peticiones, setPeticiones] = useState([]);

  // estado para ver la grafica condicional con el id
  const [verDetalles, setVerDetalles] = useState(false);

  // lista de contratados luego de pasar por el filtrado
  const listaFiltradaContratados = peticiones.filter((peticion) => {
    const nombreGestor = peticion.nombreGestor || ""; 
    const fechaApertura = peticion.fechaApertura || ""; 
    const nombredelComercio = peticion.nombredelComercio || "";
    const filtroLower = filtro.toLowerCase(); 
    return (
      nombreGestor.toLowerCase().includes(filtroLower) ||
      fechaApertura.includes(filtro) || nombredelComercio.toLowerCase().includes(filtroLower)
    ); 
  });

  // darkMode context funcionalidad para el modo claro/oscuro
  const { darkMode } = useContext(DarkModeContext);

  // estado para guardar los detalles
    const [datosDetalles, setDatosDetalles] = useState({});
  const {
    motivo,
    estado,
    nombredelComercio,
    direccion,
    provincia,
    email,
    numeroTelefono,
    fechaApertura,
    fechaCierre,
    numeroTerminal,
    observacionAliado,
    observacionAdministracion,
    observacionGestor,
    pasos,
    id,
  } = datosDetalles;

  // Función para manejar el clic en el botón Ver
  const manejarVerClick = async (id) => {
    const token = sessionStorage.getItem("token");
    // Verificar si el ID es válido antes de hacer la solicitud
    if (id) {
      // Preparar el cuerpo de la solicitud
      const cuerpoSolicitud = JSON.stringify({
        Id: id,
        Token: token,
      });
      try {
        // Hacer la solicitud POST a la API
        const respuesta = await fetch("/api/comanda/listaconsulta", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: cuerpoSolicitud,
        });

        // Obtener y procesar la respuesta del servidor
        const resultado = await respuesta.json();

        // cargar los datos de la respuesta
        setDatosDetalles(resultado);

        // Actualizar el estado para mostrar la gráfica
        setVerDetalles(true);
        // actualizarListaBusquedas(); 
      } catch (error) {
        console.error("Error al hacer la solicitud:", error);
        setVerDetalles(false);
      }
    } else {
      setVerDetalles(false);
    }
  };

  // Estilos para el contenedor de la tabla que permite el scroll
  const scrollableTableStyle = {
    display: "block",
    maxHeight: "600px", 
    overflowY: "scroll",
    overflowX: "hidden",
  };

  // estado para controlar la apertura y cierre del modal
  const [modalShowCompleta, setModalShowCompleta] = React.useState(false);

  // funcion para recargarPagina
  function recargarPagina() {
    window.location.reload();
  }

  // Función para convertir la fecha de dd/MM/yyyy a yyyy-MM-dd
  const obtenerFechaActualFormatoLocal = () => {
    const fechaHoy = new Date();
    const dia = ("0" + fechaHoy.getDate()).slice(-2);
    const mes = ("0" + (fechaHoy.getMonth() + 1)).slice(-2);
    const anio = fechaHoy.getFullYear();
    return `${dia}/${mes}/${anio}`;
  };

  // estado para fecha filtrada
  const [fechaFiltrada, setFechaFiltrada] = useState(
    obtenerFechaActualFormatoLocal
  );

  // Mantén tus funciones de conversión como están
  const convertirAFormatoISO = (fecha) => {
    const [dia, mes, año] = fecha.split("/");
    return `${año}-${mes}-${dia}`;
  };

  // funcion pra convertir una fecha en formato local
  const convertirAFormatoLocal = (fecha) => {
    const [año, mes, dia] = fecha.split("-");
    return `${dia}/${mes}/${año}`;
  };

  // Manejador del evento de cambio para el input
  const handleChange = (event) => {
    setFechaFiltrada(convertirAFormatoLocal(event.target.value));
  };

  // Método para obtener la lista actualizada de búsquedas
  const obtenerAsesores = async () => {
    try {
      const token = sessionStorage.getItem("token");
      const response = await fetch("/api/comanda/ListarTodasComandas", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          Token: token,
          Fecha: fechaFiltrada,
        }),
      });
      if (!response.ok) {
        throw new Error("Respuesta de la red no fue ok");
      }
      const data = await response.json();
      setPeticiones(data.reverse());
    } catch (error) {
      console.error("Error al obtener los asesores:", error);
      setError("No se pudieron obtener los datos de los asesores.");
    }
  };

  useEffect(() => {
    obtenerAsesores();
  }, [fechaFiltrada]);

  const [fechaBoton, setFechaBoton] = useState("");
  const [cargando, setCargando] = useState(false);

  const handleFechaButtonClick = async () => {
    setFechaBoton(filtro);
    const token = sessionStorage.getItem("token");
    try {
      setCargando(true);
      const response = await fetch("/api/excel/excelcomanda", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          Token: token,
          Fecha: fechaFiltrada,
        }),
      });

      if (response.ok) {
        setCargando(false);
        const blob = await response.blob();
        const url = window.URL.createObjectURL(blob);
        const a = document.createElement("a");
        a.href = url;
        a.download = "comandas.xlsx";
        document.body.appendChild(a);
        a.click();
        a.remove();
      } else {
        console.error("Error al generar el archivo Excel");
      }
    } catch (error) {
      console.error("Error en la solicitud", error);
    }
  };

  return (
    <>
      <section className="d-flex justify-content-between">
        <div className="container mb-4">
          <label className="me-2" htmlFor="fecha">
            Filtro por fecha:{" "}
          </label>
          <input
            className="lato-regular border-0 filtro-fecha-administracion container"
            type="date"
            id="fecha"
            value={convertirAFormatoISO(fechaFiltrada)} // Asegúrate de que esto convierte correctamente
            onChange={handleChange}
          />
        </div>
        <div>
          <Button
            className={
              darkMode
                ? "d-flex btn-check-modal-dark centrado border-0 fs-14 my-2"
                : "d-flex btn-check-modal centrado border-0 fs-14 my-2"
            }
            onClick={handleFechaButtonClick} // Este es el manejador del evento click para este botón
            disabled={cargando}
          >
            {cargando ? (
              <Spinner animation="border" role="status"></Spinner>
            ) : (
              <div>
                <h6 className="fs-14 mt-2">
                  {" "}
                  <FontAwesomeIcon className="me-4" icon={faFileExcel} />{" "}
                  Descargar Excel
                </h6>
              </div>
            )}
          </Button>
        </div>
      </section>

      <div
        className={
          darkMode
            ? " bg-tabla-calculadora-dark text-white"
            : " bg-tabla-calculadora"
        }
      >
        <article className="d-flex justify-content-between flex-wrap">
          <div className="filtro-terminal mb-3">
            <div className="my-3  mx-3 d-flex ">
              <h6 className="my-3 me-3 fs-18-a-16 ">Buscar: </h6>
              <div className="campo-busqueda ">
                <input
                  type="text"
                  className={
                    darkMode
                      ? " form-control text-white label-buscador-dark lato-regular fs-18 border-0"
                      : "form-control label-buscador lato-regular fs-18 border-0"
                  }
                  placeholder="Nombre gestor - Nombre del comercio - fecha"
                  style={{ color: "#000000" }}
                  value={filtro}
                  onChange={(e) => setFiltro(e.target.value)}
                />
              </div>
            </div>
          </div>

          <div className="my-4  mx-3 d-flex">
            <Button
              className={
                darkMode
                  ? "d-flex btn-modal-nuevo-usuario-editar   centrado border-0 fs-14 lato-bold me-5"
                  : "d-flex btn-modal-nuevo-usuario-editar  centrado me-5 border-0 fs-14  lato-bold"
              }
              onClick={recargarPagina}
            >
              <FontAwesomeIcon className="me-3" icon={faRotate} /> Actualizar
              tabla{" "}
            </Button>
            <Button
              className={
                darkMode
                  ? "centrado border-0 btn btn-modal-nuevo-usuario-editar centrado border-0 mx-2"
                  : "centrado  border-0 btn btn-modal-nuevo-usuario-editar centrado border-0 mx-2"
              }
              onClick={() => setModalShowCompleta(true)}
            >
              <FontAwesomeIcon icon={faCirclePlus} />{" "}
              <span className="lato-bold fs-18 ms-2"> Nuevo</span>
            </Button>
            <ModalSolicitudNuevaPeticion
              show={modalShowCompleta}
              onHide={() => setModalShowCompleta(false)}
            />
          </div>
        </article>
        <article className="row">
          <div className="col-9">
            <section style={scrollableTableStyle}>
              {listaFiltradaContratados.length > 0 ? (
                <Table table table-borderless responsive striped hover>
                  <thead className="bg-dark py-2">
                    <tr className="text-center tabla-thead text-white">
                      <th className="fs-12 lato-regular py-2 priority-4 border-tabla-izquierda">
                        #
                      </th>
                      <th className="fs-12 lato-regular py-2 priority-4 ">
                        Fecha de <br /> apertura
                      </th>
                      <th className="fs-12 lato-regular py-2 prority-4 ">
                        Motivo
                      </th>
                      <th className=" fs-12 lato-regular py-2 priority-4  ">
                        Gestor
                      </th>
                      <th className="fs-12 lato-regular py-2 priority-5">
                        Nombre de <br /> comercio
                      </th>
                      <th className="fs-12 lato-regular py-2 priority-3">
                        Estado
                      </th>

                      <th className="fs-12 lato-regular py-2  priority-1 ">
                        Fecha de <br /> cierre
                      </th>
                      <th className="fs-12 lato-regular py-2  priority-2">
                        Detalle
                      </th>
                      <th className="fs-12 lato-regular py-2 priority-1  border-tabla-derecha">
                        Editar
                      </th>
                    </tr>
                  </thead>
                  <tbody>
                    {listaFiltradaContratados.map((consulta) => (
                      <ItemTablaListaConsultasAliados
                        consulta={consulta}
                        datosDetalles={datosDetalles}
                        key={consulta.id}
                        manejarVerClick={manejarVerClick}
                      />
                    ))}
                  </tbody>
                </Table>
              ) : (
                <div className="my-4 container">
                  <h6 className="text-dark fs-14">
                    No se encontraron registros.
                  </h6>
                </div>
              )}
            </section>
          </div>
          {verDetalles && (
            <div className="col-3 " style={scrollableTableStyle}>
              <article>
                <div className="">
                  <div className="user-info">
                    <h2 className=" fs-14 lato-bold">
                      {motivo === null || motivo === "" ? (
                        <>No hay motivo registrado o cargado.</>
                      ) : (
                        <> {motivo}</>
                      )}
                    </h2>
                    <article>
                      <div className="py-2">
                        <h2 className=" fs-14">
                          Estado:
                          {estado === "pendiente" ? (
                            <>
                              <FontAwesomeIcon
                                className="mx-2"
                                icon={faCircleMinus}
                                style={{ color: "#E89F2F" }}
                              />{" "}
                              <span style={{ color: "#E89F2F" }}>
                                {" "}
                                {estado}
                              </span>{" "}
                            </>
                          ) : (
                            <>
                              <FontAwesomeIcon
                                className="mx-2"
                                icon={faCircleCheck}
                                style={{ color: "#B4C400" }}
                              />{" "}
                              <span style={{ color: "#B4C400" }}>
                                {" "}
                                {estado}
                              </span>{" "}
                            </>
                          )}
                        </h2>
                      </div>
                    </article>
                    <h2 className=" fs-14">
                      {" "}
                      {nombredelComercio === null ||
                      nombredelComercio === "" ? (
                        <> Falta agregar el Nombre del comercio </>
                      ) : (
                        nombredelComercio
                      )}
                    </h2>
                    <div className="mx-1 my-1">
                      <h2 className=" fs-14">
                        Dirección:
                        {direccion === null || direccion === "" ? (
                          <> Falta agregar la direccion</>
                        ) : (
                          <> {direccion}</>
                        )}
                      </h2>
                      <h2 className=" fs-14">
                        Provincia:
                        {provincia === null || provincia === "" ? (
                          <> Falta agregar la Provincia</>
                        ) : (
                          <> {provincia}</>
                        )}
                      </h2>
                      <h2 className=" fs-14">
                        Nombre representante:
                        {email === null || email === "" ? (
                          <>
                            {" "}
                            <h6 className=" fs-14">
                              Falta agregar Nombre representante
                            </h6>{" "}
                          </>
                        ) : (
                          <>
                            <h6 className=" fs-14">{email}</h6>
                          </>
                        )}
                      </h2>
                      <h2 className=" fs-14">
                        Teléfono:
                        {numeroTelefono === null || numeroTelefono === "" ? (
                          <> Falta agregar el N° Teléfono </>
                        ) : (
                          <>{numeroTelefono}</>
                        )}
                      </h2>
                    </div>
                  </div>
                </div>
                <section style={{ maxHeight: "550px" }}>
                  <article>
                    <div className="py-2">
                      <h2 className=" fs-14">Fecha de apertura</h2>
                      <h2 className=" fs-14">
                        {fechaApertura === null || fechaApertura === "" ? (
                          <> No hay fecha de apertura ingresada</>
                        ) : (
                          <>
                            <span className="me-3">
                              {formatDate(fechaApertura)}
                            </span>
                            {formatTime(fechaApertura)} hs
                          </>
                        )}
                      </h2>
                    </div>
                  </article>
                  <article>
                    <div className="py-2">
                      <h2 className=" fs-14">Fecha de cierre</h2>
                      <h2 className=" fs-14">
                        {fechaCierre === null || fechaCierre === "" ? (
                          <> No hay fecha de cierre ingresada</>
                        ) : (
                          <>
                            <span className="me-3">
                              {formatDate(fechaCierre)}
                            </span>
                            {formatTime(fechaCierre)} hs
                          </>
                        )}
                      </h2>
                    </div>
                  </article>
                  {/* <article>
                  <div className="py-2">
                    <h2 className=" fs-14">Gestor asignado</h2>
                    <h2 className=" fs-14">Andrés Pérez</h2>
                  </div>
                </article> */}
                  <article>
                    <div className="py-2">
                      <h2 className=" fs-14">N° de Terminal</h2>
                      <h2 className=" fs-14">
                        {numeroTerminal === null || numeroTerminal === "" ? (
                          <>No hay registrado o ingresado un N° de terminal.</>
                        ) : (
                          <>{numeroTerminal}</>
                        )}
                      </h2>
                    </div>
                  </article>
                  <article>
                    <div className="py-2">
                      <h2 className=" fs-14">Observaciones Aliado</h2>
                      <h2
                        className=" fs-14"
                        style={{ maxHeight: "100px", overflowY: "auto" }}
                      >
                        {observacionAliado === null ||
                        observacionAliado === "" ? (
                          <>
                            {" "}
                            No hay observaciones por parte del Aliado
                            realizadas.{" "}
                          </>
                        ) : (
                          <>{observacionAliado}</>
                        )}
                      </h2>
                    </div>
                  </article>
                  <article className="ajustar-texto">
                    <div className="py-2">
                      <h2 className=" fs-14">Observaciones Administración</h2>
                      <h2 className=" fs-14">
                        {observacionAdministracion === null ||
                        observacionAdministracion === "" ? (
                          <>
                            {" "}
                            No hay observaciones por parte de Administración
                            realizadas.{" "}
                          </>
                        ) : (
                          <> {observacionAdministracion} </>
                        )}
                      </h2>
                    </div>
                  </article>
                  <article>
                    <div className="form-group col-12">
                      <h6 className=" fs-14">Observación Gestor</h6>
                      <h6 className="lato-regular fs-14">
                        {observacionGestor}
                      </h6>
                    </div>
                  </article>
                  <article>
                    <div className="py-2">
                      <h2 className=" fs-14">Pasos del gestor</h2>
                      <h2
                        className=" fs-14"
                        style={{ maxHeight: "100px", overflowY: "auto" }}
                      >
                        {pasos === null || pasos === "" ? (
                          <> No hay pasos realizados por el gestor. </>
                        ) : (
                          <>{pasos}</>
                        )}
                      </h2>
                    </div>
                  </article>
                </section>
              </article>
            </div>
          )}
        </article>
      </div>
    </>
  );
};

export default TablaListaConsultaAliados;
