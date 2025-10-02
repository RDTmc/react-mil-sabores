import { Link } from 'react-router-dom';

export default function HomePage() {
  return (
    <div className="py-4">
      <div className="p-5 mb-4 rounded-3" style={{ background:'#ffe9c0', border:'1px solid #f2d9a6' }}>
        <div className="container py-5">
          <h1 className="display-5 fw-bold" style={{ color:'#5D4037', fontFamily:'Pacifico, cursive' }}>Pastelería Mil Sabores</h1>
          <p className="col-md-8 fs-5" style={{ color:'#5D4037' }}>Celebra la dulzura de la vida con nuestras tortas y postres artesanales.</p>
          <Link to="/catalogo" className="btn btn-dark btn-lg">Ver catálogo</Link>
        </div>
      </div>

      <section className="container">
        <div className="d-flex justify-content-between align-items-center mb-3">
          <h2 className="h4">Destacados</h2>
          <Link to="/catalogo" className="btn btn-outline-secondary btn-sm">Ver todo</Link>
        </div>
        {/* TODO: Renderizar featured_products desde Supabase */}
        <div className="row row-cols-1 row-cols-sm-2 row-cols-md-3 g-3">
          {[1,2,3].map(i => (
            <div className="col" key={i}>
              <div className="card h-100">
                <div className="card-body">
                  <h5 className="card-title">Producto {i}</h5>
                  <p className="card-text">Descripción corta del producto.</p>
                  <Link to="/producto/TC001" className="btn btn-primary">Comprar ahora</Link>
                </div>
              </div>
            </div>
          ))}
        </div>
      </section>
    </div>
  );
}
