import React, { useEffect, useState } from 'react';
import { Navbar, Container, Row, Col, Image } from 'react-bootstrap';
import axios from 'axios';
import 'bootstrap/dist/css/bootstrap.min.css';

const App = () => {
  const [images, setImages] = useState([]);

  useEffect(() => {
    const fetchImages = async () => {
      const promises = [];
      for (let i = 1; i <= 20; i++) {
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
      setImages(images.filter(image => image !== null));
    };

    fetchImages();
  }, []);

  return (
    <div>
      <Navbar bg="dark" variant="dark">
        <Container>
          <Navbar.Brand href="#home">ThisPersonApp</Navbar.Brand>
        </Container>
      </Navbar>
      <Container className="mt-4">
        <Row>
          {images.map((image, index) => (
            <Col key={index} xs={6} md={4} lg={3} className="mb-4">
              <Image src={image} rounded width="200" height="200" />
            </Col>
          ))}
        </Row>
      </Container>
    </div>
  );
};

export default App;
