// src/hooks/useCategorias.js
import { useEffect, useState } from "react";
import { fetchCategories } from "../lib/apiClient";

const RESPALDO_CATEGORIAS = [
  { id: 1, name: "Tortas Cuadradas" },
  { id: 2, name: "Tortas Circulares" },
  { id: 3, name: "Postres Individuales" },
];

export function useCategorias() {
  const [listaCategorias, setListaCategorias] = useState(RESPALDO_CATEGORIAS);
  const [loadingCarga, setLoadingCarga] = useState(true);
  const [errorCarga, setErrorCarga] = useState(null);

  useEffect(() => {
    let activo = true;

    (async () => {
      try {
        setLoadingCarga(true);
        setErrorCarga(null);

        // Llamamos al microservicio ms-productos vía apiClient
        const data = await fetchCategories(); // GET /categories

        if (activo && Array.isArray(data) && data.length > 0) {
          setListaCategorias(data);
        }
      } catch (err) {
        if (!activo) return;

        // Intentamos extraer mensaje legible
        const mensajeBackend =
          err?.response?.data?.message ||
          err?.message ||
          "Error al cargar categorías desde la API";

        setErrorCarga(mensajeBackend);

        // Ojo: mantenemos RESPALDO_CATEGORIAS como valor por defecto
        setListaCategorias(RESPALDO_CATEGORIAS);
      } finally {
        if (activo) {
          setLoadingCarga(false);
        }
      }
    })();

    return () => {
      activo = false;
    };
  }, []);

  return { listaCategorias, loadingCarga, errorCarga };
}
