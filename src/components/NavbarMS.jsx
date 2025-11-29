import { Link, NavLink, useNavigate } from "react-router-dom";
import { FaShoppingCart, FaUser } from "react-icons/fa";
import { useCarrito } from "../context/CartContext";
import { useAuth } from "../context/AuthContext";
import "../styles/NavbarMS.css";
import "../styles/brand.css";

export default function NavbarMS() {
  const { listaItems, obtenerTotales } = useCarrito();
  const { cantidad } = obtenerTotales(listaItems || []);

  // 👇 AHORA también traemos isAdmin
  const { isAuthenticated, isAdmin, user, logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = async () => {
    try {
      await logout();
      navigate("/", { replace: true });
    } catch (e) {
      // opcional: podrías mostrar un toast
      // console.error('[Navbar] error al cerrar sesión', e)
    }
  };

  const firstName = user?.fullName?.split(" ")[0] || "Mi Cuenta";

  return (
    <nav className="ms-navbar navbar navbar-expand-lg">
      <div className="container">
        <Link className="navbar-brand brand d-flex align-items-center" to="/">
          <img
            src="/img/logo-pasteleria.png"
            alt="Mil Sabores Logo"
            className="logo me-2"
          />
          <span></span>
        </Link>

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

        <div className="collapse navbar-collapse" id="navMS">
          <ul className="navbar-nav ms-auto align-items-lg-center gap-lg-2">
            <li className="nav-item">
              <NavLink className="nav-link" to="/catalogo">
                Catálogo
              </NavLink>
            </li>
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

            {/* Carrito con badge */}
            <li className="nav-item">
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
            </li>

            {/* Link Admin visible solo para usuarios con rol ADMIN */}
            {isAuthenticated && isAdmin && (
              <li className="nav-item">
                <NavLink
                  className="nav-link d-flex align-items-center gap-1 text-uppercase small"
                  to="/admin"
                >
                  <span>Admin</span>
                </NavLink>
              </li>
            )}

            {/* Mi Cuenta / Ingresar */}
            <li className="nav-item d-flex align-items-center">
              {isAuthenticated ? (
                <>
                  <NavLink
                    className="nav-link d-flex align-items-center gap-1"
                    to="/micuenta"
                  >
                    <FaUser aria-hidden="true" />
                    <span>{firstName}</span>
                  </NavLink>
                  <button
                    type="button"
                    className="btn btn-link nav-link ms-2 p-0"
                    onClick={handleLogout}
                  >
                    Salir
                  </button>
                </>
              ) : (
                <NavLink
                  className="nav-link d-flex align-items-center gap-1"
                  to="/login"
                >
                  <FaUser aria-hidden="true" />
                  <span>Ingresar</span>
                </NavLink>
              )}
            </li>
          </ul>
        </div>
      </div>
    </nav>
  );
}
