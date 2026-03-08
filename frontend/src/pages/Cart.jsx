// Page Panier - BTS SIO
// Affiche les articles, les quantites, le total. On peut retirer un article ou passer commande.
import { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { useCart } from '../context/CartContext'
import { createOrder } from '../services/api'
import toast from 'react-hot-toast'

export default function Cart() {
  const cart = useCart()
  const items = cart.items
  const navigate = useNavigate()
  const [enCours, setEnCours] = useState(false)

  // Quand on clique sur Commander
  async function passerCommande() {
    if (items.length === 0) return
    setEnCours(true)
    try {
      // On prepare la liste pour l'API (product_id et quantity)
      const listePourApi = []
      for (let i = 0; i < items.length; i++) {
        listePourApi.push({ product_id: items[i].id, quantity: items[i].quantity })
      }
      await createOrder(listePourApi)
      cart.clearCart()
      toast.success('Commande enregistrée. Vous pouvez la retrouver dans Mes commandes.')
      navigate('/my-orders', { replace: true })
    } catch (err) {
      let messageErreur = 'Erreur lors de la commande.'
      if (err.response && err.response.data) {
        if (err.response.data.message) messageErreur = err.response.data.message
        else if (err.response.data.errors && err.response.data.errors.items) {
          messageErreur = err.response.data.errors.items[0]
        }
      }
      toast.error(messageErreur)
    } finally {
      setEnCours(false)
    }
  }

  if (items.length === 0) {
    return (
      <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-12 animate-fade-in">
        <h1 className="page-title mb-4">Panier</h1>
        <div className="card-page card-page-form text-center">
          <p className="text-4xl mb-4" aria-hidden>🛒</p>
          <p className="font-heading font-semibold text-lg text-[#222222] dark:text-gray-200 mb-1">Votre panier est vide</p>
          <p className="page-subtitle mb-6">Ajoutez des articles depuis la boutique pour continuer.</p>
          <Link to="/" className="btn-primary inline-block">
            Voir les produits
          </Link>
        </div>
      </div>
    )
  }

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8 animate-fade-in">
      <h1 className="page-title mb-2">Panier</h1>
      <p className="page-subtitle mb-6 sm:mb-8">{items.length} article{items.length > 1 ? 's' : ''} dans votre panier</p>

      <ul className="space-y-4 mb-6 sm:mb-8">
        {items.map((item) => {
          const sousTotal = item.price * item.quantity
          return (
            <li
              key={item.id}
              className="flex flex-col sm:flex-row sm:items-center gap-4 card-page rounded-2xl p-4 sm:p-5 transition-shadow"
            >
              <div className="w-20 h-20 flex-shrink-0 rounded-xl overflow-hidden bg-[#F9F9F9] dark:bg-tech-dark border border-[#EFEFEF] dark:border-tech-border">
                {item.image ? (
                  <img src={item.image} alt={item.name} className="w-full h-full object-cover" />
                ) : (
                  <div className="w-full h-full flex items-center justify-center text-gray-400 dark:text-tech-muted text-2xl">📦</div>
                )}
              </div>
              <div className="flex-1 min-w-0">
                <h2 className="font-heading font-semibold text-[#222222] dark:text-gray-100 truncate">{item.name}</h2>
                <p className="page-subtitle text-sm">{item.price.toFixed(2)} € l&apos;unité</p>
              </div>
              <div className="flex items-center gap-2">
                <button
                  type="button"
                  onClick={() => cart.updateQuantity(item.id, item.quantity - 1)}
                  className="w-9 h-9 flex-shrink-0 rounded-xl border border-[#E0E0E0] dark:border-tech-border text-[#222222] dark:text-gray-300 hover:bg-[#F1F1F1] dark:hover:bg-tech-border hover:text-[#222222] dark:hover:text-white transition-colors font-medium inline-flex items-center justify-center"
                  aria-label="Diminuer la quantité"
                >
                  −
                </button>
                <span className="w-10 text-center font-medium text-[#222222] dark:text-gray-100">{item.quantity}</span>
                <button
                  type="button"
                  onClick={() => cart.updateQuantity(item.id, item.quantity + 1)}
                  className="w-9 h-9 flex-shrink-0 rounded-xl border border-[#E0E0E0] dark:border-tech-border text-[#222222] dark:text-gray-300 hover:bg-[#F1F1F1] dark:hover:bg-tech-border hover:text-[#222222] dark:hover:text-white transition-colors font-medium inline-flex items-center justify-center"
                  aria-label="Augmenter la quantité"
                >
                  +
                </button>
              </div>
              <div className="sm:w-24 text-left sm:text-right">
                <span className="font-heading font-semibold text-[#FFC43F] text-lg">{sousTotal.toFixed(2)} €</span>
              </div>
              <button
                type="button"
                onClick={() => cart.removeFromCart(item.id)}
                className="page-subtitle hover:text-red-500 dark:hover:text-red-400 text-sm font-medium transition-colors sm:ml-2"
                aria-label="Retirer du panier"
              >
                Retirer
              </button>
            </li>
          )
        })}
      </ul>

      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 pt-6 border-t border-[#EFEFEF] dark:border-tech-border bg-white dark:bg-tech-card/50 rounded-2xl p-6">
        <p className="text-lg sm:text-xl font-heading font-bold text-[#222222] dark:text-white">
          Total : <span className="text-[#FFC43F] text-xl sm:text-2xl">{cart.total.toFixed(2)} €</span>
        </p>
        <div className="flex gap-3 flex-wrap">
          <Link to="/" className="btn-secondary inline-block">
            Continuer mes achats
          </Link>
          <button type="button" onClick={passerCommande} disabled={enCours} className="btn-primary">
            {enCours ? 'Envoi en cours…' : 'Commander'}
          </button>
        </div>
      </div>
    </div>
  )
}
