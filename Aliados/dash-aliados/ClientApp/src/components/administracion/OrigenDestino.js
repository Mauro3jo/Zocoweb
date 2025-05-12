import React, { useEffect, useState } from "react";
import { Table, Button, Modal, Form } from "react-bootstrap";
import moment from "moment"; // Para formatear fechas

const provincias = [
    "Buenos Aires", "Catamarca", "Chaco", "Chubut", "Córdoba", "Corrientes", "Entre Ríos", "Formosa", "Jujuy", "La Pampa",
    "La Rioja", "Mendoza", "Misiones", "Neuquén", "Río Negro", "Salta", "San Juan", "San Luis", "Santa Cruz", "Santa Fe",
    "Santiago del Estero", "Tierra del Fuego", "Tucumán"
];

const OrigenDestino = ({ id }) => {
    const [data, setData] = useState([]);
    const [loading, setLoading] = useState(true);
    const [showModalOrigen, setShowModalOrigen] = useState(false);
    const [showModalDestino, setShowModalDestino] = useState(false);
    const [origen, setOrigen] = useState("");
    const [destino, setDestino] = useState("");
    const [observaciones, setObservaciones] = useState("");
    const [fecha, setFecha] = useState(moment().format('YYYY-MM-DDTHH:mm'));

    // Función para obtener los datos del servidor
    const fetchData = async () => {
        try {
            setLoading(true);
            const response = await fetch("/api/origendestino/obtenerorigenydestino");
            const result = await response.json();
            const filteredData = result.filter((item) => item.altaId === Number(id));
            setData(filteredData);
            setLoading(false);
        } catch (error) {
            console.error("Error al obtener los datos", error);
            setLoading(false);
        }
    };

    // Efecto que se ejecuta cuando cambia el id
    useEffect(() => {
        if (id) {
            fetchData(); // Cargar los datos inicialmente
        }
    }, [id]);

    const handleCrearOrigen = async () => {
        const token = sessionStorage.getItem("token");
        if (!token) {
            alert("Token no encontrado. Por favor inicie sesión.");
            return;
        }

        try {
            const response = await fetch("/api/origendestino/Crearorigen", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify({
                    AltaId: id,
                    Origen: origen,
                    Fecha: fecha,
                    Observaciones: observaciones,
                    Token: token,
                }),
            });

            if (response.ok) {
                alert("Origen creado exitosamente");
                setShowModalOrigen(false);
                setOrigen("");
                setObservaciones("");
                setFecha(moment().format('YYYY-MM-DDTHH:mm'));
                fetchData(); // Actualizar la tabla después de crear el origen
            } else {
                console.error("Error al crear el origen");
            }
        } catch (error) {
            console.error("Error en la solicitud:", error);
        }
    };

    const handleCrearDestino = async () => {
        const token = sessionStorage.getItem("token");
        if (!token) {
            alert("Token no encontrado. Por favor inicie sesión.");
            return;
        }

        const origenIdMasAlto = Math.max(...data.map((item) => item.idOrigen)); // Obtener el origenId más alto

        try {
            const response = await fetch("/api/origendestino/Creardestino", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify({
                    IdOrigen: origenIdMasAlto, // Usar el origenId más alto
                    Destino: destino,
                    Fecha: fecha,
                    Observaciones: observaciones,
                    Token: token,
                }),
            });

            if (response.ok) {
                alert("Destino creado exitosamente");
                setShowModalDestino(false);
                setDestino("");
                setObservaciones("");
                setFecha(moment().format('YYYY-MM-DDTHH:mm'));
                fetchData(); // Actualizar la tabla después de crear el destino
            } else {
                console.error("Error al crear el destino");
            }
        } catch (error) {
            console.error("Error en la solicitud:", error);
        }
    };

    const handleShowModalOrigen = () => setShowModalOrigen(true);
    const handleShowModalDestino = () => setShowModalDestino(true);
    const handleCloseModalOrigen = () => setShowModalOrigen(false);
    const handleCloseModalDestino = () => setShowModalDestino(false);

    return (
        <div>
            <h2>Origen y Destino</h2>
            {loading ? (
                <p>Cargando datos...</p>
            ) : data.length > 0 ? (
                <Table striped bordered hover>
                    <thead>
                        <tr>
                            <th>ID</th>
                            <th>Origen</th>
                            <th>Destino</th>
                            <th>Fecha</th>
                            <th>Observaciones</th>
                        </tr>
                    </thead>
                    <tbody>
                        {data.map((item) => (
                            <tr key={item.id}>
                                <td>{item.id}</td>
                                <td>{item.origen}</td>
                                <td>{item.destino}</td>
                                <td>{moment(item.fecha).format('DD/MM/YYYY HH:mm')}</td>
                                <td>{item.observaciones || "Sin observaciones"}</td>
                            </tr>
                        ))}
                    </tbody>
                </Table>
            ) : (
                <p>No se encontraron datos para este ID.</p>
            )}

            {/* Botones para crear origen y destino */}
            <Button variant="primary" onClick={handleShowModalOrigen} className="mr-2">
                Crear Origen
            </Button>
            <Button variant="primary" onClick={handleShowModalDestino}>
                Crear Destino
            </Button>

            {/* Modal para ingresar datos del Origen */}
            <Modal show={showModalOrigen} onHide={handleCloseModalOrigen}>
                <Modal.Header closeButton>
                    <Modal.Title>Crear Origen</Modal.Title>
                </Modal.Header>
                <Modal.Body>
                    <Form>
                        <Form.Group>
                            <Form.Label>Provincia de Origen</Form.Label>
                            <Form.Control
                                as="select"
                                value={origen}
                                onChange={(e) => setOrigen(e.target.value)}
                            >
                                <option value="">Seleccione una provincia</option>
                                {provincias.map((provincia) => (
                                    <option key={provincia} value={provincia}>
                                        {provincia}
                                    </option>
                                ))}
                            </Form.Control>
                        </Form.Group>
                        <Form.Group>
                            <Form.Label>Fecha</Form.Label>
                            <Form.Control
                                type="datetime-local"
                                value={fecha}
                                onChange={(e) => setFecha(e.target.value)}
                            />
                        </Form.Group>
                        <Form.Group>
                            <Form.Label>Observaciones</Form.Label>
                            <Form.Control
                                as="textarea"
                                rows={3}
                                value={observaciones}
                                onChange={(e) => setObservaciones(e.target.value)}
                                placeholder="Ingrese las observaciones"
                            />
                        </Form.Group>
                    </Form>
                </Modal.Body>
                <Modal.Footer>
                    <Button variant="secondary" onClick={handleCloseModalOrigen}>
                        Cancelar
                    </Button>
                    <Button variant="primary" onClick={handleCrearOrigen}>
                        Crear Origen
                    </Button>
                </Modal.Footer>
            </Modal>

            {/* Modal para ingresar datos del Destino */}
            <Modal show={showModalDestino} onHide={handleCloseModalDestino}>
                <Modal.Header closeButton>
                    <Modal.Title>Crear Destino</Modal.Title>
                </Modal.Header>
                <Modal.Body>
                    <Form>
                        <Form.Group>
                            <Form.Label>Provincia de Destino</Form.Label>
                            <Form.Control
                                as="select"
                                value={destino}
                                onChange={(e) => setDestino(e.target.value)}
                            >
                                <option value="">Seleccione una provincia</option>
                                {provincias.map((provincia) => (
                                    <option key={provincia} value={provincia}>
                                        {provincia}
                                    </option>
                                ))}
                            </Form.Control>
                        </Form.Group>
                        <Form.Group>
                            <Form.Label>Fecha</Form.Label>
                            <Form.Control
                                type="datetime-local"
                                value={fecha}
                                onChange={(e) => setFecha(e.target.value)}
                            />
                        </Form.Group>
                        <Form.Group>
                            <Form.Label>Observaciones</Form.Label>
                            <Form.Control
                                as="textarea"
                                rows={3}
                                value={observaciones}
                                onChange={(e) => setObservaciones(e.target.value)}
                                placeholder="Ingrese las observaciones"
                            />
                        </Form.Group>
                    </Form>
                </Modal.Body>
                <Modal.Footer>
                    <Button variant="secondary" onClick={handleCloseModalDestino}>
                        Cancelar
                    </Button>
                    <Button variant="primary" onClick={handleCrearDestino}>
                        Crear Destino
                    </Button>
                </Modal.Footer>
            </Modal>
        </div>
    );
};

export default OrigenDestino;
