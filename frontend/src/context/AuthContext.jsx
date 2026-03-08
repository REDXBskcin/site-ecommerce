// ============================================================
// Contexte d'authentification – BTS SIO
// Gère : utilisateur connecté, token (localStorage), login, register, logout.
// Au chargement, si un token existe, on appelle GET /api/user pour vérifier.
// ============================================================
import { createContext, useContext, useState, useEffect, useCallback } from 'react'
import api from '../services/api'

const AUTH_TOKEN_KEY = 'tech-store-token'

const AuthContext = createContext(null)

function getStoredToken() {
  return localStorage.getItem(AUTH_TOKEN_KEY)
}

function setAuthHeader(token) {
  if (token) {
    api.defaults.headers.common['Authorization'] = 'Bearer ' + token
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

  // Pour mettre a jour les infos user (ex apres modification profil)
  const updateUser = useCallback((userData) => {
    setUser(userData)
  }, [])

  // Connexion : POST login, on stocke token et user
  const login = useCallback(async (email, password) => {
    const response = await api.post('/login', { email: email, password: password })
    const userData = response.data.user
    const newToken = response.data.token
    setUser(userData)
    setToken(newToken)
    return userData
  }, [setToken])

  // Inscription : POST register
  const register = useCallback(async (name, email, password) => {
    const response = await api.post('/register', {
      name: name,
      email: email,
      password: password,
      password_confirmation: password,
    })
    const userData = response.data.user
    const newToken = response.data.token
    setUser(userData)
    setToken(newToken)
    return userData
  }, [setToken])

  // Deconnexion : POST logout puis on vide tout
  const logout = useCallback(async () => {
    try {
      await api.post('/logout')
    } catch (e) {
      // deja invalide ou reseau, on se deconnecte quand meme
    }
    clearAuth()
  }, [clearAuth])

  // Au chargement : si y a un token on le met dans axios et on appelle GET /api/user
  useEffect(() => {
    const storedToken = getStoredToken()
    if (!storedToken) {
      setLoading(false)
      return
    }
    setAuthHeader(storedToken)
    setTokenState(storedToken)
    api.get('/user')
      .then((response) => {
        const data = response.data
        const userData = data.user || data
        setUser(userData)
      })
      .catch(() => {
        clearAuth()
      })
      .finally(() => {
        setLoading(false)
      })
  }, [clearAuth])

  // Quand l intercepteur axios envoie auth:logout (401/403) on se deconnecte
  useEffect(() => {
    function handler() {
      clearAuth()
    }
    window.addEventListener('auth:logout', handler)
    return () => window.removeEventListener('auth:logout', handler)
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
  if (!context) throw new Error('useAuth doit etre utilise dans un AuthProvider')
  return context
}
