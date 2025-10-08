/* src/App.jsx */
import { Outlet } from 'react-router-dom';
import { Container } from 'react-bootstrap';
import NavbarMS from './components/NavbarMS.jsx';
import FooterMS from './components/FooterMS.jsx';

export default function AppLayout() {
  return (
    <div className="d-flex flex-column min-vh-100" style={{ background: '#FFF5E1', color: '#5D4037' }}>
      <NavbarMS />
      <Container className="flex-grow-1 my-4">
        <Outlet />
      </Container>
      <FooterMS />
    </div>
  );
}
