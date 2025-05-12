// import hook
import React from "react";

// import libreria
import { Link } from "react-router-dom";

// import assets
import video from "../../assets/img/video.mp4";
import logoNav from "../../assets/img/logo.png";

const HeroVideo = () => {
  // funcion para navergar al top de la pagina
  const scrollToTop = () => {
    window.scrollTo(0, 0);
  };

  // Función para cerrar el navbar
  const toggleNavbar = () => {
    // Simula un clic en el botón de toggler del navbar
    document.querySelector(".navbar-toggler").click();
  };

  return (
    <div data-bs-theme="dark">
      <article className="navbar navbar-expand-lg navbar-light fixed-top bg-light">
        <div className="container-fluid">
          <a className="navbar-brand" href="#">
            <img
              className="Zoco-Servicio-Pago"
              src={logoNav}
              alt="Zoco-Servicio de pagos"
            />
          </a>

          <button
            className="navbar-toggler"
            type="button"
            data-bs-toggle="collapse"
            data-bs-target="#navbarCollapse"
            aria-controls="navbarCollapse"
            aria-expanded="false"
            aria-label="Toggle navigation"
          >
            <span
              className="navbar-toggler-icon"
              style={{
                "--bs-navbar-toggler-icon-bg":
                  'url(\'data:image/svg+xml,%3csvg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 30 30"%3e%3cpath stroke="rgba(0, 0, 0, 0.29)" stroke-linecap="round" stroke-miterlimit="10" stroke-width="2" d="M4 7h22M4 15h22M4 23h22"/%3e%3c/svg%3e\')',
              }}
            ></span>
          </button>
          <div className="collapse navbar-collapse" id="navbarCollapse">
            <ul className="navbar-nav me-auto mb-2 mb-md-0">
              <li className="navbar-item">
                <a
                  className="nav-link"
                  onClick={() => {
                    scrollToTop();
                    toggleNavbar();
                  }}
                >
                  Home
                </a>
              </li>
              <li className="navbar-item">
                <a
                  className="nav-link"
                  href="#porque"
                  onClick={() => {
                    scrollToTop();
                    toggleNavbar();
                  }}
                >
                  ¿Por qué Zoco?
                </a>
              </li>
              <li className="navbar-item">
                <a
                  className="nav-link"
                  href="#hardware"
                  onClick={() => {
                    scrollToTop();
                    toggleNavbar();
                  }}
                >
                  Hardware
                </a>
              </li>
              <li className="navbar-item">
                <a
                  className="nav-link"
                  href="#precios"
                  onClick={() => {
                    scrollToTop();
                    toggleNavbar();
                  }}
                >
                  Precios
                </a>
              </li>
              <li className="navbar-item">
                <a
                  className="nav-link"
                  href="#seccion-preguntas"
                  onClick={() => {
                    scrollToTop();
                    toggleNavbar();
                  }}
                >
                  Preguntas frecuentes
                </a>
              </li>
            </ul>

            <div className="navbar-btn">
              <Link className="btn main-btn" to="/login">
                Iniciar sesión
              </Link>
            </div>
          </div>
        </div>
      </article>
      <header data-bs-theme="dark">
        <div className="page-hero">
          <div className="content-video">
            <video
              className="object-fit-contain"
              loop
              autoPlay
              playsInline
              muted
              src={video}
              type="video/mp4"
            ></video>
          </div>

          <div className="container">
            <div className="hero-text text-start">
              <h1 id="hero-title">
                <span className="colorz">Preciso. Sencillo. Seguro.</span>
              </h1>
              <p className="colorw" id="hero-p">
                Somos una plataforma de servicios de pago diseñada para
                simplificar y optimizar tus operaciones financieras. Trabajamos
                para proporcionarte las herramientas y el asesoramiento que
                necesitas para crecer y prosperar en un mundo empresarial en
                constante cambio.
              </p>
              <div className="navbar-btn">
                <a
                  className="btn main-btn-contacto px-5 mt-3"
                  target="_blank"
                  href="https://wa.link/w4quzx
"
                >
                  Contactanos
                </a>
              </div>
            </div>
          </div>
        </div>
      </header>
    </div>
  );
};

export default HeroVideo;
