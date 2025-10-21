import { Link } from 'react-router-dom'

export default function NewsGrid() {
  const news = [
    { img:'/img/tc_chocolate.png',  title:'Nueva torta 50 Años', date:'Septiembre 2025', text:'Presentamos nuestra nueva torta 50 años.' },
    { img:'/img/noticia2.jpg',      title:'Entrega programada en RM', date:'Agosto 2025', text:'Ahora puedes elegir fecha de entrega al confirmar tu pedido.' },
    { img:'/img/noticia3.png',      title:'Celebración de aniversario', date:'Julio 2025', text:'Este mes celebramos nuestro 10º aniversario. ¡Gracias por su apoyo!' },
    { img:'/img/noticia4.jpg',      title:'Lanzamiento de la línea vegana', date:'Junio 2025', text:'Presentamos nuestra nueva línea de productos veganos, ideal para todos.' },
  ]
  return (
    <section className="container mb-4">
      <h2 className="h4 mb-3">Noticias</h2>
      <div className="row row-cols-1 row-cols-md-2 row-cols-lg-4 g-3">
        {news.map((n,i)=>(
          <div className="col" key={i}>
            <article className="card h-100 ms-card">
              <div className="ratio ratio-4x3">
                <img src={n.img} alt={n.title} className="card-img-top object-fit-cover" />
              </div>
              <div className="card-body d-flex flex-column">
                <h3 className="h6 mb-1">{n.title}</h3>
                <p className="text-muted mb-1">{n.date}</p>
                <p className="mb-3">{n.text}</p>
                <div className="mt-auto">
                  <Link className="btn btn-outline-secondary btn-sm" to="/blog">Ver en Blog</Link>
                </div>
              </div>
            </article>
          </div>
        ))}
      </div>
    </section>
  )
}
