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

  const updateUser = useCallback((userData) => {
    setUser(userData)
  }, [])

  const login = useCallback(async (email, password) => {
    const response = await api.post('/login', { email, password })
    const { user: userData, token: newToken } = response.data
    setUser(userData)
    setToken(newToken)
    return userData
  }, [setToken])

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

  const logout = useCallback(async () => {
    try {
      await api.post('/logout')
    } catch {}
    clearAuth()
  }, [clearAuth])

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
        const userData = response.data?.user ?? response.data
        setUser(userData)
      })
      .catch((err) => {
        if (err.response?.status === 401) clearAuth()
      })
      .finally(() => setLoading(false))
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
