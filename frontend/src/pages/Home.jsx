/**
 * Page d'accueil – BTS SIO
 * Affiche : bannière, catégories, grille de produits (API), newsletter.
 * Les ancres #products permettent de faire défiler vers la section produits.
 */
import { useState, useEffect, useCallback } from 'react'
import { useSearchParams, Link, useNavigate } from 'react-router-dom'
import { getProducts, getCategories } from '../services/api'
import { useCart } from '../context/CartContext'
import ProductCard from '../components/ProductCard'
import ProductCardSkeleton from '../components/ProductCardSkeleton'

// Icônes SVG pour chaque catégorie (on utilise index % 6 pour cycler)
const CATEGORY_ICONS = [
  (className) => <svg className={className} fill="none" stroke="currentColor" viewBox="0 0 24 24" aria-hidden><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9.75 17L9 20l-1 1h8l-1-1-.75-3M3 13h18M5 17h14a2 2 0 002-2V5a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" /></svg>,
  (className) => <svg className={className} fill="none" stroke="currentColor" viewBox="0 0 24 24" aria-hidden><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M12 18h.01M8 21h8a2 2 0 002-2V5a2 2 0 00-2-2H8a2 2 0 00-2 2v14a2 2 0 002 2z" /></svg>,
  (className) => <svg className={className} fill="none" stroke="currentColor" viewBox="0 0 24 24" aria-hidden><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9 19V6l12-3v13M9 19c0 1.105-1.343 2-3 2s-3-.895-3-2 1.343-2 3-2 3 .895 3 2zm12-3c0 1.105-1.343 2-3 2s-3-.895-3-2 1.343-2 3-2 3 .895 3 2zM9 10l12-3" /></svg>,
  (className) => <svg className={className} fill="none" stroke="currentColor" viewBox="0 0 24 24" aria-hidden><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M12 18h.01M7 21h10a2 2 0 002-2V5a2 2 0 00-2-2H7a2 2 0 00-2 2v14a2 2 0 002 2z" /></svg>,
  (className) => <svg className={className} fill="none" stroke="currentColor" viewBox="0 0 24 24" aria-hidden><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>,
  (className) => <svg className={className} fill="none" stroke="currentColor" viewBox="0 0 24 24" aria-hidden><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9 3v2m6-2v2M9 19v2m6-2v2M5 9H3m2 6H3m18-6h-2m2 6h-2M7 19h10a2 2 0 002-2V7a2 2 0 00-2-2H7a2 2 0 00-2 2v10a2 2 0 002 2zM9 9h6v6H9V9z" /></svg>,
]

// Composant qui affiche l'icône correspondant à l'index de la catégorie
function CategoryIcon({ index }) {
  const iconIndex = index % CATEGORY_ICONS.length
  const IconComponent = CATEGORY_ICONS[iconIndex]
  return IconComponent('w-8 h-8 text-[#FFC43F] mx-auto')
}

export default function Home() {
  // État local : produits, catégories, pagination, filtres, chargement
  const [searchParams] = useSearchParams()
  const [products, setProducts] = useState([])
  const [categories, setCategories] = useState([])
  const [pagination, setPagination] = useState({ current_page: 1, last_page: 1, total: 0 })
  const [page, setPage] = useState(1)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)
  const [searchQuery, setSearchQuery] = useState(() => searchParams.get('search') || '')
  const [categoryFilter, setCategoryFilter] = useState(() => searchParams.get('category') || '')
  const navigate = useNavigate()
  const { addToCart } = useCart()

  // Synchroniser les filtres avec l'URL quand elle change
  useEffect(() => {
    setSearchQuery(searchParams.get('search') || '')
    setCategoryFilter(searchParams.get('category') || '')
  }, [searchParams])

  // Charger les catégories au montage du composant
  const fetchCategories = useCallback(async () => {
    try {
      const data = await getCategories()
      if (Array.isArray(data)) {
        setCategories(data)
      } else {
        setCategories(data?.data ?? [])
      }
    } catch {
      setCategories([])
    }
  }, [])

  // Charger les produits (avec pagination et filtres)
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
      let message = 'Impossible de joindre l\'API. Vérifiez que Laravel est démarré (php artisan serve).'
      if (err.response) {
        message = `Erreur serveur (${err.response.status}).`
      }
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

  // Navigation pagination
  const goToPrevPage = () => {
    if (pagination.current_page > 1) {
      setPage((p) => p - 1)
    }
  }
  const goToNextPage = () => {
    if (pagination.current_page < pagination.last_page) {
      setPage((p) => p + 1)
    }
  }

  // Gestion des filtres
  const handleSearchChange = (value) => {
    setSearchQuery(value)
    setPage(1)
  }
  const handleCategoryChange = (value) => {
    setCategoryFilter(value)
    setPage(1)
    const params = new URLSearchParams(searchParams)
    if (value) {
      params.set('category', value)
    } else {
      params.delete('category')
    }
    navigate({ pathname: '/', search: params.toString() }, { replace: true })
  }

  const handleAddToCart = (product) => {
    addToCart(product)
  }

  if (error) {
    return (
      <div className="max-w-template mx-auto px-4 py-12 flex flex-col justify-center items-center min-h-[50vh]">
        <div className="card-page border-red-500/30 p-8 max-w-md text-center">
          <p className="text-red-500 dark:text-red-400 font-medium mb-2">Erreur de chargement</p>
          <p className="page-subtitle mb-6">{error}</p>
          <button type="button" onClick={() => fetchProducts(page, searchQuery, categoryFilter)} className="btn-primary">
            Réessayer
          </button>
        </div>
      </div>
    )
  }

  return (
    <>
      {/* Section banner */}
      <section className="py-6 sm:py-8 bg-[#f5f5f5] dark:bg-tech-dark overflow-hidden">
        <div className="max-w-template mx-auto px-4 sm:px-6 lg:px-8">
          <div className="banner-blocks">
            {/* Block 1 : FoodMart hero #e6f3fb */}
            <div className="banner-ad large banner-block-1 bg-foodmart-hero dark:bg-[#FFC43F]/10 rounded-xl overflow-hidden relative">
              <div className="flex flex-col lg:flex-row lg:items-center p-6 sm:p-8 lg:p-12 gap-6">
                <div className="flex-1">
                  <div className="banner-categories font-heading mb-3">100% Tech</div>
                  <h2 className="banner-title font-heading font-bold text-template-dark dark:text-white mb-3">
                    Tech & appareils connectés
                  </h2>
                  <p className="text-template-muted dark:text-gray-400 mb-4 text-sm sm:text-base max-w-xl">
                    Découvrez notre sélection. Recherchez, filtrez et ajoutez au panier en quelques clics.
                  </p>
                  <Link to="#products" className="inline-block px-5 py-2.5 rounded-xl border-2 border-[#222222] dark:border-white text-[#222222] dark:text-white font-semibold text-sm uppercase tracking-wide hover:bg-[#222222] dark:hover:bg-white hover:text-white dark:hover:text-gray-900 transition-colors duration-200">
                    Voir la boutique
                  </Link>
                </div>
                <div className="flex-shrink-0 flex items-center justify-center lg:w-1/3">
                  <div className="w-40 h-48 lg:w-52 lg:h-64 flex items-center justify-center bg-white/50 dark:bg-white/10 rounded-2xl shadow-template">
                    <svg className="w-24 h-24 lg:w-32 lg:h-32 text-[#FFC43F]" fill="none" stroke="currentColor" viewBox="0 0 24 24" aria-hidden><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9.75 17L9 20l-1 1h8l-1-1-.75-3M3 13h18M5 17h14a2 2 0 002-2V5a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" /></svg>
                  </div>
                </div>
              </div>
              <div className="absolute bottom-4 left-1/2 -translate-x-1/2 flex gap-2">
                <span className="w-2.5 h-2.5 rounded-full bg-[#FFC43F]" aria-hidden />
                <span className="w-2.5 h-2.5 rounded-full bg-[#FFC43F]/50" aria-hidden />
                <span className="w-2.5 h-2.5 rounded-full bg-[#FFC43F]/30" aria-hidden />
              </div>
            </div>
            {/* Block 2 – comme .banner-ad.bg-success-subtle */}
            <div className="banner-ad banner-block-2 bg-foodmart-card1 dark:bg-green-900/20 rounded-xl overflow-hidden flex items-center relative">
              <div className="p-6 sm:p-8 flex-1">
                <span className="inline-block px-2 py-0.5 rounded text-xs font-bold bg-[#FFC43F] text-[#222222] uppercase mb-2">SALE</span>
                <div className="banner-categories font-heading mb-1 text-[#2d5a27] dark:text-[#FFC43F]">20 % de réduction</div>
                <h3 className="font-heading font-bold text-[#222222] dark:text-white text-xl mb-2">Catégories tech</h3>
                <Link to="#products" className="inline-flex items-center gap-1 text-[#222222] dark:text-white font-semibold hover:text-[#FFC43F] transition-colors">
                  Voir la collection <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24"><path d="M17.92 11.62a1 1 0 0 0-.21-.33l-5-5a1 1 0 0 0-1.42 1.42l3.3 3.29H7a1 1 0 0 0 0 2h7.59l-3.3 3.29a1 1 0 0 0 0 1.42a1 1 0 0 0 1.42 0l5-5a1 1 0 0 0 .21-.33a1 1 0 0 0 0-.76Z"/></svg>
                </Link>
              </div>
            </div>
            {/* Block 3 – comme .banner-ad.bg-danger */}
            <div className="banner-ad banner-block-3 bg-foodmart-card2 dark:bg-rose-900/20 rounded-xl overflow-hidden flex items-center relative">
              <div className="p-6 sm:p-8 flex-1">
                <span className="inline-block px-2 py-0.5 rounded text-xs font-bold bg-[#FFC43F] text-[#222222] uppercase mb-2">SALE</span>
                <div className="banner-categories font-heading mb-1 text-[#2d5a27] dark:text-[#FFC43F]">15 % de réduction</div>
                <h3 className="font-heading font-bold text-[#222222] dark:text-white text-xl mb-2">Nos produits</h3>
                <Link to="#products" className="inline-flex items-center gap-1 text-[#222222] dark:text-white font-semibold hover:text-[#FFC43F] transition-colors">
                  Voir la collection <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24"><path d="M17.92 11.62a1 1 0 0 0-.21-.33l-5-5a1 1 0 0 0-1.42 1.42l3.3 3.29H7a1 1 0 0 0 0 2h7.59l-3.3 3.29a1 1 0 0 0 0 1.42a1 1 0 0 0 1.42 0l5-5a1 1 0 0 0 .21-.33a1 1 0 0 0 0-.76Z"/></svg>
                </Link>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Section Category – identique FoodMart (section-header + category carousel) */}
      <section className="py-6 sm:py-8 overflow-hidden">
        <div className="max-w-template mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-wrap justify-between items-center gap-4 mb-6 sm:mb-8">
            <h2 className="section-title">Catégories</h2>
            <div className="flex items-center gap-3 sm:gap-4">
              <a href="#products" className="btn-link-template hover:text-[#FFC43F] transition-colors no-underline">Voir toutes les catégories →</a>
              <div className="flex gap-2">
                <button type="button" onClick={() => document.getElementById('products')?.scrollIntoView({ behavior: 'smooth' })} className="swiper-btn" aria-label="Précédent">❮</button>
                <button type="button" onClick={() => document.getElementById('products')?.scrollIntoView({ behavior: 'smooth' })} className="swiper-btn" aria-label="Suivant">❯</button>
              </div>
            </div>
          </div>
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-4">
            {categories.length === 0 ? (
              <div className="col-span-full flex justify-center py-8 text-template-muted">Chargement des catégories…</div>
            ) : (
              categories.map((cat, index) => (
                <Link
                  key={cat.id}
                  to={`/?category=${cat.id}`}
                  className="category-item-template block no-underline h-full flex flex-col items-center text-center"
                >
                  <div className="w-16 h-16 mx-auto mb-4 rounded-xl bg-gray-100 dark:bg-tech-border flex items-center justify-center">
                    <CategoryIcon index={index} />
                  </div>
                  <h3 className="font-heading font-semibold text-lg text-template-dark dark:text-white mt-2">{cat.name}</h3>
                </Link>
              ))
            )}
          </div>
        </div>
      </section>

      {/* Section produits – style FoodMart (section-header + grille) */}
      <section id="products" className="py-6 sm:py-8 overflow-hidden">
        <div className="max-w-template mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-wrap justify-between items-center gap-4 mb-6 sm:mb-8">
            <h2 className="section-title">Produits tendance</h2>
            <div className="flex items-center gap-3 sm:gap-4">
              <a href="#products" className="btn-link-template hover:text-[#FFC43F] transition-colors no-underline hidden sm:inline">Tout voir →</a>
              <div className="flex gap-2">
                <button type="button" onClick={goToPrevPage} disabled={pagination.current_page <= 1} className="swiper-btn disabled:opacity-50 disabled:cursor-not-allowed" aria-label="Précédent">❮</button>
                <button type="button" onClick={goToNextPage} disabled={pagination.current_page >= pagination.last_page} className="swiper-btn disabled:opacity-50 disabled:cursor-not-allowed" aria-label="Suivant">❯</button>
              </div>
            </div>
          </div>

          {/* Filtres (recherche + catégorie) */}
          <div className="mb-6 flex flex-col sm:flex-row gap-4">
            <label className="flex-1 min-w-0">
              <span className="sr-only">Rechercher</span>
              <input
                type="search"
                placeholder="Rechercher un produit..."
                value={searchQuery}
                onChange={(e) => handleSearchChange(e.target.value)}
                className="w-full py-2.5 px-4 rounded-xl bg-white dark:bg-tech-card border border-[#EFEFEF] dark:border-tech-border text-[#222222] dark:text-gray-100 placeholder-[#787878] focus:outline-none focus:ring-2 focus:ring-[#FFC43F]"
              />
            </label>
            <label className="sm:w-56">
              <span className="sr-only">Catégorie</span>
              <select
                value={categoryFilter}
                onChange={(e) => handleCategoryChange(e.target.value)}
                className="w-full py-2.5 px-4 rounded-xl bg-white dark:bg-tech-card border border-[#EFEFEF] dark:border-tech-border text-[#222222] dark:text-gray-100 focus:outline-none focus:ring-2 focus:ring-[#FFC43F] appearance-none cursor-pointer bg-no-repeat bg-[length:1.25rem] bg-[right_0.75rem_center] pr-10"
                style={{ backgroundImage: `url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' fill='none' viewBox='0 0 24 24' stroke='%23787878'%3E%3Cpath stroke-linecap='round' stroke-linejoin='round' stroke-width='2' d='M19 9l-7 7-7-7'%3E%3C/path%3E%3C/svg%3E")` }}
              >
                <option value="">Toutes les catégories</option>
                {categories.map((cat) => (
                  <option key={cat.id} value={cat.id}>{cat.name}</option>
                ))}
              </select>
            </label>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6 items-stretch">
            {loading ? (
              Array.from({ length: 8 }, (_, i) => <ProductCardSkeleton key={`skeleton-${i}`} />)
            ) : products.length === 0 ? (
              <p className="col-span-full text-center text-[#787878] py-12">
                {searchQuery || categoryFilter ? 'Aucun produit ne correspond à votre recherche.' : 'Aucun produit disponible.'}
              </p>
            ) : (
              products.map((product, index) => (
                <div key={product.id} style={{ animation: 'slideUp 0.4s ease-out forwards', animationDelay: `${Math.min(index * 0.05, 0.35)}s`, opacity: 0 }}>
                  <ProductCard product={product} onAddToCart={handleAddToCart} />
                </div>
              ))
            )}
          </div>

          {pagination.last_page > 1 && (
            <div className="mt-10 flex items-center justify-center gap-4">
              <button type="button" onClick={goToPrevPage} disabled={pagination.current_page <= 1} className="btn-secondary disabled:opacity-50 disabled:cursor-not-allowed">
                Précédent
              </button>
              <span className="text-sm page-subtitle">
                Page {pagination.current_page} / {pagination.last_page}
                {pagination.total > 0 && ` (${pagination.total} produit${pagination.total > 1 ? 's' : ''})`}
              </span>
              <button type="button" onClick={goToNextPage} disabled={pagination.current_page >= pagination.last_page} className="btn-secondary disabled:opacity-50 disabled:cursor-not-allowed">
                Suivant
              </button>
            </div>
          )}
        </div>
      </section>

      {/* Bandeau newsletter */}
      <section className="py-8 sm:py-10 bg-foodmart-hero dark:bg-[#FFC43F]/10">
        <div className="max-w-template mx-auto px-4 sm:px-6 lg:px-8">
          <div className="max-w-2xl mx-auto text-center">
            <h2 className="section-title mb-3">-25 % sur votre première commande</h2>
            <p className="text-template-muted dark:text-gray-400 text-sm sm:text-base mb-6">
              Inscrivez-vous à notre newsletter pour recevoir nos offres et actualités.
            </p>
            <form onSubmit={(e) => e.preventDefault()} className="flex flex-col sm:flex-row gap-3 justify-center items-stretch sm:items-center">
              <input type="text" placeholder="Nom" className="px-4 py-2.5 rounded-xl border border-[#EFEFEF] dark:border-tech-border bg-white dark:bg-tech-card text-template-dark dark:text-gray-100 placeholder-template-muted focus:outline-none focus:ring-2 focus:ring-template-accent text-sm" />
              <input type="email" placeholder="Email" className="px-4 py-2.5 rounded-xl border border-[#EFEFEF] dark:border-tech-border bg-white dark:bg-tech-card text-template-dark dark:text-gray-100 placeholder-template-muted focus:outline-none focus:ring-2 focus:ring-template-accent text-sm" />
              <button type="submit" className="btn-primary px-6 py-2.5 text-sm uppercase tracking-wide">
                S&apos;abonner à la newsletter
              </button>
            </form>
            <p className="mt-2 text-xs text-template-muted dark:text-gray-500">Envoyer</p>
          </div>
        </div>
      </section>
    </>
  )
}
