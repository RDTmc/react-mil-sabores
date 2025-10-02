export default function AboutPage() {
  return (
    <div className="container">
      <h1 className="h3">Nosotros</h1>
      <p>Historia, misión y valores.</p>
      <div className="ratio ratio-16x9 mt-3">
        <iframe className="mapa" title="Mapa de ubicación Pastelería Mil Sabores"
          src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3329.27509689494!2d-70.77605362357656!3d-33.44213869708792!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x9662c343400facd9%3A0x75dfc00a7481edac!2sDiben%20mil%20sabores!5e0!3m2!1ses!2scl!4v1757595297941!5m2!1ses!2scl"
          loading="lazy" referrerPolicy="no-referrer-when-downgrade" allowFullScreen></iframe>
      </div>
    </div>
  );
}
