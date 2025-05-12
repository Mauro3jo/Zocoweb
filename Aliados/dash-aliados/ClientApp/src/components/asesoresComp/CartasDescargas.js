// import css
import "./CartasDescargas.css";

// import hooks, context y librerias
import React, { useContext } from "react";
import { Card } from "react-bootstrap";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faFileArrowDown } from "@fortawesome/free-solid-svg-icons";

// import assets de la carpeta img
import fichaAltaFisica from "../../assets/img/Fichadealtafísica.png";
import fichaAltaJuridica from "../../assets/img/Fichadealtajurídica.png";
import tablaCoeficiente from "../../assets/img/Tabladecoeficientes.png";
import fichaModificacion from "../../assets/img/Fichademodificación.png";
import cardMembrete from "../../assets/doc/membreteCard.png";

// import assets de la carpeta doc los pdfs
import pdfTablaCoeficiente from "../../assets/doc/tablaCoeficiente.pdf";
import pdfAltaFisica from "../../assets/doc/altaFisica.pdf";
import pdfAltaJuridica from "../../assets/doc/altaJuridica.pdf";
import pdfAutorizacion from "../../assets/doc/autorizacion.pdf";
import docMembrete from "../../assets/doc/Membrete.docx";

import { DarkModeContext } from "../../context/DarkModeContext";

const CartasDescargas = () => {
  const { darkMode } = useContext(DarkModeContext);
  return (
    <div className="container">
      <section className="pt-4 precios-cuadro-cartas">
        <div className="pb-4">
          <Card
            className="altos-de-cartas "
            style={{ width: "100%", borderRadius: "30px" }}
          >
            <a
              href={pdfTablaCoeficiente}
              download
              target="_blank"
              className="text-decoration-none text-white border-0"
            >
              <Card.Img
                className="w-100"
                style={{ height: "250px", objectFit: "cover" }}
                variant="top"
                src={tablaCoeficiente}
              />
            </a>

            <Card.Body
              className={
                darkMode
                  ? "bg-border-cartas-altas-dark"
                  : "bg-border-cartas-altas"
              }
            >
              <Card.Title className="text-center lato-regular fs-16 pt-1">
                Tabla de coeficientes y Plazos <br /> de acreditación
              </Card.Title>

              <div className="d-flex justify-content-center">
                <div className="btn-descargas-cartas-altas text-center centrado">
                  <a
                    href={pdfTablaCoeficiente}
                    download
                    target="_blank"
                    className="text-decoration-none text-white border-0"
                  >
                    <FontAwesomeIcon className="me-2" icon={faFileArrowDown} />
                    Descargas
                  </a>
                </div>
              </div>
            </Card.Body>
          </Card>
        </div>     
        <div className="pb-4">
          <Card
            className="altos-de-cartas"
            style={{ width: "100%", borderRadius: "30px" }}
          >
            <a
              href={pdfAltaFisica}
              download
              target="_blank"
              className="text-decoration-none text-white border-0"
            >
              <Card.Img
                className="w-100"
                style={{ height: "250px", objectFit: "cover" }}
                variant="top"
                src={fichaAltaFisica}
              />
            </a>

            <Card.Body
              className={
                darkMode
                  ? "bg-border-cartas-altas-dark"
                  : "bg-border-cartas-altas"
              }
            >
              <Card.Title className="text-center lato-regular fs-16 pt-1">
                Ficha de alta <br /> (persona física)
              </Card.Title>
              <div className="d-flex justify-content-center">
                <div className="btn-descargas-cartas-altas text-center centrado">
                  <a
                    href={pdfAltaFisica}
                    download
                    target="_blank"
                    className="text-decoration-none text-white border-0"
                  >
                    <FontAwesomeIcon className="me-2" icon={faFileArrowDown} />
                    Descargas
                  </a>
                </div>
              </div>
            </Card.Body>
          </Card>
        </div>

        <div className="pt-2 pb-4">
          <Card
            className="altos-de-cartas"
            style={{ width: "100%", borderRadius: "30px" }}
          >
            <a
              href={pdfAltaJuridica}
              download
              target="_blank"
              className="text-decoration-none text-white border-0"
            >
              <Card.Img
                className="w-100"
                style={{ height: "250px", objectFit: "cover" }}
                variant="top"
                src={fichaAltaJuridica}
              />
            </a>

            <Card.Body
              className={
                darkMode
                  ? "bg-border-cartas-altas-dark"
                  : "bg-border-cartas-altas"
              }
            >
              <Card.Title className="text-center lato-regular fs-16 pt-1">
                Ficha de alta <br /> (persona jurídica)
              </Card.Title>
              <div className="d-flex justify-content-center">
                <div className="btn-descargas-cartas-altas text-center centrado">
                  <a
                    href={pdfAltaJuridica}
                    download
                    target="_blank"
                    className="text-decoration-none text-white border-0"
                  >
                    <FontAwesomeIcon className="me-2" icon={faFileArrowDown} />
                    Descargas
                  </a>
                </div>
              </div>
            </Card.Body>
          </Card>
        </div>
        <div className=" pt-2 pb-4">
          <Card
            className="altos-de-cartas"
            style={{ width: "100%", borderRadius: "30px" }}
          >
            <a
              href={pdfAutorizacion}
              target="_blank"
              download
              className="text-decoration-none text-white border-0"
            >
              <Card.Img
                className="w-100"
                style={{ height: "250px", objectFit: "cover" }}
                variant="top"
                src={fichaModificacion}
              />
            </a>

            <Card.Body
              className={
                darkMode
                  ? "bg-border-cartas-altas-dark"
                  : "bg-border-cartas-altas"
              }
            >
              <Card.Title className="text-center lato-regular fs-16 pt-1">
                Ficha de autorización <br />{" "}
                <span className="ocultar-div">con los tiempos</span>
              </Card.Title>
              <div className="d-flex justify-content-center">
                <div className="btn-descargas-cartas-altas text-center centrado">
                  <a
                    href={pdfAutorizacion}
                    target="_blank"
                    download
                    className="text-decoration-none text-white border-0"
                  >
                    <FontAwesomeIcon className="me-2" icon={faFileArrowDown} />
                    Descargas
                  </a>
                </div>
              </div>
            </Card.Body>
          </Card>
        </div>
        <div className=" pt-2 pb-4">
          <Card
            className="altos-de-cartas"
            style={{ width: "100%", borderRadius: "30px" }}
          >
            <a
              href={docMembrete}
              target="_blank"
              download
              className="text-decoration-none text-white border-0"
            >
              <Card.Img
                className="w-100"
                style={{ height: "250px", objectFit: "cover" }}
                variant="top"
                src={cardMembrete}
              />
            </a>

            <Card.Body
              className={
                darkMode
                  ? "bg-border-cartas-altas-dark"
                  : "bg-border-cartas-altas"
              }
            >
              <Card.Title className="text-center lato-regular fs-16 pt-1">
                Membrete Zoco <br />{" "}
                <span className="ocultar-div">cuidado con los tiempos</span>
              </Card.Title>
              <div className="d-flex justify-content-center">
                <div className="btn-descargas-cartas-altas text-center centrado">
                  <a
                    href={docMembrete}
                    target="_blank"
                    download
                    className="text-decoration-none text-white border-0"
                  >
                    <FontAwesomeIcon className="me-2" icon={faFileArrowDown} />
                    Descargas
                  </a>
                </div>
              </div>
            </Card.Body>
          </Card>
        </div>
      </section>
    </div>
  );
};

export default CartasDescargas;
