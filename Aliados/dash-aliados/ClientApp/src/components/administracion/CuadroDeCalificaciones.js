// import hoja de estilo (css)
import "./CuadroDeCalificaciones.css";

// import hooks
import React, { useContext } from "react";

// import context
import { DarkModeContext } from "../../context/DarkModeContext";

// import helpers
import formatISODate from "../../helpers/FormattedDate";

// import librerias
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faStar } from "@fortawesome/free-solid-svg-icons";
import { FidgetSpinner } from "react-loader-spinner";

// Componente para mostrar las estrellas de la reseña
const RatingStars = ({ rating }) => {
  return (
    <div className="rating">
      {[...Array(5)].map((star, index) => {
        index += 1;
        return (
          <span
            key={index}
            className={
              index <= rating
                ? " width-estrellas-administracion on"
                : "width-estrellas-administracion off"
            }
          >
            <FontAwesomeIcon icon={faStar} />
          </span>
        );
      })}
    </div>
  );
};

// Componente para mostrar una sola reseña
const ReviewCard = ({ calificacion }) => {
  const fecha = formatISODate(calificacion.fecha);

  return (
    <div className="review-card ">
      <div className="review-header container">
        <div>
          <h3 className="fs-16 lato-bold">{calificacion.razonSocial}</h3>
          <div className="">
            {" "}
            <span className="fs-14 lato-bold me-1">Asesor: </span>
            {calificacion.asesorAbm}
          </div>
          <p className="review-text fs-14 ">{calificacion.descripcion}</p>
          <div>
            <span className="review-date fs-12">{fecha}</span>
          </div>
        </div>

        <div style={{ whiteSpace: "nowrap" }}>
          <RatingStars rating={calificacion.numCalifico} />
        </div>
      </div>
    </div>
  );
};

// Componente principal que muestra la lista de reseñas
const ReviewsList = ({ calificaciones }) => {
  return (
    <div className="reviews-list">
      {calificaciones.map((calificacion, index) => (
        <ReviewCard key={index} calificacion={calificacion} />
      ))}
    </div>
  );
};

const CuadroDeCalificaciones = ({ calificaciones = [] }) => {
  const { darkMode } = useContext(DarkModeContext);
  return (
    <section
      className={
        darkMode
          ? "container cuadro-calificaciones-dark"
          : "container cuadro-calificaciones"
      }
    >
      {calificaciones.length === 0 ? (
        <div className=" centrado color-verde" style={{ height: "60vh" }}>
          <FidgetSpinner
            visible={true}
            height="80"
            width="80"
            ariaLabel="fidget-spinner-loading"
            wrapperStyle={{}}
            wrapperClass="fidget-spinner-wrapper"
          />
        </div>
      ) : (
        <ReviewsList calificaciones={calificaciones} />
      )}
    </section>
  );
};

export default CuadroDeCalificaciones;
