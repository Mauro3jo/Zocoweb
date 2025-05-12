import React from "react";
import TablaPanelInterno from "./TablaPanelInterno";

const ContenidoAdminCalidad = ({ data }) => {
    return (
        <div className="container">
            <div>
                <TablaPanelInterno data={data} />
            </div>
        </div>
    );
};

export default ContenidoAdminCalidad;
