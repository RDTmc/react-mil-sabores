export default function CatalogPage() {
  return (
    <div className="container">
      <div className="d-flex justify-content-between align-items-center mb-4">
        <h1 className="h3">Catálogo</h1>
        <div className="d-flex gap-2">
          <input className="form-control" placeholder="Buscar..." />
          <select className="form-select">
            <option value="">Todas las categorías</option>
          </select>
        </div>
      </div>
      {/* TODO: Grid de productos desde Supabase */}
      <div className="row row-cols-1 row-cols-sm-2 row-cols-md-3 g-3">
        {[...Array(6)].map((_, idx) => (
          <div className="col" key={idx}>
            <div className="card h-100">
              <div className="card-body">
                <h5 className="card-title">Producto</h5>
                <p className="card-text">Descripción corta</p>
                <button className="btn btn-outline-primary">Ver</button>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
