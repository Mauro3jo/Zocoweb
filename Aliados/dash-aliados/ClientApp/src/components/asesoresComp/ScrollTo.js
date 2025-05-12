import { faCommentDots } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";

const ScrollTo = () => {
  const scrollToTop = () => {
    window.scrollTo(0, 0);
    setNumeroNotificaciones(0); 
    setContadorReseteado(true); 
  };

  const buttonStyle = {
    position: "fixed",
    bottom: "100px",
    right: "20px",
    zIndex: 1000,
  };

  const counterStyle = {
    position: "fixed",
    bottom: "130px",
    right: "20px",
    background: "red",
    borderRadius: "50%",
    color: "white",
    fontSize: "10px",
    width: "18px",
    height: "18px",
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
  };

  const iconSize = "2x";

  // Estados
  const [numeroNotificaciones, setNumeroNotificaciones] = useState();
  const [comentariosTodos, setComentariosTodos] = useState([]);
  const [primerCuit, setPrimerCuit] = useState("");
  const [cargando, setCargando] = useState(true);
  const [contadorReseteado, setContadorReseteado] = useState(false); 

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

      if (hayComentariosNuevos) {
        setComentariosTodos(data);
        if (data[0]?.cuit !== primerCuit) {
          setPrimerCuit(data[0]?.cuit);
        }

        const resultado = data.reduceRight((acumulador, elementoActual, index) => {
          if (acumulador.encontrado) {
            return acumulador;
          }

          if (!elementoActual.esDelUsuario) {
            acumulador.cuenta++;
          } else {
            acumulador.encontrado = true;
          }

          if (index === 0) {
            return acumulador.cuenta;
          }

          return acumulador;
        }, { cuenta: 0, encontrado: false });

        if (contadorReseteado) {
          setContadorReseteado(false);
        } else {
          setNumeroNotificaciones(resultado.cuenta);
        }
      }

      setCargando(false);
    } catch (error) {
      console.error("Error al cargar comentarios:", error);
      setCargando(false);
    }
  };

  useEffect(() => {
    fetchComentarios();
    const intervalId = setInterval(fetchComentarios, 10000); // Ejemplo de encuesta cada 10 segundos

    return () => clearInterval(intervalId);
  }, []);

  return (
    <div>
      <Link
        to="/asesores/chat"
        style={{ position: "relative", display: "inline-block" }}
      >
        <FontAwesomeIcon
          className="color-verde"
          onClick={scrollToTop}
          style={buttonStyle}
          icon={faCommentDots}
          size={iconSize}
        />
        {numeroNotificaciones > 0 && (
          <span style={counterStyle}>{numeroNotificaciones}</span>
        )}
      </Link>
    </div>
  );
};

export default ScrollTo;
