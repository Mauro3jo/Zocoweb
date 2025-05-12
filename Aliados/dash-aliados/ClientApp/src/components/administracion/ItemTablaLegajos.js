import React from "react";

const ItemTablaLegajos = ({ dato, darkMode }) => {
    
    return (
        <tr
            className={
                darkMode
                    ? "tabla-borde-bottom text-white"
                    : "tabla-borde-bottom text-dark"
            }
        >   <td className="fs-12-a-10 lato-regular pt-4">{dato.id}</td>
            <td className="fs-12-a-10 lato-regular pt-4">{dato.nroLegajo}</td>
            <td className="fs-12-a-10 lato-regular pt-4">{dato.terminal}</td>
            <td className="fs-12-a-10 lato-regular pt-4">{dato.cuit}</td>

            <td className="fs-12-a-10 lato-regular pt-4">{dato.nombreDeFantasia}</td>
            <td className="fs-12-a-10 lato-regular pt-4">{dato.usuario}</td>

            <td className="fs-12-a-10 lato-regular pt-4">{dato.provincia}</td>
            <td className="fs-12-a-10 lato-regular pt-4">{dato.fechaDeCarga}</td>

            <td className="fs-12-a-10 lato-regular pt-4">{dato.asesor}</td>
        </tr>
    );
};

export default ItemTablaLegajos;
