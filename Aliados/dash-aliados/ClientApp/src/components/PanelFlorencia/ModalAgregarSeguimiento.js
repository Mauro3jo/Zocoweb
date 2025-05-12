import React, { useState, useContext } from 'react';
import { Modal, Button, Form, Spinner } from 'react-bootstrap';
import { DarkModeContext } from '../../context/DarkModeContext';
import Swal from 'sweetalert2';

const ModalAgregarSeguimiento = ({ show, handleClose, onAgregar }) => {
    const { darkMode } = useContext(DarkModeContext);
    const [nterminal, setNterminal] = useState('');
    const [cuit, setCuit] = useState('');
    const [fecha, setFecha] = useState('');
    const [observacion, setObservacion] = useState('');
    const [loading, setLoading] = useState(false);

    const apiUrl = "/api/fidelizacion/agregarfidelizacion";
    const token = sessionStorage.getItem("token");

    // Función para manejar el cambio en el campo de la fecha y formatearla automáticamente
    const handleFechaChange = (e) => {
        let value = e.target.value.replace(/[^0-9]/g, ''); // Solo permitir números
        if (value.length > 2 && value.length <= 4) {
            value = value.slice(0, 2) + '/' + value.slice(2);
        } else if (value.length > 4) {
            value = value.slice(0, 2) + '/' + value.slice(2, 4) + '/' + value.slice(4, 8);
        }
        setFecha(value);
    };

    // Función para manejar la entrada de números en CUIT y Terminal
    const handleNumericChange = (e, setFunction) => {
        const value = e.target.value.replace(/[^0-9]/g, ''); // Solo permitir números
        setFunction(value);
    };

    // Función para manejar el envío del formulario
    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);

        // Validar formato de fecha
        const fechaRegex = /^\d{2}\/\d{2}\/\d{4}$/;
        if (!fechaRegex.test(fecha)) {
            Swal.fire({
                title: 'Formato de fecha inválido',
                text: 'La fecha debe estar en formato dd/MM/yyyy',
                icon: 'error',
            });
            setLoading(false);
            return;
        }

        const requestData = {
            Nterminal: nterminal,
            Cuit: cuit,
            Fecha: fecha,
            Observacion: observacion,
            token: token
        };

        try {
            const response = await fetch(apiUrl, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(requestData),
            });

            if (response.ok) {
                Swal.fire({
                    title: 'Éxito',
                    text: 'Fidelización agregada correctamente',
                    icon: 'success',
                });
                onAgregar(); // Actualizar datos en la vista principal
                handleClose();
                setNterminal('');
                setCuit('');
                setFecha('');
                setObservacion('');
            } else {
                const errorText = await response.text();
                Swal.fire({
                    title: 'Error',
                    text: errorText,
                    icon: 'error',
                });
            }
        } catch (error) {
            Swal.fire({
                title: 'Error',
                text: 'Hubo un problema al enviar los datos',
                icon: 'error',
            });
        } finally {
            setLoading(false);
        }
    };

    return (
        <Modal show={show} onHide={handleClose} centered>
            <Modal.Header closeButton>
                <Modal.Title>Agregar Seguimiento de Fidelización</Modal.Title>
            </Modal.Header>
            <Modal.Body>
                <Form onSubmit={handleSubmit} style={{ maxWidth: "500px", margin: "0 auto" }}>
                    {/* Terminal */}
                    <Form.Group controlId="nterminal">
                        <Form.Label className={darkMode ? "text-white" : "text-dark"}>Terminal</Form.Label>
                        <Form.Control
                            type="text"
                            value={nterminal}
                            onChange={(e) => handleNumericChange(e, setNterminal)}
                            maxLength={10}
                            placeholder="Ingrese el número de terminal"
                            required
                            style={{ borderRadius: "50px", padding: "10px", marginBottom: "10px" }}
                        />
                    </Form.Group>

                    {/* CUIT */}
                    <Form.Group controlId="cuit">
                        <Form.Label className={darkMode ? "text-white" : "text-dark"}>CUIT</Form.Label>
                        <Form.Control
                            type="text"
                            value={cuit}
                            onChange={(e) => handleNumericChange(e, setCuit)}
                            maxLength={11}
                            placeholder="Ingrese el CUIT"
                            required
                            style={{ borderRadius: "50px", padding: "10px", marginBottom: "10px" }}
                        />
                    </Form.Group>

                    {/* Fecha */}
                    <Form.Group controlId="fecha">
                        <Form.Label className={darkMode ? "text-white" : "text-dark"}>Fecha (dd/MM/yyyy)</Form.Label>
                        <Form.Control
                            type="text"
                            value={fecha}
                            onChange={handleFechaChange}
                            placeholder="dd/MM/yyyy"
                            maxLength={10}
                            required
                            style={{ borderRadius: "50px", padding: "10px", marginBottom: "10px" }}
                        />
                    </Form.Group>

                    {/* Observación */}
                    <Form.Group controlId="observacion">
                        <Form.Label className={darkMode ? "text-white" : "text-dark"}>Observación</Form.Label>
                        <Form.Control
                            as="textarea"
                            rows={3}
                            value={observacion}
                            onChange={(e) => setObservacion(e.target.value)}
                            placeholder="Ingrese una observación"
                            style={{ borderRadius: "10px", padding: "10px", marginBottom: "10px" }}
                        />
                    </Form.Group>

                    <Button variant="primary" type="submit" disabled={loading} className="mt-3" style={{ borderRadius: "23px", width: "182px", height: "44px" }}>
                        {loading ? <Spinner animation="border" size="sm" /> : 'Agregar'}
                    </Button>
                </Form>
            </Modal.Body>
        </Modal>
    );
};

export default ModalAgregarSeguimiento;
