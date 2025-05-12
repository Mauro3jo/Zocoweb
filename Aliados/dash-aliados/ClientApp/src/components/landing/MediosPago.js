// import hooks
import React from "react";

// import assets
import tarjetaMobile from "../../assets/img/tarjetas-mobile.png";
import tarjetas from "../../assets/img/tarjetas.png";

const MediosPago = () => {
  return (
    <div>
      <div className="medios cuadro-degradado">
        <div className="medios-texto">
          <p>Medios de pagos disponibles:</p>
        </div>

        <picture className="picture-seccion-medios-pago">
          <source src={tarjetaMobile} media="(max-width:770px)" />
          <img src={tarjetas} className="medios-img" alt="tarjetas" />
        </picture>
      </div>
      <div className="precios-sub">
        <p>
          Sin cuenta bancaria | Sin comisiones adicionales | Sin costos de
          inscripción | Sin cargos mensuales / anuales | Sin cláusulas de
          permanencia
        </p>
        <p>
          Si procesas valores superiores a <strong>$30.000.000</strong>{" "}
          contáctanos para ofrecerte la mejor tarifa para tu negocio
        </p>
      </div>
    </div>
  );
};

export default MediosPago;
