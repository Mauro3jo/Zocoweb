import React, { useState } from "react";
import { Modal, Spinner } from "react-bootstrap";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faPlus, faArrowRight, faArrowLeft } from "@fortawesome/free-solid-svg-icons";
import { useForm } from "react-hook-form";
import Swal from "sweetalert2";

const ModalAgregarPreguntas = ({ show, onHide, cuestionario }) => {
  const { handleSubmit, reset } = useForm();
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Estado para preguntas (inicia con una)
  const [preguntas, setPreguntas] = useState([
    { texto: "", tipo: "Texto", tiempo: 30, respuestas: [] },
  ]);

  // Estado para la pregunta actual
  const [preguntaActual, setPreguntaActual] = useState(0);

  // Agregar nueva pregunta (sin límite)
  const agregarPregunta = () => {
    setPreguntas([...preguntas, { texto: "", tipo: "Texto", tiempo: 30, respuestas: [] }]);
    setPreguntaActual(preguntas.length); // Ir a la nueva pregunta
  };

  // Manejar cambios en preguntas
  const handlePreguntaChange = (key, value) => {
    const nuevasPreguntas = [...preguntas];
    nuevasPreguntas[preguntaActual][key] = value;
    setPreguntas(nuevasPreguntas);
  };

  // Agregar respuesta si la pregunta es opción múltiple
  const agregarRespuesta = () => {
    if (preguntas[preguntaActual].tipo === "Multiple") {
      const nuevasPreguntas = [...preguntas];
      nuevasPreguntas[preguntaActual].respuestas.push({ texto: "", esCorrecta: false });
      setPreguntas(nuevasPreguntas);
    }
  };

  // Manejar cambios en respuestas
  const handleRespuestaChange = (index, key, value) => {
    const nuevasPreguntas = [...preguntas];
    nuevasPreguntas[preguntaActual].respuestas[index][key] = value;
    setPreguntas(nuevasPreguntas);
  };

  // Enviar preguntas y respuestas a la API

    const enviarPreguntas = async () => {
      setIsSubmitting(true);
      const token = sessionStorage.getItem("token");
      let preguntasEnviadas = 0;
  
      for (const pregunta of preguntas) {
        if (pregunta.texto.trim() !== "") {
          try {
            const response = await fetch("/api/preguntas/crearpregunta", {
              method: "POST",
              headers: {
                "Content-Type": "application/json",
              },
              body: JSON.stringify({
                token: token,
                IdCuestionario: cuestionario.id,
                TextoPregunta: pregunta.texto,
                TipoRespuesta: pregunta.tipo,
                TiempoRespuesta: pregunta.tiempo,
              }),
            });
  
            if (!response.ok) {
              console.error("Error al enviar pregunta:", await response.text());
            } else {
              const data = await response.json();
              const preguntaId = data.preguntaId;
              preguntasEnviadas++;
  
              // Enviar respuestas si la pregunta es de opción múltiple
              if (pregunta.tipo === "Multiple" && pregunta.respuestas.length > 0) {
                for (const respuesta of pregunta.respuestas) {
                  await fetch("/api/respuestas/crearrespuesta", {
                    method: "POST",
                    headers: {
                      "Content-Type": "application/json",
                    },
                    body: JSON.stringify({
                      token: token,
                      IdPregunta: preguntaId,
                      RespuestaTexto: respuesta.texto,
                      EsCorrecta: respuesta.esCorrecta,
                    }),
                  });
                }
              }
            }
          } catch (error) {
            console.error("Error en la petición:", error);
          }
        }
      }
  
      setIsSubmitting(false);
      reset();
      onHide();
  
      // ✅ Mostrar alerta y recargar pantalla
      if (preguntasEnviadas > 0) {
        Swal.fire({
          icon: "success",
          title: "¡Preguntas Agregadas!",
          text: `Se agregaron ${preguntasEnviadas} pregunta(s) correctamente.`,
          confirmButtonText: "Aceptar",
        }).then(() => {
          window.location.reload();
        });
      }
    };
  

  return (
    <Modal show={show} onHide={onHide} centered size="lg">
      <Modal.Body>
        <h6 className="text-center">Agregar Preguntas al Cuestionario</h6>

        <form onSubmit={handleSubmit(enviarPreguntas)}>
          {/* Pregunta actual */}
          <div className="mb-3">
            <label className="fs-16">Pregunta {preguntaActual + 1}</label>
            <input
              className="form-control"
              type="text"
              value={preguntas[preguntaActual]?.texto || ""}
              onChange={(e) => handlePreguntaChange("texto", e.target.value)}
            />
          </div>

          {/* Tipo de respuesta */}
          <label className="fs-16 mt-2">Tipo de respuesta</label>
          <select
            className="form-select"
            value={preguntas[preguntaActual]?.tipo || "Texto"}
            onChange={(e) => handlePreguntaChange("tipo", e.target.value)}
          >
            <option value="Texto">Texto</option>
            <option value="Multiple">Opción Múltiple</option>
          </select>

          {/* Tiempo de respuesta */}
          <label className="fs-16 mt-2">Tiempo de respuesta (segundos)</label>
          <input
            className="form-control"
            type="number"
            min="5"
            max="300"
            value={preguntas[preguntaActual]?.tiempo || 30}
            onChange={(e) => handlePreguntaChange("tiempo", e.target.value)}
          />

          {/* Respuestas solo para opción múltiple */}
          {preguntas[preguntaActual]?.tipo === "Multiple" && (
            <div className="mt-3">
              <label className="fs-16">Respuestas</label>
              {preguntas[preguntaActual].respuestas.map((respuesta, index) => (
                <div key={index} className="d-flex align-items-center mb-2">
                  <input
                    className="form-control"
                    type="text"
                    placeholder={`Respuesta ${index + 1}`}
                    value={respuesta.texto}
                    onChange={(e) => handleRespuestaChange(index, "texto", e.target.value)}
                  />
                  <input
                    className="form-check-input mx-2"
                    type="checkbox"
                    checked={respuesta.esCorrecta}
                    onChange={(e) => handleRespuestaChange(index, "esCorrecta", e.target.checked)}
                  />
                  <label>Correcta</label>
                </div>
              ))}
              <button type="button" className="btn btn-outline-secondary btn-sm mt-2" onClick={agregarRespuesta}>
                <FontAwesomeIcon icon={faPlus} /> Agregar respuesta
              </button>
            </div>
          )}

          {/* Navegación entre preguntas */}
          <div className="d-flex justify-content-between mt-4">
            <button
              type="button"
              className="btn btn-outline-secondary"
              disabled={preguntaActual === 0}
              onClick={() => setPreguntaActual(preguntaActual - 1)}
            >
              <FontAwesomeIcon icon={faArrowLeft} /> Anterior
            </button>

            <button
              type="button"
              className="btn btn-outline-secondary"
              onClick={agregarPregunta}
            >
              <FontAwesomeIcon icon={faPlus} /> Agregar Pregunta
            </button>

            <button
              type="button"
              className="btn btn-outline-secondary"
              disabled={preguntaActual === preguntas.length - 1}
              onClick={() => setPreguntaActual(preguntaActual + 1)}
            >
              Siguiente <FontAwesomeIcon icon={faArrowRight} />
            </button>
          </div>

          {/* Guardar */}
          <div className="text-center mt-4">
            <button className="btn btn-primary" type="submit" disabled={isSubmitting}>
              {isSubmitting ? <Spinner animation="border" size="sm" /> : "Guardar"}
            </button>
          </div>
        </form>
      </Modal.Body>
    </Modal>
  );
};

export default ModalAgregarPreguntas;
