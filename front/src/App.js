import React, { useEffect, useState } from 'react';
import { Navbar, Container} from 'react-bootstrap';
import axios from 'axios';
import 'bootstrap/dist/css/bootstrap.min.css';
import { NUMBER_OF_IMAGES } from './constants';
import Gallery from './Gallery';

const App = () => {
  const [images, setImages] = useState([]);

  useEffect(() => {
    const fetchImages = async () => {
      const promises = [];
      for (let i = 0; i <= NUMBER_OF_IMAGES; i++) {
        promises.push(
          axios.get(`/gallery/preview/${i}`, { responseType: 'arraybuffer' })
            .then(response => {
              const imageUrl = URL.createObjectURL(new Blob([response.data], { type: 'image/jpeg' }));
              console.log(imageUrl);
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
      <Gallery images={images} />
    </div>
  );
};

export default App;
