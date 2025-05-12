import React, { useState, useContext } from 'react';
import { Table, Button, Modal, Form } from 'react-bootstrap';
import { DarkModeContext } from '../../context/DarkModeContext';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faDownload,faUpload, faCalculator } from '@fortawesome/free-solid-svg-icons';
import Swal from 'sweetalert2';
import '../../components/PanelFlorencia/tablaFidelizacion.css';

const TablaUsuarioZocoConect = ({ datos = [] }) => {
    const { darkMode } = useContext(DarkModeContext);
    const [filaExtendida, setFilaExtendida] = useState(null);
    const [showModal, setShowModal] = useState(false);
    const [selectedId, setSelectedId] = useState(null);
    const [comprobante, setComprobante] = useState(null);

    const token = sessionStorage.getItem('token'); // Obtén el token del sessionStorage

    const tableRowStyle = {
        transition: 'transform 0.2s ease-in-out',
        cursor: 'pointer',
        height: '60px',
    };

    const tableCellStyle = (isExpanded) => ({
        whiteSpace: isExpanded ? 'normal' : 'nowrap',
        overflow: isExpanded ? 'visible' : 'hidden',
        textOverflow: isExpanded ? 'clip' : 'ellipsis',
        height: '70px',
        width: "70px",
        lineHeight: '1.5',
        textAlign: 'center',
        verticalAlign: 'middle',
        padding: '10px',
        minWidth: '100px',
    });

    const handleFilaClick = (index) => {
        setFilaExtendida(filaExtendida === index ? null : index);
    };

    // API para calcular comisión
    const handleCalcularComision = async (id) => {
        if (!token) {
            Swal.fire("Error", "Token no encontrado", "error");
            return;
        }

        try {
            const response = await fetch('/api/zococonect/calcularcomision', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ Id: id, token }),
            });

            if (response.ok) {
                Swal.fire("Éxito", "Comisión calculada correctamente", "success");
            } else {
                Swal.fire("Error", "No se pudo calcular la comisión", "error");
            }
        } catch (error) {
            Swal.fire("Error", "Ocurrió un error al calcular la comisión", "error");
        }
    };

    // API para subir comprobante
    const handleSubirComprobante = async () => {
        if (!token || !comprobante || !selectedId) {
            Swal.fire("Error", "Faltan datos para subir el comprobante", "error");
            return;
        }

        try {
            // Convertir el archivo PDF a Base64
            const convertToBase64 = (file) => {
                return new Promise((resolve, reject) => {
                    const reader = new FileReader();
                    reader.onload = () => resolve(reader.result.split(',')[1]); // Solo el contenido Base64
                    reader.onerror = (error) => reject(error);
                    reader.readAsDataURL(file);
                });
            };

            const base64String = await convertToBase64(comprobante);

            if (!base64String || !selectedId || !token) {
                Swal.fire("Error", "No se pudieron preparar los datos para enviar", "error");
                return;
            }

            // Crear el FormData para enviar a la API
            const formData = new FormData();
            //formData.append("Id", selectedId);
            //formData.append("token", token);
            //formData.append("Comprobante", base64String);

           

            // Realizar la solicitud a la API
            const response = await fetch('/api/zococonect/agregarcomprobante', {
                method: 'POST',
                body: formData, // Enviar como FormData
            });

            if (response.ok) {
                Swal.fire("Éxito", "Comprobante subido correctamente", "success");
            } else {
                const errorDetails = await response.text();
                Swal.fire("Error", `No se pudo subir el comprobante: ${errorDetails}`, "error");
            }
        } catch (error) {
            console.error("Error en el manejo del comprobante:", error);
            Swal.fire("Error", "Ocurrió un error al subir el comprobante", "error");
        } finally {
            setShowModal(false);
            setComprobante(null);
        }
    };


    const handleDescargarPDF = async (id) => {
        if (!token) {
            Swal.fire("Error", "Token no encontrado", "error");
            return;
        }

        try {
            const response = await fetch('/api/zococonect/descargarcomprobante', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    Id: id,
                    Token: token // Incluye el token en el cuerpo de la solicitud
                }),
            });

            if (response.ok) {
                const base64String = await response.text(); // Leer la respuesta como texto

                // Crear Blob directamente a partir del Base64
                const byteCharacters = atob(base64String); // Decodificar Base64
                const byteNumbers = new Array(byteCharacters.length);
                for (let i = 0; i < byteCharacters.length; i++) {
                    byteNumbers[i] = byteCharacters.charCodeAt(i);
                }
                const byteArray = new Uint8Array(byteNumbers);
                const blob = new Blob([byteArray], { type: 'application/pdf' });

                // Crear un enlace de descarga
                const url = URL.createObjectURL(blob);
                const link = document.createElement('a');
                link.href = url;
                link.download = `Comprobante_${id}.pdf`; // Nombre del archivo
                document.body.appendChild(link);
                link.click();
                document.body.removeChild(link);
            } else {
                Swal.fire("Error", "No se pudo descargar el comprobante", "error");
            }
        } catch (error) {
            Swal.fire("Error", "Ocurrió un error al descargar el comprobante", "error");
        }
    };



    

    return (
        <div className="container">
            <div className="tabla-fidelizacion">
                <Table responsive hover>
                    <thead>
                        <tr className="text-center">
                            <th  className={darkMode ? "bg-white text-dark border-tabla-izquierda border-0 lato-regular fs-14 py-3" : "bg-dark text-white border-tabla-izquierda border-0 lato-regular fs-14 py-3"}>Acción</th>
                            <th className={darkMode ? "bg-white text-dark border-tabla border-0 lato-regular fs-14 py-3" : "bg-dark text-white border-tabla border-0 lato-regular fs-14 py-3"}>ID</th>
                            <th className={darkMode ? "bg-white text-dark border-tabla border-0 lato-regular fs-14 py-3" : "bg-dark text-white border-tabla border-0 lato-regular fs-14 py-3"}>CUIT ZocoConect</th>
                            <th className={darkMode ? "bg-white text-dark border-tabla border-0 lato-regular fs-14 py-3" : "bg-dark text-white border-tabla border-0 lato-regular fs-14 py-3"}>Nombre ZocoConect</th>
                            <th className={darkMode ? "bg-white text-dark border-tabla border-0 lato-regular fs-14 py-3" : "bg-dark text-white border-tabla border-0 lato-regular fs-14 py-3"}>CUIT Aliado</th>
                            <th className={darkMode ? "bg-white text-dark border-tabla border-0 lato-regular fs-14 py-3" : "bg-dark text-white border-tabla border-0 lato-regular fs-14 py-3"}>Nombre Aliado</th>
                            <th className={darkMode ? "bg-white text-dark border-tabla border-0 lato-regular fs-14 py-3" : "bg-dark text-white border-tabla border-0 lato-regular fs-14 py-3"}>Meses y Totales</th>
                            <th className={darkMode ? "bg-white text-dark border-tabla-derecha border-0 lato-regular fs-14 py-3" : "bg-dark text-white border-tabla-derecha border-0 lato-regular fs-14 py-3"}>Comisión</th>
                        </tr>
                    </thead>
                    <tbody>
                        {datos.length > 0 ? (
                            datos.map((item, index) => (
                                <tr  key={index}
                                className={darkMode ? 'bg-dark text-white fs-12 lato-bold' : 'bg-white text-dark fs-12 lato-bold'}
                                style={tableRowStyle}
                                onClick={() => handleFilaClick(index)}>
                                    <td style={tableCellStyle(filaExtendida === index)}>
                                        <Button
                                            className="btn border-0 mx-1"
                                            style={{
                                                background: "#E89F2F",
                                                color: "#FFFFFF",
                                                borderRadius: "32px",
                                            }}
                                            onClick={() => handleCalcularComision(item.id)}
                                        >
                                            <FontAwesomeIcon icon={faCalculator} />
                                        </Button>
                                        <Button
                                            className="btn border-0 mx-1"
                                            style={{
                                                background: "#E24444",
                                                color: "#FFFFFF",
                                                borderRadius: "32px",
                                            }}
                                            onClick={() => {
                                                setSelectedId(item.id);
                                                setShowModal(true);
                                            }}
                                        >
                                            <FontAwesomeIcon icon={faUpload} />
                                        </Button>
                                        <Button
                                            className="btn border-0 mx-1"
                                            style={{
                                                background: item.comprobantepdf === "Si" ? "#28A745" : "#C0C0C0", // Color verde si se puede descargar, gris si no
                                                color: "#FFFFFF",
                                                borderRadius: "32px",
                                            }}
                                            onClick={() => {
                                                if (item.comprobantepdf === "Si") {
                                                    handleDescargarPDF(item.id);
                                                } else {
                                                    Swal.fire("Aviso", "No hay un comprobante para descargar", "info");
                                                }
                                            }}
                                            disabled={item.comprobantepdf !== "Si"} // Deshabilitar si no hay comprobante
                                        >
                                            <FontAwesomeIcon icon={faDownload} />
                                        </Button>
                                    </td>
                                    <td style={tableCellStyle(filaExtendida === index)}>{item.id}</td>
                                    <td  style={tableCellStyle(filaExtendida === index)}>{item.cuitZocoConect}</td>
                                    <td  style={tableCellStyle(filaExtendida === index)}>{item.nombreZocoConect}</td>
                                    <td  style={tableCellStyle(filaExtendida === index)}>{item.cuitAliado}</td>
                                    <td  style={tableCellStyle(filaExtendida === index)}>{item.nombreAliado}</td>
                                    <td  style={tableCellStyle(filaExtendida === index)}>
                                        {item.mesesYTotales.map((mes, i) => (
                                            <div key={i}>
                                                <strong>{mes.mes}</strong>: {mes.totalBruto.toLocaleString('es-AR', { style: 'currency', currency: 'ARS' })}
                                            </div>
                                        ))}
                                    </td>
                                    <td  style={tableCellStyle(filaExtendida === index)}>
                                        {item.comision ? item.comision.toLocaleString('es-AR', { style: 'currency', currency: 'ARS' }) : "-"}
                                    </td>
                                </tr>
                            ))
                        ) : (
                            <tr>
                                <td colSpan="8" className="text-center">
                                    No hay datos disponibles.
                                </td>
                            </tr>
                        )}
                    </tbody>
                </Table>
            </div>

            {/* Modal para subir comprobante */}
            <Modal show={showModal} onHide={() => setShowModal(false)}>
                <Modal.Header closeButton>
                    <Modal.Title>Subir Comprobante</Modal.Title>
                </Modal.Header>
                <Modal.Body>
                    <Form.Group controlId="formFile">
                        <Form.Label>Seleccione un archivo PDF</Form.Label>
                        <Form.Control
                            type="file"
                            accept=".pdf"
                            onChange={(e) => setComprobante(e.target.files[0])}
                        />
                    </Form.Group>
                </Modal.Body>
                <Modal.Footer>
                    <Button variant="secondary" onClick={() => setShowModal(false)}>
                        Cancelar
                    </Button>
                    <Button variant="primary" onClick={handleSubirComprobante}>
                        Subir
                    </Button>
                </Modal.Footer>
            </Modal>
        </div>
    );
};

export default TablaUsuarioZocoConect; 
