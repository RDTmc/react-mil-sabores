import { resolveProductImageUrl } from '../../lib/imageUtils'

export default function GaleriaProducto({ imagen, producto }) {
  const raw =
    imagen ??
    producto?.image_path ??
    producto?.imagePath

  const src = resolveProductImageUrl(raw)

  return (
    <div className="ratio ratio-4x3 rounded border">
      <img
        src={src}
        alt={producto?.name || 'Producto'}
        className="w-100 h-100 object-fit-cover"
      />
    </div>
  )
}
