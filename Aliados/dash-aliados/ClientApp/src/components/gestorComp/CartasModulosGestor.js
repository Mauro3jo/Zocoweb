import React, { useContext } from "react";
import { Card } from "react-bootstrap";
import "./CartasModulosGestor.css";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faFileArrowDown } from "@fortawesome/free-solid-svg-icons";
import { DarkModeContext } from "../../context/DarkModeContext";
import industria from "../../assets/doc/industriagestor.pdf";
import usoPanel from "../../assets/doc/usopanelgestor.pdf";
import casuistica from "../../assets/doc/casuisticagestor.pdf";
import glosario from "../../assets/doc/glosario.pdf";
import modulo1 from "../../assets/img/modulo1.png";
import modulo2 from "../../assets/img/modulo2.png";
import modulo3 from "../../assets/img/modulo3.png";
import modulo4 from "../../assets/img/cuadrogestoria.png";

const CartasModulosGestor = () => {
  const { darkMode } = useContext(DarkModeContext);
  return (
    <div className="container">
      <section className="pt-4 precios-cuadro-cartas">
        <div className="py-2">
          <Card
            className="altos-de-cartas"
            style={{ width: "100%", borderRadius: "30px" }}
          >
            <a
              href={industria}
              download
              target="_blank"
              className="text-decoration-none text-white border-0"
            >
              <Card.Img
                className="w-100"
                style={{ height: "250px", objectFit: "cover" }}
                variant="top"
                src={modulo1}
              />
            </a>

            <Card.Body
              className={
                darkMode
                  ? "bg-border-cartas-altas-dark"
                  : "bg-border-cartas-altas"
              }
            >
              <Card.Title className="text-center lato-regular fs-16 py-2">
                Módulo 1: Industria
              </Card.Title>
              <div className="d-flex justify-content-around">
                <div className="btn-descargas-cartas-altas text-center centrado">
                  <a
                    href={industria}
                    download
                    target="_blank"
                    className="text-decoration-none text-white border-0"
                  >
                    <FontAwesomeIcon className="me-2" icon={faFileArrowDown} />
                    PDF
                  </a>
                </div>
              </div>
            </Card.Body>
          </Card>
        </div>
        <div className="py-2">
          <Card
            className="altos-de-cartas"
            style={{ width: "100%", borderRadius: "30px" }}
          >
            <a
              href={usoPanel}
              target="_blank"
              download
              className="text-decoration-none text-white border-0"
            >
              <Card.Img
                className="w-100 bg-white "
                style={{ height: "250px", objectFit: "cover" }}
                variant="top"
                src={modulo2}
              />
            </a>

            <Card.Body
              className={
                darkMode
                  ? "bg-border-cartas-altas-dark"
                  : "bg-border-cartas-altas"
              }
            >
              <Card.Title className="text-center lato-regular fs-16 py-2">
                Módulo 2: Uso del Panel
              </Card.Title>
              <div className="d-flex justify-content-around">
                <div className="btn-descargas-cartas-altas text-center centrado">
                  <a
                    href={usoPanel}
                    download
                    target="_blank"
                    className="text-decoration-none text-white border-0"
                  >
                    <FontAwesomeIcon className="me-2" icon={faFileArrowDown} />
                    PDF
                  </a>
                </div>
              </div>
            </Card.Body>
          </Card>
        </div>
        <div className="py-2">
          <Card
            className="altos-de-cartas"
            style={{ width: "100%", borderRadius: "30px" }}
          >
            <a
              href={casuistica}
              download
              target="_blank"
              className="text-decoration-none text-white border-0"
            >
              <Card.Img
                className="w-100"
                style={{ height: "250px", objectFit: "cover" }}
                variant="top"
                src={modulo3}
              />
            </a>

            <Card.Body
              className={
                darkMode
                  ? "bg-border-cartas-altas-dark"
                  : "bg-border-cartas-altas"
              }
            >
              <Card.Title className="text-center lato-regular fs-16 py-2">
                Módulo 3: Casuísticas
              </Card.Title>
              <div className="d-flex justify-content-around">
                <div className="btn-descargas-cartas-altas text-center centrado">
                  <a
                    href={casuistica}
                    download
                    target="_blank"
                    className="text-decoration-none text-white border-0"
                  >
                    <FontAwesomeIcon className="me-2" icon={faFileArrowDown} />
                    PDF
                  </a>
                </div>
              </div>
            </Card.Body>
          </Card>
        </div>
        <div className="py-2">
          <Card
            className="altos-de-cartas"
            style={{ width: "100%", borderRadius: "30px" }}
          >
            <a
              href={glosario}
              download
              target="_blank"
              className="text-decoration-none text-white border-0"
            >
              <Card.Img
                className="w-100"
                style={{ height: "250px", objectFit: "cover" }}
                variant="top"
                src={modulo4}
              />
            </a>

            <Card.Body
              className={
                darkMode
                  ? "bg-border-cartas-altas-dark"
                  : "bg-border-cartas-altas"
              }
            >
              <Card.Title className="text-center lato-regular fs-16 py-2">
                Glosario Gestoría
              </Card.Title>
              <div className="d-flex justify-content-around">
                <div className="btn-descargas-cartas-altas text-center centrado">
                  <a
                    href={glosario}
                    download
                    target="_blank"
                    className="text-decoration-none text-white border-0"
                  >
                    <FontAwesomeIcon className="me-2" icon={faFileArrowDown} />
                    PDF
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

export default CartasModulosGestor;
