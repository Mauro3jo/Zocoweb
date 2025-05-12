import { Button } from "react-bootstrap";

import "./ContenidoReclutamientoBusqueda.css";
import React, { useContext, useEffect, useState } from "react";
import { faPlusCircle } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";

import ModalReclutamientoNuevo from "./ModalReclutamientoNuevo";
import { DarkModeContext } from "../../context/DarkModeContext";
import TablaReclutamientoBuscador from "./TablaReclutamientoBuscador";
import GraficaPie from "./GraficaPie";

const ContenidoReclutamientoBusqueda = () => {
  // darkMode context funcionalidad para el modo claro/oscuro
  const { darkMode } = useContext(DarkModeContext);

  // estado para controlar la apertura y cierre del modal
  const [modalShowCompleta, setModalShowCompleta] = React.useState(false);

  // estado para guardar la lista de la carga de busqueda
  const [listaBusqueda, setListaBusqueda] = useState([]);

  // consulta para listar
  const busquedaListar = "/api/busqueda/Listar";

  // Método para obtener la lista actualizada de búsquedas
  const actualizarListaBusquedas = async () => {
    try {
      const response = await fetch(busquedaListar);
      const data = await response.json();
      setListaBusqueda(data);
    } catch (error) {
      console.error("Error al cargar la lista de búsquedas:", error);
    }
  };

  useEffect(() => {
    actualizarListaBusquedas();
  }, []); // Dependencias vacías para ejecutar solo al montar el componente

  // estado para ver la grafica condicional con el id
  const [verGrafica, setVerGrafica] = useState(false);

  // estado con los datos para enviar a la grafica
  const [datosGrafica, setDatosGrafica] = useState([]);

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
        const respuesta = await fetch("/api/busqueda/grafica", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: cuerpoSolicitud,
        });
        // Obtener y procesar la respuesta del servidor
        const resultado = await respuesta.json();
        // cargar los datos de la respuesta
        setDatosGrafica(resultado);
        // Actualizar el estado para mostrar la gráfica
        setVerGrafica(true);
        actualizarListaBusquedas(); 
      } catch (error) {
        console.error("Error al hacer la solicitud:", error);
        setVerGrafica(false);
      }
    } else {
      setVerGrafica(false);
    }
  };

  const [filtro, setFiltro] = useState("");

  // Función para actualizar lista de búsquedas y demás funciones igual que antes...

  // Aquí implementas la lógica de filtrado
  const listaFiltrada = listaBusqueda.filter((item) => {
    const busqueda = filtro.toLowerCase();
    const nombre = item.nombre || "";
    const puesto = item.puesto || ""; 
    const estado = item.nombre || ""; 
    const provincia = item.provincia || "";

    return (
      nombre.toLowerCase().includes(busqueda) ||
      provincia.toLowerCase().includes(busqueda) ||
      (puesto && puesto.toLowerCase().includes(busqueda)) ||
      estado.toLowerCase().includes(busqueda) 
    );
  });

  return (
    <div className="container">
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
                      ? " form-control text-white label-buscador-reclutamiento-busqueda-dark lato-regular fs-18 border-0"
                      : "form-control label-buscador-reclutamiento-busqueda lato-regular fs-18 border-0"
                  }
                  placeholder="Puesto, nombre, provincia o estado"
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
              <ModalReclutamientoNuevo
                show={modalShowCompleta}
                onHide={() => setModalShowCompleta(false)}
                onNuevaBusquedaAñadida={actualizarListaBusquedas} // Propagando el callback
              />
            </div>
          </div>
        </article>
        <article className="container">
          <TablaReclutamientoBuscador
            actualizarListaBusquedas={actualizarListaBusquedas}
            manejarVerClick={manejarVerClick}
            listaBusqueda={listaFiltrada}
          />
        </article>

        {verGrafica && (
          <article className="text-center pt-5">
            <h6> {datosGrafica.nombre}</h6>
            <h6>
              Cantidad de postulados:{datosGrafica.cantidadDeSolicitantes}
            </h6>
          </article>
        )}

        <article className="d-flex justify-content-center">
          {verGrafica ? (
            <div className="">
              <GraficaPie datosGrafica={datosGrafica} />
            </div>
          ) : (
            <div className="py-5">
              <h6 className="lato-bold fs-16">
                Por favor toca en ver para inicializar la grafica{" "}
              </h6>
            </div>
          )}
        </article>
        {verGrafica && (
          <div className="d-flex justify-content-center pb-5">
            <h6 className="text-center pt-4">
              Observaciones <br />{" "}
              {datosGrafica.observaciones === null
                ? "No se efectuaron observaciones"
                : datosGrafica.observaciones}{" "}
            </h6>
          </div>
        )}
      </section>
    </div>
  );
};

export default ContenidoReclutamientoBusqueda;
