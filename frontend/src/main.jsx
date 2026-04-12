/**
 * main.jsx – Tech Store (BTS SIO)
 *
 * Point d'entrée de l'application React.
 * Enveloppe l'app dans les trois contextes globaux :
 *  - ThemeProvider  : gestion du mode clair/sombre
 *  - AuthProvider   : gestion de l'utilisateur connecté
 *  - CartProvider   : gestion du panier d'achats
 */
import React from 'react'
import ReactDOM from 'react-dom/client'
import { BrowserRouter } from 'react-router-dom'
import { Toaster } from 'react-hot-toast'
import { AuthProvider } from './context/AuthContext'
import { CartProvider } from './context/CartContext'
import { ThemeProvider } from './context/ThemeContext'
import App from './App'
import './index.css'

ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <BrowserRouter future={{ v7_relativeSplatPath: true }}>
      <ThemeProvider>
        <AuthProvider>
          <CartProvider>
            <App />
            <Toaster position="top-right" toastOptions={{ duration: 3000 }} />
          </CartProvider>
        </AuthProvider>
      </ThemeProvider>
    </BrowserRouter>
  </React.StrictMode>,
)
