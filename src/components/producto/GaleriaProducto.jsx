export default function GaleriaProducto({ imagen }) {
    return (
      <div className="ratio ratio-4x3 rounded border">
        <img src={imagen?.startsWith('/') ? imagen : `/${imagen}`} alt="Producto" className="w-100 h-100 object-fit-cover" />
      </div>
    )
  }
  