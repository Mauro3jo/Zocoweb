import React, { useState, useEffect, useContext } from "react";
import { DarkModeContext } from "../../context/DarkModeContext";
import { Table, Form, Modal, Button } from "react-bootstrap";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faCalendarDays, faFileExcel } from "@fortawesome/free-solid-svg-icons";
import * as XLSX from "xlsx"; // Importar XLSX
import Swal from "sweetalert2";


const TablaCRMInterno = () => {
  const [datos, setDatos] = useState([]); // Estado para los datos del CRM
  const [todosLosDatos, setTodosLosDatos] = useState([]); // Estado para almacenar todos los datos sin paginar
  const [fecha, setFecha] = useState(new Date().toISOString().split("T")[0]); // Estado para la fecha (por defecto hoy)
  const [paginaActual, setPaginaActual] = useState(1); // Estado para la paginación
  const [totalPaginas, setTotalPaginas] = useState(1); // Estado para el total de páginas
  const registrosPorPagina = 10; // Número de registros por página
  const { darkMode } = useContext(DarkModeContext);
  const [filaExtendida, setFilaExtendida] = useState(null);
  const [filtroEstado, setFiltroEstado] = useState("todos"); // Estado para el filtro de estado
  const [showModal, setShowModal] = useState(false);
  const [elementoSeleccionado, setElementoSeleccionado] = useState(null);
  const [formData, setFormData] = useState({});
  const [loading,setLoading]=useState(false)
    const [idUsuarioLogueado, setIdUsuarioLogueado] = useState(null);
    const [aliados, setAliados] = useState([]); // Estado para guardar la lista de aliados
    const [fechaFin, setFechaFin] = useState(new Date().toISOString().split("T")[0]); // Estado para la fecha de fin (por defecto hoy)

  const tableRowStyle = {
    transition: "transform 0.2s ease-in-out",
  };

  // const tableRowHoverStyle = {
  //   transform: "scale(1.01)",
  //   zIndex: 1,
  // };
    const handleFechaFinChange = (e) => {
        setFechaFin(e.target.value);
        setPaginaActual(1); // Resetear a la primera página cuando se cambia la fecha de fin
    };

  const tableCellStyle = (isExpanded) => ({
    whiteSpace: isExpanded ? "normal" : "nowrap",
    overflow: isExpanded ? "visible" : "hidden",
    textOverflow: isExpanded ? "clip" : "ellipsis",
    height: isExpanded ? "auto" : "60px",
  });
  

  // const tableCellHoverStyle = {
  //   whiteSpace: "normal",
  //   overflow: "visible",
  // };

  const handleFilaClick = (index) => {
    setFilaExtendida(filaExtendida === index ? null : index);
  };

  useEffect(() => {
    // Función para obtener los datos desde la API
      const obtenerDatos = async (fechaSeleccionada, fechaFinSeleccionada, pagina) => {
          const token = sessionStorage.getItem("token");

          try {
              const response = await fetch("/api/calidad/listadias", {
                  method: "POST",
                  headers: {
                      "Content-Type": "application/json",
                  },
                  body: JSON.stringify({
                      Token: token,
                      Fecha: fechaSeleccionada,
                      FechaFin: fechaFinSeleccionada, // Agregar FechaFin al body
                  }),
              });

              if (response.ok) {
                  const data = await response.json();
                  setTodosLosDatos(data);
                  // Dividir los datos en páginas
                  const inicio = (pagina - 1) * registrosPorPagina;
                  const fin = inicio + registrosPorPagina;
                  setDatos(data.slice(inicio, fin)); // Guardamos los primeros resultados
                  setTotalPaginas(Math.ceil(data.length / registrosPorPagina)); // Calculamos el total de páginas
              } else {
                  console.error("Error al obtener los datos");
              }
          } catch (error) {
              console.error("Error en la conexión", error);
          }
      };

      obtenerDatos(fecha, fechaFin, paginaActual); // Llamada a la API con FechaFin
  }, [fecha, fechaFin, paginaActual]); // Dependencias actualizadas// Actualizar cuando la fecha o la página cambien
    useEffect(() => {
        const obtenerIdUsuario = async () => {
            const token = sessionStorage.getItem("token");
            try {
                const response = await fetch("/api/token/obtenerid", {
                    method: "POST",
                    headers: {
                        "Content-Type": "application/json",
                    },
                    body: JSON.stringify({ Token: token }),
                });

                if (response.ok) {
                    const data = await response.json();
                    setIdUsuarioLogueado(data); // Aquí guardamos el id obtenido
                } else {
                    console.error("Error al obtener el id del usuario");
                }
            } catch (error) {
                console.error("Error en la conexión al obtener el id del usuario", error);
            }
        };

        obtenerIdUsuario(); // Llamada a la API para obtener el id del usuario
    }, []);
    useEffect(() => {
      // Función para obtener los aliados desde la API
      const obtenerAliados = async () => {
          const token = sessionStorage.getItem("token");

          try {
              const response = await fetch("/api/abm/obtenercomercios", {
                  method: "POST",
                  headers: {
                      "Content-Type": "application/json"
                  },
                  body: JSON.stringify({ Token: token }),
              });

              if (response.ok) {
                  const data = await response.json();
                  setAliados(data); // Actualizamos el estado con los aliados recibidos
              } else {
                  console.error("Error al obtener los aliados");
              }
          } catch (error) {
              console.error("Error en la conexión", error);
          }
      };

      obtenerAliados();
  }, []); // Ejecuta sol

  // Manejar cambio de fecha
  const handleFechaChange = (e) => {
    setFecha(e.target.value);
    setPaginaActual(1); // Resetear a la primera página cuando se cambia la fecha
  };

  // Cambiar página
  const cambiarPagina = (nuevaPagina) => {
    if (nuevaPagina > 0 && nuevaPagina <= totalPaginas) {
      setPaginaActual(nuevaPagina);
    }
  };
  const exportarExcel = () => {
    // Crea un libro de trabajo
    const workbook = XLSX.utils.book_new();
    // Convierte los datos en una hoja de trabajo
    const worksheet = XLSX.utils.json_to_sheet(todosLosDatos);
    // Agrega la hoja de trabajo al libro
    XLSX.utils.book_append_sheet(workbook, worksheet, "Datos");
    // Genera el archivo Excel y lo descarga
    XLSX.writeFile(workbook, `DatosCRM_${fecha}.xlsx`);
  };

  const handleFiltroChange = (e) => {
    setFiltroEstado(e.target.value);
    setPaginaActual(1);
  };
  const datosFiltrados = todosLosDatos.filter((dato) => {
    if (filtroEstado === "todos") return true;
    if (filtroEstado === "cerradas")
      return dato.estado === "Cerrado" || dato.estado === "Cerrada";
    if (filtroEstado === "pendiente")
      return dato.estado !== "Cerrado" && dato.estado !== "Cerrada";
    return true;
  });
    const abrirModal = (dato) => {
        // Si el aliado es "Proveedor" o "Otros", no concatenar
        const aliadoCompleto =
            dato.aliado === "Proveedor" || dato.aliado === "Otros"
                ? dato.aliado
                : `${dato.aliado} ${dato.nroTerminal || ""}`.trim(); // Concatenar solo si nroTerminal existe

        setElementoSeleccionado(dato);
        setFormData({
            nombreUsuario: dato.nombreUsuario,
            canalAtencion: dato.canalAtencion,
            tipo: dato.tipo,
            aliado: aliadoCompleto, // Usar el valor ajustado
            motivo: dato.motivo,
            estado: dato.estado,
            observaciones: dato.observaciones,
        });
        setShowModal(true);
    };



  const cerrarModal = () => {
    setShowModal(false);
    setElementoSeleccionado(null);
    setFormData({});
  };
  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const guardarCambios = async () => {
    const token = sessionStorage.getItem("token");
    if (!elementoSeleccionado) return;

    try {
        setLoading(true);
        const response = await fetch("/api/calidad/editarpanel", {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify({
                Token: token,
                id: elementoSeleccionado.id,
                ...formData,
            }),
        });

        if (response.ok) {
            const updatedData = todosLosDatos.map((item) =>
                item.id === elementoSeleccionado.id ? { ...item, ...formData } : item
            );
            setTodosLosDatos(updatedData);
            cerrarModal();

            // Mostrar SweetAlert de éxito
            Swal.fire({
                title: "Éxito",
                text: "Los cambios se han guardado correctamente.",
                icon: "success",
                confirmButtonText: "Aceptar",
            });
        } else {
            // Mostrar SweetAlert de error
            Swal.fire({
                title: "Error",
                text: "Hubo un problema al guardar los cambios. Inténtalo nuevamente.",
                icon: "error",
                confirmButtonText: "Aceptar",
            });
        }
    } catch (error) {
        // Mostrar SweetAlert de error en caso de fallo de conexión u otro problema
        Swal.fire({
            title: "Error",
            text: "Hubo un problema al guardar los cambios. Inténtalo nuevamente.",
            icon: "error",
            confirmButtonText: "Aceptar",
        });
        console.error("Error al guardar los cambios", error);
    } finally {
        setLoading(false);
    }
};

  return (
    <section
      className={
        darkMode
          ? "container cuadro-calificaciones-dark"
          : "container cuadro-calificaciones"
      }
      style={{
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        height: "100vh",
        width: "100%",
        marginTop: "20px",
      }}
    >
      <div
        className={
          darkMode
            ? "container table-responsive py-3 px-5"
            : "container table-responsive py-3 px-5"
        }
      >
        {/* Selector de fecha */}

        {/* Tabla de resultados */}
        <article>
          <div
            className={
              darkMode
                ? "container table-responsive py-3 px-5"
                : "container table-responsive py-3 px-5"
            }
          >
            <div
              className="form-group"
              style={{
                display: "flex",
                justifyContent: "space-between",
                alignItems: "center",
                width: "100%", // Ocupa todo el ancho del contenedor
                marginBottom: "10px",
                gap: "10px",
              }}
            >
              <div style={{ display: "flex", alignItems: "center" }}>
                <label
                  htmlFor="fecha"
                  className="lato-regular fs-16"
                  style={{
                    display: "flex", // Para alinear icono y texto
                    alignItems: "center", // Centra verticalmente el texto y el icono
                    marginRight: "10px", // Espacio entre el label y el input
                    height: "44px", // Asegura que la altura sea igual al botón
                  }}
                >
                  {" "}
                  <FontAwesomeIcon
                    icon={faCalendarDays}
                    style={{ marginRight: "5px", color: "#89939F" }}
                  />{" "}
                  Fecha:
                </label>
                <input
                  type="date"
                  id="fecha"
                  className="form-control"
                  value={fecha}
                  onChange={handleFechaChange}
                  style={{
                    width: "auto", // Ajusta el tamaño del input a lo necesario
                    height: "44px", // Ajusta la altura para que coincida con la del botón
                    background: "#DCDEE1",
                    marginRight: "15px", //
                    borderRadius:"32px"
                  }}
                              /><div style={{ display: "flex", alignItems: "center", gap: "10px" }}>
                                  <label
                                      htmlFor="fechaFin"
                                      className="lato-regular fs-16"
                                      style={{
                                          display: "flex",
                                          alignItems: "center",
                                          marginRight: "10px",
                                          height: "44px",
                                      }}
                                  >
                                      <FontAwesomeIcon
                                          icon={faCalendarDays}
                                          style={{ marginRight: "5px", color: "#89939F" }}
                                      />
                                      Fecha Fin:
                                  </label>
                                  <input
                                      type="date"
                                      id="fechaFin"
                                      className="form-control"
                                      value={fechaFin}
                                      onChange={handleFechaFinChange}
                                      style={{
                                          width: "auto",
                                          height: "44px",
                                          background: "#DCDEE1",
                                          borderRadius: "32px",
                                      }}
                                  />
                              </div>

                <div style={{ marginRight: "10px" }}>
                  <select
                    value={filtroEstado}
                    onChange={handleFiltroChange}
                    className="form-control"
                    style={{
                      height: "44px",
                      background: "#DCDEE1",
                      borderRadius:"32px"
                    }}
                  >
                    <option value="todos">Todos</option>
                    <option value="cerradas">Cerradas</option>
                    <option value="pendiente">Pendiente</option>
                  </select>
                </div>

                <div style={{ textAlign: "right" }}>
                  <button
                    className="btn"
                    onClick={exportarExcel}
                    style={{
                      width: "200px", // Ajuste del ancho del botón, haciéndolo más grande
                      height: "44px",
                      background: "#B4C400",
                      color: "#FFFFFF",
                      borderRadius:"32px"
                    }}
                  >
                    <FontAwesomeIcon className="me-2" icon={faFileExcel} />
                    Descargar Excel
                  </button>
                </div>
              </div>
            </div>
            <Table table table-borderless responsive striped hov>
              <thead className="bg-dark py-2">
                              <tr className="text-center tabla-thead">
                                  <th
                                      className={
                                          darkMode
                                              ? "bg-white text-dark border-tabla-izquierda border-0 lato-regular fs-14 py-3"
                                              : "bg-dark text-white border-tabla-izquierda border-0 lato-regular fs-14 py-3"
                                      }
                                      scope="col"
                                  >
                                      Acción
                                  </th>

                  <th
                    className={
                      darkMode
                        ? "bg-white text-dark border-tabla border-0 lato-regular fs-14 py-3"
                        : "bg-dark text-white border-tabla border-0 lato-regular fs-14 py-3"
                    }
                    scope="col"
                  >
                    ID
                  </th>
                  <th
                    className={
                      darkMode
                        ? "bg-white text-dark border-tabla border-0 lato-regular fs-14 py-3"
                        : "bg-dark text-white border-tabla border-0 lato-regular fs-14 py-3"
                    }
                    scope="col"
                  >
                    Nombre Usuario
                  </th>{" "}
                  {/* Nueva columna para el nombre */}
                  <th
                    className={
                      darkMode
                        ? "bg-white text-dark border-tabla border-0 lato-regular fs-14 py-3"
                        : "bg-dark text-white border-tabla border-0 lato-regular fs-14 py-3"
                    }
                    scope="col"
                  >
                    Fecha
                  </th>
                  <th
                    className={
                      darkMode
                        ? "bg-white text-dark border-tabla border-0 lato-regular fs-14 py-3"
                        : "bg-dark text-white border-tabla border-0 lato-regular fs-14 py-3"
                    }
                    scope="col"
                  >
                    Hora
                  </th>
                  <th
                    className={
                      darkMode
                        ? "bg-white text-dark border-tabla border-0 lato-regular fs-14 py-3"
                        : "bg-dark text-white border-tabla border-0 lato-regular fs-14 py-3"
                    }
                    scope="col"
                  >
                    Canal de Atención
                  </th>
                  <th
                    className={
                      darkMode
                        ? "bg-white text-dark border-tabla border-0 lato-regular fs-14 py-3"
                        : "bg-dark text-white border-tabla border-0 lato-regular fs-14 py-3"
                    }
                    scope="col"
                  >
                    Tipo
                  </th>
                  <th
                    className={
                      darkMode
                        ? "bg-white text-dark border-tabla border-0 lato-regular fs-14 py-3"
                        : "bg-dark text-white border-tabla border-0 lato-regular fs-14 py-3"
                    }
                    scope="col"
                  >
                    Aliado
                                  </th>   <th
                                      className={
                                          darkMode
                                              ? "bg-white text-dark border-tabla border-0 lato-regular fs-14 py-3"
                                              : "bg-dark text-white border-tabla border-0 lato-regular fs-14 py-3"
                                      }
                                      scope="col"
                                  >
                                      Nro Terminals
                                  </th>
                  <th
                    className={
                      darkMode
                        ? "bg-white text-dark border-tabla border-0 lato-regular fs-14 py-3"
                        : "bg-dark text-white border-tabla border-0 lato-regular fs-14 py-3"
                    }
                    scope="col"
                  >
                    Motivo
                  </th>
                  <th
                    className={
                      darkMode
                        ? "bg-white text-dark border-tabla border-0 lato-regular fs-14 py-3"
                        : "bg-dark text-white border-tabla border-0 lato-regular fs-14 py-3"
                    }
                    scope="col"
                  >
                    Estado
                  </th>
                  <th
                    className={
                      darkMode
                        ? "bg-white text-dark border-tabla-derecha border-0 lato-regular fs-14 py-3"
                        : "bg-dark text-white border-tabla-derecha border-0 lato-regular fs-14 py-3"
                    }
                    scope="col"
                  >
                    Observaciones
                  </th>
                </tr>
              </thead>
                          <tbody className="text-center">
                              {datosFiltrados.length > 0 ? (
                                  datosFiltrados
                                      .slice(
                                          (paginaActual - 1) * registrosPorPagina,
                                          paginaActual * registrosPorPagina
                                      )
                                      .map((dato, index) => (
                                          <tr
                                              className={darkMode ? "bg-dark text-white" : "bg-white text-dark"}
                                              style={tableRowStyle}
                                              onMouseEnter={(e) => {
                                                  e.currentTarget.style.transform = "scale(1.01)";
                                                  e.currentTarget.style.overflow = "hidden";
                                              }}
                                              onMouseLeave={(e) => (e.currentTarget.style.transform = "scale(1)")}
                                              onClick={() => handleFilaClick(index)}
                                              key={index}
                                          >
                                              {/* Columna "Acción" */}
                                              <td
                                                  style={tableCellStyle(filaExtendida === index)}
                                                  className={
                                                      darkMode
                                                          ? "fs-14 lato-regular py-4 prority-4 text-white"
                                                          : "fs-14 lato-regular py-4 prority-4"
                                                  }
                                              >
                                                  {dato.idUser === idUsuarioLogueado ? (
                                                      <button
                                                          className="btn"
                                                          style={{
                                                              backgroundColor: "#B4C400",
                                                              color: "#FFFFFF",
                                                              borderRadius: "16px",
                                                              padding: "5px 10px",
                                                          }}
                                                          onClick={() => abrirModal(dato)}
                                                      >
                                                          Editar
                                                      </button>
                                                  ) : (
                                                      "-"
                                                  )}
                                              </td>
                                              <td
                                                  style={tableCellStyle(filaExtendida === index)}
                                                  className={
                                                      darkMode
                                                          ? "fs-14 lato-regular py-4 prority-4 text-white"
                                                          : "fs-14 lato-regular py-4 prority-4"
                                                  }
                                              >
                                                  {dato.id}
                                              </td>
                                              <td
                                                  style={tableCellStyle(filaExtendida === index)}
                                                  className={
                                                      darkMode
                                                          ? "fs-14 lato-regular py-4 prority-4 text-white"
                                                          : "fs-14 lato-regular py-4 prority-4"
                                                  }
                                              >
                                                  {dato.nombreUsuario}
                                              </td>
                                              <td
                                                  style={tableCellStyle(filaExtendida === index)}
                                                  className={
                                                      darkMode
                                                          ? "fs-14 lato-regular py-4 prority-4 text-white"
                                                          : "fs-14 lato-regular py-4 prority-4"
                                                  }
                                              >
                                                  {new Date(dato.fechaCarga).toLocaleDateString()}
                                              </td>
                                              <td
                                                  style={tableCellStyle(filaExtendida === index)}
                                                  className={
                                                      darkMode
                                                          ? "fs-14 lato-regular py-4 prority-4 text-white"
                                                          : "fs-14 lato-regular py-4 prority-4"
                                                  }
                                              >
                                                  {new Date(dato.fechaCarga).toLocaleTimeString()}
                                              </td>
                                              <td
                                                  style={tableCellStyle(filaExtendida === index)}
                                                  className={
                                                      darkMode
                                                          ? "fs-14 lato-regular py-4 prority-4 text-white"
                                                          : "fs-14 lato-regular py-4 prority-4"
                                                  }
                                              >
                                                  {dato.canalAtencion}
                                              </td>
                                              <td
                                                  style={tableCellStyle(filaExtendida === index)}
                                                  className={
                                                      darkMode
                                                          ? "fs-14 lato-regular py-4 prority-4 text-white"
                                                          : "fs-14 lato-regular py-4 prority-4"
                                                  }
                                              >
                                                  {dato.tipo}
                                              </td>
                                              <td
                                                  style={tableCellStyle(filaExtendida === index)}
                                                  className={
                                                      darkMode
                                                          ? "fs-14 lato-regular py-4 prority-4 text-white"
                                                          : "fs-14 lato-regular py-4 prority-4"
                                                  }
                                              >
                                                  {dato.aliado}
                                              </td>   <td
                                                  style={tableCellStyle(filaExtendida === index)}
                                                  className={
                                                      darkMode
                                                          ? "fs-14 lato-regular py-4 prority-4 text-white"
                                                          : "fs-14 lato-regular py-4 prority-4"
                                                  }
                                              >
                                                  {dato.nroTerminal}
                                              </td>
                                              <td
                                                  style={tableCellStyle(filaExtendida === index)}
                                                  className={
                                                      darkMode
                                                          ? "fs-14 lato-regular py-4 prority-4 text-white"
                                                          : "fs-14 lato-regular py-4 prority-4"
                                                  }
                                              >
                                                  {dato.motivo}
                                              </td>
                                              <td
                                                  style={tableCellStyle(filaExtendida === index)}
                                                  className={
                                                      darkMode
                                                          ? "fs-14 lato-regular py-4 prority-4 text-white"
                                                          : "fs-14 lato-regular py-4 prority-4"
                                                  }
                                              >
                                                  {dato.estado}
                                              </td>
                                              <td
                                                  style={tableCellStyle(filaExtendida === index)}
                                                  className={
                                                      darkMode
                                                          ? "fs-14 lato-regular py-4 prority-4 text-white"
                                                          : "fs-14 lato-regular py-4 prority-4"
                                                  }
                                              >
                                                  {dato.observaciones}
                                              </td>
                                          </tr>
                                      ))
                              ) : (
                                  <tr>
                                      <td colSpan="11">No hay datos disponibles para la fecha seleccionada.</td>
                                  </tr>
                              )}
                          </tbody>

            </Table>
            <Modal show={showModal} onHide={cerrarModal} centered>
            <Modal.Header closeButton>
    <Modal.Title>Editar Elemento</Modal.Title>
  </Modal.Header>
  <Modal.Body>
    <Form>
      <Form.Group>
        <Form.Label>Canal de Atención</Form.Label>
        <Form.Control
          as="select"
          name="canalAtencion"
          value={formData.canalAtencion || ""}
          onChange={handleInputChange}
        >
          <option value="">Seleccione una opción</option>
          <option value="Comanda">Comanda</option>
          <option value="Correo Electrónico">Correo Electrónico</option>
          <option value="Meet">Meet</option>
          <option value="Mensajería Instantánea">Mensajería Instantánea (WhatsApp)</option>
          <option value="Presencial">Presencial</option>
          <option value="Teléfono">Teléfono</option>
          <option value="Otros">Otros</option>
        </Form.Control>
      </Form.Group>
      <Form.Group>
        <Form.Label>Tipo</Form.Label>
        <Form.Control
          as="select"
          name="tipo"
          value={formData.tipo || ""}
          onChange={handleInputChange}
        >
          <option value="">Seleccione una opción</option>
          <option value="Comanda">Comanda</option>
          <option value="Información General">Información General</option>
          <option value="Pedido">Pedido</option>
          <option value="Reunión">Reunión</option>
          <option value="Soporte Técnico">Soporte Técnico</option>
          <option value="Otros">Otros</option>
        </Form.Control>
      </Form.Group>
                                  <Form.Group>
                                      <Form.Label>Aliado</Form.Label>
                                      <Form.Control
                                          as="select"
                                          name="aliado"
                                          value={formData.aliado || ""} // Precargar el valor seleccionado
                                          onChange={handleInputChange}
                                      >
                                          <option value="">Seleccione una opción</option>
                                          <option value="Proveedor">Proveedor</option>
                                          <option value="Otros">Otros</option>
                                          {/* Aliados dinámicos */}
                                          {aliados.map((aliado, index) => {
                                              // Comparar directamente con formData.aliado
                                              const isSelected = formData.aliado === aliado;

                                              return (
                                                  <option
                                                      key={index}
                                                      value={aliado} // Valor completo
                                                  >
                                                      {aliado} {/* Mostrar el valor completo */}
                                                  </option>
                                              );
                                          })}
                                      </Form.Control>
                                  </Form.Group>


      <Form.Group>
        <Form.Label>Motivo</Form.Label>
        <Form.Control
          as="select"
          name="motivo"
          value={formData.motivo || ""}
          onChange={handleInputChange}
        >
          <option value="">Seleccione una opción</option>
                        <option value="ZOCO CHECK">ZOCO CHECK </option>
                        <option value="ZOCO MEET">ZOCO MEET</option>
                        <option value="ZOCO SEGUROS">ZOCO SEGUROS</option>
                        <option value="ZOCO AUDITORIA">ZOCO AUDITORIA</option>
                        <option value="ZOCO AYUDA">ZOCO AYUDA</option>

                        <option value="ZOCO STOP">ZOCO STOP</option>
                                          <option value="ZOCO CONNECT">ZOCO CONNECT</option>
                        <option value="ZOCO REWARDS">ZOCO REWARDS</option>
                        <option value="ZOCO ENVIOS">ZOCO ENVIOS</option>
                           <option value="ZOCO FACTURACION">ZOCO FACTURACION</option>
                         <option value="ZOCO SOLUCIONES A MEDIDA">ZOCO SOLUCIONES A MEDIDA</option>
                          <option value="ZOCO ARANCELES">ZOCO ARANCELES</option>
                        <option value="ROBO TERMINAL">ROBO TERMINAL</option>
                        <option value="ENVIO ROLLOS">ENVIO ROLLOS</option>
                        <option value="SERVICIO TECNICO">SERVICIO TECNICO</option>
                        <option value="INCORPORACION DE TARJETAS">INCORPORACION DE TARJETAS</option>

                        <option value="Otros">Otros</option>
        </Form.Control>
      </Form.Group>
      <Form.Group>
        <Form.Label>Estado</Form.Label>
        <Form.Control
          as="select"
          name="estado"
          value={formData.estado || ""}
          onChange={handleInputChange}
        >
          <option value="">Seleccione una opción</option>
          <option value="Cerrado">Cerrado</option>
          <option value="Transferencia">Transferencia</option>
          <option value="Pendiente">Pendiente</option>
          <option value="En Espera de Respuesta">En Espera de Respuesta</option>
          <option value="Otros">Otros</option>
        </Form.Control>
      </Form.Group>
      <Form.Group>
        <Form.Label>Observaciones</Form.Label>
        <Form.Control
          as="textarea"
          rows={3}
          name="observaciones"
          value={formData.observaciones || ""}
          onChange={handleInputChange}
        />
      </Form.Group>
    </Form>
  </Modal.Body>
  <Modal.Footer>
    <button
      className="btn"
      style={{
        backgroundColor: "#E24444",
        color: "#FFFFFF",
        borderRadius: "16px",
        padding: "5px 10px",
      }}
      onClick={cerrarModal}
    >
      Cancelar
    </button>
    <button
      className="btn"
      style={{
        backgroundColor: "#B4C400",
        color: "#FFFFFF",
        borderRadius: "16px",
        padding: "5px 10px",
      }}
      onClick={guardarCambios}
    >
      Guardar Cambios
    </button>
  </Modal.Footer>
</Modal>
          </div>
        </article>

        {/* Paginación */}
        <div className="d-flex justify-content-between">
          <button
            className="btn"
            style={{
              borderRadius: "23px",
              top: "848px",
              left: "1343px",
              width: "182px",
              height: "44px",
              background: "#B4C400",
              color: "#FFFFFF",
              marginTop: "10px",
            }}
            onClick={() => cambiarPagina(paginaActual - 1)}
            disabled={paginaActual === 1}
          >
            Anterior
          </button>
          <span>
            Página {paginaActual} de {totalPaginas}
          </span>
          <button
            className="btn"
            style={{
              borderRadius: "23px",
              top: "848px",
              left: "1343px",
              width: "182px",
              height: "44px",
              background: "#B4C400",
              color: "#FFFFFF",
              marginTop: "10px",
            }}
            onClick={() => cambiarPagina(paginaActual + 1)}
            disabled={paginaActual === totalPaginas}
          >
            Siguiente
          </button>
        </div>
      </div>
    </section>
  );
};

export default TablaCRMInterno;
