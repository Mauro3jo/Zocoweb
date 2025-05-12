import React, { useState, useEffect, useContext } from "react";
import { DarkModeContext } from "../../context/DarkModeContext";
import { Table, Modal, Form } from "react-bootstrap";
import * as XLSX from "xlsx";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faEdit } from "@fortawesome/free-solid-svg-icons";
import { faFileExcel } from "@fortawesome/free-solid-svg-icons";

const TablaAuditoria = () => {
  const [datos, setDatos] = useState([]); // Estado para los datos del CRM
  const [todosLosDatos, setTodosLosDatos] = useState([]); // Estado para almacenar todos los datos sin paginar
  const [fecha, setFecha] = useState(new Date().toISOString().split("T")[0]); // Estado para la fecha (por defecto hoy)
  const [paginaActual, setPaginaActual] = useState(1); // Estado para la paginación
  const [totalPaginas, setTotalPaginas] = useState(1); // Estado para el total de páginas
  const registrosPorPagina = 10; // Número de registros por página
  const { darkMode } = useContext(DarkModeContext);
  const [filtroEstado, setFiltroEstado] = useState("todos"); // Estado para el filtro de estado
  const [filaExtendida, setFilaExtendida] = useState(null);
  const [showModal, setShowModal] = useState(false);
  const [datosActuales, setDatosActuales] = useState(null);

  useEffect(() => {
    // Función para obtener los datos desde la API
    const obtenerDatos = async (fechaSeleccionada, pagina) => {
      const token = sessionStorage.getItem("token");

      try {
        const response = await fetch("/api/panelinternocalidad/listadias", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            Token: token,
            Fecha: fechaSeleccionada,
          }),
        });

        if (response.ok) {
          const data = await response.json();
          setTodosLosDatos(data);
          console.log(data);
          // Dividir los datos en páginas
          const inicio = (pagina - 1) * registrosPorPagina;
          const fin = inicio + registrosPorPagina;
          setDatos(data.slice(inicio, fin)); // Guardamos los primeros 10 resultados
          setTotalPaginas(Math.ceil(data.length / registrosPorPagina)); // Calculamos el total de páginas
        } else {
          console.error("Error al obtener los datos");
        }
      } catch (error) {
        console.error("Error en la conexión", error);
      }
    };

    obtenerDatos(fecha, paginaActual);
  }, [fecha, paginaActual]); // Actualizar cuando la fecha o la página cambien
  

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

  const tableRowStyle = {
    transition: "transform 0.2s ease-in-out",
  };

  // const tableRowHoverStyle = {
  //   transform: "scale(1.01)",
  //   zIndex: 1,
  // };

  const tableCellStyle = (isExpanded) => ({
    whiteSpace: isExpanded ? "normal" : "nowrap",
    overflow: isExpanded ? "visible" : "hidden",
    textOverflow: isExpanded ? "clip" : "ellipsis",
    height: isExpanded ? "auto" : "60px",
  });
  const handleFilaClick = (index) => {
    setFilaExtendida(filaExtendida === index ? null : index);
  };

  const exportarExcel = () => {
    // Crea un libro de trabajo
    const workbook = XLSX.utils.book_new();
    // Convierte los datos en una hoja de trabajo
    const worksheet = XLSX.utils.json_to_sheet(todosLosDatos);
    // Agrega la hoja de trabajo al libro
    XLSX.utils.book_append_sheet(workbook, worksheet, "Datos");
    // Genera el archivo Excel y lo descarga
    XLSX.writeFile(workbook, `Auditorias_${fecha}.xlsx`);
  };

  const datosFiltrados = todosLosDatos.filter((dato) => {
    if (filtroEstado === "todos") return true;
    if (filtroEstado === "cerradas")
      return dato.estado === "Cerrado" || dato.estado === "Cerrada";
    if (filtroEstado === "pendiente")
      return dato.estado !== "Cerrado" && dato.estado !== "Cerrada";
    return true;
  });
  // Función para abrir el modal y establecer los datos actuales
  const handleEditClick = (dato) => {
    setDatosActuales(dato);
    console.log(dato);
    setShowModal(true);
  };

  // Función para cerrar el modal
  const handleCloseModal = () => {
    setShowModal(false);
    setDatosActuales(null);
  };

  // Función para manejar el cambio de los campos en el formulario del modal
  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setDatosActuales((prevState) => ({
      ...prevState,
      [name]: value,
    }));
  };

  // Función para enviar los datos editados
  const handleEnviar = async () => {
    const token = sessionStorage.getItem("token");
    try {
      const response = await fetch("/api/panelinternocalidad/editardatopanel", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          id: datosActuales.id,
          token: token,
          ...datosActuales,
        }),
      });

      if (response.ok) {
        alert("Datos actualizados correctamente");
        setShowModal(false);
        setPaginaActual(1); // Refrescar la tabla
      } else {
        alert("Error al actualizar los datos");
      }
    } catch (error) {
      console.error("Error al enviar los datos", error);
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
        {/* Tabla de resultados */}
        <article>
          <div style={{ textAlign: "right", marginBottom: "10px" }}>
            <button
              className="btn"
              onClick={exportarExcel}
              style={{
                width: "200px", // Ajuste del ancho del botón, haciéndolo más grande
                height: "44px",
                background: "#B4C400",
                color: "#FFFFFF",
                borderRadius: "32px",
              }}
            >
              <FontAwesomeIcon className="me-2" icon={faFileExcel} />
              Descargar Excel
            </button>
          </div>
          <Table table-borderless responsive striped>
            <thead className="bg-dark py-2">
              <tr className="text-center tabla-thead">
                <th
                  scope="col"
                  className={
                    darkMode
                      ? "bg-white text-dark border-tabla-izquierda border-0 lato-regular fs-14 py-3"
                      : "bg-dark text-white border-tabla-izquierda border-0 lato-regular fs-14 py-3"
                  }
                >
                  Editar
                </th>
                <th
                  scope="col"
                  className={
                    darkMode
                      ? "bg-white text-dark border-tabla border-0 lato-regular fs-14 py-3"
                      : "bg-dark text-white border-tabla border-0 lato-regular fs-14 py-3"
                  }
                >
                  ID
                </th>
                <th
                  scope="col"
                  className={
                    darkMode
                      ? "bg-white text-dark border-tabla border-0 lato-regular fs-14 py-3"
                      : "bg-dark text-white border-tabla border-0 lato-regular fs-14 py-3"
                  }
                >
                  Usuario
                </th>
                <th
                  scope="col"
                  className={
                    darkMode
                      ? "bg-white text-dark border-tabla border-0 lato-regular fs-14 py-3"
                      : "bg-dark text-white border-tabla border-0 lato-regular fs-14 py-3"
                  }
                >
                  Fecha
                </th>
                <th
                  scope="col"
                  className={
                    darkMode
                      ? "bg-white text-dark border-tabla border-0 lato-regular fs-14 py-3"
                      : "bg-dark text-white border-tabla border-0 lato-regular fs-14 py-3"
                  }
                >
                  Hora
                </th>
                <th
                  scope="col"
                  className={
                    darkMode
                      ? "bg-white text-dark border-tabla border-0 lato-regular fs-14 py-3"
                      : "bg-dark text-white border-tabla border-0 lato-regular fs-14 py-3"
                  }
                >
                  Actividad
                </th>
                <th
                  scope="col"
                  className={
                    darkMode
                      ? "bg-white text-dark border-tabla border-0 lato-regular fs-14 py-3"
                      : "bg-dark text-white border-tabla border-0 lato-regular fs-14 py-3"
                  }
                >
                  Estado
                </th>
                
                <th
                  scope="col"
                  className={
                    darkMode
                      ? "bg-white text-dark border-tabla border-0 lato-regular fs-14 py-3"
                      : "bg-dark text-white border-tabla border-0 lato-regular fs-14 py-3"
                  }
                >
                  Estado de Auditoría
                </th>
                <th
                  scope="col"
                  className={
                    darkMode
                      ? "bg-white text-dark border-tabla border-0 lato-regular fs-14 py-3"
                      : "bg-dark text-white border-tabla border-0 lato-regular fs-14 py-3"
                  }
                >
                  Empleado
                </th>
                <th
                  scope="col"
                  className={
                    darkMode
                      ? "bg-white text-dark border-tabla border-0 lato-regular fs-14 py-3"
                      : "bg-dark text-white border-tabla border-0 lato-regular fs-14 py-3"
                  }
                >
                  Aliado
                </th>
                <th
                  scope="col"
                  className={
                    darkMode
                      ? "bg-white text-dark border-tabla border-0 lato-regular fs-14 py-3"
                      : "bg-dark text-white border-tabla border-0 lato-regular fs-14 py-3"
                  }
                >
                  Fecha de Auditoria
                </th>
                <th
                  scope="col"
                  className={
                    darkMode
                      ? "bg-white text-dark border-tabla border-0 lato-regular fs-14 py-3"
                      : "bg-dark text-white border-tabla border-0 lato-regular fs-14 py-3"
                  }
                >
                  Motivo
                </th>
                <th
                  scope="col"
                  className={
                    darkMode
                      ? "bg-white text-dark border-tabla border-0 lato-regular fs-14 py-3"
                      : "bg-dark text-white border-tabla border-0 lato-regular fs-14 py-3"
                  }
                >
                  Interés Ayudar
                </th>
                <th
                  scope="col"
                  className={
                    darkMode
                      ? "bg-white text-dark border-tabla border-0 lato-regular fs-14 py-3"
                      : "bg-dark text-white border-tabla border-0 lato-regular fs-14 py-3"
                  }
                >
                  Explicación
                </th>
                <th
                  scope="col"
                  className={
                    darkMode
                      ? "bg-white text-dark border-tabla border-0 lato-regular fs-14 py-3"
                      : "bg-dark text-white border-tabla border-0 lato-regular fs-14 py-3"
                  }
                >
                  Contenemos Aliado
                </th>
                <th
                  scope="col"
                  className={
                    darkMode
                      ? "bg-white text-dark border-tabla border-0 lato-regular fs-14 py-3"
                      : "bg-dark text-white border-tabla border-0 lato-regular fs-14 py-3"
                  }
                >
                  Optimizamos tiempo
                </th>
                <th
                  scope="col"
                  className={
                    darkMode
                      ? "bg-white text-dark border-tabla border-0 lato-regular fs-14 py-3"
                      : "bg-dark text-white border-tabla border-0 lato-regular fs-14 py-3"
                  }
                >
                  Información Incorrecta
                </th>
                <th
                  scope="col"
                  className={
                    darkMode
                      ? "bg-white text-dark border-tabla border-0 lato-regular fs-14 py-3"
                      : "bg-dark text-white border-tabla border-0 lato-regular fs-14 py-3"
                  }
                >
                  Errores
                </th>
                <th
                  scope="col"
                  className={
                    darkMode
                      ? "bg-white text-dark border-tabla border-0 lato-regular fs-14 py-3"
                      : "bg-dark text-white border-tabla border-0 lato-regular fs-14 py-3"
                  }
                >
                  Plazos
                </th>
                <th
                  scope="col"
                  className={
                    darkMode
                      ? "bg-white text-dark border-tabla border-0 lato-regular fs-14 py-3"
                      : "bg-dark text-white border-tabla border-0 lato-regular fs-14 py-3"
                  }
                >
                  Facturación
                </th>
                <th
                  scope="col"
                  className={
                    darkMode
                      ? "bg-white text-dark border-tabla-derecha border-0 lato-regular fs-14 py-3"
                      : "bg-dark text-white border-tabla-derecha border-0 lato-regular fs-14 py-3"
                  }
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
                      style={tableRowStyle}
                      onMouseEnter={(e) => {
                        e.currentTarget.style.transform =
                          // tableRowHoverStyle.transform;
                          e.currentTarget.style.overflow = "hidden"; // Asegura que no se muestre scroll lateral
                      }}
                      onMouseLeave={(e) =>
                        (e.currentTarget.style.transform = "scale(1)")
                      }
                      onClick={() => handleFilaClick(index)}
                      key={index}
                    >
                      <td style={tableCellStyle(filaExtendida === index)}>
                        <button
                          className="btn"
                          style={{
                            borderRadius: "35px",
                            background: "#B4C400",
                            color: "#FFFFFF",
                          }}
                          onClick={() => handleEditClick(dato)}
                        >
                          <FontAwesomeIcon icon={faEdit} />
                        </button>
                      </td>
                      <td style={tableCellStyle(filaExtendida === index)}>
                        {dato.id}
                      </td>
                      <td style={tableCellStyle(filaExtendida === index)}>
                        {dato.nombreUsuario}
                      </td>
                      <td style={tableCellStyle(filaExtendida === index)}>
                        {new Date(dato.fechaCarga).toLocaleDateString()}
                      </td>
                      <td style={tableCellStyle(filaExtendida === index)}>
                        {new Date(dato.fechaCarga).toLocaleTimeString()}
                      </td>
                      <td style={tableCellStyle(filaExtendida === index)}>
                        {dato.actividad}
                      </td>
                      <td style={tableCellStyle(filaExtendida === index)}>
                        {dato.estado}
                      </td>
                      <td style={tableCellStyle(filaExtendida === index)}>
                        {dato.estadoAuditoria}
                      </td>
                      <td style={tableCellStyle(filaExtendida === index)}>
                        {dato.nombreGestor}
                      </td>
                      <td style={tableCellStyle(filaExtendida === index)}>
                        {dato.aliado}
                      </td>
                      <td style={tableCellStyle(filaExtendida === index)}>
                        {dato.fecha}
                      </td>
                      <td style={tableCellStyle(filaExtendida === index)}>
                        {dato.motivo}
                      </td>
                      <td style={tableCellStyle(filaExtendida === index)}>
                        {dato.interesAyudar}
                      </td>
                      <td style={tableCellStyle(filaExtendida === index)}>
                        {dato.explicacion}
                      </td>
                      <td style={tableCellStyle(filaExtendida === index)}>
                        {dato.contenemosAliado}
                      </td>
                      <td style={tableCellStyle(filaExtendida === index)}>
                        {dato.optimisamosTiempo}
                      </td>
                      <td style={tableCellStyle(filaExtendida === index)}>
                        {dato.informacionIncorrecta}
                      </td>
                      <td style={tableCellStyle(filaExtendida === index)}>
                        {dato.errores}
                      </td>
                      <td style={tableCellStyle(filaExtendida === index)}>
                        {dato.plazos}
                      </td>
                      <td style={tableCellStyle(filaExtendida === index)}>
                        {dato.facturacion}
                      </td>
                      <td style={tableCellStyle(filaExtendida === index)}>
                        {dato.observaciones}
                      </td>
                    </tr>
                  ))
              ) : (
                <tr>
                  <td colSpan="17">No hay datos disponibles.</td>
                </tr>
              )}
            </tbody>
          </Table>
        </article>

        {/* Paginación */}
        <div className="d-flex justify-content-between">
          <button
            className="btn"
            style={{
              borderRadius: "23px",
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
      <Modal show={showModal} onHide={handleCloseModal} size="lg">
        <Modal.Header closeButton>
          <Modal.Title>Editar Datos</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          {datosActuales && (
            <Form>
              <Form.Group controlId="formId">
                <Form.Label>ID</Form.Label>
                <Form.Control type="text" value={datosActuales.id} readOnly />
              </Form.Group>
              <Form.Group controlId="formUsuario">
                <Form.Label>Usuario</Form.Label>
                <Form.Control
                  type="text"
                  name="nombreUsuario"
                  value={datosActuales.nombreUsuario}
                  onChange={handleInputChange}
                />
              </Form.Group>
              <Form.Group controlId="formFechaHora">
                <Form.Label>Fecha y Hora</Form.Label>
                <Form.Control
                  type="text"
                  name="fecha"
                  value={datosActuales.fechaCarga}
                  onChange={handleInputChange}
                />
              </Form.Group>
              <Form.Group controlId="formEstado">
                <Form.Label>Estado</Form.Label>
                <Form.Control
                  type="text"
                  name="estado"
                  value={datosActuales.estado}
                  onChange={handleInputChange}
                />
              </Form.Group>
              <Form.Group controlId="formActividad">
                <Form.Label>Actividad</Form.Label>
                <Form.Control
                  type="text"
                  name="actividad"
                  value={datosActuales.actividad}
                  onChange={handleInputChange}
                />
              </Form.Group>
              <Form.Group controlId="formEstadoAuditoria">
                <Form.Label>Estado de Auditoria</Form.Label>
                <Form.Control
                  type="text"
                  name="EstadoAuditoria"
                  value={datosActuales.estadoAuditoria}
                  onChange={handleInputChange}
                />
              </Form.Group>
              <Form.Group controlId="formEmpleado">
                <Form.Label>Empleado</Form.Label>
                <Form.Control
                  type="text"
                  name="empleado"
                  value={datosActuales.nombreGestor}
                  onChange={handleInputChange}
                />
              </Form.Group>
              <Form.Group controlId="formAliado">
                <Form.Label>Aliado</Form.Label>
                <Form.Control
                  type="text"
                  name="aliado"
                  value={datosActuales.aliado}
                  onChange={handleInputChange}
                />
              </Form.Group>
              <Form.Group controlId="formInteresAyudar">
                <Form.Label>Interés en Ayudar</Form.Label>
                <Form.Control
                  as="select"
                  name="interesAyudar"
                  value={datosActuales.interesAyudar}
                  onChange={handleInputChange}
                >
                  <option value="SI">SI</option>
                  <option value="NO">NO</option>
                  <option value="NA">NA</option>
                </Form.Control>
              </Form.Group>

              <Form.Group controlId="formExplicacion">
                <Form.Label>Explicación</Form.Label>
                <Form.Control
                  as="select"
                  name="explicacion"
                  value={datosActuales.explicacion}
                  onChange={handleInputChange}
                >
                  <option value="SI">SI</option>
                  <option value="NO">NO</option>
                  <option value="NA">NA</option>
                </Form.Control>
              </Form.Group>

              <Form.Group controlId="formContenemosAliado">
                <Form.Label>Contenemos al aliado</Form.Label>
                <Form.Control
                  as="select"
                  name="contenemosAliado"
                  value={datosActuales.contenemosAliado}
                  onChange={handleInputChange}
                >
                  <option value="SI">SI</option>
                  <option value="NO">NO</option>
                  <option value="NA">NA</option>
                </Form.Control>
              </Form.Group>

              <Form.Group controlId="formInformacionIncorrecta">
                <Form.Label>Información Incorrecta</Form.Label>
                <Form.Control
                  as="select"
                  name="informacionIncorrecta"
                  value={datosActuales.informacionIncorrecta}
                  onChange={handleInputChange}
                >
                  <option value="SI">SI</option>
                  <option value="NO">NO</option>
                  <option value="NA">NA</option>
                </Form.Control>
              </Form.Group>

              <Form.Group controlId="formErrores">
                <Form.Label>Errores</Form.Label>
                <Form.Control
                  as="select"
                  name="errores"
                  value={datosActuales.errores}
                  onChange={handleInputChange}
                >
                  <option value="SI">SI</option>
                  <option value="NO">NO</option>
                  <option value="NA">NA</option>
                </Form.Control>
              </Form.Group>

              <Form.Group controlId="formPlazos">
                <Form.Label>Plazos</Form.Label>
                <Form.Control
                  as="select"
                  name="plazos"
                  value={datosActuales.plazos}
                  onChange={handleInputChange}
                >
                  <option value="SI">SI</option>
                  <option value="NO">NO</option>
                  <option value="NA">NA</option>
                </Form.Control>
              </Form.Group>

              <Form.Group controlId="formFacturacion">
                <Form.Label>Facturación</Form.Label>
                <Form.Control
                  as="select"
                  name="facturacion"
                  value={datosActuales.facturacion}
                  onChange={handleInputChange}
                >
                  <option value="SI">SI</option>
                  <option value="NO">NO</option>
                  <option value="NA">NA</option>
                </Form.Control>
              </Form.Group>
              <Form.Group controlId="formObservaciones">
                <Form.Label>Observaciones</Form.Label>
                <Form.Control
                  type="text"
                  name="observaciones"
                  value={datosActuales.observaciones}
                  onChange={handleInputChange}
                />
              </Form.Group>

              {/* Agregar más campos según sea necesario */}
            </Form>
          )}
        </Modal.Body>
        <Modal.Footer>
          <button
            className="btn"
            style={{
              borderRadius: "23px",
              width: "182px",
              height: "44px",
              background: "#ff0000",
              color: "#FFFFFF",
              marginTop: "10px",
            }}
            onClick={handleCloseModal}
          >
            Cancelar
          </button>
          <button
            className="btn"
            style={{
              borderRadius: "23px",
              width: "182px",
              height: "44px",
              background: "#B4C400",
              color: "#FFFFFF",
              marginTop: "10px",
            }}
            onClick={handleEnviar}
          >
            Enviar
          </button>
        </Modal.Footer>
      </Modal>
    </section>
  );
};

export default TablaAuditoria;
