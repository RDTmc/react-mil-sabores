export default function GaleriaProducto({ imagen, producto }) {
  // Acepta ambas formas: imagen directa o desde el objeto producto (image_path / imagePath)
  const raw =
    imagen ??
    producto?.image_path ??
    producto?.imagePath ??
    "/img/placeholder.png";

  // Siempre con slash inicial para que no dependa de la ruta actual
  const src = raw?.startsWith("/") ? raw : `/${raw}`;

  return (
    <div className="ratio ratio-4x3 rounded border">
      <img
        src={src}
        alt={producto?.name || "Producto"}
        className="w-100 h-100 object-fit-cover"
      />
    </div>
  );
}
