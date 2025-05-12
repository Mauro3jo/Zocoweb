import "./TablaUsuariosLiquidaciones.css";
import React, { useContext, useEffect, useRef, useState } from "react";
import { DarkModeContext } from "../context/DarkModeContext";
import Swal from "sweetalert2";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faCirclePlus, faXmark } from "@fortawesome/free-solid-svg-icons";
import { Button, Modal } from "react-bootstrap";

// Modal para cargar las órdenes de pago
function ModalCargarOrdenes(props) {
  const { darkMode } = useContext(DarkModeContext);
  const [loading, setLoading] = useState(false);
  const fileInputRef = useRef(null);

  const onSubmit = async (event) => {
    event.preventDefault();

    if (!fileInputRef.current.files.length) {
      Swal.fire("Por favor, selecciona al menos un archivo para subir.");
      return;
    }

    setLoading(true);

    const filesBase64 = await Promise.all(
      Array.from(fileInputRef.current.files).map(
        (file) =>
          new Promise((resolve, reject) => {
            const reader = new FileReader();
            reader.onload = () => {
              const fileNameWithoutExtension = file.name
                .split(".")
                .slice(0, -1)
                .join(".");
              resolve({
                Name: fileNameWithoutExtension,
                Content: reader.result.split(",")[1],
              });
            };
            reader.onerror = (error) => reject(error);
            reader.readAsDataURL(file);
          })
      )
    );

    try {
      const dataToSend = { Files: filesBase64 };
      const response = await fetch("/api/IIBB/pdfiibb", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(dataToSend),
      });

      if (!response.ok) {
        throw new Error("No se pudo conectar al servidor de la red");
      }
      Swal.fire({
        title: "¡Enviado!",
        text: "Archivos cargados con éxito.",
        icon: "success",
        confirmButtonText: "Ok",
      });
    } catch (error) {
      Swal.fire({
        title: "Error",
        text: "Hubo un problema al cargar los archivos.",
        icon: "error",
        confirmButtonText: "Ok",
      });
    } finally {
      setLoading(false);
      props.onHide();
    }
  };

  return (
    <Modal
      {...props}
      size="lg"
      aria-labelledby="contained-modal-title-vcenter"
      centered
    >
      <Modal.Body>
        <section className="d-flex justify-content-between my-4">
          <div className="ocultar-div"></div>
          <div className="d-flex justify-content-center">
            <h6 className="fs-18 lato-bold">Cargar Archivos</h6>
          </div>
          <div>
            <button className="border-0 btn-filtro-cruz" onClick={props.onHide}>
              <FontAwesomeIcon className="fs-18 mb-3" icon={faXmark} />
            </button>
          </div>
        </section>
        <section className="d-flex justify-content-center">
          <form onSubmit={onSubmit}>
            <div className="mb-3">
              <label htmlFor="fileUpload" className="form-label">
                Selecciona los archivos para cargar
              </label>
              <input
                ref={fileInputRef}
                className="form-control input-cargar-nueva-busqueda"
                type="file"
                id="fileUpload"
                multiple
                accept="application/pdf"
              />
            </div>
            <div className="d-flex justify-content-between my-5">
              <button
                className="btn-cancelar-usuario-editar lato-bold text-dark mx-4"
                onClick={props.onHide}
                type="button"
              >
                Cancelar
              </button>
              <button
                className={`btn-guardar-usuario-editar border-0 lato-bold ${
                  darkMode ? "text-dark" : "text-white"
                } mx-4`}
                type="submit"
                disabled={loading}
              >
                {loading ? (
                  <>
                    <span
                      className="spinner-border spinner-border-sm"
                      role="status"
                      aria-hidden="true"
                    ></span>{" "}
                    Cargando...
                  </>
                ) : (
                  "Guardar"
                )}
              </button>
            </div>
          </form>
        </section>
      </Modal.Body>
    </Modal>
  );
}

const ContenidoLiquidacionesIIBB = () => {
  const { darkMode } = useContext(DarkModeContext);
  const [datos, setDatos] = useState([]);
  const [loading, setLoading] = useState(false);
  const [modalShow, setModalShow] = useState(false);

  const [resumen, setResumen] = useState([]);
  console.log("🚀 ~ ContenidoOrdenesPago ~ resumen:", resumen);

  const urlResumen = "/api/IIBB/resumenUltimosCincoDias";
  useEffect(() => {
    const fetchResumen = async () => {
      try {
        const response = await fetch(urlResumen);
        const data = await response.json();
        setResumen(data);
      } catch (error) {
        console.error("Error al cargar noticias:", error);
      }
    };

    fetchResumen();
  }, [urlResumen]);

  return (
    <div className="container">
      <div
        className={
          darkMode
            ? "container bg-tabla-usuarios-liquidaciones-dark"
            : "container bg-tabla-usuarios-liquidaciones"
        }
      >
        <section className="container mt-3 mb-3">
          <div className="d-flex flex-wrap justify-content-end pt-4">
            <div className="d-flex centrado-responsive">
              <div className="pt-3">
                <Button
                  className="btn-modal-nuevo-usuario-editar centrado border-0 mx-2"
                  onClick={() => setModalShow(true)}
                >
                  <FontAwesomeIcon icon={faCirclePlus} />
                  <span className="lato-bold fs-18 ms-2"> Nueva</span>
                </Button>
              </div>
              <ModalCargarOrdenes
                show={modalShow}
                onHide={() => setModalShow(false)}
              />
            </div>
          </div>
        </section>
        <article>
          <div
            className={
              darkMode
                ? "container table-responsive py-3 px-5"
                : "container table-responsive py-3 px-5"
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
                    scope="col"
                  >
                    #
                  </th>
                  <th
                    className={
                      darkMode
                        ? "bg-white text-dark border-0 lato-regular fs-12 py-3"
                        : "bg-dark text-white border-0 lato-regular fs-12 py-3"
                    }
                    scope="col"
                  >
                    Fecha
                  </th>
                  <th
                    className={
                      darkMode
                        ? "bg-white text-dark border-0 lato-regular fs-12 py-3 border-tabla-derecha"
                        : "bg-dark text-white fs-12 lato-regular py-3 border-tabla-derecha"
                    }
                    scope="col"
                  >
                    Cantidad
                  </th>
                </tr>
              </thead>
              <tbody className="text-center">
                {loading ? (
                  <tr>
                    <td colSpan="3" className="fs-12-a-10 lato-regular pt-4">
                      Esperando datos...
                    </td>
                  </tr>
                ) : resumen.length > 0 ? (
                  resumen.slice(0, 8).map((dato, i) => (
                    <tr
                      className={
                        darkMode
                          ? "tabla-borde-bottom text-white"
                          : "tabla-borde-bottom text-dark"
                      }
                      key={i}
                    >
                      <td className="fs-12-a-10 lato-regular pt-4">{i + 1}</td>
                      <td className="fs-12-a-10 lato-regular pt-4">
                        {dato.fecha}
                      </td>
                      <td className="fs-12-a-10 lato-regular pt-4">
                        {dato.cantidad}
                      </td>
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td colSpan="3" className="fs-12-a-10 lato-regular pt-4">
                      No se encontraron datos.
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </article>
      </div>
    </div>
  );
};

export default ContenidoLiquidacionesIIBB;
