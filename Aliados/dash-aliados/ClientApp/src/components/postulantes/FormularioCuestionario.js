import React, { useEffect, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import Swal from "sweetalert2";
import withReactContent from "sweetalert2-react-content";
import './Formulario.css'
import logoNav from "../../assets/img/logo.png";  // Ajusta la ruta según la ubicación de tu archivo



const FormularioCuestionario = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const cuestionario = location.state?.cuestionario;
  const MySwal = withReactContent(Swal);
  const [preguntas, setPreguntas] = useState([]);
  const [preguntaActual, setPreguntaActual] = useState(0);
  const [respuestas, setRespuestas] = useState({});
  const [cargando, setCargando] = useState(true);
  const [tiempoRestante, setTiempoRestante] = useState(30);
const [idPuesto,setIdPuesto]=useState(null)
const [respuestaSeleccionada, setRespuestaSeleccionada] = useState(null);
    const [respuestaTexto, setRespuestaTexto] = useState("");
    const [cargandoRespuesta, setCargandoRespuesta] = useState(false);
    const [intervaloTemporizador, setIntervaloTemporizador] = useState(null);
    const [respuestasGuardadas, setRespuestasGuardadas] = useState([]);
    const [mostrandoProgreso, setMostrandoProgreso] = useState(false);
    const [progreso, setProgreso] = useState(0);
    const [maxPreguntas, setMaxPreguntas] = useState(0);
    const [cuestionarioFinalizado, setCuestionarioFinalizado] = useState(false);


  useEffect(() => {
    if (!cuestionario) {
      Swal.fire("Error", "No se encontró el cuestionario", "error");
      return;
    }
    confirmarInicio();
    setIdPuesto(cuestionario.idPuesto);

  }, [cuestionario]);

    const enviarRespuesta = async () => {
        const idPregunta = preguntas[preguntaActual].IdPregunta;
        const tipoPregunta = preguntas[preguntaActual].TipoRespuesta;
        const token = sessionStorage.getItem("token");

        let respuestaPayload = {
            token,
            IdPregunta: idPregunta,
            Tipo: tipoPregunta,
        };

        if (tipoPregunta === "Multiple") {
            if (!respuestaSeleccionada) {
                Swal.fire("Advertencia", "Debes seleccionar una respuesta antes de continuar.", "warning");
                return;
            }
            respuestaPayload.IdRespuesta = respuestaSeleccionada;
        } else if (tipoPregunta === "Texto") {
            if (!respuestaTexto.trim()) {
                Swal.fire("Advertencia", "Debes escribir una respuesta antes de continuar.", "warning");
                return;
            }
            respuestaPayload.textorespuesta = respuestaTexto;
        }

        try {
            await fetch("/api/respuestausuario/guardarrespuestapostulante", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify(respuestaPayload),
            });

            setRespuestaSeleccionada(null);
            setRespuestaTexto("");

            if (preguntaActual < preguntas.length - 1) {
                setPreguntaActual((prev) => prev + 1);
                iniciarTemporizador();
            } else {
                Swal.fire("¡Completado!", "Tus respuestas han sido guardadas.", "success");
                navigate("/postulante/inicio");
            }
        } catch (error) {
            console.error("Error enviando respuesta:", error);
            Swal.fire("Error", "No se pudo enviar la respuesta.", "error");
        }
    };

  // 🔹 Confirmación antes de comenzar el cuestionario
  const confirmarInicio = async () => {
    const resultado = await Swal.fire({
        title: '<span style="font-size: 1.5rem; font-weight: 700">¿ESTÁS SEGURO DE COMENZAR?</span>',
        html: `
          <p style="margin-top: 1em; font-size: 1rem;">
            Una vez que empieces el cuestionario tendrás <strong>un tiempo determinado</strong> por pregunta
          </p>
          <p style="color: #EA6A6A; font-size: 0.9rem; margin-top: 0.5em;">
            * No podrás salir del cuestionario o este se cerrará
          </p>
        `,
        iconHtml: '<div style="background-color: #C7D301; color: white; border-radius: 50%; width: 80px; height: 80px; display: flex; align-items: center; justify-content: center; font-size: 42px;">!</div>',
        customClass: {
          popup: 'custom-alert-popup',
          confirmButton: 'custom-confirm-button',
          cancelButton: 'custom-cancel-button'
        },
        showCancelButton: true,
        confirmButtonText: "Sí, comenzar",
        cancelButtonText: "Aún no",
        buttonsStyling: false,
        backdrop: true
      });
    
    if (resultado.isConfirmed) {
      iniciarCuestionario();
    } else {
      navigate("/postulante/inicio");
    }
  };

  // 🔹 Iniciar cuestionario y bloquear navegación
  const iniciarCuestionario = () => {
    obtenerPreguntas(cuestionario.id);

    // Bloquear botón "Atrás"
    window.history.pushState(null, "", window.location.href);
    window.addEventListener("popstate", bloquearNavegacion);

    // Activar pantalla completa
    if (document.documentElement.requestFullscreen) {
      document.documentElement.requestFullscreen();
    }
    registrarPostulanteCuestionario()
    iniciarTemporizador();

  };
  const registrarPostulanteCuestionario = async () => {
    try {
      const token = sessionStorage.getItem("token");
      const response = await fetch("/api/postulantecuestionario/crearcuestionariopostulante", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          token: token,
          IdCuestionario: cuestionario.id,
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        Swal.fire("Error", data.message || "No se pudo registrar la postulación.", "error");
        navigate("/postulante/inicio");
        return;
      }

    //  console.log("Postulación creada:", data);
    } catch (error) {
      console.error("Error registrando postulación:", error);
      Swal.fire("Error", "No se pudo registrar la postulación.", "error");
      navigate("/postulante/inicio");
    }
  };

  const bloquearNavegacion = () => {
    window.history.pushState(null, "", window.location.href);
  };

  // 🔹 Obtener preguntas desde la API
    const obtenerPreguntas = async (idCuestionario) => {
        try {
            const token = sessionStorage.getItem("token");
            const response = await fetch("/api/preguntas/obtenerpreguntaporcuestionarioidpostulante", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ token: token, IdCuestionario: idCuestionario }),
            });

            if (!response.ok) throw new Error("Error al obtener preguntas");

            const data = await response.json();
        /*    console.log("Preguntas recibidas:", data);*/

            if (!Array.isArray(data) || data.length === 0) {
                Swal.fire("Sin preguntas", "Este cuestionario no tiene preguntas aún.", "info");
                return;
            }

            // 🔹 Obtener el número máximo de preguntas permitidas
            const maxPreguntas = data[0]?.MaxPreguntas || data.length;

            // 🔹 Limitar el número de preguntas al máximo permitido
            const preguntasLimitadas = data.slice(0, maxPreguntas);

            // 🔹 Normalizar la estructura de las preguntas
            const preguntasNormalizadas = preguntasLimitadas.map((pregunta) => ({
                IdPregunta: pregunta.IdPregunta,
                TextoPregunta: pregunta.TextoPregunta,
                TipoRespuesta: pregunta.TipoRespuesta,
                TiempoRespuesta: pregunta.TiempoRespuesta,
                IdCuestionario: pregunta.IdCuestionario,
                respuestas: pregunta.TipoRespuesta === "Multiple" ? [
                    { id: pregunta.IdRespuesta1, texto: pregunta.Respuesta1, esCorrecta: pregunta.EsCorrecta1 },
                    { id: pregunta.IdRespuesta2, texto: pregunta.Respuesta2, esCorrecta: pregunta.EsCorrecta2 },
                    { id: pregunta.IdRespuesta3, texto: pregunta.Respuesta3, esCorrecta: pregunta.EsCorrecta3 },
                    { id: pregunta.IdRespuesta4, texto: pregunta.Respuesta4, esCorrecta: pregunta.EsCorrecta4 },
                ].filter((resp) => resp.id !== undefined) : [],
            }));

            setPreguntas(preguntasNormalizadas);
            setMaxPreguntas(maxPreguntas); // 🔹 AGREGADO AQUÍ
            setCargando(false);
            iniciarTemporizador();
        } catch (error) {
            console.error("Error obteniendo preguntas:", error);
            Swal.fire("Error", "No se pudieron cargar las preguntas", "error");
        }
    };




  // 🔹 Temporizador de 30 segundos por pregunta
    // Modificar `iniciarTemporizador` para usar `TiempoRespuesta` dinámicamente
    const iniciarTemporizador = () => {
        if (preguntaActual >= preguntas.length) return; // 🔹 No inicia el temporizador si ya estamos en la última pregunta

        if (intervaloTemporizador) clearInterval(intervaloTemporizador);

        const tiempoPregunta = preguntas[preguntaActual]?.TiempoRespuesta || 30;
        setTiempoRestante(tiempoPregunta);

        const intervalo = setInterval(() => {
            setTiempoRestante((prev) => {
                if (prev === 1) {
                    clearInterval(intervalo);
                    setIntervaloTemporizador(null);

                    if (preguntaActual < preguntas.length - 1) {
                        setPreguntaActual((prev) => prev + 1);
                        iniciarTemporizador();
                    } else {
                        finalizarCuestionario(); // 🔹 Si es la última pregunta, finaliza
                    }
                    return 0;
                }
                return prev - 1;
            });
        }, 1000);

        setIntervaloTemporizador(intervalo);
    };



  // 🔹 Manejar respuestas del usuario
    const finalizarCuestionario = async (respuestasFinales) => {
        const token = sessionStorage.getItem("token");

        if (mostrandoProgreso) return; // 🔹 Evita múltiples ejecuciones
        setMostrandoProgreso(true);

        try {
            const maxPreguntas = respuestasFinales.length;
            const progresoUnitario = 100 / (maxPreguntas + 1);
            setProgreso(0);

           /* console.log("Respuestas a enviar:", respuestasFinales);*/

            for (let i = 0; i < respuestasFinales.length; i++) {
                const respuesta = respuestasFinales[i];
                const respuestaPayload = {
                    token: token,
                    IdPregunta: respuesta.IdPregunta,
                    IdRespuesta: respuesta.IdRespuesta || null,
                    Tipo: respuesta.Tipo,
                    textorespuesta: respuesta.textorespuesta || null,
                };

                const response = await fetch("/api/respuestausuario/guardarrespuestapostulante", {
                    method: "POST",
                    headers: { "Content-Type": "application/json" },
                    body: JSON.stringify(respuestaPayload),
                });

                if (!response.ok) {
                    throw new Error(`Error al enviar la respuesta de la pregunta ${respuesta.IdPregunta}`);
                }

                setProgreso((prev) => prev + progresoUnitario);
            }

            const responseFinalizar = await fetch("/api/postulantecuestionario/finalizarcuestionario", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({
                    token: token,
                    IdCuestionario: cuestionario.id,
                }),
            });

            if (!responseFinalizar.ok) {
                throw new Error("Error al finalizar el cuestionario");
            }

            setProgreso(100);

            setTimeout(() => {
                setMostrandoProgreso(false);
                Swal.fire("¡Cuestionario finalizado!", "Tus respuestas han sido enviadas correctamente.", "success");
                navigate("/postulante/inicio")
            }, 1000);

        } catch (error) {
            console.error("Error en el proceso de finalización:", error);
            setMostrandoProgreso(false);
            Swal.fire("Error", "Hubo un problema al enviar las respuestas o finalizar el cuestionario.", "error");
        }
    };







    const registrarRespuesta = () => {
        if (preguntaActual >= maxPreguntas) return; // 🔹 Evita avanzar más allá del máximo permitido

        const idPregunta = preguntas[preguntaActual].IdPregunta;
        const tipoPregunta = preguntas[preguntaActual].TipoRespuesta;

        let nuevaRespuesta = {
            IdPregunta: idPregunta,
            Tipo: tipoPregunta,
        };

        if (tipoPregunta === "Multiple") {
            if (!respuestaSeleccionada) {
                Swal.fire("Advertencia", "Debes seleccionar una respuesta antes de continuar.", "warning");
                return;
            }
            nuevaRespuesta.IdRespuesta = respuestaSeleccionada;
        } else if (tipoPregunta === "Texto") {
            if (!respuestaTexto.trim()) {
                Swal.fire("Advertencia", "Debes escribir una respuesta antes de continuar.", "warning");
                return;
            }
            nuevaRespuesta.textorespuesta = respuestaTexto;
        }

        setRespuestasGuardadas((prev) => {
            const nuevasRespuestas = [...prev, nuevaRespuesta];

            // 🔹 Si es la última pregunta, aseguramos que la última respuesta esté en el array antes de finalizar
            if (preguntaActual + 1 === maxPreguntas) {
                setTimeout(() => finalizarCuestionario(nuevasRespuestas), 300);
            } else {
                setPreguntaActual((prev) => prev + 1);
                iniciarTemporizador();
            }

            return nuevasRespuestas; // 🔹 Retornamos el array actualizado para que React lo registre correctamente
        });

        setRespuestaSeleccionada(null);
        setRespuestaTexto("");
    };


  // 🔹 Detectar si el usuario minimiza o sale del modo completo
  useEffect(() => {
    const verificarPantallaCompleta = () => {
      if (!document.fullscreenElement) {
        Swal.fire("Formulario finalizado", "No puedes minimizar la pantalla. Tus respuestas han sido enviadas.", "error").then(() => {
          enviarRespuesta();
        });
      }
    };

    document.addEventListener("fullscreenchange", verificarPantallaCompleta);
    return () => document.removeEventListener("fullscreenchange", verificarPantallaCompleta);
  }, []);

  if (cargando) return <h3 className="text-center mt-4">Cargando preguntas...</h3>;

 


  const preguntaActualObj = preguntas[preguntaActual] || {};
  const respuestasPregunta = preguntaActualObj.respuestas || [];

    return (
        <section className="container-fluid d-flex justify-content-center align-items-center bg-light">
            {mostrandoProgreso && (
                <div className="modal d-block" style={{ backgroundColor: "rgba(0, 0, 0, 0.5)" }}>
                    <div className="modal-dialog modal-dialog-centered">
                        <div className="modal-content">
                            <div className="modal-header">
                                <h5 className="modal-title">Guardando respuestas...</h5>
                            </div>
                            <div className="modal-body">
                                <div className="progress">
                                    <div
                                        className="progress-bar progress-bar-striped progress-bar-animated"
                                        role="progressbar"
                                        style={{ width: `${progreso}%` }}
                                        aria-valuenow={progreso}
                                        aria-valuemin="0"
                                        aria-valuemax="100"
                                    ></div>
                                </div>
                                <p className="mt-3 text-center">{Math.round(progreso)}% completado</p>
                            </div>
                        </div>
                    </div>
                </div>
            )}

            {/* Contenedor principal */}
            <div className="main-container">
                {/* Contenedor para logo, barra y nombre */}
                <div className="header-container-zoco">
                    <img src={logoNav} alt="Logo" className="logo-zoco" />
                    <div className="bar-vertical-zoco"></div>
                    <h2 className="zoco-title my-4">{cuestionario?.nombre || "Cuestionario"}</h2>
                </div>

                {/* Contenedor de la carta (formulario) */}
                <div className="card-form">
                    {preguntaActual < maxPreguntas ? (
                        <>
                            <h5>Pregunta {preguntaActual + 1} de {maxPreguntas}</h5>
                            <p>{preguntaActualObj.TextoPregunta || "Pregunta no disponible"}</p>
                            <p className="text-danger">Tiempo restante: {tiempoRestante} segundos</p>

                            {/* 🔹 Preguntas de selección múltiple */}
                            {preguntaActualObj.TipoRespuesta === "Multiple" && (
                                respuestasPregunta.map((respuesta) => (
                                    <div key={respuesta.id} className="form-check">
                                        <input
                                            className="form-check-input"
                                            type="radio"
                                            name="respuesta"
                                            value={respuesta.id}
                                            onChange={() => setRespuestaSeleccionada(respuesta.id)}
                                        />
                                        <label className="form-check-label">{respuesta.texto}</label>
                                    </div>
                                ))
                            )}

                            {/* 🔹 Preguntas de tipo texto */}
                            {preguntaActualObj.TipoRespuesta === "Texto" && (
                                <div className="form-group">
                                    <label htmlFor="respuestaTexto">Escribe tu respuesta:</label>
                                    <textarea
                                        id="respuestaTexto"
                                        className="form-control"
                                        value={respuestaTexto}
                                        onChange={(e) => setRespuestaTexto(e.target.value)}
                                        placeholder="Escribe aquí tu respuesta..."
                                    />
                                </div>
                            )}

                            <button
                                className="btn btn-primary mt-3"
                                onClick={registrarRespuesta}
                                disabled={cargandoRespuesta}
                            >
                                {cargandoRespuesta ? (
                                    <>
                                        <span className="spinner-border spinner-border-sm me-2" role="status" aria-hidden="true"></span>
                                        Guardando...
                                    </>
                                ) : (
                                    "Siguiente"
                                )}
                            </button>
                        </>
                    ) : (
                        <h3 className="text-center text-success">Cuestionario Finalizado</h3>
                    )}
                </div>
            </div>
        </section>



    );


};

export default FormularioCuestionario;
