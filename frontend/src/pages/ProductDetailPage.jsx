// Page detail d un produit - BTS SIO
// On charge le produit avec l API puis on affiche image, prix, bouton ajouter au panier
import { useState, useEffect } from 'react'
import { useParams, Link } from 'react-router-dom'
import { getProductById } from '../services/api'
import { useCart } from '../context/CartContext'
import LoadingSpinner from '../components/LoadingSpinner'
import toast from 'react-hot-toast'

export default function ProductDetailPage() {
  const params = useParams()
  const id = params.id
  const [product, setProduct] = useState(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)
  const [added, setAdded] = useState(false)
  const cart = useCart()

  useEffect(() => {
    let annule = false
    async function charger() {
      setLoading(true)
      setError(null)
      try {
        const data = await getProductById(id)
        if (!annule) setProduct(data)
      } catch (err) {
        if (!annule) {
          if (err.response && err.response.status === 404) setError('Produit introuvable.')
          else setError('Impossible de charger le produit.')
          setProduct(null)
        }
      } finally {
        if (!annule) setLoading(false)
      }
    }
    charger()
    return () => { annule = true }
  }, [id])

  function ajouterAuPanier() {
    if (!product) return
    cart.addToCart(product)
    toast.success('Produit ajouté au panier !')
    setAdded(true)
    setTimeout(() => setAdded(false), 2000)
  }

  if (loading) {
    return (
      <div className="max-w-6xl mx-auto px-4 py-12 flex justify-center min-h-[50vh]">
        <LoadingSpinner size="lg" label="Chargement du produit…" />
      </div>
    )
  }

  if (error || !product) {
    return (
      <div className="max-w-6xl mx-auto px-4 py-12 text-center">
        <p className="text-red-500 dark:text-red-400 mb-4">{error || 'Produit introuvable.'}</p>
        <Link to="/" className="text-[#FFC43F] hover:underline">Retour à l&apos;accueil</Link>
      </div>
    )
  }

  const name = product.name
  const price = product.price
  const description = product.description
  const stock = product.stock
  const image = product.image
  const category = product.category
  const inStock = stock > 0

  return (
    <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-8 animate-fade-in">
      <Link to="/" className="inline-flex items-center gap-1 page-subtitle hover:text-[#FFC43F] text-sm mb-6 transition-colors">
        ← Retour aux produits
      </Link>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 lg:gap-12">
        <div className="relative aspect-square lg:aspect-video bg-[#F9F9F9] dark:bg-gray-800 rounded-2xl overflow-hidden border border-[#EFEFEF] dark:border-tech-border shadow-[0_5px_22px_rgba(0,0,0,0.04)]">
          {inStock ? (
            <span className="absolute top-4 right-4 px-3 py-1 rounded-full text-xs font-medium bg-green-500/90 text-white z-10">En stock</span>
          ) : (
            <span className="absolute top-4 right-4 px-3 py-1 rounded-full text-xs font-medium bg-red-500/90 text-white z-10">Rupture</span>
          )}
          {image ? (
            <img src={image} alt={name} className="absolute inset-0 w-full h-full object-cover" />
          ) : (
            <span className="absolute inset-0 flex items-center justify-center text-6xl text-gray-400 dark:text-tech-muted">📦</span>
          )}
        </div>

        <div className="flex flex-col">
          {category && category.name && (
            <p className="text-xs text-[#2d5a27] dark:text-[#FFC43F] uppercase tracking-wider mb-2">{category.name}</p>
          )}
          <h1 className="page-title mb-4">{name}</h1>
          <p className="text-[#FFC43F] font-heading font-bold text-xl sm:text-2xl mb-4">
            {typeof price === 'number' ? price.toFixed(2) : price} €
          </p>
          {description && (
            <p className="text-[#787878] dark:text-gray-300 mb-6 leading-relaxed">{description}</p>
          )}
          <p className="page-subtitle mb-6">
            {inStock ? (
              <span className="inline-flex items-center gap-1">
                <span className="inline-block w-2 h-2 rounded-full bg-green-500" /> En stock : {stock} disponible{stock > 1 ? 's' : ''}
              </span>
            ) : (
              <span className="text-red-500 dark:text-red-400 font-medium">Rupture de stock</span>
            )}
          </p>
        <button
          type="button"
          onClick={ajouterAuPanier}
          disabled={added || !inStock}
          className="btn-primary w-full sm:w-auto min-w-[200px]"
        >
            {added ? 'Ajouté ✔️' : !inStock ? 'Rupture de stock' : 'Ajouter au panier'}
          </button>
        </div>
      </div>
    </div>
  )
}
