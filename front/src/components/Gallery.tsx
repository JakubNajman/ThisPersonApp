import {Container, Row, Col, Image, Modal, Button, Form } from 'react-bootstrap';
import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { NUMBER_OF_IMAGES } from '../utils/constants';

interface ImageData {
  id: number;
  imageUrl: string;
}

const Gallery = () => {
  const [images, setImages] = useState<string[]>([]);
  const [selectedImage, setSelectedImage] = useState<string | null>(null);
  const [showModal, setShowModal] = useState<boolean>(false);
  const [selectedIndex, setSelectedIndex] = useState<number | null>(null);
  const [newIndex, setNewIndex] = useState<string>('');

  const handleImageClick = async (index: number) => {
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

  const handleFormSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    if (selectedIndex !== null && newIndex !== '') {
      try {
        const response = await axios.put(`/gallery/${selectedIndex}`, { type: 'human', id: newIndex }, {
          headers: { 'Content-Type': 'application/json' }
        });
        handleCloseModal();
        window.location.reload();
      } catch (error) {
        console.error('Error submitting form:', error);
      }
    }
  };

  useEffect(() => {
    const fetchImages = async () => {
      const promises: Promise<string | null>[] = [];
      for (let i = 0; i <= NUMBER_OF_IMAGES; i++) {
        promises.push(
          axios.get(`/gallery/preview/${i}`, { responseType: 'arraybuffer' })
            .then(response => {
              const imageUrl = URL.createObjectURL(new Blob([response.data], { type: 'image/jpeg' }));
              return imageUrl;
            })
            .catch(() => null)
        );
      }
      const images = await Promise.all(promises);
      setImages(images.filter(image => image !== null) as string[]);
    };

    fetchImages();
  }, []);

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
            <Form onSubmit={handleFormSubmit}>
              <Form.Group controlId="formNewIndex">
                <Form.Label>New ID</Form.Label>
                <Form.Control
                  type="number"
                  value={newIndex}
                  onChange={(e) => setNewIndex(e.target.value)}
                  placeholder="Enter new ID"
                />
              </Form.Group>
              <Button variant="primary" type="submit">
                Submit
              </Button>
            </Form>  
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