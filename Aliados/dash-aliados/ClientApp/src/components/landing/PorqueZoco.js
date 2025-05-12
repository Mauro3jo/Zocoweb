// import hooks
import React from "react";

// import assets
import porque1 from "../../assets/img/porque-img1.jpg";
import porque2 from "../../assets/img/porque-img2.jpg";
import porque3 from "../../assets/img/porque-img3.jpg";
import porque4 from "../../assets/img/porque-img4.jpg";

const PorqueZoco = () => {
  return (
    <div className="porque-zoco" id="porque">
      <div className="porque-izq">
        <div className="porque-img">
          <img src={porque1} className="porque-img" alt="imagen porque" />
        </div>
        <div className="porque-texto cuadro-degradado">
          <div className="porque-texto-padding">
            <h1 className="title">Nuestros servicios</h1>
            <p className="porque-p">
              Ofrecemos desde procesamiento de pagos hasta asesoramiento
              personalizado, simplificando tus finanzas y proporcionándote
              herramientas para tomar decisiones informadas.
            </p>
          </div>
        </div>
      </div>
      <div className="porque-der">
        <div className="porque-texto cuadro-degradado">
          <div className="porque-texto-padding">
            <h1 className="title">
              Métodos de asesoramiento adaptados a tu negocio
            </h1>
            <p className="porque-p">
              Entendemos que cada negocio es único. Ya sea que necesites
              resolver un problema financiero específico o estés buscando formas
              de crecer, nuestros Asesores Consultores están disponibles las
              24/7 para brindarte orientación personalizada.
            </p>
          </div>
        </div>
        <div className="porque-img">
          <img src={porque2} className="porque-img" alt="imagen porque 2" />
        </div>
      </div>
      <div className="porque-izq">
        <div className="porque-img">
          <img src={porque3} className="porque-img" alt="imagen porque 3" />
        </div>
        <div className="porque-texto cuadro-degradado">
          <div className="porque-texto-padding">
            <h1 className="title">Sencillez en la administración</h1>
            <p className="porque-p">
              Simplificamos tu gestión financiera para que te enfoques en lo que
              mejor sabes hacer: hacer crecer tu negocio. Nuestra plataforma
              intuitiva te permite rastrear ingresos, gastos y gestionar pagos
              con facilidad. Tu negocio, de manera sencilla.
            </p>
          </div>
        </div>
      </div>
      <div className="porque-der">
        <div className="porque-texto cuadro-degradado">
          <div className="porque-texto-padding">
            <h1 className="title">Seguridad de datos garantizada</h1>
            <p className="porque-p">
              La seguridad es nuestra prioridad número uno. Utilizamos las
              últimas tecnologías de cifrado para proteger cada una de tus
              transacciones. Tranquilidad y confiabilidad en cada pago.
            </p>
          </div>
        </div>
        <div className="porque-img">
          <img src={porque4} className="porque-img" alt="imagen porque 4" />
        </div>
      </div>
    </div>
  );
};

export default PorqueZoco;
