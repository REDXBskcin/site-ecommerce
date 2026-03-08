// ============================================================
// Contexte du panier – BTS SIO
// Stocke les articles en state + localStorage (persistance au refresh).
// Chaque article = { id, name, price, image, quantity }
// ============================================================
import { createContext, useContext, useState, useEffect, useCallback } from 'react'

const STORAGE_KEY = 'tech-store-cart'

// Transforme un produit en article panier (id, name, price, image, quantity)
export function getCartItemFromProduct(product, quantity = 1) {
  const prix = typeof product.price === 'number' ? product.price : parseFloat(product.price)
  const img = product.image_url || product.image || null
  return {
    id: product.id,
    name: product.name,
    price: prix,
    image: img,
    quantity: quantity,
  }
}

const CartContext = createContext(null)

// Charge le panier depuis le localStorage
function loadCartFromStorage() {
  try {
    const chaine = localStorage.getItem(STORAGE_KEY)
    if (!chaine) return []
    const tab = JSON.parse(chaine)
    if (Array.isArray(tab)) return tab
    return []
  } catch (e) {
    return []
  }
}

// Sauvegarde le panier dans le localStorage
function saveCartToStorage(items) {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(items))
  } catch (e) {
    console.warn('Sauvegarde panier impossible', e)
  }
}

export function CartProvider({ children }) {
  // Initialisation : on charge le panier depuis le localStorage
  const [items, setItems] = useState(loadCartFromStorage)

  // a chaque fois que items change on sauvegarde
  useEffect(() => {
    saveCartToStorage(items)
  }, [items])

  // Ajoute un produit au panier (ou +1 si deja dedans)
  const addToCart = useCallback((product) => {
    const nouvelArticle = getCartItemFromProduct(product, 1)
    setItems((prev) => {
      const dejaPresent = prev.find((i) => i.id === product.id)
      if (dejaPresent) {
        return prev.map((i) => {
          if (i.id === product.id) return { ...i, quantity: i.quantity + 1 }
          return i
        })
      }
      return [...prev, nouvelArticle]
    })
  }, [])

  // Retire un produit du panier
  const removeFromCart = useCallback((productId) => {
    setItems((prev) => prev.filter((i) => i.id !== productId))
  }, [])

  // Change la quantite d un article (page panier). Si <= 0 on le retire
  const updateQuantity = useCallback((productId, quantity) => {
    if (quantity < 1) {
      removeFromCart(productId)
      return
    }
    setItems((prev) =>
      prev.map((i) => (i.id === productId ? { ...i, quantity: quantity } : i))
    )
  }, [removeFromCart])

  // Vide tout le panier (apres avoir passe commande)
  const clearCart = useCallback(() => {
    setItems([])
  }, [])

  // Total = somme des (prix * quantite)
  let total = 0
  for (let i = 0; i < items.length; i++) {
    total = total + items[i].price * items[i].quantity
  }

  // Nombre total d articles
  let itemCount = 0
  for (let i = 0; i < items.length; i++) {
    itemCount = itemCount + items[i].quantity
  }

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
  if (!ctx) throw new Error('useCart doit etre utilise dans un CartProvider')
  return ctx
}
