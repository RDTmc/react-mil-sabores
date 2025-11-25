// src/components/catalogo/PaginadorMS.jsx
export default function PaginadorMS({ page = 0, totalPages = 0, onPagina }) {
  if (!totalPages || totalPages <= 1) return null;

  const go = (p) => {
    if (p < 0 || p >= totalPages || p === page) return;
    onPagina?.(p);
  };

  // genera un rango compacto: primero, último, y ventana alrededor
  const window = 1;
  const pages = [];
  for (let i = 0; i < totalPages; i++) {
    if (i === 0 || i === totalPages - 1 || Math.abs(i - page) <= window) {
      pages.push(i);
    } else if (pages[pages.length - 1] !== '...') {
      pages.push('...');
    }
  }

  return (
    <nav aria-label="Paginación de catálogo" className="d-flex justify-content-center">
      <ul className="pagination mb-0">
        <li className={`page-item ${page === 0 ? 'disabled' : ''}`}>
          <button className="page-link" onClick={() => go(page - 1)} aria-label="Anterior">«</button>
        </li>

        {pages.map((p, idx) =>
          p === '...' ? (
            <li className="page-item disabled" key={`ellipsis-${idx}`}>
              <span className="page-link">…</span>
            </li>
          ) : (
            <li className={`page-item ${p === page ? 'active' : ''}`} key={p}>
              <button className="page-link" onClick={() => go(p)}>
                {p + 1}
              </button>
            </li>
          )
        )}

        <li className={`page-item ${page >= totalPages - 1 ? 'disabled' : ''}`}>
          <button className="page-link" onClick={() => go(page + 1)} aria-label="Siguiente">»</button>
        </li>
      </ul>
    </nav>
  );
}
