import "./BlogPage.css";

export default function BlogPage() {
  return (
    <div className="container contenedor blogpage">
      <h1 className="h3">Blog & Recetas</h1>

      <div className="noticia_1">
        <h1>Recetas & Noticias</h1>
        <h2 className="titulo-principal">Noticias</h2>

        {/* Grid ÚNICO para todas las noticias */}
        <div className="rejilla-noticias">
          <article className="tarjeta-noticia">
            <img src="/img/tc_chocolate.png" alt="Nuevo sabor de temporada" />
            <div className="cuerpo">
              <h3>Nueva torta 50 Años</h3>
              <p className="texto-secundario">Septiembre 2025</p>
              <p>Presentamos nuestra nueva torta 50 años.</p>
            </div>
            <div className="fila-acciones">
              <a className="boton-pequeno-borde" href="blog.html">Ver</a>
            </div>
          </article>

          <article className="tarjeta-noticia">
            <img src="/img/noticia2.jpg" alt="Entrega programada en RM" />
            <div className="cuerpo">
              <h3>Entrega programada en RM</h3>
              <p className="texto-secundario">Agosto 2025</p>
              <p>Ahora puedes elegir fecha de entrega al confirmar tu pedido.</p>
            </div>
            <div className="fila-acciones">
              <a className="boton-pequeno-borde" href="blog.html">Ver</a>
            </div>
          </article>

          <article className="tarjeta-noticia">
            <img src="/img/noticia3.png" alt="Celebración de aniversario" />
            <div className="cuerpo">
              <h3>Celebración de aniversario</h3>
              <p className="texto-secundario">Julio 2025</p>
              <p>Este mes celebramos nuestro 10º aniversario. ¡Gracias por su apoyo!</p>
            </div>
            <div className="fila-acciones">
              <a className="boton-pequeno-borde" href="blog.html">Ver</a>
            </div>
          </article>

          <article className="tarjeta-noticia">
            <img src="/img/noticia4.jpg" alt="Lanzamiento de la línea vegana" />
            <div className="cuerpo">
              <h3>Lanzamiento de la línea vegana</h3>
              <p className="texto-secundario">Junio 2025</p>
              <p>Presentamos nuestra nueva línea de productos veganos, ideal para todos.</p>
            </div>
            <div className="fila-acciones">
              <a className="boton-pequeno-borde" href="blog.html">Ver</a>
            </div>
          </article>

          <article className="tarjeta-noticia">
            <img src="/img/noticia5.jpg" alt="Premio al mejor pastelero" />
            <div className="cuerpo">
              <h3>Premio al mejor pastelero</h3>
              <p className="texto-secundario">Mayo 2025</p>
              <p>Estamos orgullosos de recibir el premio a "Mejor Pastelero del Año".</p>
            </div>
            <div className="fila-acciones">
              <a className="boton-pequeno-borde" href="blog.html">Ver</a>
            </div>
          </article>

          <article className="tarjeta-noticia">
            <img src="/img/noticia6.jpg" alt="Tienda en nueva ubicación" />
            <div className="cuerpo">
              <h3>¡Nuestra tienda se muda!</h3>
              <p className="texto-secundario">Abril 2025</p>
              <p>Nos mudamos a una nueva ubicación en el centro de la ciudad. ¡Visítanos!</p>
            </div>
            <div className="fila-acciones">
              <a className="boton-pequeno-borde" href="blog.html">Ver</a>
            </div>
          </article>
        </div>

        <p className="text-muted" style={{ marginTop: "1rem" }}>
          Contenido estático por ahora. Luego lo conectamos a Supabase.
        </p>

        {/* Sección de Recetas */}
        <section className="seccion-recetas">
          <h2 className="titulo-principal">Recetas de Repostería</h2>
          <div className="rejilla-recetas">
            <article className="tarjeta-receta">
              <img src="/img/receta1.jpg" alt="Receta de Torta de Chocolate" />
              <div className="cuerpo">
                <h3>Torta de Chocolate</h3>
                <p className="texto-secundario">Receta fácil y deliciosa</p>
                <p>Una receta clásica para todos los amantes del chocolate.</p>
              </div>
              <div className="fila-acciones">
                <a className="boton-pequeno" href="recetas.html#torta-chocolate">Ver receta</a>
              </div>
            </article>

            <article className="tarjeta-receta">
              <img src="/img/receta2.jpg" alt="Receta de Torta Vegana" />
              <div className="cuerpo">
                <h3>Torta Vegana</h3>
                <p className="texto-secundario">Receta para todos</p>
                <p>Disfruta de esta torta sin ingredientes de origen animal.</p>
              </div>
              <div className="fila-acciones">
                <a className="boton-pequeno" href="recetas.html#torta-vegana">Ver receta</a>
              </div>
            </article>

            <article className="tarjeta-receta">
              <img src="/img/receta3.jpg" alt="Receta de Torta de Frutas" />
              <div className="cuerpo">
                <h3>Torta de Frutas</h3>
                <p className="texto-secundario">Receta fresca y deliciosa</p>
                <p>Una receta ideal para el verano, llena de frutas frescas.</p>
              </div>
              <div className="fila-acciones">
                <a className="boton-pequeno" href="recetas.html#torta-frutas">Ver receta</a>
              </div>
            </article>

            <article className="tarjeta-receta">
              <img src="/img/receta4.jpg" alt="Receta de Mousse de Chocolate" />
              <div className="cuerpo">
                <h3>Mousse de Chocolate</h3>
                <p className="texto-secundario">Receta cremosa y suave</p>
                <p>Una receta perfecta para los amantes del chocolate.</p>
              </div>
              <div className="fila-acciones">
                <a className="boton-pequeno" href="recetas.html#mousse-chocolate">Ver receta</a>
              </div>
            </article>

            <article className="tarjeta-receta">
              <img src="/img/receta5.jpg" alt="Receta de Tarta de Limón" />
              <div className="cuerpo">
                <h3>Tarta de Limón</h3>
                <p className="texto-secundario">Receta refrescante y deliciosa</p>
                <p>Una tarta refrescante con un toque cítrico perfecto para el verano.</p>
              </div>
              <div className="fila-acciones">
                <a className="boton-pequeno" href="recetas.html#tarta-limon">Ver receta</a>
              </div>
            </article>

            <article className="tarjeta-receta">
              <img src="/img/receta6.jpg" alt="Receta de Brownie" />
              <div className="cuerpo">
                <h3>Brownie de Chocolate</h3>
                <p className="texto-secundario">Receta intensa y deliciosa</p>
                <p>Un brownie de chocolate con el toque perfecto de suavidad y sabor.</p>
              </div>
              <div className="fila-acciones">
                <a className="boton-pequeno" href="recetas.html#brownie-chocolate">Ver receta</a>
              </div>
            </article>
          </div>
        </section>

        {/* YouTube embed (opcional) */}
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
