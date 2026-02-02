/**
 * Page Panier – BTS SIO
 * Affiche la liste des articles du panier, la quantité, le sous-total par ligne et le total.
 * Permet de retirer un article ou d'ajuster la quantité.
 */
import { Link } from 'react-router-dom'
import { useCart } from '../context/CartContext'

export default function Cart() {
  const { items, removeFromCart, updateQuantity, total } = useCart()

  if (items.length === 0) {
    return (
      <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <h1 className="text-3xl font-bold text-white mb-6">Panier</h1>
        <div className="bg-tech-card border border-tech-border rounded-xl p-8 text-center">
          <p className="text-tech-muted mb-6">Votre panier est vide.</p>
          <Link
            to="/"
            className="inline-block py-2.5 px-6 rounded-lg bg-tech-accent text-tech-dark font-medium hover:bg-tech-accent-hover transition-colors"
          >
            Voir les produits
          </Link>
        </div>
      </div>
    )
  }

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <h1 className="text-3xl font-bold text-white mb-8">Panier</h1>

      {/* Liste des articles */}
      <ul className="space-y-4 mb-8">
        {items.map((item) => {
          const lineTotal = item.price * item.quantity
          return (
            <li
              key={item.id}
              className="flex flex-col sm:flex-row gap-4 sm:items-center bg-tech-card border border-tech-border rounded-xl p-4"
            >
              {/* Image miniature */}
              <div className="w-20 h-20 flex-shrink-0 rounded-lg overflow-hidden bg-tech-dark">
                {item.image ? (
                  <img
                    src={item.image}
                    alt={item.name}
                    className="w-full h-full object-cover"
                  />
                ) : (
                  <div className="w-full h-full flex items-center justify-center text-tech-muted text-2xl">
                    📦
                  </div>
                )}
              </div>

              {/* Nom + prix unitaire */}
              <div className="flex-1 min-w-0">
                <h2 className="font-semibold text-gray-100 truncate">{item.name}</h2>
                <p className="text-tech-muted text-sm">
                  {item.price.toFixed(2)} € l'unité
                </p>
              </div>

              {/* Quantité : boutons - / nombre / + */}
              <div className="flex items-center gap-2">
                <button
                  type="button"
                  onClick={() => updateQuantity(item.id, item.quantity - 1)}
                  className="w-9 h-9 rounded-lg border border-tech-border text-tech-muted hover:bg-tech-border hover:text-white transition-colors"
                  aria-label="Diminuer la quantité"
                >
                  −
                </button>
                <span className="w-10 text-center font-medium text-gray-100">
                  {item.quantity}
                </span>
                <button
                  type="button"
                  onClick={() => updateQuantity(item.id, item.quantity + 1)}
                  className="w-9 h-9 rounded-lg border border-tech-border text-tech-muted hover:bg-tech-border hover:text-white transition-colors"
                  aria-label="Augmenter la quantité"
                >
                  +
                </button>
              </div>

              {/* Sous-total ligne */}
              <div className="sm:w-24 text-right">
                <span className="font-semibold text-tech-accent">
                  {(lineTotal).toFixed(2)} €
                </span>
              </div>

              {/* Retirer du panier */}
              <button
                type="button"
                onClick={() => removeFromCart(item.id)}
                className="text-tech-muted hover:text-red-400 text-sm transition-colors"
                aria-label="Retirer du panier"
              >
                Retirer
              </button>
            </li>
          )
        })}
      </ul>

      {/* Bloc total + retour boutique */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 pt-6 border-t border-tech-border">
        <p className="text-xl font-bold text-white">
          Total : <span className="text-tech-accent">{total.toFixed(2)} €</span>
        </p>
        <div className="flex gap-3">
          <Link
            to="/"
            className="inline-block py-2.5 px-6 rounded-lg border border-tech-border text-gray-300 hover:bg-tech-border transition-colors"
          >
            Continuer mes achats
          </Link>
          {/* Bouton "Commander" : à brancher sur la page commande plus tard */}
          <button
            type="button"
            className="py-2.5 px-6 rounded-lg bg-tech-accent text-tech-dark font-medium hover:bg-tech-accent-hover transition-colors"
          >
            Commander
          </button>
        </div>
      </div>
    </div>
  )
}
