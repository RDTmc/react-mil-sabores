// src/components/catalogo/BarraFiltros.jsx
export default function BarraFiltros({
  terminoDeBusqueda,
  onCambiarTerminoDeBusqueda,
  idCategoriaSeleccionada,
  onCambiarIdCategoriaSeleccionada,
  categorias = []
}) {
  return (
    <div className="d-flex flex-wrap gap-2 align-items-center mb-4">
      <input
        className="form-control"
        style={{maxWidth:320}}
        placeholder="Buscar..."
        value={terminoDeBusqueda}
        onChange={e => onCambiarTerminoDeBusqueda(e.target.value)}
        aria-label="Buscar productos"
      />
      <select
        className="form-select"
        style={{maxWidth:260}}
        value={idCategoriaSeleccionada}
        onChange={e => onCambiarIdCategoriaSeleccionada(e.target.value)}
        aria-label="Filtrar por categoría"
      >
        <option value="">Todas las categorías</option>
        {categorias.map(c => (
          <option key={c.id} value={c.id}>{c.name}</option>
        ))}
      </select>
    </div>
  )
}
