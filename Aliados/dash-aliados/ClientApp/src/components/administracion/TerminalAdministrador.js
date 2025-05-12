import "./TerminalAdministrador.css";
import React, { useContext, useState } from "react";

// Import Swiper React components
import { Swiper, SwiperSlide } from "swiper/react";

// Import Swiper styles
import "swiper/css";
import "swiper/css/pagination";
import { DarkModeContext } from "../../context/DarkModeContext";
import TablaGeneralAdministrador from "./TablaGeneralAdministrador";
import TablaBajasAdministrador from "./TablaBajasAdministrador";
import TablaAltaAdministrador from "./TablaAltaAdministrador";
import TablaModificacionesAdministrador from "./TablaModificacionesAdministrador";

const TerminalAdministrador = () => {
  const [todas, setTodas] = useState(true);
  const [altas, setAltas] = useState(false);
  const [bajas, setBajas] = useState(false);
  const [modificaciones, setModificaciones] = useState(false);
  const { darkMode } = useContext(DarkModeContext);
  const [activeTodas, setActiveTodas] = useState(true);
  const [activeAltas, setActiveAltas] = useState(false);
  const [activeBajas, setActiveBajas] = useState(false);
  const [activeModificaciones, setActiveModificaciones] = useState(false);

  const ViewActive = () => {
    if (todas) {
      return (
        <>
          <TablaGeneralAdministrador />
        </>
      );
    } else if (bajas) {
      return (
        <>
          <TablaBajasAdministrador />
        </>
      );
    } else if (altas) {
      return (
        <>
          <TablaAltaAdministrador />
        </>
      );
    } else {
      return (
        <>
          <TablaModificacionesAdministrador />
        </>
      );
    }
  };

  const activeTodasView = () => {
    setTodas(true);
    setAltas(false);
    setBajas(false);
    setModificaciones(false);
    activarTodas();
  };

  const activeAltasView = () => {
    setTodas(false);
    setAltas(true);
    setBajas(false);
    setModificaciones(false);
    activadoBtnAltas();
  };

  const activeBajasView = () => {
    setTodas(false);
    setAltas(false);
    setBajas(true);
    setModificaciones(false);
    activadoBtnBajas();
  };

  const activeModificacionesView = () => {
    setTodas(false);
    setAltas(false);
    setBajas(false);
    setModificaciones(true);
    activeBtnModificaciones();
  };

  const activarTodas = () => {
    setActiveTodas(true);
    setActiveAltas(false);
    setActiveBajas(false);
    setActiveModificaciones(false);
  };

  const activadoBtnTodas = () => {
    if (activeTodas && darkMode) {
      return "btn-todas-active centrado lato-bold text-white";
    } else if (activeTodas) {
      return " btn-todas-active lato-bold centrado";
    } else if (darkMode) {
      return "btn-todas lato-bold  centrado";
    } else {
      return " btn-todas lato-bold centrado ";
    }
  };

  const activadoBtnAltas = () => {
    setActiveTodas(false);
    setActiveAltas(true);
    setActiveBajas(false);
    setActiveModificaciones(false);
  };

  const activadoAltas = () => {
    if (activeAltas && darkMode) {
      return " btn-altas-active lato-bold  centrado";
    } else if (activeAltas) {
      return " btn-altas-active lato-bold centrado";
    } else if (darkMode) {
      return "btn-altas lato-bold  centrado";
    } else {
      return "btn-altas lato-bold centrado border-0";
    }
  };

  const activadoBtnBajas = () => {
    setActiveTodas(false);
    setActiveAltas(false);
    setActiveBajas(true);
    setActiveModificaciones(false);
  };

  const activadoBajas = () => {
    if (activeBajas && darkMode) {
      return " btn-bajas-active lato-bold centrado";
    } else if (activeBajas) {
      return " btn-bajas-active lato-bold centrado";
    } else if (darkMode) {
      return "btn-bajas lato-bold centrado";
    } else {
      return " btn-bajas lato-bold  centrado border-0";
    }
  };

  const activeBtnModificaciones = () => {
    setActiveTodas(false);
    setActiveAltas(false);
    setActiveBajas(false);
    setActiveModificaciones(true);
  };

  const activadoModificaciones = () => {
    if (activeModificaciones && darkMode) {
      return " lato-bold btn-modificaciones-active centrado";
    } else if (activeModificaciones) {
      return " lato-bold  btn-modificaciones-active centrado";
    } else if (darkMode) {
      return "btn-modificaciones centrado lato-bold ";
    } else {
      return "lato-bold  btn-modificaciones centrado border-0";
    }
  };

  return (
    <div>
      <div className="container">
        <div className=" d-none d-lg-block pb-4">
          <article
            className="d-flex justify-content-between 
        "
          >
            <div>
              <button onClick={activeTodasView} className={activadoBtnTodas()}>
                Todas
              </button>
            </div>
            <div>
              <button onClick={activeAltasView} className={activadoAltas()}>
                Formularios Altas
              </button>
            </div>
            <div>
              <button onClick={activeBajasView} className={activadoBajas()}>
                Formularios Bajas
              </button>
            </div>
            <div>
              <button
                onClick={activeModificacionesView}
                className={activadoModificaciones()}
              >
                Formularios Modificaciones
              </button>
            </div>
          </article>
        </div>
        <div className="d-lg-none d-block pb-4 ">
          <Swiper
            slidesPerView={2.5}
            spaceBetween={20}
            className="mySwiper mb-4"
          >
            <SwiperSlide>
              <div>
                <button
                  onClick={activeTodasView}
                  className={activadoBtnTodas()}
                >
                  Todas
                </button>
              </div>
            </SwiperSlide>
            <SwiperSlide>
              <div>
                <button onClick={activeAltasView} className={activadoAltas()}>
                  Altas
                </button>
              </div>
            </SwiperSlide>
            <SwiperSlide>
              <div>
                <button onClick={activeBajasView} className={activadoBajas()}>
                  Bajas
                </button>
              </div>
            </SwiperSlide>
            <SwiperSlide>
              <div>
                <button
                  onClick={activeModificacionesView}
                  className={activadoModificaciones()}
                >
                  Modificaciones
                </button>
              </div>
            </SwiperSlide>
          </Swiper>
        </div>
      </div>
      <ViewActive />
    </div>
  );
};

export default TerminalAdministrador;
