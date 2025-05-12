import React,  { useContext, useEffect, useState } from "react";
import { DarkModeContext } from "../../context/DarkModeContext";
import { useNavigate } from "react-router-dom";
import Swal from "sweetalert2";
import logo from "../../assets/img/logo.png";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { Button, Row,Col, Badge, FormControl,Spinner  } from "react-bootstrap";
import {
    faFileArrowDown,faCalendarDays,
    faSearch,
    faTimes,
    faArrowRight,
    faArrowLeft
  } from "@fortawesome/free-solid-svg-icons";

import { AdminContext } from "../../context/AdminContext";


const ListaOrdenDePago = () => {
    const [fechaSeleccionada, setFechaSeleccionada] = useState("");
    const apiUrlListaOrdenesPago = "/api/pdf/listaordenespago";
    const apiUrlDescargarOrdenPago = "/api/pdf/descargarordenpago";
    const [cuitSeleccionado, setCuitSeleccionado] = useState("");
    const [ordenesFiltradas,setOrdenesFiltradas]=useState([])
    const { ordenesPago, fetchOrdenesPago } = useContext(AdminContext);

    const { darkMode } = useContext(DarkModeContext);
    const navegacion = useNavigate();

    const [isLoading, setIsLoading] = useState(false);
    const [currentPage, setCurrentPage] = useState(1);
    const itemsPerPage = 20;
  
    // useEffect(() => {
    //   if (fechaSeleccionada) {
    //     setIsLoading(true); // Activa el spinner
    //     fetchOrdenesPago(fechaSeleccionada).finally(() => setIsLoading(false)); // Desactiva el spinner cuando termina
    //   }
    // }, [fechaSeleccionada]);

   /* const [ordenesPago, setOrdenesPago] = useState([]);*/

    //useEffect(() => {
    //    const token = sessionStorage.getItem("token");
    //    obtenerListaOrdenesPago(token, fechaSeleccionada); // Cargar lista inicial, puede estar vacía o con alguna fecha predeterminada
    //}, [fechaSeleccionada]);

    useEffect(() => {
        if (fechaSeleccionada) {
            fetchOrdenesPago(fechaSeleccionada); // Llamar a la función del contexto para obtener datos
        }
    }, [fechaSeleccionada]); // Ejecutar cada vez que la fecha cambie

    //useEffect(() => {
    //    // Filtrar órdenes por coincidencia de CUIT
    //    if (cuitSeleccionado) {
    //        const filtradas = ordenesPago.filter(
    //            (orden) =>
    //              orden.cuit.includes(cuitSeleccionado) ||
    //              (orden.nombreDocumento &&
    //                orden.nombreDocumento.toLowerCase().includes(cuitSeleccionado.toLowerCase()))
    //          );
    //      setOrdenesFiltradas(filtradas);
    //    } else {
    //      setOrdenesFiltradas(ordenesPago); // Si no hay CUIT ingresado, mostrar todas
    //    }
    //  }, [cuitSeleccionado, ordenesPago]);

    useEffect(() => {
        if (cuitSeleccionado) {
            const filtradas = ordenesPago.filter(
              (orden) =>
                orden.cuit.includes(cuitSeleccionado) ||
                (orden.nombreDocumento &&
                  orden.nombreDocumento.toLowerCase().includes(cuitSeleccionado.toLowerCase()))
            );
            setOrdenesFiltradas(filtradas);
          } else {
            setOrdenesFiltradas(ordenesPago); // Si no hay CUIT ingresado, mostrar todas
          }
        }, [cuitSeleccionado, ordenesPago]);

    //const obtenerListaOrdenesPago = async (token, fecha) => {
    //    try {
    //        const response = await fetch(apiUrlListaOrdenesPago, {
    //            method: "POST",
    //            headers: {
    //                "Content-Type": "application/json",
    //            },
    //            body: JSON.stringify({ Token: token, Fecha: fecha }), // Pasar la fecha seleccionada
    //        });

    //        if (response.ok) {
    //            const data = await response.json();
    //            setOrdenesPago(data); // Guardar los datos en el estado
    //            setOrdenesFiltradas(data)
    //        } else {
    //            console.error("Error al obtener las órdenes de pago", response.status);
    //        }
    //    } catch (error) {
    //        console.error("Error al realizar la consulta", error);
    //    }
    //};



    //const buscarPorFecha = () => {
    //    const token = sessionStorage.getItem("token");
    //    if (!token) {
    //        manejarRespuestaNoAutorizada();
    //        return;
    //    }
    //    obtenerListaOrdenesPago(token, fechaSeleccionada); // Llamar a la función con la nueva fecha
    //};
    const buscarPorFecha = async () => {
        setIsLoading(true); // Activa el spinner al presionar el botón
        await fetchOrdenesPago(fechaSeleccionada);
        setIsLoading(false); // Desactiva el spinner después de completar la búsqueda
        setCurrentPage(1); // Reinicia la paginación
      };

    //const manejarRespuestaNoAutorizada = () => {
    //    sessionStorage.removeItem("token");

    //    Swal.fire({
    //        title: "Sesión expirada o token inválido.",
    //        text: "Inicie sesión nuevamente.",
    //        imageUrl: logo,
    //        imageWidth: 100,
    //        imageHeight: 30,
    //        imageAlt: "Logo",
    //        confirmButtonText: "Ok",
    //        timer: 5000,
    //        allowOutsideClick: true,
    //        customClass: {
    //            container: darkMode
    //                ? "swal2-container--dark"
    //                : "swal2-container--light",
    //            confirmButton: "my-swal-button",
    //        },
    //    }).then(() => navegacion("/"));
    //};

    const descargarOrdenPago = async (documentoId, fecha, cuit) => {
        const token = sessionStorage.getItem("token");
    
        // Muestra el SweetAlert con las opciones
        const result = await Swal.fire({
            title: '¿Qué deseas hacer?',
            text: 'Selecciona una opción para la descarga del documento.',
            icon: 'question',
            showCancelButton: true,
            confirmButtonText: 'Descargar uno',
            cancelButtonText: 'Descargar todos',
        });
    
        const cuitParaDescargar = result.isConfirmed ? null : cuit;  // Si se confirma, usa el CUIT, si no, usa null
    
        try {
            const response = await fetch(apiUrlDescargarOrdenPago, {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify({
                    Token: token,
                    Id: documentoId.toString(), // Convertir el ID a string
                    Fecha: fecha ? fecha.toString() : "", // Convertir la fecha a string o enviar vacío
                    Cuit: cuitParaDescargar, // Pasar el cuit si es necesario o null
                }),
            });
    
            if (response.ok) {
                const data = await response.json(); // Recibir el array de documentos
    
                if (Array.isArray(data) && data.length > 0) {
                    // Iterar sobre los documentos
                    data.forEach(doc => {
                        if (doc.documentoPdf) {
                            // Convertir Base64 a Blob para generar el PDF
                            const byteCharacters = atob(doc.documentoPdf);
                            const byteNumbers = new Array(byteCharacters.length)
                                .fill()
                                .map((_, i) => byteCharacters.charCodeAt(i));
                            const byteArray = new Uint8Array(byteNumbers);
    
                            // Crear Blob para el PDF
                            const blob = new Blob([byteArray], { type: "application/pdf" });
                            const url = window.URL.createObjectURL(blob);
                            const link = document.createElement("a");
                            link.href = url;
    
                            // Usar el nombre del documento si está disponible
                            const filename = doc.nombreDocumento
                                ? `${doc.nombreDocumento.replace(/\s+/g, "_")}.pdf`
                                : `documento_${doc.documentoId}.pdf`;
    
                            link.setAttribute("download", filename);
                            document.body.appendChild(link);
                            link.click();
                            link.parentNode.removeChild(link);
                        } else {
                            console.warn(`El documento con ID ${doc.documentoId} no contiene datos PDF.`);
                        }
                    });
                } else {
                    Swal.fire("Error", "No se encontraron documentos para descargar.", "error");
                }
            } else {
                Swal.fire("Error", "No se pudo descargar el archivo", "error");
            }
        } catch (error) {
            console.error("Error al descargar los documentos", error);
            Swal.fire("Error", "Ocurrió un problema al intentar descargar los documentos.", "error");
        }
    };
    const manejarFechaSeleccionada = (e) => {
        setFechaSeleccionada(e.target.value);
        setCuitSeleccionado(""); // Reiniciar CUIT al cambiar la fecha
        setCurrentPage(1); // Reinicia la paginación
      };
    
      const manejarCuitSeleccionado = (e) => {
        setCuitSeleccionado(e.target.value);
        setCurrentPage(1); // Reinicia la paginación
      };
    
     // Cálculo de datos paginados
  const indexOfLastItem = currentPage * itemsPerPage;
  const indexOfFirstItem = indexOfLastItem - itemsPerPage;
  const currentItems = ordenesFiltradas.slice(indexOfFirstItem, indexOfLastItem);

  const totalPages = Math.ceil(ordenesFiltradas.length / itemsPerPage);

  const handlePageChange = (page) => {
    setCurrentPage(page);
  };
    
      





  return (
    <div>

<div className="container mt-4">
                <div className="d-flex justify-content-between align-items-center mb-3">
                    <Row className="my-3 align-items-center">
                         {/* Filtro de Fecha */}
            <Col className="lg-6">

            <input
             style={{
                textAlign:"center",
                width: "200px", // Ajusta el tamaño del input a lo necesario
                height: "44px", // Ajusta la altura para que coincida con la del botón
                background: "#B4C400",
                color: "#FFFFFF",
                marginRight: "15px", //
                borderRadius:"32px"
              }}
                        type="date"
                        className="form-control"
                        value={fechaSeleccionada}
                        onChange={manejarFechaSeleccionada}
                    /> 
                    
              {/* <label
                htmlFor="dateInput"
                style={{
                  display: "inline-block",
                  width: "200px",
                  height: "44px",
                  background: "#B4C400",
                  color: "#FFFFFF",
                  borderRadius: "32px",
                  textAlign: "center",
                  lineHeight: "44px",
                  cursor: "pointer",
                }}
              >
                <FontAwesomeIcon className="me-2" icon={faCalendarDays} />
                Seleccionar Fecha <input
                id="dateInput"
                type="date"
                className="form-control"
                value={fechaSeleccionada}
                onChange={manejarFechaSeleccionada}
                style={{ display: "none" }}
              />
              </label> */}
{/* 
              <label
                  htmlFor="fecha"
                  className="lato-regular fs-16"
                  style={{
                    display: "inline-block", // Para alinear icono y texto
                    // alignItems: "center", // Centra verticalmente el texto y el icono
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
                  value={fechaSeleccionada}
                  onChange={manejarFechaSeleccionada}
                  style={{
                    width: "auto", // Ajusta el tamaño del input a lo necesario
                    height: "44px", // Ajusta la altura para que coincida con la del botón
                    background: "#B4C400",
                    color: "#FFFFFF",
                    marginRight: "15px", //
                    borderRadius:"32px"
                  }}
                              /> */}
              
            </Col>
            

            {/* Filtro de CUIT */}
            <Col className="lg-6">
              <FormControl
                type="text"
                placeholder="Buscar por CUIT o Nombre de Fantasia"
                value={cuitSeleccionado}
                onChange={manejarCuitSeleccionado}
                style={{
                  width: "200px",
                  height: "44px",
                  borderRadius: "32px",
                  paddingLeft: "16px",
                  backgroundColor: "white",
                  cursor:  "text",
                }}
              />
            </Col>
                    </Row>
                    {/* <input
                        type="date"
                        className="form-control w-50"
                        value={fechaSeleccionada}
                        onChange={manejarFechaSeleccionada}
                    />
                    <button
                        className="btn btn-primary ml-3"
                        onClick={buscarPorFecha}
                    >
                        Buscar
                    </button> */}
                </div>
                 {/* Mostrar el filtro activo y opción de eliminarlo */}
        
                {ordenesFiltradas.length > 0 ? (
                    <div className={
                        darkMode
                          ? " container table-responsive py-5 bg-tabla-calculadora-dark my-5"
                          : "container table-responsive py-5 bg-tabla-calculadora my-5"
                      }>
                        <table className="table table-borderless responsive striped hover">
                        <thead className="border-0 ">
                            <tr>
                                <th className={
                  darkMode
                    ? " bg-white text-center text-dark border-tabla-izquierda border-0 lato-regular fs-12 py-3 priority-1 "
                    : "bg-dark text-center text-white border-tabla-izquierda border-0 lato-regular fs-12 py-3  priority-1"
                }
                scope="col ">ID</th >
                                <th className={
                  darkMode
                    ? " bg-white text-center text-dark border-0 lato-regular fs-12 py-3  priority-2"
                    : "bg-dark text-center text-white fs-12 lato-regular py-3   priority-2"
                }
                scope="col">Nombre Documento</th>
                                <th className={
                  darkMode
                    ? " bg-white text-center text-dark border-0 lato-regular fs-12 py-3  priority-2"
                    : "bg-dark text-center text-white fs-12 lato-regular py-3   priority-3"
                }
                scope="col">CUIT</th>
                                <th className={
                  darkMode
                    ? " bg-white text-center text-dark border-tablaborder-0 lato-regular fs-12 py-3 priority-1 "
                    : "bg-dark text-center text-white border-tabla border-0 lato-regular fs-12 py-3  priority-4"
                }
                scope="col ">Fecha Subida</th>
                <th className={
                  darkMode
                    ? " bg-white text-center text-dark border-tabla-derecha border-0 lato-regular fs-12 py-3 priority-1 "
                    : "bg-dark text-center text-white border-tabla-derecha border-0 lato-regular fs-12 py-3  priority-1"
                }
                scope="col ">PDF</th>
                            </tr>
                        </thead>
                          <tbody className="text-center">
                              {currentItems.map((orden) => (
                                  <tr
                                      className={
                                          darkMode
                                              ? "tabla-borde-bottom text-white"
                                              : "tabla-borde-bottom text-dark"
                                      }
                                      key={orden.documentoId}
                                  >
                                      <td className="fs-12-a-10 lato-regular py-3 priority-1">
                                          {orden.documentoId}
                                      </td>
                                      <td className="fs-12-a-10 lato-regular py-3 priority-2">
                                          {orden.nombreDocumento}
                                      </td>
                                      <td className="fs-12-a-10 lato-regular py-3 priority-3">
                                          {orden.cuit}
                                      </td>
                                      <td className="fs-12-a-10 lato-regular py-3 priority-4">
                                          {new Date(orden.fechaSubida).toLocaleDateString()}
                                      </td>
                                      <td className="fs-12-a-10 lato-regular py-3 priority-1">
                                          <Button
                                              className="btn-publicar border-0 mx-1"
                                              style={{
                                                  width: "auto",
                                                  height: "auto",
                                                  background: "#B4C400",
                                                  color: "#FFFFFF",
                                                  borderRadius: "32px",
                                                  textAlign: "center",
                                              }}
                                              onClick={() => descargarOrdenPago(orden.documentoId, orden.fechaSubida, orden.cuit)} // Pasa también la fecha
                                          >
                                              <FontAwesomeIcon icon={faFileArrowDown} />
                                          </Button>
                                      </td>

                                  </tr>
                              ))}
                          </tbody>

                    </table>
                   {/* Paginación */}
                   <div className="d-flex justify-content-between">
  <Button
    className="btn-publicar border-0 mx-1"
    onClick={() => handlePageChange(currentPage - 1)}
    disabled={currentPage === 1} // Desactiva si estás en la primera página
    style={{
      width: "auto",
      height: "auto",
      background: "#B4C400",
      color: "#FFFFFF",
      borderRadius: "32px",
      textAlign: "center",
    }}
  >
    <FontAwesomeIcon style={{marginRight:"5px"}} icon={faArrowLeft} /> 
    Anterior 
  </Button>
  <span className="align-self-center">Página {currentPage} de {totalPages}</span>
  <Button
    className="btn-publicar border-0 mx-1"
    onClick={() => handlePageChange(currentPage + 1)}
    disabled={currentPage === totalPages} // Desactiva si estás en la última página
    style={{
      width: "auto",
      height: "auto",
      background: "#B4C400",
      color: "#FFFFFF",
      borderRadius: "32px",
      textAlign: "center",
    }}
  >
    Siguiente<FontAwesomeIcon style={{marginLeft:"5px"}} icon={faArrowRight} />
  </Button>
</div>
          </div>
        ) : (
          <p className="text-center">No se encontraron órdenes de pago.</p>
        )}
      </div>
            
    </div>
  )
}

export default ListaOrdenDePago