/**
 * Route protégée Admin – BTS SIO
 * Affiche l'Outlet si l'utilisateur est connecté ET is_admin.
 * Sinon, redirige vers l'accueil (/).
 */
import { Navigate, Outlet } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'

export default function AdminRoute() {
  const { user, loading } = useAuth()

  if (loading) {
    return (
      <div className="min-h-[70vh] flex items-center justify-center">
        <div className="w-10 h-10 border-2 border-tech-accent border-t-transparent rounded-full animate-spin" />
      </div>
    )
  }

  if (!user || !user.is_admin) {
    return <Navigate to="/" replace />
  }

  return <Outlet />
}
