import React, { useEffect, useState } from "react";

const NotificadorAdmin = () => {
  const [comentariosTodos, setComentariosTodos] = useState([]);
  // Asume true inicialmente para mostrar el spinner al inicio
  const [cargando, setCargando] = useState(true);

  // estado para determinar el ultimo mensaje
  const [ultimoIdMensaje, setUltimoIdMensaje] = useState(0);
  const [mostrarNotificacion, setMostrarNotificacion] = useState(false);

  // consulta para traer los datos desde el back
  const fetchComentarios = async () => {
    const token = sessionStorage.getItem("token");
    setCargando(true); // Activa el spinner al iniciar la carga

    try {
      // Asegúrate de incluir el encabezado de autorización con el token
      const response = await fetch("/api/chat/listarporusuario", {
        method: "POST", 
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ Token: token }), 
      });
      const data = await response.json();
      setComentariosTodos(data);
      setCargando(false); 
    } catch (error) {
      console.error("Error al cargar comentarios:", error);
      setCargando(false); 
    }
  };

  useEffect(() => {
    // Llamada inicial para cargar los comentarios
    fetchComentarios();

    // Establecer el intervalo para la actualización de comentarios
    const intervalId = setInterval(fetchComentarios, 15000); 

    return () => clearInterval(intervalId); 
  }, []);

  useEffect(() => {
    if (
      comentariosTodos.length > 0 &&
      comentariosTodos.length > ultimoIdMensaje
    ) {
      setMostrarNotificacion(true);
      setUltimoIdMensaje(comentariosTodos.length);
    }
  }, [comentariosTodos]); 
  return (
    <div>
      <div>
        {mostrarNotificacion && (
          <div
            style={{
              color: "green",
              fontWeight: "bold",
              textAlign: "center",
              cursor: "pointer",
            }}
            onClick={() => setMostrarNotificacion(false)}
          >
            ¡Tienes nuevos mensajes! (Haz clic para ocultar)
          </div>
        )}
      </div>
    </div>
  );
};

export default NotificadorAdmin;
