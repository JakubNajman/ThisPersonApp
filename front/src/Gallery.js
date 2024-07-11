import {Container, Row, Col, Image, Modal, Button } from 'react-bootstrap';
import React, { useState } from 'react';
import axios from 'axios';


const Gallery = ({images}) => {
  const [selectedImage, setSelectedImage] = useState(null);
  const [showModal, setShowModal] = useState(false);
  const [selectedIndex, setSelectedIndex] = useState(null);

  const handleImageClick = async (index) => {
    const response = await axios.get(`/human/${index}`, { responseType: 'arraybuffer' });
    const imageUrl = URL.createObjectURL(new Blob([response.data], { type: 'image/jpeg' }));
    setSelectedImage(imageUrl);
    setSelectedIndex(index);
    setShowModal(true);
  };

  const handleCloseModal = () => {
    setShowModal(false);
    setSelectedIndex(null);
    setSelectedImage(null);
  };

  return (
      <Container className="mt-4">
        <Row>
          {images.map((image, index) => (
            <Col key={index} xs={6} md={4} lg={3} className="mb-4">
              <Image 
              src={image} 
              rounded width="200" 
              height="200" 
              onClick={() => handleImageClick(index)}
              style={{ cursor: 'pointer' }} />
            </Col>
          ))}
        </Row>
        <Modal show={showModal} onHide={handleCloseModal}>
          <Modal.Header closeButton>
            <Modal.Title>Image Preview of index {selectedIndex}</Modal.Title>
          </Modal.Header>
          <Modal.Body>
            {selectedImage && <Image width="1024" 
              height="1024" src={selectedImage} fluid />}
          </Modal.Body>
          <Modal.Footer>
            <Button variant="secondary" onClick={handleCloseModal}>
              Close
            </Button>
          </Modal.Footer>
        </Modal>
        </Container>
    );
}

export default Gallery;