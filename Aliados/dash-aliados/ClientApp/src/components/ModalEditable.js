import React from "react";
import Button from "react-bootstrap/Button";
import Modal from "react-bootstrap/Modal";

function MyVerticallyCenteredModal(props) {
  return (
    <Modal
      {...props}
      size="lg"
      aria-labelledby="contained-modal-title-vcenter"
      centered
    >
      <Modal.Body className="px-5">
        <div className=" d-flex justify-content-center py-5">

        <p>¿Seguro que quieres borrar esta nota?</p>
        </div>
    
        <div className=" d-flex justify-content-center py-5">
        <Button onClick={props.onHide}>Close</Button>
        </div>
      </Modal.Body>

    </Modal>
  );
}

const ModalEditable = () => {
  const [modalShow, setModalShow] = React.useState(false);
  return (
    <div>
      <Button variant="primary" onClick={() => setModalShow(true)}>
        evento para el modal editable
      </Button>
      <MyVerticallyCenteredModal
        show={modalShow}
        onHide={() => setModalShow(false)}
      />
    </div>
  );
};

export default ModalEditable;
