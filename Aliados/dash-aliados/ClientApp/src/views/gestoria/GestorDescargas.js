import React from "react";
import TituloPagina from "../../components/TituloPagina";
import Footer from "../../components/Footer";
import BienvenidoPanelGestor from "../../components/gestorComp/BienvenidoPanelGestor";
import BienvenidoPanelGestorCelular from "../../components/gestorComp/BienvenidoPanelGestorCelular";
import CartasDescargasGestor from "../../components/gestorComp/CartasDescargasGestor";

const GestorDescargas = () => {
  return (
    <div translate="no" className="d-flex flex-column min-vh-100">
      <div className="py-4 d-md-block d-none">
        <BienvenidoPanelGestor />
      </div>
      <div className="py-4 d-block d-md-none">
        <BienvenidoPanelGestorCelular />
      </div>
      <div>
        <TituloPagina title="Descargas" />
      </div>
      <div className="pb-5">
        <CartasDescargasGestor />
      </div>
      <div className="py-4 mt-auto">
        <Footer />
      </div>
    </div>
  );
};

export default GestorDescargas;
