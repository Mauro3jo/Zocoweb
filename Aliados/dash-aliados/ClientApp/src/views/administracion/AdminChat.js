// hooks, context y librerias.
import React, { useContext, useEffect, useRef, useState } from "react";
import { useNavigate } from "react-router-dom";
import Swal from "sweetalert2";
import { DarkModeContext } from "../../context/DarkModeContext";
import { Button, Spinner } from "react-bootstrap";
import { Comment } from "react-loader-spinner";

import jsPDF from "jspdf";
import html2canvas from "html2canvas";

// assets
import logo from "../../assets/img/logo.png";

// components
import TituloPagina from "../../components/TituloPagina";
import Footer from "../../components/Footer";
import BienvenidoAdmin from "../../components/administracion/BienvenidoAdmin";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faPaperclip } from "@fortawesome/free-solid-svg-icons";

const AdminChat = () => {
  // context para que se aplique el modo oscuro.
  const { darkMode } = useContext(DarkModeContext);

  // state inicial donde se cargan todos los datos de la consulta a la api
  const [datosInicio, setDatosInicio] = useState(null);

  // hook para efectuar la navegacion en la consulta a la api
  const navegacion = useNavigate();

  // API CONSULTA
  const apiUrlToken = process.env.REACT_APP_API_TOKEN;

  // estado para cargar
  const [cargando, setCargando] = useState(false);

  // recargar pagina para hacer la funcion
  function recargarPagina() {
    window.location.reload();
  }

  // descargar pdf logica
  const descargarPDF = () => {
    const input = document.getElementById("chat-section"); // Asegúrate de que este ID sea correcto.
    const inputHeight = input.offsetHeight;
    const inputWidth = input.offsetWidth;

    html2canvas(input, {
      scale: 1, // Ajusta esto según sea necesario
      useCORS: true, // Esto puede ayudar si hay contenido multimedia en el chat
      width: inputWidth,
      height: inputHeight,
      scrollY: -window.scrollY, // Ajuste para el scroll
      scrollX: -window.scrollX,
      windowWidth: document.documentElement.offsetWidth,
      windowHeight: document.documentElement.offsetHeight,
    })
      .then((canvas) => {
        const imgData = canvas.toDataURL("image/jpeg", 1.0);
        let pdf;
        if (inputWidth > inputHeight) {
          pdf = new jsPDF("l", "px", [inputWidth, inputHeight]);
        } else {
          pdf = new jsPDF("p", "px", [inputHeight, inputWidth]);
        }
        pdf.addImage(imgData, "JPEG", 0, 0, inputWidth, inputHeight);
        pdf.save("chat.pdf");
      })
      .catch((err) => console.error("Error al generar PDF:", err));
  };

  // CONSULTA A LA API
  const [asesores, setAsesores] = useState([]);

  // Estado para manejar errores de la solicitud
  const [error, setError] = useState("");

  useEffect(() => {
    // Función para llamar a la API y obtener los datos
    const obtenerAsesores = async () => {
      try {
        const response = await fetch("/api/datosinicioasesores/listarAsesores");
        if (!response.ok) {
          throw new Error("Respuesta de la red no fue ok");
        }
        const data = await response.json();
        setAsesores(data); // Asumiendo que la respuesta es el array de asesores
      } catch (error) {
        console.error("Error al obtener los asesores:", error);
        setError("No se pudieron obtener los datos de los asesores.");
      }
    };

    obtenerAsesores();
  }, []);

  // consulta para obtener token
  useEffect(() => {
    const verificarToken = async () => {
      const token = sessionStorage.getItem("token");

      if (!token) {
        manejarRespuestaNoAutorizada();
        return;
      }
      setCargando(true);
      try {
        const response = await fetch(apiUrlToken, {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ Token: token }),
        });

        if (response.ok) {
          const data = await response.json();

          if (data !== 8) {
            manejarAccesoDenegado();
          }
        } else {
          if (response.status === 401) {
            manejarRespuestaNoAutorizada();
          } else {
          }
        }
      } catch (error) {}
      setCargando(false);
    };

    const redireccionar = () => {
      navegacion("/");
      recargarPagina();
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
      }).then(redireccionar);
    };

    const manejarAccesoDenegado = () => {
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
      }).then(redireccionar);
    };

    verificarToken();
  }, []);

  // estado para enviar el comentario
  const [comentario, setComentario] = useState("");

  // estado para enviar evitar el envio multiple de mensaje
  const [cargandoMsj, setCargandoMsj] = useState("");

  const [imagenBase64, setImagenBase64] = useState("");

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
  const handleSubmit = async (e) => {
    e.preventDefault();

    // Verificar si tanto el comentario como la imagen están vacíos
    if (!comentario.trim() && !imagenBase64) {
      // Aquí puedes mostrar un mensaje al usuario indicando que debe añadir texto o una imagen
      Swal.fire({
        icon: "error",
        title: "Oops...",
        text: "Por favor, añade un comentario o una imagen antes de enviar.",
        // Ajusta el estilo del mensaje si es necesario
      });
      return; 
    }

    if (cargandoMsj) return;

    setCargandoMsj(true); // Iniciar el envío y deshabilitar el botón temporalmente

    const token = sessionStorage.getItem("token");
    const data = {
      ComentarioTexto: comentario,
      Cuit: asesorSeleccionado,
      Token: token,
      ImagenBase64: imagenBase64, // Añade la imagen en Base64 al payload
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
      setComentario(""); // Reiniciar el comentario
      setImagenBase64(""); // Reiniciar la imagen
      fetchComentarios(); // Actualizar comentarios
    } catch (error) {
      console.error("Error al enviar los datos:", error);
    } finally {
      setCargandoMsj(false); 
    }
  };

  const apiUrlChat = process.env.REACT_APP_API_CHAT_TODOS;
  const [comentariosTodos, setComentariosTodos] = useState([]);
  // Asume true inicialmente para mostrar el spinner al inicio
  const [cargandoSpinner, setCargandoSpinner] = useState(true);

  // estado para determinar el ultimo mensaje
  const [ultimoIdMensaje, setUltimoIdMensaje] = useState(0);
  const [hayNuevosMensajes, setHayNuevosMensajes] = useState(false);

  // consulta para traer los datos desde el back

  const fetchComentarios = async () => {
    const token = sessionStorage.getItem("token");
    try {
      const response = await fetch("/api/chat/listarporusuario", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ Token: token }),
      });
      const data = await response.json();
      if (data && data.length > 0) {
        const maxId = Math.max(...data.map((mensaje) => mensaje.id));
        if (maxId > ultimoIdMensaje) {
          setHayNuevosMensajes(true);
          setUltimoIdMensaje(maxId);
        }
      }
      setComentariosTodos(data);
    } catch (error) {
      console.error("Error al cargar comentarios:", error);
    } finally {
      setCargando(false);
    }
  };

  useEffect(() => {
    // Llamada inicial para cargar los comentarios
    fetchComentarios();

    // Establecer el intervalo para la actualización de comentarios
    const intervalId = setInterval(fetchComentarios, 15000); // Ajusta este tiempo según lo necesites

    return () => clearInterval(intervalId); // Limpia el intervalo cuando el componente se desmonte
  }, []);

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

  const [filtro, setFiltro] = useState("");
  const [asesorSeleccionado, setAsesorSeleccionado] = useState(null);
  const handleChange = (event) => {
    setFiltro(event.target.value);
  };

  const seleccionarAsesor = (cuil) => {
    setAsesorSeleccionado(cuil);
  };

  const obtenerComentariosRelacionados = () => {
    if (!asesorSeleccionado) return [];

    let comentariosFiltrados = comentariosTodos.filter(
      (comentario) => comentario.cuit === asesorSeleccionado
    );

    let idsComentariosRelacionados = new Set(
      comentariosFiltrados.map((c) => c.id)
    );

    let relacionadosDirectos;

    do {
      relacionadosDirectos = comentariosTodos.filter(
        (comentario) =>
          idsComentariosRelacionados.has(comentario.idComentarioPadre) ||
          (idsComentariosRelacionados.has(comentario.id) &&
            comentario.cuit !== asesorSeleccionado)
      );

      relacionadosDirectos.forEach((comentario) => {
        idsComentariosRelacionados.add(comentario.id);
        if (comentario.idComentarioPadre)
          idsComentariosRelacionados.add(comentario.idComentarioPadre);
      });
    } while (relacionadosDirectos.length > 0);

    return comentariosTodos.filter((comentario) =>
      idsComentariosRelacionados.has(comentario.id)
    );
  };

  // Añade al inicio de tu componente
  const inputRef = useRef(null);

  const handleButtonClick = () => {
    // Cuando el botón es clickeado, dispara el click en el input real
    inputRef.current.click();
  };

  const [showModal, setShowModal] = useState(false);
  const [selectedImage, setSelectedImage] = useState("");

  const handleImageClick = (imageBase64) => {
    setSelectedImage(imageBase64);
    setShowModal(true);
  };
  return (
    <div translate="no" className="d-flex flex-column min-vh-100">
      <div className="pt-5">
        <BienvenidoAdmin />
      </div>
      <div>
        <TituloPagina title="Chat" />
      </div>
      <div className="container">
        <section
          className={
            darkMode ? "row  admin-chat-cuadro-dark" : "row  admin-chat-cuadro"
          }
        >
          <article className=" my-4 col-4 ">
            <div className="contenedor-scroll-admin">
              {asesores.map((asesor, index) => (
                <div key={index}>
                  <article className="">
                    <Button
                      className={
                        asesorSeleccionado === asesor.cuitCuil
                          ? "btn-asesores-lista-activa text-black py-3 centrado border-0"
                          : "btn-asesores-lista text-black py-3 centrado border-0"
                      }
                      onClick={() => seleccionarAsesor(asesor.cuitCuil)}
                    >
                      <h6 className={darkMode ? "text-white" : "text-black"}>
                        {asesor.apellidoYNombre}
                      </h6>
                    </Button>
                  </article>
                </div>
              ))}
            </div>
          </article>
          <article className="col-8" id="chat-section">
            <section className="contenedor-scroll-admin">
              {cargando ? (
                <div className="d-flex justify-content-center">
                  <Comment
                    visible={true}
                    height="80"
                    width="80"
                    ariaLabel="fidget-spinner-loading"
                    wrapperStyle={{}}
                    wrapperClass="fidget-spinner-wrapper"
                    backgroundColor="#b4c400"
                  />
                </div>
              ) : (
                comentariosTodos
                  .flat()
                  .filter(
                    (comentario) => comentario.cuit === asesorSeleccionado
                  )
                  .map((comentario, index) => (
                    <div
                      className={
                        comentario.esDelUsuario
                          ? "d-flex flex-column align-items-end py-2"
                          : "d-flex flex-column align-items-start py-2"
                      }
                      key={index}
                    >
                      {/* Renderizar la imagen si existe */}
                      {comentario.imagenBase64 && (
                        <>
                          <img
                            src={`data:image/jpeg;base64,${comentario.imagenBase64}`}
                            alt="Imagen del comentario"
                            style={{
                              maxWidth: "400px",
                              maxHeight: "400px",
                              marginBottom: "10px",
                              cursor: "pointer",
                            }}
                            onClick={() =>
                              handleImageClick(comentario.imagenBase64)
                            }
                          />
                          <span
                            className={
                              darkMode
                                ? "pe-2 d-flex justify-content-end text-white fs-14"
                                : "pe-2 d-flex justify-content-end text-black-50 fs-14"
                            }
                          >
                            {formatearFecha(comentario.fechaCreacion)}
                          </span>
                        </>
                      )}
                      {/* Renderizar el comentario solo si hay texto */}
                      {comentario.comentario1 && (
                        <div className="my-3 d-flex">
                          <div>
                            <h6
                              className={
                                darkMode
                                  ? "caja-comentarios-respuestas text-black mx-1 lato-regular fs-14"
                                  : "caja-comentarios-respuestas mx-1 lato-regular fs-14 text-black"
                              }
                            >
                              {comentario.comentario1}
                              <br />
                            </h6>
                            <span
                              className={
                                darkMode
                                  ? "pe-2 d-flex justify-content-end text-white fs-14"
                                  : "pe-2 d-flex justify-content-end text-black-50 fs-14"
                              }
                            >
                              {formatearFecha(comentario.fechaCreacion)}
                            </span>
                          </div>
                        </div>
                      )}
                    </div>
                  ))
              )}
            </section>

            <section className="container mt-4">
              <form onSubmit={handleSubmit}>
                <div className="py-2">
                  <textarea
                    className="caja-comentario-notificaciones border-0 container"
                    id="comentario"
                    value={comentario}
                    onChange={(e) => setComentario(e.target.value)}
                  ></textarea>
                </div>
                <div className="d-flex  justify-content-end pb-5">
                  
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
                    disabled={cargandoMsj}
                    className="btn-publicar-notificaciones"
                    type="submit"
                  >
                    {cargandoMsj ? (
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
          </article>
        </section>
      </div>

      <div className="mt-auto py-4">
        <Footer />
      </div>
    </div>
  );
};

export default AdminChat;

