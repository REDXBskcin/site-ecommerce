import { useState, useEffect } from 'react'
import { useParams, Link } from 'react-router-dom'
import { getProductById, getProductImageUrl } from '../services/api'
import { useCart } from '../context/CartContext'
import toast from 'react-hot-toast'

export default function ProductDetailPage() {
  const { id } = useParams()
  const [product, setProduct] = useState(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)
  const [added, setAdded] = useState(false)
  const { addToCart } = useCart()

  useEffect(() => {
    let annule = false
    setLoading(true)
    setError(null)
    getProductById(id)
      .then((data) => { if (!annule) setProduct(data) })
      .catch((err) => {
        if (!annule) {
          setError(err.response?.status === 404 ? 'Produit introuvable.' : 'Impossible de charger le produit.')
          setProduct(null)
        }
      })
      .finally(() => { if (!annule) setLoading(false) })
    return () => { annule = true }
  }, [id])

  function ajouterPanier() {
    if (!product) return
    addToCart(product)
    toast.success('Produit ajouté au panier')
    setAdded(true)
    setTimeout(() => setAdded(false), 2000)
  }

  if (loading) {
    return (
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-12 sm:py-16 flex flex-col sm:flex-row justify-center items-center gap-4 min-h-[50vh]">
        <div className="w-10 h-10 border-2 border-primary border-t-transparent rounded-full animate-spin" aria-hidden />
        <span className="text-slate-600 text-sm sm:text-base">Chargement…</span>
      </div>
    )
  }

  if (error || !product) {
    return (
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-12 text-center animate-fade-in">
        <div className="w-12 h-12 mx-auto mb-4 rounded-full bg-red-100 flex items-center justify-center">
          <svg className="w-6 h-6 text-red-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
          </svg>
        </div>
        <p className="text-red-600 font-medium mb-4">{error || 'Produit introuvable.'}</p>
        <Link to="/" className="inline-block py-3 px-6 rounded-lg bg-primary text-white font-medium hover:bg-primary-hover transition-colors duration-150">Retour à l'accueil</Link>
      </div>
    )
  }

  const { name, price, description, stock, category } = product
  const imgSrc = getProductImageUrl(product)
  const prix = typeof price === 'number' ? price.toFixed(2) : price

  return (
    <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-6 sm:py-8 animate-fade-in">
      <Link to="/" className="inline-flex items-center gap-1.5 text-slate-600 hover:text-primary text-sm mb-6 transition-colors duration-150 py-1">
        <svg className="w-4 h-4 shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
        </svg>
        Retour aux produits
      </Link>
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 lg:gap-12">
        <div className="bg-slate-50 border border-slate-300 rounded-xl overflow-hidden flex items-center justify-center min-h-[240px] sm:min-h-[280px] lg:min-h-[360px] shadow-card animate-slide-up" style={{ animationDelay: '0ms' }}>
          {imgSrc ? (
            <img src={imgSrc} alt={name} className="w-full h-full object-contain max-h-[280px] sm:max-h-[360px] p-6" />
          ) : (
            <div className="text-slate-300">
              <svg className="w-20 h-20 sm:w-24 sm:h-24 mx-auto" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4" />
              </svg>
            </div>
          )}
        </div>
        <div className="flex flex-col animate-slide-up" style={{ animationDelay: '100ms' }}>
          {category?.name && <p className="text-xs font-medium text-primary uppercase tracking-wider mb-2">{category.name}</p>}
          <h1 className="text-xl sm:text-2xl lg:text-3xl font-bold text-slate-900 mb-3 sm:mb-4">{name}</h1>
          <p className="text-primary font-bold text-2xl sm:text-3xl mb-4">{prix} €</p>
          {description && <p className="text-slate-600 mb-6 leading-relaxed">{description}</p>}
          <p className="text-slate-600 text-sm mb-6">
            {stock > 0 ? (
              <span className="inline-flex items-center gap-1.5">
                <span className="relative flex h-2 w-2 shrink-0">
                    <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-green-400 opacity-75" />
                    <span className="relative inline-flex rounded-full h-2 w-2 bg-green-500" />
                  </span>
                En stock : {stock} disponible{stock > 1 ? 's' : ''}
              </span>
            ) : (
              <span className="text-red-600 font-medium">Rupture de stock</span>
            )}
          </p>
          <button
            type="button"
            onClick={ajouterPanier}
            disabled={added || stock < 1}
            className="w-full sm:w-auto min-w-[200px] py-3 px-8 rounded-lg bg-primary text-white font-semibold hover:bg-primary-hover active:scale-[0.98] focus:ring-2 focus:ring-primary focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed disabled:active:scale-100 transition-all duration-150 touch-target"
          >
            {added ? 'Ajouté ✓' : stock < 1 ? 'Rupture de stock' : 'Ajouter au panier'}
          </button>
        </div>
      </div>
    </div>
  )
}
