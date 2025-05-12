import { faEye, faPen } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import React, { useContext, useState, useMemo } from "react";
import { DarkModeContext } from "../../context/DarkModeContext";
import ModalEditarTablaAlta from "../administracion/ModalEditarTablaAlta";
import ModalDetalleTablaAlta from "../administracion/ModalDetalleTablaAlta";

const TodasAltaTablaGestor = ({ formulariosAlta }) => {
  const { darkMode } = useContext(DarkModeContext);
  const [datosBuscador, setDatosBuscador] = useState("");
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

  const scrollableTableStyle = {
    display: "block",
    maxHeight: "400px",
    overflowY: "scroll",
    overflowX: "hidden",
  };

  const filteredData = useMemo(() => {
    if (!datosBuscador) return formulariosAlta;
    return formulariosAlta.filter((item) =>
      Object.values(item).some((value) =>
        value?.toString().toLowerCase().includes(datosBuscador.toLowerCase())
      )
    );
  }, [datosBuscador, formulariosAlta]);

  const handleSearchChange = (event) => {
    setDatosBuscador(event.target.value);
  };

  return (
    <>
      <div
        className={
          darkMode ? "bg-tabla-calculadora-dark" : "bg-tabla-calculadora"
        }
      >
        {/* Formulario escritorio */}
        <article className="d-lg-block d-none pt-2">
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
                  type="search"
                  placeholder="Cuit/tipo/terminal/nombre fantasia"
                  aria-label="Search"
                  value={datosBuscador}
                  onChange={handleSearchChange}
                />
              </div>
            </article>
          </section>
        </article>
        {/* Formulario celular */}
        <article className="d-block d-lg-none">
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
                    type="search"
                    placeholder="Cuit/tipo/terminal/nombre fantasia"
                    aria-label="Search"
                    value={datosBuscador}
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
                  CUIT
                </th>
                <th
                  className={
                    darkMode
                      ? " bg-white text-dark border-0 lato-regular fs-12 py-3  priority-1"
                      : "bg-dark text-white fs-12 lato-regular py-3   priority-1"
                  }
                  scope="col"
                >
                  Tipo
                </th>
                <th
                  className={
                    darkMode
                      ? " bg-white text-dark border-0 lato-regular fs-12 py-3  priority-3"
                      : "bg-dark text-white fs-12 lato-regular py-3   priority-3"
                  }
                  scope="col"
                >
                  N° Terminal
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

            <tbody className="text-center">
              {filteredData.map((item, id) => (
                <tr
                  className={
                    darkMode
                      ? " tabla-borde-bottom  text-white"
                      : "tabla-borde-bottom  text-dark"
                  }
                  key={id}
                >
                  <td className="fs-12-a-10 lato-regular py-3 priority-1">
                    {item.cuittitular ? item.cuittitular : "--------------"}{" "}
                  </td>
                  <td className="fs-12-a-10 lato-regular py-3 priority-1">
                    {item.tipoPersona}
                  </td>
                  <td className="fs-12-a-10 lato-regular py-3 priority-3">
                    {item.numeroTerminal}
                  </td>
                  <td className="fs-12-a-10 lato-regular py-3 priority-3">
                    {item.nombreFantasia}
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

            {/* Modal para Editar */}
            <ModalEditarTablaAlta
              show={showEditarModal}
              onHide={handleCloseEditarModal}
              item={selectedItem ? selectedItem : {}}
            />

            {/* Modal para Detalle */}
            <ModalDetalleTablaAlta
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

export default TodasAltaTablaGestor;
