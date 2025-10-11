export default function BlogPage() {
  return (
    <div className="container">
      <h1 className="h3">Blog & Recetas</h1>

      <div className="noticia_1">
        <h1>Recetas & Noticias</h1>
        <h2 className="titulo-principal">Noticias</h2>

        <div id="rejilla-noticias" className="rejilla-noticias">
          <article className="tarjeta-noticia">
            <img src="img/tc_chocolate.png" alt="Nuevo sabor de temporada" />
            <div className="cuerpo">
              <h3>Nueva torta 50 Años</h3>
              <p className="texto-secundario">Septiembre 2025</p>
              <p>Presentamos nuestra nueva torta 50 años.</p>
            </div>
            <div className="fila-acciones">
              <a className="boton-pequeno-borde" href="blog.html">Ver</a>
            </div>
          </article>
        </div>

        <p className="text-muted">
          Contenido estático por ahora. Luego lo conectamos a Supabase.
        </p>

        <div className="noticia_2">
          <article className="tarjeta-noticia">
            <img src="img/noticia2.jpg" alt="Entrega programada en RM" />
            <div className="cuerpo">
              <h3>Entrega programada en RM</h3>
              <p className="texto-secundario">Agosto 2025</p>
              <p>Ahora puedes elegir fecha de entrega al confirmar tu pedido.</p>
            </div>
            <div className="fila-acciones">
              <a className="boton-pequeno-borde" href="blog.html">Ver</a>
            </div>
          </article>
        </div>

        {/* YouTube embed - solo funciona si pones un video específico */}
        <div className="ratio ratio-16x9 mt-3">
          <iframe
            src="https://www.youtube.com/embed/VIDEO_ID"
            title="YouTube"
            frameBorder="0"
            allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
            allowFullScreen
          ></iframe>
        </div>
      </div>
    </div>
  );
}
