// hoja de estilos css
import "./FormComentarioCalificar.css";

// import hooks
import { useContext, useState } from "react";

// import context
import { DarkModeContext } from "../context/DarkModeContext";

// import libreria
import { faStar } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { Col, Form } from "react-bootstrap";
import Swal from "sweetalert2";

// import assets
import logo from "../assets/img/logo.png";

const FormComentarioCalificar = () => {
  // estado para manejar el rating de calificar
  const [rating, setRating] = useState(0);

  // estado para manejar el input del comentario
  const [formComentarioData, setFormComentarioData] = useState({
    comentario: "",
  });

  // logica para desactivar el boton hasta que no califiquen
  const isButtonDisabled = rating === 0;

  // funcion para capturar los valores al hacer touch en las estrellas
  const handleStarClick = (star) => {
    setRating(star);
  };

  // funcion onsubmit
  // con esta funcion envio a la base de datos
  // token, numCalifico con el numero de estrella(rating),
  // descripcion (comentario) y la fecha actual.
  const onSubmit = async (event) => {
    event.preventDefault();
    const token = sessionStorage.getItem("token");
    // Asegúrate de que userId sea un entero
    const fechaActual = new Date().toISOString();

    const datosConRating = {
      Token: token,
      NumCalifico: rating,
      Descripcion: formComentarioData.comentario,
      Fecha: fechaActual,
    };

    // api url
    const apiUrlCalificoCom = process.env.REACT_APP_API_CALIFICAR_COM;

    // consulta a la api
    try {
      await fetch(apiUrlCalificoCom, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(datosConRating),
      });

      // resetea el valor del estado rating
      setRating(0);
      // resetea el valor del formulario de su input comentario
      setFormComentarioData({ comentario: "" });
      // desplega el mensaje de enviado exitosamente
      Swal.fire({
        title: "¡Enviado!",
        text: "Tu comentario ha sido enviado con éxito.",
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
          confirmButton: "my-swal-button", // Clase para el botón
        },
      });

      // catch para capturar el error y mostrar un mensaje por pantalla
    } catch (error) {
      console.error("Hubo un error:", error);
      Swal.fire({
        title: "Error",
        text: "Hubo un problema al enviar tu comentario.",
        confirmButtonText: "Cerrar",
        imageUrl: logo,
        imageWidth: 100,
        imageHeight: 30,
        imageAlt: "Logo",
        timer: 5000,
        allowOutsideClick: true,
        customClass: {
          container: darkMode
            ? "swal2-container--dark"
            : "swal2-container--light",
          confirmButton: "my-swal-button", // Clase para el botón
        },
      });
    }
  };

  // context para la modalidad claro/oscuro
  const { darkMode } = useContext(DarkModeContext);
  return (
    <section className="container">
      <form className="pb-0" onSubmit={onSubmit}>
        {/* escritorio */}
        <article className=" d-none d-lg-block">
          <div
            className={
              darkMode
                ? " contener-opinion-estrella-dark centrado-flex-around "
                : "contener-opinion-estrella centrado-flex-around "
            }
          >
            <div className="">
              <h6 className="lato-bold fs-18 ">
                Queremos conocer tu opinión sobre el servicio postventa brindado
                por Zoco.
                <br /> ¿Cómo calificarías la calidad del servicio?
              </h6>
            </div>
            <section>
              <div>
                <div>
                  {[1, 2, 3, 4, 5].map((star) => (
                    <span
                      className="width-estrellas"
                      key={star}
                      onClick={() => handleStarClick(star)}
                      style={{
                        color: star <= rating ? "#b4c400" : "#343a40",
                      }}
                    >
                      <FontAwesomeIcon icon={faStar} />
                    </span>
                  ))}
                </div>
              </div>
            </section>
          </div>
        </article>
        {/* Celular */}
        <article className="d-lg-none d-block">
          <div
            className={
              darkMode
                ? " contenedor-opinion-estrella-mobile-dark py-5"
                : "contenedor-opinion-estrella-mobile py-5 "
            }
          >
            <div className=" ">
              <h6 className=" text-center fs-18  lato-bold d-md-block d-none">
                Queremos conocer tu opinión sobre el servicio postventa brindado
                por Zoco.
                <br /> ¿Cómo calificarías la calidad del servicio?
              </h6>
              <h6 className=" text-center fs-14 lato-bold  d-block d-md-none">
                Queremos conocer tu opinión sobre el servicio postventa brindado
                por Zoco. <br /> ¿Cómo calificarías la calidad del servicio?
              </h6>
            </div>
            <div className="text-center ">
              <section>
                <div>
                  <div>
                    {[1, 2, 3, 4, 5].map((star) => (
                      <span
                        className="width-estrellas mt-2"
                        key={star}
                        onClick={() => handleStarClick(star)}
                        style={{
                          color: star <= rating ? "#b4c400" : "#343a40",
                        }}
                      >
                        <FontAwesomeIcon icon={faStar} />
                      </span>
                    ))}
                  </div>
                </div>
              </section>
            </div>
          </div>
        </article>

        {/* escritorio */}
        <article className="py-3 my-3 mx-4 d-md-block d-none ">
          <h6>
            <span className="lato-bold fs-16 ">
              ¿Tienes algún comentario o sugerencia que desees compartir?
            </span>{" "}
            <br />
            <span className="lato-regular fs-16 ">
              Utiliza el espacio a continuación para expresar tus impresiones.
            </span>
            <br />
            <span className="lato-regular fs-16 ">
              <i>
                Apreciamos tus comentarios y los tendremos en cuenta para
                continuar mejorando nuestro servicio.
              </i>
            </span>
          </h6>
        </article>
        {/* celular */}
        <article className="py-4 mx-4 d-md-none d-block ">
          <div>
            <p>
              <span className="lato-bold fs-16 line-16">
                ¿Tienes algún comentario o sugerencia que desees compartir?
              </span>
              <br />
              <span className="lato-regular fs-16 line-16">
                Utiliza el espacio a continuación para expresar tus impresiones.
              </span>
              <br />
              <span className="lato-regular fs-16 ">
                <i>
                  Apreciamos tus comentarios y los tendremos en cuenta para
                  continuar mejorando nuestro servicio.
                </i>
              </span>
            </p>
          </div>
        </article>

        <div className="mb-3">
          <Form.Group as={Col} md="12" controlId="validationCustom01">
            <Form.Control
              as="textarea"
              disabled={isButtonDisabled}
              className={
                darkMode
                  ? "form-control input-comentarios-calificar-dark border-0 px-5 py-4 text-white"
                  : "form-control input-comentarios-calificar  px-5 py-4 border-0 "
              }
              placeholder="Ingresá tu texto aquí."
              required
              type="text"
              name="comentario"
              value={formComentarioData.comentario}
              onChange={(e) => {
                // Limitar el texto a 500 caracteres
                if (e.target.value.length <= 500) {
                  setFormComentarioData({
                    ...formComentarioData,
                    comentario: e.target.value,
                  });
                }
              }}
            />
          </Form.Group>
        </div>
        <div className="my-4 d-flex justify-content-center">
          <button
            disabled={isButtonDisabled}
            className={
              isButtonDisabled
                ? "btn-enviar-comentario-disabled"
                : "btn-enviar-comentario"
            }
            type="submit"
          >
            <span className="lato-bold fs-18 text-white ">Enviar</span>
          </button>
        </div>
      </form>
    </section>
  );
};

export default FormComentarioCalificar;
