/* src/context/CartContext.jsx */
import { createContext, useContext, useEffect, useState } from 'react';

const CartContext = createContext();
const KEY = 'ms_cart_v1';

export function CartProvider({ children }) {
  const [items, setItems] = useState(() => {
    try {
      const raw = localStorage.getItem(KEY);
      return raw ? JSON.parse(raw) : [];
    } catch { return []; }
  });

  useEffect(() => {
    localStorage.setItem(KEY, JSON.stringify(items));
  }, [items]);

  const add = (product, qty = 1, size = null) => {
    setItems(prev => {
      const idx = prev.findIndex(i => i.id === product.id && i.size === size);
      if (idx >= 0) {
        const copy = [...prev];
        copy[idx] = { ...copy[idx], qty: copy[idx].qty + qty };
        return copy;
      }
      return [...prev, { id: product.id, name: product.name ?? product.nombre, price: product.price ?? product.precio, size, qty }];
    });
  };

  const remove = (id, size = null) => setItems(prev => prev.filter(i => !(i.id === id && i.size === size)));
  const clear = () => setItems([]);

  return <CartContext.Provider value={{ items, add, remove, clear }}>{children}</CartContext.Provider>
}

export const useCart = () => useContext(CartContext);

export function totals(items) {
  const sub = items.reduce((s, i) => s + i.price * i.qty, 0);
  const iva = Math.round(sub * 0.19);
  const total = sub + iva;
  return { sub, iva, total };
}
