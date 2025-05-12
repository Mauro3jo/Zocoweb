// import hoja de estilos (css)
import "./CartasModulos.css";

// import hooks 
import React, { useContext } from "react";

// import context 
import { DarkModeContext } from "../../context/DarkModeContext";

// import librerias
import { Card } from "react-bootstrap";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faFileArrowDown } from "@fortawesome/free-solid-svg-icons";


// import imagenes 
import moduloABMImg from "../../assets/img/moduloabm.png";
import moduloObjecionImg from "../../assets/img/moduloobjeciones.png";
import materialDeVenta from "../../assets/img/materialdeventa.png";
import clover from "../../assets/img/manualclover.png";
import verifone from "../../assets/img/verifone.png";
import cuotasSimpleImg from "../../assets/img/cuotasimple.png";
import guiaCheck from "../../assets/doc/guiaCheck.png";
import detallesPanelCard from "../../assets/doc/gestoresDetallePanel.png";

// import pdf 
import moduloABM from "../../assets/doc/moduloabm.pdf";
import moduloObjeciones from "../../assets/doc/moduloobjeciones.pdf";
import manualVenta1 from "../../assets/doc/materialventa1.pdf";
import manualVenta2 from "../../assets/doc/materialventa2.pdf";
import manualVerifone from "../../assets/doc/manualverifone.pdf";
import manualClover from "../../assets/doc/manualclover.pdf";
import cuotasimple from "../../assets/doc/cuotasimple.pdf";
import check from "../../assets/doc/manualCheck.pdf";
import panelDetalle from "../../assets/doc/panelDeControlDetalle.pdf";

const CartasExtras = () => {
  const { darkMode } = useContext(DarkModeContext);
  return (
    <div className="container">
      <section className="pt-4 precios-cuadro-cartas">
        <div className="py-2">
          <Card
            className="altos-de-cartas "
            style={{ width: "100%", borderRadius: "30px" }}
          >
            <a
              href={moduloABM}
              download
              target="_blank"
              className="text-decoration-none text-white border-0"
            >
              <Card.Img
                className="w-100"
                style={{ height: "250px", objectFit: "cover" }}
                variant="top"
                src={moduloABMImg}
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
                Módulo ABM/Liquidaciones
              </Card.Title>

              <div className="d-flex justify-content-center">
                <div className="btn-descargas-cartas-altas text-center centrado">
                  <a
                    href={moduloABM}
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
              href={moduloObjeciones}
              download
              target="_blank"
              className="text-decoration-none text-white border-0"
            >
              <Card.Img
                className="w-100"
                style={{ height: "250px", objectFit: "cover" }}
                variant="top"
                src={moduloObjecionImg}
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
                Módulo Objeciones
              </Card.Title>
              <div className="d-flex justify-content-center">
                <div className="btn-descargas-cartas-altas text-center centrado">
                  <a
                    href={moduloObjeciones}
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
              href={manualVenta1}
              target="_blank"
              download
              className="text-decoration-none text-white border-0"
            >
              <Card.Img
                className="w-100 bg-white "
                style={{ height: "250px", objectFit: "cover" }}
                variant="top"
                src={materialDeVenta}
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
                Material de venta - Parte 1
              </Card.Title>
              <div className="d-flex justify-content-center">
                <div className="btn-descargas-cartas-altas text-center centrado">
                  <a
                    href={manualVenta1}
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
              href={manualVenta2}
              download
              target="_blank"
              className="text-decoration-none text-white border-0"
            >
              <Card.Img
                className="w-100"
                style={{ height: "250px", objectFit: "cover" }}
                variant="top"
                src={materialDeVenta}
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
                Material de venta - Parte 2
              </Card.Title>
              <div className="d-flex justify-content-center">
                <div className="btn-descargas-cartas-altas text-center centrado">
                  <a
                    href={manualVenta2}
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
              href={manualVerifone}
              download
              target="_blank"
              className="text-decoration-none text-white border-0"
            >
              <Card.Img
                className="w-100"
                style={{ height: "250px", objectFit: "cover" }}
                variant="top"
                src={verifone}
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
                Manual de venta (Verifone)
              </Card.Title>
              <div className="d-flex justify-content-center">
                <div className="btn-descargas-cartas-altas text-center centrado">
                  <a
                    href={manualVerifone}
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
              href={manualClover}
              target="_blank"
              download
              className="text-decoration-none text-white border-0"
            >
              <Card.Img
                className="w-100"
                style={{ height: "250px", objectFit: "cover" }}
                variant="top"
                src={clover}
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
                Manual de venta (Clover)
              </Card.Title>
              <div className="d-flex justify-content-center">
                <div className="btn-descargas-cartas-altas text-center centrado">
                  <a
                    href={manualClover}
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
        <div className=" py-2">
          <Card
            className="altos-de-cartas"
            style={{ width: "100%", borderRadius: "30px" }}
          >
            <a
              href={cuotasimple}
              target="_blank"
              download
              className="text-decoration-none text-white border-0"
            >
              <Card.Img
                className="w-100"
                style={{ height: "250px", objectFit: "cover" }}
                variant="top"
                src={cuotasSimpleImg}
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
                Cuotas simples
              </Card.Title>
              <div className="d-flex justify-content-center">
                <div className="btn-descargas-cartas-altas text-center centrado">
                  <a
                    href={cuotasimple}
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
        <div className=" pt-2 pb-5">
          <Card
            className="altos-de-cartas"
            style={{ width: "100%", borderRadius: "30px" }}
          >
            <a
              href={check}
              target="_blank"
              download
              className="text-decoration-none text-white border-0"
            >
              <Card.Img
                className="w-100"
                style={{ height: "250px", objectFit: "cover" }}
                variant="top"
                src={guiaCheck}
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
               Manual de Check
              </Card.Title>
              <div className="d-flex justify-content-center">
                <div className="btn-descargas-cartas-altas text-center centrado">
                  <a
                    href={check}
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
        <div className=" pt-2 pb-5">
          <Card
            className="altos-de-cartas"
            style={{ width: "100%", borderRadius: "30px" }}
          >
            <a
              href={panelDetalle}
              target="_blank"
              download
              className="text-decoration-none text-white border-0"
            >
              <Card.Img
                className="w-100"
                style={{ height: "250px", objectFit: "cover" }}
                variant="top"
                src={detallesPanelCard}
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
              Detalle del Panel de Control
              </Card.Title>
              <div className="d-flex justify-content-center">
                <div className="btn-descargas-cartas-altas text-center centrado">
                  <a
                    href={panelDetalle}
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

export default CartasExtras;
