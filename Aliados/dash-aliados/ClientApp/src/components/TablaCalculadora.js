import { useContext } from "react";
import ItemsTabla from "./ItemsTabla";
import { DarkModeContext } from "../context/DarkModeContext";
import "./TablaCalculadora.css";
import DatosCal from "./DatosCal";
import DatosCalTablet from "./DatosCalTablet";

const datos = [
  {
    id: 1,
    metodo: 1000,
    interes: 1000,
    pagoPorCuota: 1000,
    bruto: 1000,
    costoFinanciacion: 1000,
    anticipo: 1000,
    arancel: 1000,
    iva: 1000,
    impDebCred: 1000,
    ganancias: 1000,
    retIva: 1000,
    total: 1000,
  },
  {
    id: 2,
    metodo: 2000,
    interes: 2000,
    pagoPorCuota: 2000,
    bruto: 2000,
    costoFinanciacion: 2000,
    anticipo: 2000,
    arancel: 2000,
    iva: 2000,
    impDebCred: 2000,
    ganancias: 2000,
    retIva: 2000,
    total: 2000,
  },
  {
    id: 3,
    metodo: 3000,
    interes: 3000,
    pagoPorCuota: 3000,
    bruto: 3000,
    costoFinanciacion: 3000,
    anticipo: 3000,
    arancel: 3000,
    iva: 3000,
    impDebCred: 3000,
    ganancias: 3000,
    retIva: 3000,
    total: 3000,
  },
  {
    id: 4,
    metodo: 4000,
    interes: 4000,
    pagoPorCuota: 4000,
    bruto: 4000,
    costoFinanciacion: 4000,
    anticipo: 4000,
    arancel: 4000,
    iva: 4000,
    impDebCred: 4000,
    ganancias: 4000,
    retIva: 4000,
    total: 4000,
  },
  {
    id: 5,
    metodo: 5000,
    interes: 5000,
    pagoPorCuota: 5000,
    bruto: 5000,
    costoFinanciacion: 5000,
    anticipo: 5000,
    arancel: 5000,
    iva: 5000,
    impDebCred: 5000,
    ganancias: 5000,
    retIva: 5000,
    total: 5000,
  },
  {
    id: 6,
    metodo: 6000,
    interes: 6000,
    pagoPorCuota: 6000,
    bruto: 6000,
    costoFinanciacion: 6000,
    anticipo: 6000,
    arancel: 6000,
    iva: 6000,
    impDebCred: 6000,
    ganancias: 6000,
    retIva: 6000,
    total: 6000,
  },
  {
    id: 7,
    metodo: 7000,
    interes: 7000,
    pagoPorCuota: 7000,
    bruto: 7000,
    costoFinanciacion: 7000,
    anticipo: 7000,
    arancel: 7000,
    iva: 7000,
    impDebCred: 7000,
    ganancias: 7000,
    retIva: 7000,
    total: 7000,
  },
  {
    id: 8,
    metodo: 8000,
    interes: 8000,
    pagoPorCuota: 8000,
    bruto: 8000,
    costoFinanciacion: 8000,
    anticipo: 8000,
    arancel: 8000,
    iva: 8000,
    impDebCred: 8000,
    ganancias: 8000,
    retIva: 8000,
    total: 8000,
  },
  {
    id: 9,
    metodo: 9000,
    interes: 9000,
    pagoPorCuota: 9000,
    bruto: 9000,
    costoFinanciacion: 9000,
    anticipo: 9000,
    arancel: 9000,
    iva: 9000,
    impDebCred: 9000,
    ganancias: 9000,
    retIva: 9000,
    total: 9000,
  },
];

const TablaCalculadora = () => {
  const { darkMode } = useContext(DarkModeContext);

  return (
    <section>
      <div className=" d-none d-xl-block">
        <DatosCal />
      </div>
      <div className="d-xl-none d-block">
        <DatosCalTablet />
      </div>

      <div
        className={
          darkMode
            ? " container table-responsive py-5 px-5 bg-tabla-calculadora-dark my-2"
            : "container table-responsive py-5 px-5 bg-tabla-calculadora my-2"
        }
      >
        <table className="table table-borderless responsive striped hover">
          <thead className="border-0">
            <tr className="text-center tabla-thead">
              <th
                className={
                  darkMode
                    ? "bg-white text-dark border-tabla-izquierda border-0 lato-regular fs-12 py-3"
                    : "bg-dark text-white  border-tabla-izquierda border-0 lato-regular fs-12 py-3"
                }
                scope="col "
              >
                Método <br /> de pago
              </th>
              <th
                className="bg-gris-oscuro  text-white lato-regular fs-12  py-3"
                scope="col"
              >
                Interés
              </th>
              <th
                className="bg-gris-oscuro  text-white lato-regular fs-12  py-3"
                scope="col"
              >
                Cliente paga <br /> (por cuota)
              </th>
              <th
                className={
                  darkMode
                    ? "bg-white text-dark border-0 lato-regular fs-12 py-3"
                    : "bg-dark text-white border-0 lato-regular fs-12 py-3"
                }
                scope="col"
              >
                Bruto
              </th>
              <th
                className={
                  darkMode
                    ? "bg-white text-dark border-0 lato-regular fs-12 py-3"
                    : "bg-dark text-white border-0 lato-regular fs-12 py-3"
                }
                scope="col"
              >
                Costo financiación
              </th>
              <th
                className={
                  darkMode
                    ? "bg-white text-dark border-0 lato-regular fs-12 py-3"
                    : "bg-dark text-white border-0 lato-regular fs-12 py-3"
                }
                scope="col"
              >
                Anticipo
              </th>
              <th
                className={
                  darkMode
                    ? "bg-white text-dark border-0 lato-regular fs-12 py-3"
                    : "bg-dark text-white border-0 lato-regular fs-12 py-3"
                }
                scope="col"
              >
                Arancel
              </th>
              <th
                className={
                  darkMode
                    ? "bg-white text-dark border-0 lato-regular fs-12 py-3"
                    : "bg-dark text-white border-0 lato-regular fs-12 py-3"
                }
                scope="col"
              >
                IVA
              </th>
              <th
                className={
                  darkMode
                    ? "bg-white text-dark border-0 lato-regular fs-12 py-3"
                    : "bg-dark text-white border-0 lato-regular fs-12 py-3"
                }
                scope="col"
              >
                IMP DEB/CRED
              </th>
              <th
                className={
                  darkMode
                    ? "bg-white text-dark border-0 lato-regular fs-12 py-3"
                    : "bg-dark text-white border-0 lato-regular fs-12 py-3"
                }
                scope="col"
              >
                Ganancias
              </th>
              <th
                className={
                  darkMode
                    ? "bg-white text-dark border-0 lato-regular fs-12 py-3"
                    : "bg-dark text-white border-0 lato-regular fs-12 py-3"
                }
                scope="col"
              >
                Ret. IVA <br /> (3%)
              </th>
              <th
                className="bg-verde text-white border-tabla-derecha lato-regular fs-12  py-3"
                scope="col"
              >
                TOTAL
              </th>
            </tr>
          </thead>
          <tbody className="text-center">
            {datos.map((dato, id) => (
              <ItemsTabla {...dato} key={id}></ItemsTabla>
            ))}
          </tbody>
        </table>
      </div>
    </section>
  );
};

export default TablaCalculadora;
