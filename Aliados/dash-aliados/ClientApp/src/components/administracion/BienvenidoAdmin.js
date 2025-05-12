import React, { useContext } from "react";
import { DarkModeContext } from "../../context/DarkModeContext";

const BienvenidoAdmin = () => {
  const { darkMode } = useContext(DarkModeContext);

  return (
    <section
      className={
        darkMode
          ? " contenedor-panel-control-dark py-4  container"
          : "py-4  contenedor-panel-control container"
      }
    >
      <div className="">
        <div className="row">
          <div className="col-xl-2 col-12  my-3 ">
            <h6 className="text-center heavy-900 fs-16 ms-2">
              {" "}
              Bienvenido/a <br />{" "}
              <span className="text-center heavy-900 color-verde fs-20 line-h-26">
                {" "}
                Administrador
              </span>{" "}
            </h6>
          </div>

          <div className="col-xl-10 col-12">
            <div>
              <article className="borde-caja-panel"></article>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default BienvenidoAdmin;
