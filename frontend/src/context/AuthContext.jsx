/**
 * Contexte d'authentification – BTS SIO
 * Gère l'utilisateur connecté et le token de façon globale.
 * Token stocké dans localStorage ; au chargement, vérification via GET /api/user.
 */
import { createContext, useContext, useState, useEffect, useCallback } from 'react'
import api from '../services/api'

const AUTH_TOKEN_KEY = 'tech-store-token'

const AuthContext = createContext(null)

function getStoredToken() {
  return localStorage.getItem(AUTH_TOKEN_KEY)
}

function setAuthHeader(token) {
  if (token) {
    api.defaults.headers.common['Authorization'] = `Bearer ${token}`
  } else {
    delete api.defaults.headers.common['Authorization']
  }
}

function storeToken(token) {
  if (token) {
    localStorage.setItem(AUTH_TOKEN_KEY, token)
  } else {
    localStorage.removeItem(AUTH_TOKEN_KEY)
  }
}

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null)
  const [token, setTokenState] = useState(null)
  const [loading, setLoading] = useState(true)

  const setToken = useCallback((newToken) => {
    setTokenState(newToken)
    setAuthHeader(newToken)
    storeToken(newToken)
  }, [])

  const clearAuth = useCallback(() => {
    setUser(null)
    setTokenState(null)
    setAuthHeader(null)
    storeToken(null)
  }, [])

  /**
   * Met à jour les données utilisateur (ex. après modification du profil).
   */
  const updateUser = useCallback((userData) => {
    setUser(userData)
  }, [])

  /**
   * Connexion : appelle POST /api/login, stocke le token et l'utilisateur.
   */
  const login = useCallback(async (email, password) => {
    const response = await api.post('/login', { email, password })
    const { user: userData, token: newToken } = response.data
    setUser(userData)
    setToken(newToken)
    return userData
  }, [setToken])

  /**
   * Inscription : appelle POST /api/register, stocke le token et l'utilisateur.
   */
  const register = useCallback(async (name, email, password) => {
    const response = await api.post('/register', {
      name,
      email,
      password,
      password_confirmation: password,
    })
    const { user: userData, token: newToken } = response.data
    setUser(userData)
    setToken(newToken)
    return userData
  }, [setToken])

  /**
   * Déconnexion : appelle POST /api/logout puis vide le token et l'utilisateur.
   */
  const logout = useCallback(async () => {
    try {
      await api.post('/logout')
    } catch {
      // Token déjà invalide ou réseau : on se déconnecte quand même côté front
    }
    clearAuth()
  }, [clearAuth])

  /**
   * Au chargement de l'app : si un token existe dans localStorage,
   * on le met dans axios et on appelle GET /api/user pour récupérer l'utilisateur.
   */
  useEffect(() => {
    const storedToken = getStoredToken()
    if (!storedToken) {
      setLoading(false)
      return
    }
    setAuthHeader(storedToken)
    setTokenState(storedToken)
    api
      .get('/user')
      .then((response) => {
        const userData = response.data?.user ?? response.data
        setUser(userData)
      })
      .catch(() => {
        clearAuth()
      })
      .finally(() => {
        setLoading(false)
      })
  }, [clearAuth])

  const value = {
    user,
    token,
    loading,
    isAuthenticated: !!user,
    login,
    register,
    logout,
    updateUser,
  }

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>
}

export function useAuth() {
  const context = useContext(AuthContext)
  if (!context) {
    throw new Error('useAuth doit être utilisé à l\'intérieur de AuthProvider')
  }
  return context
}
