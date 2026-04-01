import { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { useCart } from '../context/CartContext'
import { useAuth } from '../context/AuthContext'
import { createOrder } from '../services/api'
import toast from 'react-hot-toast'

export default function Cart() {
  const { items, removeFromCart, updateQuantity, total, clearCart } = useCart()
  const { isAuthenticated, user } = useAuth()
  const navigate = useNavigate()
  const [loading, setLoading] = useState(false)

  async function handleCommander() {
    if (!isAuthenticated) {
      navigate('/login')
      return
    }
    setLoading(true)
    try {
      const shippingParts = [user?.address, user?.city, user?.postal_code, user?.country].filter(Boolean)
      const shippingAddress = shippingParts.length > 0 ? shippingParts.join(', ') : null
      await createOrder({
        items: items.map((item) => ({
          product_id: item.id,
          quantity: item.quantity,
          unit_price: item.price,
        })),
        shipping_address: shippingAddress,
      })
      clearCart()
      toast.success('Commande passée avec succès !')
      navigate('/my-orders')
    } catch (err) {
      const msg = err?.response?.data?.message || 'Erreur lors de la commande.'
      toast.error(msg)
    } finally {
      setLoading(false)
    }
  }

  if (items.length === 0) {
    return (
      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-12 animate-fade-in">
        <h1 className="text-2xl font-bold text-slate-900 mb-6">Panier</h1>
        <div className="bg-slate-50 border border-slate-300 rounded-xl p-8 sm:p-12 text-center shadow-card">
          <div className="w-16 h-16 mx-auto mb-4 rounded-full bg-slate-100 flex items-center justify-center">
            <svg className="w-8 h-8 text-slate-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M3 3h2l.4 2M7 13h10l4-8H5.4M7 13L5.4 5M7 13l-2.293 2.293c-.63.63-.184 1.707.707 1.707H17m0 0a2 2 0 100 4 2 2 0 000-4zm-8 2a2 2 0 11-4 0 2 2 0 014 0z" />
            </svg>
          </div>
          <p className="text-slate-600 mb-6">Votre panier est vide.</p>
          <Link to="/" className="inline-block py-3 px-6 rounded-lg bg-primary text-white font-semibold hover:bg-primary-hover transition-colors duration-150 touch-target">
            Voir les produits
          </Link>
        </div>
      </div>
    )
  }

  return (
    <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-6 sm:py-8 animate-fade-in">
      <h1 className="text-2xl font-bold text-slate-900 mb-6 sm:mb-8">Panier</h1>
      <ul className="space-y-4 mb-8">
        {items.map((item, index) => {
          const sousTotal = item.price * item.quantity
          return (
            <li key={item.id} className="flex flex-col sm:flex-row gap-4 sm:items-center bg-slate-50 border border-slate-300 rounded-xl p-4 sm:p-5 shadow-card transition-shadow duration-150 animate-slide-up" style={{ animationDelay: `${index * 60}ms` }}>
              <div className="w-20 h-20 flex-shrink-0 rounded-lg overflow-hidden bg-slate-100">
                {item.image ? (
                  <img src={item.image} alt={item.name} className="w-full h-full object-cover" />
                ) : (
                  <div className="w-full h-full flex items-center justify-center text-slate-400">
                    <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4" />
                    </svg>
                  </div>
                )}
              </div>
              <div className="flex-1 min-w-0">
                <h2 className="font-semibold text-slate-900 truncate">{item.name}</h2>
                <p className="text-slate-500 text-sm">{item.price.toFixed(2)} € l'unité</p>
              </div>
              <div className="flex items-center gap-2">
                <button type="button" onClick={() => updateQuantity(item.id, item.quantity - 1)} className="w-11 h-11 rounded-lg border border-slate-200 text-slate-600 hover:bg-primary/10 hover:text-primary hover:border-primary/30 active:scale-95 font-medium transition-all duration-150 touch-target flex items-center justify-center" aria-label="Diminuer">−</button>
                <span className="w-10 text-center font-medium text-slate-900">{item.quantity}</span>
                <button type="button" onClick={() => updateQuantity(item.id, item.quantity + 1)} className="w-11 h-11 rounded-lg border border-slate-200 text-slate-600 hover:bg-primary/10 hover:text-primary hover:border-primary/30 active:scale-95 font-medium transition-all duration-150 touch-target flex items-center justify-center" aria-label="Augmenter">+</button>
              </div>
              <div className="sm:w-24 text-right">
                <span className="font-semibold text-primary">{sousTotal.toFixed(2)} €</span>
              </div>
              <button type="button" onClick={() => removeFromCart(item.id)} className="text-slate-500 hover:text-red-600 text-sm font-medium py-2 transition-colors duration-150 touch-target flex items-center sm:block" aria-label="Retirer">Retirer</button>
            </li>
          )
        })}
      </ul>
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 pt-6 border-t border-slate-300 bg-slate-50 rounded-xl p-6 shadow-card">
        <p className="text-xl font-bold text-slate-900">
          Total : <span className="text-primary">{total.toFixed(2)} €</span>
        </p>
        <div className="flex flex-col-reverse sm:flex-row gap-3">
          <Link to="/" className="inline-block py-3 px-6 rounded-lg border border-slate-200 text-slate-700 font-medium hover:bg-slate-50 transition-colors duration-150 text-center touch-target">
            Continuer mes achats
          </Link>
          <button type="button" onClick={handleCommander} disabled={loading} className="py-4 px-10 rounded-xl bg-primary text-white font-bold text-base hover:bg-primary-hover active:scale-[0.98] shadow-lg shadow-primary/25 hover:shadow-xl hover:shadow-primary/30 transition-all duration-150 touch-target disabled:opacity-60 disabled:cursor-not-allowed">
            {loading ? 'Commande en cours…' : 'Commander'}
          </button>
        </div>
      </div>
    </div>
  )
}
