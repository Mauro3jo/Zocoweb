import React from 'react';
import { Modal } from 'react-bootstrap';

const ModalVerImagenCartasPuestos = ({ show, onHide, imagen }) => {
  return (
    <Modal show={show} onHide={onHide} size="lg" centered>
      <Modal.Header closeButton>

      </Modal.Header>
      <Modal.Body>
        <article className='text-center'>

        <img src={`data:image/png;base64,${imagen}`} alt="Imagen del Puesto" className="img-fluid" />
        </article>
      </Modal.Body>
    </Modal>
  );
};

export default ModalVerImagenCartasPuestos;
