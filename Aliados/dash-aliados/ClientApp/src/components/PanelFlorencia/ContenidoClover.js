import React, { useState } from "react";
import { Button, Row, Col, ProgressBar } from "react-bootstrap";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faFile, faUpload } from "@fortawesome/free-solid-svg-icons";
import './ContenidoClover.css'

const ContenidoClover = () => {
    const [files, setFiles] = useState([]);
    const [message, setMessage] = useState("");
    const [progress, setProgress] = useState(0); // Progreso visual en porcentaje
    const [currentFile, setCurrentFile] = useState(0); // Archivo actual en progreso
    const [uploading, setUploading] = useState(false); // Estado de carga

    const handleFileChange = (e) => {
        setFiles([...e.target.files]); // Guardar los archivos seleccionados
        setMessage("");
        setProgress(0);
        setCurrentFile(0);
    };

    const handleSubmit = async (e) => {
        e.preventDefault();

        const token = sessionStorage.getItem("token");

        if (!token) {
            setMessage("Token no disponible. Inicia sesión nuevamente.");
            return;
        }

        if (files.length === 0) {
            setMessage("Por favor selecciona al menos un archivo.");
            return;
        }

        setProgress(0);
        setCurrentFile(0);
        setUploading(true);

        try {
            let totalProgress = 0;
            let successfulUploads = 0;

            for (let i = 0; i < files.length; i++) {
                let lastProcessedRow = 0; // Progreso inicial
                let percentComplete = 0; // Porcentaje acumulado del archivo

                while (true) {
                    setMessage(`Subiendo archivo ${i + 1} de ${files.length}...`);
                    setCurrentFile(i + 1);

                    const formData = new FormData();
                    formData.append("files", files[i]);
                    formData.append("token", token);
                    formData.append("lastProcessedRow", lastProcessedRow); // Reanudar desde esta fila

                    try {
                        const response = await fetch("/api/clover/subirdatosclover", {
                            method: "POST",
                            body: formData,
                        });

                        if (response.ok) {
                            successfulUploads++;
                            totalProgress += (1 / files.length) * 100;
                            setProgress(totalProgress.toFixed(2));
                            break; // Continuar con el siguiente archivo
                        } else if (response.status === 524) {
                            const errorData = await response.json();
                            lastProcessedRow = errorData.LastProcessedRow || 0;
                            percentComplete = errorData.PercentComplete || 0;

                            totalProgress =
                                (successfulUploads / files.length) * 100 +
                                (percentComplete / files.length);
                            setProgress(totalProgress.toFixed(2));
                        } else {
                            const errorData = await response.json();
                            setMessage(
                                `Error con el archivo "${files[i].name}": ${errorData.message || "Error desconocido"}`
                            );
                            break; // Detener el procesamiento de este archivo
                        }
                    } catch (error) {
                        setMessage("Error de red. Intentando nuevamente...");
                    }
                }
            }

            setMessage(
                `Todos los archivos se subieron exitosamente: ${successfulUploads} de ${files.length}.`
            );
        } catch (error) {
            setMessage("Hubo un problema al conectar con el servidor.");
        } finally {
            setUploading(false);
        }
    };


    return (
        <div className="container" style={{ marginBottom: "10px" }}>
            <h2 className="fs-24 lato-bold mb-0" style={{ color: "#292B2F" }}>
                Subir Datos Clover
            </h2>

            <form onSubmit={handleSubmit}>
                <Row className="my-3 align-items-center">
                    <Col xs="auto">
                        <label
                            htmlFor="fileInput"
                            style={{
                                display: "inline-block",
                                width: "200px",
                                height: "44px",
                                background: "#B4C400",
                                color: "#FFFFFF",
                                borderRadius: "32px",
                                textAlign: "center",
                                lineHeight: "44px",
                                cursor: "pointer",
                            }}
                        >
                            <FontAwesomeIcon icon={faFile} style={{ marginRight: "5px" }} />
                            Seleccionar Archivos
                        </label>
                        <input
                            id="fileInput"
                            type="file"
                            accept=".csv, .xlsx, .xls"
                            multiple
                            onChange={handleFileChange}
                            style={{ display: "none" }}
                        />
                    </Col>
                    <Col xs="auto">
                        <Button
                            type="submit"
                            className="btn-publicar border-0 mx-1"
                            disabled={uploading}
                            style={{
                                width: "200px",
                                height: "44px",
                                background: uploading ? "#ccc" : "#B4C400",
                                color: "#FFFFFF",
                                borderRadius: "32px",
                            }}
                        >
                            <FontAwesomeIcon icon={faUpload} style={{ marginRight: "5px" }} />
                            {uploading ? `Subiendo ${currentFile} de ${files.length}` : "Subir Archivos"}
                        </Button>
                    </Col>
                </Row>
            </form>

            {uploading && (
                <div className="circular-progress-container">
                    <div className="circular-progress">
                        <span className="progress-text">{`${progress}%`}</span>
                        <svg viewBox="0 0 36 36" className="circular-chart">
                            <path
                                className="circle-bg"
                                d="M18 2.0845
                                a 15.9155 15.9155 0 0 1 0 31.831
                                a 15.9155 15.9155 0 0 1 0 -31.831"
                                fill="none"
                                stroke="#eee"
                                strokeWidth="2"
                            />
                            <path
                                className="circle"
                                strokeDasharray={`${progress}, 100`}
                                d="M18 2.0845
                                a 15.9155 15.9155 0 0 1 0 31.831
                                a 15.9155 15.9155 0 0 1 0 -31.831"
                                fill="none"
                                stroke="#B4C400"
                                strokeWidth="2.5"
                            />
                        </svg>
                    </div>
                    <p className="progress-message">{`Subiendo archivo ${currentFile} de ${files.length}`}</p>
                </div>
            )}


        </div>
    );
};

export default ContenidoClover;