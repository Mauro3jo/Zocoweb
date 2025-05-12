// hooks, context y librerias.
import React, { useContext, useEffect, useRef, useState } from "react";
import { useNavigate } from "react-router-dom";
import Swal from "sweetalert2";
import { DarkModeContext } from "../../context/DarkModeContext";
import { Button, Image, Modal, Spinner } from "react-bootstrap";
import { Comment } from "react-loader-spinner";

// assets
import logo from "../../assets/img/logo.png";
import iconoABM from "../../assets/img/abm.png";
import iconoAsesor from "../../assets/img/asesores.png";

// components
import BienvenidoPanelAsesores from "../../components/asesoresComp/BienvenidoPanelAsesores";
import BienvenidoPanelAsesoresCelular from "../../components/asesoresComp/BienvenidoPanelAsesoresCelular";
import Footer from "../../components/Footer";
import TituloPagina from "../../components/TituloPagina";
import ScrollTo from "../../components/asesoresComp/ScrollTo";
import { faPaperclip } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
const ChatAsesores = () => {
  // context para que se aplique el modo oscuro.
  const { darkMode } = useContext(DarkModeContext);

  // state inicial donde se cargan todos los datos de la consulta a la api
  const [datosInicio, setDatosInicio] = useState(null);

  // hook para efectuar la navegacion en la consulta a la api
  const navegacion = useNavigate();

  // Función para formatear la fecha
  const formatearFecha = (fechaISO) => {
    const fecha = new Date(fechaISO);

    const dia = fecha.getDate().toString().padStart(2, "0");
    const mes = (fecha.getMonth() + 1).toString().padStart(2, "0"); // getMonth() devuelve un índice basado en cero
    const año = fecha.getFullYear();
    const hora = fecha.getHours().toString().padStart(2, "0");
    const minutos = fecha.getMinutes().toString().padStart(2, "0");

    return `${dia}/${mes}/${año} - ${hora}:${minutos} hs`;
  };

  // estado para evitar el enviado multiple
  const [enviando, setEnviando] = useState(false);

  // API CONSULTA
  const apiUrlToken = process.env.REACT_APP_API_TOKEN;
  const apiUrlDatos = process.env.REACT_APP_API_INICIO_ASESORES;
  // Añade al inicio de tu componente
  const inputRef = useRef(null);
  // CONSULTA A LA API
  useEffect(() => {
    const verificarTokenYObtenerDatos = async () => {
      const token = sessionStorage.getItem("token");

      if (!token) {
        manejarRespuestaNoAutorizada();
        return;
      }

      try {
        // Primero, verificar el token
        const respuestaToken = await fetch(apiUrlToken, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ Token: token }),
        });

        if (!respuestaToken.ok) {
          if (respuestaToken.status === 401) {
            manejarRespuestaNoAutorizada();
          } else {
            throw new Error("Error verificando el token");
          }
          return; // Salir si la verificación del token falló
        }

        const dataToken = await respuestaToken.json();
        if (dataToken !== 1) {
          manejarAccesoDenegado();
          return; // Salir si el token no es válido
        }

    
        
      } catch (error) {
        console.error("Error en la cadena de solicitudes:", error);
      }
    };

    const manejarRespuestaNoAutorizada = () => {
      sessionStorage.removeItem("token");
      Swal.fire({
        title: "Sesión expirada o token inválido.",
        text: "Inicie sesión nuevamente.",
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
          confirmButton: "my-swal-button",
        },
      }).then(() => {
        navegacion("/");
        window.location.reload();
      });
    };

    const manejarAccesoDenegado = () => {
      Swal.fire({
        title: "Acceso denegado.",
        text: "No tiene permisos para acceder.",
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
          confirmButton: "my-swal-button",
        },
      }).then(() => {
        navegacion("/");
        window.location.reload();
      });
    };

    verificarTokenYObtenerDatos();
  }, []);

  // estado para enviar el comentario
  const [comentario, setComentario] = useState("");
  const [cargandoMsj, setCargandoMsj] = useState("");

  const handleSubmit = async (e) => {
    e.preventDefault();

    // Verifica si ambos, comentario y imagen, están vacíos
    if (!comentario.trim() && !imagenBase64) {
      Swal.fire({
        icon: "error",
        title: "Oops...",
        text: "Por favor, añade un comentario o una imagen antes de enviar.",
      });
      return;
    }

    if (cargandoMsj) return;

    setCargandoMsj(true);
    setEnviando(true);

    const token = sessionStorage.getItem("token");
    // Crea el objeto data con condicionales para incluir solo los campos llenos
    const data = {
      Cuit: primerCuit,
      Token: token,
      ...(comentario.trim() && { ComentarioTexto: comentario }), // Incluye el comentario solo si no está vacío
      ...(imagenBase64 && { ImagenBase64: imagenBase64 }), // Incluye la imagen solo si está definida
    };

    try {
      const response = await fetch("/api/chat/chatnuevo", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(data),
      });

      if (!response.ok) {
        throw new Error(`Error: ${response.status}`);
      }

      // Restablecer los campos de entrada después del envío exitoso
      setComentario("");
      setImagenBase64("");
    } catch (error) {
      console.error("Error al enviar los datos:", error);
    } finally {
      setComentario("");
      setImagenBase64("");
      setCargandoMsj(false);
      setEnviando(false);
      fetchComentarios(); // Esto actualizará los comentarios tras cualquier envío
    }
  };

  // estado para traer todos los comentarios desde la consulta
  const [comentariosTodos, setComentariosTodos] = useState([]);
  const [primerCuit, setPrimerCuit] = useState("");

  // Asume true inicialmente para mostrar el spinner al inicio
  const [cargando, setCargando] = useState(true);

  // consulta para traer los datos desde el back
  const fetchComentarios = async () => {
    const token = sessionStorage.getItem("token");
    try {
      setCargando(true);
      const response = await fetch("/api/chat/listarparausuario", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ Token: token }),
      });
      const data = await response.json();

      // Identifica si hay nuevos comentarios comparando los IDs.
      let hayComentariosNuevos = false;
      for (let comentarioNuevo of data) {
        if (
          !comentariosTodos.some(
            (comentarioActual) => comentarioActual.id === comentarioNuevo.id
          )
        ) {
          hayComentariosNuevos = true;
          break;
        }
      }

      // Solo actualiza el estado si hay comentarios nuevos.
      if (hayComentariosNuevos) {
        setComentariosTodos(data);
        // Actualiza el primer CUIT solo si es necesario.
        if (data[0]?.cuit !== primerCuit) {
          setPrimerCuit(data[0]?.cuit);
        }
      }

      setCargando(false);
    } catch (error) {
      console.error("Error al cargar comentarios:", error);
      setCargando(false);
    }
  };

  // Ref para el contenedor de los mensajes
  const mensajesRef = useRef(null);

  useEffect(() => {
    // Llamada inicial para cargar los comentarios y establecer el intervalo
    fetchComentarios();

    // Siempre que se actualicen los comentarios, mueve el scroll hacia el final
    const intervalId = setInterval(fetchComentarios, 30000); // Ajusta este tiempo según lo necesites

    return () => clearInterval(intervalId); // Limpia el intervalo cuando el componente se desmonte
  }, [comentariosTodos]); // Añade 'comentariosTodos' a las dependencias de useEffect

  useEffect(() => {
    // Asegúrate de que 'mensajesRef.current' exista y tenga mensajes para scrollear
    if (mensajesRef.current && comentariosTodos.length > 0) {
      // 'scrollIntoView' mueve el scroll para mostrar el elemento referenciado
      mensajesRef.current.lastElementChild.scrollIntoView({
        behavior: "smooth",
      });
    }
  }, [comentariosTodos]); // Este efecto se ejecuta cada vez que 'comentariosTodos' cambia
  const [imagenBase64, setImagenBase64] = useState("");
  const handleButtonClick = () => {
    // Cuando el botón es clickeado, dispara el click en el input real
    inputRef.current.click();
  };
  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setImagenBase64(reader.result.toString());
      };
      reader.readAsDataURL(file);
    }
  };
  return (
    <div translate="no" className="d-flex flex-column min-vh-100">
      <div className="py-4 d-md-block d-none">
        <BienvenidoPanelAsesores datos={datosInicio} />
      </div>
      <div className="py-4 d-block d-md-none">
        <BienvenidoPanelAsesoresCelular datos={datosInicio} />
      </div>
      <ScrollTo />
      <div>
        <TituloPagina title="Chat" />
      </div>
      <div className="container">
        <section
          ref={mensajesRef}
          className={
            darkMode
              ? "container text-black bg-caja-chat-asesores-dark "
              : "container text-black bg-caja-chat-asesores "
          }
        >
          <article style={{ maxHeight: "60vh", overflowY: "auto" }}>
            {cargando ? (
              <div className="d-flex justify-content-center">
                <div
                  className="centrado color-verde"
                  style={{ height: "60vh" }}
                >
                  {/* Contenido del spinner o carga */}
                </div>
              </div>
            ) : (
              comentariosTodos.map((comentario, index) => (
                <div
                  className={
                    comentario.esDelUsuario
                      ? "d-flex justify-content-end py-2"
                      : "d-flex justify-content-start py-2"
                  }
                  key={index}
                >
                  {/* Comentario de otro usuario */}
                  {!comentario.esDelUsuario && (
                    <>
                      <div className="pt-3">
                        <Image
                          className="icono-asesor-administrador"
                          src={iconoABM}
                          rounded
                          fluid
                        />
                      </div>
                      <div className="my-3 mx-2">
                        {comentario.imagenBase64 && (
                          <img
                            src={`data:image/png;base64,${comentario.imagenBase64}`}
                            alt="Imagen del comentario"
                            style={{
                              maxWidth: "400px",
                              maxHeight: "400px",
                              marginBottom: "10px",
                              cursor: "pointer",
                            }}
                          />
                        )}
                        <h6 className="caja-comentarios-respuestas lato-regular fs-14">
                          {comentario.comentario1}
                        </h6>
                        <span className="ms-2 d-flex justify-content-start text-black-50 fs-14">
                          {formatearFecha(comentario.fechaCreacion)}
                        </span>
                      </div>
                    </>
                  )}

                  {/* Comentario del usuario */}
                  {comentario.esDelUsuario && (
                    <>
                      <div className="my-3 mx-2">
                        {comentario.imagenBase64 && (
                          <img
                            src={`data:image/png;base64,${comentario.imagenBase64}`}
                            alt="Imagen del comentario"
                            style={{
                              maxWidth: "400px",
                              maxHeight: "400px",
                              marginBottom: "10px",
                              cursor: "pointer",
                            }}
                          />
                        )}
                        {comentario.comentario1 &&
                          typeof comentario.comentario1 === "string" &&
                          comentario.comentario1.trim() && (
                            <h6 className="caja-comentarios-respuestas lato-regular fs-14">
                              {comentario.comentario1}
                            </h6>
                          )}
                        <span className="me-4 d-flex justify-content-end text-black-50 fs-14">
                          {formatearFecha(comentario.fechaCreacion)}
                        </span>
                      </div>
                      <div className="pt-3">
                        <Image
                          className="icono-asesor-administrador"
                          src={iconoAsesor}
                          rounded
                          fluid
                        />
                      </div>
                    </>
                  )}
                </div>
              ))
            )}
          </article>

          <section className="container mt-4">
            <form onSubmit={handleSubmit}>
              <div className="py-2 mx-2">
                <textarea
                  className="caja-comentario-notificaciones border-0 container "
                  id="comentario"
                  value={comentario}
                  onChange={(e) => setComentario(e.target.value)}
                ></textarea>
              </div>
              <div className="d-flex justify-content-end pb-5">
                <div className="">
                  {/* Botón personalizado que el usuario ve */}
                  <button
                    type="button"
                    className="btn-enviar-imagen border-0 me-2"
                    onClick={handleButtonClick}
                  >
                    <FontAwesomeIcon icon={faPaperclip} />
                  </button>

                  {/* Input de archivo oculto que realmente carga el archivo */}
                  <input
                    ref={inputRef}
                    type="file"
                    accept="image/*"
                    onChange={handleImageChange}
                    style={{ display: "none" }} // Oculta el input real
                  />

                  {/* Opcional: mostrar el nombre del archivo seleccionado */}
                  {imagenBase64 && (
                    <span className="nombre-archivo-seleccionado">
                      {/* aquí el nombre del archivo */}
                    </span>
                  )}
                </div>
                <button
                  className="btn-publicar-notificaciones lato-bold text-white"
                  type="submit"
                  disabled={enviando}
                >
                  {cargando ? (
                    <>
                      <Spinner
                        as="span"
                        animation="border"
                        size="sm"
                        role="status"
                        aria-hidden="true"
                      />
                      <span className="sr-only">Cargando...</span>
                    </>
                  ) : (
                    "Enviar"
                  )}
                </button>
              </div>
            </form>
          </section>
        </section>
      </div>

      <div className="mt-auto py-4">
        <Footer />
      </div>
    </div>
  );
};

export default ChatAsesores;
