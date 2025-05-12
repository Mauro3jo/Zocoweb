import React, { useContext } from "react";
import { Modal, Button } from "react-bootstrap";
import { DarkModeContext } from "../../context/DarkModeContext";
import "../TablaUsuariosLiquidaciones.css";

import logozoco from "../../assets/img/Logo-ZOCO-4.png";
import logopayway from "../../assets/img/payway-texto.png";
import logomercadopago from "../../assets/img/Logo-Mercado-Pago-4.png";
import logonx from "../../assets/img/Logo-Naranja-X-4.png";
import logogetnet from "../../assets/img/Logo-Getnet-4.png";
import logoviumi from "../../assets/img/Logo-viuMi-(Con-espacio-abajo).png";
import logoNave from "../../assets/img/Logo-Nave-(Con-espacio-abajo).png";

const ModalAhorroAliado = ({ show, handleClose, datos }) => {
    const { darkMode } = useContext(DarkModeContext);

    const comparativas = [
        { logo: logopayway, nombre: "Payway", ahorro: datos.ahorroPayway, monto: datos.montoAhorroPayway, porcentaje: datos.porcentajeAhorroPayway },
        { logo: logomercadopago, nombre: "MercadoPago", ahorro: datos.ahorroMercadoPago, monto: datos.montoAhorroMercadoPago, porcentaje: datos.porcentajeAhorroMercadoPago },
        { logo: logonx, nombre: "NaranjaX", ahorro: datos.ahorroNaranjaX, monto: datos.montoAhorroNaranjaX, porcentaje: datos.porcentajeAhorroNaranjaX },
        { logo: logogetnet, nombre: "Getnet", ahorro: datos.ahorroGetnet, monto: datos.montoAhorroGetnet, porcentaje: datos.porcentajeAhorroGetnet },
        { logo: logoviumi, nombre: "Viumi", ahorro: datos.ahorroViumi, monto: datos.montoAhorroViumi, porcentaje: datos.porcentajeAhorroViumi },
        { logo: logoNave, nombre: "Nave", ahorro: datos.ahorroNave, monto: datos.montoAhorroNave, porcentaje: datos.porcentajeAhorroNave }
    ];

    return (
        <Modal show={show} onHide={handleClose} centered size="xl" className="modal-grande">
            <style>
                {`
                    .modal-dialog {
                        max-width: 90%;
                    }

                    .modal-body {
                        max-height: 80vh;
                        overflow-y: auto;
                    }

                    .table {
                        width: 100%;
                        table-layout: fixed;
                    }

                    th, td {
                        text-align: center;
                        white-space: normal;
                        padding: 12px;
                    }

                    .logo-imagen {
                        max-width: 50px;
                        height: auto;
                    }

                    .logo-imagen-pequena {
                        max-width: 40px;
                        height: auto;
                    }

                    .texto-ajustable {
                        font-size: 1rem;
                        overflow: hidden;
                        text-overflow: ellipsis;
                        text-align: center;
                        word-wrap: break-word;
                    }

                    @media (max-width: 768px) {
                        .texto-ajustable {
                            font-size: 0.9rem;
                        }
                        .logo-imagen {
                            max-width: 40px;
                        }
                        .logo-imagen-pequena {
                            max-width: 30px;
                        }
                    }
                `}
            </style>
            <Modal.Header closeButton className={darkMode ? "bg-dark text-white" : "bg-light text-dark"}>
                <Modal.Title className="w-100 text-center">
                    Ahorro Aliado - {datos.fechaComparacion}
                </Modal.Title>
            </Modal.Header>

            <Modal.Body className={darkMode ? "bg-dark text-white" : "bg-light text-dark"}>
                {datos ? (
                    <table className="table table-bordered table-hover">
                        <thead className="table-dark">
                            <tr>
                                <th>Bruto</th>
                                <th>Pagado Zoco</th>
                                {/*<th>Zoco</th>*/}
                                {/*<th>Neto Zoco</th>*/}
                                <th>Método de Pago</th>
                                <th>Otros Procesadores</th>
                                <th>Monto Ahorrado</th>
                                <th>Porcentaje de Ahorro</th>
                            </tr>
                        </thead>
                        <tbody>
                            {comparativas.length > 0 ? (
                                comparativas.map((item, index) => (
                                    <tr key={index}>
                                        <td className="texto-ajustable"><strong>{datos.totalbruto}</strong></td>
                                        <td className="texto-ajustable"><strong>{datos.netozocoTransaccion}</strong></td>
                                        {/*<td><img src={logozoco} alt="Zoco Logo" className="logo-imagen" /></td>*/}
                                        {/*<td className="texto-ajustable"><strong>{datos.netoZoco}</strong></td>*/}
                                        <td><img src={item.logo} alt={`${item.nombre} Logo`} className="logo-imagen-pequena" /></td>
                                        <td className="texto-ajustable">{item.ahorro}</td>
                                        <td className="texto-ajustable">{item.monto}</td>
                                        <td className="texto-ajustable">{item.porcentaje}</td>
                                    </tr>
                                ))
                            ) : (
                                <tr>
                                    <td colSpan="8" className="text-center">
                                        No se encontraron resultados.
                                    </td>
                                </tr>
                            )}
                        </tbody>
                    </table>
                ) : (
                    <p className="text-center">No hay datos de ahorro disponibles.</p>
                )}
            </Modal.Body>
            <Modal.Footer className={darkMode ? "bg-dark text-white" : "bg-light text-dark"}>
                <Button variant="secondary" onClick={handleClose}>
                    Cerrar
                </Button>
            </Modal.Footer>
        </Modal>
    );
};

export default ModalAhorroAliado;
