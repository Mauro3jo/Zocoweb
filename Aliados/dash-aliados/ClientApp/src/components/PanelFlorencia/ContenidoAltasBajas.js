import React, { useState, useContext } from 'react';
import { DarkModeContext } from '../../context/DarkModeContext';
import { Button, Table, Row, Col, Form } from 'react-bootstrap';
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faFileExcel, faCircleArrowDown, faCircleArrowUp, faTable, faSheetPlastic } from "@fortawesome/free-solid-svg-icons";
import { ReactComponent as DisponibleIcon } from "../../assets/svg/Recurso 7.svg";
import { ReactComponent as AltaIcon } from "../../assets/svg/Recurso 8.svg";
import { ReactComponent as BajaIcon } from "../../assets/svg/Recurso 9.svg";
import { ReactComponent as ServicioIcon } from "../../assets/svg/Recurso 10.svg";
import { ReactComponent as ExtraviadaIcon } from "../../assets/svg/Recurso 12.svg";
import { FacturacionContext } from '../../context/FacturacionContext';

const ContenidoAltasBajas = ({ altas = [], bajas = [] }) => {
  const { darkMode } = useContext(DarkModeContext);
  const {datosExcelCRMsemanal} =useContext(FacturacionContext)
  const [mostrarAltas, setMostrarAltas] = useState(true);
  const [filaExtendida, setFilaExtendida] = useState(null); // Estado para fila expandida

  const handleFilaClick = (index) => {
    setFilaExtendida(filaExtendida === index ? null : index); // Alternar entre expandir y contraer la fila
  };

  const tableRowStyle = {
    transition: "transform 0.2s ease-in-out",
  };

  const tableCellStyle = (isExpanded) => ({
    whiteSpace: isExpanded ? "normal" : "nowrap",
    overflow: isExpanded ? "visible" : "hidden",
    textOverflow: isExpanded ? "clip" : "ellipsis",
    height: isExpanded ? "auto" : "60px",
  });
  const getEstadoIcon = (estado) => {
    switch (estado) {
      case "ALTA":
        return <AltaIcon style={{ width: 24, height: 24 }} />;
      case "BAJA":
        return <BajaIcon style={{ width: 24, height: 24 }} />;
      case "SERVICIO.TECNICO":
        return <ServicioIcon style={{ width: 24, height: 24 }} />;
      case "DISPONIBLE":
        return <DisponibleIcon style={{ width: 24, height: 24 }} />;
      case "EXTRAVIADA":
        return <ExtraviadaIcon style={{ width: 24, height: 24 }} />;
      default:
        return estado; // En caso de que no haya un ícono para el estado
    }
  };

  return (
    <div>
      <div className="container" style={{ marginBottom: "10px" }}>
        <section className='container'>
          <div className="d-flex flex-column flex-md-row justify-content-center align-items-center">
            <Row className="align-items-center">

            <Col>
                            <Form.Label className="fs-18 lato-bold mb-0">Altas del mes:</Form.Label>
                        </Col>
                        <Col xs="auto">
                            <div className="lato-bold d-flex align-items-center">
                                <FontAwesomeIcon className="me-2 fs-18 color-verde" icon={faCircleArrowUp} />
                                <span className="fs-18">{datosExcelCRMsemanal?.totalAltas ?? 'Sin datos'}</span>
                            </div>
                        </Col>

                        <Button className={
                                darkMode
                                    ? "d-flex btn-check-modal-dark centrado border-0 fs-14 my-2 mx-2 lato-bold"
                                    : "d-flex btn-check-modal centrado border-0 fs-14 my-2 mx-2 lato-bold"
                            } onClick={() => setMostrarAltas(true)}>
                              <FontAwesomeIcon className="me-2" icon={faTable} />
              Ver Altas
            </Button>
            <Button className={
                                darkMode
                                    ? "d-flex btn-check-modal-dark centrado border-0 fs-14 my-2 mx-2 lato-bold"
                                    : "d-flex btn-check-modal centrado border-0 fs-14 my-2 mx-2 lato-bold"
                            } onClick={() => setMostrarAltas(false)}>
                              <FontAwesomeIcon className="me-2" icon={faTable} />
              Ver Bajas
            </Button>
                        
                        <Col xs="auto">
                            <Form.Label className="fs-18 lato-bold mb-0">Bajas del mes:</Form.Label>
                        </Col>
                        <Col xs="auto">
                            <div className="lato-bold d-flex align-items-center">
                                <FontAwesomeIcon className="me-2 fs-18 color-rojo" icon={faCircleArrowDown} />
                                <span className="fs-18">{datosExcelCRMsemanal?.totalBajas ?? 'Sin datos'}</span>
                            </div>
                        </Col>

            </Row>
          
            
        
          </div>
       

        </section>
       
      </div>

      <section translate="no" className="container py-analisis-grafica">
        <article>
          <div className={darkMode ? "container table-responsive py-3 px-5" : "container table-responsive py-3 px-5"}>
            <Table responsive striped hover>
              <thead className="bg-dark py-2">
                <tr className="text-center tabla-thead">
                  {/* Columnas de la tabla de Altas */}
                  {mostrarAltas ? (
                    <>
                      <th className={
                                                darkMode
                                                    ? "bg-white text-dark border-tabla-izquierda border-0 lato-regular fs-14 py-3"
                                                    : "bg-dark text-white border-tabla-izquierda border-0 lato-regular fs-14 py-3"
                                            } scope='col'>Estado</th>
                      <th className={
                                                darkMode
                                                    ? "bg-white text-dark border-tabla border-0 lato-regular fs-14 py-3"
                                                    : "bg-dark text-white border-tabla border-0 lato-regular fs-14 py-3"
                                            } scope='col'>N° Terminal</th>
                      <th className={
                                                darkMode
                                                    ? "bg-white text-dark border-tabla border-0 lato-regular fs-14 py-3"
                                                    : "bg-dark text-white border-tabla border-0 lato-regular fs-14 py-3"
                                            } scope='col'>Nombre de Fantasía</th>
                      <th className={
                                                darkMode
                                                    ? "bg-white text-dark border-tabla border-0 lato-regular fs-14 py-3"
                                                    : "bg-dark text-white border-tabla border-0 lato-regular fs-14 py-3"
                                            } scope='col'>Provincia</th>
                      <th className={
                                                darkMode
                                                    ? "bg-white text-dark border-tabla border-0 lato-regular fs-14 py-3"
                                                    : "bg-dark text-white border-tabla border-0 lato-regular fs-14 py-3"
                                            } scope='col'>CUIT</th>
                      <th className={
                                                darkMode
                                                    ? "bg-white text-dark border-tabla border-0 lato-regular fs-14 py-3"
                                                    : "bg-dark text-white border-tabla border-0 lato-regular fs-14 py-3"
                                            } scope='col'>Gestor</th>
                      <th className={
                                                darkMode
                                                    ? "bg-white text-dark border-tabla-derecha border-0 lato-regular fs-14 py-3"
                                                    : "bg-dark text-white border-tabla-derecha border-0 lato-regular fs-14 py-3"
                                            } scope='col'>Fecha de Alta</th>
                    </>
                  ) : (
                    // Columnas de la tabla de Bajas
                    <>
                      <th className={
                                                darkMode
                                                    ? "bg-white text-dark border-tabla-izquierda border-0 lato-regular fs-14 py-3"
                                                    : "bg-dark text-white border-tabla-izquierda border-0 lato-regular fs-14 py-3"
                                            } scope='col'>N° Terminal</th>
                      <th className={
                                                darkMode
                                                    ? "bg-white text-dark border-tabla border-0 lato-regular fs-14 py-3"
                                                    : "bg-dark text-white border-tabla border-0 lato-regular fs-14 py-3"
                                            } scope='col'>Nombre de Fantasía</th>
                      <th className={
                                                darkMode
                                                    ? "bg-white text-dark border-tabla border-0 lato-regular fs-14 py-3"
                                                    : "bg-dark text-white border-tabla border-0 lato-regular fs-14 py-3"
                                            } scope='col'>Provincia</th>
                      <th className={
                                                darkMode
                                                    ? "bg-white text-dark border-tabla border-0 lato-regular fs-14 py-3"
                                                    : "bg-dark text-white border-tabla border-0 lato-regular fs-14 py-3"
                                            } scope='col'>Motivo</th>
                      <th className={
                                                darkMode
                                                    ? "bg-white text-dark border-tabla border-0 lato-regular fs-14 py-3"
                                                    : "bg-dark text-white border-tabla border-0 lato-regular fs-14 py-3"
                                            } scope='col'>Baja por</th>
                      <th className={
                                                darkMode
                                                    ? "bg-white text-dark border-tabla border-0 lato-regular fs-14 py-3"
                                                    : "bg-dark text-white border-tabla border-0 lato-regular fs-14 py-3"
                                            } scope='col'>Domicilio</th>
                      <th className={
                                                darkMode
                                                    ? "bg-white text-dark border-tabla-derecha border-0 lato-regular fs-14 py-3"
                                                    : "bg-dark text-white border-tabla-derecha border-0 lato-regular fs-14 py-3"
                                            } scope='col'>Fecha de Baja</th>
                    </>
                  )}
                </tr>
              </thead>
              <tbody className="text-center">
                {mostrarAltas ? (
                  altas.length > 0 ? (
                    // Renderizar filas de Altas
                    altas.map((dato, index) => (
                      <tr   key={index}
                      onClick={() => handleFilaClick(index)} // Click para expandir la fila
                      className={darkMode ? "bg-dark text-white" : "bg-white text-dark"}
                      style={tableRowStyle}>
                        <td className={
                                                        darkMode
                                                            ? "fs-14 lato-regular py-4 prority-4 text-white "
                                                            : "fs-14 lato-regular py-4 prority-4 "
                                                    } style={tableCellStyle(filaExtendida === index)}>{getEstadoIcon(dato.estado)}</td>
                        <td className={
                                                        darkMode
                                                            ? "fs-14 lato-regular py-4 prority-4 text-white "
                                                            : "fs-14 lato-regular py-4 prority-4 "
                                                    } style={tableCellStyle(filaExtendida === index)}>{dato.nDeTerminal}</td>
                        <td className={
                                                        darkMode
                                                            ? "fs-14 lato-regular py-4 prority-4 text-white "
                                                            : "fs-14 lato-regular py-4 prority-4 "
                                                    } style={tableCellStyle(filaExtendida === index)}>{dato.nombreDeFantasia}</td>
                        <td className={
                                                        darkMode
                                                            ? "fs-14 lato-regular py-4 prority-4 text-white "
                                                            : "fs-14 lato-regular py-4 prority-4 "
                                                    } style={tableCellStyle(filaExtendida === index)}>{dato.provincia}</td>
                        <td className={
                                                        darkMode
                                                            ? "fs-14 lato-regular py-4 prority-4 text-white "
                                                            : "fs-14 lato-regular py-4 prority-4 "
                                                    } style={tableCellStyle(filaExtendida === index)}>{dato.cuit}</td>
                        <td className={
                                                        darkMode
                                                            ? "fs-14 lato-regular py-4 prority-4 text-white "
                                                            : "fs-14 lato-regular py-4 prority-4 "
                                                    } style={tableCellStyle(filaExtendida === index)}>{dato.gestor}</td>
                        <td className={
                                                        darkMode
                                                            ? "fs-14 lato-regular py-4 prority-4 text-white "
                                                            : "fs-14 lato-regular py-4 prority-4 "
                                                    } style={tableCellStyle(filaExtendida === index)}>{dato.fechaDeAlta}</td>
                      </tr>
                    ))
                  ) : (
                    <tr>
                      <td colSpan="7">No hay datos de altas disponibles.</td>
                    </tr>
                  )
                ) : (
                  bajas.length > 0 ? (
                    // Renderizar filas de Bajas
                    bajas.map((dato, index) => (
                      <tr   key={index}
                      onClick={() => handleFilaClick(index)} // Click para expandir la fila
                      className={darkMode ? "bg-dark text-white" : "bg-white text-dark"}
                      style={tableRowStyle}>
                        <td className={
                                                        darkMode
                                                            ? "fs-14 lato-regular py-4 prority-4 text-white "
                                                            : "fs-14 lato-regular py-4 prority-4 "
                                                    } style={tableCellStyle(filaExtendida === index)}>{dato.nDeTerminal}</td>
                        <td className={
                                                        darkMode
                                                            ? "fs-14 lato-regular py-4 prority-4 text-white "
                                                            : "fs-14 lato-regular py-4 prority-4 "
                                                    } style={tableCellStyle(filaExtendida === index)}>{dato.nombreDeFantasia}</td>
                        <td className={
                                                        darkMode
                                                            ? "fs-14 lato-regular py-4 prority-4 text-white "
                                                            : "fs-14 lato-regular py-4 prority-4 "
                                                    } style={tableCellStyle(filaExtendida === index)}>{dato.provincia}</td>
                        <td className={
                                                        darkMode
                                                            ? "fs-14 lato-regular py-4 prority-4 text-white "
                                                            : "fs-14 lato-regular py-4 prority-4 "
                                                    } style={tableCellStyle(filaExtendida === index)}>{dato.motivo}</td>
                        <td className={
                                                        darkMode
                                                            ? "fs-14 lato-regular py-4 prority-4 text-white "
                                                            : "fs-14 lato-regular py-4 prority-4 "
                                                    } style={tableCellStyle(filaExtendida === index)}>{dato.bajaPor}</td>
                        <td className={
                                                        darkMode
                                                            ? "fs-14 lato-regular py-4 prority-4 text-white "
                                                            : "fs-14 lato-regular py-4 prority-4 "
                                                    } style={tableCellStyle(filaExtendida === index)}>{dato.domicilio}</td>
                        <td className={
                                                        darkMode
                                                            ? "fs-14 lato-regular py-4 prority-4 text-white "
                                                            : "fs-14 lato-regular py-4 prority-4 "
                                                    } style={tableCellStyle(filaExtendida === index)}>{dato.fechaDeBaja}</td>
                      </tr>
                    ))
                  ) : (
                    <tr>
                      <td colSpan="7">No hay datos de bajas disponibles.</td>
                    </tr>
                  )
                )}
              </tbody>
            </Table>
          </div>
        </article>
      </section>
    </div>
  );
};

export default ContenidoAltasBajas;
