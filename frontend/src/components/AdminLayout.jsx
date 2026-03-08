/**
 * Layout Admin – BTS SIO
 * Menu latéral : Tableau de bord, Produits, Utilisateurs, Commandes.
 * Toggle clair/sombre comme sur le site public.
 */
import { Link, Outlet } from 'react-router-dom'
import { useTheme } from '../context/ThemeContext'

const navItems = [
  { to: '/admin', label: 'Tableau de bord' },
  { to: '/admin/produits', label: 'Produits' },
  { to: '/admin/utilisateurs', label: 'Utilisateurs' },
  { to: '/admin/commandes', label: 'Commandes' },
]

export default function AdminLayout() {
  const { theme, toggleTheme } = useTheme()

  return (
    <div className="min-h-screen flex bg-gray-100 dark:bg-tech-dark">
      <aside className="w-64 flex-shrink-0 border-r border-gray-200 dark:border-tech-border bg-white dark:bg-tech-card">
        <div className="p-4 border-b border-gray-200 dark:border-tech-border flex items-center justify-between">
          <h2 className="text-lg font-bold text-gray-900 dark:text-white">
            <span className="text-[#FFC43F]">Admin</span>
          </h2>
          <button
            type="button"
            onClick={toggleTheme}
            className="flex items-center justify-center w-9 h-9 rounded-lg bg-gray-100 dark:bg-tech-border text-gray-600 dark:text-gray-400 hover:bg-[#FFC43F] hover:text-[#222222] transition-colors"
            title={theme === 'dark' ? 'Mode clair' : 'Mode sombre'}
            aria-label={theme === 'dark' ? 'Mode clair' : 'Mode sombre'}
          >
            {theme === 'dark' ? (
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 3v1m0 16v1m9-9h-1M4 12H3m15.364 6.364l-.707-.707M6.343 6.343l-.707-.707m12.728 0l-.707.707M6.343 17.657l-.707.707M16 12a4 4 0 11-8 0 4 4 0 018 0z" /></svg>
            ) : (
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M20.354 15.354A9 9 0 018.646 3.646 9.003 9.003 0 0012 21a9.003 9.003 0 008.354-5.646z" /></svg>
            )}
          </button>
        </div>
        <nav className="p-4 space-y-1">
          {navItems.map((item) => (
            <Link
              key={item.to}
              to={item.to}
              className="block py-2.5 px-3 rounded-lg text-gray-600 dark:text-tech-muted hover:bg-gray-100 dark:hover:bg-tech-border hover:text-[#FFC43F] transition-colors"
            >
              {item.label}
            </Link>
          ))}
          <Link
            to="/"
            className="block py-2.5 px-3 rounded-lg text-gray-600 dark:text-tech-muted hover:bg-gray-100 dark:hover:bg-tech-border hover:text-[#FFC43F] transition-colors mt-6"
          >
            ← Retour au site
          </Link>
        </nav>
      </aside>
      <main className="flex-1 overflow-auto p-4 sm:p-6 lg:p-8">
        <Outlet />
      </main>
    </div>
  )
}
