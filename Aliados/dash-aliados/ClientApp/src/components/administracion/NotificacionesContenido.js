// import hoja de estilo (css)
import "./NotificacionesContenido.css";

// import hooks
import React, { useContext, useState } from "react";

// import context
import { DarkModeContext } from "../../context/DarkModeContext";

// import librerias
import Select from "react-select";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faCircle, faPencil } from "@fortawesome/free-solid-svg-icons";
import Swal from "sweetalert2";

// import componentes
import ModalNotificacionesEditar from "./ModalNotificacionesEditar";

const NotificacionesContenido = ({
  notificacionesAsesores,
  notificacionesAliados,
}) => {
  // darkmode context funcionalidad para el modo claro/oscuro
  const { darkMode } = useContext(DarkModeContext);

  // opciones hardcodeada de los roles
  const opcionesDeRol = [
    { value: "Aliado", label: "Aliado" },
    { value: "Asesor", label: "Asesor" },
  ];

  // estado para determinar el rol seleccionado
  const [rolSeleccionado, setRolSeleccionado] = useState(opcionesDeRol[0]);

  // estado para capturar comentario
  const [comentario, setComentario] = useState("");

  // estado para el manejo del cierre y apertura del modal
  const [modalShowCompleta, setModalShowCompleta] = React.useState(false);

  // funcion para enviar los datos al back
  const handleSubmit = async (e) => {
    const token = sessionStorage.getItem("token");

    const fechaActual = new Date().toISOString().split("T")[0]; // Formato YYYY-MM-DD

    // Datos a enviar, incluyendo la fecha
    const data = {
      TipoUsuario: rolSeleccionado.value,
      Noticia1: comentario,
      Token: token,
      Fecha: fechaActual,
    };

    try {
      const response = await fetch("/api/notificacion/crearnoticia", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(data),
      });

      if (!response.ok) {
        throw new Error(`Error: ${response.status}`);
      }
      // Resetear comentario
      setComentario("");
    } catch (error) {
      console.error("Error al enviar los datos:", error);
      // Para manejar el error, por ejemplo, mostrando un mensaje al usuario
    }
  };

  const handleDelete = async (id) => {
    Swal.fire({
      title: "¿Estás seguro?",
      text: "¡No podrás revertir esto!",
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#3085d6",
      cancelButtonColor: "#d33",
      confirmButtonText: "Sí, borrar!",
      cancelButtonText: "Cancelar",
    }).then((result) => {
      if (result.isConfirmed) {
        // Coloca aquí la lógica de eliminación si el usuario confirma
        const token = sessionStorage.getItem("token");

        const data = {
          id: id,
          Token: token,
        };

        try {
          fetch("/api/notificacion/eliminarnoticia", {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
            },
            body: JSON.stringify(data),
          })
            .then(() => {
              Swal.fire(
                "Eliminado!",
                "La notificación ha sido eliminada.",
                "success"
              );
              // Aquí puedes actualizar tu estado o UI según sea necesario
              window.location.reload();
            })
            .catch((error) => {
              console.error("Error al enviar los datos:", error);
              Swal.fire(
                "Error!",
                "No se pudo eliminar la notificación.",
                "error"
              );
            });
        } catch (error) {
          console.error("Error al enviar los datos:", error);
          Swal.fire("Error!", "No se pudo eliminar la notificación.", "error");
        }
      }
    });
  };

  // Nuevos estados para controlar la activación de los botones
  const [aliadoActivo, setAliadoActivo] = useState(true);
  const [asesorActivo, setAsesorActivo] = useState(false);
  const [isActive, setIsActive] = useState();

  // boton de aliado
  const handleAliadoClick = () => {
    setAliadoActivo(true);
    setAsesorActivo(false);
    setIsActive(!isActive);
  };

  // boton de aliado
  const handleAsesorClick = () => {
    setAliadoActivo(false);
    setAsesorActivo(true);
    setIsActive(!isActive);
  };

  return (
    <div className="container">
      <div className="row">
        <div className="col-12 col-lg-6 py-4">
          <article>
            <form onSubmit={handleSubmit}>
              <div>
                <Select
                  className="lato-regular text-center   select__control_custom-inicio"
                  classNamePrefix="select"
                  defaultValue={rolSeleccionado}
                  onChange={setRolSeleccionado}
                  options={opcionesDeRol}
                />
              </div>
              <div className="py-2">
                <textarea
                  className="caja-comentario-notificaciones border-0 container"
                  id="comentario"
                  value={comentario}
                  onChange={(e) => setComentario(e.target.value)}
                ></textarea>
              </div>
              <div className="d-flex justify-content-end">
                <button className="btn-publicar-notificaciones" type="submit">
                  Publicar
                </button>
              </div>
            </form>
          </article>
        </div>
        <div className="col-12 col-lg-6 py-4">
          <article>
            <section className="d-flex mb-2">
              <div className="ms-1 me-4">
                <button
                  onClick={handleAliadoClick}
                  className={
                    aliadoActivo
                      ? "bg-activado-asesores "
                      : "btn-aliado-asesores"
                  }
                >
                  Aliados
                </button>
              </div>
              <div>
                <button
                  onClick={handleAsesorClick}
                  className={
                    asesorActivo
                      ? "bg-activado-asesores "
                      : "btn-aliado-asesores"
                  }
                >
                  Asesores
                </button>
              </div>
            </section>
            {isActive ? (
              <>
                <section
                  className={
                    darkMode
                      ? "cuadro-notificaciones-dark"
                      : "cuadro-notificaciones"
                  }
                  style={{
                    overflowWrap: "break-word",
                    wordBreak: "break-word",
                  }}
                >
                  <div className="container">
                    <h6 className="text-center pt-5 pb-4 fs-20 lato-bold color-verde">
                      {" "}
                      Para Asesores
                    </h6>
                    <div className="d-flex flex-column justify-content-around">
                      {notificacionesAsesores.map((notificacion, index) => (
                        <div key={index}>
                          <h6 className="fs-16 my-3">
                            <span className="me-2">
                              {darkMode ? (
                                <FontAwesomeIcon
                                  className="fs-8  color-blanco-items"
                                  icon={faCircle}
                                />
                              ) : (
                                <FontAwesomeIcon
                                  className="fs-8  color-negro-items"
                                  icon={faCircle}
                                />
                              )}
                            </span>
                            <span>{notificacion.id} - </span>
                            <span>{notificacion.noticia1}</span>
                            <span
                              onClick={() => setModalShowCompleta(true)}
                              className="color-verde text-decoration-underline ms-4  cursor-point"
                            >
                              <FontAwesomeIcon
                                className="color-verde cursor-point"
                                icon={faPencil}
                              />
                              editar
                            </span>

                            <span
                              onClick={() => handleDelete(notificacion.id)}
                              className="color-rojo text-decoration-underline ms-4 cursor-point"
                            >
                              <FontAwesomeIcon
                                className="color-rojo cursor-point"
                                icon={faPencil} // Considera cambiar este icono por uno más adecuado para "eliminar"
                              />
                              eliminar
                            </span>
                            <div className="">
                              <ModalNotificacionesEditar
                                prueba={notificacion.id}
                                show={modalShowCompleta}
                                onHide={() => setModalShowCompleta(false)}
                              />
                            </div>
                          </h6>
                        </div>
                      ))}
                    </div>
                  </div>
                </section>
              </>
            ) : (
              <>
                <section
                  className={
                    darkMode
                      ? "cuadro-notificaciones-dark"
                      : "cuadro-notificaciones"
                  }
                  style={{
                    overflowWrap: "break-word",
                    wordBreak: "break-word",
                  }}
                >
                  <div className="container">
                    <h6 className="text-center pt-5 pb-4 fs-20 lato-bold color-verde">
                      {" "}
                      Para Aliado
                    </h6>
                    <div className="d-flex flex-column justify-content-around">
                      {notificacionesAliados.map((notificacion, index) => (
                        <div key={index}>
                          <h6 className="fs-16 my-3">
                            <span className="me-2">
                              {darkMode ? (
                                <FontAwesomeIcon
                                  className="fs-8  color-blanco-items"
                                  icon={faCircle}
                                />
                              ) : (
                                <FontAwesomeIcon
                                  className="fs-8  color-negro-items"
                                  icon={faCircle}
                                />
                              )}
                            </span>
                            <span>{notificacion.id} - </span>
                            <span>{notificacion.noticia1}</span>
                            <span
                              onClick={() => setModalShowCompleta(true)}
                              className="color-verde text-decoration-underline ms-4 cursor-point"
                            >
                              <FontAwesomeIcon
                                className="color-verde cursor-point"
                                icon={faPencil}
                              />
                              editar
                            </span>
                            <span
                              onClick={() => handleDelete(notificacion.id)}
                              className="color-rojo text-decoration-underline ms-4 cursor-point"
                            >
                              <FontAwesomeIcon
                                className="color-rojo cursor-point"
                                icon={faPencil} // Considera cambiar este icono por uno más adecuado para "eliminar"
                              />
                              eliminar
                            </span>
                            <div className="">
                              <ModalNotificacionesEditar
                                prueba={notificacion.id}
                                show={modalShowCompleta}
                                onHide={() => setModalShowCompleta(false)}
                              />
                            </div>
                          </h6>
                        </div>
                      ))}
                    </div>
                  </div>
                </section>
              </>
            )}
          </article>
        </div>
      </div>
    </div>
  );
};

export default NotificacionesContenido;
