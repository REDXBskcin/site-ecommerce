/**
 * Carte produit – BTS SIO
 * Affiche image, nom, prix et bouton "Ajouter au panier".
 * Image et titre cliquables → page détail /product/{id}.
 */
import { useState } from 'react'
import { Link } from 'react-router-dom'
import toast from 'react-hot-toast'

export default function ProductCard({ product, onAddToCart }) {
  const { id, name, price, image, category } = product
  const [added, setAdded] = useState(false)

  const handleAdd = (e) => {
    e.preventDefault()
    e.stopPropagation()
    if (typeof onAddToCart === 'function') {
      onAddToCart(product)
    }
    toast.success('Produit ajouté au panier !')
    setAdded(true)
    setTimeout(() => setAdded(false), 2000)
  }

  return (
    <article
      className="group bg-tech-card border border-tech-border rounded-2xl overflow-hidden shadow-card hover:shadow-card-hover hover:border-tech-accent/50 hover:scale-105 hover:-translate-y-1 transition-all duration-300 flex flex-col"
      data-testid={`product-card-${id}`}
    >
      {/* Image cliquable → page détail */}
      <Link to={`/product/${id}`} className="block aspect-video bg-gray-100 overflow-hidden flex items-center justify-center focus:outline-none focus:ring-2 focus:ring-tech-accent focus:ring-inset">
        {image ? (
          <img
            src={image}
            alt={name}
            className="w-full h-full object-contain group-hover:scale-105 transition-transform duration-300"
          />
        ) : (
          <div className="w-full h-full flex items-center justify-center text-tech-muted text-4xl">
            📦
          </div>
        )}
      </Link>

      <div className="p-4 flex flex-col flex-1">
        {category?.name && (
          <p className="text-xs text-tech-accent uppercase tracking-wider mb-1">
            {category.name}
          </p>
        )}
        {/* Titre cliquable → page détail */}
        <h2 className="font-semibold text-gray-100 mb-2 line-clamp-2">
          <Link to={`/product/${id}`} className="hover:text-tech-accent transition-colors focus:outline-none focus:underline">
            {name}
          </Link>
        </h2>
        <p className="text-tech-accent font-bold text-lg mt-auto mb-3">
          {typeof price === 'number' ? price.toFixed(2) : price} €
        </p>
        <button
          type="button"
          onClick={handleAdd}
          disabled={added}
          className="w-full py-2.5 px-4 rounded-lg bg-tech-accent text-tech-dark font-medium hover:bg-tech-accent-hover focus:ring-2 focus:ring-tech-accent focus:ring-offset-2 focus:ring-offset-tech-dark transition-colors disabled:opacity-90 disabled:cursor-default"
        >
          {added ? 'Ajouté ✔️' : 'Ajouter au panier'}
        </button>
      </div>
    </article>
  )
}
