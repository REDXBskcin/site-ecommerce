import { useState, useEffect } from 'react'
import api from '../services/api'

export default function AdminDashboard() {
  const [stats, setStats] = useState({ total_orders: 0, total_revenue: 0, total_users: 0, total_products: 0 })
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)

  useEffect(() => {
    api.get('/admin/stats')
      .then((res) => setStats(res.data))
      .catch((err) => setError(err.response?.data?.message || 'Erreur chargement stats'))
      .finally(() => setLoading(false))
  }, [])

  if (loading) {
    return (
      <div className="flex items-center justify-center py-20">
        <div className="w-10 h-10 border-2 border-primary border-t-transparent rounded-full animate-spin" />
      </div>
    )
  }

  if (error) {
    return (
      <div className="rounded-xl bg-red-50 border border-red-200 p-4 text-red-700">{error}</div>
    )
  }

  return (
    <div className="animate-fade-in">
      <h1 className="text-2xl font-bold text-slate-900 mb-6 sm:mb-8">Dashboard</h1>
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6">
        <div className="bg-white border border-slate-200 rounded-xl p-5 sm:p-6 shadow-card transition-shadow duration-150">
          <p className="text-slate-600 text-sm mb-1">Utilisateurs</p>
          <p className="text-3xl font-bold text-primary">{stats.total_users ?? 0}</p>
        </div>
        <div className="bg-white border border-slate-200 rounded-xl p-5 sm:p-6 shadow-card transition-shadow duration-150">
          <p className="text-slate-600 text-sm mb-1">Produits</p>
          <p className="text-3xl font-bold text-primary">{stats.total_products ?? 0}</p>
        </div>
        <div className="bg-white border border-slate-200 rounded-xl p-5 sm:p-6 shadow-card transition-shadow duration-150">
          <p className="text-slate-600 text-sm mb-1">Commandes</p>
          <p className="text-3xl font-bold text-primary">{stats.total_orders ?? 0}</p>
        </div>
        <div className="bg-white border border-slate-200 rounded-xl p-5 sm:p-6 shadow-card transition-shadow duration-150">
          <p className="text-slate-600 text-sm mb-1">Chiffre d'affaires</p>
          <p className="text-3xl font-bold text-primary">
            {(stats.total_revenue ?? 0).toLocaleString('fr-FR', { style: 'currency', currency: 'EUR' })}
          </p>
        </div>
      </div>
    </div>
  )
}
