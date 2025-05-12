import { useContext } from "react";
import { DarkModeContext } from "../context/DarkModeContext";

const ItemsTabla = ({
    metodo,
    interes,
    pagoPorCuota,
    bruto,
    costoFinanciacion,
    anticipo,
    arancel,
    iva,
    impDebCred,
    ganancias,
    retIva,
    total }) => {
        const { darkMode } = useContext(DarkModeContext)

    return (
        <tr className={darkMode ? ' tabla-borde-bottom  text-white' : 'tabla-borde-bottom  text-dark'}>
            <td className="fs-13 lato-regular py-3">$ {metodo}</td>
            <td className="fs-13 lato-regular py-3">$ {interes}</td>
            <td className="fs-13 lato-regular py-3">$ {pagoPorCuota}</td>
            <td className="fs-13 lato-regular py-3">$ {bruto}</td>
            <td className="fs-13 lato-regular py-3">$ {costoFinanciacion}</td>
            <td className="fs-13 lato-regular py-3">$ {anticipo}</td>
            <td className="fs-13 lato-regular py-3">$ {arancel}</td>
            <td className="fs-13 lato-regular py-3">$ {iva}</td>
            <td className="fs-13 lato-regular py-3">$ {impDebCred}</td>
            <td className="fs-13 lato-regular py-3">$ {ganancias}</td>
            <td className="fs-13 lato-regular py-3">$ {retIva}</td>
            <td className="fs-13 lato-regular py-3">$ {total}</td>
        </tr>
    )

}

export default ItemsTabla;