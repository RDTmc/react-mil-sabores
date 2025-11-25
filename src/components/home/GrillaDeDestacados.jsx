// src/components/home/GrillaDeDestacados.jsx
import { useProductosDestacados } from "../../hooks/productosDestacados";
import { Link, useNavigate } from "react-router-dom";
import { useContext } from "react";
import { useCarrito } from "../../context/CartContext";

export default function GrillaDeDestacados() {
  const { destacados, loadingDestacados, errorDestacados } = useProductosDestacados();
  const { agregarItem } = useCarrito();
  const navigate = useNavigate();

  const handleComprarAhora = (p) => {
    try {
      // Estructura mínima esperada por tu CartContext
      agregarItem({
        id: p.id,
        name: p.name,
        price: p.price,
        image_path: p.image_path || "/img/placeholder.png",
        qty: 1,
        // size: opcional si tu carrito lo usa
      });
      navigate("/checkout");
    } catch (e) {
      // opcional: podrías usar tu ToastContext aquí si quieres mostrar feedback
      // showToast("No se pudo agregar al carrito");
      console.error("Comprar ahora error:", e);
    }
  };

  if (loadingDestacados) {
    return (
      <section className="container mb-5">
        <h2 className="h4 mb-3">Destacados</h2>
        <div className="row row-cols-1 row-cols-sm-2 row-cols-md-4 g-3">
          {Array.from({ length: 4 }).map((_, i) => (
            <div className="col" key={i}>
              <div className="card h-100">
                <div className="ratio ratio-4x3 bg-light placeholder" />
                <div className="card-body">
                  <div className="placeholder-glow"><span className="placeholder col-8"></span></div>
                  <div className="placeholder-glow"><span className="placeholder col-6"></span></div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </section>
    );
  }

  if (errorDestacados) {
    return (
      <section className="container mb-5">
        <div className="alert alert-warning">
          No se pudieron cargar los destacados: {String(errorDestacados)}
        </div>
      </section>
    );
  }

  return (
    <section className="container mb-5">
      <h2 className="h4 mb-3">Destacados</h2>
      <div className="row row-cols-1 row-cols-sm-2 row-cols-md-4 g-3">
        {destacados.map((p) => (
          <div className="col" key={p.id}>
            <div className="card h-100 d-flex flex-column">
              <img
                src={p.image_path || "/img/placeholder.png"}
                className="card-img-top"
                alt={p.name}
              />
              <div className="card-body d-flex flex-column">
                <h5 className="card-title">{p.name}</h5>
                <p className="card-text text-muted flex-grow-1">{p.description}</p>
                <div className="fw-bold mb-3">${p.price?.toLocaleString("es-CL")}</div>

                <div className="d-flex gap-2 mt-auto">
                  <Link to={`/producto/${p.id}`} className="btn btn-dark btn-sm">
                    Ver
                  </Link>
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>
    </section>
  );
}
