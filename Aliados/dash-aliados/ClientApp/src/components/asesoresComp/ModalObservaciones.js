import React, { useState, useContext, useEffect } from "react";
import { Modal, Form, Button, Col, Row } from "react-bootstrap";
import { DarkModeContext } from "../../context/DarkModeContext";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faXmark } from "@fortawesome/free-solid-svg-icons";

const ModalObservaciones = ({
  show,
  onHide,
  idAsesor,
  observacion,
  observacionAdmin,
  calificacion,
  motivo,
  cantidadRollos,
}) => {
  const { darkMode } = useContext(DarkModeContext);
  const [comentario, setComentario] = useState(observacionAdmin);
  const [estadoAprobado, setEstadoAprobado] = useState(calificacion);
  const [selectedMotivos, setSelectedMotivos] = useState([]);
  const [data, setData] = useState(null); // Estado para almacenar el tipo de usuario (data)
  console.log(data);
  const motivos = [
    "No sigue check obligatoria",
    "No envía mail a ABM",
    "No adjunta documentación correcta/Completa",
    "Grabación sin Contenido de la visita",
    "Documentación Incompleta/Incorrecta",
    "Motivo de Visita Incorrecto",
    "Tecnico/Service innecesario",
    "Audio Incorrecto",
    "No Fideliza",
    "No Carga Foto de Terminal",
  ];
  const apiUrlToken = process.env.REACT_APP_API_TOKEN;

  // Función para verificar el token y obtener el tipo de usuario
  useEffect(() => {
    const verificarToken = async () => {
      const token = sessionStorage.getItem("token");
      if (!token) {
        return;
      }

      try {
        const response = await fetch(apiUrlToken, {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ Token: token }),
        });

        if (response.ok) {
          const result = await response.json();
          setData(result); // Guardamos el valor de data
        }
      } catch (error) {
        console.error("Error al verificar el token: ", error);
      }
    };

    if (show) {
      verificarToken(); // Llamamos a la función solo cuando se abre el modal
    }
  }, [show]);

  const handleMotivoChange = (event) => {
    const { value, checked } = event.target;
    if (checked) {
      setSelectedMotivos((prev) => [...prev, value]);
      setComentario((prev) => (prev ? `${prev}, ${value}` : value));
    } else {
      setSelectedMotivos((prev) => prev.filter((motivo) => motivo !== value));
      setComentario((prev) =>
        prev
          .replace(`, ${value}`, "")
          .replace(`${value}, `, "")
          .replace(value, "")
      );
    }
  };

  const handleSubmit = async (event) => {
    event.preventDefault();

    const token = sessionStorage.getItem("token");
    const calificoString = estadoAprobado ? "true" : "false";

    try {
      const response = await fetch("/api/geo/agregarobservacionadmin", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          Id: idAsesor,
          Califico: calificoString,
          ObservacionAdmin: comentario,
          Token: token,
        }),
      });

      if (!response.ok) {
        throw new Error("Error al enviar los datos");
      }

      onHide();
    } catch (error) {
      console.error("Hubo un error al enviar los datos: ", error);
    }
  };

  const handleEstadoChange = (e) => {
    const esAprobado = e.target.value === "true";
    setEstadoAprobado(esAprobado);
  };

  return (
    <Modal
      show={show}
      onHide={onHide}
      centered
      aria-labelledby="modal-observaciones"
    >
      <Modal.Body className={darkMode ? "text-white bg-dark" : "text-dark"}>
        <section className="d-flex justify-content-between my-4">
          <div className="ocultar-div"></div>
          <div className="d-flex justify-content-center">
            <h6 className="fs-18 lato-bold">Observaciones</h6>
          </div>
          <div>
            <button className="border-0 btn-filtro-cruz" onClick={onHide}>
              <FontAwesomeIcon className="fs-18" icon={faXmark} />
            </button>
          </div>
        </section>

        <section className="mb-2">
          <h6 className="fs-16">Motivo</h6>
          <h6 className="fs-14">
            {motivo === null ? <>No hay motivo especificado</> : <>{motivo}</>}
          </h6>
        </section>
        <section className="mb-2">
          <h6 className="fs-16">Observaciones del gestor</h6>
          <h6 className="fs-14">
            {observacion === null ? (
              <>No hay observaciones realizadas</>
            ) : (
              <>{observacion}</>
            )}
          </h6>
        </section>
        <section className="mb-2">
          <h6 className="fs-16">Cantidad de Rollos</h6>
          <h6 className="fs-14">
            {cantidadRollos === null ? (
              <>No especificado</>
            ) : (
              <>{cantidadRollos}</>
            )}
          </h6>
        </section>

        {data === 3 && (
          <section className="mt-2">
            <h6 className="fs-16">Motivos</h6>
            {motivos.map((motivo, index) => (
              <Form.Check
                key={index}
                type="checkbox"
                label={motivo}
                value={motivo}
                checked={selectedMotivos.includes(motivo)}
                onChange={handleMotivoChange}
                className="mb-2"
              />
            ))}
          </section>
        )}

        <section className="mt-2">
        {data === 3 && (<h6 className="fs-16">Observaciones Auditor</h6>)}
          <Form onSubmit={handleSubmit}>
            {data === 3 && (
              <Row>
                <Form.Group as={Col} md="6" className="mb-3">
                  <Form.Check
                    required
                    type="radio"
                    label="Desaprobado"
                    name="estado"
                    id="Desaprobado"
                    feedbackType="invalid"
                    value="false"
                    onChange={handleEstadoChange}
                    checked={estadoAprobado === false}
                  />
                </Form.Group>
                <Form.Group as={Col} md="6" className="mb-3">
                  <Form.Check
                    required
                    type="radio"
                    label="Aprobado"
                    feedbackType="invalid"
                    id="Aprobado"
                    name="estado"
                    value="true"
                    onChange={handleEstadoChange}
                    checked={estadoAprobado === true}
                  />
                </Form.Group>
              </Row>
            )}

            {data === 3 ? (
              <Form.Group className="mb-3" controlId="formComentario">
                <Form.Control
                  as="textarea"
                  rows={3}
                  value={comentario}
                  onChange={(e) => setComentario(e.target.value)}
                  placeholder="Escribe tu comentario aquí..."
                  required
                />
              </Form.Group>
            ) : (
              <div className="mb-3">
                <h6 className="fs-16">Comentario del auditor</h6>
                <p className="fs-14">
                  {comentario ? comentario : "No hay comentarios disponibles"}
                </p>
              </div>
            )}

            {/* Solo mostrar el botón de enviar si `data` es igual a 3 */}
            {data === 3 && (
              <div className="d-flex justify-content-end">
                <Button
                  className={
                    darkMode
                      ? "btn-guardar-modal-configuraciones border-0 lato-bold text-dark"
                      : "btn-guardar-modal-configuraciones border-0 lato-bold text-white"
                  }
                  type="submit"
                >
                  Enviar
                </Button>
              </div>
            )}
          </Form>
        </section>
      </Modal.Body>
    </Modal>
  );
};

export default ModalObservaciones;
