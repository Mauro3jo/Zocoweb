import React, { useRef } from 'react';
import SignatureCanvas from 'react-signature-canvas';
import { Button, Form } from 'react-bootstrap';

const FormularioConFirma = () => {
  const sigCanvas = useRef(null);
  
  const limpiarFirma = () => {
    sigCanvas.current.clear();
  };

  const guardarFirma = () => {
    const dataUrl = sigCanvas.current.getTrimmedCanvas().toDataURL('image/png');
    alert('Firma guardada');
  };

  return (
    <div className="container mt-5">
      <h3>Formulario con Firma Digital</h3>
      <SignatureCanvas
        penColor="black"
        canvasProps={{
          width: 500,
          height: 200,
          className: 'sigCanvas'
        }}
        ref={sigCanvas}
      />
      <Form>
        {/* Otros campos del formulario */}
        <Form.Group controlId="formBasicEmail">
          <Form.Label>Email address</Form.Label>
          <Form.Control type="email" placeholder="Enter email" />
        </Form.Group>
        {/* Botones para manejar la firma */}
        <Button variant="primary" onClick={limpiarFirma}>
          Limpiar Firma
        </Button>
        <Button variant="success" onClick={guardarFirma}>
          Guardar Firma
        </Button>
      </Form>
    </div>
  );
};

export default FormularioConFirma;