// import css
import "./TablaUsuariosLiquidaciones.css";

// import hooks, context y librerias
import React, { useContext, useEffect, useRef, useState } from "react";

// import context
import { DarkModeContext } from "../context/DarkModeContext";

// import librerias
import Swal from "sweetalert2";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faCirclePlus, faXmark } from "@fortawesome/free-solid-svg-icons";
import { Button, Modal } from "react-bootstrap";

// modal para cargar las ordenes de pago
function ModalCargarOrdenes(props) {
  // context ejecutar la modalidad claro/oscuro
  const { darkMode } = useContext(DarkModeContext);

  // estado para manejar la carga del spinner
  const [loading, setLoading] = useState(false);

  // use ref para guardar la referencia de los archivos pdf enviado
  const fileInputRef = useRef(null);
 
  const onSubmit = async (event) => {
    event.preventDefault();

    if (!fileInputRef.current.files.length) {
      Swal.fire("Por favor, selecciona al menos un archivo para subir.");
      return;
    }

    setLoading(true);

    // Convertir los archivos a base64 y ajustar a la estructura esperada por VMPDFAliado
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
      // Datos a enviar, ajustados a la estructura de VMPDFAliado
      const dataToSend = {
        Files: filesBase64,
      };

      // Reemplaza 'URL_API' con la URL base de tu API
      const response = await fetch("/api/pdfaliado/pdfordenes", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          // Añade aquí cualquier otro header que necesites, como tokens de autorización
          // "Authorization": `Bearer ${sessionStorage.getItem("token")}`,
        },
        body: JSON.stringify(dataToSend),
      });

      if (!response.ok) {
        throw new Error("Respuesta de la red no fue ok");
      }
      Swal.fire({
        title: "¡Enviado!",
        text: "Ordenes de pago cargadas con éxito.",
        icon: "success",
        confirmButtonText: "Ok",
      });
    } catch (error) {
      Swal.fire({
        title: "Error",
        text: "Hubo un problema al cargar las ordenes de pago.",
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
            <h6 className="fs-18 lato-bold">Cargar ordenes de pago</h6>
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
                Selecciona las ordenes de pago para cargar
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
                className={
                  darkMode
                    ? "btn-cancelar-usuario-editar lato-bold text-dark mx-4"
                    : "btn-cancelar-usuario-editar lato-bold text-dark mx-4"
                }
                onClick={props.onHide}
                type="button"
              >
                Cancel
              </button>
              <button
                className={`btn-guardar-usuario-editar border-0 lato-bold ${
                  darkMode ? "text-dark" : "text-white"
                } mx-4`}
                type="submit"
                disabled={loading} // Desactiva el botón mientras loading es true
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

const ContenidoOrdenesPago = () => {
  // context para ejecutar la modalidad de claro/oscuro
  const { darkMode } = useContext(DarkModeContext);
  const [datos, setDatos] = useState([]); // Estado para almacenar los datos
  const [loading, setLoading] = useState(false); // Estado para el spinner
  const [modalShow, setModalShow] = useState(false); // Estado para la visibilidad del modal

  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      try {
        const response = await fetch("/api/pdfaliado/resumenUltimosCincoDias");
        const data = await response.json();
        setDatos(data); // Actualizar el estado con los datos obtenidos
      } catch (error) {
        console.error("Error fetching data: ", error);
        Swal.fire("Error", "No se pudo cargar la información", "error");
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []); // El array vacío asegura que el efecto se ejecute solo una vez al montar el componente

  const [resumen, setResumen] = useState([]);

  const urlResumen = "/api/pdfaliado/resumenUltimosCincoDias";
  // consulta para traer las notificaciones de aliado/asesores
  // y guardarla en sus estados.
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
  }, [urlResumen]); // Asegúrate de incluir todas las dependencias necesarias

  return (
    <div className="container">
      <div
        className={
          darkMode
            ? "container bg-tabla-usuarios-liquidaciones-dark"
            : "container bg-tabla-usuarios-liquidaciones"
        }
      >
        <section className="container mt-3 mb-3 ">
          <div className="d-flex flex-wrap justify-content-end pt-4">
            <div className="d-flex centrado-responsive">
              <div className="pt-3">
                <Button
                  className="btn-modal-nuevo-usuario-editar centrado border-0 mx-2"
                  onClick={() => setModalShow(true)}
                >
                  <FontAwesomeIcon icon={faCirclePlus} />{" "}
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
                ? " container table-responsive py-3  px-5 "
                : "container table-responsive py-3  px-5 "
            }
          >
            <table className="table table-borderless responsive striped hover">
              <thead className="border-0 ">
                <tr className="text-center tabla-thead">
                  <th
                    className={
                      darkMode
                        ? " bg-white text-dark border-tabla-izquierda border-0 lato-regular fs-12 py-3 "
                        : "bg-dark text-white border-tabla-izquierda border-0 lato-regular fs-12 py-3 "
                    }
                    scope="col "
                  >
                    #
                  </th>
                  <th
                    className={
                      darkMode
                        ? " bg-white text-dark  border-0 lato-regular fs-12 py-3 "
                        : "bg-dark text-white  border-0 lato-regular fs-12 py-3 "
                    }
                    scope="col "
                  >
                    Fecha
                  </th>
                  <th
                    className={
                      darkMode
                        ? " bg-white text-dark border-0 lato-regular fs-12 py-3 border-tabla-derecha"
                        : "bg-dark text-white fs-12 lato-regular py-3 border-tabla-derecha "
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
                ) : datos.length > 0 ? (
                  datos.slice(0, 8).map((dato, i) => (
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

export default ContenidoOrdenesPago;
