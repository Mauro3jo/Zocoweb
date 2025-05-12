import React, { useContext, useEffect, useState } from "react";
import "./ContenidoReclutamientoContratados.css";
import { Button } from "react-bootstrap";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faPlusCircle } from "@fortawesome/free-solid-svg-icons";
import { DarkModeContext } from "../../context/DarkModeContext";
import ModalCargarContratados from "./ModalCargarContratados";
import TablaReclutamientoContratados from "./TablaReclutamientoContratados";

// import librerias
import Swal from "sweetalert2";

// assets logo de carpeta img
import logo from "../../assets/img/logo.png";

const ContenidoReclutamientoContratados = () => {
  // darkMode context funcionalidad para el modo claro/oscuro
  const { darkMode } = useContext(DarkModeContext);

  // estado para guardar el filtro
  const [filtro, setFiltro] = useState("");

  // estado para controlar la apertura y cierre del modal
  const [modalShowCompleta, setModalShowCompleta] = React.useState(false);

  // estado para guardar la lista de la carga de busqueda
  const [listaContratados, setListaContratados] = useState([]);

  // Método para obtener la lista actualizada de búsquedas
  const actualizarListaContratados = async () => {
    try {
      const response = await fetch("/api/contratado/Listar");
      const data = await response.json();
      setListaContratados(data);
    } catch (error) {
      console.error("Error al cargar la lista de búsquedas:", error);
    }
  };

  useEffect(() => {
    actualizarListaContratados();
  }, []); 

  // lista de contratados luego de pasar por el filtrado
  const listaFiltradaContratados = listaContratados.filter((contratado) => {
    const nombre = contratado.nombre || "";
    const puesto = contratado.puesto || "";
    return (
      nombre.toLowerCase().includes(filtro.toLowerCase()) ||
      puesto.toLowerCase().includes(filtro.toLowerCase())
    );
  });

  // estado para ver la grafica condicional con el id
  const [verDetalles, setVerDetalles] = useState(false);

  const [datosDetalles, setDatosDetalles] = useState({});

  // Función para manejar el clic en el botón Ver
  const manejarVerClick = async (id) => {
    // Verificar si el ID es válido antes de hacer la solicitud
    if (id) {
      // Preparar el cuerpo de la solicitud
      const cuerpoSolicitud = JSON.stringify({
        Id: id,
      });
      try {
        // Hacer la solicitud POST a la API
        const respuesta = await fetch("/api/contratado/contratados", {
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

  const onContratadoCreadoOEditado = () => {
    Swal.fire({
      title: "Puesto editado con éxito!",
      imageUrl: logo,
      imageWidth: 100,
      imageHeight: 30,
      imageAlt: "Logo",
      confirmButtonText: "Ok",
      timer: 5000,
      allowOutsideClick: true,
      customClass: {
        container: darkMode
          ? "swal2-container--dark"
          : "swal2-container--light",
        confirmButton: "my-swal-button",
      },
    });
    setModalShowCompleta(false);
    actualizarListaContratados();
  };

  return (
    <div className="container ">
      <section
        className={
          darkMode ? "tabla-reclutamiento-dark " : "tabla-reclutamiento"
        }
      >
        <article className="d-flex justify-content-between flex-wrap container">
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
                  placeholder="Nombre o puesto"
                  value={filtro}
                  onChange={(e) => setFiltro(e.target.value)}
                />
              </div>
            </div>
          </div>
          <div className="my-2 mx-3">
            <div className="centrado my-3">
              <Button
                className={
                  darkMode
                    ? "btn-nuevo-cargar-puesto  centrado border-0"
                    : "btn-nuevo-cargar-puesto centrado  border-0"
                }
                onClick={() => setModalShowCompleta(true)}
              >
                <FontAwesomeIcon size="xl" icon={faPlusCircle} />
                <span className="ms-2 lato-bold fs-18">Nuevo</span>
              </Button>
              <ModalCargarContratados
                show={modalShowCompleta}
                onHide={() => setModalShowCompleta(false)}
                onContratadoCreadoOEditado={onContratadoCreadoOEditado} 
              />
            </div>
          </div>
        </article>
        <section className="container py-2">
          <div className="row">
            <div className="col-7">
              <TablaReclutamientoContratados
                manejarVerClick={manejarVerClick}
                listaContratados={listaFiltradaContratados}
                onContratadoCreadoOEditado={onContratadoCreadoOEditado}
              />
            </div>
            {verDetalles && (
              <div className="col-5">
                <article>
                  <div className="user-profile">
                    <div className="user-photo">
                      <img
                        className="img-fluid"
                        src={`data:image/jpeg;base64,${datosDetalles.foto}`}
                        alt={datosDetalles.nombre}
                      />
                    </div>
                    <div className="user-info">
                      <h2 className=" fs-14 lato-bold">
                        {datosDetalles.nombre}
                      </h2>
                      <h2 className=" fs-14">
                        <span className="lato-bold">Búsqueda:</span>{" "}
                        {datosDetalles.busquedaNombre}
                      </h2>
                      <h2 className=" fs-14">Edad: {datosDetalles.edad}</h2>
                      <h2 className=" fs-14">DNI: {datosDetalles.dni}</h2>
                      <h2 className=" fs-14">
                        Dirección: {datosDetalles.direccion}
                      </h2>
                      <h2 className=" fs-14">E-mail: {datosDetalles.email}</h2>
                    </div>
                  </div>
                  <section style={{ maxHeight: "550px" }}>
                    <article className="container">
                      <div className="py-2">
                        <h2 className=" fs-14">Puesto</h2>
                        <h2 className=" fs-14">{datosDetalles.puesto}</h2>
                      </div>
                    </article>
                    <article className="container">
                      <div className="py-2">
                        <h2 className=" fs-14">Fecha de entrevista</h2>
                        <h2 className=" fs-14">
                          {datosDetalles.fechaEntrevista}
                        </h2>
                      </div>
                    </article>
                    <article className="container">
                      <div className="py-2">
                        <h2 className=" fs-14">Fecha de contratación</h2>
                        <h2 className=" fs-14">
                          {datosDetalles.fechaDeContratacion}{" "}
                        </h2>
                      </div>
                    </article>
                    <article className="container">
                      <div className="py-2">
                        <h2 className=" fs-14">Tipo de contratación</h2>
                        <h2 className=" fs-14">
                          {datosDetalles.tipoDeContratacion}
                        </h2>
                      </div>
                    </article>
                    <article className="container">
                      <div className="py-2">
                        <h2 className=" fs-14">Observaciones</h2>
                        <h2 className=" fs-14">{datosDetalles.observacion} </h2>
                      </div>
                    </article>
                    <article className="container pb-5">
                      <a
                        className="text-decoration-none"
                        href={datosDetalles.cv}
                        target="_blank"
                      >
                        <Button
                          className={
                            darkMode
                              ? "btn-nuevo-cargar-puesto  centrado border-0"
                              : "btn-nuevo-cargar-puesto centrado  border-0"
                          }
                        >
                          {" "}
                          Descargar Cv{" "}
                        </Button>
                      </a>
                    </article>
                  </section>
                </article>
              </div>
            )}
          </div>
        </section>
      </section>
    </div>
  );
};

export default ContenidoReclutamientoContratados;
