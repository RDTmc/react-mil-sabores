export default function RegisterPage() {
  return (
    <div className="container" style={{ maxWidth: 560 }}>
      <h1 className="h3 mb-3">Crear cuenta</h1>
      <form className="row g-3">
        <div className="col-md-6">
          <input className="form-control" placeholder="Nombre" />
        </div>
        <div className="col-md-6">
          <input className="form-control" placeholder="Apellido" />
        </div>
        <div className="col-12">
          <input className="form-control" type="email" placeholder="Email" />
        </div>
        <div className="col-12">
          <input className="form-control" type="password" placeholder="Contraseña" />
        </div>
        <div className="col-md-6">
          <label className="form-label">Fecha de nacimiento</label>
          <input className="form-control" type="date" />
        </div>
        <div className="col-12">
          <button className="btn btn-primary">Registrarme</button>
        </div>
      </form>
      <p className="text-muted mt-2" style={{ fontSize: '0.9rem' }}>La compra estará disponible para mayores de 18 años (validación posterior).</p>
    </div>
  );
}
