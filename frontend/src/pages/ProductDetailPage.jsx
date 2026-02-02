/**
 * Page détail produit – BTS SIO
 * Récupère le produit via l'API Laravel (GET /api/products/{id}).
 * Layout : image à gauche, infos (prix, description, stock) + bouton achat à droite.
 */
import { useState, useEffect } from 'react'
import { useParams, Link } from 'react-router-dom'
import { getProductById } from '../services/api'
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
    let cancelled = false
    async function fetchProduct() {
      setLoading(true)
      setError(null)
      try {
        const data = await getProductById(id)
        if (!cancelled) setProduct(data)
      } catch (err) {
        if (!cancelled) {
          setError(err.response?.status === 404 ? 'Produit introuvable.' : 'Impossible de charger le produit.')
          setProduct(null)
        }
      } finally {
        if (!cancelled) setLoading(false)
      }
    }
    fetchProduct()
    return () => { cancelled = true }
  }, [id])

  const handleAddToCart = () => {
    if (!product) return
    addToCart(product)
    toast.success('Produit ajouté au panier !')
    setAdded(true)
    setTimeout(() => setAdded(false), 2000)
  }

  if (loading) {
    return (
      <div className="max-w-6xl mx-auto px-4 py-12 flex justify-center items-center min-h-[50vh]">
        <span className="inline-block w-12 h-12 border-4 border-tech-accent border-t-transparent rounded-full animate-spin" aria-hidden />
        <span className="ml-3 text-tech-muted">Chargement du produit…</span>
      </div>
    )
  }

  if (error || !product) {
    return (
      <div className="max-w-6xl mx-auto px-4 py-12 text-center">
        <p className="text-red-400 mb-4">{error || 'Produit introuvable.'}</p>
        <Link to="/" className="text-tech-accent hover:underline">Retour à l'accueil</Link>
      </div>
    )
  }

  const { name, price, description, stock, image, category } = product

  return (
    <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <Link to="/" className="inline-block text-tech-muted hover:text-tech-accent text-sm mb-6 transition-colors">
        ← Retour aux produits
      </Link>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 lg:gap-12">
        {/* Image à gauche */}
        <div className="bg-gray-100 rounded-2xl overflow-hidden flex items-center justify-center min-h-[280px] lg:min-h-[360px]">
          {image ? (
            <img
              src={image}
              alt={name}
              className="w-full h-full object-contain max-h-[360px]"
            />
          ) : (
            <span className="text-6xl text-tech-muted">📦</span>
          )}
        </div>

        {/* Infos à droite */}
        <div className="flex flex-col">
          {category?.name && (
            <p className="text-xs text-tech-accent uppercase tracking-wider mb-2">
              {category.name}
            </p>
          )}
          <h1 className="text-2xl lg:text-3xl font-bold text-white mb-4">
            {name}
          </h1>
          <p className="text-tech-accent font-bold text-2xl mb-4">
            {typeof price === 'number' ? price.toFixed(2) : price} €
          </p>
          {description && (
            <p className="text-gray-300 mb-6 leading-relaxed">
              {description}
            </p>
          )}
          <p className="text-tech-muted text-sm mb-6">
            {stock > 0 ? (
              <span>En stock : {stock} disponible{stock > 1 ? 's' : ''}</span>
            ) : (
              <span className="text-red-400">Rupture de stock</span>
            )}
          </p>
          <button
            type="button"
            onClick={handleAddToCart}
            disabled={added || stock < 1}
            className="w-full sm:w-auto px-8 py-3 rounded-xl bg-tech-accent text-tech-dark font-medium hover:bg-tech-accent-hover focus:ring-2 focus:ring-tech-accent focus:ring-offset-2 focus:ring-offset-tech-dark transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {added ? 'Ajouté ✔️' : stock < 1 ? 'Rupture de stock' : 'Ajouter au panier'}
          </button>
        </div>
      </div>
    </div>
  )
}
