/**
 * Dashboard Admin – BTS SIO
 * Affiche les statistiques : nombre de commandes, chiffre d'affaires.
 */
import { useState, useEffect } from 'react'
import api from '../services/api'

export default function AdminDashboard() {
  const [stats, setStats] = useState({ total_orders: 0, total_revenue: 0 })
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)

  useEffect(() => {
    api
      .get('/admin/stats')
      .then((res) => setStats(res.data))
      .catch((err) => setError(err.response?.data?.message || 'Erreur chargement stats'))
      .finally(() => setLoading(false))
  }, [])

  if (loading) {
    return (
      <div className="flex items-center justify-center py-20">
        <div className="w-10 h-10 border-2 border-tech-accent border-t-transparent rounded-full animate-spin" />
      </div>
    )
  }

  if (error) {
    return (
      <div className="rounded-xl bg-red-500/10 border border-red-500/30 p-4 text-red-400">
        {error}
      </div>
    )
  }

  return (
    <div>
      <h1 className="text-2xl font-bold text-white mb-8">Dashboard</h1>
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
        <div className="bg-tech-card border border-tech-border rounded-2xl p-6 shadow-card">
          <p className="text-tech-muted text-sm mb-1">Nombre total de commandes</p>
          <p className="text-3xl font-bold text-tech-accent">{stats.total_orders}</p>
        </div>
        <div className="bg-tech-card border border-tech-border rounded-2xl p-6 shadow-card">
          <p className="text-tech-muted text-sm mb-1">Chiffre d'affaires</p>
          <p className="text-3xl font-bold text-tech-accent">
            {stats.total_revenue.toLocaleString('fr-FR', {
              style: 'currency',
              currency: 'EUR',
            })}
          </p>
        </div>
      </div>
    </div>
  )
}
