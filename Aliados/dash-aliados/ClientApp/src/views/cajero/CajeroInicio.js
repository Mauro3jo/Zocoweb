import React, { useState } from "react";
import BienvenidoCajero from "../../components/cajero/BienvenidoCajero";
import Footer from "../../components/Footer";
import CalculadoraNueva from "../../components/CalculadoraNueva";
import CalculadoraNuevaCelular from "../../components/CalculadoraNuevaCelular";
import CalculadoraPlazos from "../../components/CalculadoraPlazos";
import CalculadoraPlazosCelular from "../../components/CalculadoraPlazosCelular";
import PaymentTable from "../../components/PaymentTable";
import TituloPagina from "../../components/TituloPagina";

const CajeroInicio = () => {
  const [showPlazoCalculator, setShowPlazoCalculator] = useState(true);
  const [showMontoCalculator, setShowMontoCalculator] = useState(false);

  const handlePlazoClick = () => {
    setShowPlazoCalculator(true);
    setShowMontoCalculator(false);
  };

  const handleMontoClick = () => {
    setShowMontoCalculator(true);
    setShowPlazoCalculator(false);
  };

  return (
    <div translate="no" className="d-flex flex-column min-vh-100">
      <div className="pt-5">
        <BienvenidoCajero />
      </div>
      <div>
        <TituloPagina title="Simulador" />
      </div>
      <div className="py-4">
        <article className="d-xl-block d-none">
          <section className="d-flex justify-content-center py-2 ">
            <div className="mx-3">
              <button
                d-none
                className={
                  showPlazoCalculator
                    ? " btn-simulador-desactivado px-5"
                    : " btn-simulador-activado px-5"
                }
                onClick={handlePlazoClick}
              >
                Simulador de Plazos
              </button>
            </div>
            <div className="mx-3">
              <button
                className={
                  showMontoCalculator
                    ? " btn-simulador-desactivado px-5"
                    : " btn-simulador-activado  px-5"
                }
                onClick={handleMontoClick}
              >
                Simulador de monto
              </button>
            </div>
          </section>
        </article>
        <article className="d-block d-xl-none">
          <section className="d-flex justify-content-center py-2 ">
            <div className="mx-3">
              <button
                className={
                  showPlazoCalculator
                    ? " btn-simulador-desactivado  px-3"
                    : "btn-simulador-activado px-3"
                }
                onClick={handlePlazoClick}
              >
                Sim. Plazos
              </button>
            </div>
            <div className="mx-3">
              <button
                className={
                  showMontoCalculator
                    ? "btn-simulador-desactivado   px-3"
                    : " btn-simulador-activado  px-3"
                }
                onClick={handleMontoClick}
              >
                Sim. Monto
              </button>
            </div>
          </section>
        </article>
        {showPlazoCalculator && (
          <>
            <div className="pt-2 d-xl-block d-none">
              <CalculadoraPlazos />
            </div>
            <div className="pt-2 d-block d-xl-none">
              <CalculadoraPlazosCelular />
            </div>
            <div className=" container">
              <PaymentTable />
            </div>
          </>
        )}
        {showMontoCalculator && (
          <>
            <div className="py-4 d-xl-block d-none">
              <CalculadoraNueva />
            </div>
            <div className="py-4 d-block d-xl-none">
              <CalculadoraNuevaCelular />
            </div>
          </>
        )}
      </div>
      <div className="py-4 mt-auto">
        <Footer translate="no" />
      </div>
    </div>
  );
};

export default CajeroInicio;
