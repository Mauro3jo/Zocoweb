// import hooks, context 
import React, { useContext } from "react";
import { DarkModeContext } from "../../context/DarkModeContext";

const TotalAsesoresAnalisis = ({ totalPorCobrarFormateadaApeso }) => {
  // darkmode context para la funcionalidad de claro oscuro
  const { darkMode } = useContext(DarkModeContext);

  return (
    <section className="text-center container">
      <div>
        <h6 className="fs-20 lato-bold"> Total</h6>
      </div>
      <div className="mb-5">
        <button
          className={
            darkMode
              ? "btn-total-asesores-analisis-dark border-0 quitar-cursor-pointer"
              : "btn-total-asesores-analisis border-0 quitar-cursor-pointer"
          }
        >
          <span className="lato-bold fs-20 mx-5">
            {totalPorCobrarFormateadaApeso}
          </span>
        </button>
      </div>
    </section>
  );
};

export default TotalAsesoresAnalisis;
