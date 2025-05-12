import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';

const Cuestionario = () => {
    const [respuestas, setRespuestas] = useState({});
    const [tiempoRestante, setTiempoRestante] = useState(60);
    const [preguntaActual, setPreguntaActual] = useState(0);
    const [enviado, setEnviado] = useState(false);
    const navigate = useNavigate();
    
    const preguntas = [
        { id: 1, texto: "¿Cuál es tu nivel de experiencia en React?", opciones: ["Principiante", "Intermedio", "Avanzado"] },
        { id: 2, texto: "¿Cuál es tu lenguaje de programación favorito?", opciones: ["JavaScript", "Python", "C#", "Java"] },
        { id: 3, texto: "¿Te gustaría trabajar en frontend o backend?", opciones: ["Frontend", "Backend", "Fullstack"] }
    ];

    useEffect(() => {
        const temporizador = setInterval(() => {
            setTiempoRestante((prev) => {
                if (prev === 1) {
                    avanzarPregunta();
                    return 60;
                }
                return prev - 1;
            });
        }, 1000);

        const handleVisibilityChange = () => {
            if (document.hidden) {
                alert("No puedes cambiar de pestaña. El cuestionario se enviará automáticamente.");
                enviarRespuestas();
            }
        };

        const bloquearNavegacion = (event) => {
            event.preventDefault();
            event.returnValue = "No puedes salir durante el cuestionario.";
        };

        document.addEventListener("visibilitychange", handleVisibilityChange);
        window.addEventListener("beforeunload", bloquearNavegacion);

        return () => {
            clearInterval(temporizador);
            document.removeEventListener("visibilitychange", handleVisibilityChange);
            window.removeEventListener("beforeunload", bloquearNavegacion);
        };
    }, []);

    const manejarCambio = (id, valor) => {
        setRespuestas({ ...respuestas, [id]: valor });
    };

    const avanzarPregunta = () => {
        if (preguntaActual < preguntas.length - 1) {
            setPreguntaActual(preguntaActual + 1);
            setTiempoRestante(60);
        } else {
            enviarRespuestas();
        }
    };

    const enviarRespuestas = () => {
        if (!enviado) {
            const respuestasFinales = preguntas.reduce((acc, pregunta) => {
                acc[pregunta.id] = respuestas[pregunta.id] || null;
                return acc;
            }, {});
            console.log("Respuestas enviadas:", respuestasFinales);
            alert("Respuestas enviadas correctamente");
            setEnviado(true);
            navigate("/");
        }
    };

    return (
        <section className='container'>
            <h2>Cuestionario</h2>
            <p>Tiempo restante: {tiempoRestante} segundos</p>
            <form>
                <div className='pregunta'>
                    <h4>{preguntas[preguntaActual].texto}</h4>
                    {preguntas[preguntaActual].opciones.map((opcion) => (
                        <label key={opcion} className='opcion'>
                            <input
                                type='radio'
                                name={`pregunta-${preguntas[preguntaActual].id}`}
                                value={opcion}
                                onChange={() => manejarCambio(preguntas[preguntaActual].id, opcion)}
                            />
                            {opcion}
                        </label>
                    ))}
                </div>
                <button type='button' onClick={avanzarPregunta} className='btn-enviar'>Siguiente</button>
            </form>
        </section>
    );
};

export default Cuestionario;
