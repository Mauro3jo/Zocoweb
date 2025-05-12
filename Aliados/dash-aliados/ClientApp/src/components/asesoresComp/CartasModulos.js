import React, { useContext } from "react";
import { Card } from "react-bootstrap";
import "./CartasModulos.css";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faFileArrowDown } from "@fortawesome/free-solid-svg-icons";

import { DarkModeContext } from "../../context/DarkModeContext";

import industria from "../../assets/doc/industria.pdf";
import competencia from "../../assets/doc/competencia.pdf";
import calculo from "../../assets/doc/calculo.pdf";
import panel from "../../assets/doc/panel.pdf";
import prospecto from "../../assets/doc/prospecto.pdf";
import estructura from "../../assets/doc/estructura.pdf";
import objec from "../../assets/doc/Objeciones.pdf";

import modulo0 from "../../assets/img/modulo0.png";
import modulo1 from "../../assets/img/modulo1.png";
import modulo2 from "../../assets/img/modulo2.png";
import modulo3 from "../../assets/img/modulo3.png";
import modulo4 from "../../assets/img/modulo4.png";
import modulo5 from "../../assets/img/modulo5.png";

const CartasModulos = () => {
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
        <div className="  py-2">
          <Card
            className="altos-de-cartas"
            style={{ width: "100%", borderRadius: "30px" }}
          >
            <a
              href={calculo}
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
                Módulo 2: Competencia
              </Card.Title>
              <div className="d-flex justify-content-around">
                <div className="btn-descargas-cartas-altas text-center centrado">
                  <a
                    href={competencia}
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
        <div className="  py-2">
          <Card
            className="altos-de-cartas"
            style={{ width: "100%", borderRadius: "30px" }}
          >
            <a
              href={calculo}
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
                Módulo 3: Cálculo
              </Card.Title>
              <div className="d-flex justify-content-around">
                <div className="btn-descargas-cartas-altas text-center centrado">
                  <a
                    href={calculo}
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
              href={panel}
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
                Módulo 4: Panel de control
              </Card.Title>
              <div className="d-flex justify-content-around">
                <div className="btn-descargas-cartas-altas text-center centrado">
                  <a
                    href={panel}
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
              href={prospecto}
              target="_blank"
              download
              className="text-decoration-none text-white border-0"
            >
              <Card.Img
                className="w-100"
                style={{ height: "250px", objectFit: "cover" }}
                variant="top"
                src={modulo5}
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
                Módulo 5: Prospecto
              </Card.Title>
              <div className="d-flex justify-content-around">
                <div className="btn-descargas-cartas-altas text-center centrado">
                  <a
                    href={prospecto}
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
              href={estructura}
              target="_blank"
              download
              className="text-decoration-none text-white border-0"
            >
              <Card.Img
                className="w-100"
                style={{ height: "250px", objectFit: "cover" }}
                variant="top"
                src={modulo5}
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
                Módulo 6: Estructura de venta
              </Card.Title>
              <div className="d-flex justify-content-around">
                <div className="btn-descargas-cartas-altas text-center centrado">
                  <a
                    href={estructura}
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
              href={objec}
              target="_blank"
              download
              className="text-decoration-none text-white border-0"
            >
              <Card.Img
                className="w-100"
                style={{ height: "250px", objectFit: "cover" }}
                variant="top"
                src={modulo5}
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
                Objeciones
              </Card.Title>
              <div className="d-flex justify-content-around">
                <div className="btn-descargas-cartas-altas text-center centrado">
                  <a
                    href={objec}
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

export default CartasModulos;
