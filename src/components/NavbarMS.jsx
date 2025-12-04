import { Link, NavLink, useNavigate } from "react-router-dom";
import { FaShoppingCart, FaUser } from "react-icons/fa";
import { useCarrito } from "../context/CartContext";
import { useAuth } from "../context/AuthContext";
import "../styles/NavbarMS.css";
import "../styles/brand.css";

export default function NavbarMS() {
  const { listaItems, obtenerTotales } = useCarrito();
  const { cantidad } = obtenerTotales(listaItems || []);

  const { isAuthenticated, isAdmin, user, logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = async () => {
    try {
      await logout();
      navigate("/", { replace: true });
    } catch (e) {
      // opcional: podrías mostrar un toast
    }
  };

  const firstName = user?.fullName?.split(" ")[0] || "Mi Cuenta";

  return (
    <nav className="ms-navbar navbar navbar-expand-lg">
      <div className="container">
        {/* Brand: logo + nombre + tagline */}
        <Link
          className="navbar-brand ms-brand d-flex align-items-center"
          to="/"
        >
          
          <div className="ms-brand-text">
            <span className="ms-brand-title">Mil Sabores</span>
            <span className="ms-brand-tagline">
              Pastelería artesanal online
            </span>
          </div>
        </Link>

        {/* Toggle mobile */}
        <button
          className="navbar-toggler"
          type="button"
          data-bs-toggle="collapse"
          data-bs-target="#navMS"
          aria-controls="navMS"
          aria-expanded="false"
          aria-label="Toggle navigation"
        >
          <span className="navbar-toggler-icon"></span>
        </button>

        {/* Contenido colapsable */}
        <div className="collapse navbar-collapse" id="navMS">
          <div className="ms-navbar-main ms-auto d-flex flex-column flex-lg-row align-items-lg-center gap-3">
            {/* Navegación principal */}
            <ul className="navbar-nav ms-nav-primary align-items-lg-center gap-lg-2">
              <li className="nav-item">
                <NavLink className="nav-link" to="/catalogo">
                  Catálogo
                </NavLink>
              </li>

              {isAuthenticated && isAdmin && (
                <li className="nav-item">
                  <NavLink className="nav-link" to="/admin">
                    Admin
                  </NavLink>
                </li>
              )}

              <li className="nav-item">
                <NavLink className="nav-link" to="/blog">
                  Blog
                </NavLink>
              </li>

              <li className="nav-item">
                <NavLink className="nav-link" to="/nosotros">
                  Nosotros
                </NavLink>
              </li>
            </ul>

            {/* Acciones: carrito + cuenta + CTA */}
            <div className="ms-nav-actions">
              {/* Carrito con badge */}
              <NavLink
                className="nav-link d-flex align-items-center gap-1 ms-cart-btn"
                to="/carrito"
                aria-label={
                  cantidad > 0
                    ? `Carrito, ${cantidad} artículos`
                    : "Carrito vacío"
                }
              >
                <FaShoppingCart aria-hidden="true" />
                <span></span>
                {cantidad > 0 && (
                  <span className="ms-cart-badge activo" aria-hidden="true">
                    {cantidad > 99 ? "99+" : cantidad}
                  </span>
                )}
              </NavLink>

              {/* Mi Cuenta / Ingresar */}
              {isAuthenticated ? (
                <div className="d-flex align-items-center ms-account-group">
                  <NavLink
                    className="nav-link d-flex align-items-center gap-1"
                    to="/micuenta"
                  >
                    <FaUser aria-hidden="true" />
                    <span>{firstName}</span>
                  </NavLink>
                  <button
                    type="button"
                    className="btn btn-link nav-link ms-logout-btn p-0 ms-2"
                    onClick={handleLogout}
                  >
                    Salir
                  </button>
                </div>
              ) : (
                <NavLink
                  className="nav-link d-flex align-items-center gap-1"
                  to="/login"
                >
                  <FaUser aria-hidden="true" />
                  <span>Ingresar</span>
                </NavLink>
              )}

              {/* CTA principal: Pedir ahora */}
              <Link
                to="/catalogo"
                className="btn btn-pill ms-cta-btn d-flex align-items-center"
              >
                Pedir ahora
              </Link>
            </div>
          </div>
        </div>
      </div>
    </nav>
  );
}
