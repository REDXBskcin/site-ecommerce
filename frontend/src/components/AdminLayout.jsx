/**
 * Layout Administration – BTS SIO
 * Sidebar fixe à gauche (Dashboard, Produits, Commandes, Retour au site).
 * Zone de contenu principale à droite.
 */
import { Link, Outlet } from 'react-router-dom'

const navItems = [
  { to: '/admin', label: 'Dashboard' },
  { to: '/admin/produits', label: 'Produits' },
  { to: '/admin/commandes', label: 'Commandes' },
]

export default function AdminLayout() {
  return (
    <div className="min-h-screen flex bg-tech-dark">
      {/* Sidebar fixe */}
      <aside className="w-64 flex-shrink-0 border-r border-tech-border bg-tech-card">
        <div className="p-4 border-b border-tech-border">
          <h2 className="text-lg font-bold text-white">
            <span className="text-tech-accent">Admin</span>
          </h2>
        </div>
        <nav className="p-4 space-y-1">
          {navItems.map(({ to, label }) => (
            <Link
              key={to}
              to={to}
              className="block py-2.5 px-3 rounded-lg text-tech-muted hover:bg-tech-border hover:text-tech-accent transition-colors"
            >
              {label}
            </Link>
          ))}
          <Link
            to="/"
            className="block py-2.5 px-3 rounded-lg text-tech-muted hover:bg-tech-border hover:text-tech-accent transition-colors mt-6"
          >
            ← Retour au site
          </Link>
        </nav>
      </aside>

      {/* Zone de contenu principale */}
      <main className="flex-1 overflow-auto p-8">
        <Outlet />
      </main>
    </div>
  )
}
