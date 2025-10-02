export default function BlogPage() {
  return (
    <div className="container">
      <h1 className="h3">Blog & Recetas</h1>
      <p className="text-muted">Contenido estático por ahora. Luego lo conectamos a Supabase.</p>
      {/* YouTube embed sin API keys */}
      <div className="ratio ratio-16x9 mt-3">
        <iframe src="https://youtube.com/@milsabores1632?si=gNYo22KkHOSyhkrD" title="YouTube" allowFullScreen></iframe>
      </div>
    </div>
  );
}
