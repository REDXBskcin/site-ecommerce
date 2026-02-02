/**
 * Contexte du panier – BTS SIO
 * Gère les articles du panier (ajout, retrait) et le total.
 * Persistance dans localStorage pour garder le panier après rafraîchissement.
 */
import { createContext, useContext, useState, useEffect, useCallback } from 'react'

// Clé utilisée pour stocker le panier dans le localStorage
const STORAGE_KEY = 'tech-store-cart'

/**
 * Forme d'un article dans le panier (données sérialisables pour localStorage).
 * On ne stocke que le strict nécessaire (id, name, price, image, quantity).
 */
// export pour réutilisation (ex. : page Panier)
export const getCartItemFromProduct = (product, quantity = 1) => ({
  id: product.id,
  name: product.name,
  price: typeof product.price === 'number' ? product.price : parseFloat(product.price),
  image: product.image || null,
  quantity,
})

// Contexte : valeur par défaut (utilisée si un composant utilise useCart hors Provider)
const CartContext = createContext(null)

/**
 * Charge le panier depuis le localStorage.
 * En cas d'erreur (JSON invalide), retourne un tableau vide.
 */
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

/**
 * Enregistre le panier dans le localStorage.
 */
function saveCartToStorage(items) {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(items))
  } catch (e) {
    console.warn('Impossible de sauvegarder le panier:', e)
  }
}

/**
 * Provider du panier : enveloppe l'app et fournit addToCart, removeFromCart, items, total.
 */
export function CartProvider({ children }) {
  // État du panier : tableau d'articles { id, name, price, image, quantity }
  const [items, setItems] = useState(loadCartFromStorage)

  // À chaque changement du panier, on sauvegarde dans localStorage
  useEffect(() => {
    saveCartToStorage(items)
  }, [items])

  /**
   * Ajoute un produit au panier (ou incrémente la quantité s'il est déjà présent).
   */
  const addToCart = useCallback((product) => {
    const newItem = getCartItemFromProduct(product, 1)
    setItems((prev) => {
      const existing = prev.find((i) => i.id === product.id)
      if (existing) {
        return prev.map((i) =>
          i.id === product.id ? { ...i, quantity: i.quantity + 1 } : i
        )
      }
      return [...prev, newItem]
    })
  }, [])

  /**
   * Retire un produit du panier (par son id).
   */
  const removeFromCart = useCallback((productId) => {
    setItems((prev) => prev.filter((i) => i.id !== productId))
  }, [])

  /**
   * Modifie la quantité d'un article (utile pour la page Panier).
   * Si quantity <= 0, l'article est retiré.
   */
  const updateQuantity = useCallback((productId, quantity) => {
    if (quantity < 1) {
      removeFromCart(productId)
      return
    }
    setItems((prev) =>
      prev.map((i) => (i.id === productId ? { ...i, quantity } : i))
    )
  }, [removeFromCart])

  /**
   * Calcule le total du panier (somme des prix × quantités).
   */
  const total = items.reduce((sum, item) => sum + item.price * item.quantity, 0)

  /**
   * Nombre total d'articles (toutes quantités confondues).
   */
  const itemCount = items.reduce((sum, item) => sum + item.quantity, 0)

  const value = {
    items,
    addToCart,
    removeFromCart,
    updateQuantity,
    total,
    itemCount,
  }

  return <CartContext.Provider value={value}>{children}</CartContext.Provider>
}

/**
 * Hook pour accéder au panier depuis n'importe quel composant.
 * Doit être utilisé à l'intérieur de CartProvider.
 */
export function useCart() {
  const ctx = useContext(CartContext)
  if (!ctx) {
    throw new Error('useCart doit être utilisé à l\'intérieur de CartProvider')
  }
  return ctx
}
