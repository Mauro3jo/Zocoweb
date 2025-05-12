import React, { useContext } from "react";
import { DarkModeContext } from "../../context/DarkModeContext";

import zocoLogo from "../../assets/img/Datos Establecimiento Orden de Pago.png";
import './Header.css'


const HeaderOrden = () => {
  const { darkMode } = useContext(DarkModeContext);
  return (
    <section className="container-header">
      <section className="d-lg-block d-none">
        <div
          className={
            darkMode
              ? "py-4 contenedor-panel-control-header-dark container d-none d-xl-block"
              : "py-4 contenedor-panel-control-header container d-none d-xl-block"
          }
        >
          
            <article  style={{
    display: "flex",
    justifyContent: "center", // Centrar horizontalmente
    alignItems: "center", // Centrar verticalmente
    height: "70%", // Usar toda la altura disponible
   
  }}>
              <div className="">
                
                  <img src={zocoLogo} width="700px"></img>
              
              </div>
            </article>
          
         
        </div>
      </section>
    </section>
  );
};

export default HeaderOrden;
