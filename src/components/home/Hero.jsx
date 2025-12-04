import { useEffect, useState } from "react";
import { Link } from "react-router-dom";

// por ahora usa estas rutas; luego cambias por tus URLs de Supabase
const HERO_SLIDES = [
  {
    id: 1,
    src: "https://yjjegavoizzmqmpamdyi.supabase.co/storage/v1/object/public/img/milsabores/slide-3.jpg",
    alt: "Torta de celebración con frutas frescas",
  },
  {
    id: 2,
    src: "https://yjjegavoizzmqmpamdyi.supabase.co/storage/v1/object/public/img/milsabores/slide-03.jpg",   // reemplaza cuando tengas las reales
    alt: "Postres sin azúcar y sin gluten",
  },
  {
    id: 3,
    src: "https://yjjegavoizzmqmpamdyi.supabase.co/storage/v1/object/public/img/milsabores/slide-02.jpg",
    alt: "Opciones veganas artesanales",
  },
];

export default function Hero() {
  const [activeIndex, setActiveIndex] = useState(0);

  // cambio automático cada 4000 ms
  useEffect(() => {
    if (HERO_SLIDES.length <= 1) return;

    const id = setInterval(() => {
      setActiveIndex((prev) => (prev + 1) % HERO_SLIDES.length);
    }, 4000);

    return () => clearInterval(id);
  }, []);

  return (
    <section className="seccion-principal ms-hero">
      <div className="contenido-principal">
        <div className="hero-imagen">
          {HERO_SLIDES.map((slide, index) => (
            <div
              key={slide.id}
              className={`hero-slide ${
                index === activeIndex ? "hero-slide-activa" : ""
              }`}
            >
              <img
                src={slide.src}
                alt={slide.alt}
                loading={index === 0 ? "eager" : "lazy"}
              />
            </div>
          ))}

          {/* degradado para dar contraste */}
          <span className="hero-overlay" aria-hidden="true" />

          {/* TEXTO CON FONDO TRANSPARENTE */}
          <div className="contenido-texto">
            <h1 className="titulo-principal hero-title">
              Celebra la dulzura de la vida
            </h1>
            <p className="hero-subtitle">
              Catálogo de tortas, postres y opciones sin azúcar, sin gluten y
              veganas.
            </p>

            <div className="fila-acciones">
              {/* volvemos a los botones originales */}
              <Link className="btn btn-dark" to="/catalogo">
                Ver catálogo
              </Link>
              <Link className="btn btn-outline-secondary" to="/blog">
                Recetas y noticias
              </Link>
            </div>
          </div>

          {/* puntos del slider */}
          <div className="hero-dots" aria-hidden="true">
            {HERO_SLIDES.map((slide, index) => (
              <button
                key={slide.id}
                type="button"
                className={`hero-dot ${
                  index === activeIndex ? "hero-dot-activo" : ""
                }`}
                onClick={() => setActiveIndex(index)}
              />
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
