import { totals } from '../context/CartContext.jsx';

export default function CartPage() {
  const items = []; // TODO: consumir desde CartContext
  const t = totals(items);
  return (
    <div className="container">
      <h1 className="h3 mb-4">Carrito</h1>
      <div className="table-responsive">
        <table className="table">
          <thead><tr><th>Producto</th><th>Tamaño</th><th>Cantidad</th><th>Precio</th><th>Subtotal</th></tr></thead>
          <tbody>
            {/* TODO: map items */}
            <tr><td colSpan={5} className="text-center">Sin productos</td></tr>
          </tbody>
        </table>
      </div>
      <div className="ms-auto" style={{ maxWidth: 360 }}>
        <ul className="list-group mb-3">
          <li className="list-group-item d-flex justify-content-between"><span>Subtotal</span><strong>${t.sub}</strong></li>
          <li className="list-group-item d-flex justify-content-between"><span>IVA (19%)</span><strong>${t.iva}</strong></li>
          <li className="list-group-item d-flex justify-content-between"><span>Total</span><strong>${t.total}</strong></li>
        </ul>
        <a className="btn btn-dark w-100" href="/pedido">Continuar</a>
      </div>
    </div>
  );
}
