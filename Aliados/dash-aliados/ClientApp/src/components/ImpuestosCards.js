import { useContext, useEffect, useState } from "react";
import { DarkModeContext } from "../context/DarkModeContext";
import "./ImpuestosCards.css";
import formatearValores from "../helpers/formatearAPeso";

const ImpuestosCards = ({ datosBack, DatosTasa }) => {
  // datos extraigo del estado datosBack (datos de la consulta)
  const {
    totalBrutoMes,
    totaldebito,
    totalOperaciones,
    arancel,
    totalIva21Mes,
    ingresobruto,
    retencionganancia,
    retecionIva,
  } = datosBack;

  // los datos de las variables anteriores los paso por la funcion
  // formatear valores antes de utilizarlos.
  const valoresFormateados = formatearValores(
    totalBrutoMes,
    totaldebito,
    arancel,
    totalIva21Mes,
    ingresobruto,
    retencionganancia,
    retecionIva
  );

  // context para la funcionalidad
  const { darkMode } = useContext(DarkModeContext);

  // estado para guardar los datos de las descripciones
  const [descripciones, setDescripciones] = useState([]);

  // estado para guardar las fechas de vencimientos
  const [fechasVencimiento, setFechasVencimiento] = useState([]);

  // estado para guardar los datos de las tasas
  const [tasas, setTasas] = useState([]);

  // consulta  para guardar los datos
  useEffect(() => {
    if (DatosTasa && DatosTasa.length > 0) {
      const descripcionesTemp = [];
      const fechasTemp = [];
      const tasasTemp = [];

      DatosTasa.forEach((dato) => {
        descripcionesTemp.push(dato.descripciontasa);
        tasasTemp.push(dato.tasa);

        // Formatear fecha
        const fecha = new Date(dato.fechavencimiento);
        const fechaFormateada =
          fecha.getDate().toString().padStart(2, "0") +
          "/" +
          (fecha.getMonth() + 1).toString().padStart(2, "0") +
          "/" +
          fecha.getFullYear().toString().substr(-2);
        fechasTemp.push(fechaFormateada);
      });

      setDescripciones(descripcionesTemp);
      setFechasVencimiento(fechasTemp);
      setTasas(tasasTemp);
    }
  }, [DatosTasa]);
  const descripcionPrimera =
    descripciones.length > 0 ? descripciones[0] : "Cargando...";
  const descripcionSegunda =
    descripciones.length > 0 ? descripciones[1] : "Cargando...";
  const tasaPrimera = tasas.length > 0 ? `${tasas[0]}%` : "Cargando...";
  const tasaSegunda = tasas.length > 0 ? `${tasas[1]}%` : "Cargando...";
  const fechaPrimera =
    fechasVencimiento.length > 0 ? fechasVencimiento[0] : "Cargando...";
  const fechaSegunda =
    fechasVencimiento.length > 0 ? fechasVencimiento[1] : "Cargando...";

  return (
    <section className="container">
      <div className="row">
        <article className="mi-carta responsive-margin-top-3">
          <div
            className={
              darkMode
                ? " card-dark bg-card-impuesto-dark  padding-horizontal d-flex flex-column justify-content-evenly container "
                : "card bg-card-impuesto  padding-horizontal  d-flex flex-column justify-content-evenly container"
            }
          >
            <div className="text-center mt-2 fs-18-a-16 lato-bold">IVA</div>
            <div>
              <h6 className="text-center fs-16-a-14 lato-regular pb-2">
                {" "}
                IVA Ventas
              </h6>
              <div className="d-flex justify-content-between flex-wrap mx-2">
                <div className="lato-regular fs-14">Base imponible</div>
                <div className="lato-bold fs-14">
                  {" "}
                  $ {valoresFormateados[0]}
                </div>
              </div>
              <div className="d-flex justify-content-between flex-wrap  mx-2">
                <div className="lato-regular fs-14">IVA Débito fiscal</div>
                <div className="lato-bold fs-14">
                  {" "}
                  $ {valoresFormateados[1]}
                </div>
              </div>
              <div className="d-flex justify-content-between  flex-wrap  mx-2  ">
                <div className="lato-regular fs-14">Total ventas</div>
                <div className="lato-bold fs-14">{totalOperaciones}</div>
              </div>
            </div>
            <hr className="hr-card-impuestos" />
            <div className="text-center">
              <div>
                <h6 className="text-center fs-16-a-14 lato-regular pb-2">
                  IVA Compras
                </h6>
                <div className="d-flex justify-content-between flex-wrap mx-2">
                  <div className="lato-regular fs-14">Base imponible</div>
                  <div className="lato-bold fs-14">
                    {" "}
                    $ {valoresFormateados[2]}
                  </div>
                </div>
                <div className="d-flex justify-content-between flex-wrap mx-2">
                  <div className="lato-regular fs-14">IVA Débito fiscal</div>
                  <div className="lato-bold fs-14">
                    {" "}
                    $ {valoresFormateados[3]}
                  </div>
                </div>
                <div className="d-flex justify-content-between flex-wrap mx-2">
                  <div className="lato-regular fs-14">{totalOperaciones}</div>
                </div>
              </div>
            </div>
            <hr className="hr-card-impuestos" />
            <div className="text-center">
              <div className="d-flex justify-content-between flex-wrap mx-2 my-2">
                <div className="fs-16-a-14 lato-bold">Total Ret. IVA</div>
                <div className="fs-16-a-14 lato-bold">
                  ${valoresFormateados[6]}
                </div>
              </div>
            </div>
          </div>
        </article>
        <article className="mi-carta responsive-margin-top-3">
          <div
            className={
              darkMode
                ? " card-dark bg-card-impuesto-dark  padding-horizontal d-flex flex-column justify-content-evenly container "
                : "card bg-card-impuesto  padding-horizontal  d-flex flex-column justify-content-evenly container"
            }
          >
            <div className="text-center fs-18-a-16 lato-bold">IIBB</div>
            <div>
              <div className="d-flex justify-content-between  flex-wrap  mx-2  ">
                <div className="lato-regular fs-14">Total:</div>
                <div className="lato-bold fs-14">$ {valoresFormateados[4]}</div>
              </div>
            </div>
            <hr className="hr-card-impuestos" />
            <div className="text-center fs-18-a-16 lato-bold">
              Retención de ganancias
            </div>
            <div>
              <div className="d-flex justify-content-between  flex-wrap  mx-2  ">
                <div className="lato-regular fs-14">Total:</div>
                <div className="lato-bold fs-14">$ {valoresFormateados[5]}</div>
              </div>
            </div>
          </div>
        </article>
      </div>
    </section>
  );
};

export default ImpuestosCards;
