import { createContext, useContext, useEffect, useMemo, useState } from 'react';
import { supabase } from '../lib/supabaseClient';

const AuthContext = createContext(null);

export function AuthProvider({ children }) {
  const [session, setSession] = useState(null);
  const [user, setUser] = useState(null);
  const [loadingAuth, setLoadingAuth] = useState(true);

  useEffect(() => {
    let alive = true
    ;(async () => {
      const { data: { session }, error } = await supabase.auth.getSession()
      if (!alive) return
      if (error) {
        console.warn('[Auth] getSession error:', error.message)
      }
      setSession(session || null)
      setUser(session?.user || null)
      setLoadingAuth(false)
    })()
    return () => { alive = false }
  }, [])

  // Suscribirse a cambios de auth (login/logout/refresh)
  useEffect(() => {
    const { data: sub } = supabase.auth.onAuthStateChange((_event, session) => {
      setSession(session || null)
      setUser(session?.user || null)
    })
    return () => { sub.subscription.unsubscribe() }
  }, [])

  // Acciones
  const login = async (email, password) => {
    const { data, error } = await supabase.auth.signInWithPassword({ email, password })
    if (error) throw error
    setSession(data.session || null)
    setUser(data.session?.user || null)
    return data.session
  }

  const logout = async () => {
    await supabase.auth.signOut()
    setSession(null)
    setUser(null)
  }

  // Helpers para la API
  const getToken = async () => {
    // intenta el que tenemos en memoria
    if (session?.access_token) return session.access_token
    // sino, refresca desde supabase
    const { data: { session: s } } = await supabase.auth.getSession()
    return s?.access_token || null
  }

  const getUserId = () => user?.id || null

  const value = useMemo(() => ({
    user,
    isAuthenticated: !!user,
    loadingAuth,
    login,
    logout,
    getToken,
    getUserId,
  }), [user, loadingAuth, session])

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>
}

export function useAuth() {
  const ctx = useContext(AuthContext)
  if (!ctx) throw new Error('useAuth debe usarse dentro de <AuthProvider>')
  return ctx
}