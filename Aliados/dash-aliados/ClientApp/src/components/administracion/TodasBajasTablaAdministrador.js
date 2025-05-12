import { faCheck, faEye, faPen } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import React, { useContext, useState, useMemo } from "react";
import { DarkModeContext } from "../../context/DarkModeContext";
import { useForm } from "react-hook-form";
import ModalDetalleTablaBaja from "./ModalDetalleTablaBaja";
import ModalEditarTablaBaja from "./ModalEditarTablaBaja";

const TodasBajaTablaAdministrador = ({ formulariosBaja }) => {
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

  const { register } = useForm();

  const handleSearchChange = (event) => {
    setDatosBuscador(event.target.value);
  };

  const filteredData = useMemo(() => {
    if (!datosBuscador) return formulariosBaja;
    return formulariosBaja.filter((item) =>
      item.numeroTerminal
        ?.toString()
        .toLowerCase()
        .includes(datosBuscador.toLowerCase())
    );
  }, [datosBuscador, formulariosBaja]);

  const scrollableTableStyle = {
    display: "block",
    maxHeight: "400px",
    overflowY: "scroll",
    overflowX: "hidden",
  };

    const handleCheckClick = async (itemId) => {
        //console.log("Item ID:", itemId);

        const token = sessionStorage.getItem('token');

        const requestOptions = {
            method: 'POST',
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify({ id: itemId, token: token })
        };

        try {
            const response = await fetch("/api/bajas/agregabaja", requestOptions);

            if (response.ok) {
               // const data = await response.json();
               // console.log("Response Data:", data);
            } else {
                console.error("Error en la solicitud:", response.status, response.statusText);
            }
        } catch (error) {
            console.error("Error en la solicitud:", error);
        }
    };


  return (
    <>
      <div
        className={
          darkMode ? "bg-tabla-calculadora-dark" : "bg-tabla-calculadora"
        }
      >
        {/* Formulario escritorio */}
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
                  type="search"
                  aria-label="Search"
                  placeholder="N° terminal"
                  value={datosBuscador}
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
                    type="search"
                    aria-label="Search"
                    placeholder="N° terminal"
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
            <thead className="border-0">
              <tr className="text-center tabla-thead">
                <th
                  className={
                    darkMode
                      ? "bg-white text-dark border-tabla-izquierda border-0 lato-regular fs-12 py-3 priority-1"
                      : "bg-dark text-white border-tabla-izquierda border-0 lato-regular fs-12 py-3 priority-1"
                  }
                  scope="col"
                >
                  N° Terminal
                </th>
                <th
                  className={
                    darkMode
                      ? "bg-white text-dark border-0 lato-regular fs-12 py-3 priority-1 border-tabla-derecha"
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
                    <td colSpan={2} className="lato-bold fs-12-a-10">
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
                        {item.numeroTerminal}
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
                      <div className="mx-1 mb-1">
                        <button className="btn-publicar border-0" onClick={() => handleCheckClick(item.id)}>
                          <span className="lato-bold fs-18">
                            <FontAwesomeIcon className="text-dark fs-12" icon={faCheck} />
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
            <ModalEditarTablaBaja
              show={showEditarModal}
              onHide={handleCloseEditarModal}
              item={selectedItem ? selectedItem : {}}
            />

            {/* Modal para Detalle */}
            <ModalDetalleTablaBaja
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

export default TodasBajaTablaAdministrador;
