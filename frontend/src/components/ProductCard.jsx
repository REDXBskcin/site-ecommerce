import { useState } from 'react'
import { Link } from 'react-router-dom'
import toast from 'react-hot-toast'
import { getProductImageUrl } from '../services/api'

export default function ProductCard({ product, onAddToCart }) {
  const { id, name, price, image, category, created_at } = product
  const imgSrc = getProductImageUrl(product)
  const [added, setAdded] = useState(false)

  const isNew = created_at && (Date.now() - new Date(created_at).getTime()) < 7 * 24 * 60 * 60 * 1000

  function handleAdd(e) {
    e.preventDefault()
    e.stopPropagation()
    if (onAddToCart) onAddToCart(product)
    toast.success('Produit ajouté au panier')
    setAdded(true)
    setTimeout(() => setAdded(false), 2000)
  }

  const prix = typeof price === 'number' ? price.toFixed(2) : price

  return (
    <article className="group bg-slate-50 dark:bg-slate-800 border border-slate-300 dark:border-slate-700 rounded-xl overflow-hidden shadow-card hover:shadow-card-hover hover:border-slate-400 dark:hover:border-slate-500 hover:-translate-y-1 transition-all duration-300 ease-out flex flex-col h-full" data-testid={`product-card-${id}`}>
      <Link to={`/product/${id}`} className="relative block aspect-[4/3] bg-slate-200/50 dark:bg-slate-700/50 overflow-hidden flex items-center justify-center focus:outline-none focus:ring-2 focus:ring-primary focus:ring-inset">
        {isNew && (
          <span className="absolute top-2 left-2 z-10 px-2 py-0.5 rounded-full bg-primary text-white text-xs font-semibold animate-bounce-in shadow">
            Nouveau
          </span>
        )}
        {imgSrc ? (
          <img src={imgSrc} alt="" loading="lazy" className="w-full h-full object-contain p-4 group-hover:scale-110 transition-transform duration-300 ease-out" />
        ) : (
          <div className="w-full h-full flex items-center justify-center text-slate-300">
            <svg className="w-14 h-14 sm:w-16 sm:h-16" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4" />
            </svg>
          </div>
        )}
      </Link>
      <div className="p-4 flex flex-col flex-1">
        {category?.name && (
          <span className="inline-block mb-2 px-2 py-0.5 rounded-md bg-primary/10 text-primary text-xs font-semibold tracking-wide">{category.name}</span>
        )}
        <h2 className="font-semibold text-slate-900 dark:text-white mb-2 line-clamp-2 min-h-[2.5rem]">
          <Link to={`/product/${id}`} className="hover:text-primary transition-colors duration-150 focus:outline-none focus:underline">
            {name}
          </Link>
        </h2>
        <p className="text-primary font-bold text-lg sm:text-xl mt-auto mb-3">{prix} €</p>
        <button
          type="button"
          onClick={handleAdd}
          disabled={added}
          className="w-full py-3 px-4 rounded-lg bg-primary text-white font-semibold hover:bg-primary-hover active:scale-[0.98] focus:ring-2 focus:ring-primary focus:ring-offset-2 focus:ring-offset-slate-50 dark:focus:ring-offset-slate-800 transition-all duration-150 disabled:opacity-80 disabled:cursor-default disabled:active:scale-100 text-sm touch-target"
        >
          {added ? 'Ajouté ✓' : 'Ajouter au panier'}
        </button>
      </div>
    </article>
  )
}
