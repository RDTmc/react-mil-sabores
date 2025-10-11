export default function AboutPage() {
  return (
    <div className="container">
      <h1 className="h3">Nosotros</h1>
      <p>Historia, misión y valores.</p>
      <div className="nosotros">
        <section class="nosotros">
      <h1 class="titulo-principal">Mil Sabores</h1>
      <p>
        En <strong>Pastelería Mil Sabores</strong> celebramos con orgullo nuestro <strong>50 aniversario</strong> como un
        referente en la repostería chilena. Nuestra historia está marcada por momentos únicos, como
        nuestra participación en un <strong>Récord Guinness en 1995</strong>, cuando colaboramos en la creación
        de la <em>torta más grande del mundo</em>.
      </p>
      <p>
        Hoy, continuamos honrando nuestra tradición familiar, pero con la mirada puesta en el futuro:
        renovamos nuestro sistema de ventas online para brindar a nuestros clientes una experiencia de compra
        moderna, ágil y accesible desde cualquier lugar de Chile.
      </p>
    </section>
      </div>
        <div className="mision-vision">
          <h2>Misión</h2>
        <p>
          Ofrecer una experiencia dulce y memorable a nuestros clientes, proporcionando tortas y productos
          de repostería de la más alta calidad para todas las ocasiones, celebrando nuestras raíces históricas
          y fomentando la creatividad en cada preparación.
        </p>
      </div>
      <div class="bloque">
        <h2>Visión</h2>
        <p>
          Convertirnos en la tienda online líder de productos de repostería en Chile, reconocida por nuestra
          innovación, calidad y el impacto positivo en la comunidad, especialmente en la formación de nuevos
          talentos en la gastronomía.
        </p>
        </div>
      <div className="ratio ratio-16x9 mt-3">
        <iframe className="mapa" title="Mapa de ubicación Pastelería Mil Sabores"
          src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3329.27509689494!2d-70.77605362357656!3d-33.44213869708792!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x9662c343400facd9%3A0x75dfc00a7481edac!2sDiben%20mil%20sabores!5e0!3m2!1ses!2scl!4v1757595297941!5m2!1ses!2scl"
          loading="lazy" referrerPolicy="no-referrer-when-downgrade" allowFullScreen></iframe>
      </div>
    </div>
  );
}
