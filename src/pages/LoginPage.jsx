export default function LoginPage() {
  return (
    <div className="container" style={{ maxWidth: 480 }}>
      <h1 className="h3 mb-3">Iniciar sesión</h1>
      <form className="vstack gap-3">
        <input className="form-control" type="email" placeholder="Email" />
        <input className="form-control" type="password" placeholder="Contraseña" />
        <button className="btn btn-dark">Entrar</button>
      </form>
      <div className="mt-3">
        <a href="/registro" className="link-secondary">Crear cuenta</a>
      </div>
    </div>
  );
}
