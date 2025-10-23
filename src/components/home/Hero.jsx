import { Link } from 'react-router-dom';

export default function Hero() {
  return (
    <section className="seccion-principal">
      <div className="contenido-principal">
        <div className="hero-imagen">
          <img
            src="/img/imagen-principal.jpg"
            alt="Imagen principal"
            className="main-img"
          />
          {/* overlay opcional accesible */}
          <span className="hero-overlay" aria-hidden="true" />
        </div>

        <div className="contenido-texto">
          <h1 className="titulo-destacado">Celebra la dulzura de la vida</h1>
          <p>Catálogo de tortas, postres y opciones sin azúcar, sin gluten y veganas.</p>
          <div className="fila-acciones">
            <Link className="btn btn-dark" to="/catalogo">Ver catálogo</Link>
            <Link className="btn btn-outline-secondary" to="/blog">Recetas & Noticias</Link>
          </div>
        </div>
      </div>
    </section>
  );
}
