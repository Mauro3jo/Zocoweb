// import hooks 
import React from "react";

const Promesa = () => {
  return (
    <div>
      <div className="promesa cuadro-degradado">
        <h3 className="promesa-title colorz">Nuestra promesa de pagos</h3>
        <p className="promesa-p">
          No importa si se trata de un pequeño negocio o una gran empresa,
          hacemos que aceptar pagos con tarjeta sea lo más preciso, sencillo y
          seguro posible.
          <br />
          No hay comisiones adicionales, contratos a largo plazo ni trucos, solo
          procesamiento de pagos confiable para que nunca tengas que perderte
          una venta.
        </p>
      </div>
      <div className="caracteristicas">
        <div className="caract-item" id="bg1">
          <h2 className="caract-title">
            Transacciones seguras en todas partes.
          </h2>
        </div>
        <div className="caract-item" id="bg2">
          <h2 className="caract-title">Unificamos los datos.</h2>
        </div>
        <div className="caract-item" id="bg3">
          <h2 className="caract-title">Mejoramos la toma de decisiones.</h2>
        </div>
        <div className="caract-item" id="bg4">
          <h2 className="caract-title">Administración de recursos humanos.</h2>
        </div>
      </div>
    </div>
  );
};

export default Promesa;
