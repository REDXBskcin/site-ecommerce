/**
 * Carte produit – BTS SIO
 * Affiche : image, nom, prix, bouton "Ajouter au panier".
 * L'image et le titre sont cliquables et mènent à la page détail /product/:id.
 * Badge "En stock" ou "Rupture" selon le stock.
 */
import { useState } from 'react'
import { Link } from 'react-router-dom'
import toast from 'react-hot-toast'

export default function ProductCard({ product, onAddToCart }) {
  const { id, name, price, image, category, stock } = product
  const [added, setAdded] = useState(false)
  const inStock = typeof stock === 'number' ? stock > 0 : true

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
      className="group card-page rounded-2xl overflow-hidden hover:-translate-y-2 transition-all duration-300 ease-out flex flex-col p-4"
      data-testid={`product-card-${id}`}
    >
        <Link to={`/product/${id}`} className="relative block aspect-[4/3] bg-[#F9F9F9] dark:bg-gray-800 rounded-xl overflow-hidden focus:outline-none focus:ring-2 focus:ring-[#FFC43F] focus:ring-inset border border-[#EFEFEF] dark:border-transparent">
        {/* Badge stock en haut à droite */}
        {typeof stock === 'number' && (
          <span
            className={`absolute top-2 right-2 px-2 py-0.5 rounded-full text-xs font-medium z-10 ${
              inStock
                ? 'bg-green-500/90 text-white dark:bg-green-500/80'
                : 'bg-red-500/90 text-white dark:bg-red-500/80'
            }`}
          >
            {inStock ? 'En stock' : 'Rupture'}
          </span>
        )}
        {image ? (
          <img
            src={image}
            alt={name}
            className="absolute inset-0 w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
          />
        ) : (
          <div className="absolute inset-0 flex items-center justify-center text-gray-400 dark:text-tech-muted text-4xl">
            📦
          </div>
        )}
      </Link>

      <div className="pt-4 flex flex-col flex-1">
        {category?.name && (
          <p className="text-xs text-[#2d5a27] dark:text-[#FFC43F] uppercase tracking-wider mb-1">
            {category.name}
          </p>
        )}
        <h2 className="font-heading font-semibold text-lg text-[#222222] dark:text-gray-100 mb-2 line-clamp-2 leading-snug">
          <Link to={`/product/${id}`} className="hover:text-[#FFC43F] transition-colors focus:outline-none focus:underline text-inherit">
            {name}
          </Link>
        </h2>
        <p className="font-heading font-semibold text-xl text-[#FFC43F] mt-auto mb-3">
          {typeof price === 'number' ? price.toFixed(2) : price} €
        </p>
        <button
          type="button"
          onClick={handleAdd}
          disabled={added || !inStock}
          className="btn-primary w-full"
        >
          {added ? 'Ajouté ✔' : !inStock ? 'Indisponible' : 'Ajouter au panier'}
        </button>
      </div>
    </article>
  )
}
