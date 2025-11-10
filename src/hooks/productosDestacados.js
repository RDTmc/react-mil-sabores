// src/hooks/productosDestacados.js
import { useEffect, useState } from "react";
import { fetchFeatured } from "../lib/apiClient";

export function useProductosDestacados() {
  const [destacados, setDestacados] = useState([]);
  const [loadingDestacados, setLoadingDestacados] = useState(true);
  const [errorDestacados, setErrorDestacados] = useState(null);

  useEffect(() => {
    let vivo = true;
    (async () => {
      try {
        setLoadingDestacados(true); setErrorDestacados(null);
        const data = await fetchFeatured();
        if (!vivo) return;

        // Aseguramos compatibilidad con componentes que esperan snake_case
        const adaptados = (data || []).map(p => ({
          ...p,
          image_path: p.image_path ?? p.imagePath ?? null,
          category_id: p.category_id ?? p.categoryId ?? null,
        }));

        setDestacados(adaptados);
        if (import.meta.env.DEV) {
          // eslint-disable-next-line no-console
          console.log(`[Home] Destacados cargados: ${adaptados.length}`);
        }
      } catch (err) {
        if (!vivo) return;
        setErrorDestacados(err?.response?.data?.message || err?.message || "Error al cargar destacados");
      } finally {
        if (vivo) setLoadingDestacados(false);
      }
    })();
    return () => { vivo = false; };
  }, []);

  return { destacados, loadingDestacados, errorDestacados };
}
