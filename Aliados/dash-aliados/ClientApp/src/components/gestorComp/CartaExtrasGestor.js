// import hoja de estilos (css)
import "./CartasModulosGestor.css";

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
import cuotasSimpleImg from "../../assets/img/cuotasimple.png";
import guiaCheck from "../../assets/doc/guiaCheck.png";
import manualPeticiones from "../../assets/img/manualPeticiones.png";
import carpetaGestores from "../../assets/doc/gestoresCarpetaGestoria.png";
import detallePanelControl from "../../assets/doc/gestoresDetallePanel.png";

// import pdf
import moduloABM from "../../assets/doc/moduloabm.pdf";
import moduloObjeciones from "../../assets/doc/moduloobjeciones.pdf";
import cuotasimple from "../../assets/doc/cuotasimple.pdf";
import check from "../../assets/doc/manualCheckGestor.pdf";
import peticiones from "../../assets/doc/manualPeticiones.pdf";
import carpetaGestor from "../../assets/doc/carpetaGestor.pdf";
import panelDeControlDetalle from "../../assets/doc/panelDeControlDetalle.pdf";

const CartasExtrasGestor = () => {
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
              href={peticiones}
              target="_blank"
              download
              className="text-decoration-none text-white border-0"
            >
              <Card.Img
                className="w-100"
                style={{ height: "250px", objectFit: "cover" }}
                variant="top"
                src={manualPeticiones}
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
                Manual de Peticiones
              </Card.Title>
              <div className="d-flex justify-content-center">
                <div className="btn-descargas-cartas-altas text-center centrado">
                  <a
                    href={peticiones}
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
              href={carpetaGestor}
              target="_blank"
              download
              className="text-decoration-none text-white border-0"
            >
              <Card.Img
                className="w-100"
                style={{ height: "250px", objectFit: "cover" }}
                variant="top"
                src={carpetaGestores}
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
                Carpeta de Gestoría
              </Card.Title>
              <div className="d-flex justify-content-center">
                <div className="btn-descargas-cartas-altas text-center centrado">
                  <a
                    href={carpetaGestor}
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
              href={panelDeControlDetalle}
              target="_blank"
              download
              className="text-decoration-none text-white border-0"
            >
              <Card.Img
                className="w-100"
                style={{ height: "250px", objectFit: "cover" }}
                variant="top"
                src={detallePanelControl}
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
                    href={panelDeControlDetalle}
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

export default CartasExtrasGestor;
