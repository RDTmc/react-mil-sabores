/* src/App.jsx */
import { Outlet } from 'react-router-dom';
import { Container } from 'react-bootstrap';

function NavbarMS() {
  return (
    <nav className="navbar navbar-expand-lg" style={{ background:'#FFF5E1', borderBottom:'1px solid #eee' }}>
      <div className="container">
        <a className="navbar-brand" href="/" style={{ fontFamily: 'Pacifico, cursive', color:'#5D4037' }}>Mil Sabores</a>
        <button className="navbar-toggler" type="button" data-bs-toggle="collapse" data-bs-target="#navMS">
          <span className="navbar-toggler-icon"></span>
        </button>
        <div className="collapse navbar-collapse" id="navMS">
          <ul className="navbar-nav ms-auto">
            <li className="nav-item"><a className="nav-link" href="/catalogo">Catálogo</a></li>
            <li className="nav-item"><a className="nav-link" href="/blog">Blog</a></li>
            <li className="nav-item"><a className="nav-link" href="/nosotros">Nosotros</a></li>
            <li className="nav-item"><a className="nav-link" href="/carrito">Carrito</a></li>
            <li className="nav-item"><a className="nav-link" href="/micuenta">Mi Cuenta</a></li>
          </ul>
        </div>
      </div>
    </nav>
  );
}

function FooterMS() {
  return (
    <footer className="mt-auto py-4" style={{ background:'#f9f9f9', borderTop:'1px solid #eee', color:'#5D4037' }}>
      <div className="container d-flex justify-content-between flex-wrap gap-3">
        <small>© {new Date().getFullYear()} Pastelería Mil Sabores</small>
        <div className="d-flex gap-3">
          <a href="/catalogo" className="text-decoration-none">Catálogo</a>
          <a href="/registro" className="text-decoration-none">Mi Cuenta</a>
          <a href="/pedido" className="text-decoration-none">Seguir Pedido</a>
          <a href="/blog" className="text-decoration-none">Blog</a>
        </div>
      </div>
    </footer>
  );
}

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
