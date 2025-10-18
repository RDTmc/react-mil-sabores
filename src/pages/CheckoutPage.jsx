export default function CheckoutPage() {
  return (
    <div className="container">
      <h1 className="h3 mb-4">Pedido</h1>
      <form className="row g-3">
        <div className="col-md-6">
          <label className="form-label">Nombre</label>
          <input className="form-control" />
        </div>
        <div className="col-md-6">
          <label className="form-label">Email</label>
          <input type="email" className="form-control" />
        </div>
        <div className="col-12">
          <label className="form-label">Dirección</label>
          <input className="form-control" />
        </div>
        <div className="col-12">
          <label className="form-label">Notas</label>
          <textarea className="form-control" rows="3" />
        </div>
        <div className="col-12">
          <button className="btn btn-primary">Confirmar compra</button>
        </div>
      </form>
    </div>
  );
}
