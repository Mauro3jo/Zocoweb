import React, { useEffect, useState } from "react";
import { Modal, Spinner } from "react-bootstrap";
import { useForm } from "react-hook-form";
import Swal from "sweetalert2";

const ModalEditarPreguntas = ({ show, onHide, cuestionario }) => {
  const { handleSubmit, reset } = useForm();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [preguntas, setPreguntas] = useState([]);
  const [preguntaActual, setPreguntaActual] = useState(null);
  const [respuestas, setRespuestas] = useState([]);

  // 🔹 Cargar preguntas al abrir el modal
  useEffect(() => {
    if (show && cuestionario) {
      const token = sessionStorage.getItem("token");

      fetch("/api/preguntas/obtenerpreguntaporcuestionarioid", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          token: token,
          IdCuestionario: cuestionario.id,
        }),
      })
        .then((res) => res.json())
        .then((data) => {
          if (Array.isArray(data) && data.length > 0) {
            const preguntasFormateadas = data.map((pregunta) => ({
              id: pregunta.id,
              texto: pregunta.textoPregunta,
              tipo: pregunta.tipoRespuesta,
              tiempo: pregunta.tiempoRespuesta,
            }));

            setPreguntas(preguntasFormateadas);
            setPreguntaActual({ ...preguntasFormateadas[0] }); // ✅ Se clona el objeto correctamente
            obtenerRespuestas(preguntasFormateadas[0]?.id);
          } else {
            setPreguntas([]);
            setPreguntaActual(null);
            setRespuestas([]);
          }
        })
        .catch((error) => console.error("Error cargando preguntas:", error));
    }
  }, [show, cuestionario]);

  // 🔎 Obtener respuestas de una pregunta
  const obtenerRespuestas = (idPregunta) => {
    const token = sessionStorage.getItem("token");

    fetch("/api/respuestas/obtenerrespuestasporpreguntaid", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        token: token,
        IdPregunta: idPregunta,
      }),
    })
      .then((res) => res.json())
      .then((data) => {
        if (Array.isArray(data)) {
          setRespuestas(data.map((r) => ({
            id: r.id,
            texto: r.respuestaTexto,
            esCorrecta: r.esCorrecta,
          })));
        } else {
          setRespuestas([]);
        }
      })
      .catch((error) => console.error("Error obteniendo respuestas:", error));
  };

  // 🔹 Manejar cambios en los campos de la pregunta actual
  const handlePreguntaChange = (key, value) => {
    if (preguntaActual) {
      setPreguntaActual((prevPregunta) => ({
        ...prevPregunta,
        [key]: value, // ✅ Modificar el valor sin perder la referencia
      }));
    }
  };

  // 🔹 Manejar cambios en las respuestas
  const handleRespuestaChange = (index, key, value) => {
    const nuevasRespuestas = [...respuestas];
    nuevasRespuestas[index] = { ...nuevasRespuestas[index], [key]: value };
    setRespuestas(nuevasRespuestas);
  };

  // ➕ Agregar nueva respuesta
  const agregarRespuesta = () => {
    setRespuestas([...respuestas, { id: null, texto: "", esCorrecta: false }]);
  };

  // 🗑 Eliminar respuesta
    // 🗑 Eliminar respuesta con llamada a la API
    const eliminarRespuesta = async (index) => {
        const respuestaAEliminar = respuestas[index]; // Obtener la respuesta a eliminar
        const token = sessionStorage.getItem("token");

        if (respuestaAEliminar.id) {
            try {
                const response = await fetch("/api/respuestas/eliminarrespuesta", {
                    method: "DELETE",
                    headers: {
                        "Content-Type": "application/json",
                    },
                    body: JSON.stringify({
                        token: token,
                        Id: respuestaAEliminar.id, // Enviar el ID de la respuesta a eliminar
                    }),
                });

                if (!response.ok) {
                    console.error("Error eliminando respuesta:", await response.text());
                    Swal.fire("Error", "No se pudo eliminar la respuesta", "error");
                    return;
                }

                Swal.fire("¡Eliminada!", "Respuesta eliminada con éxito", "success");
            } catch (error) {
                console.error("Error en la petición de eliminación:", error);
                Swal.fire("Error", "Hubo un problema al eliminar la respuesta", "error");
                return;
            }
        }

        // Filtrar la respuesta eliminada del estado local
        setRespuestas(respuestas.filter((_, i) => i !== index));
    };


  // 🔹 Enviar actualización de pregunta y respuestas a la API
  const enviarEdiciones = async () => {
    if (!preguntaActual) return;
    setIsSubmitting(true);
    const token = sessionStorage.getItem("token");

    try {
      // Guardar pregunta
      const response = await fetch("/api/preguntas/editarpregunta", {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          token: token,
          Id: preguntaActual.id,
          IdCuestionario: cuestionario.id,
          TextoPregunta: preguntaActual.texto,
          TipoRespuesta: preguntaActual.tipo,
          TiempoRespuesta: preguntaActual.tiempo,
        }),
      });
      
      if (response.ok) {
        Swal.fire("¡Guardado!", "Pregunta actualizada con éxito", "success");
      
        // Guardar respuestas si la pregunta es de opción múltiple
        if (preguntaActual.tipo === "Multiple") {
          for (const respuesta of respuestas) {
            if (respuesta.texto.trim() !== "") {
              const url = respuesta.id
                ? "/api/respuestas/editarrespuesta" // ✅ PUT para actualizar
                : "/api/respuestas/crearrespuesta"; // ✅ POST para agregar nueva
      
              const metodo = respuesta.id ? "PUT" : "POST"; // ✅ Diferencia entre editar y crear
      
              try {
                await fetch(url, {
                  method: metodo,
                  headers: {
                    "Content-Type": "application/json",
                  },
                  body: JSON.stringify({
                    token: token,
                    IdPregunta: preguntaActual.id,
                    Id: respuesta.id || undefined, // ✅ Solo enviar `Id` si existe (PUT)
                    RespuestaTexto: respuesta.texto,
                    EsCorrecta: respuesta.esCorrecta,
                  }),
                });
              } catch (error) {
                console.error(`Error en la petición (${metodo}):`, error);
              }
            }
          }
        }
      } else {
        console.error("Error editando pregunta:", await response.text());
      }
      
    } catch (error) {
      console.error("Error en la petición:", error);
    }

    setIsSubmitting(false);
    reset();
    onHide();
  };
    const eliminarPregunta = async () => {
        if (!preguntaActual) return;

        const token = sessionStorage.getItem("token");

        // Confirmación antes de eliminar
        const confirmacion = await Swal.fire({
            title: "¿Estás seguro?",
            text: "Se eliminarán la pregunta y sus respuestas asociadas.",
            icon: "warning",
            showCancelButton: true,
            confirmButtonColor: "#d33",
            cancelButtonColor: "#3085d6",
            confirmButtonText: "Sí, eliminar",
            cancelButtonText: "Cancelar",
        });

        if (!confirmacion.isConfirmed) return;

        try {
            const response = await fetch("/api/preguntas/eliminarpregunta", {
                method: "DELETE",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify({
                    token: token,
                    Id: preguntaActual.id, // Enviar el ID de la pregunta a eliminar
                }),
            });

            if (!response.ok) {
                console.error("Error eliminando pregunta:", await response.text());
                Swal.fire("Error", "No se pudo eliminar la pregunta", "error");
                return;
            }

            Swal.fire("¡Eliminada!", "Pregunta eliminada con éxito", "success");

            // Eliminar la pregunta de la lista de preguntas
            const nuevasPreguntas = preguntas.filter(p => p.id !== preguntaActual.id);
            setPreguntas(nuevasPreguntas);

            // Si hay más preguntas, selecciona la primera. Si no, limpia todo.
            if (nuevasPreguntas.length > 0) {
                setPreguntaActual({ ...nuevasPreguntas[0] });
                obtenerRespuestas(nuevasPreguntas[0].id);
            } else {
                setPreguntaActual(null);
                setRespuestas([]);
            }

        } catch (error) {
            console.error("Error en la petición de eliminación:", error);
            Swal.fire("Error", "Hubo un problema al eliminar la pregunta", "error");
        }
    };

    return (
        <Modal show={show} onHide={onHide} centered size="lg">
            <Modal.Body>
                <h6 className="text-center">Editar Preguntas del Cuestionario</h6>

                {/* 🔽 Selector de Preguntas */}
                <div className="mb-3">
                    <label className="fs-16">Seleccionar Pregunta</label>
                    <select
                        className="form-select"
                        onChange={(e) => {
                            const idSeleccionado = parseInt(e.target.value, 10);
                            const preguntaSeleccionada = preguntas.find((p) => p.id === idSeleccionado);
                            setPreguntaActual({ ...preguntaSeleccionada }); // ✅ Se clona el objeto correctamente
                            obtenerRespuestas(preguntaSeleccionada.id);
                        }}
                        value={preguntaActual ? preguntaActual.id : ""}
                    >
                        {preguntas.map((p) => (
                            <option key={p.id} value={p.id}>
                                {p.texto}
                            </option>
                        ))}
                    </select>
                </div>

                {/* 📝 Formulario de edición */}
                {preguntaActual && (
                    <form onSubmit={handleSubmit(enviarEdiciones)}>
                        <div className="mb-3">
                            <label className="fs-16">Pregunta</label>
                            <input
                                className="form-control"
                                type="text"
                                value={preguntaActual.texto}
                                onChange={(e) => handlePreguntaChange("texto", e.target.value)}
                            />
                        </div>

                        {/* Respuestas */}
                        {preguntaActual.tipo === "Multiple" && (
                            <div className="mt-3">
                                <label className="fs-16">Respuestas</label>
                                {respuestas.map((respuesta, index) => (
                                    <div key={index} className="d-flex align-items-center mb-2">
                                        <input
                                            className="form-control"
                                            type="text"
                                            value={respuesta.texto}
                                            onChange={(e) => handleRespuestaChange(index, "texto", e.target.value)}
                                        />
                                        <input
                                            className="form-check-input mx-2"
                                            type="checkbox"
                                            checked={respuesta.esCorrecta}
                                            onChange={(e) => handleRespuestaChange(index, "esCorrecta", e.target.checked)}
                                        />
                                        <button type="button" className="btn btn-danger btn-sm" onClick={() => eliminarRespuesta(index)}>❌</button>
                                    </div>
                                ))}
                                {/* Botones de agregar respuesta y eliminar pregunta */}
                                <div className="d-flex">
                                    <button type="button" className="btn btn-success btn-sm mt-2" onClick={agregarRespuesta}>
                                        ➕ Agregar Respuesta
                                    </button>
                                    {/* <button type="button" className="btn btn-danger btn-sm mt-2 mx-2"
                                    onClick={eliminarRespuesta}
                                    >
                                        🗑 Eliminar Respuesta
                                    </button> */}
                                </div>
                                <div>
                                
                                </div>
                            </div>
                        )}

                        <button className="btn btn-primary mt-3" type="submit" disabled={isSubmitting}>
                            {isSubmitting ? <Spinner animation="border" size="sm" /> : "Guardar Cambios"}
                        </button>
                        <button type="button" className="btn btn-danger btn-sm mt-3 " onClick={eliminarPregunta}>
                                        🗑 Eliminar Pregunta
                                    </button>
                    </form>
                )}
            </Modal.Body>
        </Modal>
    );

};

export default ModalEditarPreguntas;
