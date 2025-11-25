// src/context/CartContext.jsx
import { createContext, useContext, useEffect, useMemo, useState } from 'react'
import { useAuth } from './AuthContext.jsx'
import {
  fetchCart as fetchCartApi,
  addCartItem as addCartItemApi,
  updateCartItemQuantity as updateCartItemQuantityApi,
  removeCartItem as removeCartItemApi,
  clearCart as clearCartApi,
} from '../lib/apiClient'

const CartContext = createContext(null)

const STORAGE_KEY = 'ms_carrito'

// Mapea la respuesta del backend (CartResponse) al formato usado en la UI
function mapCartResponseToItems(cart) {
  if (!cart || !Array.isArray(cart.items)) return []
  return cart.items.map((i) => ({
    // id del producto (para la UI)
    id: i.productId,
    // id del item en la tabla cart_items (para ms-cart)
    cartItemId: i.id,
    name: i.productName,
    price: i.unitPrice,
    qty: i.quantity,
    size: i.size ?? null,
  }))
}

export function ProveedorCarrito({ children }) {
  const { getUserId } = useAuth()

  const [listaItems, setListaItems] = useState(() => {
    // Estado inicial: lo que haya en localStorage (modo invitado)
    try {
      const raw = window.localStorage.getItem(STORAGE_KEY)
      return raw ? JSON.parse(raw) : []
    } catch {
      return []
    }
  })

  const [loadingCarrito, setLoadingCarrito] = useState(false)
  const [errorCarrito, setErrorCarrito] = useState(null)

  const userId = getUserId()

  // Sincronizar con ms-cart cuando hay usuario logeado
  useEffect(() => {
    if (!userId) return // invitado → se queda con localStorage

    let activo = true

    ;(async () => {
      try {
        setLoadingCarrito(true)
        setErrorCarrito(null)
        const cart = await fetchCartApi(userId)
        if (!activo) return
        setListaItems(mapCartResponseToItems(cart))
      } catch (err) {
        if (!activo) return
        console.error('[Cart] Error al cargar carrito desde ms-cart:', err)
        setErrorCarrito(
          err?.response?.data?.message ||
            err?.message ||
            'No se pudo cargar el carrito.'
        )
      } finally {
        if (activo) setLoadingCarrito(false)
      }
    })()

    return () => {
      activo = false
    }
  }, [userId])

  // Solo persistimos en localStorage cuando NO hay usuario logeado
  useEffect(() => {
    if (userId) return
    try {
      window.localStorage.setItem(STORAGE_KEY, JSON.stringify(listaItems))
    } catch {
      // ignore
    }
  }, [listaItems, userId])

  // ===== LÓGICA LOCAL (invitado) =====

  const agregarItemLocal = (productoBase, cantidad = 1, tamanio = null) => {
    setListaItems((prev) => {
      const clave = `${productoBase.id}_${tamanio ?? ''}`
      const existente = prev.find(
        (i) => `${i.id}_${i.size ?? ''}` === clave
      )
      if (existente) {
        return prev.map((i) =>
          i === existente ? { ...i, qty: i.qty + cantidad } : i
        )
      }
      return [
        ...prev,
        {
          id: productoBase.id,
          name: productoBase.name,
          price: productoBase.price,
          qty: cantidad,
          size: tamanio,
        },
      ]
    })
  }

  const removerItemLocal = (idProducto, tamanio = null) => {
    setListaItems((prev) =>
      prev.filter(
        (i) =>
          !(
            i.id === idProducto &&
            (i.size ?? null) === (tamanio ?? null)
          )
      )
    )
  }

  const vaciarLocal = () => setListaItems([])

  // ===== LÓGICA REMOTA (user logeado → ms-cart) =====

  const agregarItemRemoto = async (productoBase, cantidad = 1, tamanio = null) => {
    if (!userId) {
      agregarItemLocal(productoBase, cantidad, tamanio)
      return
    }
    try {
      const payload = {
        productId: String(productoBase.id),
        productName: productoBase.name,
        image: productoBase.imagePath || null,
        unitPrice: Number(productoBase.price),
        quantity: Number(cantidad),
        size: tamanio,
        flavor: null,
      }
      const cart = await addCartItemApi(userId, payload)
      setListaItems(mapCartResponseToItems(cart))
    } catch (err) {
      console.error('[Cart] Error al agregar item remoto:', err)
      // fallback opcional: podrías agregar local si el backend falla
    }
  }

  const removerItemRemoto = async (idProducto, tamanio = null) => {
    if (!userId) {
      removerItemLocal(idProducto, tamanio)
      return
    }
    try {
      const item = listaItems.find(
        (i) =>
          i.id === idProducto &&
          (i.size ?? null) === (tamanio ?? null)
      )
      if (!item || !item.cartItemId) {
        // Si no encontramos item remoto, hacemos remove local
        removerItemLocal(idProducto, tamanio)
        return
      }
      const cart = await removeCartItemApi(userId, item.cartItemId)
      setListaItems(mapCartResponseToItems(cart))
    } catch (err) {
      console.error('[Cart] Error al remover item remoto:', err)
    }
  }

  const vaciarRemoto = async () => {
    if (!userId) {
      vaciarLocal()
      return
    }
    try {
      const cart = await clearCartApi(userId)
      setListaItems(mapCartResponseToItems(cart))
    } catch (err) {
      console.error('[Cart] Error al vaciar carrito remoto:', err)
    }
  }

  // ===== API PÚBLICA DEL CONTEXTO (misma firma que antes) =====

  const agregarItem = (productoBase, cantidad = 1, tamanio = null) =>
    agregarItemRemoto(productoBase, cantidad, tamanio)

  const removerItem = (idProducto, tamanio = null) =>
    removerItemRemoto(idProducto, tamanio)

  const vaciar = () => vaciarRemoto()

  const obtenerTotales = (items = listaItems) => {
    const sub = items.reduce(
      (s, i) => s + Number(i.price) * Number(i.qty),
      0
    )
    const iva = Math.round(sub * 0.19)
    const cantidad = items.reduce(
      (s, i) => s + Number(i.qty || 0),
      0
    )
    return { sub, iva, total: sub + iva, cantidad }
  }

  const valor = useMemo(
    () => ({
      listaItems,
      agregarItem,
      removerItem,
      vaciar,
      vaciarCarrito: vaciar,
      obtenerTotales,
      loadingCarrito,
      errorCarrito,
    }),
    [listaItems, loadingCarrito, errorCarrito]
  )

  return (
    <CartContext.Provider value={valor}>
      {children}
    </CartContext.Provider>
  )
}

export function useCarrito() {
  const ctx = useContext(CartContext)
  if (!ctx) {
    throw new Error('useCarrito debe usarse dentro de <ProveedorCarrito>.')
  }
  return ctx
}
