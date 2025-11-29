// src/lib/apiClient.js
import axios from "axios";

// ========= BASE URLs desde .env =========
// Productos (catálogo)
const API_BASE = import.meta.env.VITE_API_URL?.replace(/\/+$/, "") || "";
// Auth (ms-usuarios)
const AUTH_BASE = import.meta.env.VITE_AUTH_API_URL?.replace(/\/+$/, "") || "";
// Cart (ms-cart)
const CART_BASE = import.meta.env.VITE_CART_API_URL?.replace(/\/+$/, "") || "";
// Orders (ms-orders)
const ORDERS_BASE = import.meta.env.VITE_ORDERS_API_URL?.replace(/\/+$/, "") || "";

if (import.meta.env.DEV) {
  // eslint-disable-next-line no-console
  console.log("[API] VITE_API_URL (productos):", API_BASE || "(vacía)");
  // eslint-disable-next-line no-console
  console.log("[API] VITE_AUTH_API_URL (auth):", AUTH_BASE || "(vacía)");
  // eslint-disable-next-line no-console
  console.log("[API] VITE_CART_API_URL (cart):", CART_BASE || "(vacía)");
  // eslint-disable-next-line no-console
  console.log("[API] VITE_ORDERS_API_URL (orders):", ORDERS_BASE || "(vacía)");
}

// Cliente para catálogo (ms-productos)
export const api = axios.create({
  baseURL: API_BASE, // ej: http://localhost:8081/api
  timeout: 10000,
});

// Cliente para auth (ms-usuarios)
const authApi = axios.create({
  baseURL: AUTH_BASE, // ej: http://localhost:8082/api
  timeout: 10000,
});

// Cliente para carrito (ms-cart)
const cartApi = axios.create({
  baseURL: CART_BASE, // ej: http://localhost:8084/api
  timeout: 10000,
});

// Cliente para órdenes (ms-orders)
const ordersApi = axios.create({
  baseURL: ORDERS_BASE, // ej: http://localhost:8083/api 
  timeout: 10000,
});

// ===== Helper: leer token de localStorage =====
function getStoredToken() {
  try {
    if (typeof window === "undefined") return null;
    const raw = window.localStorage.getItem("ms_auth_state");
    if (!raw) return null;
    const parsed = JSON.parse(raw);
    return parsed?.token || null;
  } catch {
    return null;
  }
}

// Interceptor para agregar Authorization: Bearer <token> automáticamente en cartApi
cartApi.interceptors.request.use(
  (config) => {
    const token = getStoredToken();
    if (token) {
      config.headers = config.headers || {};
      if (!config.headers.Authorization) {
        config.headers.Authorization = `Bearer ${token}`;
      }
    }
    return config;
  },
  (error) => Promise.reject(error)
);

// Interceptor para agregar Authorization: Bearer <token> en ordersApi
ordersApi.interceptors.request.use(
  (config) => {
    const token = getStoredToken();
    if (token) {
      config.headers = config.headers || {};
      if (!config.headers.Authorization) {
        config.headers.Authorization = `Bearer ${token}`;
      }
    }
    return config;
  },
  (error) => Promise.reject(error)
);

// ========== CATÁLOGO (ms-productos) ==========

export async function fetchProducts({ page = 0, size = 48, q, categoryId } = {}) {
  const params = { page, size };
  if (q) params.q = q;
  if (categoryId) params.categoryId = categoryId;

  const { data } = await api.get("/products", { params });
  // data: { items, page, size, totalItems, totalPages, hasNext }
  return data;
}

export async function fetchProductById(id) {
  const { data } = await api.get(`/products/${id}`);
  return data;
}

export async function fetchCategories() {
  const { data } = await api.get("/categories");
  return data; // array
}

export async function fetchFeatured() {
  const { data } = await api.get("/featured");
  return data; // array
}

// ========== AUTH (ms-usuarios) ==========

/**
 * Login contra ms-usuarios.
 * Espera que el backend responda con:
 * { token, userId, email, fullName }
 */
export async function loginUser({ email, password }) {
  if (!AUTH_BASE) {
    throw new Error("VITE_AUTH_API_URL no está configurada en .env");
  }
  const { data } = await authApi.post("/auth/login", { email, password });
  return data;
}

/**
 * Registro contra ms-usuarios.
 * Espera que el backend responda con:
 * { id, email, fullName, phone }
 */
export async function registerUser({ email, password, fullName, phone }) {
  if (!AUTH_BASE) {
    throw new Error("VITE_AUTH_API_URL no está configurada en .env");
  }
  const { data } = await authApi.post("/auth/register", {
    email,
    password,
    fullName,
    phone,
  });
  return data;
}

// ========== CART (ms-cart) ==========
// Todas las funciones requieren userId y usan header X-User-Id

export async function fetchCart(userId) {
  if (!CART_BASE) {
    throw new Error("VITE_CART_API_URL no está configurada en .env");
  }
  const { data } = await cartApi.get("/cart", {
    headers: { "X-User-Id": userId },
  });
  // data: CartResponse (id, userId, status, items, totalItems, totalAmount)
  return data;
}

export async function addCartItem(userId, payload) {
  if (!CART_BASE) {
    throw new Error("VITE_CART_API_URL no está configurada en .env");
  }
  const { data } = await cartApi.post("/cart/items", payload, {
    headers: { "X-User-Id": userId },
  });
  return data; // CartResponse actualizado
}

export async function updateCartItemQuantity(userId, itemId, quantity) {
  if (!CART_BASE) {
    throw new Error("VITE_CART_API_URL no está configurada en .env");
  }
  const { data } = await cartApi.put(
    `/cart/items/${itemId}`,
    { quantity },
    { headers: { "X-User-Id": userId } }
  );
  return data; // CartResponse actualizado
}

export async function removeCartItem(userId, itemId) {
  if (!CART_BASE) {
    throw new Error("VITE_CART_API_URL no está configurada en .env");
  }
  const { data } = await cartApi.delete(`/cart/items/${itemId}`, {
    headers: { "X-User-Id": userId },
  });
  return data; // CartResponse actualizado (o vacío)
}

export async function clearCart(userId) {
  if (!CART_BASE) {
    throw new Error("VITE_CART_API_URL no está configurada en .env");
  }
  const { data } = await cartApi.delete("/cart", {
    headers: { "X-User-Id": userId },
  });
  return data; // CartResponse vacío (dependiendo de tu implementación)
}

// ========== ORDERS (ms-orders) ==========
// Usa JWT (Authorization: Bearer <token>), userId se toma del sub del token.

export async function createOrder({ paymentMethod, shippingAddress, items }) {
  if (!ORDERS_BASE) {
    throw new Error("VITE_ORDERS_API_URL no está configurada en .env");
  }
  const payload = {
    paymentMethod,
    shippingAddress,
    items,
  };
  const { data } = await ordersApi.post("/orders", payload);
  // data: OrderResponse
  return data;
}

// Para más adelante, por si quieres listar órdenes del usuario:
export async function fetchMyOrders() {
  if (!ORDERS_BASE) {
    throw new Error("VITE_ORDERS_API_URL no está configurada en .env");
  }
  const { data } = await ordersApi.get("/orders");
  // data: List<OrderResponse>
  return data;
}

// ========== ADMIN (ms-orders) ==========
// Devuelve las últimas órdenes creadas en el sistema (global, no solo del usuario).
// Requiere JWT con rol ADMIN (el backend valida el claim "role").

export async function fetchAdminLatestOrders(limit = 5) {
  if (!ORDERS_BASE) {
    throw new Error("VITE_ORDERS_API_URL no está configurada en .env");
  }

  const params = {};
  if (limit != null) {
    params.limit = limit;
  }

  const { data } = await ordersApi.get("/admin/orders/latest", { params });

  return data; // List<OrderResponse>
}

