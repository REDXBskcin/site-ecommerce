/**
 * Page d'accueil – BTS SIO
 * Grille de produits paginés (12 par page) avec recherche et filtre par catégorie (API Laravel).
 * Boutons Précédent / Suivant pour naviguer entre les pages.
 */
import { useState, useEffect, useCallback } from 'react'
import { getProducts, getCategories } from '../services/api'
import { useCart } from '../context/CartContext'
import ProductCard from '../components/ProductCard'

export default function Home() {
  const [products, setProducts] = useState([])
  const [categories, setCategories] = useState([])
  const [pagination, setPagination] = useState({ current_page: 1, last_page: 1, total: 0 })
  const [page, setPage] = useState(1)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)
  const [searchQuery, setSearchQuery] = useState('')
  const [categoryFilter, setCategoryFilter] = useState('')
  const { addToCart } = useCart()

  const fetchCategories = useCallback(async () => {
    try {
      const data = await getCategories()
      setCategories(Array.isArray(data) ? data : [])
    } catch {
      setCategories([])
    }
  }, [])

  const fetchProducts = useCallback(async (pageNum, search, categoryId) => {
    setLoading(true)
    setError(null)
    try {
      const response = await getProducts(pageNum, {
        search: search || undefined,
        category_id: categoryId || undefined,
      })
      const data = response.data ?? []
      const meta = response.meta ?? {}
      setProducts(Array.isArray(data) ? data : [])
      setPagination({
        current_page: meta.current_page ?? 1,
        last_page: meta.last_page ?? 1,
        total: meta.total ?? 0,
      })
    } catch (err) {
      const message = err.response
        ? `Erreur serveur (${err.response.status}).`
        : 'Impossible de joindre l\'API. Vérifiez que Laravel est démarré (php artisan serve) et que WAMP est allumé.'
      setError(message)
      setProducts([])
      setPagination({ current_page: 1, last_page: 1, total: 0 })
    } finally {
      setLoading(false)
    }
  }, [])

  useEffect(() => {
    fetchCategories()
  }, [fetchCategories])

  useEffect(() => {
    fetchProducts(page, searchQuery, categoryFilter)
  }, [page, searchQuery, categoryFilter, fetchProducts])

  const goToPrevPage = () => {
    if (pagination.current_page > 1) setPage((p) => p - 1)
  }
  const goToNextPage = () => {
    if (pagination.current_page < pagination.last_page) setPage((p) => p + 1)
  }

  const handleSearchChange = (value) => {
    setSearchQuery(value)
    setPage(1)
  }
  const handleCategoryChange = (value) => {
    setCategoryFilter(value)
    setPage(1)
  }

  const handleAddToCart = (product) => {
    addToCart(product)
  }

  // Spinner pleine page uniquement au premier chargement (pas lors de la recherche / changement de page).
  // Sinon le champ de recherche serait remplacé par le spinner et perdrait le focus à chaque lettre.
  const isInitialLoad = loading && products.length === 0
  if (isInitialLoad) {
    return (
      <div className="max-w-7xl mx-auto px-4 py-12 flex flex-col justify-center items-center min-h-[50vh]">
        <span
          className="inline-block w-12 h-12 border-4 border-tech-accent border-t-transparent rounded-full animate-spin mb-4"
          aria-hidden
        />
        <p className="text-tech-muted">Chargement des produits…</p>
      </div>
    )
  }

  // État : erreur (API injoignable) → message + bouton Réessayer
  if (error) {
    return (
      <div className="max-w-7xl mx-auto px-4 py-12 flex flex-col justify-center items-center min-h-[50vh]">
        <div className="bg-tech-card border border-red-500/30 rounded-xl p-8 max-w-md text-center">
          <p className="text-red-400 font-medium mb-2">Erreur de chargement</p>
          <p className="text-tech-muted text-sm mb-6">{error}</p>
          <button
            type="button"
            onClick={fetchProducts}
            className="py-2.5 px-6 rounded-lg bg-tech-accent text-tech-dark font-medium hover:bg-tech-accent-hover transition-colors"
          >
            Réessayer
          </button>
        </div>
      </div>
    )
  }

  // État : succès → barre de recherche + filtre + grille
  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <div className="mb-6">
        <h1 className="text-3xl font-bold text-white mb-2">Nos produits</h1>
        <p className="text-tech-muted text-sm">
          Données chargées depuis l&apos;API Laravel.
        </p>
      </div>

      {/* Barre de recherche + filtre par catégorie (temps réel) */}
      <div className="mb-8 flex flex-col sm:flex-row gap-4">
        <label className="flex-1 min-w-0">
          <span className="sr-only">Rechercher un produit</span>
          <input
            type="search"
            placeholder="Rechercher un produit..."
            value={searchQuery}
            onChange={(e) => handleSearchChange(e.target.value)}
            className="w-full py-2.5 px-4 rounded-xl bg-tech-card border border-tech-border text-gray-100 placeholder-tech-muted focus:outline-none focus:ring-2 focus:ring-tech-accent focus:border-transparent transition-colors"
          />
        </label>
        <label className="sm:w-56">
          <span className="sr-only">Filtrer par catégorie</span>
          <select
            value={categoryFilter}
            onChange={(e) => handleCategoryChange(e.target.value)}
            className="w-full py-2.5 px-4 rounded-xl bg-tech-card border border-tech-border text-gray-100 focus:outline-none focus:ring-2 focus:ring-tech-accent focus:border-transparent transition-colors appearance-none cursor-pointer"
            style={{ backgroundImage: `url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' fill='none' viewBox='0 0 24 24' stroke='%2364748b'%3E%3Cpath stroke-linecap='round' stroke-linejoin='round' stroke-width='2' d='M19 9l-7 7-7-7'%3E%3C/path%3E%3C/svg%3E")`, backgroundRepeat: 'no-repeat', backgroundPosition: 'right 0.75rem center', backgroundSize: '1.25rem', paddingRight: '2.5rem' }}
          >
            <option value="">Toutes les catégories</option>
            {categories.map((cat) => (
              <option key={cat.id} value={cat.id}>
                {cat.name}
              </option>
            ))}
          </select>
        </label>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
        {products.length === 0 ? (
          <p className="col-span-full text-center text-tech-muted py-12">
            {searchQuery || categoryFilter ? 'Aucun produit ne correspond à votre recherche.' : 'Aucun produit disponible.'}
          </p>
        ) : (
          products.map((product) => (
            <ProductCard
              key={product.id}
              product={product}
              onAddToCart={handleAddToCart}
            />
          ))
        )}
      </div>

      {/* Pagination : Précédent / Suivant */}
      {pagination.last_page > 1 && (
        <div className="mt-10 flex items-center justify-center gap-4">
          <button
            type="button"
            onClick={goToPrevPage}
            disabled={pagination.current_page <= 1}
            className="py-2.5 px-5 rounded-xl bg-tech-card border border-tech-border text-gray-300 font-medium hover:bg-tech-border hover:text-white disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:bg-tech-card disabled:hover:text-gray-300 transition-colors"
          >
            Précédent
          </button>
          <span className="text-tech-muted text-sm">
            Page {pagination.current_page} / {pagination.last_page}
            {pagination.total > 0 && ` (${pagination.total} produit${pagination.total > 1 ? 's' : ''})`}
          </span>
          <button
            type="button"
            onClick={goToNextPage}
            disabled={pagination.current_page >= pagination.last_page}
            className="py-2.5 px-5 rounded-xl bg-tech-card border border-tech-border text-gray-300 font-medium hover:bg-tech-border hover:text-white disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:bg-tech-card disabled:hover:text-gray-300 transition-colors"
          >
            Suivant
          </button>
        </div>
      )}
    </div>
  )
}
