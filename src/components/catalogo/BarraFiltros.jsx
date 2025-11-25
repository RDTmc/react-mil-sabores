export default function BarraFiltros({ terminoDeBusqueda, setTerminoDeBusqueda, idCategoriaSeleccionada, cambiarIdCategoriaSeleccionada, categorias = [] }) {
    return (
      <div className="d-flex flex-wrap gap-2 align-items-center mb-4">
        <input 
          className="form-control" 
          style={{maxWidth:320}} 
          placeholder="Buscar..."
          value={terminoDeBusqueda} 
          onChange={e=>setTerminoDeBusqueda(e.target.value)} aria-label="Buscar productos" />
        <select 
          className="form-select" 
          style={{maxWidth:260}}
          value={idCategoriaSeleccionada} 
          onChange={e=>cambiarIdCategoriaSeleccionada(e.target.value)} aria-label="Filtrar por categoría">
          <option value="">Todas las categorías</option>
          {categorias.map(categoria => (<option key={categoria.id} value={categoria.id}>{categoria.name}</option>))}
        </select>
      </div>
    )
  }
  