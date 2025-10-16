import "./FooterMS.css"; 
import { FaFacebookF, FaInstagram, FaTwitter, FaPhone, FaEnvelope, FaMapMarkerAlt } from "react-icons/fa";




export default function FooterMS() {
  return (
    <footer className="ms-footer">
      <div className="contenedor-footer">
        <div className="footer-contenido">
          <div className="footer-section">
            <h3>Mil Sabores</h3>
            <p>
              50 años endulzando momentos especiales con la más alta calidad y
              tradición familiar.
            </p>
          </div>

          <div className="footer-section">
            <h3>Enlaces Rápidos</h3>
            <ul className="lista-enlaces">
              <li><a href="/catalogo">Catálogo</a></li>
              <li><a href="/registro">Mi Cuenta</a></li>
              <li><a href="/pedido">Seguir Pedido</a></li>
              <li><a href="/blog">Blog</a></li>
            </ul>
          </div>

          <div className="footer-section">
            <h3>Contacto</h3>
            <p><FaPhone />&nbsp; +56 9 1234 5678</p>
            <p><FaEnvelope />&nbsp; info@milsabores.cl</p>
            <p><FaMapMarkerAlt />&nbsp; Santiago, Chile</p>
          </div>

          <div className="footer-section">
            <h3>Síguenos</h3>
            <div className="social">
              <a href="https://www.facebook.com/pasteleria.candellesa/?locale=es_LA" target="_blank" rel="noopener noreferrer">
                <FaFacebookF />
              </a>
              <a href="https://www.instagram.com/holycocoa.cl/?hl=es" target="_blank" rel="noopener noreferrer">
                <FaInstagram />
              </a>
              <a href="https://x.com/tocasdelicias" target="_blank" rel="noopener noreferrer">
                <FaTwitter />
              </a>
            </div>
          </div>
        </div>

        <hr className="divider" />

        <div className="footer-copy">
          <p>© {new Date().getFullYear()} Pastelería Mil Sabores. Todos los derechos reservados.</p>
        </div>
      </div>
    </footer>
  );
}
