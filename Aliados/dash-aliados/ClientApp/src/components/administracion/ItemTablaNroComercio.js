import React from "react";

const ItemTablaNroComercio = ({ dato, darkMode }) => {
    return (
        <tr
            className={
                darkMode
                    ? "tabla-borde-bottom text-white"
                    : "tabla-borde-bottom text-dark"
            }
        >
            <td className="fs-12-a-10 lato-regular pt-4">{dato.id}</td>
            <td className="fs-12-a-10 lato-regular pt-4">{dato.nroComercio1}</td>
            <td className="fs-12-a-10 lato-regular pt-4">{dato.nomRubro}</td>
            <td className="fs-12-a-10 lato-regular pt-4">{dato.categoria}</td>
            {/* <td className="fs-12-a-10 lato-regular pt-4">{dato.cuotas}</td> */}
            <td className="fs-12-a-10 lato-regular pt-4">{dato.legajos}</td>
        </tr>
    );
};

export default ItemTablaNroComercio;
