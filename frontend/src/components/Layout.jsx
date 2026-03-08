/**
 * Layout principal – identique au template FoodMart (sauf contenu : tech).
 * Header 2 lignes : logo, recherche + catégories, support, panier | nav.
 */
import { useState, useEffect, useRef } from 'react'
import { Link, Outlet, useNavigate, useSearchParams } from 'react-router-dom'
import { useCart } from '../context/CartContext'
import { useAuth } from '../context/AuthContext'
import { useTheme } from '../context/ThemeContext'
import { getCategories } from '../services/api'
import toast from 'react-hot-toast'

export default function Layout() {
  const { itemCount, total } = useCart()
  const { user, logout } = useAuth()
  const { theme, toggleTheme } = useTheme()
  const navigate = useNavigate()
  const [searchParams] = useSearchParams()
  const [headerSearch, setHeaderSearch] = useState(() => searchParams.get('search') || '')
  const [categories, setCategories] = useState([])
  const [userMenuOpen, setUserMenuOpen] = useState(false)
  const userMenuRef = useRef(null)

  useEffect(() => {
    const handleClickOutside = (e) => {
      if (userMenuRef.current && !userMenuRef.current.contains(e.target)) setUserMenuOpen(false)
    }
    document.addEventListener('click', handleClickOutside)
    return () => document.removeEventListener('click', handleClickOutside)
  }, [])

  useEffect(() => {
    setHeaderSearch(searchParams.get('search') || '')
  }, [searchParams])

  useEffect(() => {
    getCategories()
      .then((data) => setCategories(Array.isArray(data) ? data : (data?.data ?? [])))
      .catch(() => setCategories([]))
  }, [])

  const handleHeaderSearch = (e) => {
    e.preventDefault()
    if (headerSearch.trim()) {
      navigate(`/?search=${encodeURIComponent(headerSearch.trim())}`)
    } else {
      navigate('/')
    }
  }

  const handleLogout = async () => {
    try {
      await logout()
      toast.success('Déconnexion réussie.')
      navigate('/')
    } catch {
      toast.error('Erreur lors de la déconnexion.')
    }
  }

  const cartTotal = typeof total === 'number' ? total.toFixed(2) : '0.00'

  return (
    <div className="min-h-screen flex flex-col font-sans bg-[#f5f5f5] dark:bg-tech-dark overflow-x-hidden">
      <header className="bg-white dark:bg-tech-card border-b border-[#EFEFEF] dark:border-tech-border sticky top-0 z-50 shadow-sm">
        <div className="max-w-template mx-auto px-4 sm:px-6 lg:px-8">
          {/* Ligne 1 – Navbar FoodMart : Logo | Search | For Support | User | Wishlist | Cart */}
          <div className="flex flex-wrap items-center gap-3 py-4">
            {/* Logo */}
            <div className="flex-shrink-0">
              <Link to="/" className="inline-flex items-center gap-2.5 hover:opacity-90 transition-opacity">
                <span className="flex items-center justify-center w-11 h-11 rounded-lg bg-template-primary/15 text-template-primary dark:bg-template-primary/25 dark:text-green-400" aria-hidden>
                  <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z" /></svg>
                </span>
                <span>
                  <span className="font-heading text-2xl font-bold text-template-primary dark:text-green-400 block leading-tight">TECH</span>
                  <span className="font-heading text-xs font-semibold text-[#787878] dark:text-gray-400 block leading-tight -mt-0.5">STORE</span>
                </span>
              </Link>
            </div>

            {/* Search – centre, comme FoodMart */}
            <div className="hidden lg:flex flex-1 max-w-2xl mx-4 min-w-0">
              <div className="w-full flex items-stretch rounded-xl border border-[#E0E0E0] dark:border-tech-border overflow-hidden bg-[#FAFAFA] dark:bg-gray-800/50">
                <select
                  className="w-36 lg:w-40 pl-4 pr-8 py-2.5 border-0 border-r border-[#E0E0E0] dark:border-tech-border bg-transparent text-[#222222] dark:text-gray-300 text-sm font-medium focus:ring-0 focus:outline-none cursor-pointer appearance-none bg-no-repeat bg-[length:14px] bg-[right_12px_center]"
                  style={{ backgroundImage: `url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' fill='none' viewBox='0 0 24 24' stroke='%23787878'%3E%3Cpath stroke-linecap='round' stroke-linejoin='round' stroke-width='2' d='M19 9l-7 7-7-7'%3E%3C/path%3E%3C/svg%3E")` }}
                  value=""
                  onChange={(e) => { const v = e.target.value; if (v) navigate(`/?category=${v}`); }}
                >
                  <option value="">Toutes les catégories</option>
                  {categories.map((cat) => (
                    <option key={cat.id} value={cat.id}>{cat.name}</option>
                  ))}
                </select>
                <form onSubmit={handleHeaderSearch} className="flex-1 flex min-w-0">
                  <input
                    type="search"
                    value={headerSearch}
                    onChange={(e) => setHeaderSearch(e.target.value)}
                    placeholder="Rechercher parmi nos produits"
                    className="flex-1 min-w-0 border-0 bg-transparent px-4 py-2.5 text-[#222222] dark:text-gray-100 placeholder-[#787878] focus:outline-none text-sm"
                  />
                  <button type="submit" className="px-4 text-[#222222] dark:text-gray-400 hover:text-[#FFC43F] transition-colors" aria-label="Search">
                    <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24"><path d="M21.71 20.29L18 16.61A9 9 0 1 0 16.61 18l3.68 3.68a1 1 0 0 0 1.42 0a1 1 0 0 0 0-1.39ZM11 18a7 7 0 1 1 7-7a7 7 0 0 1-7 7Z"/></svg>
                  </button>
                </form>
              </div>
            </div>

            {/* Droite : For Support | User | Heart | Cart (ordre FoodMart) */}
            <div className="flex items-center gap-2 sm:gap-4 ml-auto">
              <div className="hidden xl:block text-right pr-2 border-r border-[#EFEFEF] dark:border-tech-border">
                <span className="text-sm text-[#787878] dark:text-tech-muted block">Besoin d&apos;aide ?</span>
                <span className="font-heading font-bold text-[#222222] dark:text-white text-sm">+33 1 23 45 67 89</span>
              </div>
              <div className="relative" ref={userMenuRef}>
                <button
                  type="button"
                  onClick={() => setUserMenuOpen((o) => !o)}
                  className="flex items-center justify-center w-10 h-10 rounded-full bg-[#F1F1F1] dark:bg-tech-border text-[#222222] dark:text-gray-400 hover:bg-[#FFC43F] hover:text-[#222222] transition-colors"
                  title="Mon compte"
                  aria-label="Mon compte"
                  aria-expanded={userMenuOpen}
                >
                  <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24"><path d="M15.71 12.71a6 6 0 1 0-7.42 0a10 10 0 0 0-6.22 8.18a1 1 0 0 0 2 .22a8 8 0 0 1 15.9 0a1 1 0 0 0 1 .89h.11a1 1 0 0 0 .88-1.1a10 10 0 0 0-6.25-8.19ZM12 12a4 4 0 1 1 4-4a4 4 0 0 1-4 4Z"/></svg>
                </button>
                {userMenuOpen && (
                  <div className="absolute right-0 top-full mt-2 w-48 py-2 rounded-xl bg-white dark:bg-tech-card border border-[#EFEFEF] dark:border-tech-border shadow-lg z-[100]">
                    {user ? (
                      <>
                        <Link to="/mon-compte" className="block px-4 py-2 text-sm text-[#222222] dark:text-gray-200 hover:bg-[#FFC43F]/20 hover:text-[#222222] dark:hover:text-white" onClick={() => setUserMenuOpen(false)}>Mon compte</Link>
                        <Link to="/my-orders" className="block px-4 py-2 text-sm text-[#222222] dark:text-gray-200 hover:bg-[#FFC43F]/20 hover:text-[#222222] dark:hover:text-white" onClick={() => setUserMenuOpen(false)}>Mes commandes</Link>
                        {user.is_admin && <Link to="/admin" className="block px-4 py-2 text-sm text-[#222222] dark:text-gray-200 hover:bg-[#FFC43F]/20 hover:text-[#222222] dark:hover:text-white" onClick={() => setUserMenuOpen(false)}>Administration</Link>}
                        <button type="button" onClick={() => { setUserMenuOpen(false); handleLogout(); }} className="w-full text-left px-4 py-2 text-sm text-[#222222] dark:text-gray-200 hover:bg-[#FFC43F]/20">Déconnexion</button>
                      </>
                    ) : (
                      <>
                        <Link to="/login" className="block px-4 py-2 text-sm text-[#222222] dark:text-gray-200 hover:bg-[#FFC43F]/20 hover:text-[#222222] dark:hover:text-white" onClick={() => setUserMenuOpen(false)}>Connexion</Link>
                        <Link to="/register" className="block px-4 py-2 text-sm text-[#222222] dark:text-gray-200 hover:bg-[#FFC43F]/20 hover:text-[#222222] dark:hover:text-white" onClick={() => setUserMenuOpen(false)}>Inscription</Link>
                      </>
                    )}
                  </div>
                )}
              </div>
              <Link to="/liste-de-souhaits" className="flex items-center justify-center w-10 h-10 rounded-full bg-[#F1F1F1] dark:bg-tech-border text-[#222222] dark:text-gray-400 hover:bg-[#FFC43F] hover:text-[#222222] transition-colors" title="Liste de souhaits" aria-label="Liste de souhaits">
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z"/></svg>
              </Link>
              {/* Cart – icône + Your Cart + montant (comme FoodMart) */}
              <Link to="/panier" className="flex items-center gap-2 pl-2 sm:pl-3 border-l border-[#EFEFEF] dark:border-tech-border text-[#222222] dark:text-white hover:text-[#FFC43F] transition-colors">
                <span className="relative flex items-center justify-center w-10 h-10 rounded-full bg-[#F1F1F1] dark:bg-tech-border">
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 3h2l.4 2M7 13h10l4-8H5.4M7 13L5.4 5M7 13l-2.293 2.293c-.63.63-.184 1.707.707 1.707H17m0 0a2 2 0 100 4 2 2 0 000-4zm-8 2a2 2 0 11-4 0 2 2 0 014 0z"/></svg>
                  {itemCount > 0 && (
                    <span className="absolute -top-0.5 -right-0.5 min-w-[18px] h-[18px] flex items-center justify-center rounded-full bg-[#FFC43F] text-[#222222] text-xs font-bold">
                      {itemCount}
                    </span>
                  )}
                </span>
                <span className="hidden sm:block">
                  <span className="text-xs text-[#787878] dark:text-gray-400 block leading-tight">Votre panier</span>
                  <span className="font-heading font-bold text-sm">{itemCount > 0 ? `${cartTotal} €` : '0.00 €'}</span>
                </span>
              </Link>
              <button type="button" onClick={toggleTheme} className="flex items-center justify-center w-10 h-10 rounded-full bg-[#F1F1F1] dark:bg-tech-border text-[#222222] dark:text-gray-400 hover:bg-[#FFC43F] hover:text-[#222222] transition-colors" title="Theme" aria-label="Theme">
                {theme === 'dark' ? (
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 3v1m0 16v1m9-9h-1M4 12H3m15.364 6.364l-.707-.707M6.343 6.343l-.707-.707m12.728 0l-.707.707M6.343 17.657l-.707.707M16 12a4 4 0 11-8 0 4 4 0 018 0z" /></svg>
                ) : (
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M20.354 15.354A9 9 0 018.646 3.646 9.003 9.003 0 0012 21a9.003 9.003 0 008.354-5.646z" /></svg>
                )}
              </button>
            </div>
          </div>
        </div>
      </header>

      <main className="flex-1">
        <Outlet />
      </main>

      {/* Ligne avant footer : Free delivery, Secure payment, etc. (FoodMart) */}
      <section className="py-6 sm:py-8 bg-white dark:bg-tech-card border-t border-[#F7F7F7] dark:border-tech-border">
        <div className="max-w-template mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-4 sm:gap-6 text-center">
            <div>
              <div className="w-12 h-12 mx-auto mb-2 sm:mb-3 rounded-full bg-[#FFC43F]/25 flex items-center justify-center text-[#FFC43F]">
                <svg className="w-5 h-5 sm:w-6 sm:h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 8h14M5 8a2 2 0 110-4h14a2 2 0 110 4M5 8v10a2 2 0 002 2h10a2 2 0 002-2V8m-9 4h4" /></svg>
              </div>
              <h3 className="font-heading font-bold text-[#222222] dark:text-white text-xs sm:text-sm mb-1">Livraison gratuite</h3>
              <p className="text-template-muted dark:text-tech-muted text-xs leading-relaxed">Livraison offerte selon conditions.</p>
            </div>
            <div>
              <div className="w-12 h-12 mx-auto mb-2 sm:mb-3 rounded-full bg-[#FFC43F]/25 flex items-center justify-center text-[#FFC43F]">
                <svg className="w-5 h-5 sm:w-6 sm:h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" /></svg>
              </div>
              <h3 className="font-heading font-bold text-[#222222] dark:text-white text-xs sm:text-sm mb-1">Paiement sécurisé</h3>
              <p className="text-template-muted dark:text-tech-muted text-xs leading-relaxed">100 % sécurisé.</p>
            </div>
            <div>
              <div className="w-12 h-12 mx-auto mb-2 sm:mb-3 rounded-full bg-[#FFC43F]/25 flex items-center justify-center text-[#FFC43F]">
                <svg className="w-5 h-5 sm:w-6 sm:h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>
              </div>
              <h3 className="font-heading font-bold text-[#222222] dark:text-white text-xs sm:text-sm mb-1">Garantie qualité</h3>
              <p className="text-template-muted dark:text-tech-muted text-xs leading-relaxed">Produits garantis.</p>
            </div>
            <div>
              <div className="w-12 h-12 mx-auto mb-2 sm:mb-3 rounded-full bg-[#FFC43F]/25 flex items-center justify-center text-[#FFC43F]">
                <svg className="w-5 h-5 sm:w-6 sm:h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>
              </div>
              <h3 className="font-heading font-bold text-[#222222] dark:text-white text-xs sm:text-sm mb-1">Économies garanties</h3>
              <p className="text-template-muted dark:text-tech-muted text-xs leading-relaxed">Meilleurs prix.</p>
            </div>
            <div>
              <div className="w-12 h-12 mx-auto mb-2 sm:mb-3 rounded-full bg-[#FFC43F]/25 flex items-center justify-center text-[#FFC43F]">
                <svg className="w-5 h-5 sm:w-6 sm:h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>
              </div>
              <h3 className="font-heading font-bold text-[#222222] dark:text-white text-xs sm:text-sm mb-1">Offres du jour</h3>
              <p className="text-template-muted dark:text-tech-muted text-xs leading-relaxed">Offres quotidiennes.</p>
            </div>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="py-8 sm:py-10 bg-white dark:bg-tech-card border-t border-[#EFEFEF] dark:border-tech-border">
        <div className="max-w-template mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-6 sm:gap-8 mb-6 sm:mb-8">
            <div className="lg:col-span-1">
              <Link to="/" className="font-heading text-lg sm:text-xl font-bold text-[#222222] dark:text-white"><span className="text-template-primary dark:text-green-400">Tech</span> Store</Link>
              <p className="text-[#787878] dark:text-tech-muted text-sm mt-4 sm:mt-5 leading-relaxed">Votre boutique tech. Projet e-commerce BTS SIO.</p>
            </div>
            <div>
              <h5 className="font-heading font-bold text-[#222222] dark:text-white text-sm sm:text-base mb-3 sm:mb-4">Boutique</h5>
              <ul className="list-none space-y-2 text-sm">
                <li><Link to="/" className="text-[#787878] dark:text-tech-muted hover:text-[#FFC43F] transition-colors">Accueil</Link></li>
                <li><Link to="/panier" className="text-[#787878] dark:text-tech-muted hover:text-[#FFC43F] transition-colors">Panier</Link></li>
              </ul>
            </div>
            <div>
              <h5 className="font-heading font-bold text-[#222222] dark:text-white text-sm sm:text-base mb-3 sm:mb-4">Service client</h5>
              <ul className="list-none space-y-2 text-sm">
                <li><Link to="/login" className="text-[#787878] dark:text-tech-muted hover:text-[#FFC43F] transition-colors">Connexion</Link></li>
                <li><a href="mailto:support@techstore.fr" className="text-[#787878] dark:text-tech-muted hover:text-[#FFC43F] transition-colors">Contact</a></li>
              </ul>
            </div>
            <div>
              <h5 className="font-heading font-bold text-[#222222] dark:text-white text-sm sm:text-base mb-3 sm:mb-4">Contact</h5>
              <p className="text-[#787878] dark:text-tech-muted text-sm leading-relaxed">support@techstore.fr</p>
            </div>
            <div>
              <h5 className="font-heading font-bold text-[#222222] dark:text-white text-sm sm:text-base mb-3 sm:mb-4">Newsletter</h5>
              <p className="text-[#787878] dark:text-tech-muted text-sm mb-3 leading-relaxed">Inscrivez-vous pour recevoir nos offres.</p>
              <form className="flex gap-0 rounded-xl overflow-hidden border border-[#E0E0E0] dark:border-tech-border" onSubmit={(e) => e.preventDefault()}>
                <input type="email" placeholder="Votre email" className="flex-1 min-w-0 px-3 sm:px-4 py-2.5 bg-[#FAFAFA] dark:bg-tech-dark border-0 text-sm text-[#222222] dark:text-gray-100 placeholder-[#787878] focus:outline-none focus:ring-2 focus:ring-[#FFC43F] focus:ring-inset" />
                <button type="submit" className="px-4 sm:px-5 py-2.5 bg-[#222222] dark:bg-gray-700 text-white text-sm font-semibold hover:bg-[#FFC43F] hover:text-[#222222] transition-colors duration-200">S&apos;abonner</button>
              </form>
            </div>
          </div>
        </div>
      </footer>
      <div id="footer-bottom" className="py-3 sm:py-4 border-t border-[#EFEFEF] dark:border-tech-border bg-white dark:bg-tech-card">
        <div className="max-w-template mx-auto px-4 sm:px-6 lg:px-8 flex flex-col sm:flex-row justify-between items-center gap-2 text-sm text-[#787878] dark:text-tech-muted">
          <p className="m-0">© {new Date().getFullYear()} Tech Store. Tous droits réservés.</p>
          <p className="m-0 text-center sm:text-end">Template ThemeWagon – Tech Store</p>
        </div>
      </div>
    </div>
  )
}
