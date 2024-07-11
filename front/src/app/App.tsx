import React from 'react';
import { Navbar, Container} from 'react-bootstrap';
import 'bootstrap/dist/css/bootstrap.min.css';
import Gallery from '../components/Gallery';

const App: React.FC = () => {

  return (
    <div>
      <Navbar bg="dark" variant="dark">
        <Container>
          <Navbar.Brand href="#home">ThisPersonApp</Navbar.Brand>
        </Container>
      </Navbar>
      <Gallery />
    </div>
  );
};

export default App;
