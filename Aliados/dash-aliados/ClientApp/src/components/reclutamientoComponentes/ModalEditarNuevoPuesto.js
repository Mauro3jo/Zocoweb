import React, { useContext, useEffect, useState } from "react";
import { Modal, Spinner } from "react-bootstrap";
import { Controller, useForm } from "react-hook-form";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faXmark } from "@fortawesome/free-solid-svg-icons";
import { DarkModeContext } from "../../context/DarkModeContext";

const ModalEditarNuevoPuesto = (props) => {
  const { show, onHide, dato, actualizarListaBusquedas } = props;
  const { darkMode } = useContext(DarkModeContext);
  const { control, handleSubmit, formState, register, reset } = useForm();
  const { errors } = formState;

  const [datosParaEnviar, setDatosParaEnviar] = useState({});

  const [isSubmitting, setIsSubmitting] = useState(false); 

  // Función auxiliar para convertir archivo a base64
  const convertToBase64 = (file) =>
    new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.readAsDataURL(file);
      reader.onload = () => resolve(reader.result);
      reader.onerror = (error) => reject(error);
    });

  // Función para manejar el envío del formulario
  const handleFormSubmit = (data) => {
    // Convertir datos del formulario a FormData para incluir archivos
    const formData = new FormData();
    for (const key in data) {
      formData.append(key, data[key]);
    }

    // Aquí puedes hacer un log de los datos que se van a enviar
    console.log("Datos del formulario enviados:", data);
    setDatosParaEnviar(data);
    // Ahora, llama a tu función onSubmit original con los datos
    // Asegúrate de adaptar esta parte si tu función `onSubmit` espera algo diferente
    // cambiarClaveContext.onSubmit(formData);
  };

  const idParaEditar = dato.id;

  const customOnSubmit = async (data) => {
    setIsSubmitting(true);
    const token = sessionStorage.getItem("token"); 

    let formData = { ...data };

    // Verifica y convierte la imagen a base64
    if (data.foto && data.foto.length > 0) {
      const base64 = await convertToBase64(data.foto[0]);
      formData.foto = base64; 
    } else {
      formData.foto = ""; 
    }

    try {
      setIsSubmitting(true);
      // Añade el token y el id al objeto formData
      formData = {
        ...formData,
        token: token,
        id: idParaEditar,
      };

      // Convertimos el objeto dataWithToken a JSON
      const body = JSON.stringify(formData);
      const response = await fetch("/api/puesto/Editar", {
        method: "POST", 
        headers: {
          "Content-Type": "application/json", 
        },
        body, 
      });

      if (response.ok) {
        const responseData = await response.json();
        // Aquí puedes manejar la respuesta de la API, por ejemplo:
        // Mostrar un mensaje de éxito, limpiar el formulario, etc.
        props.actualizarListaBusquedas();
        onHide();
      } else {
        // Manejar los errores, por ejemplo, mostrar un mensaje al usuario
        console.error("Error al enviar los datos:", response.statusText);
      }
    } catch (error) {
      console.error("Error al intentar enviar los datos a la API:", error);
    }
    setIsSubmitting(false);
    props.actualizarListaBusquedas();
    onHide();
  };

  useEffect(() => {
    reset({
      nombre: dato.nombre,
      requisitos: dato.requisitos,
      principalesTareas: dato.principalesTareas,
      ofrecemos: dato.ofrecemos,
      // Asegúrate de manejar la actualización de la imagen si es necesario
    });
  }, [dato, reset]);

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
              ? " modal-content-cargar-puesto-dark  text-white "
              : "modal-content-cargar-puesto text-black "
          }
        >
          <section className="d-flex justify-content-between py-4">
            <div className="ocultar-div"></div>
            <div className="d-flex justify-content-center">
              <h6 className="fs-18 lato-bold">Editar descripción de puesto</h6>
            </div>
            <div>
              <button className="border-0 btn-filtro-cruz" onClick={onHide}>
                <FontAwesomeIcon className="fs-18 " icon={faXmark} />
              </button>
            </div>
          </section>

          <div className="container">
            <form className=" " onSubmit={handleSubmit(customOnSubmit)}>
              <article>
                <div>
                  <label
                    className="lato-regular fs-16-a-14 mb-2"
                    htmlFor="nombre"
                  >
                    Nombre
                  </label>
                </div>
                <div>
                  <Controller
                    name="nombre"
                    control={control}
                    defaultValue={dato.nombre}
                    rules={{ required: "Campo requerido" }}
                    render={({ field }) => (
                      <input
                        className="input-cargar-nuevo-puesto"
                        style={{ padding: "10px" }}
                        type="text"
                        {...field}
                      />
                    )}
                  />
                  <div className="text-danger">
                    {errors.anterior && (
                      <p className="fs-16 lato-bold">{errors.nombre.message}</p>
                    )}
                  </div>
                </div>
              </article>
              <article className="my-1">
                <div>
                  <label
                    className="lato-regular fs-16-a-14 mb-2 mt-2"
                    htmlFor="requisitos"
                  >
                    📄 Requisitos
                  </label>
                </div>
                <div>
                  <Controller
                    name="requisitos"
                    defaultValue={dato.requisitos}
                    control={control}
                    rules={{ required: "Campo requerido" }}
                    render={({ field }) => (
                      <textarea
                        className="input-cargar-nuevo-puesto-comentario"
                        style={{ padding: "10px" }}
                        {...field}
                      />
                    )}
                  />
                  <div className="text-danger ">
                    {errors.requisitos && (
                      <p className="fs-16 lato-bold">
                        {errors.requisitos.message}
                      </p>
                    )}
                  </div>
                </div>
              </article>
              <article className="my-1">
                <div>
                  <label
                    className="lato-regular fs-16-a-14 mb-2 mt-2"
                    htmlFor="tareas"
                  >
                    📝 Principales tareas
                  </label>
                </div>
                <div>
                  <Controller
                    name="principalesTareas"
                    defaultValue={dato.principalesTareas}
                    control={control}
                    rules={{ required: "Campo requerido" }}
                    render={({ field }) => (
                      <textarea
                        className="input-cargar-nuevo-puesto-comentario"
                        style={{ padding: "10px" }}
                        {...field}
                      />
                    )}
                  />
                  <div className="text-danger">
                    {errors.principalesTareas && (
                      <p className="fs-16 lato-bold">
                        {errors.principalesTareas.message}
                      </p>
                    )}
                  </div>
                </div>
              </article>
              <article className="my-1">
                <div>
                  <label
                    className="lato-regular fs-16-a-14 mb-2 mt-2"
                    htmlFor="ofrecemos"
                  >
                    🌟 Ofrecemos
                  </label>
                </div>
                <div>
                  <Controller
                    name="ofrecemos"
                    defaultValue={dato.ofrecemos}
                    control={control}
                    rules={{ required: "Campo requerido" }}
                    render={({ field }) => (
                      <textarea
                        className="input-cargar-nuevo-puesto-comentario"
                        style={{ padding: "10px" }}
                        {...field}
                      />
                    )}
                  />
                  <div className="text-danger">
                    {errors.ofrecemos && (
                      <p className="fs-16 lato-bold">
                        {errors.ofrecemos.message}
                      </p>
                    )}
                  </div>
                </div>
              </article>
              <article className="my-3">
                <div>
                  <label
                    className="lato-regular fs-16-a-14 mb-2 mt-2"
                    htmlFor="cargarImagen"
                  >
                    🖼️ Cargar Imagen
                  </label>
                </div>
                <input
                  type="file"
                  {...register("foto", { required: "Campo requerido" })}
                  className="form-control"
                />

                <div className="text-danger">
                  {errors.foto && (
                    <p className="fs-16 lato-bold">{errors.foto.message}</p>
                  )}
                </div>
              </article>
              <div className="d-flex justify-content-between mt-5">
                <button
                  className={
                    darkMode
                      ? "btn-cancel-modificaciones-nuevo-puesto  border-0 lato-bold text-white"
                      : "btn-cancel-modificaciones-nuevo-puesto border-0 lato-bold text-white"
                  }
                  onClick={onHide}
                >
                  Cancel
                </button>
                <button
                  className={
                    darkMode
                      ? "btn-guardar-modificaciones-nuevo-puesto  border-0 lato-bold text-white "
                      : "btn-guardar-modificaciones-nuevo-puesto border-0 lato-bold text-white"
                  }
                  type="submit"
                  disabled={isSubmitting} // Deshabilita el botón durante el envío
                >
                  {isSubmitting ? (
                    <Spinner animation="border" size="sm" />
                  ) : (
                    "Guardar"
                  )}
                </button>
              </div>
            </form>
          </div>
        </Modal.Body>
      </Modal>
    </div>
  );
};

export default ModalEditarNuevoPuesto;
