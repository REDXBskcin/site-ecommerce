import { useState, useEffect, useRef } from 'react'
import { Link } from 'react-router-dom'
import { getProducts, getCategories, getProductImageUrl } from '../services/api'
import { useCart } from '../context/CartContext'
import ProductCard from '../components/ProductCard'

function ProductCardSkeleton() {
  return (
    <article className="bg-slate-50 dark:bg-slate-800 border border-slate-300 dark:border-slate-700 rounded-xl overflow-hidden shadow-card flex flex-col h-full">
      <div className="aspect-[4/3] bg-slate-100 dark:bg-slate-700" />
      <div className="p-4 flex flex-col flex-1">
        <div className="h-3 w-16 bg-slate-200 dark:bg-slate-600 rounded mb-3" />
        <div className="h-5 bg-slate-200 dark:bg-slate-600 rounded w-3/4 mb-2" />
        <div className="h-5 bg-slate-200 dark:bg-slate-600 rounded w-1/2 mb-4 flex-1" />
        <div className="h-6 bg-slate-200 dark:bg-slate-600 rounded w-20 mb-3" />
        <div className="h-12 bg-slate-200 dark:bg-slate-600 rounded-lg w-full" />
      </div>
    </article>
  )
}

export default function Home() {
  const [products, setProducts] = useState([])
  const [categories, setCategories] = useState([])
  const [page, setPage] = useState(1)
  const [lastPage, setLastPage] = useState(1)
  const [total, setTotal] = useState(0)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)
  const [search, setSearch] = useState('')
  const [categorie, setCategorie] = useState('')
  const productsSectionRef = useRef(null)
  const { addToCart } = useCart()

  useEffect(() => {
    getCategories()
      .then((data) => setCategories(Array.isArray(data) ? data : []))
      .catch(() => setCategories([]))
  }, [])

  useEffect(() => {
    setLoading(true)
    setError(null)
    getProducts(page, { search: search || undefined, category_id: categorie || undefined })
      .then((res) => {
        setProducts(Array.isArray(res.data) ? res.data : [])
        setLastPage(res.meta?.last_page ?? 1)
        setTotal(res.meta?.total ?? 0)
      })
      .catch((err) => {
        setError(err.response ? `Erreur serveur (${err.response.status}).` : 'Impossible de joindre l\'API.')
        setProducts([])
        setLastPage(1)
        setTotal(0)
      })
      .finally(() => setLoading(false))
  }, [page, search, categorie])

  function goToPage(p) {
    if (p >= 1 && p <= lastPage) setPage(p)
  }

  function retry() {
    setError(null)
    setLoading(true)
    getProducts(page, { search: search || undefined, category_id: categorie || undefined })
      .then((res) => {
        setProducts(Array.isArray(res.data) ? res.data : [])
        setLastPage(res.meta?.last_page ?? 1)
        setTotal(res.meta?.total ?? 0)
      })
      .catch((err) => setError(err.response ? `Erreur (${err.response.status}).` : 'Impossible de joindre l\'API.'))
      .finally(() => setLoading(false))
  }

  function scrollToProducts() {
    productsSectionRef.current?.scrollIntoView({ behavior: 'smooth', block: 'start' })
  }

  const showHero = !error
  const showSkeletons = loading && products.length === 0
  const showEmpty = !loading && !error && products.length === 0
  const hasFilters = !!search || !!categorie

  if (error) {
    return (
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16 flex flex-col justify-center items-center min-h-[50vh]">
        <div className="bg-slate-50 dark:bg-slate-800 border border-slate-300 dark:border-slate-700 rounded-2xl p-6 sm:p-8 max-w-md text-center shadow-card animate-fade-in">
          <div className="w-14 h-14 mx-auto mb-4 rounded-full bg-red-100 dark:bg-red-900/30 flex items-center justify-center">
            <svg className="w-7 h-7 text-red-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
          </div>
          <p className="text-red-600 font-semibold mb-2">Erreur de chargement</p>
          <p className="text-slate-600 dark:text-slate-400 text-sm mb-6">{error}</p>
          <button
            type="button"
            onClick={retry}
            className="w-full sm:w-auto py-3 px-6 rounded-xl bg-primary text-white font-medium hover:bg-primary-hover transition-colors duration-200 touch-target"
          >
            Réessayer
          </button>
        </div>
      </div>
    )
  }

  return (
    <div className="animate-fade-in">
      {showHero && (
        <section className="relative overflow-hidden bg-gradient-to-br from-slate-900 via-slate-800 to-primary/90 text-white">
          <div className="absolute inset-0 bg-[url('data:image/svg+xml,%3Csvg width=\'60\' height=\'60\' viewBox=\'0 0 60 60\' xmlns=\'http://www.w3.org/2000/svg\'%3E%3Cg fill=\'none\' fill-rule=\'evenodd\'%3E%3Cg fill=\'%23ffffff\' fill-opacity=\'0.03\'%3E%3Cpath d=\'M36 34v-4h-2v4h-4v2h4v4h2v-4h4v-2h-4zm0-30V0h-2v4h-4v2h4v4h2V6h4V4h-4zM6 34v-4H4v4H0v2h4v4h2v-4h4v-2H6zM6 4V0H4v4H0v2h4v4h2V6h4V4H6z\'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E')] opacity-80" aria-hidden />
          <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16 sm:py-20 lg:py-24">
            <div className="max-w-2xl">
              <h1 className="text-3xl sm:text-4xl lg:text-5xl font-bold tracking-tight">
                Bienvenue sur <span className="text-primary-light">Tech Store</span>
              </h1>
              <p className="mt-4 sm:mt-5 text-lg sm:text-xl text-slate-200 leading-relaxed">
                Découvrez notre sélection de produits tech. Qualité, prix justes et livraison rapide.
              </p>
              <div className="mt-8 flex flex-wrap gap-4">
                <button
                  type="button"
                  onClick={scrollToProducts}
                  className="inline-flex items-center gap-2 py-3.5 px-6 rounded-xl bg-white text-slate-900 font-semibold hover:bg-slate-100 active:scale-[0.98] transition-all duration-200 shadow-lg touch-target"
                >
                  Découvrir les produits
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 14l-7 7m0 0l-7-7m7 7V3" />
                  </svg>
                </button>
                <Link
                  to="/panier"
                  className="inline-flex items-center gap-2 py-3.5 px-6 rounded-xl border-2 border-white/50 text-white font-semibold hover:bg-white/10 transition-colors duration-200 touch-target"
                >
                  Voir le panier
                </Link>
              </div>
            </div>
          </div>
        </section>
      )}

      <div className="bg-slate-200/60 dark:bg-slate-800/60 border-b border-slate-300 dark:border-slate-700">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <div className="flex flex-wrap items-center justify-center gap-6 sm:gap-10 text-sm text-slate-700 dark:text-slate-300">
            <span className="flex items-center gap-2 opacity-0 animate-slide-up-sm" style={{ animationDelay: '0.1s', animationFillMode: 'forwards' }}>
              <span className="flex h-8 w-8 items-center justify-center rounded-full bg-green-100 dark:bg-green-900/30 text-green-600">
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" /></svg>
              </span>
              Livraison rapide
            </span>
            <span className="flex items-center gap-2 opacity-0 animate-slide-up-sm" style={{ animationDelay: '0.2s', animationFillMode: 'forwards' }}>
              <span className="flex h-8 w-8 items-center justify-center rounded-full bg-primary/10 dark:bg-primary/20 text-primary">
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" /></svg>
              </span>
              Paiement sécurisé
            </span>
            <span className="flex items-center gap-2 opacity-0 animate-slide-up-sm" style={{ animationDelay: '0.3s', animationFillMode: 'forwards' }}>
              <span className="flex h-8 w-8 items-center justify-center rounded-full bg-amber-100 dark:bg-amber-900/30 text-amber-600">
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M18.364 5.636l-3.536 3.536m0 5.656l3.536 3.536M9.172 9.172L5.636 5.636m3.536 9.192l-3.536 3.536M21 12a9 9 0 11-18 0 9 9 0 0118 0zm-5 0a4 4 0 11-8 0 4 4 0 018 0z" /></svg>
              </span>
              Service client
            </span>
          </div>
        </div>
      </div>

      {/* ── UNIVERS POPULAIRES ── */}
      {categories.length > 0 && (
        <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-10">
          <div className="flex items-baseline gap-3 mb-5">
            <h2 className="text-lg font-bold text-slate-900 dark:text-white uppercase tracking-wider">Univers populaires</h2>
            <span className="text-sm text-slate-400 dark:text-slate-500">Tout ce que vous aimez est là</span>
          </div>
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-3 sm:gap-4">
            {categories.map((cat, i) => {
              const palettes = [
                { dot: 'bg-blue-500',    icon: 'text-blue-500',    ring: 'bg-blue-50 dark:bg-blue-900/30'       },
                { dot: 'bg-violet-500',  icon: 'text-violet-500',  ring: 'bg-violet-50 dark:bg-violet-900/30'   },
                { dot: 'bg-cyan-500',    icon: 'text-cyan-500',    ring: 'bg-cyan-50 dark:bg-cyan-900/30'       },
                { dot: 'bg-emerald-500', icon: 'text-emerald-500', ring: 'bg-emerald-50 dark:bg-emerald-900/30' },
                { dot: 'bg-rose-500',    icon: 'text-rose-500',    ring: 'bg-rose-50 dark:bg-rose-900/30'       },
                { dot: 'bg-amber-500',   icon: 'text-amber-500',   ring: 'bg-amber-50 dark:bg-amber-900/30'     },
                { dot: 'bg-indigo-500',  icon: 'text-indigo-500',  ring: 'bg-indigo-50 dark:bg-indigo-900/30'  },
                { dot: 'bg-teal-500',    icon: 'text-teal-500',    ring: 'bg-teal-50 dark:bg-teal-900/30'       },
              ]
              const { icon, ring } = palettes[i % palettes.length]
              return (
                <button
                  key={cat.id}
                  type="button"
                  onClick={() => { setCategorie(String(cat.id)); setPage(1); scrollToProducts() }}
                  className="group flex items-center gap-3 bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl p-4 sm:p-5 text-left shadow-sm hover:shadow-md hover:-translate-y-0.5 hover:border-slate-300 dark:hover:border-slate-500 active:scale-[0.98] transition-all duration-200 animate-slide-up"
                  style={{ animationDelay: `${i * 50}ms` }}
                >
                  <span className={`flex-shrink-0 flex h-10 w-10 items-center justify-center rounded-xl ${ring} ${icon} transition-transform duration-200 group-hover:scale-110`}>
                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.75} d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4" />
                    </svg>
                  </span>
                  <div className="min-w-0">
                    <p className="font-semibold text-slate-900 dark:text-white text-sm sm:text-base leading-tight truncate">{cat.name}</p>
                    <p className="text-xs text-slate-400 dark:text-slate-500 mt-0.5 font-medium">Voir les produits →</p>
                  </div>
                </button>
              )
            })}
          </div>
        </section>
      )}

      {/* ── NOUVEAUTÉS ── */}
      {!loading && products.length > 0 && (
        <section className="bg-white dark:bg-slate-800/40 border-y border-slate-200 dark:border-slate-700 py-8 sm:py-10">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="flex items-center justify-between mb-5">
              <div className="flex items-baseline gap-3">
                <h2 className="text-lg font-bold text-slate-900 dark:text-white uppercase tracking-wider">Nouveautés</h2>
                <span className="text-sm text-slate-400 dark:text-slate-500">Ce qu'il y a de neuf ici !</span>
              </div>
              <button
                type="button"
                onClick={scrollToProducts}
                className="text-sm font-semibold text-primary hover:text-primary-hover transition-colors uppercase tracking-wide"
              >
                Voir tout →
              </button>
            </div>
            <div className="flex overflow-x-auto gap-3 sm:gap-4 pb-3 -mx-4 px-4" style={{ scrollbarWidth: 'thin' }}>
              {[...products].sort((a, b) => new Date(b.created_at) - new Date(a.created_at)).slice(0, 10).map((product) => {
                const imgSrc = getProductImageUrl(product)
                const prix = typeof product.price === 'number' ? product.price.toFixed(2) : product.price
                return (
                  <Link
                    key={product.id}
                    to={`/product/${product.id}`}
                    className="flex-shrink-0 w-36 sm:w-44 group"
                  >
                    <div className="w-full aspect-square bg-slate-50 dark:bg-slate-700 border border-slate-200 dark:border-slate-600 rounded-xl overflow-hidden flex items-center justify-center mb-2 group-hover:border-primary/40 group-hover:shadow-md transition-all duration-200">
                      {imgSrc ? (
                        <img src={imgSrc} alt="" className="w-full h-full object-contain p-3 group-hover:scale-105 transition-transform duration-200" />
                      ) : (
                        <svg className="w-10 h-10 text-slate-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4" />
                        </svg>
                      )}
                    </div>
                    <p className="text-sm text-slate-900 dark:text-white font-semibold line-clamp-2 leading-snug">{product.name}</p>
                    <p className="text-primary font-bold text-base mt-1">{prix} €</p>
                  </Link>
                )
              })}
            </div>
          </div>
        </section>
      )}

      {/* ── BANNIÈRES PROMO ── */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-10">
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4">
          <button type="button" onClick={scrollToProducts} className="rounded-xl bg-orange-500 hover:bg-orange-600 p-5 sm:p-6 text-white text-left transition-all duration-200 hover:scale-[1.02] hover:shadow-[0_8px_32px_rgba(0,0,0,0.10)] active:scale-[0.98] flex flex-col justify-end min-h-[120px] sm:min-h-[140px]">
            <p className="text-xs font-medium opacity-80 uppercase tracking-wide">Les</p>
            <p className="text-xl sm:text-2xl font-extrabold leading-tight">Bons<br/>plans</p>
            <p className="text-xs sm:text-sm opacity-80 mt-0.5">des marques</p>
          </button>
          <button type="button" onClick={scrollToProducts} className="rounded-xl bg-gradient-to-br from-violet-600 to-blue-700 hover:from-violet-700 hover:to-blue-800 p-5 sm:p-6 text-white text-left transition-all duration-200 hover:scale-[1.02] hover:shadow-[0_8px_32px_rgba(0,0,0,0.10)] active:scale-[0.98] flex flex-col justify-end min-h-[120px] sm:min-h-[140px]">
            <p className="text-xl sm:text-2xl font-extrabold leading-tight">TECH<br/>IT EASY</p>
            <p className="text-xs sm:text-sm opacity-80 mt-0.5">Les bons prix</p>
          </button>
          <button type="button" onClick={scrollToProducts} className="rounded-xl bg-yellow-400 hover:bg-yellow-500 p-5 sm:p-6 text-slate-900 text-left transition-all duration-200 hover:scale-[1.02] hover:shadow-[0_8px_32px_rgba(0,0,0,0.10)] active:scale-[0.98] flex flex-col justify-end min-h-[120px] sm:min-h-[140px]">
            <p className="text-xs font-bold uppercase tracking-wide opacity-60">Le coin</p>
            <p className="text-xl sm:text-2xl font-extrabold leading-tight">% DES<br/>AFFAIRES</p>
            <p className="text-xs opacity-60 mt-0.5">Occasions &amp; fins de série</p>
          </button>
          <button type="button" onClick={scrollToProducts} className="rounded-xl bg-gradient-to-br from-slate-800 to-slate-900 hover:from-slate-700 hover:to-slate-800 p-5 sm:p-6 text-white text-left transition-all duration-200 hover:scale-[1.02] hover:shadow-[0_8px_32px_rgba(0,0,0,0.10)] active:scale-[0.98] flex flex-col justify-end min-h-[120px] sm:min-h-[140px]">
            <p className="text-xs font-medium opacity-70 uppercase tracking-wide">Découvrez</p>
            <p className="text-xl sm:text-2xl font-extrabold leading-tight">NOS<br/>MARQUES</p>
            <p className="text-xs sm:text-sm opacity-70 mt-0.5">Produits sélectionnés</p>
          </button>
        </div>
      </section>

      <section id="produits" ref={productsSectionRef} className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-12">
        <div className="flex flex-col sm:flex-row sm:items-end sm:justify-between gap-4 mb-6 sm:mb-8">
          <div>
            <h2 className="text-2xl sm:text-3xl font-bold text-slate-900 dark:text-white">Nos produits</h2>
            <p className="text-slate-600 dark:text-slate-400 text-sm mt-1">
              {total > 0
                ? `${total} produit${total > 1 ? 's' : ''}`
                : 'Trouvez le produit qui vous correspond.'}
            </p>
          </div>
        </div>

        <div className="mb-8">
          <div className="flex flex-col gap-4">
            <div className="relative">
              <span className="pointer-events-none absolute left-4 top-1/2 -translate-y-1/2 text-slate-400">
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                </svg>
              </span>
              <input
                type="search"
                placeholder="Rechercher un produit..."
                value={search}
                onChange={(e) => { setSearch(e.target.value); setPage(1) }}
                className="w-full py-3 pl-12 pr-11 rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-300 dark:border-slate-600 text-slate-900 dark:text-white placeholder-slate-500 dark:placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-primary/50 focus:border-primary transition-all duration-200"
                aria-label="Rechercher un produit"
              />
              {search && (
                <button
                  type="button"
                  onClick={() => { setSearch(''); setPage(1) }}
                  className="absolute right-3 top-1/2 -translate-y-1/2 p-1.5 rounded-lg text-slate-400 dark:text-slate-500 hover:text-slate-600 dark:hover:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-700 transition-colors"
                  aria-label="Effacer la recherche"
                >
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" /></svg>
                </button>
              )}
            </div>

            <div>
              <p className="text-sm font-medium text-slate-600 dark:text-slate-400 mb-2">Catégorie</p>
              <div className="flex flex-wrap gap-2">
                <button
                  type="button"
                  onClick={() => { setCategorie(''); setPage(1) }}
                  className={`px-4 py-2 rounded-xl text-sm font-medium transition-all duration-200 touch-target ${!categorie ? 'bg-primary text-white shadow-md' : 'bg-slate-200/80 dark:bg-slate-700 text-slate-700 dark:text-slate-300 hover:bg-slate-300 dark:hover:bg-slate-600'}`}
                >
                  Toutes
                </button>
                {categories.map((cat) => (
                  <button
                    key={cat.id}
                    type="button"
                    onClick={() => { setCategorie(String(cat.id)); setPage(1) }}
                    className={`px-4 py-2 rounded-xl text-sm font-medium transition-all duration-200 touch-target ${categorie === String(cat.id) ? 'bg-primary text-white shadow-md' : 'bg-slate-200/80 dark:bg-slate-700 text-slate-700 dark:text-slate-300 hover:bg-slate-300 dark:hover:bg-slate-600'}`}
                  >
                    {cat.name}
                  </button>
                ))}
              </div>
            </div>
          </div>
        </div>

        {showSkeletons ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4 sm:gap-6">
            {Array.from({ length: 8 }).map((_, i) => (
              <ProductCardSkeleton key={i} />
            ))}
          </div>
        ) : showEmpty ? (
          <div className="flex flex-col items-center justify-center py-16 sm:py-24 text-center bg-slate-50 dark:bg-slate-800 border border-slate-300 dark:border-slate-700 rounded-2xl shadow-card">
            <div className="w-20 h-20 rounded-2xl bg-slate-100 dark:bg-slate-700 flex items-center justify-center mb-5">
              <svg className="w-10 h-10 text-slate-400 dark:text-slate-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
              </svg>
            </div>
            <h3 className="text-lg font-semibold text-slate-900 dark:text-white mb-2">
              {hasFilters ? 'Aucun résultat' : 'Aucun produit pour le moment'}
            </h3>
            <p className="text-slate-600 dark:text-slate-400 text-sm max-w-sm mb-6">
              {hasFilters
                ? 'Essayez d\'autres mots-clés ou une autre catégorie.'
                : 'Revenez bientôt pour découvrir nos nouveautés.'}
            </p>
            {hasFilters && (
              <button
                type="button"
                onClick={() => { setSearch(''); setCategorie(''); setPage(1) }}
                className="py-3 px-6 rounded-xl bg-primary text-white font-semibold hover:bg-primary-hover transition-colors"
              >
                Réinitialiser les filtres
              </button>
            )}
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4 sm:gap-6">
            {products.map((product, index) => (
              <div
                key={product.id}
                className="animate-slide-up"
                style={{ animationDelay: `${index * 60}ms` }}
              >
                <ProductCard product={product} onAddToCart={addToCart} />
              </div>
            ))}
          </div>
        )}

        {lastPage > 1 && !showSkeletons && !showEmpty && (
          <nav className="mt-12 flex items-center justify-center gap-2 sm:gap-3 flex-wrap" aria-label="Pagination">
            <button
              type="button"
              onClick={() => goToPage(1)}
              disabled={page <= 1}
              className="p-2.5 rounded-xl border border-slate-200 dark:border-slate-700 text-slate-600 dark:text-slate-400 hover:bg-slate-50 dark:hover:bg-slate-800 disabled:opacity-40 disabled:cursor-not-allowed transition-colors touch-target"
              aria-label="Première page"
            >
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 19l-7-7 7-7m8 7l-7-7 7-7" /></svg>
            </button>
            <button
              type="button"
              onClick={() => goToPage(page - 1)}
              disabled={page <= 1}
              className="py-3 px-5 rounded-xl border border-slate-200 dark:border-slate-700 text-slate-700 dark:text-slate-300 font-medium hover:bg-slate-50 dark:hover:bg-slate-800 disabled:opacity-40 disabled:cursor-not-allowed transition-colors touch-target"
            >
              Précédent
            </button>
            <span className="text-slate-600 dark:text-slate-400 text-sm px-3 py-2" aria-current="page">
              Page {page} sur {lastPage}
              {total > 0 && ` (${total} produit${total > 1 ? 's' : ''})`}
            </span>
            <button
              type="button"
              onClick={() => goToPage(page + 1)}
              disabled={page >= lastPage}
              className="py-3 px-5 rounded-xl border border-slate-200 dark:border-slate-700 text-slate-700 dark:text-slate-300 font-medium hover:bg-slate-50 dark:hover:bg-slate-800 disabled:opacity-40 disabled:cursor-not-allowed transition-colors touch-target"
            >
              Suivant
            </button>
            <button
              type="button"
              onClick={() => goToPage(lastPage)}
              disabled={page >= lastPage}
              className="p-2.5 rounded-xl border border-slate-200 dark:border-slate-700 text-slate-600 dark:text-slate-400 hover:bg-slate-50 dark:hover:bg-slate-800 disabled:opacity-40 disabled:cursor-not-allowed transition-colors touch-target"
              aria-label="Dernière page"
            >
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 5l7 7-7 7M5 5l7 7-7 7" /></svg>
            </button>
          </nav>
        )}
      </section>
    </div>
  )
}
