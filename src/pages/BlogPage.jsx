import { Link } from "react-router-dom";
import "../styles/BlogPage.css";
import "../styles/brand.css";

export default function BlogPage() {
  return (
    <div className="container contenedor blogpage">
      <h1 className="h3">Blog & Recetas</h1>

      <div className="noticia_1">
        <h1>Recetas & Noticias</h1>
        <h2 className="titulo-principal">Noticias</h2>

        {/* Grid ÚNICO para todas las noticias */}
        <div className="rejilla-noticias">
          {[
            {
              img: "/img/tc_chocolate.png",
              titulo: "Nueva torta 50 Años",
              fecha: "Septiembre 2025",
              texto: "Presentamos nuestra nueva torta 50 años.",
              ruta: "/blog/nueva-torta-50",
            },
            {
              img: "/img/noticia2.jpg",
              titulo: "Entrega programada en RM",
              fecha: "Agosto 2025",
              texto:
                "Ahora puedes elegir fecha de entrega al confirmar tu pedido.",
              ruta: "/blog/entrega-rm",
            },
            {
              img: "/img/noticia3.png",
              titulo: "Celebración de aniversario",
              fecha: "Julio 2025",
              texto:
                "Este mes celebramos nuestro 10º aniversario. ¡Gracias por su apoyo!",
              ruta: "/blog/aniversario-10",
            },
            {
              img: "/img/noticia4.jpg",
              titulo: "Lanzamiento de la línea vegana",
              fecha: "Junio 2025",
              texto:
                "Presentamos nuestra nueva línea de productos veganos, ideal para todos.",
              ruta: "/blog/linea-vegana",
            },
            {
              img: "/img/noticia5.jpg",
              titulo: "Premio al mejor pastelero",
              fecha: "Mayo 2025",
              texto:
                'Estamos orgullosos de recibir el premio a "Mejor Pastelero del Año".',
              ruta: "/blog/mejor-pastelero",
            },
            {
              img: "/img/noticia6.jpg",
              titulo: "¡Nuestra tienda se muda!",
              fecha: "Abril 2025",
              texto:
                "Nos mudamos a una nueva ubicación en el centro de la ciudad. ¡Visítanos!",
              ruta: "/blog/nueva-tienda",
            },
          ].map((n, i) => (
            <article className="tarjeta-noticia" key={i}>
              <img src={n.img} alt={n.titulo} />
              <div className="cuerpo">
                <h3>{n.titulo}</h3>
                <p className="texto-secundario">{n.fecha}</p>
                <p>{n.texto}</p>
              </div>
              <div className="fila-acciones">
                <Link className="boton-pequeno-borde" to={n.ruta}>
                  Ver
                </Link>
              </div>
            </article>
          ))}
        </div>

        <p className="text-muted mt-3">
        </p>

        {/* Sección de Recetas */}
        <section className="seccion-recetas">
          <h2 className="titulo-principal">Recetas de Repostería</h2>
          <div className="rejilla-recetas">
            {[
              {
                img: "/img/receta1.jpg",
                titulo: "Torta de Chocolate",
                subtitulo: "Receta fácil y deliciosa",
                texto: "Una receta clásica para todos los amantes del chocolate.",
                ruta: "/recetas/torta-chocolate",
              },
              {
                img: "/img/receta2.jpg",
                titulo: "Torta Vegana",
                subtitulo: "Receta para todos",
                texto:
                  "Disfruta de esta torta sin ingredientes de origen animal.",
                ruta: "/recetas/torta-vegana",
              },
              {
                img: "/img/receta3.jpg",
                titulo: "Torta de Frutas",
                subtitulo: "Receta fresca y deliciosa",
                texto:
                  "Una receta ideal para el verano, llena de frutas frescas.",
                ruta: "/recetas/torta-frutas",
              },
              {
                img: "/img/receta4.jpg",
                titulo: "Mousse de Chocolate",
                subtitulo: "Receta cremosa y suave",
                texto: "Una receta perfecta para los amantes del chocolate.",
                ruta: "/recetas/mousse-chocolate",
              },
              {
                img: "/img/receta5.jpg",
                titulo: "Tarta de Limón",
                subtitulo: "Receta refrescante y deliciosa",
                texto:
                  "Una tarta refrescante con un toque cítrico perfecto para el verano.",
                ruta: "/recetas/tarta-limon",
              },
              {
                img: "/img/receta6.jpg",
                titulo: "Brownie de Chocolate",
                subtitulo: "Receta intensa y deliciosa",
                texto:
                  "Un brownie de chocolate con el toque perfecto de suavidad y sabor.",
                ruta: "/recetas/brownie-chocolate",
              },
            ].map((r, i) => (
              <article className="tarjeta-receta" key={i}>
                <img src={r.img} alt={r.titulo} />
                <div className="cuerpo">
                  <h3>{r.titulo}</h3>
                  <p className="texto-secundario">{r.subtitulo}</p>
                  <p>{r.texto}</p>
                </div>
                <div className="fila-acciones">
                  <Link className="boton-pequeno" to={r.ruta}>
                    Ver receta
                  </Link>
                </div>
              </article>
            ))}
          </div>
        </section>

       <div>
          <div className="titulo-principal">Sigue nuestras recetas...</div>
          <div className="ratio ratio-16x9 mt-3">
            <iframe
              src="https://www.youtube.com/embed/wiRCcOHSXkc?start=5"
              title="YouTube"
              frameBorder="0"
              allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
              allowFullScreen
            ></iframe>
          </div>
        </div>


      </div>
    </div>
  );
}
