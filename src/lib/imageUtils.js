// src/lib/imageUtils.js

// Resuelve correctamente rutas absolutas (https://...),
// rutas que ya empiezan con "/" y rutas relativas tipo "img/archivo.jpg"
export function resolveProductImageUrl(rawPath) {
  if (!rawPath) {
    return '/img/placeholder.png'; // asegúrate de tener este placeholder en /public/img
  }

  const raw = String(rawPath).trim();
  const lower = raw.toLowerCase();

  // Caso 1: URL absoluta (Supabase, CDN, etc.)
  if (lower.startsWith('http://') || lower.startsWith('https://')) {
    return raw;
  }

  // Caso 2: ya viene con "/" al inicio → la dejamos tal cual
  if (raw.startsWith('/')) {
    return raw;
  }

  // Caso 3: ruta relativa → le agregamos un solo "/"
  //   "img/tc_chocolate.png" -> "/img/tc_chocolate.png"
  return `/${raw.replace(/^\/+/, '')}`;
}
