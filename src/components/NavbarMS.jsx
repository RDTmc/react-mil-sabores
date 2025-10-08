import { Link, NavLink } from 'react-router-dom';

export default function NavbarMS() {
  return (
    <nav className="navbar navbar-expand-lg" style={{ background:'#FFF5E1', borderBottom:'1px solid #eee' }}>
      <div className="container">
        <Link className="navbar-brand" to="/" style={{ fontFamily: 'Pacifico, cursive', color:'#5D4037' }}>Mil Sabores</Link>
        <button className="navbar-toggler" type="button" data-bs-toggle="collapse" data-bs-target="#navMS">
          <span className="navbar-toggler-icon"></span>
        </button>
        <div className="collapse navbar-collapse" id="navMS">
          <ul className="navbar-nav ms-auto">
            <li className="nav-item"><NavLink className="nav-link" to="/catalogo">Catálogo</NavLink></li>
            <li className="nav-item"><NavLink className="nav-link" to="/blog">Blog</NavLink></li>
            <li className="nav-item"><NavLink className="nav-link" to="/nosotros">Nosotros</NavLink></li>
            <li className="nav-item"><NavLink className="nav-link" to="/carrito">Carrito</NavLink></li>
            <li className="nav-item"><NavLink className="nav-link" to="/micuenta">Mi Cuenta</NavLink></li>
          </ul>
        </div>
      </div>
    </nav>
  );
}
