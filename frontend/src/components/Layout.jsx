import { useState, useEffect, useRef } from 'react'
import { Link, Outlet, useNavigate } from 'react-router-dom'
import { useCart } from '../context/CartContext'
import { useAuth } from '../context/AuthContext'
import toast from 'react-hot-toast'

export default function Layout() {
  const { itemCount } = useCart()
  const { user, logout } = useAuth()
  const navigate = useNavigate()
  const [menuOpen, setMenuOpen] = useState(false)
  const [accountOpen, setAccountOpen] = useState(false)
  const accountRef = useRef(null)

  useEffect(() => {
    function handleClickOutside(e) {
      if (accountRef.current && !accountRef.current.contains(e.target)) {
        setAccountOpen(false)
      }
    }
    if (accountOpen) {
      document.addEventListener('click', handleClickOutside)
      return () => document.removeEventListener('click', handleClickOutside)
    }
  }, [accountOpen])

  function handleLogout() {
    logout()
      .then(() => {
        toast.success('Déconnexion réussie.')
        navigate('/')
        setMenuOpen(false)
        setAccountOpen(false)
      })
      .catch(() => toast.error('Erreur lors de la déconnexion.'))
  }

  function closeMenus() {
    setMenuOpen(false)
    setAccountOpen(false)
  }

  const linkClass = "block w-full py-3 px-4 text-left text-sm font-medium text-slate-700 hover:bg-primary-light hover:text-primary rounded-lg transition-colors duration-150"
  const linkClassDesktop = "px-3 py-2.5 text-sm font-medium text-slate-600 hover:text-primary hover:bg-primary-light rounded-lg transition-colors duration-150 min-h-[44px] flex items-center"

  const dropdownItem = "block w-full py-2.5 px-4 text-left text-sm text-slate-700 hover:bg-primary-light hover:text-primary rounded-lg transition-colors duration-150"

  return (
    <div className="min-h-screen flex flex-col bg-slate-100">
      <header className="sticky top-0 z-50 bg-slate-50/95 border-b border-slate-200 shadow-sm backdrop-blur-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-14 sm:h-16 gap-2">
            <Link to="/" className="flex items-center gap-2 text-lg sm:text-xl font-bold text-slate-900 hover:text-primary transition-colors shrink-0" onClick={closeMenus}>
              <span className="text-primary">Tech</span> Store
            </Link>

            <div className="flex items-center gap-1 sm:gap-2">
              <Link to="/panier" className={`flex items-center gap-2 ${linkClassDesktop} shrink-0`} onClick={closeMenus}>
                <svg className="w-5 h-5 shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24" aria-hidden>
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 3h2l.4 2M7 13h10l4-8H5.4M7 13L5.4 5M7 13l-2.293 2.293c-.63.63-.184 1.707.707 1.707H17m0 0a2 2 0 100 4 2 2 0 000-4zm-8 2a2 2 0 11-4 0 2 2 0 014 0z" />
                </svg>
                <span className="hidden sm:inline">Panier</span>
                {itemCount > 0 && (
                  <span key={itemCount} className="inline-flex items-center justify-center min-w-[1.25rem] h-5 px-1.5 rounded-full bg-primary text-white text-xs font-semibold animate-bounce-in">
                    {itemCount}
                  </span>
                )}
              </Link>

              <div className="relative" ref={accountRef}>
                <button
                  type="button"
                  onClick={(e) => { e.stopPropagation(); setAccountOpen((o) => !o) }}
                  className="p-2.5 rounded-lg text-slate-600 hover:bg-slate-100 hover:text-primary transition-colors duration-150 touch-target flex items-center justify-center"
                  aria-label="Menu compte"
                  aria-expanded={accountOpen}
                >
                  <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                  </svg>
                </button>

                {accountOpen && (
                  <div className="absolute right-0 top-full mt-1 w-56 py-2 bg-slate-50 border border-slate-300 rounded-xl shadow-lg animate-scale-in z-50" style={{ transformOrigin: 'top right' }}>
                    {user ? (
                      <>
                        <Link to="/mon-compte" className={dropdownItem} onClick={closeMenus}>Informations personnelles</Link>
                        <Link to="/my-orders" className={dropdownItem} onClick={closeMenus}>Commandes</Link>
                        {user.is_admin && <Link to="/admin" className={dropdownItem} onClick={closeMenus}>Admin</Link>}
                        <button type="button" onClick={handleLogout} className={`${dropdownItem} w-full text-left text-red-600 hover:bg-red-50 hover:text-red-700`}>
                          Déconnexion
                        </button>
                      </>
                    ) : (
                      <>
                        <Link to="/register" className={dropdownItem} onClick={closeMenus}>Créer un compte</Link>
                        <Link to="/login" className={dropdownItem} onClick={closeMenus}>Se connecter</Link>
                      </>
                    )}
                  </div>
                )}
              </div>

              <button
                type="button"
                onClick={() => setMenuOpen((o) => !o)}
                className="sm:hidden p-2 rounded-lg text-slate-600 hover:bg-slate-100 transition-colors touch-target flex items-center justify-center"
                aria-label={menuOpen ? 'Fermer le menu' : 'Ouvrir le menu'}
                aria-expanded={menuOpen}
              >
                {menuOpen ? (
                  <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                  </svg>
                ) : (
                  <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
                  </svg>
                )}
              </button>

              <nav className="hidden sm:flex items-center">
                {user
                  ? <Link to="/mon-compte" className={linkClassDesktop} onClick={closeMenus}>Mon Compte</Link>
                  : <Link to="/login" className={linkClassDesktop} onClick={closeMenus}>Connexion</Link>
                }
              </nav>
            </div>
          </div>

          {menuOpen && (
            <nav className="sm:hidden py-3 border-t border-slate-100 animate-slide-up-sm">
              {user
                ? <Link to="/mon-compte" className={linkClass} onClick={closeMenus}>Mon Compte</Link>
                : <Link to="/login" className={linkClass} onClick={closeMenus}>Connexion</Link>
              }
            </nav>
          )}
        </div>
      </header>

      <main className="flex-1 min-h-0">
        <Outlet />
      </main>

      <footer className="bg-slate-200/80 border-t border-slate-300 mt-auto">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 sm:py-12">
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8 sm:gap-10">
            <div>
              <p className="font-bold text-slate-900"><span className="text-primary">Tech</span> Store</p>
              <p className="mt-2 text-sm text-slate-600 leading-relaxed">Votre boutique high-tech. Produits de qualité, livraison rapide.</p>
            </div>
            <div>
              <h3 className="font-semibold text-slate-900 text-sm uppercase tracking-wider">Acheter</h3>
              <ul className="mt-3 space-y-2">
                <li><Link to="/" className="text-sm text-slate-600 hover:text-primary transition-colors duration-150">Tous les produits</Link></li>
                <li><Link to="/panier" className="text-sm text-slate-600 hover:text-primary transition-colors duration-150">Panier</Link></li>
              </ul>
            </div>
            <div>
              <h3 className="font-semibold text-slate-900 text-sm uppercase tracking-wider">Compte</h3>
              <ul className="mt-3 space-y-2">
                <li><Link to="/login" className="text-sm text-slate-600 hover:text-primary transition-colors duration-150">Se connecter</Link></li>
                <li><Link to="/register" className="text-sm text-slate-600 hover:text-primary transition-colors duration-150">Créer un compte</Link></li>
                <li><Link to="/my-orders" className="text-sm text-slate-600 hover:text-primary transition-colors duration-150">Mes commandes</Link></li>
              </ul>
            </div>
            <div>
              <h3 className="font-semibold text-slate-900 text-sm uppercase tracking-wider">Garanties</h3>
              <ul className="mt-3 space-y-2 text-sm text-slate-600">
                <li className="flex items-center gap-2"><span className="text-green-500">✓</span> Livraison rapide</li>
                <li className="flex items-center gap-2"><span className="text-green-500">✓</span> Paiement sécurisé</li>
                <li className="flex items-center gap-2"><span className="text-green-500">✓</span> Service client</li>
              </ul>
            </div>
          </div>
          <div className="mt-10 pt-6 border-t border-slate-200 text-center text-sm text-slate-500">
            © {new Date().getFullYear()} Tech Store – Projet e-commerce BTS SIO
          </div>
        </div>
      </footer>
    </div>
  )
}
