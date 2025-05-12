// import hooks 
import React, { useContext, useState } from "react";

// import context 
import { DarkModeContext } from "../../context/DarkModeContext";

// import librerias 
import { useForm } from "react-hook-form";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faXmark } from "@fortawesome/free-solid-svg-icons";
import { Modal } from "react-bootstrap";


const ModalNotificacionesEditar = (props) => {
  // funciones que traigo por los props 
  const { show, onHide, prueba } = props;

  // darkmode context para la funcionalidad claro/oscuro
  const { darkMode } = useContext(DarkModeContext);
  
  // formState de la libreria useForm 
  const {formState } = useForm();

  // funcion para enviar los datos para editar 
  const handleSubmit = async (e) => {
    e.preventDefault();

    const token = sessionStorage.getItem("token");

    const fechaActual = new Date().toISOString().split("T")[0]; // Formato YYYY-MM-DD

    // Datos a enviar, incluyendo la fecha
    const data = {
      Noticia1: comentario,
      Token: token,
      Id: prueba,
    };
   

    try {
      const response = await fetch("/api/notificacion/editarnoticia", {
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
    }
  };

  // estado de comentario para enviar 
  const [comentario, setComentario] = useState("");

  return (
    <div>
      <Modal
        {...props}
        show={show}
        onHide={onHide}
        centered
        size="lg"
        aria-labelledby="contained-modal-title-vcenter"
      >
        <Modal.Body
          className={
            darkMode
              ? " modal-content-dark text-white "
              : "modal-content text-black "
          }
        >
          <section className="d-flex justify-content-between my-4">
            <div className="ocultar-div"></div>
            <div className="d-flex justify-content-center">
              <h6 className="fs-18 lato-bold">Editar Notificacion</h6>
            </div>
            <div>
              <button className="border-0 btn-filtro-cruz" onClick={onHide}>
                <FontAwesomeIcon className="fs-18 " icon={faXmark} />
              </button>
            </div>
          </section>

          <div>
            {/* <form className="py-5 " onSubmit={handleSubmit(onSubmit)}> */}
            <form className="py-5" onSubmit={handleSubmit}>
              <article>
                <div>
                  <label
                    className="lato-bold fs-16-a-14 mb-2"
                    htmlFor="anterior"
                  >
                    Ingresar notificacion nueva
                  </label>
                </div>
                <div className="py-2">
                  <textarea
                    className="caja-comentario-notificaciones border-0 "
                    id="comentario"
                    value={comentario}
                    onChange={(e) => setComentario(e.target.value)}
                  ></textarea>
                </div>
              </article>
              <div className="d-flex justify-content-center mt-5">
                <button
                  className={
                    darkMode
                      ? "btn-guardar-modal-configuraciones border-0 lato-bold text-dark "
                      : "btn-guardar-modal-configuraciones border-0 lato-bold text-white"
                  }
                  type="submit"
                >
                  Guardar
                </button>
              </div>
            </form>
          </div>
        </Modal.Body>
      </Modal>
    </div>
  );
};

export default ModalNotificacionesEditar;
