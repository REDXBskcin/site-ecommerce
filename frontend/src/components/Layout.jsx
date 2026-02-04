/**
 * Layout principal – BTS SIO
 * En-tête : logo, Accueil, Panier, et selon l'auth : Connexion/Inscription ou Mon Compte + Déconnexion.
 */
import { Link, Outlet, useNavigate } from 'react-router-dom'
import { useCart } from '../context/CartContext'
import { useAuth } from '../context/AuthContext'
import toast from 'react-hot-toast'

export default function Layout({ children }) {
  const { itemCount } = useCart()
  const { user, logout } = useAuth()
  const navigate = useNavigate()

  const handleLogout = async () => {
    try {
      await logout()
      toast.success('Déconnexion réussie.')
      navigate('/')
    } catch {
      toast.error('Erreur lors de la déconnexion.')
    }
  }

  return (
    <div className="min-h-screen flex flex-col">
      <header className="border-b border-tech-border bg-tech-card/80 backdrop-blur-sm sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            <Link
              to="/"
              className="text-xl font-bold tracking-tight text-white hover:text-tech-accent transition-colors"
            >
              <span className="text-tech-accent">Tech</span> Store
            </Link>
            <nav className="flex items-center gap-4 sm:gap-6 text-sm text-tech-muted">
              <Link to="/" className="hover:text-tech-accent transition-colors">
                Accueil
              </Link>
              <Link
                to="/panier"
                className="flex items-center gap-1.5 hover:text-tech-accent transition-colors"
              >
                <span aria-hidden>🛒</span>
                Panier
                {itemCount > 0 && (
                  <span className="inline-flex items-center justify-center min-w-[1.25rem] h-5 px-1.5 rounded-full bg-tech-accent text-tech-dark text-xs font-semibold">
                    {itemCount}
                  </span>
                )}
              </Link>
              {user ? (
                <>
                  <Link to="/mon-compte" className="hover:text-tech-accent transition-colors">
                    Mon Compte
                  </Link>
                  <Link to="/my-orders" className="hover:text-tech-accent transition-colors">
                    Mes commandes
                  </Link>
                  {user.is_admin && (
                    <Link to="/admin" className="hover:text-tech-accent transition-colors">
                      Admin
                    </Link>
                  )}
                  <button
                    type="button"
                    onClick={handleLogout}
                    className="py-1.5 px-3 rounded-lg border border-tech-border hover:bg-tech-border hover:text-white transition-colors"
                  >
                    Déconnexion
                  </button>
                </>
              ) : (
                <>
                  <Link to="/login" className="hover:text-tech-accent transition-colors">
                    Connexion
                  </Link>
                  <Link
                    to="/register"
                    className="py-1.5 px-3 rounded-lg bg-tech-accent text-tech-dark font-medium hover:bg-tech-accent-hover transition-colors"
                  >
                    Inscription
                  </Link>
                </>
              )}
            </nav>
          </div>
        </div>
      </header>

      {/* Contenu principal */}
      <main className="flex-1">
        <Outlet />
      </main>

      {/* Pied de page minimal */}
      <footer className="border-t border-tech-border py-6 text-center text-tech-muted text-sm">
        Projet e-commerce BTS SIO – Tech Store
      </footer>
    </div>
  )
}
