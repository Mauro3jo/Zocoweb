import React, { useContext, useState } from "react";
import iconoPrueba from "../../assets/img/icono-importante.png";
import { DarkModeContext } from "../../context/DarkModeContext";

const CartasNoticiasCelular = () => {
  const { darkMode } = useContext(DarkModeContext);
  const [mostrarAlta, setMostrarAlta] = useState(true);
  const [mostrarBaja, setMostrarBaja] = useState(false);

  const mostrarCardAltas = () => {
    setMostrarAlta(!mostrarAlta);
    setMostrarBaja(false);
    activadoBtnAltas();
  };

  const mostrarCardBajas = () => {
    setMostrarBaja(!mostrarBaja);
    setMostrarAlta(false);
    activadoBtnBajas();
  };

  const [activeAltas, setActiveAltas] = useState(false);
  const [activeBajas, setActiveBajas] = useState(false);

  const activadoBtnAltas = () => {
    setActiveAltas(true);
    setActiveBajas(false);
  };

  const activadoAltas = () => {
    if (activeAltas && darkMode) {
      return " d-flex btn-nav-active-dark centrado";
    } else if (activeAltas) {
      return " btn-prioridad-alta-active  lato-bold fs-16 centrado";
    } else if (darkMode) {
      return "d-flex btn-nav-dark centrado";
    } else {
      return "btn-prioridad-alta border-0 lato-bold fs-16 centrado";
    }
  };

  const activadoBtnBajas = () => {
    setActiveAltas(false);
    setActiveBajas(true);
  };

  const activadoBajas = () => {
    if (activeBajas && darkMode) {
      return " d-flex btn-nav-active-dark centrado";
    } else if (activeBajas) {
      return " btn-prioridad-baja-active lato-bold fs-16 centrado";
    } else if (darkMode) {
      return "d-flex btn-nav-dark centrado";
    } else {
      return " btn-prioridad-baja border-0 lato-bold fs-16 centrado";
    }
  };
  return (
    <div className="container">
      <article className="d-flex justify-content-between">
        <div>
          <button
            className={activadoAltas()}
            type="button"
            onClick={mostrarCardAltas}
          >
            Prioridad alta
          </button>
        </div>
        <div>
          <button
            className={activadoBajas()}
            type="button"
            onClick={mostrarCardBajas}
          >
            Prioridad baja
          </button>
        </div>
      </article>
      <div>
        {/* Con esta logica mostramos solo las cartas de altas  */}
        {mostrarAlta && (
          <div className={ darkMode ? " bg-prioridad-noticias-dark px-5 py-3" : " bg-prioridad-noticias px-5 py-3"}>
            <h6 className="color-rojo py-4  lato-bold text-center  fs-18-a-16">
              Prioridad Alta
            </h6>
            <article>
              <div className="d-flex borde-caja-comentario-prioridad">
                <div className="mx-3 my-3">
                  <img style={{ width: "30px" }} src={iconoPrueba} alt="logo" />
                </div>
                <div>
                  <div>
                    <h6 className="color-verde lato-regular fs-16">NUEVO</h6>
                    <h6>Supervisión Comercial </h6>
                    <h6>Para: Asesores </h6>
                  </div>
                  <div>
                    <h6 className="lato-regular fs-16 ">
                      Chicos, necesito que se fijen en sus mails <br /> sobre el
                      proyecto que tenemos pendiente. Avisen cuando ya hayan
                      completado sus tareas.
                    </h6>
                    <h6 className="lato-regular fs-16">Gracias.</h6>
                    <h6 className="text-black-50 pb-4 fs-16">22/08/23</h6>
                  </div>
                </div>
              </div>
            </article>
            <article>
              <div className="d-flex borde-caja-comentario-prioridad">
                <div className="mx-3 my-3">
                  <img style={{ width: "30px" }} src={iconoPrueba} alt="logo" />
                </div>
                <div>
                  <div>
                    <h6>ABM </h6>
                    <h6>Para: Asesores </h6>
                  </div>
                  <div>
                    <h6 className="lato-regular fs-16">
                      Chicos, necesito que se fijen en sus mails <br /> sobre el
                      proyecto que tenemos pendiente. Avisen cuando ya hayan
                      completado sus tareas.
                    </h6>
                    <h6 className="lato-regular fs-16">Gracias.</h6>
                    <h6 className="text-black-50 pb-4 fs-16">22/08/23</h6>
                  </div>
                </div>
              </div>
            </article>
            <article>
              <div className="d-flex borde-caja-comentario-prioridad">
                <div className="mx-3 my-3">
                  <img style={{ width: "30px" }} src={iconoPrueba} alt="logo" />
                </div>
                <div>
                  <div>
                    <h6>Liquidaciones </h6>
                    <h6>Para: Asesores </h6>
                  </div>
                  <div>
                    <h6 className="lato-regular fs-16">
                      Chicos, necesito que se fijen en sus mails <br /> sobre el
                      proyecto que tenemos pendiente. Avisen cuando ya hayan
                      completado sus tareas.
                    </h6>
                    <h6 className="lato-regular fs-16">Gracias.</h6>
                    <h6 className="text-black-50 pb-4 fs-16">22/08/23</h6>
                  </div>
                </div>
              </div>
            </article>
            <article>
              <div className="d-flex borde-caja-comentario-prioridad">
                <div className="mx-3 my-3">
                  <img style={{ width: "30px" }} src={iconoPrueba} alt="logo" />
                </div>
                <div>
                  <div>
                    <h6>Founder</h6>
                    <h6>Para: Asesores </h6>
                  </div>
                  <div>
                    <h6 className="lato-regular fs-16">
                      Chicos, necesito que se fijen en sus mails <br /> sobre el
                      proyecto que tenemos pendiente. Avisen cuando ya hayan
                      completado sus tareas.
                    </h6>
                    <h6 className="lato-regular fs-16">Gracias.</h6>
                    <h6 className="text-black-50 pb-4 fs-16">22/08/23</h6>
                  </div>
                </div>
              </div>
            </article>
          </div>
        )}
      </div>
      {/* Con esta logica mostramos solo las cartas de bajas */}
      <div>
        {mostrarBaja && (
          <div className={ darkMode ? " bg-prioridad-noticias-dark px-5 py-3" : " bg-prioridad-noticias px-5 py-3"}>
            <h6 className="py-4  lato-bold text-center  fs-18-a-16">
              Prioridad Baja
            </h6>
            <article>
              <div className="d-flex borde-caja-comentario-prioridad">
                <div className="mx-3 my-3">
                  <img style={{ width: "30px" }} src={iconoPrueba} alt="logo" />
                </div>
                <div>
                  <div>
                    <h6 className="color-verde lato-regular fs-16">NUEVO</h6>
                    <h6>Supervisión Comercial </h6>
                    <h6>Para: Asesores </h6>
                  </div>
                  <div>
                    <h6 className="lato-regular fs-16">
                      Chicos, necesito que se fijen en sus mails <br /> sobre el
                      proyecto que tenemos pendiente. Avisen cuando ya hayan
                      completado sus tareas.
                    </h6>
                    <h6 className="lato-regular fs-16">Gracias.</h6>
                    <h6 className="text-black-50 pb-4 fs-16">22/08/23</h6>
                  </div>
                </div>
              </div>
            </article>
            <article>
              <div className="d-flex borde-caja-comentario-prioridad">
                <div className="mx-3 my-3">
                  <img style={{ width: "30px" }} src={iconoPrueba} alt="logo" />
                </div>
                <div>
                  <div>
                    <h6>ABM </h6>
                    <h6>Para: Asesores </h6>
                  </div>
                  <div>
                    <h6 className="lato-regular fs-16">
                      Chicos, necesito que se fijen en sus mails <br /> sobre el
                      proyecto que tenemos pendiente. Avisen cuando ya hayan
                      completado sus tareas.
                    </h6>
                    <h6 className="lato-regular fs-16">Gracias.</h6>
                    <h6 className="text-black-50 pb-4 fs-16">22/08/23</h6>
                  </div>
                </div>
              </div>
            </article>
            <article>
              <div className="d-flex borde-caja-comentario-prioridad">
                <div className="mx-3 my-3">
                  <img style={{ width: "30px" }} src={iconoPrueba} alt="logo" />
                </div>
                <div>
                  <div>
                    <h6>Liquidaciones </h6>
                    <h6>Para: Asesores </h6>
                  </div>
                  <div>
                    <h6 className="lato-regular fs-16">
                      Chicos, necesito que se fijen en sus mails <br /> sobre el
                      proyecto que tenemos pendiente. Avisen cuando ya hayan
                      completado sus tareas.
                    </h6>
                    <h6 className="lato-regular fs-16">Gracias.</h6>
                    <h6 className="text-black-50 pb-4 fs-16">22/08/23</h6>
                  </div>
                </div>
              </div>
            </article>
            <article>
              <div className="d-flex borde-caja-comentario-prioridad">
                <div className="mx-3 my-3">
                  <img style={{ width: "30px" }} src={iconoPrueba} alt="logo" />
                </div>
                <div>
                  <div>
                    <h6>Founder</h6>
                    <h6>Para: Asesores </h6>
                  </div>
                  <div>
                    <h6 className="lato-regular fs-16">
                      Chicos, necesito que se fijen en sus mails <br /> sobre el
                      proyecto que tenemos pendiente. Avisen cuando ya hayan
                      completado sus tareas.
                    </h6>
                    <h6 className="lato-regular fs-16">Gracias.</h6>
                    <h6 className="text-black-50 pb-4 fs-16">22/08/23</h6>
                  </div>
                </div>
              </div>
            </article>
          </div>
        )}
      </div>
    </div>
  );
};

export default CartasNoticiasCelular;
