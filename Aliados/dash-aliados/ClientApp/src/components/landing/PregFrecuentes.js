// import hooks
import React from "react";

// import assets
import tarjetasCelular from "../../assets/img/tarjetas-mobile.png";
import tarjetas from "../../assets/img/tarjetas.png";

const PregFrecuentes = () => {
  return (
    <div>
      <h3 className="titulo-preguntas">Preguntas frecuentes</h3>
      <div id="seccion-preguntas" className="cuadro-degradado">
        <details className="pregunta">
          <summary  id="que-es-zoco" className="padding-pregunta">
            ¿Qué es Zoco?
          </summary>
          <p className="">
            En Zoco - Servicios de Pago, somos mucho más que un procesador de
            pagos. Nuestra visión va más allá, poniendo al cliente en el centro
            de todo lo que hacemos. Nuestro modelo de negocio está diseñado para
            resolver, acompañar, construir, transparentar y agilizar, entre
            otros aspectos, todas las necesidades de las personas que forman
            parte de nuestro ecosistema. Estamos comprometidos en brindar
            soluciones que no solo simplifiquen los pagos, sino que también
            mejoren la experiencia de todos nuestros aliados.
          </p>
        </details>
        <hr />
        <details className="pregunta">
          <summary id="que-tipo-tarjeta" className="padding-pregunta">
            ¿Qué tipos de tarjetas de crédito y débito aceptan?
          </summary>
          <picture className="picture-medios-img">
            <source src={tarjetasCelular} media="(max-width:770px)" />
            <img src={tarjetas} className="medios-img" alt="tarjetas" />
          </picture>
        </details>
        <hr />
        <details className="pregunta">
          <summary id="pagos-seguros" className="padding-pregunta">
            ¿Cómo se aseguran de que los pagos sean seguros y protegidos contra
            fraudes?
          </summary>
          <p className="p-prop-preguntas">
            En ZOCO, la seguridad de tus pagos es nuestra prioridad. Contamos
            con un hardware de vanguardia que te permite vender a tu manera y
            garantiza la protección contra fraudes. Nuestra terminal de pagos
            eficaz y portátil no solo acepta pagos de manera segura, sino que
            utilizamos tecnología avanzada para asegurarnos de que cada
            transacción sea segura y esté protegida contra cualquier intento de
            fraude, brindándote la tranquilidad que necesitas al realizar tus
            transacciones.
          </p>
        </details>
        <hr />
        <details className="pregunta">
          <summary id="casos-desconocimiento" className="padding-pregunta">
            ¿Como proceden en casos de desconocimientos?
          </summary>
          <p className="p-prop-preguntas">
            En Zoco, te informamos de inmediato sobre cualquier desconocimiento
            y nuestro equipo de expertos se encarga de gestionar todo el proceso
            de disputa en tu nombre. Esto significa que no tienes que
            preocuparte por hacer el seguimiento de la gestión, ya que estamos
            aquí para ocuparnos de ello. Una vez resuelto, te contactamos para
            informarte del resultado. Tu tranquilidad es nuestra prioridad.
          </p>
        </details>
      </div>
    </div>
  );
};

export default PregFrecuentes;
