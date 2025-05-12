import React from "react";
import pdf from "../../assets/doc/Terminos.pdf";

const FooterLanding = () => {
  return (
    <div>
      <footer className="footer cuadro-degradado">
        <p>
          El uso de este sitio web implica la aceptación de los{" "}
          <span className="colorz">
            <a href={pdf} className="zoco" download>
              términos y condiciones
            </a>
          </span>{" "}
          de ZOCO.
        </p>
        <p>Copyright © Zoco 2023</p>
      </footer>
    </div>
  );
};

export default FooterLanding;
