/**
 * context/CartContext.jsx – Tech Store (BTS SIO)
 *
 * Gère le panier d'achats dans toute l'application.
 *
 * Fonctionnement :
 *  - Les articles du panier sont persistés dans le localStorage.
 *  - addToCart() ajoute un produit ou incrémente sa quantité s'il existe déjà.
 *  - removeFromCart() / updateQuantity() / clearCart() modifient la liste.
 *  - total et itemCount sont calculés automatiquement à chaque changement.
 *
 * Utilisé via le hook : const { items, addToCart, total } = useCart()
 */
import { createContext, useContext, useState, useEffect, useCallback } from 'react'
import { getProductImageUrl } from '../services/api'

const STORAGE_KEY = 'tech-store-cart'

export const getCartItemFromProduct = (product, quantity = 1) => ({
  id: product.id,
  name: product.name,
  price: typeof product.price === 'number' ? product.price : parseFloat(product.price),
  image: getProductImageUrl(product),
  quantity,
})

const CartContext = createContext(null)

function loadCartFromStorage() {
  try {
    const raw = localStorage.getItem(STORAGE_KEY)
    if (!raw) return []
    const parsed = JSON.parse(raw)
    return Array.isArray(parsed) ? parsed : []
  } catch {
    return []
  }
}

function saveCartToStorage(items) {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(items))
  } catch (e) {
    console.warn('Impossible de sauvegarder le panier:', e)
  }
}

export function CartProvider({ children }) {
  const [items, setItems] = useState(loadCartFromStorage)

  useEffect(() => {
    saveCartToStorage(items)
  }, [items])

  const addToCart = useCallback((product) => {
    const newItem = getCartItemFromProduct(product, 1)
    setItems((prev) => {
      const existing = prev.find((i) => i.id === product.id)
      if (existing) {
        return prev.map((i) => (i.id === product.id ? { ...i, quantity: i.quantity + 1 } : i))
      }
      return [...prev, newItem]
    })
  }, [])

  const removeFromCart = useCallback((productId) => {
    setItems((prev) => prev.filter((i) => i.id !== productId))
  }, [])

  const updateQuantity = useCallback((productId, quantity) => {
    if (quantity < 1) {
      removeFromCart(productId)
      return
    }
    setItems((prev) => prev.map((i) => (i.id === productId ? { ...i, quantity } : i)))
  }, [removeFromCart])

  const clearCart = useCallback(() => {
    setItems([])
  }, [])

  const total = items.reduce((sum, item) => sum + item.price * item.quantity, 0)
  const itemCount = items.reduce((sum, item) => sum + item.quantity, 0)

  const value = {
    items,
    addToCart,
    removeFromCart,
    updateQuantity,
    clearCart,
    total,
    itemCount,
  }

  return <CartContext.Provider value={value}>{children}</CartContext.Provider>
}

export function useCart() {
  const ctx = useContext(CartContext)
  if (!ctx) {
    throw new Error('useCart doit être utilisé à l\'intérieur de CartProvider')
  }
  return ctx
}
