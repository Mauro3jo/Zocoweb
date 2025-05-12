import React from "react";
import BienvenidoCajero from "../../components/cajero/BienvenidoCajero";
import Footer from "../../components/Footer";
import ContenidoConsultasAliados from "../../components/ContenidoConsultasAliados";
import TituloPagina from "../../components/TituloPagina";

const CajeroConsultas = () => {
  return (
    <div translate="no" className="d-flex flex-column min-vh-100">
      <div className="pt-5">
        <BienvenidoCajero />
      </div>
      <div>
        <TituloPagina title="Consultas" />
      </div>
      <div className="container py-4">
        <ContenidoConsultasAliados />
      </div>
      <div className="py-4 mt-auto">
        <Footer translate="no" />
      </div>
    </div>
  );
};

export default CajeroConsultas;
