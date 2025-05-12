import React from "react";
import FormularioCargarCRMInterno from "./FormularioCargarCRMInterno";
import TablaCRMInterno from "./TablaCRMInterno";
import TituloPagina from "../TituloPagina";

const ContenidoCRMInterno = () => {

    return (
        <div className="container">
            <div>
                <FormularioCargarCRMInterno />
            </div>
            <div>
                <TituloPagina title="Historial" />
            </div>
            <div>
                <TablaCRMInterno /> 
            </div>
        </div>
    );
};

export default ContenidoCRMInterno;
