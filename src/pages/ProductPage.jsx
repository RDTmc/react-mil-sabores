import { useParams, Link } from 'react-router-dom';

export default function ProductPage() {
  const { id } = useParams();
  return (
    <div className="container">
      <div className="row g-4">
        <div className="col-md-6">
          <div className="bg-light rounded" style={{ height: 320 }} />
        </div>
        <div className="col-md-6">
          <h1 className="h3">Producto {id}</h1>
          <p>Descripción del producto desde BD.</p>
          <div className="mb-3">
            <label className="form-label">Tamaño</label>
            <select className="form-select">
              <option>8 porciones</option>
              <option>10 porciones</option>
              <option>12 porciones</option>
            </select>
          </div>
          <div className="d-flex gap-2">
            <button className="btn btn-primary">Añadir al carrito</button>
            <Link to="/carrito" className="btn btn-outline-secondary">Ir al carrito</Link>
          </div>
        </div>
      </div>
    </div>
  );
}
