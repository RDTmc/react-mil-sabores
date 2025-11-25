export default function Discounts() {
    const items = [
      { pct:'50%', title:'Adultos Mayores', text:'Personas de 50+ años reciben 50% de descuento en todos los productos' },
      { pct:'10%', title:'Código FELICES50', text:'Descuento de por vida al registrarte con este código especial' },
      { pct:'25%', title:'Estudiantes Duoc', text:'Descuento del 25% en tu cumpleaños al registrarte con tu email institucional' },
    ]
    return (
      <section className="container mb-5">
        <div className="rounded p-4 ms-promo ms-shadow-sm">
          <h2 className="h4 mb-3" style={{ color:'#2b190f' }}>Descuentos Especiales</h2>
          <div className="row row-cols-1 row-cols-md-3 g-3">
            {items.map((d,i)=>(
              <div className="col" key={i}>
                <div className="card h-100 border-0 ms-shadow-sm">
                  <div className="card-body">
                    <div className="display-6 fw-bold">{d.pct}</div>
                    <h3 className="h6">{d.title}</h3>
                    <p className="mb-0">{d.text}</p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>
    )
  }
  