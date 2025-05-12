import React, { useEffect, useState, useContext } from "react";
import { useLocation } from "react-router-dom";
import { Modal, Button } from "react-bootstrap";
import { DarkModeContext } from "../../context/DarkModeContext";
import "./ReclutamientoPostulantesCuestionarios.css";
import Footer from '../../components/Footer';

const ReclutamientoPostulantesCuestionarios = () => {
    const location = useLocation();
    const puestoId = location.state?.puestoId;
    const { darkMode } = useContext(DarkModeContext);

    const [postulantes, setPostulantes] = useState([]);
    const [postulanteSeleccionado, setPostulanteSeleccionado] = useState(null);
    const [cuestionarioSeleccionado, setCuestionarioSeleccionado] = useState(null);
    const [showModal, setShowModal] = useState(false);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        const obtenerPostulantes = async () => {
            try {
                const token = sessionStorage.getItem("token");
                if (!token) {
                    throw new Error("No se encontró el token en sessionStorage");
                }

                const response = await fetch("/api/puesto/resultadospostulantes", {
                    method: "POST",
                    headers: { "Content-Type": "application/json" },
                    body: JSON.stringify({ id: parseInt(puestoId), token: token }),
                });

                if (!response.ok) {
                    throw new Error("Error al obtener los postulantes");
                }

                const data = await response.json();
                setPostulantes(data || []);
            } catch (error) {
                console.error("Error:", error);
                setError(error.message);
            } finally {
                setLoading(false);
            }
        };

        if (puestoId) {
            obtenerPostulantes();
        }
    }, [puestoId]);

    const abrirModalCuestionario = (cuestionario) => {
        setCuestionarioSeleccionado({
            ...cuestionario,
            preguntas: cuestionario.preguntas.filter(p => p.respuestasUsuario && p.respuestasUsuario.length > 0)
        });
        setShowModal(true);
    };

    return (
        <section className="container">
            <div className="header-puestos row">
                <article className="col-12 text-center">
                    <h2>Postulantes para el Puesto #{puestoId}</h2>
                </article>
            </div>

            {loading && <p>Cargando postulantes...</p>}
            {error && <p style={{ color: "red" }}>Error: {error}</p>}
            {!loading && !error && postulantes.length === 0 && <p>No hay postulantes para este puesto.</p>}

            <div className="row">
                <article className="col-5">
                    <div className="d-flex justify-content-center">
                        <button className={darkMode ? "bg-data-puestos-dark border-0" : "bg-data-puestos border-0"}>
                            Lista de Postulantes
                        </button>
                    </div>

                    <div className="carta-postulaciones mt-3">
                        {postulantes.map((postulante) => (
                            <div
                                key={postulante.id}
                                className={darkMode ? "cartas-posiciones-dark" : "cartas-posiciones"}
                                onClick={() => setPostulanteSeleccionado(postulante)}
                                style={{ cursor: "pointer", background: "transparent", boxShadow: "none" }}
                            >
                                <h6 className="titulo-cartas">{postulante.nombre}</h6>
                                <p className="texto-cartas">📧 {postulante.correo}</p>
                            </div>
                        ))}
                    </div>
                </article>

                <article className="col-7">
                    <div className={darkMode ? "carta-postulaciones-resultados-dark p-4" : "carta-postulaciones-resultados p-4"}>
                        {postulanteSeleccionado ? (
                            <>
                                <h4>{postulanteSeleccionado.nombre}</h4>
                                <p><strong>Email:</strong> {postulanteSeleccionado.correo}</p>
                                <p><strong>Teléfono:</strong> {postulanteSeleccionado.telefono}</p>
                                <p><strong>Dirección:</strong> {postulanteSeleccionado.direccion}</p>

                                <h5 className="mt-3">📄 Cuestionarios Realizados:</h5>
                                <div className="cuestionarios-container"
                                    style={{ display: "flex", flexWrap: "wrap", gap: "10px", justifyContent: "center" }}>
                                    {postulanteSeleccionado.cuestionarios.map((cuestionario) => {
                                        const preguntasRespondidas = cuestionario.preguntas.filter(p => p.respuestasUsuario && p.respuestasUsuario.length > 0);
                                        const preguntasRespondidasCount = preguntasRespondidas.length;
                                        const totalPreguntas = cuestionario.maxPreguntas;
                                        const cuestionarioUsuario = postulanteSeleccionado?.postulanteCuestionarios?.find(
                                            pc => pc.idCuestionario === cuestionario.id
                                        );

                                        // Obtener la nota (resultado del cuestionario)
                                        const notaObtenida = cuestionarioUsuario?.resultado !== undefined ? cuestionarioUsuario.resultado.toFixed(2) : "Pendiente";

                                        return (
                                            <div key={`cuestionario-${cuestionario.id}`}
                                                className={darkMode ? "cartas-cuestionarios-dark" : "cartas-cuestionarios"}
                                                style={{
                                                    flex: "1 1 calc(50% - 10px)",
                                                    maxWidth: "300px",
                                                    minWidth: "250px",
                                                    textAlign: "center",
                                                    padding: "10px",
                                                    boxSizing: "border-box"
                                                }}>
                                                <h6>📌 {cuestionario.nombre}</h6>
                                                <p><strong>Fecha:</strong> {new Date(cuestionario.fechaCreacion).toLocaleDateString()}</p>
                                                <p><strong>Preguntas Respondidas:</strong> {preguntasRespondidasCount}/{totalPreguntas}</p>
                                                <p><strong>Nota Obtenida:</strong> {notaObtenida}</p>

                                                <button className="btn-ver-cuestionario"
                                                    onClick={() => abrirModalCuestionario(cuestionario)}>
                                                    Ver Cuestionario
                                                </button>
                                            </div>
                                        );
                                    })}
                                </div>
                            </>
                        ) : (
                            <p>Selecciona un postulante para ver detalles.</p>
                        )}
                    </div>
                </article>
            </div>

            <Modal show={showModal} onHide={() => setShowModal(false)} size="lg" centered>
                <Modal.Header closeButton>
                    <Modal.Title>📖 {cuestionarioSeleccionado?.nombre}</Modal.Title>
                </Modal.Header>
                <Modal.Body>
                    <ul>
                        {cuestionarioSeleccionado?.preguntas.map((pregunta) => (
                            <li key={`pregunta-${pregunta.id}`} className="pregunta-item">
                                <p><strong>❓ Pregunta:</strong> {pregunta.textoPregunta}</p>
                                <ul>
                                    {pregunta.respuestas.map((respuesta) => {
                                        const respuestaUsuario = pregunta.respuestasUsuario.find(ru => ru.idRespuesta === respuesta.id);
                                        const estilo = respuesta.esCorrecta ? "respuesta-correcta" : "respuesta-incorrecta";

                                        return (
                                            <li key={`respuesta-${respuesta.id}`} className={respuestaUsuario ? estilo : ""}>
                                                {respuesta.respuestaTexto} {respuesta.esCorrecta && "✅"}
                                                {respuestaUsuario && !respuesta.esCorrecta && "❌"}
                                                {respuestaUsuario && <strong> (Tu respuesta)</strong>}
                                            </li>
                                        );
                                    })}
                                </ul>
                            </li>
                        ))}
                    </ul>
                </Modal.Body>
                <Modal.Footer>
                    <Button variant="secondary" onClick={() => setShowModal(false)}>Cerrar</Button>
                </Modal.Footer>
            </Modal>

            <div className="footer">
                <Footer />
            </div>
        </section>
    );
};

export default ReclutamientoPostulantesCuestionarios;
