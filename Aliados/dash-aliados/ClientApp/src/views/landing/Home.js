// import hooks
import React, { useState, useEffect } from "react";

// impornt componentes
import ContenidoHome from "../../components/landing/ContenidoHome";
import ScrollToTopButton from "../../components/ScrollToTopButton";

// Componente de consentimiento de cookies integrado
const CookieConsent = () => {
  // estado para mostrar la visibilidad del cookie
  const [isVisible, setIsVisible] = useState(false);

  // Utilizamos el localStorage para guardar el booleano
  // para mostrar el componente de la cookie 
  useEffect(() => {
    const consent = localStorage.getItem("cookieConsent");
    if (consent !== "true") {
      setIsVisible(true);
    }
  }, []);

  // funcion para aceptar la cookie 
  const handleAccept = () => {
    localStorage.setItem("cookieConsent", "true");
    setIsVisible(false);
  };

  if (!isVisible) {
    return null;
  }

  return (
    <div
      translate="no"
      className="fs-14 box-cockies lato-bold color-verde"
      style={{
        position: "fixed",
        bottom: "20px",
        right: "20px",
        padding: "20px",
        borderRadius: "5px",
        boxShadow: "0 2px 8px rgba(0,0,0,0.5)",
      }}
    >
      Utilizamos cookies para mejorar su experiencia. <br /> Al continuar
      visitando este sitio, usted acepta nuestro uso de cookies.
      <div>
        <div className="text-center">
          <button
            className="btn main-btn-cockie"
            onClick={handleAccept}
            style={{ marginLeft: "10px", padding: "5px 10px" }}
          >
            Aceptar
          </button>
        </div>
      </div>
    </div>
  );
};

// Componente Home que incluye CookieConsent
const Home = () => {
  return (
    <div translate="no">
      <ContenidoHome />
      <ScrollToTopButton />
      <CookieConsent />
    </div>
  );
};

export default Home;
