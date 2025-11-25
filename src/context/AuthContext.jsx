import { createContext, useContext, useEffect, useMemo, useState } from "react";
import { loginUser, registerUser } from "../lib/apiClient";

const AuthContext = createContext(null);

const AUTH_STORAGE_KEY = "ms_auth_state";

function loadInitialState() {
  if (typeof window === "undefined") {
    return { token: null, user: null };
  }
  try {
    const raw = window.localStorage.getItem(AUTH_STORAGE_KEY);
    if (!raw) return { token: null, user: null };
    const parsed = JSON.parse(raw);
    return {
      token: parsed.token || null,
      user: parsed.user || null,
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
    const mappedUser = {
      id: data.userId,
      email: data.email,
      fullName: data.fullName,
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

  const value = useMemo(
    () => ({
      user,
      token,
      isAuthenticated: !!user && !!token,
      loadingAuth,
      login,
      register,
      logout,
      getToken,
      getUserId,
    }),
    [user, token, loadingAuth]
  );

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth() {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error("useAuth debe usarse dentro de <AuthProvider>");
  return ctx;
}
