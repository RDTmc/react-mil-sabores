export default function AccountPage() {
  return (
    <div className="container">
      <h1 className="h3 mb-3">Mi Cuenta</h1>
      <div className="row g-3">
        <div className="col-md-4">
          <div className="card h-100">
            <div className="card-body">
              <h5 className="card-title">Perfil</h5>
              <p className="card-text">Nombre, email, teléfono...</p>
              <button className="btn btn-outline-secondary btn-sm">Editar</button>
            </div>
          </div>
        </div>
        <div className="col-md-8">
          <div className="card h-100">
            <div className="card-body">
              <h5 className="card-title">Pedidos</h5>
              <div className="table-responsive">
                <table className="table">
                  <thead><tr><th>#</th><th>Fecha</th><th>Estado</th><th>Total</th></tr></thead>
                  <tbody>
                    <tr><td colSpan={4} className="text-center">Sin pedidos</td></tr>
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
