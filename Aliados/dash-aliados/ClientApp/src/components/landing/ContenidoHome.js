// import hoja de estilo (css)
import "./ContenidoHome.css";

// import hooks 
import React from "react";

// import componentes 
import HeroVideo from "./HeroVideo";
import Promesa from "./Promesa";
import PorqueZoco from "./PorqueZoco";
import Hardware from "./Hardware";
import SinCostosOcultos from "./SinCostosOcultos";
import MediosPago from "./MediosPago";
import PregFrecuentes from "./PregFrecuentes";
import FooterLanding from "./FooterLanding";


const ContenidoHome = () => {
  return (
    <div >
      <HeroVideo />
      <div className="contenido">
        <Promesa />
        <PorqueZoco />
        <Hardware />
        <SinCostosOcultos />
        <MediosPago />
        <PregFrecuentes />
        <FooterLanding />
      </div>
    </div>
  );
};

export default ContenidoHome;
