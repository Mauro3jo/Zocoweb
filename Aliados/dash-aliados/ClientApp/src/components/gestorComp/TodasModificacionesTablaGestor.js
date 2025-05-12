import {
  faEye,
  faPen,
} from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import React, { useContext, useMemo, useState } from "react";
import { DarkModeContext } from "../../context/DarkModeContext";
import { useForm } from "react-hook-form";
import ModalEditarTablaModificacion from "../administracion/ModalEditarTablaModificacion";
import ModalDetalleTablaModificacion from "../administracion/ModalDetalleTablaModificacion";

const TodasModificacionesTablaGestor = ({ formulariosModificaciones }) => {
  const { darkMode } = useContext(DarkModeContext);
  const [datosBuscador, setDatosBuscador] = useState("");
  const { register, handleSubmit, reset } = useForm();
  const [showEditarModal, setShowEditarModal] = useState(false);
  const [showDetalleModal, setShowDetalleModal] = useState(false);
  const [selectedItem, setSelectedItem] = useState(null);

  const handleCloseEditarModal = () => setShowEditarModal(false);
  const handleShowEditarModal = (item) => {
    setSelectedItem(item);
    setShowEditarModal(true);
  };

  const handleCloseDetalleModal = () => setShowDetalleModal(false);
  const handleShowDetalleModal = (item) => {
    setSelectedItem(item);
    setShowDetalleModal(true);
  };

  const handleSearchChange = (event) => {
    setDatosBuscador(event.target.value);
  };

  const onSubmit = (datos) => {
    setDatosBuscador(datos);
    reset();
  };

  const filteredData = useMemo(() => {
    if (!datosBuscador) return formulariosModificaciones;
    return formulariosModificaciones.filter((item) =>
      Object.values(item).some((value) =>
        value?.toString().toLowerCase().includes(datosBuscador.toLowerCase())
      )
    );
  }, [datosBuscador, formulariosModificaciones]);

  const scrollableTableStyle = {
    display: "block",
    maxHeight: "400px",
    overflowY: "scroll",
    overflowX: "hidden",
  };

  return (
    <>
      <div
        className={
          darkMode ? "bg-tabla-calculadora-dark" : "bg-tabla-calculadora"
        }
      >
        <article className="d-lg-block d-none pt-4">
          <section className=" d-flex justify-content-between mx-5">
            <article className="">
              <div className="d-flex">
                <h6 className="my-2 me-2 lato-regular fs-18">Buscar:</h6>
                <input
                  className={
                    darkMode
                      ? " form-control text-white label-buscador-dark lato-regular fs-18 border-0"
                      : "form-control label-buscador lato-regular fs-18 border-0"
                  }
                  placeholder="Comercio/gestor/nombre fantasia"
                  type="search"
                  aria-label="Search"
                  onChange={handleSearchChange}
                />
              </div>
            </article>
          </section>
        </article>
        {/* Formulario celular */}
        <article className="d-block d-lg-none pt-4">
          <div>
            <section className="d-flex justify-content-center">
              <article>
                <h6 className="my-4 me-2 lato-regular fs-18 text-center">
                  Buscar:
                </h6>
                <div className="d-flex">
                  <input
                    className={
                      darkMode
                        ? " form-control text-white label-buscador-dark lato-regular fs-18 border-0"
                        : "form-control label-buscador lato-regular fs-18 border-0"
                    }
                    placeholder="Comercio/gestor/nombre fantasia"
                    type="search"
                    aria-label="Search"
                    onChange={handleSearchChange}
                  />
                </div>
              </article>
            </section>
          </div>
        </article>
        <div
          style={scrollableTableStyle}
          className={darkMode ? "  py-5 px-5 mt-4" : "py-2 px-5 mt-4"}
        >
          <table className="table table-borderless responsive striped hover">
            <thead className="border-0 ">
              <tr className="text-center tabla-thead">
                <th
                  className={
                    darkMode
                      ? " bg-white text-dark border-tabla-izquierda border-0 lato-regular fs-12 py-3 priority-1 "
                      : "bg-dark text-white border-tabla-izquierda border-0 lato-regular fs-12 py-3  priority-1"
                  }
                  scope="col "
                >
                  Nombre comercio
                </th>
                <th
                  className={
                    darkMode
                      ? " bg-white text-dark border-0 lato-regular fs-12 py-3  priority-2"
                      : "bg-dark text-white fs-12 lato-regular py-3   priority-2"
                  }
                  scope="col"
                >
                  Nombre gestor
                </th>
                <th
                  className={
                    darkMode
                      ? " bg-white text-dark border-0 lato-regular fs-12 py-3 priority-3"
                      : "bg-dark text-white fs-12 lato-regular py-3  priority-3"
                  }
                  scope="col"
                >
                  Nombre de fantasia
                </th>
                <th
                  className={
                    darkMode
                      ? " bg-white text-dark border-0 lato-regular fs-12 py-3 priority-1 border-tabla-derecha"
                      : "bg-dark text-white fs-12 lato-regular py-3 priority-1 border-tabla-derecha"
                  }
                  scope="col"
                >
                  Acciones
                </th>
              </tr>
            </thead>
            {filteredData.length === 0 ? (
              <>
                <tbody className="text-center">
                  <tr>
                    <td colSpan={4} className="lato-bold fs-12-a-10">
                      No se encontraron resultados para esta busqueda.
                    </td>
                  </tr>
                </tbody>
              </>
            ) : (
              <>
                <tbody className="text-center">
                  {filteredData.map((item, id) => (
                    <tr
                      className={
                        darkMode
                          ? "tabla-borde-bottom text-white"
                          : "tabla-borde-bottom text-dark"
                      }
                      key={id}
                    >
                      <td className="fs-12-a-10 lato-regular py-3 priority-1">
                        {item.nombreComercio
                          ? item.nombreComercio
                          : "No hay datos disponible."}
                      </td>
                      <td className="fs-12-a-10 lato-regular py-3 priority-1">
                        {item.nombreGestor
                          ? item.nombreGestor
                          : "No hay datos disponible."}
                      </td>
                      <td className="fs-12-a-10 lato-regular py-3 priority-3">
                        {item.nombreFantasia
                          ? item.nombreFantasia
                          : "No hay datos disponible."}
                      </td>
                      <td className="lato-regular py-3 priority-1 text-center">
                        <section className="d-flex justify-content-center flex-wrap">
                          <div className="mx-1 mb-1">
                            <button
                              className="btn-publicar border-0"
                              onClick={() => handleShowEditarModal(item)}
                            >
                              <span className="lato-bold fs-18">
                                <FontAwesomeIcon
                                  className="text-dark fs-12"
                                  icon={faPen}
                                />
                              </span>
                            </button>
                          </div>
                          <div className="mx-1 mb-1">
                            <button
                              className="btn-publicar border-0"
                              onClick={() => handleShowDetalleModal(item)}
                            >
                              <span className="lato-bold fs-18">
                                <FontAwesomeIcon
                                  className="text-dark fs-12"
                                  icon={faEye}
                                />
                              </span>
                            </button>
                          </div>
                        </section>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </>
            )}
            {/* Modal para Editar */}
            <ModalEditarTablaModificacion
              show={showEditarModal}
              onHide={handleCloseEditarModal}
              item={selectedItem ? selectedItem : {}}
            />

            {/* Modal para Detalle */}
            <ModalDetalleTablaModificacion
              show={showDetalleModal}
              onHide={handleCloseDetalleModal}
              item={selectedItem ? selectedItem : {}}
            />
          </table>
        </div>
      </div>
    </>
  );
};

export default TodasModificacionesTablaGestor;
