import { Link } from "react-router-dom";
import "../styles/brand.css";
import "../styles/FooterMS.css";
import { FaFacebookF, FaInstagram, FaTwitter } from "react-icons/fa";
import { FaPhone, FaEnvelope, FaMapMarkerAlt } from "react-icons/fa";


export default function FooterMS() {
  return (
    <footer className="ms-footer">
      <div className="contenedor-footer">
        <div className="footer-contenido">
          <section className="footer-section" aria-labelledby="ms-footer-brand">
            <h3 id="ms-footer-brand">Mil Sabores</h3>
            <p>
              50 años endulzando momentos especiales con la más alta calidad y
              tradición familiar.
            </p>
          </section>

          <nav className="footer-section" aria-labelledby="ms-footer-links">
            <h3 id="ms-footer-links">Enlaces Rápidos</h3>
            <ul className="lista-enlaces">
              <li>
                <Link to="/catalogo">Catálogo</Link>
              </li>
              <li>
                <Link to="/registro">Mi Cuenta</Link>
              </li>
              <li>
                {/* Mejor destino para seguimiento de pedidos */}
                <Link to="/micuenta">Seguir Pedido</Link>
                {/* Si prefieres la página de confirmación reciente: <Link to="/compra">Compra reciente</Link> */}
              </li>
              <li>
                <Link to="/blog">Blog</Link>
              </li>
            </ul>
          </nav>

          <section className="footer-section" aria-labelledby="ms-footer-contacto">
            <h3 id="ms-footer-contacto">Contacto</h3>
            <p>
              <FaPhone aria-hidden="true" />
              &nbsp; +56 9 1234 5678
            </p>
            <p>
              <FaEnvelope aria-hidden="true" />
              &nbsp; info@milsabores.cl
            </p>
            <p>
              <FaMapMarkerAlt aria-hidden="true" />
              &nbsp; Santiago, Chile
            </p>
          </section>

          <section className="footer-section" aria-labelledby="ms-footer-social">
            <h3 id="ms-footer-social">Síguenos</h3>
            <div className="social">
              <a
                href="https://www.facebook.com/pasteleria.candellesa/?locale=es_LA"
                target="_blank"
                rel="noopener noreferrer"
                aria-label="Facebook"
                title="Facebook"
              >
                <FaFacebookF />
              </a>
              <a
                href="https://www.instagram.com/holycocoa.cl/?hl=es"
                target="_blank"
                rel="noopener noreferrer"
                aria-label="Instagram"
                title="Instagram"
              >
                <FaInstagram />
              </a>
              <a
                href="https://x.com/tocasdelicias"
                target="_blank"
                rel="noopener noreferrer"
                aria-label="X (Twitter)"
                title="X (Twitter)"
              >
                <FaTwitter />
              </a>
            </div>
          </section>
        </div>

        <hr className="divider" />

        <div className="footer-copy">
          <p>
            © {new Date().getFullYear()} Pastelería Mil Sabores. Todos los
            derechos reservados.
          </p>
        </div>
      </div>
    </footer>
  );
}
