export default function Benefits() {
    const items = [
      { icon: 'fa-solid fa-trophy', title: 'Récord Guinness', text: 'Participamos en la creación de la torta más grande del mundo en 1995. Experiencia y calidad garantizada.' },
      { icon: 'fa-solid fa-cake-candles', title: 'Personalización Total', text: 'Cada torta puede ser personalizada con mensajes especiales para hacer tu celebración única.' },
      { icon: 'fa-solid fa-truck', title: 'Entrega Programada', text: 'Elige la fecha perfecta para tu evento. Seguimiento en tiempo real de tu pedido.' },
      { icon: 'fa-solid fa-graduation-cap', title: 'Formamos Talento', text: 'Apoyamos a estudiantes de gastronomía con recetas, consejos y oportunidades de crecimiento.' },
    ]
  
    return (
      <section className="container mb-4">
        <div className="rounded p-4 ms-shadow-sm" style={{ background:'#fff', border:'1px solid #f2d9a6' }}>
          <h2 className="h4 mb-3">¿Por Qué Elegir Mil Sabores?</h2>
          <div className="row row-cols-1 row-cols-md-2 row-cols-lg-4 g-3">
            {items.map((b,i)=>(
              <div className="col" key={i}>
                <div className="card h-100 ms-card">
                  <div className="card-body">
                    {/* Si no cargas Font Awesome, puedes quitar el <i> o reemplazar por emoji */}
                    <div className="mb-2" style={{ fontSize: '1.4rem', color:'#8B4513' }}>
                      <i className={b.icon} aria-hidden="true"></i>
                    </div>
                    <h3 className="h6">{b.title}</h3>
                    <p className="mb-0 text-muted">{b.text}</p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>
    )
  }
  