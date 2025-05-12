import React, { useContext } from "react";
import iconoPrueba from "../../assets/img/icono-importante.png";
import { DarkModeContext } from "../../context/DarkModeContext";
const CartasNoticias = () => {

  const { darkMode } = useContext(DarkModeContext);

  return (
    <div className="container">
      <div className="row">
        <section className="col-12 col-lg-6">
          <div className={ darkMode ? " bg-prioridad-noticias-dark px-5 py-3" : " bg-prioridad-noticias px-5 py-3"}>
            <h6 className="color-rojo py-4  lato-bold text-center  fs-18-a-16">
              Prioridad Alta
            </h6>
            <article>
              <div className="d-flex borde-caja-comentario-prioridad">
                <div className="mx-3 my-3">
                  <img className="" src={iconoPrueba} alt="logo" />
                </div>
                <div>
                  <div>
                    <h6 className="color-verde lato-regular fs-16">NUEVO</h6>
                    <h6>Supervisión Comercial </h6>
                    <h6>Para: Asesores </h6>
                  </div>
                  <div>
                    <h6 className="lato-regular fs-16">
                      Chicos, necesito que se fijen en sus mails sobre el
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
              <div className="d-flex borde-caja-comentario-prioridad mt-4">
                <div className="mx-3 my-3">
                  <img className="" src={iconoPrueba} alt="logo" />
                </div>
                <div>
                  <div>
                    <h6 className="fs-18-a-16 lato-bold">ABM </h6>
                    <h6 className="lato-bold fs-16">Para: Todos </h6>
                  </div>
                  <div>
                    <h6 className="lato-regular fs-16">
                      Chicos, necesito que se fijen en sus mails sobre el
                      proyecto que tenemos pendiente. Avisen cuando ya hayan
                      completado sus tareas.
                    </h6>
                    <h6 className="lato-regular fs-16">Gracias.</h6>
                    <h6 className="text-black-50 pb-4 fs-16">21/08/23</h6>
                  </div>
                </div>
              </div>
            </article>
            <article>
              <div className="d-flex borde-caja-comentario-prioridad mt-4">
                <div className="mx-3 my-3">
                  <img className="" src={iconoPrueba} alt="logo" />
                </div>
                <div>
                  <div>
                    <h6 className="fs-18-a-16 lato-bold">Liquidaciones </h6>
                    <h6 className="lato-bold fs-16">Para: Todos </h6>
                  </div>
                  <div>
                    <h6 className="lato-regular fs-16">
                      Chicos, necesito que se fijen en sus mails sobre el
                      proyecto que tenemos pendiente. Avisen cuando ya hayan
                      completado sus tareas.
                    </h6>
                    <h6 className="lato-regular fs-16">Gracias.</h6>
                    <h6 className="text-black-50 pb-4 fs-16">19/08/23</h6>
                  </div>
                </div>
              </div>
            </article>
            <article>
              <div className="d-flex borde-caja-comentario-prioridad mt-4">
                <div className="mx-3 my-3">
                  <img className="" src={iconoPrueba} alt="logo" />
                </div>
                <div>
                  <div>
                    <h6 className="fs-18-a-16 lato-bold">Founder</h6>
                    <h6 className="lato-bold fs-16">
                      Para: Supervisión Comercial, Francisco Quiroga, Paula
                      Aranda, ABM{" "}
                    </h6>
                  </div>
                  <div>
                    <h6 className="lato-regular fs-16">
                      Chicos, necesito que se fijen en sus mails sobre el
                      proyecto que tenemos pendiente. Avisen cuando ya hayan
                      completado sus tareas.
                    </h6>
                    <h6 className="lato-regular fs-16">Gracias.</h6>
                    <h6 className="text-black-50 pb-4 fs-16">15/08/23</h6>
                  </div>
                </div>
              </div>
            </article>
          </div>
        </section>
        <section className="col-12 col-lg-6">
          <div className={ darkMode ? " bg-prioridad-noticias-dark px-5 py-3" : " bg-prioridad-noticias px-5 py-3"}>
            <h6 className="py-4  lato-bold text-center  fs-18-a-16">
              Prioridad Baja
            </h6>
            <article>
              <div className="d-flex borde-caja-comentario-prioridad">
                <div className="mx-3 my-3">
                  <img className="" src={iconoPrueba} alt="logo" />
                </div>
                <div>
                  <div>
                    <h6 className="color-verde lato-regular fs-16">NUEVO</h6>
                    <h6>Supervisión Comercial </h6>
                    <h6>Para: Asesores </h6>
                  </div>
                  <div>
                    <h6 className="lato-regular fs-16">
                      Chicos, necesito que se fijen en sus mails sobre el
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
              <div className="d-flex borde-caja-comentario-prioridad mt-4">
                <div className="mx-3 my-3">
                  <img className="" src={iconoPrueba} alt="logo" />
                </div>
                <div>
                  <div>
                    <h6 className="fs-18-a-16 lato-bold">ABM </h6>
                    <h6 className="lato-bold fs-16">Para: Todos </h6>
                  </div>
                  <div>
                    <h6 className="lato-regular fs-16">
                      Chicos, necesito que se fijen en sus mails sobre el
                      proyecto que tenemos pendiente. Avisen cuando ya hayan
                      completado sus tareas.
                    </h6>
                    <h6 className="lato-regular fs-16">Gracias.</h6>
                    <h6 className="text-black-50 pb-4 fs-16">21/08/23</h6>
                  </div>
                </div>
              </div>
            </article>
            <article>
              <div className="d-flex borde-caja-comentario-prioridad mt-4">
                <div className="mx-3 my-3">
                  <img className="" src={iconoPrueba} alt="logo" />
                </div>
                <div>
                  <div>
                    <h6 className="fs-18-a-16 lato-bold">Liquidaciones </h6>
                    <h6 className="lato-bold fs-16">Para: Todos </h6>
                  </div>
                  <div>
                    <h6 className="lato-regular fs-16">
                      Chicos, necesito que se fijen en sus mails sobre el
                      proyecto que tenemos pendiente. Avisen cuando ya hayan
                      completado sus tareas.
                    </h6>
                    <h6 className="lato-regular fs-16">Gracias.</h6>
                    <h6 className="text-black-50 pb-4 fs-16">19/08/23</h6>
                  </div>
                </div>
              </div>
            </article>
            <article>
              <div className="d-flex borde-caja-comentario-prioridad mt-4">
                <div className="mx-3 my-3">
                  <img className="" src={iconoPrueba} alt="logo" />
                </div>
                <div>
                  <div>
                    <h6 className="fs-18-a-16 lato-bold">Founder</h6>
                    <h6 className="lato-bold fs-16">
                      Para: Supervisión Comercial, Francisco Quiroga, Paula
                      Aranda, ABM{" "}
                    </h6>
                  </div>
                  <div>
                    <h6 className="lato-regular fs-16">
                      Chicos, necesito que se fijen en sus mails sobre el
                      proyecto que tenemos pendiente. Avisen cuando ya hayan
                      completado sus tareas.
                    </h6>
                    <h6 className="lato-regular fs-16">Gracias.</h6>
                    <h6 className="text-black-50 pb-4 fs-16">15/08/23</h6>
                  </div>
                </div>
              </div>
            </article>
          </div>
        </section>
      </div>
    </div>
  );
};

export default CartasNoticias;
