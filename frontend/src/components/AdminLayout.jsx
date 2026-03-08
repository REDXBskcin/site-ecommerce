import { Link, Outlet } from 'react-router-dom'

const navItems = [
  { to: '/admin', label: 'Dashboard' },
  { to: '/admin/produits', label: 'Produits' },
  { to: '/admin/commandes', label: 'Commandes' },
  { to: '/admin/utilisateurs', label: 'Utilisateurs' },
]

export default function AdminLayout() {
  return (
    <div className="min-h-screen flex flex-col sm:flex-row bg-slate-100">
      <aside className="w-full sm:w-64 flex-shrink-0 bg-white border-b sm:border-b-0 sm:border-r border-slate-200 shadow-sm">
        <div className="p-4 sm:p-5 border-b border-slate-200">
          <h2 className="text-lg font-bold text-slate-900"><span className="text-primary">Admin</span></h2>
        </div>
        <nav className="p-4 flex sm:flex-col gap-1 overflow-x-auto sm:overflow-visible">
          {navItems.map(({ to, label }) => (
            <Link key={to} to={to} className="block py-2.5 px-3 rounded-lg text-slate-600 hover:bg-slate-100 hover:text-primary font-medium transition-colors duration-150 whitespace-nowrap">
              {label}
            </Link>
          ))}
          <Link to="/" className="block py-2.5 px-3 rounded-lg text-slate-600 hover:bg-slate-100 hover:text-primary font-medium transition-colors duration-150 mt-4 sm:mt-6 whitespace-nowrap">
            ← Retour au site
          </Link>
        </nav>
      </aside>
      <main className="flex-1 overflow-auto p-4 sm:p-6 lg:p-8 min-h-0">
        <Outlet />
      </main>
    </div>
  )
}
