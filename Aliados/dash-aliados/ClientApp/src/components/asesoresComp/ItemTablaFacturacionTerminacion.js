import { useContext } from "react";
import { DarkModeContext } from "../../context/DarkModeContext";
import formatCurrency from "../../helpers/formatCurrency";

const ItemsTablaFacturacionTerminales = ({
  asesor,
  nombreComercio,
  credito,
  debito,
  terminal,
  _1pago,
  total,
  terminal1,
  faltaVisita,
}) => {
  const { darkMode } = useContext(DarkModeContext);
  const creditoFormateadaApeso = formatCurrency(credito);
  const debitoFormateadaApeso = formatCurrency(debito);
  const unPagoFormateadaApeso = formatCurrency(_1pago);
  const totalFormateadaApeso = formatCurrency(total);
  const terminal1FormateadaApeso = formatCurrency(terminal1);
  const faltaVisitaFormateadaApeso = formatCurrency(faltaVisita);

  return (
    <tr
      className={
        darkMode
          ? " tabla-borde-bottom  "
          : "tabla-borde-bottom  "
      }
    >
      <td className={darkMode ?"fs-10 lato-regular text-dark  py-3 " : "fs-10 lato-regular text-dark py-3 "}> {asesor}</td>
      <td className="fs-10 lato-regular py-3 "> {nombreComercio}</td>
      <td className="fs-10 lato-regular py-3 "> {terminal}</td>
      <td className="fs-10 lato-regular py-3 "> {creditoFormateadaApeso}</td>
      <td className="fs-10 lato-regular py-3 "> {debitoFormateadaApeso} </td>
      <td className="fs-10 lato-regular py-3 "> {unPagoFormateadaApeso} </td>
      <td className="fs-10 lato-regular py-3 "> {totalFormateadaApeso} </td>
      <td className="fs-10 lato-regular py-3 "> {terminal1FormateadaApeso} </td>
      <td className="fs-10 lato-regular py-3 ">
        {" "}
        {faltaVisitaFormateadaApeso}
      </td>
    </tr>
  );
};

export default ItemsTablaFacturacionTerminales;
