// src/components/home/GrillaDeDestacados.jsx
import { useProductosDestacados } from "../../hooks/productosDestacados";

export default function GrillaDeDestacados() {
  const { destacados, loadingDestacados, errorDestacados } = useProductosDestacados();

  if (loadingDestacados) {
    return (
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
    );
  }

  if (errorDestacados) {
    return (
      <div className="alert alert-warning">
        No se pudieron cargar los destacados: {String(errorDestacados)}
      </div>
    );
  }

  return (
    <div className="row row-cols-1 row-cols-sm-2 row-cols-md-4 g-3">
      {destacados.map(p => (
        <div className="col" key={p.id}>
          <div className="card h-100">
            <img src={p.image_path || "/img/placeholder.png"} className="card-img-top" alt={p.name} />
            <div className="card-body">
              <h5 className="card-title">{p.name}</h5>
              <p className="card-text text-muted">{p.description}</p>
              <div className="fw-bold">${p.price?.toLocaleString("es-CL")}</div>
            </div>
          </div>
        </div>
      ))}
    </div>
  );
}
