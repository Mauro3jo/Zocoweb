import React from "react";
import TablaControlPanelInterno from "./TablaControlPanelInterno";
const ContenidoAdminCalidadPanelInterno = ({ data }) => {
 
    return (
        <div className="container">
            <div>
                <TablaControlPanelInterno data={data} />
            </div>
        </div>
    );
};

export default ContenidoAdminCalidadPanelInterno;
