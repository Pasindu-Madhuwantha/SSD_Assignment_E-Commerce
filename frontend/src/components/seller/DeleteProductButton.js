import { useState } from 'react';
import { Modal, Button } from 'react-bootstrap';

function DeleteProductButton(props) {
  const [showModal, setShowModal] = useState(false);

  const handleClose = () => setShowModal(false);
  const handleShow = () => setShowModal(true);

  const handleDelete = () => {
    props.deleteProductHandler(props.productId);
    setShowModal(false);
  }

  return (
    <>
      <Button variant="btn btn-danger py-1 px-2 ml-2" onClick={handleShow}>
        <i className="fa fa-trash"></i>
      </Button>

      <Modal show={showModal} onHide={handleClose}>
        <Modal.Header closeButton>
          <Modal.Title>Confirm Deletion</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          Are you sure you want to delete this product?
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={handleClose}>
            Cancel
          </Button>
          <Button variant="danger" onClick={handleDelete}>
            Delete
          </Button>
        </Modal.Footer>
      </Modal>
    </>
  );
}

export default DeleteProductButton;
