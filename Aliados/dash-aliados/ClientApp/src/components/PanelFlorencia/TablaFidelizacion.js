import React, { useContext, useState } from 'react';
import { Table, Button, Modal, Form } from 'react-bootstrap';
import { DarkModeContext } from '../../context/DarkModeContext';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faTrash,faEdit } from '@fortawesome/free-solid-svg-icons';
import './tablaFidelizacion.css';

const TablaFidelizacion = ({ datos = [] }) => {
    const { darkMode } = useContext(DarkModeContext);
    const [filaExtendida, setFilaExtendida] = useState(null);
    const [selectedItem, setSelectedItem]=useState(null)
    const [showModal,setShowModal]=useState(null)
    const [observacion,setObservacion]=useState("")
    const [showConfirmModal, setShowConfirmModal] = useState(false); // Nuevo estado para el modal de confirmación

    // Obtener el token desde el session storage
    const token = sessionStorage.getItem('token');

    // Función para eliminar fidelización
    const handleEliminarFidelizacion = async (id) => {
        if (!token) {
            console.error("Token no encontrado en session storage");
            return;
        }

        try {
            const response = await fetch('/api/fidelizacion/eliminarFidelizacion', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({ id, token })
            });

            if (response.ok) {
                alert('Fidelización eliminada correctamente');
                window.location.reload();
            } else {
                console.error('Error al eliminar la fidelización:', response.statusText);
            }
        } catch (error) {
            console.error('Error al eliminar la fidelización:', error);
        }
    };
    const handleShowModal = (item)=> {
        setSelectedItem(item)
        setObservacion(item?.observacion||"")
        setShowModal(true)

    }
    const handleCloseModal = ()=> {
        setSelectedItem(null)
        setObservacion("")
        setShowModal(false)
    }
    const handleShowConfirmModal = (item) => {
        setSelectedItem(item);
        setShowConfirmModal(true);
    };

    const handleCloseConfirmModal = () => {
        setSelectedItem(null);
        setShowConfirmModal(false);
    };

    const handleConfirmEliminar = () => {
        handleEliminarFidelizacion(selectedItem.id);
        handleCloseConfirmModal();
    };

    const handleSubmitObservacion= async () =>{
        if(!token){
            console.error("Token no encontrado o no valido")
            return
        }
        try {
            const response= await fetch("/api/fidelizacion/agregarobservacion",{
                method:'POST',
                headers:{
                    'Content-Type':'application/json'
                },
                body:JSON.stringify({
                    id:selectedItem.id,
                    token,
                    observacion
            })
            })
            if (response.ok) {
                alert('Observación actualizada correctamente');
                window.location.reload(); // Recargar la página para reflejar los cambios
            } else {
                console.error('Error al actualizar la observación:', response.statusText);
            }
            
        } catch (error) {
            console.error('Error al actualizar la observación:', error); 
        } finally{
            handleCloseModal();
        }
    }

    // Obtener el conjunto único de todas las fechas presentes en los datos y ordenarlas de forma descendente
    const todasLasFechas = Array.from(new Set(
        datos.flatMap(item => item.fechas)
    )).sort((a, b) => new Date(b.split('/').reverse().join('-')) - new Date(a.split('/').reverse().join('-')));

    // Función para alinear las fechas y facturación diaria
    const alinearFacturacionPorFecha = (item) => {
        const facturacionMap = item.fechas.reduce((acc, fecha, index) => {
            acc[fecha] = item.facturacionDiaria[index];
            return acc;
        }, {});

        // Rellenar las fechas faltantes con "-"
        const facturacionAlineada = todasLasFechas.map(fecha => ({
            fecha,
            facturacion: facturacionMap[fecha] !== undefined ? facturacionMap[fecha] : "-"
        }));

        return facturacionAlineada;
    };

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

    return (
        <div className='container'>
            <div className='tabla-fidelizacion'>
            <Table responsive hover>
                <thead>
                    <tr className='text-center'>
                        <th className={darkMode ? "bg-white text-dark border-tabla-izquierda border-0 lato-regular fs-14 py-3" : "bg-dark text-white border-tabla-izquierda border-0 lato-regular fs-14 py-3"}>
                            Acción
                        </th>
                        <th className={darkMode ? "bg-white text-dark border-tabla border-0 lato-regular fs-14 py-3" : "bg-dark text-white border-tabla border-0 lato-regular fs-14 py-3"}>
                            CUIT/CUIL
                        </th>
                        <th className={darkMode ? "bg-white text-dark border-tabla border-0 lato-regular fs-14 py-3" : "bg-dark text-white border-tabla border-0 lato-regular fs-14 py-3"}>
                            Terminal
                        </th>
                        <th className={darkMode ? "bg-white text-dark border-tabla border-0 lato-regular fs-14 py-3" : "bg-dark text-white border-tabla border-0 lato-regular fs-14 py-3"}>
                            Nombre de Fantasia
                        </th>
                        <th className={darkMode ? "bg-white text-dark border-tabla border-0 lato-regular fs-14 py-3" : "bg-dark text-white border-tabla border-0 lato-regular fs-14 py-3"}>
                            Observación
                        </th>
                        <th className={darkMode ? "bg-white text-dark border-tabla border-0 lato-regular fs-14 py-3" : "bg-dark text-white border-tabla border-0 lato-regular fs-14 py-3"}>
                            Tiempo Inactiva
                        </th>
                        {todasLasFechas.map((fecha, index) => (
                            <th key={index} className={darkMode ? "bg-white text-dark border-tabla border-0 lato-regular fs-14 py-3" : "bg-dark text-white border-tabla border-0 lato-regular fs-14 py-3"}>
                                {fecha}
                            </th>
                        ))}
                    </tr>
                </thead>
                <tbody>
                    {datos.length > 0 ? (
                        datos.map((item, index) => {
                            const facturacionAlineada = alinearFacturacionPorFecha(item);
                            return (
                                <tr
                                    key={index}
                                    className={darkMode ? 'bg-dark text-white fs-12 lato-bold' : 'bg-white text-dark fs-12 lato-bold'}
                                    style={tableRowStyle}
                                    onClick={() => handleFilaClick(index)}
                                >
                                    <td style={tableCellStyle(filaExtendida === index)}>
                                    <Button
                                            className="btn border-0 mx-1 fs-12 lato-bold"
                                            style={{
                                                width: "auto",
                                                background: "#E89F2F",
                                                color: "#FFFFFF",
                                                borderRadius: "32px",
                                            }}
                                            onClick={(e) => {
                                                e.stopPropagation();
                                                handleShowModal(item);
                                            }}
                                        >
                                            <FontAwesomeIcon icon={faEdit} />
                                        </Button>
                                        <Button
                                            className="btn border-0 mx-1 fs-12 lato-bold"
                                            style={{
                                                width: "auto",
                                                background: "#E24444",
                                                color: "#FFFFFF",
                                                borderRadius: "32px",
                                            }}
                                            onClick={(e) => {
                                                e.stopPropagation();
                                                handleShowConfirmModal(item);
                                            }}
                                        >
                                            <FontAwesomeIcon icon={faTrash} />
                                        </Button>

                                       
                                    </td>
                                    <td style={tableCellStyle(filaExtendida === index)}>{item.cuit}</td>
                                    <td style={tableCellStyle(filaExtendida === index)}>{item.nterminal}</td>
                                    <td style={tableCellStyle(filaExtendida === index)}>{item.nombreDeFantasia}</td>
                                    <td style={tableCellStyle(filaExtendida === index)}>{item.observacion ?? "-"}</td>
                                    <td style={tableCellStyle(filaExtendida === index)}>{item.tiempoInactiva}</td>
                                    {facturacionAlineada.map((fact, i) => (
                                        <td key={i} className={darkMode ? 'fs-11 lato-bold text-white' : 'fs-11 lato-bold'}>
                                            {fact.facturacion !== "-"
                                                ? fact.facturacion.toLocaleString('es-AR', { style: 'currency', currency: 'ARS' })
                                                : "-"}
                                        </td>
                                    ))}
                                </tr>
                            );
                        })
                    ) : (
                        <tr>
                            <td colSpan={todasLasFechas.length + 5} className='text-center'>
                                No hay datos disponibles.
                            </td>
                        </tr>
                    )}
                </tbody>
            </Table>

            </div>
            
            <Modal show={showModal} onHide={handleCloseModal}>
                <Modal.Header closeButton>
                    <Modal.Title>Editar Observación</Modal.Title>
                </Modal.Header>
                <Modal.Body>
                    <Form>
                        <Form.Group controlId="formObservacion">
                            <Form.Label>Observación</Form.Label>
                            <Form.Control
                                as="textarea"
                                rows={3}
                                value={observacion}
                                onChange={(e) => setObservacion(e.target.value)}
                            />
                        </Form.Group>
                    </Form>
                </Modal.Body>
                <Modal.Footer>
                    <Button className="btn border-0 mx-1 fs-12 lato-bold"
                                            style={{
                                                width: "auto",
                                                background: "#E24444",
                                                color: "#FFFFFF",
                                                borderRadius: "32px",
                                            }} onClick={handleCloseModal}>
                        Cancelar
                    </Button>
                    <Button className="btn border-0 mx-1 fs-12 lato-bold"
                                            style={{
                                                width: "auto",
                                                background: "#B4C400",
                                                color: "#FFFFFF",
                                                borderRadius: "32px",
                                            }} onClick={handleSubmitObservacion}>
                        Guardar Cambios
                    </Button>
                </Modal.Footer>
            </Modal><Modal show={showConfirmModal} onHide={handleCloseConfirmModal}>
                <Modal.Header closeButton>
                    <Modal.Title>Confirmar Eliminación</Modal.Title>
                </Modal.Header>
                <Modal.Body>¿Estás seguro de que deseas eliminar esta fidelización?</Modal.Body>
                <Modal.Footer>
                    <Button onClick={handleCloseConfirmModal} className="btn border-0 mx-1 fs-12 lato-bold"
                                            style={{
                                                width: "auto",
                                                background: "#E24444",
                                                color: "#FFFFFF",
                                                borderRadius: "32px",
                                            }}>No</Button>
                    <Button onClick={handleConfirmEliminar}  className="btn border-0 mx-1 fs-12 lato-bold"
                                            style={{
                                                width: "auto",
                                                background: "#B4C400",
                                                color: "#FFFFFF",
                                                borderRadius: "32px",
                                            }}>Sí</Button>
                </Modal.Footer>
            </Modal>

        </div>
    );
};

export default TablaFidelizacion;
