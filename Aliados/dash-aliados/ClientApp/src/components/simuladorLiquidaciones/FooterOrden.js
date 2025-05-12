import React, { useContext } from "react";
import { DarkModeContext } from "../../context/DarkModeContext";


import qrZoco from '../../assets/img/QR P_ Orden de Pago.png'
import './Header.css'

const FooterOrden = ({historialDatos}) => {
    const {darkMode}=useContext(DarkModeContext)
    const convertirNumero = (numeroString) => {
      if (!numeroString) return 0; // Si el valor es nulo o vacío, devolvemos 0
      return parseFloat(numeroString.replace(/\./g, "").replace(",", "."));
  };
    const calcularTotales = () => {
      const totales = {
        bruto: 0,
        arancel: 0,
        iva: 0,
        costoTrans: 0,
        costoFinanciero: 0,
        costoAnticipo: 0,
        retGanancias: 0,
        retIIBB: 0,
        retIVA: 0,
        totalOp: 0,
    };

    // Sumar los valores de cada campo en historialDatos
    historialDatos.forEach((dato) => {
        totales.bruto += convertirNumero(dato.montoinicial);
        totales.arancel += convertirNumero(dato.sumComision);
        totales.iva += convertirNumero(dato.sumIvaComision);
        totales.costoTrans += convertirNumero(dato.debcredFinal);
        totales.costoFinanciero += convertirNumero(dato.costoTarjeta);
        totales.costoAnticipo += convertirNumero(dato.costoAnticipo); // Ajustar si hay otro campo
        totales.retGanancias += convertirNumero(dato.gananciaFinal);
        totales.retIIBB += convertirNumero(dato.alicuotaFinal);
        totales.retIVA += convertirNumero(dato.ivaFinal);
        totales.totalOp += getNeto(dato);
    });

      return totales;
  };
  const getNeto = (dato) =>{
    const neto= convertirNumero(dato.montoinicial)
    const netoFinal= neto - convertirNumero(dato.sumComision)- convertirNumero(dato.sumIvaComision) - convertirNumero(dato.debcredFinal) -convertirNumero(dato.costoTarjeta) - convertirNumero(dato.costoAnticipo) - convertirNumero(dato.alicuotaFinal)
    return netoFinal
}

  const totales = calcularTotales();
  return (
    <div>
        <section className="container-footer">
      <section className="d-lg-block d-none">
        <div
          className= "py-4 contenedor-panel-control-footer container d-none d-xl-block"
          
        >
          <div className="d-flex justify-content-center py-3">
          
            
          <article>
            
 <div
    className={
      darkMode
        ? "bg-data-footer-dinero-dark border-0 quitar-cursor-pointer"
        : "container-light bg-data-footer-dinero border-0 quitar-cursor-pointer"
    }
  > 
    <h6 className="text-center lato-bold fs-17">RESUMEN FISCAL</h6>
    <div className="resumen-fiscal">
      <div className="resumen-fiscal-row">
        <p className="lato-bold fs-10">BRUTO:</p>
        <p className="lato-bold fs-10 numero">
          {new Intl.NumberFormat("es-AR", {
            style: "currency",
            currency: "ARS",
          }).format(totales.bruto)}
        </p>
      </div>
      <div className="resumen-fiscal-row">
        <p className="lato-bold fs-10">Arancel:</p>
        <p className="lato-bold fs-10 numero">
          {new Intl.NumberFormat("es-AR", {
            style: "currency",
            currency: "ARS",
          }).format(totales.arancel)}
        </p>
      </div>
      <div className="resumen-fiscal-row">
        <p className="lato-bold fs-10">IVA 21%:</p>
        <p className="lato-bold fs-10 numero">
          {new Intl.NumberFormat("es-AR", {
            style: "currency",
            currency: "ARS",
          }).format(totales.iva)}
        </p>
      </div>
      <div className="resumen-fiscal-row">
        <p className="lato-bold fs-10">Cost. Trans.:</p>
        <p className="lato-bold fs-10 numero">
          {new Intl.NumberFormat("es-AR", {
            style: "currency",
            currency: "ARS",
          }).format(totales.costoTrans)}
        </p>
      </div>
      <div className="resumen-fiscal-row">
        <p className="lato-bold fs-10">Costo Financiero:</p>
        <p className="lato-bold fs-10 numero">
          {new Intl.NumberFormat("es-AR", {
            style: "currency",
            currency: "ARS",
          }).format(totales.costoFinanciero)}
        </p>
      </div>
      <div className="resumen-fiscal-row">
        <p className="lato-bold fs-10">Costo Anticipo:</p>
        <p className="lato-bold fs-10 numero">
          {new Intl.NumberFormat("es-AR", {
            style: "currency",
            currency: "ARS",
          }).format(totales.costoAnticipo)}
        </p>
      </div>
      <div className="resumen-fiscal-row">
        <p className="lato-bold fs-10">RET. IIBB:</p>
        <p className="lato-bold fs-10 numero">
          {new Intl.NumberFormat("es-AR", {
            style: "currency",
            currency: "ARS",
          }).format(totales.retIIBB)}
        </p>
      </div>
      <div className="resumen-fiscal-row total-op">
        <p className="lato-bold fs-16">TOTAL OP:</p>
        <p className="lato-bold fs-16 numero">
          {new Intl.NumberFormat("es-AR", {
            style: "currency",
            currency: "ARS",
          }).format(totales.totalOp)}
        </p>
      </div>
    </div>
  {/* </div> *
</article>

           
            <article>
              <div>
                {/* <article className="col-12 col-md-12 col-lg-12  py-2">
                  <div className={
              darkMode
                ? " bg-data-footer-dark border-0 quitar-cursor-pointer"
                : "container-light bg-data-footer  border-0 quitar-cursor-pointer"
            }
            >

                  
                  <img src={qrZoco} width="300px" height="250px"></img>
                  </div>

                </article> */}
              </div>
              {/* <div>
              <article className="col-12 col-md-12 col-lg-12  py-2">
          <h6 className="text-center lato-bold fs-17"> RETENCION GANANCIAS</h6>
          <button
            className={
              darkMode
                ? " bg-data-dark border-0 quitar-cursor-pointer"
                : "container-light bg-data  border-0 quitar-cursor-pointer"
            }
          >
            <div className=" d-flex justify-content-center border-0 lato-bold-a-lato-500  fs-22">
              $ {totales.retGanancias.toFixed(2)}
            </div>
          </button>
        </article>
        <article className="col-12 col-md-12 col-lg-12  py-2">
          <h6 className="text-center lato-bold fs-17"> RETENCION IVA</h6>
          <button
            className={
              darkMode
                ? " bg-data-dark border-0 quitar-cursor-pointer"
                : "container-light bg-data  border-0 quitar-cursor-pointer"
            }
          >
            <div className=" d-flex justify-content-center border-0 lato-bold-a-lato-500  fs-22">
            ${totales.retIVA.toFixed(2)}
            </div>
          </button>
        </article>
        <article className="col-12 col-md-12 col-lg-12  py-2">
          <h6 className="text-center lato-bold fs-17"> RETENCION IIBB</h6>
          <button
            className={
              darkMode
                ? " bg-data-dark border-0 quitar-cursor-pointer"
                : "container-light bg-data  border-0 quitar-cursor-pointer"
            }
          >
            <div className=" d-flex justify-content-center border-0 lato-bold-a-lato-500  fs-22">
            ${totales.retIIBB.toFixed(2)}
            </div>
          </button>
        </article>
              </div> */}
            </article>
          </div>
        </div>
      </section>
    </section>
    </div>
  )
}

export default FooterOrden