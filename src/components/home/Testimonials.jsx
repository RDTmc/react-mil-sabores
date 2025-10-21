export default function Testimonials() {
    const items = [
      { name:'Juan Pérez', comuna:'Santiago, Chile', producto:'Torta de Frutas',  img:'/img/cliente1.png', text:'"¡La mejor pastelería que he probado! Mis invitados quedaron fascinados con la torta de frutas."' },
      { name:'Carla Gómez', comuna:'Valparaíso, Chile', producto:'Torta de Chocolate', img:'/img/cliente2.png', text:'"¡Exquisito! No pude resistirme y volví por más, 100% recomendado para cualquier ocasión."' },
      { name:'Pedro Martínez', comuna:'Rancagua, Chile', producto:'Torta Vegana', img:'/img/cliente3.png', text:'"Me encantó la opción vegana, ¡totalmente deliciosa! Gracias por hacer tan buenos productos."' },
      { name:'Ana Rodríguez', comuna:'Concepción, Chile', producto:'Torta de Chocolate', img:'/img/cliente4.png', text:'"La torta de chocolate fue un éxito total en la fiesta de cumpleaños. ¡Todos quedaron encantados!"' },
    ]
    return (
      <section className="container mb-5">
        <h2 className="h4 mb-3">Lo que dicen nuestros clientes</h2>
        <div className="row row-cols-1 row-cols-md-2 row-cols-lg-4 g-3">
          {items.map((t,i)=>(
            <div className="col" key={i}>
              <div className="card h-100 ms-card">
                <div className="card-body">
                  <p className="mb-3">{t.text}</p>
                  <div className="d-flex align-items-center gap-2">
                    <img src={t.img} alt={t.name} width="44" height="44" className="rounded-circle object-fit-cover" />
                    <div>
                      <div className="fw-semibold">{t.name}</div>
                      <small className="text-muted">{t.comuna}</small><br/>
                      <small className="text-muted">{t.producto}</small>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </section>
    )
  }
  