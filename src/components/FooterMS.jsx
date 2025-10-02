export default function FooterMS() {
  return (
    <footer className="mt-auto py-4" style={{ background:'#f9f9f9', borderTop:'1px solid #eee', color:'#5D4037' }}>
      <div className="container d-flex justify-content-between flex-wrap gap-3">
        <small>© {new Date().getFullYear()} Pastelería Mil Sabores</small>
        <div className="d-flex gap-3">
          <a href="/catalogo" className="text-decoration-none">Catálogo</a>
          <a href="/registro" className="text-decoration-none">Mi Cuenta</a>
          <a href="/pedido" className="text-decoration-none">Seguir Pedido</a>
          <a href="/blog" className="text-decoration-none">Blog</a>
        </div>
      </div>
    </footer>
  );
}
