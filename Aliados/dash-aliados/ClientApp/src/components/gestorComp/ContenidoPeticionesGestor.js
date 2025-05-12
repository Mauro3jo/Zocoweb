import { Button } from "react-bootstrap";
import CartasPeticionesGestor from "./CartasPeticionesGestor";
import "./ContenidoPeticionesGestor.css";
import React, { useContext, useEffect, useState } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faRotate } from "@fortawesome/free-solid-svg-icons";
import { DarkModeContext } from "../../context/DarkModeContext";

const ContenidoPeticionesGestor = () => {
  const [consultas, setConsultas] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);
  // context para el modo oscuro
  const { darkMode } = useContext(DarkModeContext);

  useEffect(() => {
    const fetchComandas = async () => {
      setIsLoading(true);
      setError(null);
      const token = sessionStorage.getItem("token");

      if (token) {
        try {
          const response = await fetch("/api/comanda/ListarComandasPorGestor", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ token }),
          });

          if (!response.ok) {
            throw new Error("La respuesta de la red no fue correcta");
          }

          const data = await response.json();
          // Ordena las consultas por estado, con las pendientes primero
          const ordenadas = data.sort((a, b) => {
            if (a.estado === "pendiente" && b.estado !== "pendiente") {
              return -1;
            } else if (a.estado !== "pendiente" && b.estado === "pendiente") {
              return 1;
            } else {
              return 0;
            }
          });
          setConsultas(ordenadas);
        } catch (error) {
          setError(error.message);
         /* console.error("Hubo un error:", error);*/
        }
      } else {
        setError("No se encontró token en sessionStorage.");
      }
      setIsLoading(false);
    };

    fetchComandas();
  }, []); 

  // funcion para recargarPagina
  function recargarPagina() {
    window.location.reload();
  }

  return (
    <div>
      <div>
        <Button
          className={
            darkMode
              ? "d-flex btn-modal-nuevo-usuario-editar   centrado border-0 fs-14 lato-bold me-5"
              : "d-flex btn-modal-nuevo-usuario-editar  centrado me-5 border-0 fs-14  lato-bold"
          }
          onClick={recargarPagina}
        >
          <FontAwesomeIcon className="me-3" icon={faRotate} /> Actualizar Peticiones{" "}
        </Button>
      </div>
      {consultas.length === 0 ? (
        <div className="py-3 mx-1" role="alert">
          <h6 className="fs-14 mx-2">
            Todavía no hay peticiones. Manténgase a la espera de nuevas
            solicitudes.
          </h6>
        </div>
      ) : (
        <section className="d-flex justify-content-between flex-wrap">
          {consultas.map((dato, index) => (
            <CartasPeticionesGestor dato={dato} key={dato.id} />
          ))}
        </section>
      )}
    </div>
  );
};

export default ContenidoPeticionesGestor;
