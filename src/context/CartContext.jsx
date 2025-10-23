import { createContext, useContext, useEffect, useMemo, useState } from 'react';

const CartContext = createContext(null);

export function ProveedorCarrito({ children }) {
  const [listaItems, setListaItems] = useState(() => {
    try {
      const raw = localStorage.getItem('ms_carrito')
      return raw ? JSON.parse(raw) : []
    } catch { return [] }
  })

  useEffect(() => {
    try {
      localStorage.setItem('ms_carrito', JSON.stringify(listaItems))
    } catch {}
  }, [listaItems])

  const agregarItem = (productoBase, cantidad = 1, tamanio = null) => {
    setListaItems(prev => {
      const clave = `${productoBase.id}_${tamanio ?? ''}`;
      const existente = prev.find(i => `${i.id}_${i.size ?? ''}` === clave);
      if (existente) {
        return prev.map(i => (i === existente ? { ...i, qty: i.qty + cantidad } : i));
      }
      return [...prev, {
        id: productoBase.id,
        name: productoBase.name,
        price: productoBase.price,
        qty: cantidad,
        size: tamanio,
      }];
    });
  };

  const removerItem = (idProducto, tamanio = null) => {
    setListaItems(prev =>
      prev.filter(i => !(i.id === idProducto && (i.size ?? null) === (tamanio ?? null)))
    );
  };

  const vaciar = () => setListaItems([]);

  const obtenerTotales = (items = listaItems) => {
    const sub = items.reduce((s, i) => s + Number(i.price) * Number(i.qty), 0);
    const iva = Math.round(sub * 0.19);
    const cantidad = items.reduce((s, i) => s + Number(i.qty || 0), 0);
    return { sub, iva, total: sub + iva, cantidad };
  };

  const valor = useMemo(
    () => ({ listaItems, agregarItem, removerItem, vaciar, vaciarCarrito: vaciar, obtenerTotales }),
    [listaItems]
  );

  return <CartContext.Provider value={valor}>{children}</CartContext.Provider>;
}

export function useCarrito() {
  const ctx = useContext(CartContext);
  if (!ctx) throw new Error('useCarrito debe usarse dentro de <ProveedorCarrito>.');
  return ctx;
}
