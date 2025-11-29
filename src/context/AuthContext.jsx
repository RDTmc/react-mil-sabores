import { createContext, useContext, useEffect, useMemo, useState } from "react";
import { loginUser, registerUser } from "../lib/apiClient";

const AuthContext = createContext(null);

const AUTH_STORAGE_KEY = "ms_auth_state";

/**
 * Decodifica el payload de un JWT (sin verificar firma).
 * Devuelve un objeto con los claims o null si falla.
 */
function decodeJwtPayload(token) {
  if (!token || typeof token !== "string") return null;
  try {
    const parts = token.split(".");
    if (parts.length < 2) return null;
    let payload = parts[1];

    // Base64URL → Base64
    payload = payload.replace(/-/g, "+").replace(/_/g, "/");
    while (payload.length % 4 !== 0) {
      payload += "=";
    }

    const json = atob(payload);
    return JSON.parse(json);
  } catch {
    return null;
  }
}

function loadInitialState() {
  if (typeof window === "undefined") {
    return { token: null, user: null };
  }
  try {
    const raw = window.localStorage.getItem(AUTH_STORAGE_KEY);
    if (!raw) return { token: null, user: null };

    const parsed = JSON.parse(raw);
    const storedToken = parsed.token || null;
    let storedUser = parsed.user || null;

    // Si hay token, tratamos de reconstruir el usuario desde el JWT
    if (storedToken) {
      const payload = decodeJwtPayload(storedToken);

      if (payload) {
        const id = payload.sub || storedUser?.id || null;
        const email = payload.email || storedUser?.email || null;
        const fullName =
          payload.fullName || payload.name || storedUser?.fullName || null;
        const role = payload.role || storedUser?.role || null;

        storedUser = {
          id,
          email,
          fullName,
          role,
        };
      }
    }

    return {
      token: storedToken,
      user: storedUser,
    };
  } catch {
    return { token: null, user: null };
  }
}

export function AuthProvider({ children }) {
  const [authState, setAuthState] = useState(() => loadInitialState());
  const [loadingAuth, setLoadingAuth] = useState(true);

  // Simulamos carga inicial (lee de localStorage sólo una vez)
  useEffect(() => {
    setLoadingAuth(false);
  }, []);

  const { token, user } = authState;

  // === Helpers internos para persistencia ===
  const persistAuthState = (next) => {
    setAuthState(next);
    if (typeof window !== "undefined") {
      window.localStorage.setItem(AUTH_STORAGE_KEY, JSON.stringify(next));
    }
  };

  const clearAuthState = () => {
    setAuthState({ token: null, user: null });
    if (typeof window !== "undefined") {
      window.localStorage.removeItem(AUTH_STORAGE_KEY);
    }
  };

  // === Acciones públicas ===

  /**
   * Login contra ms-usuarios.
   * Usa loginUser de apiClient.
   */
  const login = async (email, password) => {
    const data = await loginUser({ email, password });
    // data: { token, userId, email, fullName }

    const payload = data.token ? decodeJwtPayload(data.token) : null;

    const mappedUser = {
      id: payload?.sub || data.userId,
      email: payload?.email || data.email,
      fullName: payload?.fullName || payload?.name || data.fullName,
      role: payload?.role || null, // "ADMIN" / "CUSTOMER" (ya viene del JWT)
    };

    const next = {
      token: data.token,
      user: mappedUser,
    };
    persistAuthState(next);
    return next;
  };

  /**
   * Registro (por si lo usas en RegisterPage).
   * Primero registra, luego opcionalmente podrías logear automáticamente.
   */
  const register = async ({ email, password, fullName, phone }) => {
    const userDto = await registerUser({ email, password, fullName, phone });
    // userDto: { id, email, fullName, phone }
    // Aquí podrías llamar a login(email, password) si quieres auto-login.
    return userDto;
  };

  const logout = async () => {
    // En este diseño el backend no necesita "logout" explícito:
    // solo borramos el token local.
    clearAuthState();
  };

  // Helpers para otros contextos / hooks
  const getToken = async () => {
    // Lo dejamos async para mantener la misma API que tenías antes.
    return authState.token || null;
  };

  const getUserId = () => authState.user?.id || null;

  const isAuthenticated = !!user && !!token;
  const isAdmin = !!user && user.role === "ADMIN";

  const value = useMemo(
    () => ({
      user,
      token,
      isAuthenticated,
      isAdmin,
      loadingAuth,
      login,
      register,
      logout,
      getToken,
      getUserId,
    }),
    [user, token, isAuthenticated, isAdmin, loadingAuth]
  );

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth() {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error("useAuth debe usarse dentro de <AuthProvider>");
  return ctx;
}
