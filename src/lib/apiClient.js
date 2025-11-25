// Cliente API para Mil Sabores (Vite + Axios)
import axios from "axios";

const baseURL = import.meta.env.VITE_API_URL?.replace(/\/+$/, "") || "";
if (!baseURL) {
  // eslint-disable-next-line no-console
  console.warn("[API] VITE_API_URL vacío: el frontend seguirá usando Supabase si el código lo soporta.");
}

export const api = axios.create({
  baseURL, // ej: http://localhost:9090/api
  timeout: 10000,
});

export async function fetchProducts({ page = 0, size = 48, q, categoryId} = {}) {
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
